import { usersModel } from "../dao/models/users.model.js";

export const authenticated = async (req, res, next) => {
	const email = req.session.user;
	const rol = req.session.rol;
	if(email){
        const user = await usersModel.findOne({email});
        req.user = user;
		req.rol = rol;
		next()
	} else{
		res.redirect('/login');
	}
}







