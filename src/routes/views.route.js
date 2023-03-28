import { Router } from "express";
import { socketServer } from "../socket/configure-socket.js";
import productsManager from "../dao/products.manager.js"; 

const route = Router();

route.get('/', async (req, res) => {
    const products = await productsManager.getAll(); 
    res.render('index', {
        styles: 'styles',
        products,
    });
});

route.get('/realtimeproducts', async (req, res) => {
    const products = await productsManager.getAll(); 

    res.render('realTimeProducts', {
        styles: 'styles',
        products,
    });
});

route.get('/chat', async (req, res) => {
    res.render('chat', {
        styles: 'styles',
    });
});


export default route;