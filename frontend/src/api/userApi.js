import axios from 'axios';
import API_BASE_URL from '../config/api';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/user/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/user/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
