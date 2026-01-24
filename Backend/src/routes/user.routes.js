import { Router } from "express";
import {
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
  updateProfile,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

/* ================= AUTH ROUTES ================= */
router.post(
  "/register",
  upload.single("avatar"), // image required
  register
);

router.post("/login", login);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);

/* ================= USER PROFILE ================= */
router.get("/me", verifyJWT, getCurrentUser);
router.put("/update-profile", verifyJWT, updateProfile);
router.put(
  "/update-avatar",
  verifyJWT,
  upload.single("avatar"),
  updateAvatar
);

router.put("/change-password", verifyJWT, changePassword);

/* ================= ADMIN / USER LIST ================= */
router.get("/", verifyJWT, getAllUsers);
router.get("/:id", verifyJWT, getUserById);
router.delete("/:id", verifyJWT, deleteUser);

export default router;
