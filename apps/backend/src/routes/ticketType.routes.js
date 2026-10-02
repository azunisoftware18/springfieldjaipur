import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/AsyncHandler.js";
import TicketTypeController from "../controllers/ticketType.controller.js";

const router = Router();
router.post(
  "/",
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["ADMIN"]),
  asyncHandler(TicketTypeController.handle)
);

router.post(
  "/public",
  asyncHandler(TicketTypeController.handle)
);

export default router;
