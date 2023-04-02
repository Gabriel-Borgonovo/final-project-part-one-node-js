import { Router } from "express";
import { socketServer } from "../socket/configure-socket.js";
import productsManager from "../dao/products.manager.js"; 
import productsModel from "../dao/models/products.model.js";

const route = Router();

route.get('/', async (req, res) => {
    try{

        const query = req.query;
        // console.log(query)
        const limit = parseInt(query.limit) || 3;
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
            ? `/?page=${products.prevPage}&limit=${products.limit}${query.query ? `&query=${query.query}` : ''}${query.sort ? `&sort=${query.sort}` : ''}` 
            : null;
        
        const nextLink = products.hasNextPage 
            ? `/?page=${products.nextPage}&limit=${products.limit}${query.query ? `&query=${query.query}` : ''}${query.sort ? `&sort=${query.sort}` : ''}` 
            : null;

        res.render('index', {
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


export default route;