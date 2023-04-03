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

  //Elimina un producto dentro del carrito
route.delete('/:cid/products/:pid', async (req, res, next) => {
  try {
    const { cid, pid } = req.params; 

    const cart = await cartsManager.getCartById(cid); 
        
    const productIndex = cart.products.findIndex( // Verifico si el producto ya existe en el carrito
      (p) => String(p.product._id) === pid
    );

    if (productIndex === -1) { // Si el producto no existe en el carrito, enviar un error
      res.status(404).send({ error: `El producto con id ${pid} no fue encontrado en el carrito con id ${cid}` });
      return;
    }

    cart.products.splice(productIndex, 1); // Si el producto existe, eliminarlo del array de productos del carrito
      
    
    await cartsManager.updateCart(cid, cart); // Guardar el carrito actualizado

     res.send({ message: `El producto con id ${pid} fue eliminado del carrito con id ${cid}` });
  } catch (error) {
    next(error);
  }
});


  //Actualiza el carrito con un nuevo array de productos pasados por el body
route.put('/:cid', async (req, res, next) => {
  try {
    const { cid } = req.params; 
    const { products } = req.body; 
  
    const cart = await cartsManager.getCartById(cid); 
      
    cart.products = products; // Actualizar el arreglo de productos del carrito con el nuevo arreglo de productos
  
    await cartsManager.updateCart(cid, cart); // Actualizar el carrito en la base de datos
      
    res.send(cart); 
  } catch (error) {
    next(error);
  }
});

//actualiza la propiedad cantidad de un producto determinado que ya se encuentra en el carrito
route.put('/:cid/products/:pid', async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { product, quantity } = req.body;

    const cart = await cartsManager.getCartById(cid);

    const cartProduct = cart.products.find(p => p.product._id.equals(pid));

    if (!cartProduct) {
      return res.status(404).send({error:'Producto no encontrado en el carrito'});
    }

    // Verificar que los IDs coincidan
    if (cartProduct.product._id.toString() !== product) {
      return res.status(400).send({ error: 'No se permite cambiar el ID del producto' });
    }

    cartProduct.quantity = quantity;

    await cartsManager.updateCart(cid, cart);

    res.send(cart);

  } catch (error) {
    next(error);
  }
});

//Elimina todos los productos del carrito
route.delete('/:cid', async (req, res, next) => {
  try {
    const { cid } = req.params;

    const cart = await cartsManager.getCartById(cid);
    cart.products = []; // Eliminar todos los productos

    await cartsManager.updateCart(cid, cart);

    res.send(cart);

  } catch (error) {
    next(error);
  }
});

export default route; 