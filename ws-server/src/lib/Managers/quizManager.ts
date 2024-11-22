import { QUIZES } from "../../db";

class QuizManager {
  static instance: QuizManager;

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
  createQuiz(quizId: string, creatorId: string) {
    try {
      const findQuiz = this.getQuizById(quizId);
      if (findQuiz.status) {
        return { message: "Quiz Already Exists" };
      }
      // fetcg quizData + everything from DB
    } catch (error: any) {}
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
