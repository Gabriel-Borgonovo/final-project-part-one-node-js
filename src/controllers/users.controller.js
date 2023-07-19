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

  async updateUser(req, res, next) {
    try {
      const _id = req.params.uid;
      const user = await this.#service.findById(_id);
      if (!user) {
        return res.status(404).send({ error: "Usuario no encontrado" });
      }

      const newUser = user;
      newUser.role = (user.role === 'user') ? newUser.role = 'premium' : newUser.role = 'user'

      await this.#service.update(_id, newUser);

      res.send({users: 'usuario actualizado', _id:_id, user: user, newUser: newUser});
    } catch (error) {
      next(error);
    }
  }
}

const controller = new UsersController(new UsersService());
export default controller;