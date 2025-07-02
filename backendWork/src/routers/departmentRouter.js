const express = require("express");
const {isLoggedIn,} = require("../middleware/auth");
const { addEmployee } = require("../controllers/employeeController");
const { addDepartment } = require("../controllers/departMentController");

const departmentRouter = express.Router();

departmentRouter.post("/add",isLoggedIn, addDepartment);

module.exports = departmentRouter; 