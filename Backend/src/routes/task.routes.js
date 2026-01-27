import { Router } from "express";
import {
  createTask,
  getTasksByBoard,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  changeTaskStatus,
  addTaskComment,
} from "../controllers/task.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/* ================= TASK CRUD ================= */

// Create task inside board
router.post(
  "/board/:boardId",
  verifyJWT,
  createTask
);

// Get all tasks of a board
router.get(
  "/board/:boardId",
  verifyJWT,
  getTasksByBoard
);

// Get single task
router.get(
  "/:taskId",
  verifyJWT,
  getTaskById
);

// Update task (title, description, priority, etc.)
router.put(
  "/:taskId",
  verifyJWT,
  updateTask
);

// Delete task
router.delete(
  "/:taskId",
  verifyJWT,
  deleteTask
);

/* ================= TASK ACTIONS ================= */

// Assign task to user
router.put(
  "/:taskId/assign",
  verifyJWT,
  assignTask
);

// Change task status (todo → in-progress → done)
router.put(
  "/:taskId/status",
  verifyJWT,
  changeTaskStatus
);

// Add comment to task
router.post(
  "/:taskId/comments",
  verifyJWT,
  addTaskComment
);

export default router;
