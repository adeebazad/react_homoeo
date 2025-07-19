import api from './api';
import { getCookie } from '../utils/cookies';

export const patientService = {
  getPatientRecord: async () => {
    const response = await api.get('/api/patients/record/');
    return response.data;
  },

  getPatientRecordById: async (patientId) => {
    const response = await api.get(`/api/patients/record/${patientId}/`);
    return response.data;
  },

  getAllPatientRecords: async () => {
    const response = await api.get('/api/patients/records/');
    return response.data;
  },

  updatePatientRecord: async (id, data) => {
    const response = await api.patch(`/api/patients/record/${id}/`, data);
    return response.data;
  },

  createUpdateRequest: async (data) => {
    const response = await api.post('/api/patients/updates/', data);
    return response.data;
  },

  getUpdateRequests: async () => {
    const response = await api.get('/api/patients/updates/');
    return response.data;
  },

  approveUpdateRequest: async (id) => {
    const response = await api.post(
      `/api/patients/updates/${id}/approve/`,
      {},
      {
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
        },
      }
    );
    return response.data;
  },

  rejectUpdateRequest: async (id) => {
    const response = await api.post(
      `/api/patients/updates/${id}/reject/`,
      {},
      {
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
        },
      }
    );
    return response.data;
  },
};
