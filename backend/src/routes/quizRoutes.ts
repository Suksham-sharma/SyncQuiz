import {Router} from 'express';
import { protectRoute } from '../middleware/auth';
import { addQuizQuestionsData, editQuizMetaData, getAllQuiz, deleteQuiz, createQuiz, editQuizQuestionData } from '../controller/quizController';

export const quizRoutes = Router();

quizRoutes.get('/', protectRoute, getAllQuiz);
quizRoutes.post('/', protectRoute, createQuiz);
quizRoutes.put('/:quizId', protectRoute, editQuizMetaData);
quizRoutes.delete('/:quizId', protectRoute, deleteQuiz);

quizRoutes.post('/:quizIds', protectRoute, addQuizQuestionsData);
quizRoutes.put('/question/:questionId', protectRoute, editQuizQuestionData);