import ticketModel from "../mongo/models/ticket.model.js";

class TicketService{
    #model
    constructor() {
        this.#model = ticketModel;
    }

    async generateTicket(data) {
        return (await this.#model.create(data));
    }

    async findById(id) {
        return this.#model.findById({_id: id});
    }
}

export default TicketService;