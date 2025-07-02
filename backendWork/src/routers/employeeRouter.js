const express = require("express");
const { isLoggedOut, isLoggedIn,} = require("../middleware/auth");
const { addEmployee } = require("../controllers/employeeController");

const employeRouter = express.Router();

employeRouter.post("/add",isLoggedIn, addEmployee);

module.exports = employeRouter; 