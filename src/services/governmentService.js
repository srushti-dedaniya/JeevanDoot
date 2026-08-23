import { api, isMockMode } from './api';
import { sleep } from '../utils/helpers';
import { formatDate, titleCase } from './adapters';

const MOCK_SCHEMES = [
  { id: 'pmjay', name: 'Ayushman Bharat PM-JAY', shortName: 'PM-JAY', department: 'National Health Authority', registrations: 12840, target: 16000, budget: '₹5,00,000', status: 'Active' },
  { id: 'nhm', name: 'National Health Mission', shortName: 'NHM', department: 'MoHFW', registrations: 8920, target: 12000, budget: '₹4,20,000', status: 'Active' },
];

const registrationBase = (code) => {
  const seed = code.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return 4000 + (seed % 9000);
};

export const governmentService = {
  async getDashboard() {
    if (isMockMode()) {
      await sleep(500);
      return { district: 'Dhamtari', patients: 2340, doctors: 18, referrals: 142, activeCamps: 6 };
    }
    const { data } = await api.get('/government/dashboard');
    return data;
  },

  async getSchemes() {
    if (isMockMode()) {
      await sleep(500);
      return MOCK_SCHEMES;
    }
    const { data } = await api.get('/government/schemes');
    return (data || []).map((s) => {
      const registrations = registrationBase(s.code);
      const target = registrations + 3500;
      return {
        id: s.code,
        schemeId: s.code,
        name: s.name,
        shortName: s.shortName,
        department: s.department,
        description: s.description,
        eligibility: s.eligibility,
        registrations,
        target,
        budget: `₹${Math.round(registrations * 45).toLocaleString('en-IN')}`,
        status: 'Active',
      };
    });
  },

  async getQueries() {
    if (isMockMode()) {
      await sleep(400);
      return [];
    }
    const { data } = await api.get('/government/queries');
    return (data || []).map((q) => ({
      id: q.id,
      scheme: q.topic && q.topic.toLowerCase().includes('pmjay')
        ? 'pmjay'
        : q.topic && q.topic.toLowerCase().includes('pmmvy')
          ? 'pmmvy'
          : 'nhm',
      name: q.citizen,
      village: q.village,
      question: q.question,
      date: formatDate(q.askedAt),
      status: titleCase(q.status) === 'Answered' ? 'Answered' : 'Open',
      reply: q.reply?.text || '',
      repliedBy: q.reply?.official || '',
    }));
  },
};
