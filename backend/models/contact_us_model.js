import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema({
  sender: {
    type: String,
    enum: ["user", "agent"],
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  image: {
    type: String, // This field will store the URL of the image
    required: false, // Image is optional
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false, // Tracks if the message has been read
  },
});

const ContactUs = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const ContactUsSchema = mongoose.model("ContactUsSchema", ContactUs);
