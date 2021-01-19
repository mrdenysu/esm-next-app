import { Router } from "express";
import authController from "../controllers/authController.js";
import { body } from "express-validator";

/* Auth */
const auth = Router();
auth.post(
  "/login", 
  [
    body("email").isEmail().notEmpty(), 
    body("password").isLength({ min: 5, max: 32 })
  ], 
  authController.login.bind(authController)
);

auth.post(
  "/registration", 
  [
    body("email").isEmail().notEmpty(), 
    body("password").isLength({ min: 5, max: 32 }), 
    body("code").isLength({ min: 167, max: 167 })
  ], 
  authController.registration.bind(authController)
);

auth.post(
  "/get_validate_code", 
  [
    body("email").isEmail().notEmpty()
  ], 
  authController.get_validate_code.bind(authController)
);

auth.all(
  "/exit", 
  authController.exit.bind(authController)
);

/* Main API Router */
const router = Router();
router.use("/auth", auth);

export default router;
