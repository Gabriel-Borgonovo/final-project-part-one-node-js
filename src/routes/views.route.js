import { Router } from "express";
import { authenticated, authorized } from "../config/middlewares/auth.js";
import viewsController from '../controllers/views.controller.js';


const route = Router();

route.get('/', viewsController.renderHome.bind(viewsController));

route.get('/products', authenticated, authorized(['user', 'admin', 'premium']), viewsController.getProducts.bind(viewsController) );


//route.get('/realtimeproducts', viewsController.getRTProducts.bind(viewsController));

route.get('/chat',authenticated, authorized(['user']), viewsController.getChat.bind(viewsController));

/***vista de producto seleccionado por id */

route.get('/products/:id', authenticated, authorized(['user']), viewsController.getProductById.bind(viewsController));


/***vista de carrito seleccionado por id */

route.get('/cart/:userId/:cartId', authenticated, authorized(['user']), viewsController.renderCartById.bind(viewsController));

route.post('/cart', viewsController.postCart.bind(viewsController));

route.get('/register', viewsController.renderRegister.bind(viewsController));

route.get('/login', viewsController.renderLogin.bind(viewsController));

route.get('/restore-password', viewsController.restorePassword.bind(viewsController));

route.get('/restore-password/form/:email', viewsController.restorePasswordForm.bind(viewsController));

route.get('/add-new-product', authenticated, authorized(['premium']), viewsController.addProductForm.bind(viewsController));

route.get('/pagar/:cid', authenticated, authorized(['user']), viewsController.pagarCompra.bind(viewsController));

route.get('/upload-docs', authenticated, authorized(['user']), viewsController.uploadDocs.bind(viewsController));

route.get('/users', authenticated, authorized(['admin']), viewsController.renderUsers.bind(viewsController));

export default route;