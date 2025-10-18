/* eslint-disable no-console */
import { createClient, RedisClientType } from "redis";
import envVars from "./env";

let redisClient: RedisClientType | null = null;

export const getRedisClient = () => {
  if (!redisClient) {
    redisClient = createClient({
      username: envVars.REDIS_USERNAME,
      password: envVars.REDIS_PASSWORD,
      socket: {
        host: envVars.REDIS_HOST,
        port: Number(envVars.REDIS_PORT),
        reconnectStrategy: (retries) => {
          // Exponential backoff up to ~5s
          const delay = Math.min(500 * 2 ** retries, 5000);
          return delay;
        },
        // Optional: increase timeouts if your network is chatty
        connectTimeout: 10_000,
        keepAlive: true,
      },
    });
  }

  redisClient.on("error", (err) => {
    // Don’t log secrets; keep it short
    console.error("[Redis] error:", err.message);
  });

  redisClient.on("reconnecting", () => console.warn("[Redis] reconnecting..."));

  return redisClient;
};

const connectRedis = async () => {
  const redisClient = getRedisClient();
  if (!redisClient.isOpen) {
    await redisClient.connect();
    // Sanity ping to fail fast if auth/ACL wrong
    await redisClient.ping();
    console.log("[Redis] connected");
  }
  return redisClient;
};

export default connectRedis;
