import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import KPIWidget from '../../components/charts/KPIWidget';
import LineChart from '../../components/charts/LineChart';
import PieChart from '../../components/charts/PieChart';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: 'dashboard', end: true },
    { label: 'Patient Queue', to: '/doctor/queue', icon: 'groups' },
    { label: 'Live Consultation', to: '/doctor/consultation', icon: 'call' },
    { label: 'Performance Analytics', to: '/doctor/performance', icon: 'query_stats' },
  ],
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [statsData, patientsData] = await Promise.all([
        doctorService.getDashboard(),
        patientService.getAll(),
      ]);
      setStats(statsData);
      setPatients(patientsData);
      setLoading(false);
    };
    load();
  }, []);

  const highRisk = patients.filter((p) => p.risk === 'Critical').slice(0, 4);

  const headerRight = (
    <>
      <button
        onClick={() => notify({ type: 'info', message: 'Surveillance updated: 3 new alerts' })}
        className="relative p-2 text-on-surface-variant hover:text-primary rounded-full transition-colors"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined">notifications</span>
        <span className="absolute top-1 right-1 w-3 h-3 bg-error rounded-full border-2 border-surface" />
      </button>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline font-bold">
          {user?.name?.replace('Dr. ', '').split(' ').map((n) => n[0]).join('') || 'D'}
        </div>
        <div>
          <p className="font-bold text-on-surface text-sm">{user?.name}</p>
          <p className="text-label-md text-on-surface-variant">General Physician</p>
        </div>
      </div>
    </>
  );

  if (loading) {
    return (
      <DashboardLayout sidebarProps={SIDEBAR} headerProps={{ title: 'Dashboard', subtitle: 'Overview', right: headerRight }}>
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: `Welcome back, ${user?.name ?? 'Doctor'}`, subtitle: 'Here is your overview for today', right: headerRight }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPIWidget label="Patients Today" value={stats.patientsToday} icon="people" color="primary" trend={12} />
        <KPIWidget label="Total Patients" value={stats.totalPatients.toLocaleString()} icon="group" color="secondary" trend={5} />
        <KPIWidget label="Urgent Cases" value={stats.urgentCases} icon="warning" color="error" trend={-3} />
        <KPIWidget label="Avg Response Time" value={stats.avgResponse} unit="" icon="timer" color="tertiary" trend={8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Consultation Trends"
          subtitle="This week"
          className="lg:col-span-2"
          headerRight={
            <select className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1.5 text-label-md">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          }
        >
          <LineChart labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} data={stats.consultations} height={280} />
        </Card>

        <Card title="Outcome Distribution" subtitle="Treatments resolved vs referred">
          <PieChart
            labels={['Resolved', 'Referred', 'Follow-up']}
            data={stats.outcomes}
            colors={['#1B5E4F', '#C8B900', '#E8734A']}
            height={220}
          />
          <div className="flex flex-col gap-3 mt-4">
            {['Resolved', 'Referred', 'Follow-up'].map((label, i) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: ['#1B5E4F', '#C8B900', '#E8734A'][i] }} />
                  <span className="text-label-md text-on-surface-variant">{label}</span>
                </div>
                <span className="font-bold text-on-surface">{stats.outcomes[i]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card
        title="Priority Patient Queue"
        subtitle="Patients needing attention"
        headerRight={
          <Link to="/doctor/queue">
            <Button variant="outline" size="sm">View Full Queue</Button>
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary text-on-primary">
                <th className="px-6 py-3 font-headline font-semibold">Patient ID</th>
                <th className="px-6 py-3 font-headline font-semibold">Name</th>
                <th className="px-6 py-3 font-headline font-semibold">Complaint</th>
                <th className="px-6 py-3 font-headline font-semibold">Status</th>
                <th className="px-6 py-3 font-headline font-semibold">Risk</th>
                <th className="px-6 py-3 font-headline font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.slice(0, 5).map((p) => (
                <tr key={p.id} className="border-b border-outline-variant hover:bg-surface-container-low">
                  <td className="px-6 py-3 font-mono font-semibold text-primary">{p.id}</td>
                  <td className="px-6 py-3 font-semibold">{p.name}</td>
                  <td className="px-6 py-3 text-on-surface-variant max-w-[260px] truncate">{p.complaint}</td>
                  <td className="px-6 py-3">
                    <Badge variant={p.status === 'Waiting' ? 'warning' : 'neutral'}>{p.status}</Badge>
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant={p.risk === 'Critical' ? 'critical' : p.risk === 'Moderate' ? 'warning' : 'success'}>{p.risk}</Badge>
                  </td>
                  <td className="px-6 py-3">
                    <Link to={`/doctor/case/${p.id}`}>
                      <Button size="sm">View Case</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {highRisk.length > 0 && (
        <div className="bg-error-container rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-3xl text-on-error-container">emergency</span>
            <div>
              <h4 className="font-headline font-bold text-on-error-container">High-Risk Alert</h4>
              <p className="text-sm text-on-error-container/80">
                {highRisk.length} critical patients require immediate attention.
              </p>
            </div>
          </div>
          <Link to="/doctor/queue">
            <Button variant="danger">Review Now</Button>
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
