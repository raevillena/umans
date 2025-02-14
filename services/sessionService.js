import crypto from 'crypto';
import redisClient from '../config/redis.js';
import RefreshToken from '../models/refreshTokenModel.js';

export const generateTokens = async (id, role, appId) => {
  const accessToken = crypto.randomBytes(32).toString('hex');
  const refreshToken = crypto.randomBytes(64).toString('hex');

  const accessTTL = 900; // 15 min expiry
  const refreshTTL = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry

  // Store access token in Redis
  await redisClient.set(`access:${accessToken}`, JSON.stringify({id, role, appId}), {'EX':accessTTL});

  // Store refresh token in MariaDB
  await RefreshToken.create({ token: refreshToken, userId: id, appId: appId, expiresAt: refreshTTL });

  return { accessToken, refreshToken };
}


export const reGenerateAccessToken = async (id, role, appId) => {
  const accessToken = crypto.randomBytes(32).toString('hex');
  const accessTTL = 900; // 15 min expiry

  // Store access token in Redis
  await redisClient.set(`access:${accessToken}`, JSON.stringify({id, role, appId}), {'EX':accessTTL});
  return { accessToken };
}

export const verifyToken = async (token, type) => {
  if (type === 'access') {
    const res = await JSON.parse(await redisClient.get(`access:${token}`)) || false;
    return res;
  } else if (type === 'refresh') {
    return await RefreshToken.findOne({ where: { token } });
  }
}

export const revokeToken = async (token, type) => {
  if (type === 'access') {
    await redisClient.del(`access:${token}`);
  } else if (type === 'refresh') {
    await RefreshToken.destroy({ where: { token } });
  }
}
