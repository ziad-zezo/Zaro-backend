import express from 'express';
import { addToCart, getCartItems, removeFromCart, updateCartItem } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', protect, getCartItems);
router.post('/', protect, addToCart);
router.patch('/', protect, updateCartItem);
router.delete('/', protect, removeFromCart)
export default router;