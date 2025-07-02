const { Schema, model } = require("mongoose");

const salarySchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employees",
    required: true,
  },

  month: {
    type: String,
    required: true
  },

  year: {
    type: Number,
    required: true
  },

  baseSalary: Number,

  increment: Number,

  netSalary: Number,

  paySlipLink: String,

  paidDate: Date,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

salarySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Salary = model("Salaries", salarySchema);
module.exports = Salary;
