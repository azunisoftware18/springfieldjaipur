import { Router } from "express";
import bookingRoute from "./booking.routes.js";
import slotRoute from "./slot.routes.js";
import authRoute from "./auth.routes.js";
import placeRoute from "./place.routes.js";
import ticketTypeRoute from "./ticketType.routes.js";
import addonRoute from "./addon.routes.js";
import ticketRoutes from "./ticket.routes.js";  
import scanLogRoutes from "./scanLog.routes.js";
import settingRoute from "./setting.routes.js";

const router = Router();

// 📦 all routes
router.use("/auth", authRoute);
router.use("/place", placeRoute);
router.use("/booking", bookingRoute);
router.use("/slot", slotRoute);
router.use("/ticket-type", ticketTypeRoute);
router.use("/addon", addonRoute);
router.use("/ticket", ticketRoutes);
router.use("/scan-log", scanLogRoutes);
router.use("/setting", settingRoute);


export default router;
