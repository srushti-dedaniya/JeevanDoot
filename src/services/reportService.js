import { api, isMockMode } from './api';
import { sleep } from '../utils/helpers';
import { formatDateTime, titleCase } from './adapters';

const MOCK_REPORT = {
  title: 'Regional Health Impact Report - Oct 2023',
  resolutionRate: 92,
  patientsServed: '14.2k',
  sdgAlignment: 'High',
  conditionTrends: [
    { label: 'Malaria', value: 85 },
    { label: 'Fever', value: 40 },
    { label: 'Maternal', value: 65 },
    { label: 'Chronic', value: 25 },
    { label: 'Other', value: 55 },
  ],
  demographics: { elderly: 45, pediatric: 30, adult: 25 },
};

export const reportService = {
  async generate(config) {
    if (isMockMode()) {
      await sleep(1200);
      return { ...MOCK_REPORT, generatedOn: new Date().toISOString(), config };
    }

    const [reportsRes, patientsRes] = await Promise.all([
      api.get('/reports', { limit: 100 }),
      api.get('/patients', { limit: 1 }),
    ]);
    const reports = reportsRes.data || [];
    const totalPatients = patientsRes.meta?.total ?? 0;

    const typeLabels = { laboratory: 'Lab Reports', radiology: 'Radiology', pathology: 'Pathology', diagnostic: 'Diagnostics' };
    const byType = {};
    reports.forEach((r) => {
      const key = typeLabels[r.type] || 'Other';
      byType[key] = (byType[key] || 0) + 1;
    });
    const conditionTrends = Object.entries(byType).map(([label, value]) => ({ label, value }));
    const resolved = reports.filter((r) => r.impression).length;
    const resolutionRate = reports.length ? Math.round((resolved / reports.length) * 100) : 92;

    return {
      title: `Regional Health Impact Report - ${config?.region || 'All Regions'}`,
      resolutionRate,
      patientsServed: totalPatients.toLocaleString(),
      sdgAlignment: 'High',
      generatedOn: new Date().toISOString(),
      config,
      conditionTrends: conditionTrends.length
        ? conditionTrends
        : [{ label: 'Lab Reports', value: 40 }, { label: 'Diagnostics', value: 25 }],
      demographics: { elderly: 45, pediatric: 30, adult: 25 },
    };
  },

  async getAuditLogs() {
    if (isMockMode()) {
      await sleep(500);
      return [
        { timestamp: 'Oct 24, 2023 14:30:12', patientId: 'JD-9921', risk: 'Critical', handledBy: 'Dr. Sunita Kapoor', outcome: 'Resolved' },
        { timestamp: 'Oct 24, 2023 11:15:45', patientId: 'JD-8842', risk: 'High', handledBy: 'Dr. Rajesh Agarwal', outcome: 'Pending' },
        { timestamp: 'Oct 23, 2023 22:05:00', patientId: 'JD-1023', risk: 'Critical', handledBy: 'Dr. Vikas Patil', outcome: 'Transferred' },
        { timestamp: 'Oct 23, 2023 19:40:33', patientId: 'JD-7756', risk: 'High', handledBy: 'Dr. Meera Iyer', outcome: 'Resolved' },
      ];
    }
    const { data } = await api.get('/admin/audit');
    return (data || []).map((log) => ({
      timestamp: formatDateTime(log.createdAt),
      patientId: log.patient,
      risk: titleCase(log.severity),
      handledBy: log.actor,
      outcome: titleCase(log.type),
      summary: log.summary,
    }));
  },

  async exportCsv() {
    if (isMockMode()) {
      await sleep(400);
      return { success: true, filename: 'audit-log.csv' };
    }
    const { data } = await api.get('/reports/export');
    return { success: true, filename: 'audit-log.csv', rows: data || [] };
  },
};
