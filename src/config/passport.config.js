import passport from "passport";
import local from 'passport-local';
import { usersModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import github from 'passport-github2';
import datosConection from '../../data.js';

const LocalStrategy = local.Strategy;
const GithubStrategy = github.Strategy;


export function configurePassport() {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { edad, apellido, nombre } = req.body;
          const userExists = await usersModel.findOne({ email: username });

          if (userExists) {
            return done(null, false);
          }

          const newUser = await usersModel.create({
            nombre,
            edad,
            apellido,
            email: username,
            password: createHash(password),
          });
          return done(null, newUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
        {
            usernameField: "email"
        },
        async (username, password, done) => {

            try {
                const user = await usersModel.findOne({email: username});
                if(!user){
                    console.log('Usuario no exitente en el login');
                    return done(null, false);
                }

                if(!isValidPassword(password, user.password)){
                    console.log('Contraseña incorrecta');
                    return done(null, false);
                }

                return done(null, user);

            } catch (error) {
                done(error);
            }
            
        }
    )
  );


   /** login por github */
   passport.use(
    "github",
    new GithubStrategy({
      clientID: datosConection.github_client_id,
      clientSecret: datosConection.github_client_secret,
      callbackURL: datosConection.github_callback_url,
    },
    async (accesToken, refreshToken, profile, done) => {
      try {
        //console.log(profile)
        const email = profile._json.email;
        //console.log('user github profile', email);
        
        const user = await usersModel.findOne({ email });
        //console.log('user bbdd', user);
        if(!user){
          const newUser = await usersModel.create({
            email: email,
            nombre: profile._json.name,
            apellido: "-",
            password: "-",
            edad: 18,
          });
          return done(null, newUser);
        }
        return done(null, user);
      } catch (error) {
        done(error, false);
      }
      
    })
    
  );



  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    const user = await usersModel.findOne({ _id: id });
    done(null, user);
  });
}
