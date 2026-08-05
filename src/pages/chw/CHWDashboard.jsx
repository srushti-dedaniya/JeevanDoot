import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import KPIWidget from '../../components/charts/KPIWidget';
import LineChart from '../../components/charts/LineChart';
import { useAuth } from '../../hooks/useAuth';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/chw/dashboard', icon: 'dashboard', end: true },
    { label: 'Household Registration', to: '/chw/households', icon: 'home_work' },
    { label: 'Health Survey', to: '/chw/survey', icon: 'fact_check' },
    { label: 'Field Reports', to: '/chw/reports', icon: 'description' },
    { label: 'Community Education', to: '/chw/education', icon: 'school' },
    { label: 'My Schedule', to: '/chw/schedule', icon: 'event' },
  ],
};

export default function CHWDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: `Namaste, ${user?.name ?? 'Health Worker'}`, subtitle: 'Here is your community overview' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPIWidget label="Households Covered" value="418" icon="home_work" color="primary" trend={5} />
        <KPIWidget label="Surveys Today" value="24" icon="fact_check" color="secondary" trend={12} />
        <KPIWidget label="Scheduled Visits" value="18" icon="event" color="tertiary" trend={3} />
        <KPIWidget label="Flagged Cases" value="2" icon="warning" color="error" trend={-8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Weekly Field Visits" subtitle="Your activity" className="lg:col-span-2">
          <LineChart labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} data={[8, 12, 10, 14, 11, 6, 4]} height={260} />
        </Card>

        <Card title="Today's Tasks" icon="checklist">
          <div className="space-y-3">
            {[
              { label: 'Follow-up: Meera Sharma (Amroli)', time: '10:00 AM', done: false },
              { label: 'Vaccination drive: Palia School', time: '01:00 PM', done: false },
              { label: 'New household registration', time: '03:00 PM', done: true },
              { label: 'Survey: Devgram block', time: '04:30 PM', done: false },
            ].map((task) => (
              <div key={task.label} className="flex items-center gap-3 bg-surface-container-low rounded-lg p-3">
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    task.done ? 'bg-primary border-primary text-on-primary' : 'border-outline-variant'
                  }`}
                >
                  {task.done && <span className="material-symbols-outlined text-xs">check</span>}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.done ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                    {task.label}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">{task.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Recent Field Reports" icon="description" subtitle="Latest submissions from the block">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary text-on-primary">
                <th className="px-6 py-3 font-headline font-semibold">Report</th>
                <th className="px-6 py-3 font-headline font-semibold">Village</th>
                <th className="px-6 py-3 font-headline font-semibold">Status</th>
                <th className="px-6 py-3 font-headline font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Malaria screening round 3', village: 'Amroli', status: 'Approved' },
                { name: 'Prenatal compliance check', village: 'Palia', status: 'Pending' },
                { name: 'Sanitation drive report', village: 'Devgram', status: 'Approved' },
              ].map((r) => (
                <tr key={r.name} className="border-b border-outline-variant hover:bg-surface-container-low">
                  <td className="px-6 py-3 font-semibold">{r.name}</td>
                  <td className="px-6 py-3 text-on-surface-variant">{r.village}</td>
                  <td className="px-6 py-3">
                    <Badge variant={r.status === 'Approved' ? 'success' : 'warning'}>{r.status}</Badge>
                  </td>
                  <td className="px-6 py-3">
                    <Button size="sm" variant="ghost">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
