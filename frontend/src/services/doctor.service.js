import API from './api';

const DoctorService = {
  async getAllDoctors() {
    const response = await API.get('/doctors');
    return response.data;
  },

  async getDoctorsByDepartment(departmentId) {
    const response = await API.get(`/doctors/department/${departmentId}`);
    return response.data;
  },
};

export default DoctorService;
