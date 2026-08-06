import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { useNotification } from '../../hooks/useNotification';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: 'dashboard', end: true },
    { label: 'Patient Queue', to: '/doctor/queue', icon: 'groups' },
    { label: 'Live Consultation', to: '/doctor/consultation', icon: 'call' },
    { label: 'Consultation History', to: '/doctor/consultation-history', icon: 'video_library' },
    { label: 'Performance Analytics', to: '/doctor/performance', icon: 'query_stats' },
  ],
};

const DATE_RANGE_OPTIONS = ['Next 7 Days', 'Next 14 Days', 'Next 30 Days'];

export default function FollowUpScheduling() {
  const { notify } = useNotification();
  const [form, setForm] = useState({
    patientId: 'JD-7721',
    patientName: 'Laxmi Verma',
    date: '',
    time: '',
    reason: 'Prenatal follow-up',
    mode: 'in-person',
    range: DATE_RANGE_OPTIONS[0],
  });
  const [scheduled, setScheduled] = useState([]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!form.date || !form.time) {
      notify({ type: 'error', message: 'Please pick a date and time' });
      return;
    }
    const entry = { ...form, id: `FU-${Date.now()}` };
    setScheduled((prev) => [...prev, entry]);
    notify({ type: 'success', message: `Follow-up scheduled for ${form.patientName}` });
    setForm((f) => ({ ...f, date: '', time: '' }));
  };

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: 'Follow-up Scheduling', subtitle: 'Plan and track patient follow-ups' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSchedule} className="space-y-6">
          <Card title="Schedule Follow-up" icon="event_available">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Patient ID" value={form.patientId} onChange={update('patientId')} icon="badge" />
              <Input label="Patient Name" value={form.patientName} onChange={update('patientName')} icon="person" />
              <Input label="Date" type="date" value={form.date} onChange={update('date')} icon="calendar_today" required />
              <Input label="Time" type="time" value={form.time} onChange={update('time')} icon="schedule" required />
              <div className="md:col-span-2">
                <label className="block text-label-lg font-semibold text-on-surface ml-1 mb-2">Follow-up Reason</label>
                <select
                  value={form.reason}
                  onChange={update('reason')}
                  className="w-full h-14 bg-surface-container-low border border-outline-variant rounded-lg px-4 focus:ring-2 focus:ring-primary"
                >
                  {['Prenatal follow-up', 'Post-op review', 'Lab result review', 'Chronic condition monitoring', 'Vaccination booster'].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="font-bold text-on-surface mb-2">Mode</p>
                <div className="flex gap-2">
                  {[
                    { value: 'in-person', label: 'In-person', icon: 'person' },
                    { value: 'virtual', label: 'Virtual', icon: 'videocam' },
                    { value: 'home', label: 'Home visit', icon: 'home' },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, mode: mode.value }))}
                      className={`flex flex-col items-center gap-1 px-4 py-3 rounded-lg border text-label-md transition-all ${
                        form.mode === mode.value
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container-low border-outline-variant text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{mode.icon}</span>
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button type="submit" fullWidth className="mt-6" icon="event_available" size="lg">
              Schedule Follow-up
            </Button>
          </Card>

          <Card title="Quick Filter" icon="filter_alt">
            <div className="flex flex-wrap gap-2">
              {DATE_RANGE_OPTIONS.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, range }))}
                  className={`px-4 py-2 rounded-full text-label-md transition-colors ${
                    form.range === range ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant border border-outline-variant'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </Card>
        </form>

        <div className="lg:col-span-2">
          <Card
            title="Upcoming Follow-ups"
            subtitle={`${scheduled.length} scheduled in ${form.range}`}
            icon="upcoming"
            headerRight={
              <Badge variant="secondary" icon="notifications_active">
                Reminders enabled
              </Badge>
            }
          >
            {scheduled.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-3 block">event_note</span>
                No follow-ups scheduled yet. Use the form to add one.
              </div>
            ) : (
              <div className="space-y-3">
                {scheduled.map((s) => (
                  <div key={s.id} className="flex items-center justify-between bg-surface-container-low rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex flex-col items-center justify-center font-headline">
                        <span className="text-label-sm font-bold leading-none">
                          {new Date(s.date).toLocaleString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-title-md font-bold leading-none">
                          {new Date(s.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{s.patientName} · {s.patientId}</p>
                        <p className="text-label-md text-on-surface-variant">
                          {s.reason} · {new Date(s.date).toLocaleDateString()} at {s.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" icon={s.mode === 'virtual' ? 'videocam' : s.mode === 'home' ? 'home' : 'person'}>
                        {s.mode}
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={() => setScheduled((prev) => prev.filter((x) => x.id !== s.id))}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
