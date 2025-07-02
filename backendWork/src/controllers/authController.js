const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const User = require("../models/userModel");
const { successResponse } = require('./responseController');
const createJSONWebToken = require('../helper/jsonWebToken');
const { jwtAccessKey, jwtRefreshKey, jwtResetPasswordKey, clientUrl, jwtActivationKey } = require('../secret');
const emailWithNodeMailer = require('../helper/email');
 
const userRegister = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw createError(409, "User already exists with this email.");
        }

        // Create new user
        const userData = { email, password,};
        //create jwt
        const token = createJSONWebToken(userData, jwtActivationKey, '10m');

        const emailData = {
            email,
            subject: 'Activate Your HRMS Account',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #2c3e50;">Welcome to HRMS!</h2>
                <p style="font-size: 16px; color: #333;">
                    Please click the link below to activate your account:
                </p>
                <a href="http://localhost:4001/api/auth/activate-user/${token}"
                    style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;"
                    target="_blank">
                    Activate Account
                </a>
                <p style="margin-top: 20px; font-size: 14px; color: #555;">
                    Or copy and paste this link into your browser:<br>
                    <a href="http://localhost:4001/api/auth/activate-account/${token}" target="_blank">
                    http://localhost:4001/api/auth/activate-account/${token}
                    </a>
                </p>
                </div>
            `
        };

        //send email with nodemailer
        try {
            await emailWithNodeMailer(emailData);
        } catch (emailError) {
            next(createError(500, 'Failed to send varification email'));
            return;
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} for completing your registration process `,
            payload: { token },
        });
    } catch (error) {
        next(error);
    }
};

const activateUserAccount = async (req, res, next) => {
    try {
        const token = req.body.token;
        if (!token) throw createError(404, 'Token not found');
        try {
            const decoded = jwt.verify(token, jwtActivationKey);
            // console.log(decoded);
            if (!decoded) throw createError(401, 'User registration faild');

            const userExists = await User.exists({ email: decoded.email });
            if (userExists) {
                throw createError(409, "User alrady Registered. Please Signin");
            }
            // Create new user
            await User.create(decoded);

            const email = decoded.email
            const user = await User.findOne({ email });
            // Generate Access Token
            const accessToken = createJSONWebToken({ id: user._id }, jwtAccessKey, "7d");

            // Set Access Token Cookie
            res.cookie('accessToken', accessToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            });

            // Generate Refresh Token
            const refreshToken = createJSONWebToken({ id: user._id }, jwtRefreshKey, "7d");

            // Set Refresh Token Cookie
            res.cookie('refreshToken', refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            });
            return successResponse(res, {
                statusCode: 201,
                message: 'Your Account Activated Successfully',

            });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw createError(401, 'Your Activation link validity has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw createError(401, 'Invalid Activation link');
            } else {
                throw error;
            }
        }
    } catch (error) {
        next(error);
    }

}

const userLogin = async (req, res, next) => {   
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            throw createError(404, "You are not registered with this email. Please register now.");
        }

        // Check if the user is banned
        if (!user.isActive) {
            throw createError(403, "Your account has been banned. Please contact the support team for more information.");
        }

        // Compare the password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw createError(401, "Incorrect password. Please try again.");
        }

        // Generate Access Token
        const accessToken = createJSONWebToken({ id: user._id }, jwtAccessKey, "7d");

        // Set Access Token Cookie
        res.cookie('accessToken', accessToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        // Generate Refresh Token
        const refreshToken = createJSONWebToken({ id: user._id }, jwtRefreshKey, "7d");

        // Set Refresh Token Cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        // Remove the password from the user object
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;


        return successResponse(res, {
            statusCode: 200,
            message: "You are logged in successfully.",
            payload: userWithoutPassword
        });
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        if (!oldRefreshToken) {
            throw createError(401, "No refresh token provided.");
        }

        const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);

        const id = decodedToken.id;

        const option = { password: 0 }; // Exclude password from the result
        const user = await findWithId(User, id, option);

        if (!user) {
            throw createError(404, "User not found.");
        }
        res.json(user);

        return successResponse(res, {
            statusCode: 200,
            message: "User returned successfully",
            payload: { user },
        });
    } catch (error) {
        next(error); // Pass error to error handling middleware
    }
};

const findUserWithEmail = async (req, res, next) => {
    try {
        const { email } = req.params;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw createError(404, "You are not registered with this email. Please register now.");
        }
        return successResponse(res, {
            statusCode: 200,
            message: " User Return Successfully",
            payload: user
        })
    } catch (error) {

    }

}

const userLogout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken', {
            maxAge: 0,
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        res.clearCookie('refreshToken', {
            maxAge: 0,
            httpOnly: true,
            secure: true,
            sameSite: 'None',

        });

        return successResponse(res, {
            statusCode: 200,
            message: " You are logged out successfully."
        })
    } catch (error) {
        next(error)
    }
}

const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const userData = await User.findOne({ email: email });
        if (!userData) {
            throw new Error("User does not exist with this email address.");
        }

        // Create a reset token valid for 10 minutes
        const token = createJSONWebToken({ email }, jwtResetPasswordKey, '10m');


        // Prepare email data
        const emailData = {
            email,
            subject: 'Reset Password Email',
            html: `
                <h2>Hello!</h2>
                <p>Please click here to <a href="http://localhost:4001/api/auth/reset-password/${token}" target="_blank">reset your password</a></p>
            `,
        };

        // Send email with nodemailer
        await emailWithNodeMailer(emailData);

        return successResponse(res, {
            statusCode: 200,
            message: `Please check your email (${email}) to complete your password reset.`,
            payload: token,
        });

    } catch (error) {
        if (error.message === "User does not exist with this email address.") {
            next(createError(404, error.message));
        } else {
            next(createError(500, "An error occurred while processing your request."));
        }
    }
};


const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        const decoded = jwt.verify(token, jwtResetPasswordKey);
        if (!decoded) {
            throw createError(401, 'Your password reset faild');
        }

        const userData = await User.findOne({ email: decoded.email });

        console.log(userData)


        const updates = { $set: { password: newPassword } };
        const updateOption = { new: true, runValidators: true, context: 'query' };

        const updatedUser = await User.findByIdAndUpdate(userData._id, updates, updateOption).select("-password");

        if (!updatedUser) {
            throw new Error("Your password was not reset successfully");

        }
        console.log(req.user);

        return successResponse(res, {
            statusCode: 200,
            message: 'Your password reset successfully',
            payload: {}

        });
    } catch (error) {

        next(error);
    }

}

const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        // Check if the old password is correct
        const isOldPasswordMatch = await bcrypt.compare(oldPassword, req.user.password);
        if (!isOldPasswordMatch) {
            throw new Error("Wrong password. Please try again!!!");
        }


        // Ensure the old and new passwords are different
        const PasswordMatch = await bcrypt.compare(newPassword, req.user.password);
        if (PasswordMatch) {
            throw new Error("Your old and new passwords are the same. Please enter one or more different characters and try again.");
        }

        const updates = { $set: { password: newPassword } };
        const updateOption = { new: true, runValidators: true, context: 'query' };

        const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, updateOption).select("-password");

        if (!updatedUser) {
            throw new Error("Failed! Your password was not updated.");
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Your password updated successfully',
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { userRegister, userLogin, userLogout, forgetPassword, resetPassword, updatePassword, getUser, activateUserAccount, findUserWithEmail };
