import { Router } from "express";
import passport from "passport";

import * as userController from "../controllers/users/user";

const router = Router();

/* GET all users */
router.get("/", userController.get_users);

router.get("/:user_id", userController.get_user);

/** Photos pictures */
/** Update profile pic */
router.put("/:user_id/profile_photo", userController.update_profile_photo);

/** Update Cover pic */
router.put("/:user_id/cover_photo", userController.update_cover_photo);

/** Update user info */
router.put("/:user_id/", userController.update_desc);

/* Delete account */
router.delete("/", passport.authenticate("jwt"), userController.delete_user);

export default router;
