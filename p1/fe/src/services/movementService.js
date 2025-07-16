import api from './api';

const endpoint = 'movements/';

const getAll = () => api.get(endpoint);
const create = data => api.post(endpoint, data);
const update = (id, data) => api.put(`${endpoint}${id}/`, data);
const deleteMovement = id => api.delete(`${endpoint}${id}/`);

export default { getAll, create, update, delete: deleteMovement };
