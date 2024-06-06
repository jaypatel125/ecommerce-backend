import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import { createToken } from "../utils/createToken.js";
import jwt from "jsonwebtoken";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const isAdminValue = isAdmin === true;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send("User already exists");
  }
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    isAdmin: isAdminValue,
  });

  try {
    await newUser.save();
    createToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid credentials");
    }
    createToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
});

const logoutcurrentuser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).send("User logged out");
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(403); // Change status code to 403 for Forbidden
      throw new Error("You cannot delete an admin user");
    }
    try {
      await User.deleteOne({ _id: user._id });
      res.json({
        message: "User removed",
      });
    } catch (error) {
      res.status(500); // Internal Server Error
      throw new Error("Error while deleting user");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.isAdmin !== undefined) {
      user.isAdmin = Boolean(req.body.isAdmin);
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  createUser,
  loginUser,
  logoutcurrentuser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
