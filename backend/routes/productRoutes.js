import express from 'express';
import { getAllProducts, addProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getAllProducts);
router.post('/', addProduct);

export default router;
