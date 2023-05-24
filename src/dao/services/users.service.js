import { usersModel } from "../mongo/models/users.model.js";

class UsersService {
    #model
    constructor() {
        this.#model = usersModel;
    }

    async create(data) {
        return this.#model.create(data);
    }

    async find() {
        return this.#model.find();
    }

    async findOne(email){
        return this.#model.findOne(email);
    }

    async findById(id) {
        return this.#model.findById(id);
    }

    async update(id, data) {
        await this.#model.updateOne({_id: id}, data);
        const updatedData = await this.findById(id);
        return updatedData;
    }

    async updateOne(dato1, dato2){
        return this.#model.updateOne(dato1, dato2);
    }

    async delete(id) {
        return this.#model.findByIdAndDelete(id);
    }
}

export default UsersService;