import { ContactUsSchema } from "../models/contact_us_model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const submitContactForm = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decodedToken.user.id;
    const { username, email, message } = req.body;

    if (!username || !email || !message || message.trim() === "") {
      return res.status(400).json({
        message: "Username, email, and non-empty message are required",
      });
    }

    // Check if user has submitted a message in the last 24 hours
    const lastDaySubmission = await ContactUsSchema.findOne({
      userId: userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (lastDaySubmission) {
      return res.status(429).json({
        message:
          "You can only submit one message per day. Please try again later.",
      });
    }

    const newContact = new ContactUsSchema({
      userId,
      username,
      email,
      message,
    });

    const createdContact = await newContact.save();

    if (createdContact) {
      return res.status(201).json({
        message: "Contact form submitted successfully",
        contact: createdContact,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const allContacts = await ContactUsSchema.find();
    return res.status(200).json({
      allContacts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Contact ID" });
    }

    const contact = await ContactUsSchema.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Contact ID" });
    }

    const updatedContact = await ContactUsSchema.findByIdAndUpdate(
      id,
      { username, email, message },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({
      message: "Contact updated successfully",
      contact: updatedContact,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Contact ID" });
    }

    const deletedContact = await ContactUsSchema.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};