import jwt from 'jsonwebtoken';
import datosConection from '../../../data.js';

const {JWT_TOKEN} = datosConection;

export function generateToken(user) {
    return jwt.sign(user, JWT_TOKEN, {
        expiresIn: '24h',
    });
}

export function verifyToken(token) {
    return jwt.verify(token, JWT_TOKEN);
}