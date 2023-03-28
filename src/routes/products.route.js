
import { Router } from "express";
import { ObjectId } from "mongodb";

import { avatarUploader } from "../utils/avatarUploader.js";
import { socketServer } from "../socket/configure-socket.js";
import productsManager from "../dao/products.manager.js";

const route = Router();


route.get('/', async (req, res, next) => {
  const {skip, limit, ...query} = req.query;
  try {
    const products = await productsManager.getAll(skip, limit, query);
    res.send({ products });
} catch (error) {
    next(error);
}
}); 

route.get('/:pid', async (req, res, next) => {
    const productId = req.params.pid; 
    try {
      const product = await productsManager.getProductById(productId);

      if (product) {
        res.send(product); 
      } else {
        res.status(404).send('Producto no encontrado'); 
      }

    } catch (error) {
      next(error);
    }

  });


  route.post('/', avatarUploader.array('thumbnail', 5), async(req, res, next) => {

    try {
      const product = req.body;
      const files = req.files?.map(file => file.filename);

      if(!files){
        return res.status(400).send({status: "error", error: "No se pudo cargar las imagenes"});
      }

      product.thumbnail = files; 
      product.status = true;

      socketServer.emit('Product', product);

      const newProduct = await productsManager.addEntity(product);
      res.send({ product: newProduct });
    }catch (error) {
      next(error);
    }  

});



/***************modifica el producto************ */

route.put('/:pid', async (req, res, next) => {
  
  try {
    const idProduct = req.params.pid;
    const nuevosDatos = req.body;
    const productById = await productsManager.getProductById(idProduct);

    if(!productById){
      res.status(404).send({error: `Usuario con id ${idProduct} no encontrado`});
      return;
      }

    await productsManager.updateProduct(idProduct, nuevosDatos);

    res.send({ok: true, mensaje: 'Producto actualizado correctamente'});

  } catch (error) {
    next(error);
  }

} );


/**************Elimina el producto**************************** */

route.delete('/:pid', async (req, res, next) => {

  try {
    const productId = req.params.pid;
    const productToDelete = await productsManager.getProductById(productId);
    if (!productToDelete) {
      res.status(404).send({ error: `Producto con id ${productId} no encontrado` });
      return;
    }
   
    //console.log(productToDelete);

    // socketServer.emit('Productdelete', productToDelete);
    await productsManager.deleteProduct(productId);
    socketServer.emit('Productdelete', productToDelete);
    
    res.send({ ok: true, mensaje: `El producto con id ${productId} fue eliminado` });
  } catch (error) {
    next(error);
  }

});


export default route; 

