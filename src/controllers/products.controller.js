import { socketServer } from "../socket/configure-socket.js";
import ProductsService from '../dao/services/products.service.js';
import UsersService from "../dao/services/users.service.js";
import emailService from "../dao/services/mail/mail.service.js";



class ProductsController {
  #service;
  #usersService
  constructor(service, usersService) {
    this.#service = service;
    this.#usersService = usersService;
  }

  async getAllProducts(req, res, next) {
    try {
      const products = await this.#service.find();
      res.send({ products });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const productId = req.params.pid;
      const product = await this.#service.findById(productId);

      if (product) {
        res.send(product);
      } else {
        res.status(404).send("Producto no encontrado");
      }
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const product = req.body;
      
      const files = req.files?.map((file) => file.filename);

      if (!files) {
        return res
          .status(400)
          .send({ status: "error", error: "No se pudo cargar las imagenes" });
      }

      product.thumbnail = files;
      product.status = true;
      product.owner = product.email;

      socketServer.emit("Product", product);

      const newProduct = await this.#service.create(product);
      res.send({ product: newProduct });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const idProduct = req.params.pid;
      const nuevosDatos = req.body;
      const productById = await this.#service.findById(idProduct);

      if (!productById) {
        res
          .status(404)
          .send({ error: `Usuario con id ${idProduct} no encontrado` });
        return;
      }

      await this.#service.update(idProduct, nuevosDatos);

      res.send({ ok: true, mensaje: "Producto actualizado correctamente" });
    } catch (error) {
      next(error);
    }
  }


  async deleteProduct(req, res, next) {
    try {
      const productId = req.params.pid;
      const productToDelete = await this.#service.findById(productId);
      if (!productToDelete) {
        res.status(404).send({ error: `Producto con id ${productId} no encontrado` });
        return;
      }
      
      if (productToDelete.owner !== req.user.email) {
        res.status(403).send({ message: 'No tienes permiso para eliminar el producto' });
        return;
      }

      
      await this.#service.delete(productId);
      socketServer.emit("Productdelete", productToDelete);

      const { email } = req.user;

      emailService.sendEmail({
        to: email,
        subject: "Producto eliminado",
        html: `<h1>Hello ${email}!</h1>
          <p>El producto de su pertenencia cuyo id es ${productId} fue eliminado</p>`
      });
  
      res.send({
        ok: true,
        mensaje: `El producto con id ${productId} fue eliminado`,
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new ProductsController(new ProductsService(), new UsersService());
export default controller;