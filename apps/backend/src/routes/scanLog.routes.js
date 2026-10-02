import { Router } from "express";
import asyncHandler from "../utils/AsyncHandler.js";
import ScanLogController from "../controllers/scanLog.controller.js";

const router = Router();

router.get(
  "/",
  asyncHandler(ScanLogController.getAll)
);

export default router;