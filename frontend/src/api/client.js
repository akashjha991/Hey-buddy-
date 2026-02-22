import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
});

export const setToken = (token) => {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';
};
