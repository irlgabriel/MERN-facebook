import { Router } from "express";
import passport from "passport";

import * as postController from "../controllers/posts/posts";

const router = Router();

router.get("/user", postController.get_user_posts);

// GET retrieve all posts for authenticated user (*)
router.get("/", passport.authenticate("jwt"), postController.get_posts);

// GET a post by id
router.get("/:post_id", passport.authenticate("jwt"), postController.get_post);

// POST create post
router.post("/", passport.authenticate("jwt"), postController.create_post);

// PUT edit post
router.put("/:post_id", passport.authenticate("jwt"), postController.edit_post);

router.post(
  "/:post_id/like",
  passport.authenticate("jwt"),
  postController.like_post
);

// DELETE delete post
router.delete(
  "/:post_id",
  passport.authenticate("jwt"),
  postController.delete_post
);

export default router;
