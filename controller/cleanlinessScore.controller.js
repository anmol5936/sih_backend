import { CleanlinessScore } from "../models/cleanlinessScore.model.js";
import { PostOffice } from "../models/post.model.js";

export const cleanlinessScore = async (req, res) => {
  try {
    const {
      postOfficeId,
      responseTime,
      percentageOrganicWaste,
      swatchComplianceTracker,
      frequency,
      size,
    } = req.body;
    if (
      !postOfficeId ||
      !responseTime ||
      !percentageOrganicWaste ||
      !swatchComplianceTracker ||
      !frequency ||
      !size
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const postOffice = await PostOffice.findById(postOfficeId);
    if (!postOffice) {
      return res.status(404).json({
        success: false,
        message: "Post Office not found",
      });
    }

    const existingScore = await CleanlinessScore.findOne({ postOfficeId });

    let cleanlinessScore;
    if (existingScore) {
      // Update existing score
      cleanlinessScore = await CleanlinessScore.findOneAndUpdate(
        { postOfficeId },
        {
          responseTime: new Date(responseTime),
          percentageOrganicWaste,
          quantity: {
            frequency,
            size,
          },
          swatchComplianceTracker,
        },
        { new: true }
      );

      await PostOffice.findByIdAndUpdate(postOfficeId, {
        cleanlinessScore: swatchComplianceTracker,
      });

      return res.status(200).json({
        success: true,
        message: "Cleanliness score updated successfully",
        data: cleanlinessScore,
      });
    } else {
      cleanlinessScore = await CleanlinessScore.create({
        postOfficeId,
        responseTime: new Date(responseTime),
        percentageOrganicWaste,
        quantity: {
          frequency,
          size,
        },
        swatchComplianceTracker,
      });

      //   await PostOffice.findByIdAndUpdate(postOfficeId, {
      //     cleanlinessScore: swatchComplianceTracker,
      //   });

      return res.status(201).json({
        success: true,
        message: "Cleanliness score created successfully",
        data: cleanlinessScore,
      });
    }
  } catch (error) {
    console.error("Error in cleanlinessScore:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
