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

const getMyWorkspaces = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const workspaces = await Workspace.find({
    "members.user": userId,
    isArchived: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, workspaces, "Workspaces fetched"));
});

const getWorkspaceById = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const workspace = await Workspace.findById(workspaceId)
    .populate("members.user", "name email avatar");

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, workspace, "Workspace fetched"));
});

export {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById
}