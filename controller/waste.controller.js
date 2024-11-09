import { Waste } from "../models/waste.model.js";
import { PostOffice } from "../models/postOffice.model.js";

export const wasteManagement = async (req, res) => {
  try {
    const {
      postOfficeId,
      type,
      isAccidentProne,
      size,
      longitude,
      latitude,
      photoLink,
    } = req.body;
    if (!postOfficeId) {
      return res.status(400).json({
        success: false,
        message: "postOfficeId are required",
      });
    }
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "type are required",
      });
    }
    if (!isAccidentProne) {
      return res.status(400).json({
        success: false,
        message: "isAccidentProne are required",
      });
    }
    if (!size) {
      return res.status(400).json({
        success: false,
        message: "size are required",
      });
    }
    if (!photoLink) {
      return res.status(400).json({
        success: false,
        message: "photoLink are required",
      });
    }
    const currentDateTime = new Date();
    const postOffice = await PostOffice.findById(postOfficeId);
    if (!postOffice) {
      return res.status(404).json({
        success: false,
        message: "Post Office not found",
      });
    }

    const waste = await Waste.create({
      date: currentDateTime,
      type,
      isAccidentProne,
      size,
      longitude,
      latitude,
      postOfficeId,
      photoLink,
    });
    await PostOffice.findByIdAndUpdate(
      postOfficeId,
      {
        $push: { photoLinks: photoLink },
      },
      { new: true }
    );
    return res.status(201).json({
      success: true,
      message: "Waste record created successfully",
      data: waste,
    });
  } catch (error) {
    console.error("Error in cleanlinessScore:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
