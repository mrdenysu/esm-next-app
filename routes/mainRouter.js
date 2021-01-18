import { Router } from "express";

const router = Router();


router.all("/", (req, res) => {
  res.json({
    s: 1
  })
})

export default router;
