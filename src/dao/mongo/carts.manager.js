import cartsModel from "./models/carts.model.js";
import MongoManager from "./mongo.manager.js";

class Carts{
    #persistencia;
    constructor(persistencia){
        this.#persistencia = persistencia;
    }

    async createCart(){
        return this.#persistencia.createEntity();
    }

    async addEntity(entity){
        return this.#persistencia.addEntity(entity);
    }

    async getAll(skip, limit, query ){
        return this.#persistencia.getEntidades(skip, limit, query );
    }

    async getCartById(id) {
        return this.#persistencia.getEntityById(id);
      }

    async updateCart(id, newData){
        return this.#persistencia.updateEntity(id, newData);
    }

    async deleteCart(id){
        return this.#persistencia.deleteEntity(id);
    }
}

const instancia = new Carts(new MongoManager(cartsModel));
export default instancia;