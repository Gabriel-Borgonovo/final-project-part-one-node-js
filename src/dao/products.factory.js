import productsManager from './mongo/products.manager.dos.js';
import ProductsManagerfs from "./fyleSystem/productsManager.fyleSystem.js";
import datosConection from '../../data.js';

const {PERSISTENCE_TYPE} = datosConection;

class ProductsFactory {
  static create() {
    const persistenceType = PERSISTENCE_TYPE; // Variable de entorno que indica el tipo de persistencia

    switch (persistenceType) {
      case 'FS':
        return ProductsManagerfs; 
      case 'MONGO':
        return productsManager;
      default:
        throw new Error('Tipo de persistencia no válido');
    }
  }
}

export default ProductsFactory;