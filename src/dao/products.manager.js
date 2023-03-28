import productsModel from "./models/products.model.js";
import MongoManager from "./mongo.manager.js";

class Products{
    #persistencia;
    constructor(persistencia){
        this.#persistencia = persistencia;
    }

    async addEntity(entity){
        return this.#persistencia.addEntity(entity);
    }

    async getAll(skip, limit, query ){
        return this.#persistencia.getEntidades(skip, limit, query );
    }

    async getProductById(id){
        return this.#persistencia.getEntityById(id);
    }

    async updateProduct(id, newData){
        return this.#persistencia.updateEntity(id, newData);
    }

    async deleteProduct(id){
        return this.#persistencia.deleteEntity(id);
    }

}

const instancia = new Products(new MongoManager(productsModel));
export default instancia;