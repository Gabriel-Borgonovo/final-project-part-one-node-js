import { Router } from "express";
import { usersModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import passport from "passport";

import { authenticated } from "../utils/auth.js";


const route = Router();

// route.post('/login', async (req, res) => {
//     const alreadyEmail = req.session.user;

//     if(alreadyEmail){
//         return res.redirect('/products')
//     }

//     const {email, password} = req.body;
//     const user = await usersModel.findOne({email, password});
//     if(!user){
//         return res.status(401).send({
//             error: 'Email o contraseña incorrectos'
//         });
//     }

//     let rol = 'usuario';
//     if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
//         rol = 'admin';
//     }

//     req.session.user = email;
//     req.session.rol = rol;
//     res.redirect('/products');
// });

route.post(
    "/login",
    passport.authenticate("login", {
      failureRedirect: "/api/auth/failurelogin",
    }),
    async (req, res) => {
      
      req.session.user = req.user.email;
      res.redirect("/products");
    }
);

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