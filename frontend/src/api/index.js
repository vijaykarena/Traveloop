import axios from 'axios';

export const API_BASE_URL = 'http://localhost:4000';

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // Trips
  TRIPS: '/trips',
  TRIP_BY_ID: (id) => `/trips/${id}`,
  TRIP_BUDGET: (id) => `/trips/${id}/budget`,
  TRIP_EXPENSES: (id) => `/trips/${id}/expenses`,
  TRIP_TRANSPORT: (id) => `/trips/${id}/transport`,
  TRIP_STOPS: (id) => `/trips/${id}/stops`,
  TRIP_NOTES: (id) => `/trips/${id}/notes`,
  TRIP_PACKING: (id) => `/trips/${id}/packing`,

  // Public trips (no auth)
  PUBLIC_TRIPS: '/trips/public',
  PUBLIC_TRIP_BY_SLUG: (slug) => `/trips/public/${slug}`,

  // Users
  PROFILE: '/users/me',
  SAVED_DESTINATIONS: '/users/me/saved-destinations',

  // Cities & Activities
  CITIES: '/cities',
  CITY_BY_ID: (id) => `/cities/${id}`,
  CITY_ACTIVITIES: (id) => `/cities/${id}/activities`,
  ACTIVITIES: '/activities',
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
