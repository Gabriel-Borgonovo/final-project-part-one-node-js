import passport from "passport";
import datosConection from "../../../data.js";
import { verifyToken } from "../helpers/jwt.utils.js";


export function authenticated(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'No se proporcionó un token de autenticación' });
    }
  
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token de autenticación no válido' });
    }
  }

export function authorized(roles) {
    return (req, res, next) => {
        if(!roles || roles.length === 0 || roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).send({ message: `you dont have any of the required roles (${roles})` });
        }
    }
}