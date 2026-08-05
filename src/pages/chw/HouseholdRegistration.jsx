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

const EMPTY = {
  familyName: '',
  headName: '',
  village: '',
  familySize: '',
  members: [
    { name: '', age: '', gender: 'Female', relation: 'Self' },
    { name: '', age: '', gender: 'Male', relation: 'Spouse' },
  ],
  insuranceId: '',
};

const RELATIONS = ['Self', 'Spouse', 'Child', 'Parent', 'Grandparent', 'Other'];
const GENDERS = ['Female', 'Male', 'Other'];

export default function HouseholdRegistration() {
  const { notify } = useNotification();
  const [form, setForm] = useState(EMPTY);
  const [registered, setRegistered] = useState([]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const updateMember = (index, field) => (e) =>
    setForm((f) => ({
      ...f,
      members: f.members.map((m, i) => (i === index ? { ...m, [field]: e.target.value } : m)),
    }));

  const addMember = () =>
    setForm((f) => ({ ...f, members: [...f.members, { name: '', age: '', gender: 'Other', relation: 'Other' }] }));

  const removeMember = (index) =>
    setForm((f) => ({ ...f, members: f.members.filter((_, i) => i !== index) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = { id: `HH-${Date.now().toString().slice(-5)}`, ...form };
    setRegistered((prev) => [entry, ...prev]);
    notify({ type: 'success', message: `Household ${entry.id} registered` });
    setForm(EMPTY);
  };

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: 'Household Registration', subtitle: 'Enrol new families into the community system' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <Card title="Family Details" icon="family_restroom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Family Name" value={form.familyName} onChange={update('familyName')} placeholder="e.g. Sharma Family" icon="family_restroom" required />
              <Input label="Head of Family" value={form.headName} onChange={update('headName')} placeholder="Full name" icon="person" required />
              <div>
                <label className="block text-label-lg font-semibold text-on-surface ml-1 mb-2">Village</label>
                <select
                  value={form.village}
                  onChange={update('village')}
                  className="w-full h-14 bg-surface-container-low border border-outline-variant rounded-lg px-4 focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="" disabled>Select village</option>
                  {DEFAULT_VILLAGES.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
              <Input label="Family Size" type="number" value={form.familySize} onChange={update('familySize')} placeholder="e.g. 4" icon="groups" required />
              <div className="md:col-span-2">
                <Input label="Ayushman Bharat ID (optional)" value={form.insuranceId} onChange={update('insuranceId')} placeholder="e.g. AB-1234-5678" icon="card_membership" />
              </div>
            </div>
          </Card>

          <Card title="Family Members" icon="group" subtitle="Add every member living in the household">
            <div className="space-y-4">
              {form.members.map((member, index) => (
                <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end bg-surface-container-low rounded-lg p-4">
                  <Input
                    label="Full Name"
                    value={member.name}
                    onChange={updateMember(index, 'name')}
                    placeholder="Member name"
                  />
                  <Input label="Age" type="number" value={member.age} onChange={updateMember(index, 'age')} placeholder="Age" />
                  <div>
                    <label className="block text-label-md font-semibold text-on-surface ml-1 mb-2">Gender</label>
                    <select
                      value={member.gender}
                      onChange={updateMember(index, 'gender')}
                      className="w-full h-14 bg-surface-container-low border border-outline-variant rounded-lg px-3"
                    >
                      {GENDERS.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-label-md font-semibold text-on-surface ml-1 mb-2">Relation</label>
                      <select
                        value={member.relation}
                        onChange={updateMember(index, 'relation')}
                        className="w-full h-14 bg-surface-container-low border border-outline-variant rounded-lg px-3"
                      >
                        {RELATIONS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    {form.members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="text-error hover:bg-error-container rounded-full p-2"
                        aria-label="Remove member"
                      >
                        <span className="material-symbols-outlined">remove_circle</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" className="mt-4" icon="person_add" onClick={addMember}>
              Add Member
            </Button>
          </Card>

          <Button type="submit" size="lg" icon="how_to_reg">Register Household</Button>
        </form>

        <div className="space-y-6">
          <Card title="Recently Registered" icon="history">
            {registered.length === 0 ? (
              <p className="text-on-surface-variant text-label-md">No households registered this session.</p>
            ) : (
              <div className="space-y-3">
                {registered.slice(0, 5).map((h) => (
                  <div key={h.id} className="flex items-center justify-between bg-surface-container-low rounded-lg p-3">
                    <div>
                      <p className="font-bold text-on-surface text-sm">{h.familyName}</p>
                      <p className="text-label-sm text-on-surface-variant">{h.id} · {h.village}</p>
                    </div>
                    <Badge variant="success">Registered</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Registration Tips" icon="tips_and_updates">
            <ul className="space-y-3 text-label-md text-on-surface-variant">
              <li className="flex gap-2"><span className="material-symbols-outlined text-sm text-primary">check_circle</span> Ask for a valid ID before registering.</li>
              <li className="flex gap-2"><span className="material-symbols-outlined text-sm text-primary">check_circle</span> Count children under 5 carefully for vaccination drives.</li>
              <li className="flex gap-2"><span className="material-symbols-outlined text-sm text-primary">check_circle</span> Note any pregnant women for prenatal tracking.</li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
