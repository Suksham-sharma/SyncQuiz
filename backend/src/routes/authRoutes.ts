import { Router } from "express";
import { login, logout, signup } from "../controller/authController";

export const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
