import messagesModel from "./models/messages.model.js";
import MongoManager from "./mongo.manager.js";

class Messages{
    #persistencia;
    constructor(persistencia){
        this.#persistencia = persistencia;
    }

    async createMessage(){
        return this.#persistencia.createEntity();
    }

    async addMessage(entity){
        return this.#persistencia.addEntity(entity);
    }

    async getAll(skip, limit, query ){
        return this.#persistencia.getEntidades(skip, limit, query );
    }

    async getMessageById(id) {
        return this.#persistencia.getEntityById(id);
      }

    async updateMessage(id, newData){
        return this.#persistencia.updateEntity(id, newData);
    }

    async deleteMessage(id){
        return this.#persistencia.deleteEntity(id);
    }
}

const instancia = new Messages(new MongoManager(messagesModel));
export default instancia;