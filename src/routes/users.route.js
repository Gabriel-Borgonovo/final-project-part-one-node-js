import { Router } from "express";
import usersController from '../controllers/users.controller.js';
import { documentUploader } from "../utils/documentUploader.js";
import { authenticated, authorized } from "../config/middlewares/auth.js";

const route = Router();
route.get('/', usersController.get.bind(usersController));
route.post('/', usersController.create.bind(usersController));
route.post('/:uid', authenticated, authorized(["user"]), documentUploader.array('documents', 2), usersController.uploadDocuments.bind(usersController));
route.put('/premium/:uid', usersController.updateUser.bind(usersController));
route.delete('/deleteUser/:uid', authenticated, authorized(['admin']), usersController.deleteUser.bind(usersController));

export default route;