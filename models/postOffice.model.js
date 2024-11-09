import mongoose from "mongoose";

const postOfficeSchema = new mongoose.Schema({
  areaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Area",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cleanlinessScore: {
    type: Number,
    min: 0,
    max:100,
  },
  photoLinks: {
    type: [String],
    default: [],
  },
});

export const PostOffice = mongoose.model("PostOffice", postOfficeSchema);
