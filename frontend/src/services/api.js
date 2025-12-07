import axios from 'axios';

const API_URL = `${process.env.API_URL}/api`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const apiService = {
  profiles: {
    getAll: () => apiClient.get('/profiles'),
    create: (name) => apiClient.post('/profiles', { name }),
  },
  events: {
    getAll: (profileIds = null) => {
      const params = profileIds?.length 
        ? { profileIds: profileIds.join(',') }
        : {};
      return apiClient.get('/events', { params });
    },
    getById: (id) => apiClient.get(`/events/${id}`),
    create: (data) => apiClient.post('/events', data),
    update: (id, data) => apiClient.put(`/events/${id}`, data),
    getLogs: (id) => apiClient.get(`/events/${id}/logs`),
  },
};

export default apiClient;

