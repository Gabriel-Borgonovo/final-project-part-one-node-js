
import { Router } from "express";
import { avatarUploader } from "../utils/avatarUploader.js";
import productsController from '../controllers/products.controller.js';
import { authenticated, authorized } from "../config/middlewares/auth.js";

const route = Router();


route.get('/', productsController.getAllProducts.bind(productsController)); 

route.get('/:pid', productsController.getProductById.bind(productsController));

route.post('/', authenticated, authorized(['premium']), avatarUploader.array('thumbnail', 5), productsController.createProduct.bind(productsController));

route.put('/:pid', productsController.updateProduct.bind(productsController));

route.delete('/:pid', productsController.deleteProduct.bind(productsController));

export default route; 

