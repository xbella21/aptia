import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = Bearer ${	oken};
  return cfg;
});

export default api;
