import { Router } from "express";
import { usersModel } from "../dao/models/users.model.js";

const route = Router();

route.post('/', async(req, res, next) => {  
    const email = req.session.user;

    if(email){
        return res.redirect('/perfil')
    }
    
    const usuario = req.body;
    
   
    try {
        const { _id } = await usersModel.create(usuario);
        res.status(201).send({id: _id});
    } catch (error) {
        next(error);
    }
   
});

export default route;