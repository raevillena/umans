import redisClient from "../config/redis.js";


const authenticateSession = async (req, res, next) => {
    //get token from request header
    const token = req.headers.authorization?.split(' ')[1];

    //check if token is present, otherwise send error
    if (!token){
        const error = new Error('Unauthorized');
        error.status = 401;
        return next(error);
    } 
    //counter check and get userId as a way to check validity
    const userId = await redisClient.get(`access:${token}`);
    
    //if userId is present then continue, otherwise send error
    if (!userId) {
        const error = new Error('Invalid or expired session');
        error.status = 401;
        return next(error);
    }

    req.userId = userId;
    next();
}

export default authenticateSession