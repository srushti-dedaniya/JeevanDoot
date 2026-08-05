import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { useNotification } from '../../hooks/useNotification';
import { MEDICATION_SUGGESTIONS, COMMON_MEDICINE_SCHEDULES } from '../../utils/constants';
import { downloadTextFile } from '../../utils/helpers';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: 'dashboard', end: true },
    { label: 'Patient Queue', to: '/doctor/queue', icon: 'groups' },
    { label: 'Live Consultation', to: '/doctor/consultation', icon: 'call' },
    { label: 'Performance Analytics', to: '/doctor/performance', icon: 'query_stats' },
  ],
};

const DEFAULT_SCHEDULE = {
  morning: false,
  afternoon: false,
  night: false,
};

export default function PrescriptionWriting() {
  const { notify } = useNotification();
  const [patientId, setPatientId] = useState('JD-9921');
  const [patientName, setPatientName] = useState('Meera Sharma');
  const [medications, setMedications] = useState([]);
  const [current, setCurrent] = useState({ name: '', dosage: '', frequency: '', duration: '', notes: '' });
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');

  const addMedication = () => {
    if (!current.name.trim()) return;
    setMedications((prev) => [...prev, { ...current, schedule }]);
    setCurrent({ name: '', dosage: '', frequency: '', duration: '', notes: '' });
    setSchedule(DEFAULT_SCHEDULE);
  };

  const removeMedication = (index) => {
    setMedications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDownload = () => {
    const body = medications
      .map((m, i) => `${i + 1}. ${m.name} — ${m.dosage}, ${m.frequency}, for ${m.duration} days`)
      .join('\n');
    downloadTextFile(
      `JeevanDoot Prescription\nPatient: ${patientName} (${patientId})\nDiagnosis: ${diagnosis || 'N/A'}\n\n${body}\n\nAdvice: ${advice || 'N/A'}`,
      `prescription-${patientId}.txt`
    );
    notify({ type: 'success', message: 'Prescription downloaded' });
  };

  const handleSave = () => {
    notify({ type: 'success', message: 'Prescription saved successfully' });
  };

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: 'Prescription Writing', subtitle: 'Create a new electronic prescription' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Patient Information" icon="person">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} icon="badge" />
              <Input label="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} icon="person" />
            </div>
          </Card>

          <Card title="Add Medication" icon="medication">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Medication Name"
                value={current.name}
                onChange={(e) => setCurrent((c) => ({ ...c, name: e.target.value }))}
                placeholder="e.g. Paracetamol"
                icon="medication"
              />
              <Input
                label="Dosage"
                value={current.dosage}
                onChange={(e) => setCurrent((c) => ({ ...c, dosage: e.target.value }))}
                placeholder="e.g. 500mg"
                icon="edit_note"
              />
              <Input
                label="Frequency"
                value={current.frequency}
                onChange={(e) => setCurrent((c) => ({ ...c, frequency: e.target.value }))}
                placeholder="e.g. Twice daily"
                icon="schedule"
              />
              <Input
                label="Duration (days)"
                value={current.duration}
                onChange={(e) => setCurrent((c) => ({ ...c, duration: e.target.value }))}
                placeholder="e.g. 5"
                type="number"
                icon="calendar_today"
              />
            </div>

            <div className="mt-4">
              <p className="font-bold text-on-surface mb-2">Schedule</p>
              <div className="flex flex-wrap gap-3">
                {COMMON_MEDICINE_SCHEDULES.map((slot) => (
                  <label
                    key={slot}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer border transition-all ${
                      schedule[slot.toLowerCase()]
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={schedule[slot.toLowerCase()]}
                      onChange={() => setSchedule((s) => ({ ...s, [slot.toLowerCase()]: !s[slot.toLowerCase()] }))}
                    />
                    <span className="material-symbols-outlined text-sm">{schedule[slot.toLowerCase()] ? 'check' : 'add'}</span>
                    {slot}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-4 flex-wrap">
              <div className="flex flex-wrap gap-2 flex-1">
                {MEDICATION_SUGGESTIONS.filter((s) => !medications.some((m) => m.name === s)).slice(0, 4).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCurrent((c) => ({ ...c, name: s }))}
                    className="px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant text-label-md hover:bg-primary-container transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Button type="button" onClick={addMedication} icon="add_circle" variant="secondary">
                Add to Prescription
              </Button>
            </div>
          </Card>

          {medications.length > 0 && (
            <Card title="Prescription Items" icon="playlist_add_check" subtitle={`${medications.length} items`}>
              <div className="space-y-3">
                {medications.map((m, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 bg-surface-container-low rounded-lg p-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <Badge variant="primary">{i + 1}</Badge>
                      <div className="min-w-0">
                        <p className="font-bold text-on-surface">{m.name}</p>
                        <p className="text-label-md text-on-surface-variant">
                          {m.dosage} · {m.frequency} · {m.duration} days
                          {Object.entries(m.schedule ?? {}).filter(([, v]) => v).length > 0 && (
                            <span>
                              {' '}· {Object.entries(m.schedule).filter(([, v]) => v).map(([k]) => k).join(', ')}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => removeMedication(i)} className="text-error hover:bg-error-container rounded-full p-2" aria-label="Remove">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card title="Diagnosis & Advice" icon="stethoscope">
            <div className="space-y-4">
              <Input
                label="Diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Hypertension (Stage 1)"
                icon="diagnosis"
              />
              <div>
                <label className="block text-label-lg font-semibold text-on-surface ml-1 mb-2">Advice for Patient</label>
                <textarea
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  rows={3}
                  placeholder="Diet, rest, follow-up notes..."
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Actions" icon="bolt">
            <div className="space-y-3">
              <Button fullWidth onClick={handleSave} icon="save">Save Prescription</Button>
              <Button fullWidth variant="secondary" onClick={handleDownload} icon="download">Download PDF</Button>
              <Button fullWidth variant="outline" icon="print">Print</Button>
            </div>
          </Card>
          <Card title="Quick Reference" icon="tips_and_updates">
            <ul className="space-y-2 text-label-md text-on-surface-variant">
              <li>• Standard dose calculations are for adult patients.</li>
              <li>• Flag any allergy conflicts before prescribing.</li>
              <li>• E-prescriptions are digitally signed by JeevanDoot.</li>
              <li>• Schedule reminders auto-sync to patient phone.</li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
