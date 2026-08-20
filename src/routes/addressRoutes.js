import express from 'express';
import {
    createAddress,
    getMyAddresses,
    getAddressById,
    updateAddress,
    deleteAddress
} from '../controllers/addressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All address routes require the user to be logged in
router.use(protect); 

// Route: /api/addresses
router.route('/')
    .post(createAddress)
    .get(getMyAddresses);

// Route: /api/addresses/:id
router.route('/:id')
    .get(getAddressById)
    .put(updateAddress)
    .delete(deleteAddress);

export default router;