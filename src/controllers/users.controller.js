import {usersModel} from "../dao/mongo/models/users.model.js";
import UsersService from "../dao/services/users.service.js";

class UsersController {
  #service;
  constructor(service) {
    this.#service = service;
  }

  async create(req, res, next) {
    try {
      const email = req.session.user;

      if (email) {
        return res.redirect("/perfil");
      }

      const usuario = req.body;
      const { _id } = await this.#service.create(usuario);
      res.status(201).send({ id: _id });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    const usuarios = await this.#service.find();
    res.send(usuarios);
  }
}

const controller = new UsersController(new UsersService());
export default controller;