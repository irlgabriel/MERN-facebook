const express = require("express");
const router = express.Router();

const passport = require("passport");

const friendsController = require("../controllers/friend_requests");

/** Friend Requests */

/* GET Friends Recommendations */
router.get(
  "/recommendations",
  passport.authenticate("jwt"),
  friendsController.get_friends_recommendations
);

// GET
router.get(
  "/",
  passport.authenticate("jwt"),
  friendsController.get_friends_requests
);

// POST Send
router.post(
  "/:user_id/send",
  passport.authenticate("jwt"),
  friendsController.send_friend_request
);

// POST Accept
router.post(
  "/:request_id/accept",
  friendsController.accept_friend_request
);

// POST Decline
router.post(
  "/:request_id/decline",
  friendsController.reject_friend_request
);

router.delete(
  "/:user_id/delete",
  passport.authenticate('jwt'),
  friendsController.delete_friend
)
module.exports = router;
