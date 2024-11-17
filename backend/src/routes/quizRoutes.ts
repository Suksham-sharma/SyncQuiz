import {Router} from 'express';
import { protectRoute } from '../middleware/auth';
import { addQuestionIntoQuiz, editQuizMetaData, getAllQuiz, deleteQuiz, createQuiz } from '../controller/quizController';

export const quizRoutes = Router();

quizRoutes.get('/', protectRoute, getAllQuiz);
quizRoutes.delete('/:quizId', protectRoute, deleteQuiz);
quizRoutes.post('/', protectRoute, createQuiz);
quizRoutes.post('/questions', protectRoute, addQuestionIntoQuiz);
quizRoutes.put('/:quizId', protectRoute, editQuizMetaData);

