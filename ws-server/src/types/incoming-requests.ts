import { IncomingMessage } from "http";

declare module "http" {
  interface IncomingMessage {
    userId?: string;
    token?: string;
  }
}
