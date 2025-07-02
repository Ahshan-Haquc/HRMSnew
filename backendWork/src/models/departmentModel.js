const { Schema, model } = require("mongoose");

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  designations: [String],

  createdAt: { type: Date, default: Date.now },
  
  updatedAt: { type: Date, default: Date.now }
});

departmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Department = model("Departments", departmentSchema);
module.exports = Department;
