import { generateOpaqueToken } from '../config/google.js'
import redisClient from '../config/redis.js';

const SESSION_EXPIRY = 72 * 60 * 60; // 24 hours in seconds


export const createSession = async (userId) => {
    const token = generateOpaqueToken();
    const sessionData = {
      userId,
      createdAt: Date.now()
    };

    await redisClient.set(
      `session:${token}`, 
      JSON.stringify(sessionData),
      { EX: SESSION_EXPIRY }
    );

    return token;
}

export const getSession = async (token) => {
    const session = await redisClient.get(`session:${token}`);
    if (!session) return null;
    return JSON.parse(session);
}

export const deleteSession = async (token) => {
    await redisClient.del(`session:${token}`);
}

export const deleteUserSessions = async (userId) => {
      // If you need to delete all sessions for a user, you'd need to implement a user-to-sessions index
      const pattern = `session:*`;
      const keys = await redisClient.keys(pattern);
      
      for (const key of keys) {
        const session = await redisClient.get(key);
        const sessionData = JSON.parse(session);
        if (sessionData.userId === userId) {
          await redisClient.del(key);
        }
      }
}
