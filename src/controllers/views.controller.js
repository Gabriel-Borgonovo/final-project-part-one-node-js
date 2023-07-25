import UsersService from "../dao/services/users.service.js";
import CartsService from '../dao/services/carts.service.js';
import ProductsService from '../dao/services/products.service.js';
import productsModel from "../dao/mongo/models/products.model.js";


class ViewsController {
  #usersService;
  #cartsService;
  #productsService;
  constructor(usersService, cartsService, productsService) {
    this.#usersService = usersService;
    this.#cartsService = cartsService;
    this.#productsService = productsService;
  }

  async getProducts(req, res, next) {
    try {
      const user = await this.#usersService.findOne({ email: req.user.email });
      const query = req.query;
      const limit = parseInt(query.limit) || 10;
      const page = parseInt(query.page) || 1;
      const sort =
        query.sort === "asc"
          ? { price: 1 }
          : query.sort === "desc"
          ? { price: -1 }
          : {};
      const category = req.query.category;
      const filter = category ? { category } : {};
      const cart = await this.#cartsService.findById(user.cart);
      const cartToObject = cart.toObject();
      const cart_id = cartToObject._id.toString();
      const user_id = user._id.toString();

      const products = await this.#productsService.paginate(filter, {
        category,
        page,
        limit,
        sort,
        lean: true,
      });

      //console.log('products', products);

      const prevLink = products.hasPrevPage
        ? `/products/?page=${products.prevPage}&limit=${products.limit}${
            query.query ? `&query=${query.query}` : ""
          }${query.sort ? `&sort=${query.sort}` : ""}`
        : null;

      const nextLink = products.hasNextPage
        ? `/products/?page=${products.nextPage}&limit=${products.limit}${
            query.query ? `&query=${query.query}` : ""
          }${query.sort ? `&sort=${query.sort}` : ""}`
        : null;

      res.render("products", {
        styles: "styles",
        status: "200",
        products: products.docs, //payload
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink,
        nextLink,
        name: user.nombre,
        lastName: user.apellido,
        email: user.email,
        role: user.role,
        cart: cartToObject,
        cart_id: cart_id,
        user_id: user_id,
      });
    } catch (error) {
      next(error);
      res.status(500).json({
        status: "error",
        message: "Hubo un error al obtener los productos.",
      });
    }
  }



  async renderHome(req, res, next) {
    res.render("index", {
      styles: "styles",
    });
  }

  async getRTProducts(req, res, next) {
    const products = await this.#productsService.find();

    res.render("realTimeProducts", {
      styles: "styles",
      products,
    });
  }

  async getChat(req, res, next) {
    res.render("chat", {
      styles: "styles",
    });
  }

  async getProductById(req, res, next) {
    try {
      const user = req.user;

      const userDb = await this.#usersService.findOne({ email: user.email });

      const user_id = userDb._id.toString();
      const cart_id = userDb.cart[0]._id.toString();

      const id = req.params.id;
      const product = await this.#productsService.findById(id);
      const product_id = product._id.toString();
      //console.log(product_id)
      res.render("productDetails", {
        styles: "styles",
        title: product.title || product[0].title,
        thumbnail: product.thumbnail || product[0].thumbnail,
        description: product.description || product[0].description,
        price: product.price || product[0].price,
        stock: product.stock || product[0].stock,
        category: product.category || product[0].category,
        name: user.nombre,
        lastName: user.apellido,
        user_id: user_id,
        cart_id: cart_id,
        product_id: product_id
      });
    } catch (error) {
      next(error);
    }
  }

  async renderCartById(req, res, next) {
    try {
      const user_id = req.params.userId;
      const cart_id = req.params.cartId;
      //const user = await usersModel.findOne({ _id: user_id });
      const user = await this.#usersService.findOne({ _id: user_id });

      //const cart = await cartsManager.getCartById(cart_id);
      const cart = await this.#cartsService.findById(cart_id);
      const products = cart.products.map((product) => {
        return {
          img: product.product.thumbnail,
          title: product.product.title,
          price: product.product.price,
          quantity: product.quantity,
          _id: product._id,
        };
      });

      res.render("cart", {
        styles: "styles",
        products,
        name: user.nombre,
        lastName: user.apellido,
        cart_id: cart_id,
      });
    } catch (error) {
      next(error);
    }
  }

  async postCart(req, res, next) {
    try {
      const cart = JSON.parse(req.body);

      //console.log("cart", cart);

      // procesar el carrito y devolver una respuesta
      res.json({ message: "Carrito agregado correctamente." });
    } catch (error) {
      next(error);
    }
  }

  async renderRegister(req, res, next) {
    try {
      const email = req.session.user;

      if (email) {
        return res.redirect("/products");
      }

      res.render("register", { styles: "styles" });
    } catch (error) {
      next(error);
    }
  }

  async renderLogin(req, res, next){
    try {
        const email = req.session.user;

        if(email){
            return res.redirect('/products')
        }
    
        res.render('login', {
            styles: 'styles', 
        }); 
    } catch (error) {
        next(error);
    }
  }

  async restorePassword(req, res, next) {
    try {
      res.render('restorePassword', {
        styles: 'styles',
      })
    } catch (error) {
      next(error);
    }
  }

  async restorePasswordForm(req, res, next) {
    try {
      const emailParam = req.params.email;
      console.log('emailParam', emailParam);
      res.render('formRestorePassword', {
        styles: 'styles',
        email: emailParam,
      })
    } catch (error) {
      next(error);
    }
  }

  async addProductForm(req, res, next) {
    try {
      const user = await this.#usersService.findOne({ email: req.user.email });
      const name = user.nombre;
      const lastName = user.apellido;
      const email = user.email;
      res.render('formAddProduct', {
        styles: 'styles',
        name: name,
        lastName: lastName,
        email: email,
      });
    } catch (error) {
      next(error);
    }
  }

  async changeRoles(req, res, next){
    try {
      res.render('changeRole', {
        styles: 'styles',
      })
    } catch (error) {
      next(error);
    }
  }

  async uploadDocs(req, res, next) {
    try {
      console.log('usuario de session', req.user)
      const email = req.user.email;
      res.render('document', {
        styles: 'styles',
      })
    } catch (error) {
      next(error);
    }
  }

}

const controller = new ViewsController(new UsersService(), new CartsService(), new ProductsService());
export default controller;

