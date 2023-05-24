import TicketService from "../dao/services/ticket.service.js";

class TicketsController {
  #service;
  constructor(service) {
    this.#service = service;
  }

  async getTicketById(req, res, next) {
    try {
      const ticketId = req.params.tid;

      // Busca el ticket por su ID en la base de datos
      const ticket = await this.#service.findById(ticketId);

      if (!ticket) {
        return res.status(404).json({ error: "Ticket no encontrado" });
      }

      // Devuelve el ticket como JSON
      res.json(ticket);
    } catch (error) {
      next(error);
    }
  }
}

const controller = new TicketsController(new TicketService());
export default controller;
