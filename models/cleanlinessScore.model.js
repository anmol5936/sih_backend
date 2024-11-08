import mongoose from "mongoose";

const cleanlinessScoreSchema = new mongoose.Schema({
  postOfficeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostOffice",
    required: true,
  },
  responseTime: {
    type: Date,
    required: true,
  },
  percentageOrganicWaste: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  quantity: {
    frequency: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  swatchComplianceTracker: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

export const CleanlinessScore = mongoose.model(
  "CleanlinessScore",
  cleanlinessScoreSchema
);
