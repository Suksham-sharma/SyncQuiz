class QuizManager {
  static instance: QuizManager;

  static getInstance() {
    if (!this.instance) {
      this.instance = new QuizManager();
    }
    return this.instance;
  }

  //  start quiz

  // send results

  // next question

  // join quiz  for user

  // submit answer for user
}

export const quizManager = QuizManager.getInstance();
