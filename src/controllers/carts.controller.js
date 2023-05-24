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

      const productIndex = cart.products.findIndex(
        // Verifico si el producto ya existe en el carrito
        (p) => String(p.product._id) === pid
      );

      if (productIndex === -1) {
        // Si el producto no existe en el carrito, enviar un error
        res.status(404).send({
          error: `El producto con id ${pid} no fue encontrado en el carrito con id ${cid}`,
        });
        return;
      }

      cart.products.splice(productIndex, 1); // Si el producto existe, eliminarlo del array de productos del carrito

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
      const { product, quantity } = req.body;

      const cart = await this.#cartService.findById(cid);

      const cartProduct = cart.products.find((p) => p.product._id.equals(pid));

      if (!cartProduct) {
        return res
          .status(404)
          .send({ error: "Producto no encontrado en el carrito" });
      }

      // Verificar que los IDs coincidan
      if (cartProduct.product._id.toString() !== product) {
        return res
          .status(400)
          .send({ error: "No se permite cambiar el ID del producto" });
      }

      cartProduct.quantity = quantity;

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












  async generateTicket(req, res, next) {
    try {
      const { cid } = req.params;
      //console.log('cid ticket function', cid)

      // Verificar si el carrito existe
      const cart = await this.#cartService.findById(cid);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      //console.log('cart', cart)

      // Crear el ticket
      const ticketData = {
        code: generateUniqueCode(), // Genera un código único para el ticket
        purchase_datetime: new Date(),
        amount: calculateTotalAmount(cart.products), // Calcula el monto total de la compra
        purchaser: req.user.email, // Puedes ajustar esto según la estructura de tu usuario
      };

      //console.log('ticket data', ticketData)

      // Generar el ticket utilizando el servicio TicketService
      const ticket = await this.#ticketService.generateTicket(ticketData);
      console.log('ticket', ticket)

       // Restar el stock de los productos comprados
      await this.subtractStockFromProducts(cart.products);

       // Realizar otras acciones necesarias para finalizar la compra
 
       // Retornar la respuesta con el ticket generado
       res.status(200).json({ ticket: ticket });

    } catch (error) {
      next(error);
    }
  }

  async subtractStockFromProducts(products) {
    // Recorrer los productos del carrito y restar el stock
    for (const productItem of products) {
      const product = await this.#productsService.findById(productItem.product);
      
      if (product) {
        product.stock -= productItem.quantity;
        await this.#productsService.update(product._id, product);
      }
    }
  }


}

const controller = new CartsController(new CartsService(), new ProductsService(), new TicketService());
export default controller;




// Función para generar un código único para el ticket
function generateUniqueCode() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000); // Número aleatorio entre 0 y 999

  const uniqueCode = `${timestamp}${randomNum}`;
  return uniqueCode;
}

// Función para calcular el monto total de la compra en base a los productos del carrito
function calculateTotalAmount(products) {
  const products2 = products
  console.log('products', products2)
  let totalAmount = 0;
  for (const productItem of products2) {
    const product = productItem.product;
    const quantity = productItem.quantity;
    totalAmount += product.price * quantity;
  }
  return totalAmount;
}