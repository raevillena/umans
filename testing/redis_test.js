import redisClient from "../config/redis.js";
import crypto from 'crypto';

const accessToken = crypto.randomBytes(32).toString('hex');


const accessTTL = 20; // 15 min expiry
const user = {
    'id':'1',
    'userType':'admin',
};


await redisClient.set(`test:${accessToken}`, JSON.stringify(user), {'EX': accessTTL});

const {id,userType} = JSON.parse(await redisClient.get(`test:${accessToken}`))
console.log("token: ",`test:${accessToken}`)
console.log("id: ", id);
console.log("userType: ", userType);