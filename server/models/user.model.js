import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: { type: String, unique: true },
  image: String,
});

export const User =
  mongoose.models.User || mongoose.model("User", userSchema);
