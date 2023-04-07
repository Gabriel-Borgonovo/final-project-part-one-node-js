import { Router } from "express";
import { socketServer } from "../socket/configure-socket.js";
import productsManager from "../dao/products.manager.js"; 
import productsModel from "../dao/models/products.model.js";
import cartsManager from '../dao/carts.manager.js';

const route = Router();

route.get('/', async (req, res) => {
    res.render('index', { 
        styles: 'styles', 
    });
});

route.get('/products', async (req, res) => {
    try{

        const query = req.query;
        // console.log(query)
        const limit = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const sort = query.sort === 'asc' ? { price: 1 } : query.sort === 'desc' ? { price: -1 } : {};
        const category = req.query.category;
        const filter = category ? { category } : {};


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
        });

    }catch(error){
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

route.get('/products/:id', async (req, res, next) => {
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
    });
    } catch (error) {
      next(error);
    }
  });


  /***vista de carrito seleccionado por id */

route.get('/carts/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const cart = await cartsManager.getCartById(id);
        const products = cart.products.map((product) => {
            return {
                img: product.product.thumbnail,
                title: product.product.title,
                price: product.product.price,
                quantity: product.quantity
            };
        });

        console.log(products)
        
        res.render('cart', { 
          styles: 'styles',
          products,
      });
    } catch (error) {
      next(error);
    }
  });



  /**sistema de login */

  route.get('/register', (req, res) => {
    const email = req.session.user;

    if(email){
        return res.redirect('/perfil')
    }
    
    res.render('register', {styles: 'styles'});
});


export default route;