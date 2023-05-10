import productsModel from "../dao/models/products.model.js";

class ProductsService {
    #model
    constructor() {
        this.#model = productsModel;
    }

    async create(data) {
        return this.#model.create(data);
    }

    async find() {
        return this.#model.paginate();
    }
    

    async paginate(query, options) {
        return this.#model.paginate(query, options);
    }

    async findById(id) {
        return this.#model.findById(id);
    }

    async update(id, data) {
        await this.#model.updateOne({_id: id}, data);
        const updatedData = await this.findById(id);
        return updatedData;
    }

    async delete(id) {
        return this.#model.findByIdAndDelete(id);
    }
}

export default ProductsService;