import express from 'express';
import { roleMiddleware } from '../Middlewares/roleMiddleware.js';
import {
    placeOrder,
    getUserOrders,
    getMyOrders,
    updateOrderStatus,
} from '../Controllers/orderController.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Place a new order
router.post('/create', authMiddleware, placeOrder);
// Get all orders (admin only)
router.get('/', authMiddleware, roleMiddleware, getUserOrders);
// Get orders for the authenticated user
router.get('/my-orders', authMiddleware, getMyOrders);
// Update order status (admin only)
router.put('/update/:id', authMiddleware, roleMiddleware, updateOrderStatus);

export default router;
