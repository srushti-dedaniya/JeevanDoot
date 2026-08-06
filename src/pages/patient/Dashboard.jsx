import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PatientSidebar from '../../components/layout/PatientSidebar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';
import { cx } from '../../utils/helpers';
import { usePatient } from '../../hooks/usePatient';

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const STAT_CARDS = [
  {
    label: 'Upcoming Appointments',
    value: 2,
    icon: 'event',
    color: 'bg-primary',
    iconBg: 'bg-primary-container text-on-primary-container',
    sublabel: 'Next: Aug 15, 2026',
    to: '/patient/appointments',
  },
  {
    label: 'Active Prescriptions',
    value: 1,
    icon: 'medication',
    color: 'bg-secondary',
    iconBg: 'bg-secondary-container text-on-secondary-container',
    sublabel: 'RX-2025-0098 running',
    to: '/patient/prescriptions',
  },
  {
    label: 'Reports Available',
    value: 5,
    icon: 'description',
    color: 'bg-tertiary',
    iconBg: 'bg-tertiary-container text-on-tertiary-container',
    sublabel: 'Latest: Aug 5, 2026',
    to: '/patient/reports',
  },
  {
    label: 'Health Score',
    value: '84',
    unit: '/100',
    icon: 'favorite',
    color: 'bg-primary',
    iconBg: 'bg-error-container text-on-error-container',
    sublabel: 'Good — on track',
    to: '/patient/monitoring',
  },
];

const QUICK_ACTIONS = [
  {
    title: 'Book Appointment',
    desc: 'Schedule a visit with your doctor',
    icon: 'calendar_add_on',
    to: '/patient/appointments',
  },
  {
    title: 'View Prescriptions',
    desc: 'Check active and past medications',
    icon: 'medical_information',
    to: '/patient/prescriptions',
  },
  {
    title: 'View Reports',
    desc: 'Access lab and imaging results',
    icon: 'folder_open',
    to: '/patient/reports',
  },
];

const RECENT_ACTIVITY = [
  {
    icon: 'description',
    title: 'Blood Test report available',
    desc: 'Amroli PHC · CBC & lipid profile',
    date: 'Aug 5, 2026',
    badge: 'New',
    badgeVariant: 'primary',
  },
  {
    icon: 'event_available',
    title: 'Appointment confirmed',
    desc: 'Dr. Rajesh Kumar · Aug 15, 10:30 AM',
    date: 'Aug 4, 2026',
  },
  {
    icon: 'monitor_heart',
    title: 'BP reading recorded',
    desc: '135/84 mmHg — within target range',
    date: 'Aug 4, 2026',
  },
  {
    icon: 'medication',
    title: 'Prescription refill approved',
    desc: 'RX-2025-0098 · Metformin 500mg',
    date: 'Aug 2, 2026',
  },
  {
    icon: 'vaccines',
    title: 'Vaccination reminder',
    desc: 'Seasonal flu vaccine recommended before monsoon',
    date: 'Jul 30, 2026',
  },
];

