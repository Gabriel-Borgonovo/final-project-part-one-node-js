import productsModel from "./models/products.model.js";
import logger from "../../logger/logger.js";

class Products{
    #persistencia;
    constructor(persistencia){
        this.#persistencia = persistencia;
    }

    async addEntity(entity){
        try {
            const newEntity = await this.#persistencia.create(entity); 
            return newEntity.toObject();
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async getEntidades(skip = 0, limit = 10, query = null ){
        try {
            const entidades = await this.#persistencia.find(query)
                .skip(Number(skip ?? 0))
                .limit(Number(limit ?? 10));
            return entidades.map(e => e.toObject());
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async getProductById(id){
        try {
            const entidad = await this.#persistencia.findOne({_id: id});
            return entidad;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async updateEntity(id, newData){
        try {
            await this.#persistencia.updateOne({_id: id}, newData);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async deleteEntity(id){
        try {
            await this.#persistencia.deleteOne({_id: id});
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async paginate(query, options){
        try {
            const entidades = await this.#persistencia.paginate(query, options);
            return entidades;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

}

const instancia = new Products(productsModel);
export default instancia;