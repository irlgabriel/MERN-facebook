import express, { Router } from "express";

import passport from "passport";

import * as notificationsController from "../controllers/notifications/notifications";

const router = Router();

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

router.delete(
  "/",
  passport.authenticate("jwt"),
  notificationsController.delete_all
);

export default router;
