import CartsService from '../dao/services/carts.service.js';
import ProductsService from '../dao/services/products.service.js';
import TicketService from '../dao/services/ticket.service.js';

class CartsController {
  #cartService;
  #productsService;
  #ticketService;
  constructor(cartService, productsService, ticketService) {
    this.#cartService = cartService;
    this.#productsService = productsService;
    this.#ticketService = ticketService;
  }

  async createCart(req, res, next) {
    try {
      const newCart = await this.#cartService.create();
      res.send({ cart: newCart });
    } catch (error) {
      next(error);
    }
  }

  async getCartById(req, res, next) {
    try {
      const cartId = req.params.cid;
      const cart = await this.#cartService.findById(cartId);

      if (cart.length === 0) {
        res
          .status(404)
          .send({ error: `El Carrito con id ${cartId} no fue encontrado` });
        return;
      }

      res.status(201).send({ cart });
    } catch (err) {
      next(err);
    }
  }

  async addProductToCart(req, res, next) {
    try {
      const { cid, pid } = req.params;
      const quantity = req.body.quantity || 1;
      let cart = await this.#cartService.findById(cid);
      const product = await this.#productsService.findById(pid);
      //console.log('product enviado al carrito', product)
      product.stock--;
      await this.#productsService.update(pid, product);

      // Verificar si el producto ya existe en el carrito
      const productIndex = cart.products.findIndex(
        (p) => String(p.product._id) === pid
      );

      if (productIndex === -1) {
        // Si el producto no existe, agregarlo con una cantidad de 1
        cart.products.push({ product: product._id, quantity: 1 });

        cart.total = cart.total + product.price;

      } else {
        // Si el producto ya existe, aumentar la cantidad
        cart.products[productIndex].quantity += 1;
      }


      await this.#cartService.update(cid, cart);

      res.send({ cart: cart });
    } catch (error) {
      next(error);
    }
  }

  async deleteProductInCart(req, res, next) {
    try {
      const { cid, pid } = req.params;
      const cart = await this.#cartService.findById(cid);

      const cartProduct = cart.products.find((p) => p._id.equals(pid));

      const p_id = cartProduct.product._id; 

      const productDeBBDD = await this.#productsService.findById(p_id);
      productDeBBDD.stock = productDeBBDD.stock + cartProduct.quantity;

      await this.#productsService.update(p_id, productDeBBDD);

      const productIndex = cart.products.findIndex(
        // Verifico si el producto ya existe en el carrito
        (p) => String(p._id) === pid
      );

      if (productIndex === -1) {
        // Si el producto no existe en el carrito, enviar un error
        res.status(404).send({
          error: `El producto con id ${pid} no fue encontrado en el carrito con id ${cid}`,
        });
        return;
      }

      cart.products.splice(productIndex, 1); // Si el producto existe, eliminarlo del array de productos del carrito
 
      const totalPrice = cart.products.reduce((acc, product) => {
        return acc + product.product.price * product.quantity;
      }, 0);
  
      cart.total = totalPrice;
      

      await this.#cartService.update(cid, cart);

      res.send({
        message: `El producto con id ${pid} fue eliminado del carrito con id ${cid}`,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAllproductsInCart(req, res, next) {
    try {
      const { cid } = req.params;
      const { products } = req.body;

      //const cart = await cartsManager.getCartById(cid);
      const cart = await this.#cartService.findById(cid);

      cart.products = products; // Actualizar el arreglo de productos del carrito con el nuevo arreglo de productos

      //await cartsManager.updateCart(cid, cart);
      await this.#cartService.update(cid, cart);

      res.send(cart);
    } catch (error) {
      next(error);
    }
  }

  async updateQuantity(req, res, next) {
    try {
      const { cid, pid } = req.params;
      const cart = await this.#cartService.findById(cid);
      //console.log('cart', cart);
      const cartProduct = cart.products.find((p) => p._id.equals(pid));

      if (!cartProduct) {
        return res
          .status(404)
          .send({ error: "Producto no encontrado en el carrito" });
      }

      //suma la cantidad de uno en uno y le resta al stock del producto en la base de datos
      if(cartProduct.quantity >= 1 && cartProduct.product.stock !== 0){
        cartProduct.quantity ++;
        cartProduct.total = cartProduct.quantity * cartProduct.product.price;

        //console.log('cart', cart)

        const p_id = cartProduct.product._id; 
        const productWithMinusQuantity = await this.#productsService.findById(p_id);
        productWithMinusQuantity.stock--;

        await this.#productsService.update(p_id, productWithMinusQuantity);

      
      } else {
        return res
          .status(400)
          .send({ error: "No hay más en stock"});
      }

      const totalPrice = cart.products.reduce((acc, product) => {
        return acc + product.product.price * product.quantity;
      }, 0);
  
      cart.total = totalPrice;

      await this.#cartService.update(cid, cart);

      res.send(cart);
    } catch (error) {
      next(error);
    }
  }


  async restQuantity(req, res, next) {
    try {
      const { cid, pid } = req.params;
      //console.log(cid, pid);
      const cart = await this.#cartService.findById(cid);
      const cartProduct = cart.products.find((p) => p._id.equals(pid));

      if (!cartProduct) {
        return res
          .status(404)
          .send({ error: "Producto no encontrado en el carrito" });
      }

      if(cartProduct.quantity > 1 ){
        cartProduct.quantity --;
        cartProduct.total = cartProduct.quantity * cartProduct.product.price;

        const p_id = cartProduct.product._id; 
        const productWithPlusQuantity = await this.#productsService.findById(p_id);
        productWithPlusQuantity.stock++;

        await this.#productsService.update(p_id, productWithPlusQuantity);

      
      } else {
        return res
          .status(400)
          .send({ error: "No hay más en stock"});
      }

      const totalPrice = cart.products.reduce((acc, product) => {
        return acc + product.product.price * product.quantity;
      }, 0);
  
      cart.total = totalPrice;

      await this.#cartService.update(cid, cart);

      res.send(cart);

    } catch (error) {
      next(error);
    }
  }



  async deleteAllProductsInCart(req, res, next) {
    try {
      const { cid } = req.params;

      const cart = await this.#cartService.findById(cid);
      cart.products = []; // Eliminar todos los productos

      await this.#cartService.update(cid, cart);

      res.send(cart);
    } catch (error) {
      next(error);
    }
  }



}

const controller = new CartsController(new CartsService(), new ProductsService(), new TicketService());
export default controller;




