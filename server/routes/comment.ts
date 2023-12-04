import express, { Router } from "express";
import passport from "passport";

import * as commentController from "../controllers/comments/comments";

const router = Router();

// GET comments
router.get("/posts/:post_id/comments", commentController.get_comments);

// GET replies
router.get(
  "/posts/:post_id/comments/:comment_id",
  commentController.get_replies
);

// POST create comment
router.post(
  "/posts/:post_id/comments",
  passport.authenticate("jwt"),
  commentController.create_comment
);

// PUT edit comment
router.put(
  "/posts/:post_id/comments/:comment_id",
  passport.authenticate("jwt"),
  commentController.edit_comment
);

// POST like comment
router.post(
  "/posts/:post_id/comments/:comment_id",
  passport.authenticate("jwt"),
  commentController.like_comment
);

// DELETE delete comment
router.delete(
  "/posts/:post_id/comments/:comment_id",
  passport.authenticate("jwt"),
  commentController.delete_comment
);

export default router;
