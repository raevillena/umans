
import { verifyToken } from '../services/sessionService.js'

const authenticateUser = async (req, res, next) => {
    //get token from request header
    const token = req.headers.authorization?.split(' ')[1];

    //check if token is present, otherwise send error
    if (!token){
        const error = new Error('Unauthorized');
        error.status = 401;
        return next(error);
    } 
    //counter check and get userId as a way to check validity
    const {id, role, appId} = await verifyToken(token, 'access');
    
    //if userId is present then continue, otherwise send error
    if (!id) {
        const error = new Error('Invalid or expired session');
        error.status = 401;
        return next(error);
    }

    if (role === 'user') {
        return next();
    }

    const error = new Error('Alien Detected');
    error.status = 401;
    return next(error);
}

const authenticateAdmin = async (req, res, next) => {
    try{
        //get token from request header
        const token = req.headers.authorization?.split(' ')[1];

        //check if token is present, otherwise send error
        if (!token){
            const error = new Error('Unauthorized');
            error.status = 401;
            return next(error);
        } 
        //counter check and get userId as a way to check validity

        const {id, role, appId} = await verifyToken(token, 'access');

        //if userId is present then continue, otherwise send error
        if (!id) {
            const error = new Error('Invalid or expired session');
            error.status = 401;
            return next(error);
        }

        if (role === 'user') {
            const error = new Error('Your are not an admin. Access denied.');
            error.status = 401;
            return next(error);
        }

        if (role === 'admin') {
            //req.userId = id;
            return next();
    }
    }catch(error){
        error.status = 500;
        return next(error);
    }

    const error = new Error('Alien Detected');
    error.status = 401;
    return next(error);

}

export {authenticateUser, authenticateAdmin};