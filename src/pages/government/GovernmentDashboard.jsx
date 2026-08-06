import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/layout/DashboardLayout';
import NotificationBell from '../../components/layout/NotificationBell';
import ProfileMenu from '../../components/layout/ProfileMenu';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import KPIWidget from '../../components/charts/KPIWidget';
import LineChart from '../../components/charts/LineChart';
import PieChart from '../../components/charts/PieChart';
import { useAuth } from '../../hooks/useAuth';
import { GOVERNMENT_NAV } from './governmentNav';

const TOP_SCHEMES = [
  { id: 's1', name: 'Ayushman Bharat (PM-JAY)', registrations: '12,486', coverage: 64 },
  { id: 's2', name: 'National Health Mission', registrations: '8,975', coverage: 51 },
  { id: 's3', name: 'Mission Indradhanush', registrations: '5,612', coverage: 94 },
];

const RECENT_QUERIES = [
  { id: 'Q-2215', scheme: 'Ayushman Bharat (PM-JAY)', question: 'Are we eligible for the ₹5 lakh cover with an annual income of ₹2.4 lakh?', time: '2 hours ago', status: 'Open' },
  { id: 'Q-2214', scheme: 'PMMVY', question: 'What documents are needed to claim maternity benefit instalments?', time: 'Yesterday', status: 'Open' },
  { id: 'Q-2213', scheme: 'Mission Indradhanush', question: 'Where is the nearest catch-up vaccination camp for my child?', time: '2 days ago', status: 'Answered' },
];

export default function GovernmentDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const headerRight = (
    <>
      <NotificationBell />
      <ProfileMenu />
    </>
  );

  const sidebarItems = GOVERNMENT_NAV.items.map((item) => ({ ...item, label: t(`nav.${item.labelKey}`) }));

  return (
    <DashboardLayout
      sidebarProps={{ items: sidebarItems }}
      headerProps={{
        title: t('government.welcomeBack', { name: user?.name ?? t('role.government') }),
        subtitle: t('government.overviewToday'),
        right: headerRight,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPIWidget label={t('government.activeSchemes')} value="7" icon="health_and_safety" color="primary" trend={2} />
        <KPIWidget label={t('government.totalRegistrations')} value="38,643" icon="group_add" color="secondary" trend={9} />
        <KPIWidget label={t('government.publicQueries')} value="156" icon="question_answer" color="tertiary" trend={14} />
        <KPIWidget label={t('government.villagesCovered')} value="27" icon="location_on" color="error" trend={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title={t('government.registrationTrends')}
          subtitle={t('government.registrationsByMonth')}
          className="lg:col-span-2"
          headerRight={
            <select className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1.5 text-label-md">
              <option>{t('government.monthly')}</option>
              <option>{t('government.quarterly')}</option>
            </select>
          }
        >
          <LineChart
            labels={[t('schedule.mon'), t('schedule.tue'), t('schedule.wed'), t('schedule.thu'), t('schedule.fri'), 'Sat', 'Sun']}
            data={[460, 520, 495, 610, 580, 320, 240]}
            height={280}
          />
        </Card>

        <Card title={t('government.coverageByScheme')} subtitle={t('government.schemesBreakdown')}>
          <PieChart
            labels={['PM-JAY', 'NHM', 'Indradhanush', 'PMMVY', 'NPCDCS', 'RBSK']}
            data={[32, 23, 15, 8, 11, 11]}
            colors={['#1B5E4F', '#C8B900', '#E8734A', '#7B61B5', '#2E86AB', '#9B5DE5']}
            height={200}
          />
          <div className="flex flex-col gap-3 mt-4">
            {[['PM-JAY', 32], ['NHM', 23], ['Indradhanush', 15], ['PMMVY', 8], ['NPCDCS', 11], ['RBSK', 11]].map(([label, value], i) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: ['#1B5E4F', '#C8B900', '#E8734A', '#7B61B5', '#2E86AB', '#9B5DE5'][i] }} />
                  <span className="text-label-md text-on-surface-variant">{label}</span>
                </div>
                <span className="font-bold text-on-surface">{value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title={t('government.topSchemes')}
          subtitle={t('government.byRegistrations')}
          headerRight={
            <Link to="/government/schemes">
              <Button variant="outline" size="sm">{t('government.viewAllSchemes')}</Button>
            </Link>
          }
        >
          <div className="space-y-4">
            {TOP_SCHEMES.map((scheme) => (
              <div key={scheme.id} className="flex items-center gap-4 bg-surface-container-low rounded-lg p-4">
                <span className="w-10 h-10 shrink-0 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined">health_and_safety</span>
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface truncate">{scheme.name}</p>
                  <div className="mt-2 h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${scheme.coverage}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-primary">{scheme.registrations}</p>
                  <p className="text-label-sm text-on-surface-variant">{scheme.coverage}% target</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title={t('government.recentQueries')}
          subtitle={t('government.latestQuestions')}
          headerRight={
            <Link to="/government/queries">
              <Button variant="outline" size="sm">{t('government.viewAllQueries')}</Button>
            </Link>
          }
        >
          <div className="space-y-3">
            {RECENT_QUERIES.map((query) => (
              <div key={query.id} className="flex items-start gap-4 bg-surface-container-low rounded-lg p-4">
                <span className="w-10 h-10 shrink-0 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined">help</span>
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-label-md text-on-surface-variant">{query.scheme}</p>
                  <p className="font-semibold text-on-surface text-sm mt-0.5 line-clamp-2">{query.question}</p>
                  <p className="text-label-sm text-on-surface-variant mt-1">{query.time}</p>
                </div>
                <Badge variant={query.status === 'Open' ? 'warning' : 'success'} dot>{query.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
