const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { jwtAccessKey, jwtRefreshKey} = require('../secret');
const User = require('../models/userModel');
const { findWithId } = require('../helper/findWithId');
const { successResponse } = require('../controllers/responseController');


const isLoggedIn = async(req, res, next)=>{
    try {
        const token = req.cookies.accessToken;
        if(!token){
            throw createError(404, 'You are alrady logged out');
        }
        const decodedToken = jwt.verify(token, jwtAccessKey);
        if(!decodedToken){
            throw createError(404, 'Invalid Access,Please login again');
        }
        const id = decodedToken.id;
        const user = await findWithId(User, id);

        req.user = user;
        console.log(req.user)
        next();

    } catch (error) {
        return next(error);
    }
}

const isLoggedOut = async(req, res, next)=>{
    try {
        const token = req.cookies.accessToken;
        if(token){
            throw createError(400, 'You are already logged in');
        }
        next();

    } catch (error) {
        return next(error);
    }
}

const isAdmin = async(req, res, next)=>{
    try {
        
        if(!req.user.isAdmin){
            throw createError(403, 'Forbidden. You  must be an admin to access this resource');
        }
        next();

    } catch (error) {
        return next(error);
    }
}

const handleRefreshToken = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);
        if (!decodedToken) {
            throw createError(401, "Please login again")
        }

        const accessToken = createJSONWebToken(decodedToken.user, jwtAccessKey, '5m');

        res.cookie('accessToken', accessToken, {
            maxAge: 5 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',

        });

        //Success Response 
        return successResponse(res, {
            statusCode: 200,
            message: 'New access token is generated',
            payload: { id },
        });
    } catch (error) {
        next(error);
    }
}



module.exports = {isLoggedIn, isLoggedOut, isAdmin};