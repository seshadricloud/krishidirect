// filepath: KrishiDirect/KrishiDirect/backend/src/services/orderService.js

import Order from '../models/orderModel';

// Place a new order
export const placeOrder = async (orderData) => {
    try {
        const newOrder = new Order(orderData);
        await newOrder.save();
        return newOrder;
    } catch (error) {
        throw new Error('Error placing order: ' + error.message);
    }
};

// Get order status by ID
export const getOrderStatus = async (orderId) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        return order.status;
    } catch (error) {
        throw new Error('Error fetching order status: ' + error.message);
    }
};

// Export default functions
export default {
    placeOrder,
    getOrderStatus,
};