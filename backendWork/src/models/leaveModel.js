const { Schema, model } = require("mongoose");

const leaveSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employees",
    required: true,
  },

  type: {
    type: String,
    enum: ['casual', 'sick', 'annual'],
    required: true
  },

  fromDate: Date,

  toDate: Date,

  reason: String,

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  appliedAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now }

});

leaveSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Leave = model("Leaves", leaveSchema);
module.exports = Leave;
