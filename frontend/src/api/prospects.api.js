import apiClient from './client';
import { mockProspectsApi } from './mockApi';

const IS_DEMO = !import.meta.env.VITE_API_URL || import.meta.env.VITE_DEMO === 'true';

export const prospectsApi = IS_DEMO
  ? mockProspectsApi
  : {
      list: (filters) =>
        apiClient.get('/prospects', { params: filters }).then((r) => r.data.data),
      getById: (id) =>
        apiClient.get(`/prospects/${id}`).then((r) => r.data.data),
      updateStatus: (id, status) =>
        apiClient.put(`/prospects/${id}`, { status }).then((r) => r.data.data),
    };
