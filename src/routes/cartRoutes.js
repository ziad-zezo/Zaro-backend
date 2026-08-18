import express from 'express';
import { addToCart, clearCart, getCartItems, removeFromCart, updateCartItem } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', protect, getCartItems);
router.post('/', protect, addToCart);
router.patch('/', protect, updateCartItem);
router.delete('/:productId', protect, removeFromCart)
router.delete('/', protect, clearCart)
export default router;