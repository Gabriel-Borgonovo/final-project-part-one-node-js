import { Router } from "express";
import { usersModel } from "../dao/models/users.model.js";

import { authenticated } from "../utils/auth.js";


const route = Router();

route.post('/login', async (req, res) => {
    const alreadyEmail = req.session.user;

    if(alreadyEmail){
        return res.redirect('/products')
    }

    const {email, password} = req.body;
    const user = await usersModel.findOne({email, password});
    if(!user){
        return res.status(401).send({
            error: 'Email o contraseña incorrectos'
        });
    }

    let rol = 'usuario';
    if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
        rol = 'admin';
    }

    req.session.user = email;
    req.session.rol = rol;
    res.redirect('/products');
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