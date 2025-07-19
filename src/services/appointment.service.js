import api from './api';

export const appointmentService = {  getDoctors: async () => {
    const response = await api.get('/api/accounts/doctors/?no_page=true');
    return response.data;
  },

  getAppointments: async () => {
    const response = await api.get('/api/appointments/');
    return response.data;
  },

  createAppointment: async (data) => {
    const response = await api.post('/api/appointments/', data);
    return response.data;
  },

  updateAppointment: async (id, data) => {
    const response = await api.patch(`/api/appointments/${id}/`, data);
    return response.data;
  },

  deleteAppointment: async (id) => {
    const response = await api.delete(`/api/appointments/${id}/`);
    return response.data;
  },

  approveAppointment: async (id) => {
    const response = await api.post(`/api/appointments/${id}/approve/`);
    return response.data;
  },

  rejectAppointment: async (id) => {
    const response = await api.post(`/api/appointments/${id}/reject/`);
    return response.data;
  },

  cancelAppointment: async (id) => {
    const response = await api.post(`/api/appointments/${id}/cancel/`);
    return response.data;
  },

  completeAppointment: async (id) => {
    const response = await api.post(`/api/appointments/${id}/complete/`);
    return response.data;
  },
};
