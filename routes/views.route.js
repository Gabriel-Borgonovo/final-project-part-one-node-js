import { Router } from "express";
import ProductManager from '../data/productManager.js';
import { socketServer } from "../socket/configure-socket.js";
const productManager = new ProductManager('./data/products.json');  

const route = Router();

route.get('/', async (req, res) => {
    const products = await productManager.getProducts(); 
    res.render('index', {
        styles: 'styles',
        products,
    });
});

route.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts(); 
    res.render('realTimeProducts', {
        styles: 'styles',
        products,
    });
});


export default route;