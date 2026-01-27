import { Router } from "express";
import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  archiveWorkspace,
  addWorkspaceMember,
  removeWorkspaceMember,
  leaveWorkspace,
} from "../controllers/workspace.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/* ================= WORKSPACE CRUD ================= */

// Create workspace
router.post(
  "/",
  verifyJWT,
  createWorkspace
);

// Get all workspaces of logged-in user
router.get(
  "/",
  verifyJWT,
  getMyWorkspaces
);

// Get workspace by ID
router.get(
  "/:workspaceId",
  verifyJWT,
  getWorkspaceById
);

// Update workspace
router.put(
  "/:workspaceId",
  verifyJWT,
  updateWorkspace
);

// Archive (soft delete) workspace
router.delete(
  "/:workspaceId",
  verifyJWT,
  archiveWorkspace
);

/* ================= WORKSPACE MEMBERS ================= */

// Add member to workspace
router.post(
  "/:workspaceId/members",
  verifyJWT,
  addWorkspaceMember
);

// Remove member from workspace
router.delete(
  "/:workspaceId/members/:userId",
  verifyJWT,
  removeWorkspaceMember
);

// Leave workspace
router.post(
  "/:workspaceId/leave",
  verifyJWT,
  leaveWorkspace
);

export default router;
