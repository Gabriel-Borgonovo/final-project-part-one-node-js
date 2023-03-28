export default class MongoManager {
    constructor(model){
        this.model = model;
    }

    async getEntidades(skip = 0, limit = 10, query = null ){
        try {
            const entidades = await this.model.find(query)
                .skip(Number(skip ?? 0))
                .limit(Number(limit ?? 10));
            return entidades.map(e => e.toObject());
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
    
    async createEntity(){
        try {
            const newEntity = await this.model.create({}); 
            return newEntity;
        } catch (error) {
            throw error;
        }
       
    }
    

    async addEntity(entity){
        try {
            const newEntity = await this.model.create(entity); 
            return newEntity.toObject();
        } catch (error) {
            throw error;
        }
       
    }

    async getEntityById(id){
        try {
            const entidad = await this.model.findOne({_id: id});
            return entidad;
        } catch (error) {
            throw error;
        }
    }

    

    async updateEntity(id, newData){
        try {
            await this.model.updateOne({_id: id}, newData);
        } catch (error) {
            throw error;
        }
    }

    async deleteEntity(id){
        try {
            await this.model.deleteOne({_id: id});
        } catch (error) {
            throw error;
        }
    }
}