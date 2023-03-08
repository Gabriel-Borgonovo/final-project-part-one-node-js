
import { Router } from "express";
import ProductManager from '../data/productManager.js'
const productManager = new ProductManager('./data/products.json');  
import { validarProducto, validarProductoParcial } from '../data/validacion.js';
import { avatarUploader } from "../utils/avatarUploader.js";
import { socketServer } from "../socket/configure-socket.js";

const route = Router();


route.get('/', async (req, res) => {

    const query = req.query;
    const entries = Object.entries(query);

    const limit = parseInt(req.query.limit); // Obtener el valor del query param "limit"
    const products = await productManager.getProducts();
    
    if (!Number.isNaN(limit)) { // Si se proporciona un límite
        res.send(products.slice(0, limit)); // Devuelve los productos hasta el límite proporcionado
      } else if(entries.length === 0){
        //res.send(products); // Devuelve todos los productos

          return res.send({productos: products});
      
      }

}); 

route.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid); // Obtener el id del producto de los parámetros de la URL
    const product = await productManager.getProductById(productId); // Obtener el producto por su id
  
    if (product) {
      res.send(product); // Devuelve el producto solicitado
    } else {
      res.status(404).send('Producto no encontrado'); // Devuelve un error 404 si no se encuentra el producto
    }
  });


  /**A partir de acá comienza lo nuevo */
  /*********Agrega un nuevo producto**************** */

  route.post('/', avatarUploader.array('thumbnail', 5), async(req, res) => {
    const product = req.body;
    const files = req.files?.map(file => file.filename);
    
    if(!files){
      return res.status(400).send({status: "error", error: "No se pudo cargar las imagenes"});
    }

    product.thumbnail = files; // Agregar la propiedad thumbnail al objeto product
    product.status = true;
    
    socketServer.emit('Product', product);//nuevo
    
    const esValido = validarProducto(product);

    if (!esValido) {
      return res.status(400).json({ 
        error: 'Los datos del producto son inválidos' 
      });
    }

    const id = await productManager.addProduct(product);

    res.send({ok: true, mensaje: 'Producto agregado correctamente'})
});



/***************modifica el producto************ */

route.put('/:pid', async (req, res) => {
  const idProduct = req.params.pid;

  const nuevosDatos = req.body;
  
  const esValido = validarProducto(nuevosDatos);

  if(!esValido){
      res.status(400).send({
          error: 'Datos inválidos',
      });
      return;
  }
 
  const productById = await productManager.getProductById(idProduct, nuevosDatos);

  if(!productById){
      res.status(404).send({error: `Usuario con id ${idProduct} no encontrado`});
      return;
  }
  
  await productManager.updateProduct(idProduct, nuevosDatos);

  res.send({ok: true, mensaje: 'Producto actualizado correctamente'});
} );


/**************Elimina el producto**************************** */

route.delete('/:pid', async (req, res) => {
  const productId = Number(req.params.pid);
  const productToDelete = await productManager.getProductById(productId);
  
  if (productToDelete.length === 0) {
    res.status(404).send({ error: `Producto con id ${productId} no encontrado` });
    return;
  }
  
  socketServer.emit('Productdelete', productToDelete); // emitir el evento de socket

  await productManager.deleteProduct(productId);

  res.send({ ok: true, mensaje: `El producto con id ${productId} fue eliminado` });
});


export default route; 

