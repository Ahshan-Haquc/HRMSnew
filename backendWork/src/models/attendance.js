const { Schema, model } = require("mongoose");

const attendanceSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employees",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  checkIn: String,

  checkOut: String,

  totalHours: Number,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

attendanceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Attendance = model("Attendance", attendanceSchema);
module.exports = Attendance;
