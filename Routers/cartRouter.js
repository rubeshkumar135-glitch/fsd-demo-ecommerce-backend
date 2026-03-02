import express from "express"
import {authMiddleware} from "../Middlewares/authMiddleware.js"
import { 
    addToCart,
    viewCart,
    removeFromCart,
    updateCartItem,
} from "../Controllers/cartController.js"

const router = express.Router();


// Add to cart 
router.post("/add", authMiddleware, addToCart);
// Remove to cart
router.delete("/remove/:productId", authMiddleware, removeFromCart);
// Update to cart
router.put("/update/:productId", authMiddleware, updateCartItem);
// View to cart items
router.get("/view", authMiddleware, viewCart);

export default router;