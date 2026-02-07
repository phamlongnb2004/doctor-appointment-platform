import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User API
export const userAPI = {
  login: (email, password) => api.post('/users/login', { email, password }),
  register: (userData) => api.post('/users/register', userData),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  getAllUsers: () => api.get('/users'),
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Image upload endpoints
  uploadProfileImage: (id, file) => {
    console.log('Uploading profile image for user:', id);
    const formData = new FormData();
    formData.append('image', file);
    console.log('File:', file.name, file.size, file.type);
    return api.post(`/users/${id}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadCoverImage: (id, file) => {
    console.log('Uploading cover image for user:', id);
    const formData = new FormData();
    formData.append('image', file);
    console.log('File:', file.name, file.size, file.type);
    return api.post(`/users/${id}/cover-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Admin only endpoints
  getUserStats: () => api.get('/users/stats'),
  getAllDoctors: () => api.get('/users/doctors'),
  getAllPatients: () => api.get('/users/patients'),

  // Online status endpoints
  getOnlineUsersCount: () => api.get('/users/online/count'),
  getOnlineUsers: () => api.get('/users/online'),
  getUsersOnlineStatus: (userIds) => api.post('/users/online/status', { userIds }),
  isUserOnline: (userId) => api.get(`/users/${userId}/online`),
  logout: (userId) => api.post('/users/logout', { userId }),
};

// Doctor API
export const doctorAPI = {
  getAllDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  getActiveDoctors: () => api.get('/doctors/active/all'),
  getDoctorsBySpecialization: (specialization) =>
    api.get(`/doctors/specialization/${specialization}`),
  createDoctor: (doctorData) => api.post('/doctors', doctorData),
  updateDoctor: (id, doctorData) => api.put(`/doctors/${id}`, doctorData),
  deleteDoctor: (id) => api.delete(`/doctors/${id}`),
};

// Appointment API
export const appointmentAPI = {
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  getAllAppointments: () => api.get('/appointments'),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  getAppointmentsByPatient: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getAppointmentsByDoctor: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  getAppointmentsByStatus: (status) => api.get(`/appointments/status/${status}`),
  updateAppointment: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  updateAppointmentStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
  cancelAppointment: (id) => api.put(`/appointments/${id}/cancel`),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
};

// Review API
export const reviewAPI = {
  createReview: (reviewData) => api.post('/reviews', reviewData),
  getAllReviews: () => api.get('/reviews'),
  getReviewById: (id) => api.get(`/reviews/${id}`),
  getReviewsByDoctor: (doctorId) => api.get(`/reviews/doctor/${doctorId}`),
  getReviewsByPatient: (patientId) => api.get(`/reviews/patient/${patientId}`),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export default api;
