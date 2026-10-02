import { Router } from "express";
import TicketController from "../controllers/ticket.controller.js";
import asyncHandler from "../utils/AsyncHandler.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import TicketValidation from "../validations/ticket.validation.js";
import ValidateRequest from "../middlewares/validateRequest.middleware.js";

const router = Router();

router.post(
  "/scan",
  ValidateRequest.validate(TicketValidation.scanTicket),
  asyncHandler(TicketController.scanTicket)
);

router.get(
  "/",
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["ADMIN"]),
  asyncHandler(TicketController.getAll)
);

router.get(
  "/download/:bookingId",
  asyncHandler(TicketController.download)
);

export default router;