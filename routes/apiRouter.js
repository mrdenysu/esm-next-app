import { Router } from "express";
import authController from "../controllers/authController.js";

/* Auth */
const auth = Router();
auth.all("/login", authController.login);
auth.all("/registration", authController.registration);
auth.all("/get_validate_code", authController.get_validate_code);

/* Main API Router */
const router = Router();
router.use("/auth", auth);

export default router;
