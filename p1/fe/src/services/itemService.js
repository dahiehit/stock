import api from './api';

const itemService = {
  getAll: () => api.get('items/'),
  create: (data) => api.post('items/', data),
  update: (id, data) => api.put(`items/${id}/`, data),
  delete: (id) => api.delete(`items/${id}/`),
};

export default itemService;
