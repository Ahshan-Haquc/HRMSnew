const { Schema, model } = require("mongoose");

const performanceReviewSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employees",
    required: true
  },
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  reviewDate: { type: Date, default: Date.now },
  feedback: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  goalsAchieved: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

performanceReviewSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const PerformanceReview = model("PerformanceReviews", performanceReviewSchema);
module.exports = PerformanceReview;
 