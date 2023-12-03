import { Router } from "express";

const router = Router();

/* GET home page. */
router.get("/", function (_, res) {
  res.json("Express");
});

export default router;
