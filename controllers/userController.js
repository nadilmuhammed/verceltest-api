
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import admin from "firebase-admin";
import fs from 'fs';
import path from 'path';


const serviceAccountPath = path.resolve('path/to/serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://verification-ca0a5.firebaseio.com'
});

export const googleAuthenticationSignUp = async (req, res) => {
  try {
    const { idToken, email, displayName } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken) {
      return res.status(401).json({ error: "Invalid token" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: "Email already exists" });
    }
    if (!user) {
      // Create a new user
      user = new User({
        fullname: displayName,
        username: email.split("@")[0], // Use email prefix as username
        email,
        password: "", // Password not needed for Google sign-in
        gender: "male", // Handle gender as needed
      });
      await user.save();
    }
    generateTokenAndSetCookie(user._id, res);
    res.json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.log("Error in Google signup controller", error.message);
    res.status(400).json({ error: "Internal Server Error" });
  }
};

export const googleAuthenticationLogin = async(req,res)=>{
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const email = decodedToken.email;
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found! Please Sign in' });
    }

    generateTokenAndSetCookie(user._id, res);
    res.json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
    });

  } catch (error) {
    console.log("Error in Google login controller", error.message);
    res.status(400).json({ error: "Internal Server Error" });
  }
}

export const signup = async (req, res) => {
  try {
    const { fullname, username, email, password, confirmpassword, gender } =
      req.body;
    if (password !== confirmpassword) {
      return res
        .status(400)
        .json({ error: "password and confirm password does not match" });
    }

    const user = await User.findOne({ username, email });
    if (user) {
      return res
        .status(400)
        .json({ error: "username or email already exists" });
    }

    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      gender,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ error: "invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(400).json({ error: "Internal Server Error" });
  }
};

export const signin = async (req, res) => {
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
    });
  } catch (error) {
    console.log("Error in signin Controller", error.message);
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

export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { fullname, email, username, password } = req.body;

    // Create an update object and conditionally add the hashed password
    const updateData = { fullname, username, email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
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

export const deleteUser = async (req, res) => {
  const { id } = req.params;
 try{
  const deleteUser = await User.findByIdAndDelete(id);
  res.status(200).json(deleteUser);
  } catch (error) {
    console.log(`Error in deleteUser controller: ${error.message}`);
    res.status(400).json({ error: "Internal Server Error" });
  }
};

export const getUsersByID = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const result = await User.find();
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
  }
};
