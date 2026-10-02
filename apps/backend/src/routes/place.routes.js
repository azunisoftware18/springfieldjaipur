import { Router } from "express";
import PlaceController from "../controllers/place.controller.js";
import PlaceValidation from "../validations/place.validation.js";
import ValidateRequest from "../middlewares/validateRequest.middleware.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { settingUpload } from "../middlewares/multer.js";

const router = Router();

// ADMIN ONLY
router.post(
  "/",
  AuthMiddleware.isAuthenticated,
  settingUpload.single("image"),
  AuthMiddleware.authorize(["ADMIN"]),
  ValidateRequest.validate(PlaceValidation.create),
  asyncHandler(PlaceController.create)
);

router.put(
  "/:id",
  AuthMiddleware.isAuthenticated,
  settingUpload.single("image"),
  AuthMiddleware.authorize(["ADMIN"]),
  ValidateRequest.validate(PlaceValidation.update),
  asyncHandler(PlaceController.update)
);

router.delete(
  "/:id",
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["ADMIN"]),
  asyncHandler(PlaceController.delete)
);

// PUBLIC
router.get("/", asyncHandler(PlaceController.getAll));
router.get("/:id", asyncHandler(PlaceController.getById));

export default router;
