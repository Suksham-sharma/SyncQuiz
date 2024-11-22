import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import {
  addQuizQuestions,
  editQuizMetaData,
  getAllQuiz,
  deleteQuiz,
  createQuiz,
  getQuizById,
} from "../controller/quizController";

export const quizRoutes = Router();

quizRoutes.get("/", protectRoute, getAllQuiz);
quizRoutes.get("/:quizId", protectRoute, getQuizById);
quizRoutes.delete("/:quizId", protectRoute, deleteQuiz);
quizRoutes.post("/", protectRoute, createQuiz);
quizRoutes.post("/:quizId", protectRoute, addQuizQuestions);
quizRoutes.put("/:quizId", protectRoute, editQuizMetaData);
