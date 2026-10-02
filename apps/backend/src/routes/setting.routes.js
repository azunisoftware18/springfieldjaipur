import { Router } from "express";
import {
  getSetting,
  updateSetting,
} from "../controllers/setting.controller.js";

import AuthMiddleware from "../middlewares/auth.middleware.js";
import { settingUpload } from "../middlewares/multer.js";

const router = Router();

// Public
router.get("/", getSetting);

// Admin Only
router.put(
  "/",
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["ADMIN"]),
  settingUpload.single("logo"),
  updateSetting
);

export default router;