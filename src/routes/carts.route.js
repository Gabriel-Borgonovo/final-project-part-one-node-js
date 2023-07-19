import { Router } from "express";
import { authenticated, authorized } from "../config/middlewares/auth.js";
import cartsController from '../controllers/carts.controller.js';


const route = Router();

route.post('/', cartsController.createCart.bind(cartsController));

route.get('/:cid', cartsController.getCartById.bind(cartsController));

route.post("/:cid/products/:pid", authenticated, authorized(['user']), cartsController.addProductToCart.bind(cartsController));

  //Elimina un producto dentro del carrito
route.delete('/:cid/products/:pid', authenticated, authorized(['user']), cartsController.deleteProductInCart.bind(cartsController));


  //Actualiza el carrito con un nuevo array de productos pasados por el body
route.put('/:cid', cartsController.updateAllproductsInCart.bind(cartsController));

//actualiza la propiedad cantidad de un producto determinado que ya se encuentra en el carrito
route.put('/:cid/products/:pid', cartsController.updateQuantity.bind(cartsController));

//Elimina todos los productos del carrito
route.delete('/:cid', cartsController.deleteAllProductsInCart.bind(cartsController));

route.post('/:cid/purchase', authenticated, authorized(['user']), cartsController.generateTicket.bind(cartsController));


export default route; 