import ticketModel from "../mongo/models/ticket.model.js";

class TicketService{
    #model
    constructor() {
        this.#model = ticketModel;
    }

    async generateTicket(data) {
        return (await this.#model.create(data));
    }
}

export default TicketService;