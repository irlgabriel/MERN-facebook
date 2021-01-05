const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const commentController = require("../controllers/comments");

// GET comments
router.get("/", commentController.get_comments);

// GET replies
router.get("/:comment_id", commentController.get_replies);

// POST create comment
router.post(
  "/",
  passport.authenticate("jwt"),
  commentController.create_comment
);

// PUT edit comment
router.put(
  "/:comment_id",
  passport.authenticate("jwt"),
  commentController.edit_comment
);

// POST like comment
router.post(
  "/:comment_id",
  passport.authenticate("jwt"),
  commentController.like_comment
);

// DELETE delete comment
router.delete(
  "/:comment_id",
  passport.authenticate("jwt"),
  commentController.delete_comment
);

module.exports = router;
