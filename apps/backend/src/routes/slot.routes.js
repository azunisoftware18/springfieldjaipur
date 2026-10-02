import { Router } from "express";
import {
  SlotController,
  SlotOverrideController,
  SlotTemplateController,
} from "../controllers/slot.controller.js";
import SlotValidation from "../validations/slot.validation.js";
import ValidateRequest from "../middlewares/validateRequest.middleware.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/AsyncHandler.js";

const router = Router();

// CREATE
router.post(
  "/template",
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["ADMIN"]),
  ValidateRequest.validate(SlotValidation.createSlot),
  asyncHandler(SlotTemplateController.create)
);

// LIST
router.get("/template/:placeId", asyncHandler(SlotTemplateController.list));

// UPDATE
router.put(
  "/template/:id",
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["ADMIN"]),
  ValidateRequest.validate(SlotValidation.updateSlot),
  asyncHandler(SlotTemplateController.update)
);

// DELETE
router.delete(
  "/template/:id",
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["ADMIN"]),
  asyncHandler(SlotTemplateController.delete)
);

router.post(
  "/override",
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["ADMIN"]),
  asyncHandler(SlotOverrideController.upsert)
);

router.get("/slots/:placeId/:date", asyncHandler(SlotController.getByDate));

router.get(
  "/override/:placeId/:date",
  asyncHandler(SlotOverrideController.getAll)
);

export default router;
