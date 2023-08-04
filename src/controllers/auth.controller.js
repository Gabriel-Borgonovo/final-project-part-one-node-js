import { createHash, isValidPassword } from "../utils/crypto.js";
import { generateToken } from "../config/helpers/jwt.utils.js";
import UsersService from "../dao/services/users.service.js";
import emailService from "../dao/services/mail/mail.service.js";

class AuthController {
  #service;
  constructor(service) {
    this.#service = service;
  }

  async login(req, res, next) {
    try {
      req.session.user = req.user.email;

      console.log('req.session.user', req.session.user);
      const user = await this.#service.findOne({ email: req.session.user });
      if (!user) {
        return res
          .status(401)
          .send({ error: "Usuario o contraseña incorrectos" });
      }

      /************************************** */
      const currentTime = new Date().toISOString();
      console.log('last connection', currentTime);

      /*********************************** */
      
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
      const { email } = req.body;
      emailService.sendEmail({
        to: email,
        subject: "Welcome to CoderIntegrador",
        html: `<h1>Hello ${email}</h1>
        <a href="http://localhost:8080/restore-password/form/${email}" target="_blank" >Restablecer contraseña</a>`
      });

      res.send({message: 'enviado', email: email});

    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const newPass = req.body.newPass;
      const confirmNewPass = req.body.confirmNewPass;
      const email = req.body.email;

      const user = await this.#service.findByEmail(email);     
      if(!user) res.status(404).send({message: 'El usuario no existe'});

      //const oldPass = user.password;
      if(isValidPassword(newPass, user.password)) {
        res.status(400).send({message: 'La nueva contraseña no puede ser igual a la anterior'});
        return;
      }

      if(newPass === confirmNewPass) {
        user.password = createHash(newPass);
        
        const id = user.id.toString();
        await this.#service.update(id, user);
        
      } else {
        res.status(400).send({message: 'Las contraseñas no coiciden'});
      }
      
      res.status(200).send({response: 'ok'})
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const user = await this.#service.findByEmail(req.session.user);
      
       // Verificar si el usuario es inactivo y eliminarlo si es necesario
       if (user) {
        const lastConnection = new Date(user.last_connection);
        const currentTime = new Date();
        const timeSinceLastConnection = (currentTime - lastConnection) / (1000 * 60); // Diferencia en minutos

        if (timeSinceLastConnection >= 2880) { 
          // Eliminar el usuario y enviar correo electrónico
          await this.#service.delete(user._id);

          const { email } = user;
          emailService.sendEmail({
            to: email,
            subject: "Aviso de eliminación",
            html: `<h1>Hola ${email}</h1>
            <p>Su cuenta ha sido eliminada por falta de uso</p>
            <a href="http://localhost:8080/register" target="_blank" >Acceda aquí para crear una nueva cuenta</a>`
          });
        }
      }

      req.session.destroy((err) => {
        if (err) {
          res.status(500).send({ error: err });
        } else {
          res.clearCookie("token");
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