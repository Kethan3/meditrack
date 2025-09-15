import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Adjust if backend runs on different port

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password
    });
    const { token, username: user, role, userId } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ username: user, role }));
    localStorage.setItem('userId', userId);
    return { success: true, user: { username: user, role, userId } };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Login failed' };
  }
};

export const signup = async (username, email, password, role, phone, dateOfBirth, specialization) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
      username,
      email,
      password,
      role,
      phone,
      dateOfBirth,
      specialization
    });
    return { success: true, user: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Signup failed' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};