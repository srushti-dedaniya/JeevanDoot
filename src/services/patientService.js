import { api, isMockMode } from './api';
import { sleep } from '../utils/helpers';

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
    const { data } = await api.get('/patients');
    return data;
  },

  async getById(id) {
    if (isMockMode()) {
      await sleep(400);
      return MOCK_PATIENTS.find((p) => p.id === id) ?? null;
    }
    const { data } = await api.get(`/patients/${id}`);
    return data;
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
    return data;
  },
};
