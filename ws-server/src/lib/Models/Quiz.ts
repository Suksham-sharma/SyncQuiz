import { QUIZES } from "../../db";
import { QuizStructure } from "../../types";

class Quiz {
  static instance: Quiz;
  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new Quiz();
    }
    return this.instance;
  }

  createQuiz(quizData: QuizStructure) {
    QUIZES[quizData.id] = quizData;

    console.log(`Quiz Created`, QUIZES);
  }
}

export const quizModel = Quiz.getInstance();
