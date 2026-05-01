import HttpErrors from 'http-errors';
import users from '../models/users.js';


export  default (req,res,next)=>{
    try {
        const token = req.headers?.authorization || null;

        if (!token) {
            next(HttpErrors(401));
        }

        const decryptData =users.decrypt(token);
        if (!decryptData || !decryptData?.userID) {
            next(HttpErrors(401));
        }
        req.userId = decryptData.userID;
        next();
    }catch (e){
        next(HttpErrors(401));
    }

}