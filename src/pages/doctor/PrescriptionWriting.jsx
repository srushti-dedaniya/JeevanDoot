import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import { MEDICATION_SUGGESTIONS, COMMON_MEDICINE_SCHEDULES } from '../../utils/constants';
import {
  validatePrescription,
  savePrescription,
  downloadPrescriptionPDF,
  printPrescription,
} from '../../utils/prescriptionUtils';
import { consumePrescriptionDraft } from '../../utils/consultationUtils';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: 'dashboard', end: true },
    { label: 'Patient Queue', to: '/doctor/queue', icon: 'groups' },
    { label: 'Live Consultation', to: '/doctor/consultation', icon: 'call' },
    { label: 'Consultation History', to: '/doctor/consultation-history', icon: 'video_library' },
    { label: 'Performance Analytics', to: '/doctor/performance', icon: 'query_stats' },
  ],
};

const DEFAULT_SCHEDULE = {
  morning: false,
  afternoon: false,
  night: false,
};

const EMPTY_MEDICINE = {
  medicineName: '',
  dosage: '',
  frequency: '',
  duration: '',
};

const nextMedicineId = () => `med-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function PrescriptionWriting() {
  const [patientId, setPatientId] = useState('JD-9921');
  const [patientName, setPatientName] = useState('Meera Sharma');
  const [medicines, setMedicines] = useState([]);
  const [current, setCurrent] = useState(EMPTY_MEDICINE);
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [editingId, setEditingId] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [draftSource, setDraftSource] = useState(null);

  useEffect(() => {
    const draft = consumePrescriptionDraft();
    if (!draft) return;
    if (draft.patientId) setPatientId(draft.patientId);
    if (draft.patientName) setPatientName(draft.patientName);
    if (draft.diagnosis) setDiagnosis(draft.diagnosis);
    if (draft.advice) setAdvice(draft.advice);
    if (Array.isArray(draft.medicines) && draft.medicines.length > 0) {
      setMedicines(draft.medicines);
    }
    setDraftSource(draft.fromConsultation || null);
    toast.success('Consultation details loaded — review before saving.');
  }, []);

  const scheduleLabel = (value = {}) =>
    COMMON_MEDICINE_SCHEDULES.filter((slot) => value[slot.toLowerCase()]).join(', ');

  const validateMedicineInput = () => {
    const missing = [];
    if (!current.medicineName.trim()) missing.push('Medicine Name');
    if (!current.dosage.trim()) missing.push('Dosage');
    if (!current.frequency.trim()) missing.push('Frequency');
    if (!current.duration.trim()) missing.push('Duration');
    return missing;
  };

  const resetMedicineForm = () => {
    setCurrent(EMPTY_MEDICINE);
    setSchedule(DEFAULT_SCHEDULE);
    setEditingId(null);
  };

  const addMedicine = () => {
    const missing = validateMedicineInput();
    if (missing.length > 0) {
      toast.error(`Cannot add medicine. Missing: ${missing.join(', ')}`);
      return;
    }

    if (editingId) {
      setMedicines((prev) =>
        prev.map((med) => (med.id === editingId ? { ...med, ...current, schedule } : med))
      );
      toast.success('Medicine updated.');
    } else {
      setMedicines((prev) => [...prev, { id: nextMedicineId(), ...current, schedule }]);
      toast.success('Medicine added.');
    }

    resetMedicineForm();
  };

  const startEdit = (med) => {
    setEditingId(med.id);
    setCurrent({
      medicineName: med.medicineName,
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration,
    });
    setSchedule(med.schedule || DEFAULT_SCHEDULE);
    toast.success(`Editing: ${med.medicineName}`);
  };

  const removeMedicine = (med) => {
    const confirmed = window.confirm(`Remove ${med.medicineName} from the prescription?`);
    if (!confirmed) return;
    setMedicines((prev) => prev.filter((m) => m.id !== med.id));
    if (editingId === med.id) resetMedicineForm();
    toast.success('Medicine removed.');
  };

  const buildData = () => ({
    patientId,
    patientName,
    medicines,
    diagnosis,
    advice,
  });

  const handleDownload = () => {
    const missingFields = validatePrescription(buildData());
    if (missingFields.length > 0) {
      toast.error(`Cannot download PDF. Missing: ${missingFields.join(', ')}`);
      return;
    }
    downloadPrescriptionPDF(buildData());
    toast.success('Prescription PDF downloaded.');
  };

  const handleSave = () => {
    const result = savePrescription(buildData());
    if (result.success) {
      toast.success('Prescription saved successfully.');
    } else if (result.missingFields) {
      toast.error(`Cannot save prescription. Missing: ${result.missingFields.join(', ')}`);
    } else {
      toast.error(result.error || 'Could not save the prescription.');
    }
  };

  const handlePrint = () => {
    const missingFields = validatePrescription(buildData());
    if (missingFields.length > 0) {
      toast.error(`Cannot print. Missing: ${missingFields.join(', ')}`);
      return;
    }
    printPrescription(buildData());
  };

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: 'Prescription Writing', subtitle: 'Create a new electronic prescription' }}
    >
      {draftSource && (
        <div className="mb-6 flex items-center gap-3 bg-secondary-container text-on-secondary-container rounded-xl px-5 py-4">
          <span className="material-symbols-outlined">fact_check</span>
          <p className="font-bold">
            Prefilled from consultation {draftSource}. Medicines shown are AI recommendations —
            please review before saving.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Patient Information" icon="person">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} icon="badge" />
              <Input label="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} icon="person" />
            </div>
          </Card>

          <Card
            title={editingId ? 'Edit Medicine' : 'Add Medication'}
            icon="medication"
            subtitle={editingId ? 'Update the medicine details below' : 'Add medicines one at a time'}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Medicine Name"
                value={current.medicineName}
                onChange={(e) => setCurrent((c) => ({ ...c, medicineName: e.target.value }))}
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
                {MEDICATION_SUGGESTIONS.filter((s) => !medicines.some((m) => m.medicineName === s)).slice(0, 4).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCurrent((c) => ({ ...c, medicineName: s }))}
                    className="px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant text-label-md hover:bg-primary-container transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {editingId && (
                  <Button type="button" onClick={resetMedicineForm} icon="close" variant="outline">
                    Cancel
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={addMedicine}
                  icon={editingId ? 'check' : 'add_circle'}
                  variant={editingId ? 'primary' : 'secondary'}
                >
                  {editingId ? 'Update Medicine' : 'Add to Prescription'}
                </Button>
              </div>
            </div>
          </Card>

          {medicines.length > 0 && (
            <Card
              title="Prescription Items"
              icon="playlist_add_check"
              subtitle={`Medicines Added: ${medicines.length}`}
            >
              <Table
                rowKey="id"
                data={medicines}
                columns={[
                  { key: 'medicineName', header: 'Medicine' },
                  { key: 'dosage', header: 'Dosage' },
                  { key: 'frequency', header: 'Frequency' },
                  {
                    key: 'duration',
                    header: 'Duration',
                    render: (row) => `${row.duration} days`,
                  },
                  {
                    key: 'schedule',
                    header: 'Schedule',
                    render: (row) => scheduleLabel(row.schedule) || '—',
                  },
                  {
                    key: 'actions',
                    header: 'Actions',
                    render: (row) => (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="p-2 rounded-full text-primary hover:bg-primary-container/30 transition-colors"
                          aria-label={`Edit ${row.medicineName}`}
                          title="Edit medicine"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeMedicine(row)}
                          className="p-2 rounded-full text-error hover:bg-error-container transition-colors"
                          aria-label={`Delete ${row.medicineName}`}
                          title="Delete medicine"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    ),
                  },
                ]}
              />
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
              <p className="text-label-lg font-bold text-primary">
                Medicines Added: <Badge variant="primary">{medicines.length}</Badge>
              </p>
              <Button
                fullWidth
                onClick={handleSave}
                icon="save"
                disabled={medicines.length === 0}
                title={medicines.length === 0 ? 'Add at least one medicine first' : undefined}
              >
                Save Prescription
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={handleDownload}
                icon="download"
                disabled={medicines.length === 0}
                title={medicines.length === 0 ? 'Add at least one medicine first' : undefined}
              >
                Download PDF
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={handlePrint}
                icon="print"
                disabled={medicines.length === 0}
                title={medicines.length === 0 ? 'Add at least one medicine first' : undefined}
              >
                Print
              </Button>
            </div>
          </Card>
          <Card title="Quick Reference" icon="tips_and_updates">
            <ul className="space-y-2 text-label-md text-on-surface-variant">
              <li>• Add multiple medicines to the same prescription.</li>
              <li>• Edit or remove any medicine before saving.</li>
              <li>• E-prescriptions are digitally signed by JeevanDoot.</li>
              <li>• Schedule reminders auto-sync to patient phone.</li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
