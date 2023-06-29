import { Router } from "express";
import passport from "passport";
import { authenticated } from "../utils/auth.js";
import authController from "../controllers/auth.controller.js";


const route = Router();


route.post('/login',
passport.authenticate("login", {
  failureRedirect: "/api/auth/failurelogin",
}),
  authController.login.bind(authController));

route.get('/failurelogin', authController.failureLogin.bind(authController));

route.post(
    "/register",
    passport.authenticate("register", {
      failureRedirect: "/api/auth/failureregister",
    }),
    authController.register.bind(authController)
    );
  
  route.get('/failureregister', authController.failureRegister.bind(authController));

  /**Login con github */
  route.get(
    "/github",
    passport.authenticate("github", {
      scope: ["user.email"],
    }),
    authController.github.bind(authController)
  );
  
  route.get(
    "/github-callback",
    passport.authenticate("github", {
      failureRedirect: "/login",
    }),
    authController.githubCallback.bind(authController)
  );

  route.post('/restore-password', authController.restorePassword.bind(authController));

  route.post('/change-password', authController.changePassword.bind(authController));

  route.post('/logout', authenticated, authController.logout.bind(authController));

export default route;