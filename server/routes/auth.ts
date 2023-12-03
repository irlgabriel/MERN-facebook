import express, { Router } from "express";
import passport from "passport";

const router = Router();

import * as authController from "../controllers/auth/auth";

/* Login */
router.post("/login", authController.login);

/* Register */
router.post("/register", authController.register);

/* Facebook auth */
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { session: false })
);

router.get("/auth/facebook/callback", authController.facebook_callback);

/* Logout */
router.get("/logout", authController.logout);

/* Check if user is logged in */
router.get(
  "/isLoggedIn",
  passport.authenticate("jwt", { session: false }),
  authController.isLoggedIn
);

/* Send back token based on user session */
router.get("/getToken", authController.getUserToken);

export default router;
