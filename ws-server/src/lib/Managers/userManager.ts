import WebSocket from "ws";
import { quizManager } from "./quizManager";

class UserManager {
  static instance: UserManager;
  private quizManager;

  constructor() {
    this.quizManager = quizManager;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new UserManager();
    }
    return this.instance;
  }

  private sendErrorResonse(ws: WebSocket, message: string) {
    ws.send(JSON.stringify({ type: "error", payload: message }));
    ws.close();
  }

  handleIncomingWSRequest(
    message: string,
    ws: WebSocket,
    userId: string,
    authToken?: string
  ) {
    try {
      this.processUserRequest(userId, JSON.parse(message), authToken);
      console.log(`Processed Request`);
    } catch (error: any) {
      this.sendErrorResonse(ws, `Something Went Wrong: ${error.message}`);
    }
  }

  private processUserRequest(userId: string, payload: any, authToken?: string) {
    const { quizId, eventType } = payload;
    console.log(`Processing User Request`, payload);

    if (eventType === "createQuiz") {
      if (!quizId) return;
      console.log(`Creating Quiz`, quizId);

      this.quizManager.createQuiz(quizId, userId, authToken);
    }

    if (eventType === "joinQuiz") {
      this.quizManager.joinQuiz(payload.quizId, userId);
    }

    if (eventType === "submitAnswer") {
      this.quizManager.submitAnswer(
        payload.quizId,
        userId,
        payload.questionId,
        payload.answerId
      );
    }
  }
}

export const userManager = UserManager.getInstance();
