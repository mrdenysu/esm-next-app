import { Router } from "express";
import authController from "../controllers/authController.js";
import { body } from "express-validator";
import roleMiddleware from "../middlewares/roleMiddleware.js";

/* Auth */
const auth = Router();
auth.post(
  "/login", 
  [
    body("email").isEmail().notEmpty(), 
    body("password").isLength({ min: 5, max: 32 }),
  ],
  roleMiddleware([]), // Только для гостей
  authController.login.bind(authController)
);

auth.post(
  "/registration", 
  [
    body("email").isEmail().notEmpty(), 
    body("password").isLength({ min: 5, max: 32 }), 
    body("code").isLength({ min: 167, max: 167 })
  ], 
  roleMiddleware([]), // Только для гостей
  authController.registration.bind(authController)
);

auth.post(
  "/get_validate_code", 
  [
    body("email").isEmail().notEmpty()
  ], 
  roleMiddleware([]), // Только для гостей
  authController.get_validate_code.bind(authController)
);

auth.all(
  "/exit", 
  roleMiddleware(["USER"]),
  authController.exit.bind(authController)
);

/* Main API Router */
const router = Router();
router.use("/auth", auth);

export default router;
