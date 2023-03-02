import { Router } from "express";
import CartManager from '../data/cartManager.js';
const cartManager = new CartManager('./data/cart.json');

import ProductManager from '../data/productManager.js'
const productManager = new ProductManager('./data/products.json');  

const route = Router();

route.post('/', async (req, res) => {
    try {
        await cartManager.createCart();
        res.status(201).send({ ok: true, mensaje: 'Carrito creado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ ok: false, mensaje: 'Error al crear el carrito' });
    }
});

route.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCartById(cartId);

    if (cart.length === 0) {
      res.status(404).send({ error: `El Carrito con id ${cartId} no fue encontrado` });
      return;
    }

    res.status(201).send(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'No se pudo recuperar el carrito' });
  }

});


route.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;

    const carts = await cartManager.getCarts();

    const cartExist = carts.find(c => c.id === cid);
    if(!cartExist){
        res.status(400).send({ ok: false, mensaje: 'El carrito no existe' });
        return;
    }

    const pidNum = Number(pid);

    const products = await productManager.getProducts();
    const productExist = products.find(p => p.id === pidNum);

    if(productExist){  
        const cart = await cartManager.addProduct(cid, pid, quantity);
        res.status(201).send({ ok: true, mensaje: "Producto agregado al carrito", cart: cart });   
    } else{
        res.status(404).send({ ok: false, mensaje: 'El producto no existe' });
        return;
    }
    
  });

export default route; 