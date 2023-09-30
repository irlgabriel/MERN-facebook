const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const passport = require("passport");
const tokenMiddleware = require("../middlewares/token");

const userController = require("../controllers/user");

/* GET all users */
router.get("/", userController.get_users);

router.get("/:user_id", userController.get_user);

/** Photos pictures */
/** Update profile pic */
router.put("/:user_id/profile_photo", userController.update_profile_photo);

/** Update Cover pic */
router.put("/:user_id/cover_photo", userController.update_cover_photo);

/** Update user info */
router.put("/:user_id/", userController.update_desc)

/* Delete account */
router.delete('/', passport.authenticate('jwt'), userController.delete_user)

module.exports = router;
