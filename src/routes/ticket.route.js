import { Router } from "express";
import ticketsController from '../controllers/tickets.controller.js';
import { authenticated, authorized } from "../config/middlewares/auth.js";

const route = Router();

route.get('/:tid', authenticated, authorized(['user']), ticketsController.getTicketById.bind(ticketsController));


export default route; 