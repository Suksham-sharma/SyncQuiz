import { createClient, RedisClientType } from "redis";

const URL = process.env.REDIS_URL || "redis://localhost:6379";

export class RedisManager {
  private static instance: RedisManager;
  private queueClient: RedisClientType;
  private constructor() {
    this.queueClient = createClient({ url: URL });
    this.queueClient.connect();
  }

  public static getInstance() {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }
}

export const redisManager = RedisManager.getInstance();
