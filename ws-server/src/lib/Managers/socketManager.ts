import http from "http";
import WebSocket, { WebSocketServer } from "ws";

class SocketManager {
  static instance: SocketManager;
  private server: http.Server;

  constructor() {
    this.server = http.createServer();
    const wss = new WebSocketServer({ server: this.server });

    wss.on("connection", this.handleWSConnection);
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

  handleWSConnection(ws: WebSocket) {
    try {
      console.log(`${new Date().toISOString()} New client connected`);
      ws.on("error", console.error);

      ws.on("message", (message) => {
        // handle incoming message

        console.log(`Recieved message`, message);
      });

      ws.on("close", () => {
        // handle connection close
      });
    } catch (error: any) {
      console.log("Something Went Wrong", error.message);
    }
  }
}

export const socketManager = SocketManager.getInstance();
