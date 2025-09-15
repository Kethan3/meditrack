import axios from "axios";

const API_URL = "http://localhost:8080/admin";

const getPendingDoctors = () => {
  return axios.get(`${API_URL}/pending-doctors`);
};

const verifyDoctor = (userId) => {
  return axios.put(`${API_URL}/verify-doctor/${userId}`);
};

const adminService = {
  getPendingDoctors,
  verifyDoctor,
};

export default adminService;
