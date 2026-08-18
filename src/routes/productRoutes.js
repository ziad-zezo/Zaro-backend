import express from 'express';
import { getAllProducts, addNewProduct, updateProduct, getProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();


router.post('/', addNewProduct);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;