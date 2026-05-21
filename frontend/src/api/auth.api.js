import apiClient from './client';

export const authApi = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }).then((r) => r.data.data),

  getMe: () =>
    apiClient.get('/auth/me').then((r) => r.data.data),

  logout: () =>
    apiClient.post('/auth/logout').then((r) => r.data),
};
