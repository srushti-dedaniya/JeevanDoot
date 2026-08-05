import { api, isMockMode } from './api';
import { sleep } from '../utils/helpers';

const MOCK_REGIONS = [
  { name: 'Oak Ridge Cluster', disease: 'Malaria', stage: 2, newCases: 24, growth: 14, coords: [45, 30] },
  { name: 'North-East Highlands', disease: 'Dengue', stage: 1, newCases: 8, growth: 4, coords: [60, 20] },
  { name: 'Western River Basin', disease: 'Cholera', stage: 0, newCases: 3, growth: 1, coords: [25, 60] },
];

export const mapService = {
  async getSurveillance() {
    if (isMockMode()) {
      await sleep(700);
      return {
        totalCases: 4129,
        activeOutbreaks: 12,
        regions: MOCK_REGIONS,
      };
    }
    const { data } = await api.get('/surveillance');
    return data;
  },

  async getClusters(params) {
    if (isMockMode()) {
      await sleep(500);
      return MOCK_REGIONS;
    }
    const { data } = await api.get('/surveillance/clusters', params);
    return data;
  },

  async getWorkersMap() {
    if (isMockMode()) {
      await sleep(500);
      return [
        { cluster: 'Dhamtari Cluster', workers: 12, coverage: 92 },
        { cluster: 'Bijapur Sector', workers: 8, coverage: 74 },
        { cluster: 'Lormi Block', workers: 10, coverage: 88 },
      ];
    }
    const { data } = await api.get('/workers/map');
    return data;
  },
};
