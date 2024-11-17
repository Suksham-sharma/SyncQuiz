import { Router } from "express";
import { getme } from "../controller/authController";
import { protectRoute } from "../middleware/auth";

export const userRoutes = Router();

userRoutes.get("/me", protectRoute ,getme);