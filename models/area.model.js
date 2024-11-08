import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  postOffices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostOffice",
    },
  ],
});

export const Area = mongoose.model("Area", areaSchema);
