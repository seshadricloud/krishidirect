import api from './apiClient';

// Fetch all farmers
export const getFarmers = async () => {
  try {
    const response = await api.get('/farmers');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching farmers: ' + error.message);
  }
};

// Fetch a single farmer by ID
export const getFarmerById = async (id) => {
  try {
    const response = await api.get(`/farmers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching farmer: ' + error.message);
  }
};

// Additional functions related to farmers can be added here
export default {
  getFarmers,
  getFarmerById,
};