import { Router } from "express";
import usersController from '../controllers/users.controller.js';

const route = Router();
route.get('/', usersController.get.bind(usersController));
route.post('/', usersController.create.bind(usersController));
route.put('/premium/:uid', usersController.updateUser.bind(usersController));

export default route;