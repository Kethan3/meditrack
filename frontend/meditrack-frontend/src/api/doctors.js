import axios from "axios";

const API_URL = "http://localhost:8080/doctors";

const getDoctorProfile = (id) => {
  return axios.get(`${API_URL}/${id}/profile`);
};

const getDoctorAppointments = (id) => {
  return axios.get(`${API_URL}/${id}/appointments`);
};

const getDoctorsBySpecialization = (specialization) => {
  return axios.get(`${API_URL}/search`, { params: { specialization } });
};

const updateDoctorDetails = (userId, details) => {
  return axios.put(`${API_URL}/${userId}/details`, details);
};

const getSpecializations = () => {
  return axios.get(`${API_URL}/specializations`);
};

const doctorService = {
  getDoctorProfile,
  getDoctorAppointments,
  getDoctorsBySpecialization,
  updateDoctorDetails,
  getSpecializations,
};

export default doctorService;

