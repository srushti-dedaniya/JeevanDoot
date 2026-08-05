import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { patientService } from '../../services/patientService';
import { RISK_STYLES } from '../../utils/constants';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: 'dashboard', end: true },
    { label: 'Patient Queue', to: '/doctor/queue', icon: 'groups' },
    { label: 'Live Consultation', to: '/doctor/consultation', icon: 'call' },
    { label: 'Performance Analytics', to: '/doctor/performance', icon: 'query_stats' },
  ],
};

function VitalCard({ label, value, unit, icon }) {
  return (
    <div className="bg-surface-container-low rounded-lg p-4 flex items-center gap-3">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      <div>
        <p className="text-label-md text-on-surface-variant">{label}</p>
        <p className="font-headline font-bold text-on-surface">
          {value} <span className="text-sm font-normal text-on-surface-variant">{unit}</span>
        </p>
      </div>
    </div>
  );
}

export default function PatientCaseSummary() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await patientService.getById(id);
      setPatient(data);
      setLoading(false);
    };
    load();
  }, [id]);

  return (
    <DashboardLayout sidebarProps={SIDEBAR} headerProps={{ title: 'Patient Case Summary', subtitle: id ? `Patient ID: ${id}` : 'Select a patient' }}>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      ) : !patient ? (
        <Card className="p-10 text-center">
          <p className="text-on-surface-variant">Patient not found.</p>
          <Link to="/doctor/queue">
            <Button className="mt-4">Back to Queue</Button>
          </Link>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline text-2xl font-bold">
                  {patient.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-headline text-headline-md font-bold text-on-surface">{patient.name}</h3>
                  <p className="text-on-surface-variant">
                    {patient.id} · {patient.age} yrs · {patient.gender} · {patient.village}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={RISK_STYLES[patient.risk] ? patient.risk === 'Critical' ? 'critical' : patient.risk === 'Moderate' ? 'warning' : 'success' : 'neutral'} uppercase>
                  {patient.risk} Risk
                </Badge>
                <Link to="/doctor/prescription">
                  <Button icon="edit_note">Write Prescription</Button>
                </Link>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card title="Chief Complaint" icon="description" className="lg:col-span-1">
              <p className="text-body-lg text-on-surface">{patient.complaint}</p>
              <div className="mt-4 space-y-2">
                {(patient.summary ?? []).map((line, i) => (
                  <p key={i} className="flex items-start gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm text-primary mt-0.5">check_circle</span>
                    {line}
                  </p>
                ))}
              </div>
            </Card>

            <Card title="Vital Signs" icon="favorite" className="lg:col-span-1">
              <div className="grid grid-cols-2 gap-3">
                <VitalCard label="Blood Pressure" value={patient.vitals?.bp} unit="mmHg" icon="blood_pressure" />
                <VitalCard label="Temperature" value={patient.vitals?.temp} unit="°F" icon="device_thermostat" />
                <VitalCard label="Pulse" value={patient.vitals?.pulse} unit="bpm" icon="pulse_rounded" />
                <VitalCard label="Weight" value={patient.vitals?.weight} unit="kg" icon="monitor_weight" />
              </div>
            </Card>

            <Card title="Recommendation" icon="medical_services" className="lg:col-span-1">
              <div className="bg-primary-container rounded-lg p-4">
                <p className="text-sm text-on-primary-container">
                  Immediate ECG recommended. Monitor for ST elevation. Contact cardiology for stat consultation.
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link to="/doctor/referral">
                  <Button variant="secondary" fullWidth icon="emergency_home">Refer to Specialist</Button>
                </Link>
                <Link to="/doctor/followup">
                  <Button variant="outline" fullWidth icon="event_available">Schedule Follow-up</Button>
                </Link>
                <Link to="/doctor/consultation">
                  <Button variant="tertiary" fullWidth icon="call">Start Virtual Consultation</Button>
                </Link>
              </div>
            </Card>
          </div>

          <Card title="Medical History" icon="history">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Diagnosis', items: ['Hypertension (Stage 1)', 'GERD'], icon: 'diagnosis' },
                { title: 'Medications', items: ['Amlodipine 5mg', 'Omeprazole 20mg'], icon: 'medication' },
                { title: 'Allergies', items: ['Penicillin'], icon: 'warning' },
              ].map((section) => (
                <div key={section.title} className="bg-surface-container-low rounded-lg p-4">
                  <p className="flex items-center gap-2 font-bold text-on-surface mb-3">
                    <span className="material-symbols-outlined text-primary text-lg">{section.icon}</span>
                    {section.title}
                  </p>
                  <ul className="space-y-1 text-on-surface-variant">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
