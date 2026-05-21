import apiClient from './client';
import { mockAuthApi } from './mockApi';

const IS_DEMO = !import.meta.env.VITE_API_URL || import.meta.env.VITE_DEMO === 'true';

export const authApi = IS_DEMO
  ? mockAuthApi
  : {
      login: (email, password) =>
        apiClient.post('/auth/login', { email, password }).then((r) => r.data.data),
      getMe: () =>
        apiClient.get('/auth/me').then((r) => r.data.data),
      logout: () =>
        apiClient.post('/auth/logout').then((r) => r.data),
    };
