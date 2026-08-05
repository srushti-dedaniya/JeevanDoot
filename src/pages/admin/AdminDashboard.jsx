import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import KPIWidget from '../../components/charts/KPIWidget';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { doctorService } from '../../services/doctorService';
import { mapService } from '../../services/mapService';
import { reportService } from '../../services/reportService';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: 'dashboard', end: true },
    { label: 'Disease Surveillance', to: '/admin/surveillance', icon: 'public_health' },
    { label: 'Case-Level Analytics', to: '/admin/case-analytics', icon: 'analytics' },
    { label: 'Audit Log', to: '/admin/audit-log', icon: 'verified_user' },
    { label: 'Report Generation', to: '/admin/reports', icon: 'summarize' },
    { label: 'Doctor Management', to: '/admin/doctors', icon: 'medical_services' },
    { label: 'CHW Management', to: '/admin/chws', icon: 'volunteer_activism' },
    { label: 'Configuration', to: '/admin/settings', icon: 'settings' },
  ],
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [surveillance, setSurveillance] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, surv, audit] = await Promise.all([
        doctorService.getDashboard(),
        mapService.getSurveillance(),
        reportService.getAuditLogs(),
      ]);
      setStats(s);
      setSurveillance(surv);
      setAuditLogs(audit);
      setLoading(false);
    };
    load();
  }, []);

  const kpis = [
    { label: 'Total Consultations', value: '8,241', icon: 'monitoring', color: 'primary', trend: 12 },
    { label: 'Active Patients', value: '2,340', icon: 'group', color: 'secondary', trend: 6 },
    { label: 'Disease Outbreaks', value: surveillance?.activeOutbreaks ?? '—', icon: 'public_health', color: 'error', trend: -4 },
    { label: 'Resolution Rate', value: '94.2%', icon: 'verified', color: 'tertiary', trend: 2 },
  ];

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: 'Admin Dashboard', subtitle: 'District health overview' }}
    >
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {kpis.map((kpi) => (
              <KPIWidget key={kpi.label} {...kpi} value={String(kpi.value)} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Consultation Volume" subtitle="Last 7 days" className="lg:col-span-2">
              <LineChart labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} data={stats.consultations} height={280} />
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Case Distribution" subtitle="By risk category">
              <PieChart
                labels={['Low', 'Moderate', 'High', 'Critical']}
                data={[1200, 640, 210, 60]}
                colors={['#1B5E4F', '#7C5800', '#722000', '#BA1A1A']}
                height={220}
              />
            </Card>
            <Card title="Region Workload" subtitle="Cases per region">
              <BarChart
                labels={['Amroli', 'Palia', 'Devgram', 'Kanker', 'Bijapur']}
                data={[320, 280, 195, 240, 150]}
                colors={['#1B5E4F', '#00639B', '#7C5800', '#722000', '#E8734A']}
                height={220}
                horizontal
              />
            </Card>
            <Card title="Outbreaks" subtitle="Active clusters">
              <div className="space-y-3">
                {(surveillance?.regions ?? []).map((r) => (
                  <div key={r.name} className="flex items-center justify-between bg-surface-container-low rounded-lg p-3">
                    <div>
                      <p className="font-bold text-on-surface text-sm">{r.name}</p>
                      <p className="text-label-sm text-on-surface-variant">{r.disease} · Stage {r.stage}</p>
                    </div>
                    <Badge variant={r.stage >= 2 ? 'critical' : 'warning'}>{r.newCases} new</Badge>
                  </div>
                ))}
                <Link to="/admin/surveillance">
                  <Button variant="outline" fullWidth size="sm">View Surveillance</Button>
                </Link>
              </div>
            </Card>
          </div>

          <Card
            title="High-Risk Audit Trail"
            subtitle="Recent escalations"
            headerRight={
              <Link to="/admin/audit-log">
                <Button variant="outline" size="sm">View Full Log</Button>
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-primary text-on-primary">
                    <th className="px-6 py-3 font-headline font-semibold">Timestamp</th>
                    <th className="px-6 py-3 font-headline font-semibold">Patient ID</th>
                    <th className="px-6 py-3 font-headline font-semibold">Risk</th>
                    <th className="px-6 py-3 font-headline font-semibold">Handled By</th>
                    <th className="px-6 py-3 font-headline font-semibold">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, i) => (
                    <tr key={i} className="border-b border-outline-variant hover:bg-surface-container-low">
                      <td className="px-6 py-3 text-on-surface-variant">{log.timestamp}</td>
                      <td className="px-6 py-3 font-mono font-semibold text-primary">{log.patientId}</td>
                      <td className="px-6 py-3">
                        <Badge variant={log.risk === 'Critical' ? 'critical' : 'warning'}>{log.risk}</Badge>
                      </td>
                      <td className="px-6 py-3">{log.handledBy}</td>
                      <td className="px-6 py-3">
                        <Badge variant={log.outcome === 'Resolved' ? 'success' : log.outcome === 'Pending' ? 'warning' : 'secondary'}>
                          {log.outcome}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
