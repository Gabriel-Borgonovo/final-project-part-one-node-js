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




// const setRol = (rol) => {
// 	return async (req, res, next) => {
// 	  const user = req.user;
// 	  if (!user) {
// 		return res.status(401).send({ error: 'No autorizado' });
// 	  } else {
// 		if (user.rol === rol) { // aquí también debe ser req.rol
// 		  next();
// 		} else {
// 		  return res.status(401).send({ error: 'No autorizado' });
// 		}
// 	  }
// 	};
//   };


