import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import KPIWidget from '../../components/charts/KPIWidget';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import HeatMap from '../../components/charts/HeatMap';
import { doctorService } from '../../services/doctorService';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: 'dashboard', end: true },
    { label: 'Patient Queue', to: '/doctor/queue', icon: 'groups' },
    { label: 'Live Consultation', to: '/doctor/consultation', icon: 'call' },
    { label: 'Performance Analytics', to: '/doctor/performance', icon: 'query_stats' },
  ],
};

const HEATMAP_ROWS = [
  { label: 'General', values: [1, 2, 3, 2, 1, 0, 0] },
  { label: 'Prenatal', values: [0, 1, 2, 2, 3, 1, 0] },
  { label: 'Vaccination', values: [2, 2, 1, 0, 1, 3, 2] },
  { label: 'Chronic', values: [3, 2, 2, 1, 2, 1, 1] },
];

export default function DoctorPerformance() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await doctorService.getDashboard();
      setStats(data);
    };
    load();
  }, []);

  const achievements = [
    { label: '95% resolution rate', icon: 'verified', done: true },
    { label: '1300 patients served', icon: 'group', done: true },
    { label: 'Top 10% response time', icon: 'timer', done: true },
    { label: '100 virtual consults', icon: 'videocam', done: false },
  ];

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: 'Performance Analytics', subtitle: 'Your impact at a glance' }}
    >
      {!stats ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <KPIWidget label="Total Patients" value={stats.totalPatients.toLocaleString()} icon="group" color="primary" trend={8} />
            <KPIWidget label="Resolution Rate" value="92%" icon="verified" color="secondary" trend={3} />
            <KPIWidget label="Avg Consult Time" value="18m" icon="timer" color="tertiary" trend={-5} />
            <KPIWidget label="Patient Satisfaction" value="4.8/5" icon="star" color="error" trend={2} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Weekly Consultations" subtitle="Trend over the last week">
              <LineChart labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} data={stats.consultations} height={280} />
            </Card>
            <Card title="Consultations by Type" subtitle="Distribution across care types">
              <BarChart
                labels={['General', 'Prenatal', 'Vaccination', 'Chronic', 'Emergency']}
                data={[140, 95, 120, 80, 45]}
                colors={['#1B5E4F', '#E8734A', '#7C5800', '#00639B', '#BA1A1A']}
                height={280}
              />
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Service Coverage" subtitle="Visits by type per weekday" className="lg:col-span-2">
              <HeatMap rows={HEATMAP_ROWS} />
            </Card>
            <Card title="Achievements" icon="emoji_events" subtitle="This quarter">
              <div className="space-y-3">
                {achievements.map((a) => (
                  <div key={a.label} className="flex items-center gap-3 bg-surface-container-low rounded-lg p-3">
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        a.done ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-outline'
                      }`}
                    >
                      <span className="material-symbols-outlined">{a.icon}</span>
                    </span>
                    <p className={`flex-1 font-medium ${a.done ? 'text-on-surface' : 'text-on-surface-variant'}`}>{a.label}</p>
                    <Badge variant={a.done ? 'success' : 'neutral'}>{a.done ? 'Earned' : 'Pending'}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
