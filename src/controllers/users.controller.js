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

    const newUsers = usuarios.map((user) => ({
      nombre: user.nombre,
      apellido: user.apellido,
      role: user.role,
      email: user.email,
    }));
    
    res.send({ Usuarios: newUsers });
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

  async uploadDocuments(req, res, next) {
    try {
      const { uid } = req.params;
      console.log('uid', uid);

      const fileName = req.files?.map((file) => file.filename);

      if (fileName.length === 0) {
        return res
          .status(400)
          .send({ status: "error", error: "No se pudo cargar el documento" });
      }

      const fileExtension = fileName[0].slice(-3);
      if (fileExtension.toLowerCase() !== 'pdf') {
        return res.status(400).send({ status: "error", error: "El archivo debe ser de formato PDF" });
      }

      const user = await this.#service.findById(uid);

      if (user.documents && user.documents.length > 0) {
        user.documents[0].name = fileName[0];
        user.documents[0].reference = `/src/public/documents/${fileName[0]}`;
        user.role = 'premium';
      }

      await this.#service.update(uid, user);

      res.status(200).send({message: 'Usuario actualizado', user: user});

    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { uid } = req.params;

      await this.#service.delete(uid);
      res.send({status: 'ok', message: `Usuario eliminado con exito`});
    } catch (error) {
      next(error);
    }
  }
}

const controller = new UsersController(new UsersService());
export default controller;