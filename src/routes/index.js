import { Router } from 'express';
import authRoutes from './auth.route.js';
import cartsRoutes from './carts.route.js';
import productsRoutes from './products.route.js';
import usersRoutes from './users.route.js';
import ticketRoutes from './ticket.route.js';


const router = Router();

router.use('/products', productsRoutes);
router.use('/carts', cartsRoutes);
router.use('/users', usersRoutes);
router.use('/auth', authRoutes);
router.use('/ticket', ticketRoutes);



export default router;