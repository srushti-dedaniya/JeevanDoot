import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { useNotification } from '../../hooks/useNotification';
import { DEFAULT_VILLAGES } from '../../utils/constants';

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

const QUESTIONS = [
  { id: 'fever', label: 'Has anyone in the household had fever in the last 2 weeks?', icon: 'device_thermostat' },
  { id: 'cough', label: 'Any persistent cough or difficulty breathing?', icon: 'lungs' },
  { id: 'pregnant', label: 'Is any woman in the household pregnant?', icon: 'pregnant_woman' },
  { id: 'child', label: 'Any child under 5 who missed vaccinations?', icon: 'child_care' },
  { id: 'sanitation', label: 'Does the household have access to safe drinking water?', icon: 'water_drop' },
];

export default function HealthSurvey() {
  const { notify } = useNotification();
  const [survey, setSurvey] = useState({
    household: '',
    village: '',
    answers: { fever: 'No', cough: 'No', pregnant: 'No', child: 'No', sanitation: 'Yes' },
    notes: '',
  });
  const [submitted, setSubmitted] = useState(null);

  const update = (field) => (e) => setSurvey((s) => ({ ...s, [field]: e.target.value }));
  const setAnswer = (id, value) => setSurvey((s) => ({ ...s, answers: { ...s.answers, [id]: value } }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const flags = Object.entries(survey.answers)
      .filter(([id, value]) => id !== 'sanitation' && value === 'Yes')
      .map(([id]) => QUESTIONS.find((q) => q.id === id).label);
    setSubmitted({ ...survey, flags, submittedAt: new Date().toLocaleTimeString() });
    notify({
      type: flags.length ? 'warning' : 'success',
      message: flags.length ? `${flags.length} risk flag(s) reported` : 'Survey submitted, no flags',
    });
  };

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: 'Health Survey', subtitle: 'Screen households for health risks' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <Card title="Survey Details" icon="fact_check">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Household" value={survey.household} onChange={update('household')} placeholder="Household name / ID" icon="home_work" required />
              <div>
                <label className="block text-label-lg font-semibold text-on-surface ml-1 mb-2">Village</label>
                <select value={survey.village} onChange={update('village')} className="w-full h-14 bg-surface-container-low border border-outline-variant rounded-lg px-4 focus:ring-2 focus:ring-primary" required>
                  <option value="" disabled>Select village</option>
                  {DEFAULT_VILLAGES.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card title="Screening Questions" icon="quiz">
            <div className="space-y-4">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface-container-low rounded-lg p-4">
                  <p className="flex items-center gap-3 font-medium text-on-surface">
                    <span className="material-symbols-outlined text-primary">{q.icon}</span>
                    {q.label}
                  </p>
                  <div className="flex gap-2">
                    {['Yes', 'No'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAnswer(q.id, option)}
                        className={`px-5 py-2 rounded-full border text-label-md transition-all ${
                          survey.answers[q.id] === option
                            ? option === 'Yes'
                              ? 'bg-error text-white border-error'
                              : 'bg-primary text-on-primary border-primary'
                            : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-label-lg font-semibold text-on-surface ml-1 mb-2">Field Notes</label>
              <textarea
                value={survey.notes}
                onChange={update('notes')}
                rows={3}
                placeholder="Any additional observations..."
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button type="submit" size="lg" className="mt-4" icon="send">
              Submit Survey
            </Button>
          </Card>
        </form>

        <div className="space-y-6">
          <Card title="Risk Summary" icon="warning">
            <div className="space-y-3">
              {QUESTIONS.filter((q) => q.id !== 'sanitation').map((q) => (
                <div key={q.id} className="flex items-center justify-between">
                  <span className="text-label-md text-on-surface-variant max-w-[70%]">{q.label}</span>
                  <Badge variant={survey.answers[q.id] === 'Yes' ? 'critical' : 'success'}>
                    {survey.answers[q.id]}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {submitted && (
            <Card title="Submission Confirmed" icon="verified" className="border-l-4 border-l-success">
              <p className="text-label-md text-on-surface-variant">
                Survey for <span className="font-bold text-on-surface">{submitted.household}</span> submitted at{' '}
                {submitted.submittedAt}.
              </p>
              {submitted.flags.length > 0 && (
                <div className="mt-3 space-y-2">
                  {submitted.flags.map((f) => (
                    <Badge key={f} variant="critical" icon="flag">{f}</Badge>
                  ))}
                </div>
              )}
            </Card>
          )}

          <Card title="Survey Coverage" icon="donut_large">
            <div className="text-center py-6">
              <p className="font-headline text-headline-2xl font-bold text-primary">62%</p>
              <p className="text-label-md text-on-surface-variant">of target households surveyed this month</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