const HEALTH_FACTORS = [
  { label: 'Blood Pressure', value: '135/84', status: 'Stable', pct: 82, tone: 'bg-primary' },
  { label: 'Blood Sugar', value: '118 mg/dL', status: 'Normal', pct: 78, tone: 'bg-tertiary' },
  { label: 'BMI', value: '22.1', status: 'Ideal', pct: 90, tone: 'bg-primary' },
  { label: 'Heart Rate', value: '76 bpm', status: 'Normal', pct: 74, tone: 'bg-tertiary' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { patient } = usePatient();

  return (
    <DashboardLayout
      sidebar={<PatientSidebar />}
      headerProps={{ title: 'Dashboard', subtitle: 'Your health at a glance' }}
    >
      <div className="space-y-6">
        <section className="bg-gradient-to-r from-primary to-tertiary rounded-2xl p-6 sm:p-8 text-on-primary relative overflow-hidden">
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[140px] opacity-10">
            favorite
          </span>
          <div className="relative">
            <p className="font-headline text-headline-lg font-bold">
              {greeting()}, {patient.name.split(' ')[0]} 👋
            </p>
            <p className="text-on-primary/80 mt-1">{formatDate(new Date(), 'EEEE, MMMM d, yyyy')}</p>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Badge variant="primary" icon="badge">{patient.patientId}</Badge>
              <Badge variant="primary" icon="water_drop">{patient.bloodGroup}</Badge>
              <Badge variant="primary" icon="monitor_heart">Health Score 84/100</Badge>
            </div>
            <p className="mt-4 max-w-xl text-on-primary/90">
              Your next appointment is with <strong>Dr. Rajesh Kumar</strong> on{' '}
              <strong>Aug 15, 2026</strong> at <strong>10:30 AM</strong> for a hypertension
              follow-up.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_CARDS.map((card) => (
            <button
              key={card.label}
              type="button"
              onClick={() => navigate(card.to)}
              className="text-left bg-surface-container-lowest rounded-2xl p-5 card-shadow border border-outline-variant/20 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className={cx('w-11 h-11 rounded-full flex items-center justify-center', card.iconBg)}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </span>
                <span className="material-symbols-outlined text-on-surface-variant">arrow_outward</span>
              </div>
              <p className="mt-4 font-headline text-headline-2xl font-bold text-on-surface">
                {card.value}
                {card.unit && <span className="text-body-lg text-on-surface-variant font-normal"> {card.unit}</span>}
              </p>
              <p className="font-bold text-on-surface text-sm">{card.label}</p>
              <p className="text-label-md text-on-surface-variant mt-0.5">{card.sublabel}</p>
            </button>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card
              title="Quick Actions"
              subtitle="Jump straight to the tools you use most"
              icon="bolt"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.title}
                    type="button"
                    onClick={() => navigate(action.to)}
                    className="group text-left bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 hover:bg-primary-container/40 hover:border-primary/40 transition-colors"
                  >
                    <span className="w-11 h-11 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">{action.icon}</span>
                    </span>
                    <p className="mt-3 font-bold text-on-surface text-sm">{action.title}</p>
                    <p className="text-label-md text-on-surface-variant mt-0.5">{action.desc}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card
              title="Recent Activity"
              subtitle="Latest updates on your health records"
              icon="history"
              headerRight={
                <Button variant="ghost" size="sm" icon="arrow_forward" onClick={() => navigate('/patient/notifications')}>
                  View all
                </Button>
              }
            >
              <div className="divide-y divide-outline-variant">
                {RECENT_ACTIVITY.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                    <span className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-on-surface text-sm">{item.title}</p>
                        {item.badge && <Badge variant={item.badgeVariant}>{item.badge}</Badge>}
                      </div>
                      <p className="text-label-md text-on-surface-variant">{item.desc}</p>
                    </div>
                    <span className="text-label-md text-on-surface-variant shrink-0">{item.date}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card
            title="Health Score"
            subtitle="Based on your latest readings"
            icon="favorite"
          >
            <div className="flex items-center justify-center py-4">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" strokeWidth="12" className="stroke-surface-container-high" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="stroke-primary"
                    strokeDasharray={`${(84 / 100) * 326.7} 326.7`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline text-headline-2xl font-bold text-on-surface">84</span>
                  <span className="text-label-md text-on-surface-variant">/ 100</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <Badge variant="success" icon="monitor_heart">Good</Badge>
            </div>
            <div className="space-y-3">
              {HEALTH_FACTORS.map((f) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between text-label-md">
                    <span className="font-bold text-on-surface">{f.label}</span>
                    <span className="text-on-surface-variant">{f.value} · {f.status}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div className={cx('h-full rounded-full', f.tone)} style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Button variant="secondary" fullWidth icon="monitoring" onClick={() => navigate('/patient/monitoring')}>
                View monitoring
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
