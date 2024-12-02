import { getQuizByIdApi } from "../../api";
import { QUIZES } from "../../db";
import { quizModel } from "../Models/Quiz";

class QuizManager {
  static instance: QuizManager;
  private quizModel;

  constructor() {
    this.quizModel = quizModel;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new QuizManager();
    }
    return this.instance;
  }

  private getQuizById(quizId: string) {
    const quiz = QUIZES[quizId];
    if (!quiz) {
      return { status: false, message: "Quiz Not Found" };
    }
    return { quiz, status: true };
  }

  // create quiz
  async createQuiz(quizId: string, creatorId: string, authToken?: string) {
    try {
      console.log(`Creating Quiz here`, quizId);
      const findQuiz = this.getQuizById(quizId);
      if (findQuiz.status) {
        console.log(`Quiz Already Exists`);
        return { message: "Quiz Already Exists" };
      }

      const quizData = await getQuizByIdApi(quizId, authToken);
      const { status, quiz } = quizData;

      if (!status) {
        return { message: "Unable to fetch Quiz Data" };
      }

      this.quizModel.createQuiz(quiz.data);
    } catch (error: any) {
      console.log(`Error`, error.message);
    }
  }

  // update quiz, real time quiz updates : questions which have been passed can't be updated / deleted
  updateQuiz(quizId: string, creatorId: string) {}

  //  start quiz
  startQuiz(quizId: string, creatorId: string) {}

  // send results to all the connected users
  sendResults(quizId: string, creatorId: string) {}

  // next question , questionIndex +1 , and send question to all the connected users
  nextQuestion(quizId: string, creatorId: string) {}

  // join quiz  for user
  joinQuiz(quizId: string, userId: string) {}

  // submit answer for user
  submitAnswer(
    quizId: string,
    userId: string,
    questionId: string,
    answerId: string
  ) {}
}

export const quizManager = QuizManager.getInstance();
