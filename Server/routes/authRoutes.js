import express from "express";
import { login, logout, signUp } from "../controllers/authController.js";
import { validateAuth } from "../middlewares/validationMiddleware.js";
const router = express.Router();


router.post("/signup",validateAuth,signUp);
router.post("/login",validateAuth,login);
router.post("/logout",logout);

export default router;
