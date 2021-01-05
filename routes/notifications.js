const express = require("express");
const router = express.Router();

const passport = require("passport");

const notificationsController = require("../controllers/notifications");

/** Notifications */
// GET
router.get(
  "/",
  passport.authenticate("jwt"),
  notificationsController.get_notification
);

// PUT - read notification
router.put(
  "/:notification_id",
  passport.authenticate("jwt"),
  notificationsController.read_notification
);

// DELETE - delete notification
router.delete(
  "/:notification_id",
  passport.authenticate("jwt"),
  notificationsController.delete_notification
);

router.delete('/',
  passport.authenticate('jwt'),
  notificationsController.delete_all
)
module.exports = router;
