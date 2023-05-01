import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import datosConection from '../../../data.js';

export function jwtStrategy() {
    passport.use(
        'jwt',
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([
                    ExtractJwt.fromAuthHeaderAsBearerToken(),
                    cookieExtractor
                ]),
                secretOrKey: datosConection.JWT_TOKEN,
                ignoreExpiration: false 
            },
            (payload, done) => {
                try {
                    console.log('payload', payload);
                    return done(null, payload);
                } catch (error) {
                    done(error, false);
                }
            }
        )
    );
}

function cookieExtractor(req) {
    return req?.cookies?.['jwt'];
}