import { Router } from "express";

const router = Router();

router.all("/", (req, res) => {
  res.json({
    body: req.body,
    query: req.query,
    message: "Hello world",
  });
});

export default router;
