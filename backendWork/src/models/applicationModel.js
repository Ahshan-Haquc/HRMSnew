const { Schema, model } = require("mongoose");

const applicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Jobs",
    required: true
  },

  name: String,

  email: {
    type: String,
    required: true,
    validate: {
      validator: v => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(v),
      message: "Invalid email format"
    }
  },

  resumeLink: String,

  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interviewed', 'hired', 'rejected'],
    default: 'applied'
  },

  interviewDate: Date,
  
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

applicationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Application = model("Applications", applicationSchema);
module.exports = Application;
