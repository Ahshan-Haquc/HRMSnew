const { Schema, model } = require("mongoose");
const { nanoid } = require("nanoid");

const jobSchema = new Schema({
  jobId: {
    type: String,
    unique: true,
    default: () => nanoid(10)
  },

  title: {
    type: String,
    required: true
  },

  department: String,

  description: String,

  postedDate: { type: Date, default: Date.now },

  deadline: Date,
  
  updatedAt: { type: Date, default: Date.now }
});

jobSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Job = model("Jobs", jobSchema);
module.exports = Job;
