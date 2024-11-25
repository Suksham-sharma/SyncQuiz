import http, { request } from "http";
import WebSocket, { RawData, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { userManager } from "./userManager";
import url from "url";
import internal from "stream";
import { config } from "../config";

class SocketManager {
  static instance: SocketManager;
  private server: http.Server;
  private userManager;

  constructor() {
    this.userManager = userManager;
    this.server = http.createServer();
    const wss = new WebSocketServer({
      server: this.server,
    });

    this.server.on("upgrade", (request, socket, head) => {
      this.handleServerVerification(request, socket, head);
    });

    wss.on("connection", (ws: WebSocket, request: http.IncomingMessage) => {
      this.handleWSConnection(ws, request);
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SocketManager();
    }
    return this.instance;
  }

  start(port: number) {
    try {
      this.server.listen(port, () => {
        console.log(`Server started on port ${port}`);
      });
    } catch (error: any) {
      console.log("Something Went Wrong", error.message);
    }
  }

  handleServerVerification(
    request: http.IncomingMessage,
    socket: internal.Duplex,
    head: Buffer
  ) {
    if (request.url) {
      const { query } = url.parse(request.url, true);
      const token = query.token as string;
      console.log("Token", token);

      if (!token) {
        socket.destroy();
      }

      const { status, userId } = this.handleTokenVerification(token);

      if (!status) {
        socket.destroy();
        return;
      }

      request.userId = userId;

      console.log("User Id", userId);
      console.log("Upgraded ");
    } else {
      socket.destroy();
    }
  }

  handleWSConnection(ws: WebSocket, request: http.IncomingMessage) {
    try {
      console.log(`${new Date().toISOString()} New client connected`);
      ws.on("error", console.error);

      ws.on("message", (message) => {
        this.handleMessage(request, ws, message);
      });

      ws.on("close", () => {
        // handle connection close
      });
    } catch (error: any) {
      console.log("Something Went Wrong", error.message);
    }
  }

  handleMessage(
    request: http.IncomingMessage,
    ws: WebSocket,
    message: RawData
  ) {
    try {
      const userId = request.userId;
      console.log("User Id", userId);

      if (!userId) {
        ws.close();
        console.log("User Id Not Found");
        return;
      }

      console.log("Message", message);
      const stringifiedMessage = message.toString();
      this.userManager.handleIncomingWSRequest(stringifiedMessage, ws, userId);
    } catch (error: any) {
      console.log("Something Went Wrong", error.message);
    }
  }

  private handleTokenVerification(token: string) {
    try {
      console.log("jwtSecret", config.jwtSecret);
      const decodeData = jwt.verify(token, config.jwtSecret) as {
        userId: string;
      };
      console.log("Decoded Data", decodeData);
      if (!decodeData.userId) {
        return { status: false };
      }

      return { status: true, userId: decodeData.userId };
    } catch (error: any) {
      console.log("Error", error.message);
      return { status: false };
    }
  }
}

export const socketManager = SocketManager.getInstance();
