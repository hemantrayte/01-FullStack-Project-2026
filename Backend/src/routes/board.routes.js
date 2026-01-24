import { Router } from "express";
import {
  createBoard,
  getBoardsByWorkspace,
  getBoardById,
  updateBoard,
  deleteBoard,
  addBoardMember,
  removeBoardMember,
  leaveBoard,
} from "../controllers/board.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/* ================= BOARD CRUD ================= */

// Create board inside workspace
router.post(
  "/workspace/:workspaceId",
  verifyJWT,
  createBoard
);

// Get all boards of a workspace
router.get(
  "/workspace/:workspaceId",
  verifyJWT,
  getBoardsByWorkspace
);

// Get single board
router.get(
  "/:boardId",
  verifyJWT,
  getBoardById
);

// Update board
router.put(
  "/:boardId",
  verifyJWT,
  updateBoard
);

// Delete board
router.delete(
  "/:boardId",
  verifyJWT,
  deleteBoard
);

/* ================= BOARD MEMBERS ================= */

// Add member to board
router.post(
  "/:boardId/members",
  verifyJWT,
  addBoardMember
);

// Remove member from board
router.delete(
  "/:boardId/members/:userId",
  verifyJWT,
  removeBoardMember
);

// Leave board
router.post(
  "/:boardId/leave",
  verifyJWT,
  leaveBoard
);

export default router;
