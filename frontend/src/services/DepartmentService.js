import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/departments';

export const listDepartments = () => axios.get(API_BASE_URL);

export const getDepartment = (id) => axios.get(`${API_BASE_URL}/${id}`);

export const createDepartment = (department) => axios.post(API_BASE_URL, department);

export const updateDepartment = (id, department) => axios.put(`${API_BASE_URL}/${id}`, department);

export const deleteDepartment = (id) => axios.delete(`${API_BASE_URL}/${id}`);
