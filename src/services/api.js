import { sleep } from '../utils/helpers';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_API !== 'false';

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * Base HTTP client. When USE_MOCK is enabled all requests resolve via
 * the mocked service responses (no network call).
 */
export const api = {
  async request(path, { method = 'GET', body, params } = {}) {
    if (USE_MOCK) {
      await sleep(400 + Math.random() * 400);
      return { data: null, meta: { path, method, params } };
    }

    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : '';

    const response = await fetch(`${BASE_URL}${path}${query}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `Request failed: ${response.statusText}`);
    }

    return response.json();
  },

  get(path, params) {
    return this.request(path, { params });
  },

  post(path, body) {
    return this.request(path, { method: 'POST', body });
  },

  put(path, body) {
    return this.request(path, { method: 'PUT', body });
  },

  delete(path) {
    return this.request(path, { method: 'DELETE' });
  },
};

export const isMockMode = () => USE_MOCK;
