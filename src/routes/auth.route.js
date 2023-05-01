import { Router } from "express";
import { usersModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import passport from "passport";
import { generateToken } from "../config/helpers/jwt.utils.js";

import { authenticated } from "../utils/auth.js";


const route = Router();


route.post('/login', async (req, res, next) => {

  try {
    const user = await usersModel.findOne({email: req.body.email});
    if (!user) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
    //console.log(user);

    const userToToken = {
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      edad: user.edad,
      role: user.role,
      //cart: user.cart
    }
    

    const token = generateToken(userToToken);

    res.cookie('token', token, { 
      maxAge: 60*60*1000*24, 
      httpOnly: true 
      });//envia la cookie
    
    res.header({token:token});
    res.redirect('/products');
  } catch (error) {
    next(error);
  }
  
});

route.get('/failurelogin', (req, res) => {
    res.send({ error: 'Usuario o contraseña incorrectos' });
});



//Nuevos endpoints con password

route.post(
    "/register",
    passport.authenticate("register", {
      failureRedirect: "/api/auth/failureregister",
    }),
    async (req, res) => res.status(201).send({ message: "Usuario creado" })
    );
  
  
  route.get('/failureregister', (req, res) => {
      res.send({ error: 'Error en el registro' });
  });


  /**Login con github */
  route.get(
    "/github",
    passport.authenticate("github", {
      scope: ["user.email"],
    }),
    (req, res) => {}
  );
  
  route.get(
    "/github-callback",
    passport.authenticate("github", {
      failureRedirect: "/login",
    }),
    (req, res) => {
      //console.log('Github ', req.user);
      req.session.user = req.user.email;
      res.redirect("/products");
    }
  );






  route.post('/restore-password', async (req, res) => {
    const {email, newPassword} = req.body;

    const user = await usersModel.findOne({email});

    if(!user){
        res.status(404).send({error: 'User not found'});
        return;
    }

    const hashedPassword = createHash(newPassword);
    await usersModel.updateOne({email}, { $set: {password: hashedPassword}});
    res.send({message: "Password changed"});
});


  route.post('/logout', authenticated, (req, res) => {
	req.session.destroy((err) => {
		if(err){
			res.status(500).send({error: err});
		}else{
			res.redirect('/login')
		}
	});
});




export default route;