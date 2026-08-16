import express from 'express';
import { getAllProducts, addNewProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', addNewProduct);

export default router;