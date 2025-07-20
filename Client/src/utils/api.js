import axios from 'axios';

// Use environment variable if available, otherwise use production URL
const API_URL = import.meta.env.VITE_API_URL || 'https://feedback-collection-platform-server.onrender.com/api/v1';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/auth/login', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

// Forms API calls
export const createForm = async (formData) => {
  try {
    const response = await api.post('/form/createForm', formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const getAllForms = async () => {
  try {
    const response = await api.get('/form/getAllForms');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const getFormById = async (formId) => {
  try {
    const response = await api.get(`/form/getForm/${formId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const submitFormResponse = async (formId, responseData) => {
  try {
    const response = await api.post(`/form/submit/${formId}`, responseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const getFormResponses = async (formId) => {
  try {
    const response = await api.get(`/form/getFormResponses/${formId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const getFormSummary = async (formId) => {
  try {
    const response = await api.get(`/form/getFormSummary/${formId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const exportFormResponsesCSV = async (formId) => {
  try {
    // Using window.open for CSV download since it's a direct download
    window.open(`${API_URL}/form/export/${formId}`);
    return { success: true };
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};
