import { CleanlinessScore } from "../models/cleanlinessScore.model.js";
import { PostOffice } from "../models/postOffice.model.js";

export const cleanlinessScore = async (req, res) => {
  try {
    const {
      postOfficeId,
      percentageOrganicWaste,
      swatchComplianceTracker,
      frequency,
      size,
    } = req.body;

    // Validate required fields
    if (
      !postOfficeId ||
      percentageOrganicWaste == null ||
      swatchComplianceTracker == null ||
      frequency == null ||
      !size
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the post office exists
    const postOffice = await PostOffice.findById(postOfficeId);
    if (!postOffice) {
      return res.status(404).json({
        success: false,
        message: "Post Office not found",
      });
    }

    const currentDateTime = new Date();

    // Calculate the normalized frequency
    const Fmax = 200; // Assuming 200 as the max frequency for normalization
    const normalizedFrequency = (1 - Math.min(frequency, Fmax) / Fmax) * 100;

    // Assign a numeric value for size (e.g., small = 1, medium = 2, large = 3)
    const sizeFactors = { small: 1, medium: 2, large: 3 };
    const sizeFactor = sizeFactors[size] || 1; // Default to 1 if size is not recognized

    // Calculate cleanliness score based on the provided formula
    const cleanlinessScoreValue =
      0.3 * (100 - percentageOrganicWaste) +   // Organic waste percentage weight
      0.2 * normalizedFrequency +               // Frequency weight
      0.2 * (100 - sizeFactor * 10) +           // Size weight
      0.3 * swatchComplianceTracker;            // Swatch compliance weight

    // Check if a score already exists for this post office
    const existingScore = await CleanlinessScore.findOne({ postOfficeId });

    let cleanlinessScore;
    if (existingScore) {
      // Update the existing score document
      cleanlinessScore = await CleanlinessScore.findOneAndUpdate(
        { postOfficeId },
        {
          responseTime: currentDateTime,
          percentageOrganicWaste,
          quantity: {
            frequency,
            size,
          },
          swatchComplianceTracker,
        },
        { new: true }
      );
    } else {
      // Create a new score document
      cleanlinessScore = await CleanlinessScore.create({
        postOfficeId,
        responseTime: currentDateTime,
        percentageOrganicWaste,
        quantity: {
          frequency,
          size,
        },
        swatchComplianceTracker,
      });
    }

    // Update the PostOffice with the cleanliness score value
    await PostOffice.findByIdAndUpdate(postOfficeId, {
      cleanlinessScore: cleanlinessScoreValue,
    });

    return res.status(existingScore ? 200 : 201).json({
      success: true,
      message: existingScore
        ? "Cleanliness score updated successfully"
        : "Cleanliness score created successfully",
      data: cleanlinessScore,
      calculatedScore: cleanlinessScoreValue,
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
