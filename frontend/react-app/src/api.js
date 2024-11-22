import axios from 'axios';

const api = axios.create({
   baseURL: 'https://localhost:8000',
});
api.interceptors.request.use(config => {
   const accessToken = localStorage.getItem('access')

   config.headers.Authorization = `Bearer ${accessToken}`;

   return config;
});

export default api;