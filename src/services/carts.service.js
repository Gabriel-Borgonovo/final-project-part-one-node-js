import cartsManager from '../dao/carts.manager.js'


class CartsService {
    #model
    constructor() {
        this.#model = cartsManager;
    }

    async create(data) {
        return this.#model.createCart();
    }

    async find() {
        return this.#model.getAll();
    }

    async findById(id) {
        return this.#model.getCartById(id);
    }

    async update(id, data) {
        await this.#model.updateCart(id, data);
        const updatedData = await this.findById(id);
        return updatedData;
    }

    async delete(id) {
        return this.#model.deleteCart(id);
    }
}

export default CartsService;