// API Configuration
const API_BASE_URL = 'http://localhost:4000';

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_BASE_URL;
