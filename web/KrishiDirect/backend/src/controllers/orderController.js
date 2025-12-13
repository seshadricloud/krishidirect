// filepath: KrishiDirect/KrishiDirect/backend/src/controllers/orderController.js

import Order from '../models/orderModel.js';
import { getOrderStatus } from '../services/orderService.js';

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
export const placeOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
    }
};

// @desc    Get order status
// @route   GET /api/orders/:id/status
// @access  Private
export const getOrderStatusById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await getOrderStatus(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get order status', error: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
    }
};