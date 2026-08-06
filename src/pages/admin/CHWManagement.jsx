import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import KPIWidget from '../../components/charts/KPIWidget';
import { mapService } from '../../services/mapService';
import { useDebounce } from '../../hooks/useDebounce';
import { useNotification } from '../../hooks/useNotification';

const SIDEBAR = {
  items: [
    { labelKey: 'dashboard', to: '/admin/dashboard', icon: 'dashboard', end: true },
    { labelKey: 'diseaseSurveillance', to: '/admin/surveillance', icon: 'public_health' },
    { labelKey: 'caseAnalytics', to: '/admin/case-analytics', icon: 'analytics' },
    { labelKey: 'auditLog', to: '/admin/audit-log', icon: 'verified_user' },
    { labelKey: 'reportGeneration', to: '/admin/reports', icon: 'summarize' },
    { labelKey: 'doctorManagement', to: '/admin/doctors', icon: 'medical_services' },
    { labelKey: 'chwManagement', to: '/admin/chws', icon: 'volunteer_activism' },
    { labelKey: 'configuration', to: '/admin/settings', icon: 'settings' },
  ],
};

const CHWS = [
  { id: 'CHW-001', name: 'Priya Sharma', cluster: 'Dhamtari Cluster', families: 124, status: 'Active', rating: 4.9 },
  { id: 'CHW-002', name: 'Sunil Yadav', cluster: 'Bijapur Sector 2', families: 98, status: 'Active', rating: 4.6 },
  { id: 'CHW-003', name: 'Rekha Patil', cluster: 'Lormi Block', families: 110, status: 'On Leave', rating: 4.8 },
  { id: 'CHW-004', name: 'Anita Kumari', cluster: 'Kanker East', families: 86, status: 'Active', rating: 4.4 },
];

export default function CHWManagement() {
  const { t } = useTranslation();
  const { notify } = useNotification();
  const [query, setQuery] = useState('');
  const [coverage, setCoverage] = useState([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const load = async () => {
      const data = await mapService.getWorkersMap();
      setCoverage(data);
    };
    load();
  }, []);

  const filtered = CHWS.filter(
    (c) =>
      !debouncedQuery ||
      c.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      c.cluster.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const sidebarItems = SIDEBAR.items.map((item) => ({ ...item, label: t(`nav.${item.labelKey}`) }));

  return (
    <DashboardLayout
      sidebarProps={{ items: sidebarItems }}
      headerProps={{
        title: t('chwsMgmt.title'),
        subtitle: t('chwsMgmt.chwsDeployed', { count: CHWS.length }),
        right: (
          <Button icon="person_add" onClick={() => notify({ type: 'info', message: t('chwsMgmt.onboardingComingSoon') })}>
            {t('chwsMgmt.onboardChw')}
          </Button>
        ),
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPIWidget label={t('chwsMgmt.activeChws')} value={CHWS.filter((c) => c.status === 'Active').length} icon="volunteer_activism" color="primary" trend={4} />
        <KPIWidget label={t('chwsMgmt.familiesCovered')} value="418" icon="home_work" color="secondary" trend={7} />
        <KPIWidget label={t('chwsMgmt.avgCoverage')} value={`${Math.round(coverage.reduce((s, c) => s + c.coverage, 0) / Math.max(coverage.length, 1))}%`} icon="tracked_changes" color="tertiary" trend={2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title={t('chwsMgmt.workforceMap')} subtitle={t('chwsMgmt.coverageByCluster')} className="lg:col-span-1">
          <div className="space-y-4">
            {coverage.map((c) => (
              <div key={c.cluster}>
                <div className="flex justify-between text-label-md mb-1">
                  <span className="text-on-surface-variant">{c.cluster}</span>
                  <span className="font-bold text-on-surface">{t('chwsMgmt.workers', { count: c.workers })}</span>
                </div>
                <div className="h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${c.coverage}%` }} />
                </div>
                <p className="text-label-sm text-on-surface-variant mt-1">{t('chwsMgmt.coveragePct', { value: c.coverage })}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title={t('chwsMgmt.chwDirectory')}
          subtitle={t('chwsMgmt.workersCount', { count: filtered.length })}
          className="lg:col-span-2"
          headerRight={<SearchBar placeholder={t('chwsMgmt.searchChws')} onSearch={setQuery} containerClassName="w-64" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((chw) => (
              <div key={chw.id} className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-headline font-bold">
                      {chw.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{chw.name}</p>
                      <p className="text-label-sm text-on-surface-variant">{chw.id}</p>
                    </div>
                  </div>
                  <Badge variant={chw.status === 'Active' ? 'success' : 'warning'} dot dotColor={chw.status === 'Active' ? 'bg-success' : 'bg-warning'}>
                    {chw.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-label-md text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {chw.cluster}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-warning">star</span>
                    {chw.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-label-md">
                    <span className="font-bold text-on-surface">{chw.families}</span>{' '}
                    <span className="text-on-surface-variant">{t('chwsMgmt.families')}</span>
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => notify({ type: 'info', message: t('chwsMgmt.viewing', { name: chw.name }) })}>
                    {t('chwsMgmt.viewProfile')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
