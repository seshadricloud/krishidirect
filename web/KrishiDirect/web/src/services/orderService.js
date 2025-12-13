// filepath: /KrishiDirect/KrishiDirect/web/src/services/orderService.js

import api from './apiClient';

/**
 * Place a new order.
 * @param {Object} orderData - The data for the order to be placed.
 * @returns {Promise} - The API response.
 */
export const placeOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Get the status of an existing order.
 * @param {string} orderId - The ID of the order to retrieve the status for.
 * @returns {Promise} - The API response containing the order status.
 */
export const getOrderStatus = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};