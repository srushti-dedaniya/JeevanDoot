import { api, isMockMode } from './api';
import { sleep } from '../utils/helpers';

const MOCK_USERS = {
  admin: { id: 'adm-1', name: 'Admin Miller', role: 'admin' },
  doctor: { id: 'doc-1', name: 'Dr. Sharma', role: 'doctor' },
  chw: { id: 'chw-1', name: 'Priya Sharma', role: 'chw' },
};

export const authService = {
  async login(role, credentials) {
    if (isMockMode()) {
      await sleep(1200);
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
      return { token: `token-${role}`, user: MOCK_USERS[role] };
    }
    const { data } = await api.post('/auth/login', { role, ...credentials });
    return data;
  },

  async logout() {
    if (isMockMode()) return { success: true };
    const { data } = await api.post('/auth/logout');
    return data;
  },

  async requestAccess(payload) {
    if (isMockMode()) {
      await sleep(1000);
      return { success: true, message: 'Access request submitted' };
    }
    const { data } = await api.post('/auth/request-access', payload);
    return data;
  },

  async verifyToken(token) {
    if (isMockMode()) return { valid: true, user: MOCK_USERS.doctor };
    const { data } = await api.get('/auth/verify', { token });
    return data;
  },
};
