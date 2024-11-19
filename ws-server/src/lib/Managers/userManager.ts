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
      const { token, payload }: IncomingMessageRequestData =
        JSON.parse(message);

      const userData = this.getUserStatus(token);
      if (!userData.info) {
        this.sendErrorResonse(ws, "Invalid Token");
        return;
      }

      if (!userData.info?.type)
        this.sendErrorResonse(ws, "Unable to Verify User");

      if (userData.info?.type === "creator")
        this.handleAdminRequest(userData.info?.userId, payload);
      else this.handleUserRequest(userData.info?.userId, payload);

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

  // user Actions
  private handleUserRequest(userId: string, payload: any) {
    // quiz Manager will be called depending upon the action in the payload
  }

  // admin Actions
  private handleAdminRequest(userId: string, payload: any) {
    // same here
  }
}

export const userManager = UserManager.getInstance();
