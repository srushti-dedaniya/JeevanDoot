import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import { referralService } from '../../services/referralService';
import { useNotification } from '../../hooks/useNotification';
import { REFERRAL_DESTINATIONS } from '../../utils/constants';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: 'dashboard', end: true },
    { label: 'Patient Queue', to: '/doctor/queue', icon: 'groups' },
    { label: 'Live Consultation', to: '/doctor/consultation', icon: 'call' },
    { label: 'Performance Analytics', to: '/doctor/performance', icon: 'query_stats' },
  ],
};

const PRIORITY_LEVELS = ['Urgent', 'High', 'Normal'];

export default function PatientReferral() {
  const { notify } = useNotification();
  const [form, setForm] = useState({
    patientId: 'JD-9921',
    patientName: 'Meera Sharma',
    destination: '',
    priority: 'Urgent',
    reason: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await referralService.create(form);
    setSubmitting(false);
    setSubmitted(result);
    notify({ type: 'success', message: `Referral ${result.id} sent successfully` });
  };

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: 'Patient Referral', subtitle: 'Refer patients to specialist care' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <Card title="Referral Details" icon="emergency_home">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Patient ID" value={form.patientId} onChange={update('patientId')} icon="badge" required />
              <Input label="Patient Name" value={form.patientName} onChange={update('patientName')} icon="person" required />
              <div className="md:col-span-2">
                <Select
                  label="Destination Facility"
                  value={form.destination}
                  onChange={update('destination')}
                  options={REFERRAL_DESTINATIONS}
                  placeholder="Select a destination"
                  required
                />
              </div>
              <div>
                <Select label="Priority" value={form.priority} onChange={update('priority')} options={PRIORITY_LEVELS} required />
              </div>
              <Input label="Reason for Referral" value={form.reason} onChange={update('reason')} placeholder="e.g. Suspected MI" icon="stethoscope" required />
            </div>
            <div className="mt-4">
              <label className="block text-label-lg font-semibold text-on-surface ml-1 mb-2">Clinical Notes</label>
              <textarea
                value={form.notes}
                onChange={update('notes')}
                rows={4}
                placeholder="Summarise findings, vitals, and reason for escalation..."
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <Button type="submit" loading={submitting} icon="send" size="lg">
                Send Referral
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => window.history.back()}>
                Cancel
              </Button>
            </div>
          </Card>
        </form>

        <div className="space-y-6">
          {submitted ? (
            <Card title="Referral Confirmed" icon="verified" className="border-l-4 border-l-success">
              <div className="space-y-3">
                <Badge variant="success" icon="check">Referral {submitted.id}</Badge>
                <div className="bg-surface-container-low rounded-lg p-4 space-y-2 text-label-md">
                  <p><span className="text-on-surface-variant">Status:</span> <span className="font-bold text-on-surface">{submitted.status}</span></p>
                  <p><span className="text-on-surface-variant">Facility:</span> <span className="font-bold text-on-surface">{form.destination}</span></p>
                  <p><span className="text-on-surface-variant">Priority:</span> <span className="font-bold text-on-surface">{form.priority}</span></p>
                </div>
                <p className="text-label-sm text-on-surface-variant">
                  The destination facility has been notified. You will receive an update on their end.
                </p>
              </div>
            </Card>
          ) : (
            <Card title="Referral Guidelines" icon="policy">
              <ul className="space-y-3 text-label-md text-on-surface-variant">
                <li className="flex gap-2"><span className="material-symbols-outlined text-sm text-primary">gpp_good</span> Verify patient identity before referral.</li>
                <li className="flex gap-2"><span className="material-symbols-outlined text-sm text-primary">gpp_good</span> Include recent vitals & medication history.</li>
                <li className="flex gap-2"><span className="material-symbols-outlined text-sm text-primary">gpp_good</span> Mark priority as Urgent for life-threatening conditions.</li>
                <li className="flex gap-2"><span className="material-symbols-outlined text-sm text-primary">gpp_good</span> Attach relevant lab reports if available.</li>
              </ul>
            </Card>
          )}

          <Card title="Recent Referrals" icon="history">
            <div className="space-y-3">
              {[
                { id: 'REF-2231', name: 'Gopal Prasad', status: 'Accepted', date: 'Today 09:40' },
                { id: 'REF-2208', name: 'Laxmi Verma', status: 'Pending', date: 'Yesterday' },
              ].map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-surface-container-low rounded-lg p-3">
                  <div>
                    <p className="font-bold text-on-surface text-sm">{r.name}</p>
                    <p className="text-label-sm text-on-surface-variant">{r.id} · {r.date}</p>
                  </div>
                  <Badge variant={r.status === 'Accepted' ? 'success' : 'warning'}>{r.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
