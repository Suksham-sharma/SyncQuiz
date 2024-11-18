import { Router } from "express";
import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";
import { quizRoutes } from "./quizRoutes";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use('/user', userRoutes);
apiRouter.use('/quiz', quizRoutes);
