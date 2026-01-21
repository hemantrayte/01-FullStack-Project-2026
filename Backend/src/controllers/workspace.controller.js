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

const updateWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { name, description } = req.body;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (workspace.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only owner can update workspace");
  }

  workspace.name = name || workspace.name;
  workspace.description = description || workspace.description;

  await workspace.save();

  return res
    .status(200)
    .json(new ApiResponse(200, workspace, "Workspace updated successfully"));
});

const archiveWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (workspace.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only owner can archive workspace");
  }

  workspace.isArchived = true;
  await workspace.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Workspace archived successfully"));
});

const addWorkspaceMember = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { userId, role = "member" } = req.body;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (workspace.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only owner can add members");
  }

  const exists = workspace.members.some(
    (m) => m.user.toString() === userId
  );

  if (exists) {
    throw new ApiError(400, "User already a member");
  }

  workspace.members.push({ user: userId, role });
  await workspace.save();

  return res
    .status(200)
    .json(new ApiResponse(200, workspace, "Member added"));
});

const removeWorkspaceMember = asyncHandler(async (req, res) => {
  const { workspaceId, userId } = req.params;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (workspace.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only owner can remove members");
  }

  if (workspace.owner.toString() === userId) {
    throw new ApiError(400, "Owner cannot be removed");
  }

  workspace.members = workspace.members.filter(
    (m) => m.user.toString() !== userId
  );

  await workspace.save();

  return res
    .status(200)
    .json(new ApiResponse(200, workspace, "Member removed"));
});

const leaveWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (workspace.owner.toString() === req.user._id.toString()) {
    throw new ApiError(
      403,
      "Owner cannot leave workspace. Transfer ownership or archive it."
    );
  }

  workspace.members = workspace.members.filter(
    (m) => m.user.toString() !== req.user._id.toString()
  );

  await workspace.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "You left the workspace"));
});

export {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  archiveWorkspace,
  addWorkspaceMember,
  removeWorkspaceMember,
  leaveWorkspace
}