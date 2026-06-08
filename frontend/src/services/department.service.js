import API from './api';

const DepartmentService = {
  async getAllDepartments() {
    const response = await API.get('/departments');
    return response.data;
  },
};

export default DepartmentService;
