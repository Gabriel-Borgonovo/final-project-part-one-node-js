import productsManager from '../mongo/products.manager.dos.js';
import ProductsManagerfs from "../fyleSystem/productsManager.fyleSystem.js";
import ProductsFactory from '../products.factory.js';


class ProductsService {
    #model
    constructor() {
        this.#model = ProductsFactory.create();  
    }

    async create(data) {
        return this.#model.addEntity(data);
    }

    async find() {
        return this.#model.getEntidades();
    }
    

    async paginate(query, options) {
        return this.#model.paginate(query, options);
    }

    async findById(id) {
        return this.#model.getProductById(id);
    }

    async update(id, data) {
        console.log('Updating product with ID:', id);
        await this.#model.updateEntity({_id: id}, data);
        console.log('Product updated successfully.');
        const updatedData = await this.#model.getProductById(id);
        return updatedData;
    }

    async delete(id) {
        return this.#model.deleteEntity(id);
    }
}

export default ProductsService;