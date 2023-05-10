import { Router } from "express";
import { authenticated, authorized } from "../config/middlewares/auth.js";
import viewsController from '../controllers/views.controller.js';


const route = Router();

route.get('/', viewsController.renderHome.bind(viewsController));

route.get('/products', authenticated, authorized(['user']), viewsController.getProducts.bind(viewsController) );


//route.get('/realtimeproducts', viewsController.getRTProducts.bind(viewsController));

route.get('/chat', viewsController.getChat.bind(viewsController));

/***vista de producto seleccionado por id */

route.get('/products/:id', authenticated, authorized(['user']), viewsController.getProductById.bind(viewsController));


/***vista de carrito seleccionado por id */

route.get('/cart/:userId/:cartId', authenticated, authorized(['user']), viewsController.renderCartById.bind(viewsController));

route.post('/cart', viewsController.postCart.bind(viewsController));

route.get('/register', viewsController.renderRegister.bind(viewsController));

route.get('/login', viewsController.renderLogin.bind(viewsController));


export default route;