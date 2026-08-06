import DashboardLayout from '../../components/layout/DashboardLayout';
import PatientSidebar from '../../components/layout/PatientSidebar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { usePatient } from '../../hooks/usePatient';

const ALLERGIES = [
  { name: 'Penicillin', severity: 'High', reaction: 'Skin rash & breathing difficulty' },
  { name: 'Peanuts', severity: 'Moderate', reaction: 'Swelling & hives' },
];

const MEDICAL_HISTORY = [
  { title: 'Diagnoses', icon: 'diagnosis', items: ['Hypertension (Stage 1)', 'Type 2 Diabetes', 'GERD'] },
  { title: 'Past Surgeries', icon: 'local_hospital', items: ['Appendectomy (2015)'] },
  { title: 'Current Medications', icon: 'medication', items: ['Amlodipine 5mg', 'Metformin 500mg', 'Omeprazole 20mg'] },
  { title: 'Chronic Conditions', icon: 'monitor_heart', items: ['Hypertension', 'Diabetes'] },
];

const VACCINATIONS = [
  { name: 'COVID-19', doses: '2/2 doses', date: 'Mar 2023', status: 'Completed' },
  { name: 'Influenza (Seasonal)', doses: 'Annual', date: 'Nov 2025', status: 'Completed' },
  { name: 'Tetanus (TT Booster)', doses: '1 dose', date: 'Jan 2024', status: 'Due 2034' },
  { name: 'Hepatitis B', doses: '3/3 doses', date: '2019', status: 'Completed' },
];

function StatTile({ label, value, unit, icon }) {
  return (
    <div className="bg-surface-container-low rounded-lg p-4 flex items-center gap-3 min-w-0">
      <span className="material-symbols-outlined text-primary shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-label-md text-on-surface-variant truncate">{label}</p>
        <p className="font-headline font-bold text-on-surface truncate">
          {value} <span className="text-sm font-normal text-on-surface-variant whitespace-nowrap">{unit}</span>
        </p>
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="material-symbols-outlined text-primary shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-label-md text-on-surface-variant">{label}</p>
        <p className="font-bold text-on-surface truncate">{value}</p>
      </div>
    </div>
  );
}

export default function MedicalRecords() {
  const { patient } = usePatient();
  const p = {
    ...patient,
    allergies: ALLERGIES,
    medicalHistory: MEDICAL_HISTORY,
    vaccinations: VACCINATIONS,
  };
  const initials = p.name.split(' ').map((n) => n[0]).join('');

  return (
    <DashboardLayout
      sidebar={<PatientSidebar />}
      headerProps={{ title: 'Medical Records', subtitle: 'View your medical history and documents' }}
    >
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline text-2xl font-bold">
              {initials}
            </div>
            <div>
              <h3 className="font-headline text-headline-md font-bold text-on-surface">{p.name}</h3>
              <p className="text-on-surface-variant">
                {p.id} · {p.age} yrs · {p.gender} · {p.village}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="primary" icon="bloodtype">{p.bloodGroup}</Badge>
            <Badge variant="success" dot dotColor="bg-primary">Active Patient</Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Patient Details" icon="person" className="lg:col-span-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow label="Full Name" value={p.name} icon="badge" />
            <DetailRow label="Patient ID" value={p.id} icon="pin" />
            <DetailRow label="Gender" value={p.gender} icon="wc" />
            <DetailRow label="Village" value={p.village} icon="home" />
          </div>
        </Card>

        <Card title="Vitals & Body Metrics" icon="monitor_heart" className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatTile label="Blood Group" value={p.bloodGroup} icon="bloodtype" />
            <StatTile label="Age" value={p.age} unit="yrs" icon="calendar_month" />
            <StatTile label="Height" value={p.heightCm} unit="cm" icon="height" />
            <StatTile label="Weight" value={p.weightKg} unit="kg" icon="monitor_weight" />
            <StatTile label="BMI" value={p.bmi} icon="monitoring" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Allergies" icon="warning" className="h-full">
          <div className="space-y-3">
            {p.allergies.map((allergy) => (
              <div key={allergy.name} className="bg-error-container rounded-lg p-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-on-error-container flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">warning</span>
                    {allergy.name}
                  </p>
                  <p className="text-sm text-on-error-container mt-1">{allergy.reaction}</p>
                </div>
                <Badge variant={allergy.severity === 'High' ? 'critical' : 'warning'}>{allergy.severity}</Badge>
              </div>
            ))}
          </div>
          {p.allergies.length === 0 && (
            <p className="text-on-surface-variant">No known allergies.</p>
          )}
        </Card>

        <Card title="Emergency Contact" icon="emergency" className="h-full">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-headline text-xl font-bold shrink-0">
              {p.emergencyContact.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <p className="font-headline text-title-md font-bold text-on-surface">{p.emergencyContact.name}</p>
              <p className="text-on-surface-variant">{p.emergencyContact.relationship}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow label="Primary" value={p.emergencyContact.phone} icon="call" />
            <DetailRow label="Alternate" value={p.emergencyContact.alternate} icon="phone_iphone" />
          </div>
          <div className="mt-4 bg-surface-container-low rounded-lg p-4">
            <DetailRow label="Address" value={p.emergencyContact.address} icon="location_on" />
          </div>
        </Card>
      </div>

      <Card title="Medical History" icon="history" className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {p.medicalHistory.map((section) => (
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

      <Card title="Vaccination History" icon="vaccines">
        <div className="space-y-3">
          {p.vaccinations.map((vaccine) => (
            <div
              key={vaccine.name}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low rounded-lg p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="material-symbols-outlined text-primary shrink-0">vaccines</span>
                <div className="min-w-0">
                  <p className="font-bold text-on-surface truncate">{vaccine.name}</p>
                  <p className="text-label-md text-on-surface-variant">{vaccine.doses} · {vaccine.date}</p>
                </div>
              </div>
              <Badge variant={vaccine.status === 'Completed' ? 'success' : 'warning'}>{vaccine.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}
