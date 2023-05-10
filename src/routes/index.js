import { Router } from 'express';
import authRoutes from './auth.route.js';
import cartsRoutes from './carts.route.js';
import productsRoutes from './products.route.js';
import usersRoutes from './users.route.js';

const router = Router();

router.use('/products', productsRoutes);
router.use('/carts', cartsRoutes);
router.use('/users', usersRoutes);
router.use('/auth', authRoutes);


export default router;