import User from "../models/userModel.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// image updation path finding
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const adminSignin = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await User.findOne({ username, email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credential" });
    }

    generateTokenAndSetCookie(user._id, res);
    res.json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in signin Controller", error.message);
    res.status(400).json({ error: "Internal Server Error" });
  }
};

export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const imagePath = req.file ? req.file.filename : null;
  try {
    const { fullname, email, username, password, gender } = req.body;

    // Create an update object and conditionally add the hashed password
    const updateData = { fullname, username, email, gender };
    if (imagePath) {
      updateData.profilePic = imagePath;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const user = await User.findById(id);

    // Delete the old profile picture if a new one is uploaded
    if (imagePath && user.profilePic) {
      const oldImagePath = path.join(__dirname, '..', 'adminuploads', user.profilePic);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update the user in the database
    const updateUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.status(201).json(updateUser);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout Controller", error.message);
    res.status(400).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    let user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserById Controller", error.message);
    res.status(400).json({ error: "Internal Server Error" });
  }
};
