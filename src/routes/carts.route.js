import { Router } from "express";
import productsManager from "../dao/products.manager.js";
import cartsManager from "../dao/carts.manager.js";

const route = Router();

route.post('/', async (req, res, next) => {
    try {
      const newCart = await cartsManager.createCart();
      console.log(newCart)
      res.send({ cart: newCart });
    } catch (error) {
      next(error);
    }

});

route.get('/:cid', async (req, res, next) => {
    const cartId = req.params.cid;

  try {
    const cart = await cartsManager.getCartById(cartId);

    if (cart.length === 0) {
      res.status(404).send({ error: `El Carrito con id ${cartId} no fue encontrado` });
      return;
    }

    res.status(201).send({cart});
  } catch (err) {
    next(err);
  }

});


route.post("/:cid/product/:pid", async (req, res, next) => {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;

    try {
      let cart = await cartsManager.getCartById(cid);
      
      // Buscar el producto por su pid
      const product = await productsManager.getProductById(pid);

      // Verificar si el producto ya existe en el carrito
      const productIndex = cart.products.findIndex(
        (p) => String(p.product._id) === pid
      );

      if (productIndex === -1) {
        // Si el producto no existe, agregarlo con una cantidad de 1
        cart.products.push({ product: product._id, quantity: 1 });
      } else {
        // Si el producto ya existe, aumentar la cantidad
        cart.products[productIndex].quantity += 1;
      }

      // Guardar el carrito actualizado
      await cartsManager.updateCart(cid, cart);

      res.send({ cart: cart });

    } catch (error) {
      next(error)
    }
    
  });

export default route; 