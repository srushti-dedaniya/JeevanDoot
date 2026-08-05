import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useNotification } from '../../hooks/useNotification';

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

const CAMPAIGNS = [
  {
    id: 'camp-1',
    title: 'Handwashing Awareness',
    description: 'Teach the 7-step handwashing technique at the village school.',
    materials: ['Poster set', 'Demonstration kit', 'Leaflets (50)'],
    audience: 'School children + parents',
    status: 'Active',
  },
  {
    id: 'camp-2',
    title: 'Mosquito Net Distribution',
    description: 'Distribute insecticide-treated nets and explain malaria prevention.',
    materials: ['Mosquito nets (40)', 'Tracker sheet'],
    audience: 'Households in Amroli',
    status: 'Active',
  },
  {
    id: 'camp-3',
    title: 'Prenatal Nutrition Drive',
    description: 'Session on iron-rich diet and antenatal checkup importance.',
    materials: ['Presentation', 'Diet charts'],
    audience: 'Pregnant women + caregivers',
    status: 'Planned',
  },
];

export default function CommunityEducation() {
  const { notify } = useNotification();
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);

  const toggleStatus = (id) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'Active' ? 'Completed' : c.status === 'Planned' ? 'Active' : 'Active' }
          : c
      )
    );
    notify({ type: 'success', message: 'Campaign status updated' });
  };

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: 'Community Education', subtitle: 'Health awareness campaigns' }}
    >
      <Card title="Education Campaigns" icon="school" subtitle={`${campaigns.length} campaigns`}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-surface-container-low rounded-xl p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <span className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined">campaign</span>
                </span>
                <Badge
                  variant={campaign.status === 'Active' ? 'success' : campaign.status === 'Planned' ? 'warning' : 'neutral'}
                  dot
                >
                  {campaign.status}
                </Badge>
              </div>
              <div>
                <h4 className="font-headline text-title-md font-bold text-on-surface mb-1">{campaign.title}</h4>
                <p className="text-label-md text-on-surface-variant">{campaign.description}</p>
              </div>
              <div>
                <p className="text-label-sm font-bold text-on-surface mb-2">Audience</p>
                <p className="text-label-md text-on-surface-variant">{campaign.audience}</p>
              </div>
              <div>
                <p className="text-label-sm font-bold text-on-surface mb-2">Materials</p>
                <div className="flex flex-wrap gap-2">
                  {campaign.materials.map((m) => (
                    <span key={m} className="px-2.5 py-1 rounded-full bg-surface-container-highest text-label-md">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                variant={campaign.status === 'Completed' ? 'outline' : 'secondary'}
                size="sm"
                onClick={() => toggleStatus(campaign.id)}
              >
                {campaign.status === 'Completed' ? 'Reopen' : 'Mark Next Stage'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Educational Resources" icon="menu_book">
          <div className="space-y-3">
            {['Immunization schedule chart', 'Malaria prevention poster', 'Nutrition guide (regional language)'].map((r) => (
              <div key={r} className="flex items-center justify-between bg-surface-container-low rounded-lg p-3">
                <span className="text-label-md text-on-surface">{r}</span>
                <Button size="sm" variant="ghost" icon="download" onClick={() => notify({ type: 'success', message: 'Resource downloaded' })}>
                  Get
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Session Attendance" icon="groups" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Last Session', value: 42, sub: 'Handwashing school demo' },
              { title: 'Avg Attendance', value: 35, sub: 'Across campaigns' },
              { title: 'Villages Reached', value: 6, sub: 'This quarter' },
            ].map((stat) => (
              <div key={stat.title} className="bg-surface-container-low rounded-lg p-5 text-center">
                <p className="font-headline text-headline-lg font-bold text-primary">{stat.value}</p>
                <p className="text-label-md font-bold text-on-surface">{stat.title}</p>
                <p className="text-label-sm text-on-surface-variant mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
