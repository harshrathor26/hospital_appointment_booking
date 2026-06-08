import API from './api';

const AppointmentService = {
  async bookAppointment(data) {
    const response = await API.post('/appointments/book', data);
    return response.data;
  },

  async getPatientAppointments(patientId) {
    const response = await API.get(`/appointments/patient/${patientId}`);
    return response.data;
  },

  async getDoctorAppointments(doctorId) {
    const response = await API.get(`/appointments/doctor/${doctorId}`);
    return response.data;
  },

  async updateStatus(appointmentId, status) {
    const response = await API.put(
      `/appointments/${appointmentId}/status?status=${status}`
    );
    return response.data;
  },
};

export default AppointmentService;
