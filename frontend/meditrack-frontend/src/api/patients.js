import axios from "axios";

const API_URL = "http://localhost:8080/patients";

const getPatientProfile = (id) => {
  return axios.get(`${API_URL}/${id}/profile`);
};

const getPatientAppointments = (id) => {
  return axios.get(`${API_URL}/${id}/appointments`);
};

const patientService = {
  getPatientProfile,
  getPatientAppointments,
};

export default patientService;