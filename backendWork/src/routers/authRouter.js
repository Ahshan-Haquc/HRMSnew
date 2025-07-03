const express = require("express");
const { userRegister, userLogin, userLogout, updatePassword, forgetPassword, resetPassword, activateUserAccount, findUserWithEmail } = require("../controllers/authController");
const { isLoggedOut, isLoggedIn, getUser } = require("../middleware/auth");

const authRouter = express.Router();

authRouter.post("/register",isLoggedOut, userRegister);
authRouter.post("/activate-user", activateUserAccount);
authRouter.post("/login",isLoggedOut ,userLogin);
authRouter.post("/logout",isLoggedIn ,userLogout);

authRouter.patch("/update-password",isLoggedIn, updatePassword);
authRouter.post("/forget-password", forgetPassword);
authRouter.patch("/reset-password", resetPassword);

authRouter.get("/finduserbyemail/:email", findUserWithEmail);




module.exports = authRouter; 