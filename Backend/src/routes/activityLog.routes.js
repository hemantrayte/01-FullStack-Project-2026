import { Router } from "express";
import {
  getAllActivityLogs,
  getWorkspaceLogs,
  getBoardLogs,
  getTaskLogs,
  getUserLogs,
  deleteActivityLog,
  clearEntityLogs,
} from "../controllers/activityLog.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/* ================= ACTIVITY LOG ROUTES ================= */

// 🔐 Admin / Debug – Get all logs
router.get(
  "/",
  verifyJWT,
  getAllActivityLogs
);

// 📁 Workspace logs
router.get(
  "/workspace/:workspaceId",
  verifyJWT,
  getWorkspaceLogs
);

// 📋 Board logs
router.get(
  "/board/:boardId",
  verifyJWT,
  getBoardLogs
);

// ✅ Task logs
router.get(
  "/task/:taskId",
  verifyJWT,
  getTaskLogs
);

// 👤 User activity logs
router.get(
  "/user/:userId",
  verifyJWT,
  getUserLogs
);

// ❌ Delete single activity log (Admin)
router.delete(
  "/:logId",
  verifyJWT,
  deleteActivityLog
);

// 🧹 Clear logs by entity (Admin / Owner)
router.delete(
  "/clear/:entityType/:entityId",
  verifyJWT,
  clearEntityLogs
);

export default router;
