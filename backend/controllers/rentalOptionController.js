import { RentalOption } from "../models/RentalOption.js";

// Add new rental option
export const addRentalOption = async (req, res) => {
  try {
    const { time, price } = req.body;

    if (!time || !price) {
      return res.status(400).json({
        message: "Time and price are required",
      });
    }

    const newRentalOption = new RentalOption({
      time,
      price
    });

    const savedRentalOption = await newRentalOption.save();

    return res.status(201).json({
      message: "Rental option added successfully!",
      rentalOption: savedRentalOption,
    });
  } catch (err) {
    console.error("Error adding rental option:", err);
    return res.status(500).json({
      message: err.message || "Error adding rental option",
    });
  }
};

// Get all rental options
export const getAllRentalOptions = async (req, res) => {
  try {
    const allRentalOptions = await RentalOption.find().sort('price');
    return res.status(200).json({
      message: "Rental options fetched successfully",
      total_options: allRentalOptions.length,
      allRentalOptions,
    });
  } catch (error) {
    console.error("Error getting rental options:", error);
    return res.status(500).json({
      message: error.message || "Error getting rental options",
    });
  }
};

// Get specific rental option by id
export const getSpecificRentalOption = async (req, res) => {
  try {
    const optionId = req.params.id;
    const rentalOption = await RentalOption.findById(optionId);
    
    if (!rentalOption) {
      return res.status(404).json({ message: "Rental option not found" });
    }

    return res.status(200).json({
      message: "Rental option fetched successfully",
      rentalOption,
    });
  } catch (error) {
    console.error("Error getting rental option:", error);
    return res.status(500).json({
      message: error.message || "Error getting the rental option",
    });
  }
};

// Delete rental option
export const deleteRentalOption = async (req, res) => {
  try {
    const optionId = req.params.id;
    const deletedOption = await RentalOption.findByIdAndDelete(optionId);

    if (!deletedOption) {
      return res.status(404).json({ message: "Rental option not found" });
    }

    return res.status(200).json({
      message: "Rental option deleted successfully",
      deletedOption,
    });
  } catch (error) {
    console.error("Error deleting rental option:", error);
    return res.status(500).json({
      message: error.message || "Failed to delete rental option",
    });
  }
};

// Update rental option
export const updateRentalOption = async (req, res) => {
  try {
    const optionId = req.params.id;
    const { time, price } = req.body;

    const updatedOption = await RentalOption.findByIdAndUpdate(
      optionId,
      { time, price },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOption) {
      return res.status(404).json({ message: "Rental option not found" });
    }

    return res.status(200).json({
      message: "Rental option updated successfully",
      updatedOption,
    });
  } catch (error) {
    console.error("Error updating rental option:", error);
    return res.status(500).json({
      message: error.message || "Failed to update rental option",
    });
  }
};