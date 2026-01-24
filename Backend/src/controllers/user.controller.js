import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloundinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
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

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
    $or: [{ email }]
  });

  if (existedUser) {
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

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, "Email and Password is required");
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(404, "User does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")



  const accessCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  };

  const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  };


  res
    .status(200)
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully"
      )
    );
})

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized request");
  }

  // 1. Remove refresh token from DB
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  // 2. Cookie options (must match login)
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // 3. Clear cookies
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invaild refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "Access Token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invaild refresh token");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateProfile = asyncHandler(async(req, res) => {
  const {name, email} = req.body;

  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized request");
  }

  if(!name || !email) {
    throw new ApiError()
  }

  // 3. Check email uniqueness
  const emailExists = await User.findOne({
    email,
    _id: { $ne: req.user._id },
  });

  if (emailExists) {
    throw new ApiError(409, "Email already in use");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        name:name,
        email:email
      }
    },
    {new:true}
  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
})

const updateAvatar = asyncHandler(async(req, res) => {
  const userId = req.user?._id

  if(!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const avatarLocalPath = req.file?.path;

  if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        avatar:avatar.url
      }
    },
    {new: true}
  ).select("-password -refreshToken")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
})

const changePassword = asyncHandler(async(req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
})

const getAllUsers = asyncHandler(async (req, res) => {
  // 1. Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // 2. Search
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // 3. Fetch users
  const users = await User.find(keyword)
    .select("-password -refreshToken")
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  // 4. Total count
  const totalUsers = await User.countDocuments(keyword);

  return res.status(200).json(
    new ApiResponse(200, {
      users,
      totalUsers,
      page,
      pages: Math.ceil(totalUsers / limit),
    }, "Users fetched successfully")
  );
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // 2. Find user
  const user = await User.findById(id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 3. Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "User fetched successfully")
    );
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // 2. Find user
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 3. Authorization
  // User can delete own account OR admin can delete anyone
  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== id
  ) {
    throw new ApiError(403, "You are not allowed to delete this account");
  }

  // 4. Delete user
  await user.deleteOne();

  // 5. Clear cookies if self delete
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
      new ApiResponse(200, {}, "User deleted successfully")
    );
});

export {
  register,
  login, 
  logoutUser, 
  refreshAccessToken, 
  getCurrentUser, 
  getAllUsers, 
  getUserById, 
  deleteUser, 
  changePassword, 
  updateAvatar, 
  updateProfile
}