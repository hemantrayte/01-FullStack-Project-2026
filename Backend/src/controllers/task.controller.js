import { Task } from "../models/task.model.js";
import { Board } from "../models/board.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, boardId, columnId, priority, dueDate } = req.body;

  if (!title || !boardId || !columnId) {
    throw new ApiError(400, "Title, boardId and columnId are required");
  }

  // Check board exists
  const board = await Board.findById(boardId);
  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  const task = await Task.create({
    title,
    description,
    board: boardId,
    column: columnId,
    createdBy: req.user._id,
    priority,
    dueDate,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const getBoardTasks = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const tasks = await Task.find({ board: boardId })
    .populate("assignees", "name email avatar")
    .populate("createdBy", "name email");

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Board tasks fetched"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndUpdate(
    taskId,
    { $set: req.body },
    { new: true }
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const assignUserToTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.body;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (task.assignees.includes(userId)) {
    throw new ApiError(400, "User already assigned");
  }

  task.assignees.push(userId);
  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "User assigned to task"));
});


export {
  createTask,
  getBoardTasks,
  updateTask,
  assignUserToTask,
  deleteTask,
}