import { api, isMockMode } from './api';
import { sleep } from '../utils/helpers';
import {
  toPatientCard,
  toPatientProfile,
  toAppointmentCard,
  toPrescriptionCard,
  toConsultationCard,
  toReportCard,
} from './adapters';

export const MOCK_PATIENTS = [
  {
    id: 'JD-9921',
    name: 'Meera Sharma',
    age: 62,
    gender: 'Female',
    village: 'Amroli',
    complaint: 'Persistent Chest Pain, Shortness of Breath',
    risk: 'Critical',
    status: 'Waiting',
    lastCheckIn: '10 mins ago',
    vitals: { bp: '135/85', temp: '98.6', weight: 58, pulse: 78 },
    summary: [
      'Persistent chest pain for the last 2 days.',
      'Reported mild shortness of breath during exertion.',
      'No fever or cough recorded during initial screening.',
    ],
  },
  {
    id: 'JD-8432',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    village: 'Palia',
    complaint: 'High Fever (102°F), Body Aches',
    risk: 'Moderate',
    status: 'In Review',
    lastCheckIn: '25 mins ago',
    vitals: { bp: '128/82', temp: '102', weight: 70, pulse: 92 },
  },
  {
    id: 'JD-7721',
    name: 'Laxmi Verma',
    age: 29,
    gender: 'Female',
    village: 'Amroli',
    complaint: 'Follow-up: Prenatal Checkup',
    risk: 'Low',
    status: 'Scheduled',
    lastCheckIn: '1 hour ago',
    vitals: { bp: '118/76', temp: '98.2', weight: 61, pulse: 82 },
  },
  {
    id: 'JD-1209',
    name: 'Gopal Prasad',
    age: 78,
    gender: 'Male',
    village: 'Devgram',
    complaint: 'Acute Abdominal Pain, Vomiting',
    risk: 'Critical',
    status: 'Waiting',
    lastCheckIn: '5 mins ago',
    vitals: { bp: '142/90', temp: '99.1', weight: 54, pulse: 88 },
  },
  {
    id: 'JD-4439',
    name: 'Arjun Singh',
    age: 12,
    gender: 'Male',
    village: 'Palia',
    complaint: 'Severe Allergic Reaction (Skin Rash)',
    risk: 'Moderate',
    status: 'In Review',
    lastCheckIn: '15 mins ago',
    vitals: { bp: '110/70', temp: '98.8', weight: 35, pulse: 96 },
  },
];

export const patientService = {
  async getAll() {
    if (isMockMode()) {
      await sleep(600);
      return MOCK_PATIENTS;
    }
    const { data } = await api.get('/patients', { limit: 100 });
    return (data || []).map(toPatientCard);
  },

  async getById(id) {
    if (isMockMode()) {
      await sleep(400);
      return MOCK_PATIENTS.find((p) => p.id === id) ?? null;
    }
    if (!id) return null;
    const { data } = await api.get('/patients', { search: id, limit: 50 });
    const match = (data || []).find((p) => p.patientId === id);
    return match ? toPatientCard(match) : null;
  },

  async resolveId(patientId) {
    if (isMockMode()) return patientId;
    if (!patientId) return null;
    const { data } = await api.get('/patients', { search: patientId, limit: 10 });
    const match = (data || []).find((p) => p.patientId === patientId);
    return match?._id || null;
  },

  async getMyProfile() {
    const { data } = await api.get('/patients/me');
    return toPatientProfile(data);
  },

  async updateMyProfile(patch) {
    const { data } = await api.put('/patients/me', patch);
    return toPatientProfile(data);
  },

  async getMyAppointments() {
    const { data } = await api.get('/patients/me/appointments', { limit: 100 });
    return (data || []).map(toAppointmentCard);
  },

  async getMyPrescriptions() {
    const { data } = await api.get('/patients/me/prescriptions');
    return (data || []).map(toPrescriptionCard);
  },

  async getMyConsultations() {
    const { data } = await api.get('/patients/me/consultations');
    return (data || []).map(toConsultationCard);
  },

  async getMyReports() {
    const { data } = await api.get('/patients/me/reports');
    return (data || []).map(toReportCard);
  },

  async search(query) {
    const all = await this.getAll();
    const term = query.toLowerCase();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term)
    );
  },

  async create(payload) {
    if (isMockMode()) {
      await sleep(500);
      return { ...payload, id: `JD-${Math.floor(Math.random() * 9000) + 1000}` };
    }
    const { data } = await api.post('/patients', payload);
    return toPatientCard(data);
  },
};
