const createError = require('http-errors');

const { successResponse } = require("./responseController");
const Department = require('../models/departmentModel');

const addDepartment = async (req, res, next) => {
    try {
        const {name, designations} = req.body;

        // Create new Department
        const departmentData = {name, designations};
        const department = await Department.create(departmentData);

        return successResponse(res, {
            statusCode: 200,
            message: "Department added successfully..!",
            payload: department,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {addDepartment}