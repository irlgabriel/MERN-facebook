import { Router } from "express";

const router = Router();

/* GET home page. */
router.get("/", function (_, res) {
  console.log("HIT INDEX PAGE /");
  res.json("Express");
});

export default router;
