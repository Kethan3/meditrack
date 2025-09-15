import axios from "axios";
import "./interceptor"; // Ensure interceptor is set up for JWT token handling

const API_URL = "http://localhost:8080/appointments";

const requestAppointment = (userId, specialization, symptoms, time) => {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('specialization', specialization);
  formData.append('symptoms', symptoms);
  formData.append('time', time);
  return axios.post(`${API_URL}/request`, formData);
};

const acceptAppointment = (appointmentId, userId) => {
  return axios.put(`${API_URL}/${appointmentId}/accept/${userId}`);
};

const rejectAppointment = (appointmentId, userId) => {
  return axios.put(`${API_URL}/${appointmentId}/reject/${userId}`);
};

const completeAppointment = (appointmentId) => {
  return axios.put(`${API_URL}/${appointmentId}/complete`);
};

const getPatientAppointments = (patientId) => {
  return axios.get(`${API_URL}/patient/${patientId}`);
};

const getDoctorAppointments = (doctorId) => {
  return axios.get(`${API_URL}/doctor/${doctorId}`);
};

const appointmentService = {
  requestAppointment,
  acceptAppointment,
  rejectAppointment,
  completeAppointment,
  getPatientAppointments,
  getDoctorAppointments,
};

export default appointmentService;
