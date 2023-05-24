import { createHash } from "../utils/crypto.js";
import { generateToken } from "../config/helpers/jwt.utils.js";
import UsersService from "../dao/services/users.service.js";

class AuthController {
  #service;
  constructor(service) {
    this.#service = service;
  }

  async login(req, res, next) {
    try {
      const user = await this.#service.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(401)
          .json({ error: "Usuario o contraseña incorrectos" });
      }
      //console.log('user auth', user)

      const userToToken = {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        edad: user.edad,
        role: user.role,
      };

      const token = generateToken(userToToken);

      res.cookie("token", token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      }); //envia la cookie

      res.header({ token: token });
      res.redirect("/products");
    } catch (error) {
      next(error);
    }
  }


  async failureLogin(req, res, next) {
    res.send({ error: "Usuario o contraseña incorrectos" });
  }






  async addProductToCart(req, res, next) {
    try {
      // Verificar si el usuario está autenticado
      const token = req.cookies.token || req.header("token");
      if (!token) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }
  
      // Obtener información del usuario desde el token
      const decodedToken = verifyToken(token); // Implementa la función para verificar el token JWT
      if (!decodedToken) {
        return res.status(401).json({ error: "Token inválido" });
      }
  
      // Agregar el producto al carrito del usuario
      const userId = decodedToken.userId; // Suponiendo que el token contiene el ID del usuario
      const productId = req.body.productId; // Obtener el ID del producto desde la solicitud
  
      // Lógica para agregar el producto al carrito del usuario
      
      // ...
  
      res.status(200).json({ message: "Producto agregado al carrito" });
    } catch (error) {
      next(error);
    }
  }




  async register(req, res, next) {
    res.status(201).send({ message: "Usuario creado" });
  }

  async failureRegister(req, res, next) {
    res.send({ error: "Error en el registro" });
  }

  async github(req, res, next) {}

  async githubCallback(req, res, next) {
    req.session.user = req.user.email;
    res.redirect("/products");
  }

  async restorePassword(req, res, next) {
    try {
      const { email, newPassword } = req.body;

      const user = await this.#service.findOne({ email });

      if (!user) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      const hashedPassword = createHash(newPassword);
      await this.#service.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );
      res.send({ message: "Password changed" });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      req.session.destroy((err) => {
        if (err) {
          res.status(500).send({ error: err });
        } else {
          res.redirect("/login");
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new AuthController(new UsersService());
export default controller;