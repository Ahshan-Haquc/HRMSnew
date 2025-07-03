const createError = require('http-errors');

const { findWithId } = require("../helper/findWithId");
const Employee = require("../models/employeeModel");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");

const addEmployee = async (req, res, next) => {
    try {
        const { userId, name, department, designation, contact, address, joinDate, dateOfBirth, skills, experience, certificates} = req.body;

        const userExists = await findWithId(User, userId, {})
        if (!userExists) {
            throw createError(409, "The User dose not exists with this id.");
        }

        // // Create new employee
        const employeeData = { userId, name, department, designation, contact, address, joinDate, dateOfBirth, skills, experience, certificates};
        const employe = await Employee.create(employeeData);

        return successResponse(res, {
            statusCode: 200,
            message: "Employee added successfully..!",
            payload: {employeeData},
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {addEmployee}