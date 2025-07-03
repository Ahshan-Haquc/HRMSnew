const { Schema, model } = require("mongoose");
const { nanoid } = require("nanoid");

const employeeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },

  name: {
    type: String,
    required: [true, "Employee name is required"],
    trim: true,
    minlength: 3
  },

  employeeId: {
    type: String,
    unique: true,
    minlength: 9,
    maxlength: 9,
    default: () => nanoid(9)
  },

  department: {
    type: String,
    required: [true, "Department is required"]
  },

  designation: {
    type: String,
    required: [true, "Designation is required"]
  },

  contact: {
    type: String,
    validate: {
      validator: v => /^01[3-9]\d{8}$/.test(v),
      message: "Please enter a valid Bangladeshi phone number"
    }
  },

  address: String,

  joinDate: {
    type: Date,
    default: Date.now
  },

  dateOfBirth: Date,

  skills: [String],

  experience: {
    type: Number,
    min: 0
  },

  trainingsCompleted: [String],

  certificates: [String],

  profileImage: String,

  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

employeeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

employeeSchema.pre("save", function (next) {
  if (!this.employeeId) {
    this.employeeId = nanoid(); // Generate a 9-digit unique ID

  }
  next();
});

const Employee = model("Employees", employeeSchema);
module.exports = Employee;
