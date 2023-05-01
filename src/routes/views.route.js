import { Router } from "express";
import { socketServer } from "../socket/configure-socket.js";
import productsManager from "../dao/products.manager.js"; 
import productsModel from "../dao/models/products.model.js";
import cartsManager from '../dao/carts.manager.js';
import { usersModel } from "../dao/models/users.model.js";
import { authenticated, authorized } from "../config/middlewares/auth.js";
import passport from "passport";



const route = Router();

route.get('/', async (req, res) => {
    res.render('index', { 
        styles: 'styles', 
    });
});

route.get('/products', authenticated, authorized(['user']), async (req, res, next) => {
    try{
        const user = await usersModel.findOne({email: req.user.email});
        //console.log('user: ', req.user);
        const query = req.query;
        const limit = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const sort = query.sort === 'asc' ? { price: 1 } : query.sort === 'desc' ? { price: -1 } : {};
        const category = req.query.category;
        const filter = category ? { category } : {};
        const cart = await cartsManager.getCartById(user.cart)
        const cartToObject = cart.toObject()
        const cart_id = cartToObject._id.toString();
        const user_id = user._id.toString();

        const products = await productsModel.paginate(
            
            filter,
            { 
                category,
                page,
                limit,
                sort,
                lean: true,
            }
        );

        const prevLink = products.hasPrevPage 
            ? `/products/?page=${products.prevPage}&limit=${products.limit}${query.query ? `&query=${query.query}` : ''}${query.sort ? `&sort=${query.sort}` : ''}` 
            : null;
        
        const nextLink = products.hasNextPage 
            ? `/products/?page=${products.nextPage}&limit=${products.limit}${query.query ? `&query=${query.query}` : ''}${query.sort ? `&sort=${query.sort}` : ''}` 
            : null;

        res.render('products', {
            styles: 'styles',
            status: '200',
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
            user_id: user_id
        });

    }catch(error){
        next(error);
        res.status(500).json({
            status: "error",
            message: "Hubo un error al obtener los productos.",
        });
    }
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

/***vista de producto seleccionado por id */

route.get('/products/:id', authenticated, authorized(['user']), async (req, res, next) => {
    const user = req.user;
    
    const userDb = await usersModel.findOne({email: user.email});
    //console.log('user details', userDb);

    const user_id = userDb._id.toString();
    const cart_id = userDb.cart[0]._id.toString();

    //console.log(cart_id);

    const id = req.params.id;
    try {
      const product = await productsManager.getProductById(id);
      res.render('productDetails', { 
        styles: 'styles',
        title: product.title,
        thumbnail: product.thumbnail,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        name: user.nombre,
        lastName: user.apellido,
        user_id: user_id,
        cart_id: cart_id,
    });
    } catch (error) {
      next(error);
    }
  });


  /***vista de carrito seleccionado por id */

route.get('/cart/:userId/:cartId', authenticated, authorized(['user']), async (req, res, next) => {
    const user_id = req.params.userId;
    const cart_id = req.params.cartId;

    try {
        const user = await usersModel.findOne({_id: user_id})
        //console.log('user de cart', user);

        const cart = await cartsManager.getCartById(cart_id);
        const products = cart.products.map((product) => {
            return {
                img: product.product.thumbnail,
                title: product.product.title,
                price: product.product.price,
                quantity: product.quantity
            };
        });

        
        res.render('cart', { 
          styles: 'styles',
          products,
          name: user.nombre,
          lastName: user.apellido,
      });
    } catch (error) {
      next(error);
    }
  });





  route.post('/cart', (req, res, next) => {
    try {
      const cart = JSON.parse(req.body);
  
      console.log('cart', cart);
  
      // procesar el carrito y devolver una respuesta
      res.json({ message: 'Carrito agregado correctamente.' });
    } catch (error) {
      next(error);
    }
  });
 
  
  
  
  
  
  
  





  /**sistema de login */

  route.get('/register', (req, res) => {
    const email = req.session.user;

    if(email){
        return res.redirect('/products')
    }
    
    res.render('register', {styles: 'styles'});
});

route.get('/login', (req, res) => {
    const email = req.session.user;

    if(email){
        return res.redirect('/products')
    }

    res.render('login', {
        styles: 'styles', 
    });
});


export default route;