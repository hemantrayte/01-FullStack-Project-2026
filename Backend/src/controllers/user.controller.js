import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloundinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefresTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const register = asyncHandler(async(req, res) => {
  const { name, email, password} = req.body

  if(!name || !email || !password) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
    $or: [{email}]
  });

  if (existedUser){
    throw new ApiError(409, "User with email or username alredy exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: avatar.url
  })

  const createUser = await User.findById(user._id).select("-password -refreshToken")

  if (!createUser) {
    throw new ApiError(500, "Somthing went wrong while register the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "User Register Successfully"));
})

const login = asyncHandler(async(req, res) => {
  
})

const logOut = asyncHandler(async(req, res) => {
  
})

const refreshToken = asyncHandler(async(req, res) => {
  
})

const getCurrentUser = asyncHandler(async(req, res) => {
  
})

const updateProfile = asyncHandler(async(req, res) => {
  
})

const updateAvatar = asyncHandler(async(req, res) => {
  
})

const changePassword = asyncHandler(async(req, res) => {
  
})

const getAllUsers = asyncHandler(async(req, res) => {
  
})

const getUserById = asyncHandler(async(req, res) => {
  
})

const deleteUser = asyncHandler(async(req, res) => {
  
})

export {
  register,
  login, 
  logOut, 
  refreshToken, 
  getCurrentUser, 
  getAllUsers, 
  getUserById, 
  deleteUser, 
  changePassword, 
  updateAvatar, 
  updateProfile
}