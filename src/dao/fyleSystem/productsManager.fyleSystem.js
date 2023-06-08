import fs from 'fs';
import path from 'path';
import fileDirName from '../../utils/fileDirName.js';
const {__dirname} = fileDirName(import.meta);
const filePath = path.resolve(__dirname, 'json/products.json');
import logger from '../../logger/logger.js';

class ProductsManagerfs {
  constructor() {
    this.path = filePath;
  }

  async addEntity(product) {
    let products = await this.getEntidades();

    // Verifica si el producto ya existe en el archivo JSON
    let existingProduct = products.find((p) => p.code === product.code);
    if (existingProduct) {
      console.log(
        `El producto con código ${product.code} ya existe en el archivo JSON.`
      );
      return;
    }
    product.id = products.length + 1;
    products.push(product);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  /**Este método devuelve todos los productos del archivo JSON. */
  async getEntidades() {
    //antes getProducts
    let products = [];
    if (fs.existsSync(this.path)) {
      products = JSON.parse(await fs.promises.readFile(this.path));
      //console.log('products fron getEntidades: ', products);
    }

    return products;
  }

  async paginate(query, options) {
    const docs = await this.getEntidades();
    //console.log('docs from filesystem', docs);
    const totalDocs = docs.length;
    const limit = options.limit || 10;
    const page = options.page || 1;
    const offset = (page - 1) * limit;
    const hasPrevPage = page > 1;
    const hasNextPage = docs.length > offset + limit;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;
    const pagingCounter = offset + 1;

    const paginationData = {
      docs: docs.slice(offset, offset + limit),
      totalDocs,
      limit,
      hasPrevPage,
      hasNextPage,
      page,
      totalPages: Math.ceil(totalDocs / limit),
      offset,
      prevPage,
      nextPage,
      pagingCounter,
    };

    return paginationData;
  }

  /**Este método devuelve un producto específico basado en su ID. */
  async getProductById(id) {
    
    let products = await this.getEntidades();
    //console.log('products by id: ', products);
    let result = products.filter((product) => product._id === id);
    return result;
  }

  /**Este método actualiza un producto existente en el archivo JSON.  */
  async updateEntity(id, data) {
    // antes updateProduct
    const idNumber = Number(id);
    try {
      let products = await this.getEntidades();
      let index = products.findIndex((p) => p._id === idNumber);

      products[index] = { ...products[index], ...data };
      logger.info(`El objeto de id: ${id}, fue actualizado con éxito`);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      logger.error(`Error al actualizar el producto con id ${id}: ${error}`);
    }
  }

  /**Este método elimina un producto del archivo JSON. */
  async deleteEntity(id) {
    //antes deleteProduct
    let products = await this.getEntidades();

    const newProducts = products.filter((product) => product.id !== id);

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(newProducts, null, 2)
    );
  }
}


export default new ProductsManagerfs();