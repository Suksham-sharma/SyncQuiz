import { IncomingMessageRequestData } from "../../types/incoming-requests";
import WebSocket from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { quizManager } from "./quizManager";

dotenv.config();

interface userData {
  userId: string;
  type: string;
}

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

  handleIncomingWSRequest(message: string, ws: WebSocket) {
    try {
      console.log("Message", message);

      console.log(`Processed Request`);
    } catch (error: any) {
      this.sendErrorResonse(ws, `Something Went Wrong: ${error.message}`);
    }
  }

  private getUserStatus(userToken: string) {
    try {
      const info = jwt.verify(
        userToken,
        process.env.JWT_SECRET || ""
      ) as userData;
      return { info, status: "true" };
    } catch {
      return { status: "false" };
    }
  }

  // handle incoming message
  // user Actions
  private handleUserRequest(userId: string, payload: any) {
    if (payload.eventType === "joinQuiz") {
      this.quizManager.joinQuiz(payload.quizId, userId);
    }

    if (payload.eventType === "submitAnswer") {
      this.quizManager.submitAnswer(
        payload.quizId,
        userId,
        payload.questionId,
        payload.answerId
      );
    }
  }

  // admin Actions
  private handleAdminRequest(userId: string, payload: any) {
    if (payload.eventType === "createQuiz") {
      this.quizManager.createQuiz(payload.quizId, userId);
    }
  }
}

export const userManager = UserManager.getInstance();
