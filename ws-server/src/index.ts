import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { processRequests } from "./lib/utils";

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  console.log(`${new Date().toISOString()} New client connected`);
  ws.on("error", console.error);

  ws.on("message", (message) => {
    // handle incoming message

    console.log(`Recieved message`, message);
  });

  ws.on("close", () => {
    // handle connection close
  });
});

async function startServer() {
  try {
    server.listen(8080, () => {
      console.log("Server started at Port 8080 ... ");
    });
  } catch (error: any) {
    console.log("Error while starting the server", error);
  }

  await processRequests();
}

startServer();
