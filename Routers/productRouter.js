import express from 'express';
import {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} from '../Controllers/productController.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { roleMiddleware } from '../Middlewares/roleMiddleware.js';

const router = express.Router();

// Route to create a new product (admin only)
router.post('/create', authMiddleware, roleMiddleware, createProduct);
// Route to get all products (accessible to all authenticated users)
router.get('/', getAllProducts);   
// Route to update a product by ID (admin only)
router.put('/update/:id', authMiddleware, roleMiddleware, updateProduct);
// Route to delete a product by ID (admin only)
router.delete('/delete/:id', authMiddleware, roleMiddleware, deleteProduct);

export default router;