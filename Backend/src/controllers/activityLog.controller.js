import { ActivityLog } from "../models/activityLog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const createActivityLog = asyncHandler(async ({
  user,
  action,
  entityType,
  entityId,
  message,
  metadata = {},
}) => {
  await ActivityLog.create({
    user,
    action,
    entityType,
    entityId,
    message,
    metadata,
  });
})

const getAllActivityLogs = asyncHandler(async(req , res) => {
  const logs = await ActivityLog.find()
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, logs, "All activity logs fetched"));
})

const getWorkspaceLogs = asyncHandler(async(req , res) => {
  
})

const getBoardLogs = asyncHandler(async(req , res) => {
  
})

const getTaskLogs = asyncHandler(async(req , res) => {
  
})

const getUserLogs = asyncHandler(async(req , res) => {
  
})

const deleteActivityLog = asyncHandler(async(req , res) => {
  
})

const clearEntityLogs = asyncHandler(async(req , res) => {
  
})

export {
  createActivityLog,
  getAllActivityLogs,
  getWorkspaceLogs,
  getBoardLogs,
  getUserLogs,
  getTaskLogs,
  clearEntityLogs,
  deleteActivityLog
}