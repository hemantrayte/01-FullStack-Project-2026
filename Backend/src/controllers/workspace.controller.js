import { Workspace } from "../models/workspace.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createWorkspace = async(async(req , res) =>{
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Workspace name is required");
  }

  const workspace = await Workspace.create({
    name,
    description,
    owner: req.user._id,
    members: [
      {
        user: req.user._id,
        role: "owner",
      },
    ],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, workspace, "Workspace created successfully"))
})