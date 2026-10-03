// import prisma from "../db/db.js";
// import crypto from "node:crypto";
// import QRCode from "qrcode";
// import { ApiError } from "../utils/ApiError.js";
// import { envConfig } from "../config/env.config.js";
// import TicketService from "./ticket.service.js";

// import fs from "fs";
// import os from "os";
// import path from "path";

// import { upload } from "../utils/s3Service.js";
// import WhatsappService from "./whatsapp.service.js";
// import EmailService from "./Email.service.js";

// class BookingService {
//   // ============================================================
//   // CREATE BOOKING
//   // ============================================================
//   static async createBooking(payload, user) {
//     const {
//       placeId,
//       slotDateTime,
//       tickets,
//       addons,
//       name,
//       email,
//       phone,
//       bookingType = "TICKET",
//       paymentMethod = "UPI",
//     } = payload;

//     // ------------------------------------------------------------
//     // BASIC VALIDATION
//     // ------------------------------------------------------------

//     if (!placeId) {
//       throw ApiError.badRequest("Place ID is required");
//     }

//     if (!slotDateTime) {
//       throw ApiError.badRequest("Slot date and time are required");
//     }

//     if (!Array.isArray(tickets) || tickets.length === 0) {
//       throw ApiError.badRequest("At least one ticket is required");
//     }

//     if (!name || !email || !phone) {
//       throw ApiError.badRequest("Name, email and phone are required");
//     }

//     if (!["CASH", "UPI"].includes(paymentMethod)) {
//       throw ApiError.badRequest("Invalid payment method");
//     }

//     if (paymentMethod === "CASH" && !user?.id) {
//       throw ApiError.unauthorized("Please login to use Cash payment");
//     }

//     const txnId = paymentMethod === "UPI" ? "TXN_" + Date.now() : null;

//     const expiresAt =
//       paymentMethod === "UPI" ? new Date(Date.now() + 15 * 60 * 1000) : null;

//     const booking = await prisma.$transaction(
//       async (tx) => {
//         // --------------------------------------------------------
//         // TICKET TYPES
//         // --------------------------------------------------------

//         const typeIds = tickets.map((ticket) => ticket.typeId);

//         const ticketTypes = await tx.ticketType.findMany({
//           where: {
//             id: {
//               in: typeIds,
//             },
//           },
//         });

//         if (!ticketTypes.length) {
//           throw ApiError.badRequest("Invalid ticket types");
//         }

//         // Make sure every requested ticket type exists
//         if (ticketTypes.length !== typeIds.length) {
//           throw ApiError.badRequest("One or more ticket types are invalid");
//         }

//         // --------------------------------------------------------
//         // CALCULATE TICKET TOTAL
//         // --------------------------------------------------------

//         let totalAmount = 0;
//         let totalSeats = 0;

//         tickets.forEach((ticket) => {
//           const type = ticketTypes.find((item) => item.id === ticket.typeId);

//           if (!type) {
//             throw ApiError.badRequest("Invalid ticket type");
//           }

//           const quantity = Number(ticket.quantity);

//           if (!Number.isInteger(quantity) || quantity <= 0) {
//             throw ApiError.badRequest("Invalid ticket quantity");
//           }

//           if (quantity > type.maxPerBooking) {
//             throw ApiError.badRequest(
//               `${type.name} allows maximum ${type.maxPerBooking} tickets per booking`
//             );
//           }

//           totalAmount += type.price * quantity;
//           totalSeats += quantity;
//         });

//         // --------------------------------------------------------
//         // ADDONS
//         // --------------------------------------------------------

//         const rawAddons = Array.isArray(addons) ? addons : [];

//         // Support both:
//         // Old: ["addonId1", "addonId2"]
//         // New: [{ addonId: "addonId1", quantity: 2 }]
//         const normalizedAddons = rawAddons
//           .map((item) => {
//             // Old format
//             if (typeof item === "string") {
//               return {
//                 addonId: item,
//                 quantity: 1,
//               };
//             }

//             // New format
//             if (item && typeof item === "object") {
//               return {
//                 addonId: item.addonId || item.id,
//                 quantity: Number(item.quantity || 1),
//               };
//             }

//             return null;
//           })
//           .filter(
//             (item) =>
//               item?.addonId &&
//               Number.isInteger(item.quantity) &&
//               item.quantity > 0
//           );

//         // Get unique addon IDs
//         const requestedAddonIds = normalizedAddons.map((item) => item.addonId);

//         const uniqueAddonIds = [...new Set(requestedAddonIds)];

//         // Fetch addons from DB
//         const addonList = await tx.addon.findMany({
//           where: {
//             id: {
//               in: uniqueAddonIds,
//             },
//             placeId,
//             isActive: true,
//           },
//         });

//         // Validate addons
//         if (uniqueAddonIds.length !== addonList.length) {
//           throw ApiError.badRequest(
//             "One or more addons are invalid or inactive"
//           );
//         }

//         // Calculate addon amount
//         let addonAmount = 0;

//         // Final addon payload with quantity
//         const addonPayload = normalizedAddons.map((item) => {
//           const addon = addonList.find((record) => record.id === item.addonId);

//           if (!addon) {
//             throw ApiError.badRequest(`Invalid addon: ${item.addonId}`);
//           }

//           addonAmount += Number(addon.price) * item.quantity;

//           return {
//             addonId: addon.id,
//             quantity: item.quantity,
//           };
//         });

//         // Final booking amount
//         const finalAmount = totalAmount + addonAmount;

//         // --------------------------------------------------------
//         // SLOT CAPACITY
//         // --------------------------------------------------------

//         const slotDate = new Date(slotDateTime);

//         if (Number.isNaN(slotDate.getTime())) {
//           throw ApiError.badRequest("Invalid slot date/time");
//         }

//         const capacity = await this.getSlotCapacity(tx, placeId, slotDateTime);

//         // --------------------------------------------------------
//         // EXISTING BOOKINGS
//         // --------------------------------------------------------

//         const activeBookings = await tx.booking.findMany({
//           where: {
//             placeId,
//             slotDateTime: slotDate,
//             OR: [
//               {
//                 status: "PAID",
//               },
//               {
//                 status: "PENDING",
//                 expiresAt: {
//                   gt: new Date(),
//                 },
//               },
//             ],
//           },
//         });

//         const usedSeats = activeBookings.reduce(
//           (sum, booking) => sum + booking.totalSeats,
//           0
//         );

//         const availableSeats = capacity - usedSeats;

//         if (totalSeats > availableSeats) {
//           throw ApiError.badRequest(
//             `Not enough seats available. Only ${Math.max(
//               availableSeats,
//               0
//             )} seats remaining`
//           );
//         }

//         // --------------------------------------------------------
//         // CREATE BOOKING
//         // --------------------------------------------------------

//         const createdBooking = await tx.booking.create({
//           data: {
//             userId: user?.id || null,
//             placeId,
//             slotDateTime: slotDate,
//             bookingType,
//             name,
//             email,
//             phone,
//             paymentMethod,
//             totalAmount: finalAmount,
//             totalSeats,
//             status: paymentMethod === "CASH" ? "PAID" : "PENDING",
//             expiresAt,
//             txnId,
//             ticketPayload: tickets,
//             addonIds: addonPayload, // ✅ FIX: addonIds ki jagah addonPayload
//           },
//         });

//         return createdBooking;
//       },
//       {
//         isolationLevel: "Serializable",
//       }
//     );

//     // ============================================================
//     // CASH BOOKING
//     // ============================================================

//     if (paymentMethod === "CASH") {
//       const completedBooking = await this.completeBooking(booking.id, null);

//       return {
//         booking: completedBooking,
//         payment: null,
//         isCashBooking: true,
//       };
//     }

//     // ============================================================
//     // UPI / EASEBUZZ
//     // ============================================================

//     const key = envConfig.EASEBUZZ_KEY;
//     const salt = envConfig.EASEBUZZ_SALT;

//     const hashString = `${key}|${txnId}|${booking.totalAmount}|Ticket Booking|${name}|${email}|||||||||||${salt}`;

//     const hash = crypto.createHash("sha512").update(hashString).digest("hex");

//     return {
//       booking,
//       isCashBooking: false,
//       payment: {
//         txnid: txnId,
//         amount: booking.totalAmount,
//         firstname: name,
//         email,
//         phone,
//         productinfo: "Ticket Booking",
//         surl: `${envConfig.BASE_URL}/api/booking/success`,
//         furl: `${envConfig.BASE_URL}/api/booking/failure`,
//         key,
//         hash,
//         url: "https://testpay.easebuzz.in/pay/secure",
//       },
//     };
//   }

//   // ============================================================
//   // COMPLETE BOOKING
//   // ============================================================
//   static async completeBooking(bookingId, paymentId = null) {
//     const booking = await prisma.booking.findUnique({
//       where: {
//         id: bookingId,
//       },
//       include: {
//         place: true,
//         tickets: true,
//       },
//     });

//     if (!booking) {
//       throw ApiError.notFound("Booking not found");
//     }

//     // ----------------------------------------------------------
//     // ALREADY COMPLETED
//     // ----------------------------------------------------------

//     if (booking.status === "PAID" && booking.ticketPdfUrl) {
//       return booking;
//     }

//     // ----------------------------------------------------------
//     // UPDATE PAYMENT STATUS
//     // ----------------------------------------------------------

//     let updatedBooking = booking;

//     if (booking.status !== "PAID") {
//       updatedBooking = await prisma.booking.update({
//         where: {
//           id: booking.id,
//         },
//         data: {
//           status: "PAID",
//           paymentId: paymentId || booking.paymentId,
//         },
//         include: {
//           place: true,
//           tickets: true,
//         },
//       });
//     } else if (paymentId && !booking.paymentId) {
//       updatedBooking = await prisma.booking.update({
//         where: {
//           id: booking.id,
//         },
//         data: {
//           paymentId,
//         },
//         include: {
//           place: true,
//           tickets: true,
//         },
//       });
//     }

//     // ----------------------------------------------------------
//     // CREATE TICKETS
//     // ----------------------------------------------------------

//     const existingTickets = await prisma.ticket.count({
//       where: {
//         bookingId: booking.id,
//       },
//     });

//     const ticketPayload = Array.isArray(booking.ticketPayload)
//       ? booking.ticketPayload
//       : [];

//     if (existingTickets === 0 && ticketPayload.length > 0) {
//       for (const item of ticketPayload) {
//         const quantity = Number(item.quantity);

//         for (let i = 0; i < quantity; i++) {
//           await prisma.ticket.create({
//             data: {
//               bookingId: booking.id,
//               userId: booking.userId,
//               placeId: booking.placeId,
//               slotDateTime: booking.slotDateTime,
//               typeId: item.typeId,
//               qrCode: crypto.randomUUID(),
//               status: "PENDING",
//             },
//           });
//         }
//       }
//     }

//     // ----------------------------------------------------------
//     // GENERATE PDF
//     // ----------------------------------------------------------

//     const pdfBuffer = await TicketService.generatePDF(booking.id);

//     const tempFile = path.join(os.tmpdir(), `ticket-${booking.id}.pdf`);

//     fs.writeFileSync(tempFile, pdfBuffer);

//     let uploadedFile;

//     try {
//       uploadedFile = await upload(tempFile);
//     } finally {
//       // Delete local temporary PDF
//       try {
//         if (fs.existsSync(tempFile)) {
//           fs.unlinkSync(tempFile);
//         }
//       } catch (error) {
//         console.error("Temporary PDF cleanup failed:", error);
//       }
//     }

//     // ----------------------------------------------------------
//     // SAVE PDF URL
//     // ----------------------------------------------------------

//     updatedBooking = await prisma.booking.update({
//       where: {
//         id: booking.id,
//       },
//       data: {
//         status: "PAID",
//         paymentId: paymentId || booking.paymentId,
//         ticketPdfUrl: uploadedFile.url,
//         ticketPdfKey: uploadedFile.key,
//       },
//       include: {
//         place: true,
//         tickets: true,
//       },
//     });

//     // ----------------------------------------------------------
//     // EMAIL + WHATSAPP
//     // ----------------------------------------------------------

//     const message = `🎟️ *Dear ${booking.name},*

// Thank you for booking with *${booking.place.name}*! 🥳

// Here are your entry ticket details:

// 📅 Date: ${new Date(booking.slotDateTime).toLocaleDateString("en-IN")}

// 🎫 Total Tickets: ${booking.totalSeats}

// 💰 Total Price: Rs ${booking.totalAmount}

// 💳 Payment Method: ${booking.paymentMethod}

// 🛑 Important: Please keep your QR code safe and do NOT share it with anyone!

// 📲 Show it only at the entry gate to authorized staff.

// We can't wait to welcome you! 🎉`;

//     try {
//       await EmailService.sendTicket({
//         to: booking.email,
//         name: booking.name,
//         booking: updatedBooking,
//         pdfBuffer,
//       });
//     } catch (error) {
//       console.error("Email sending failed:", error);
//     }

//     try {
//       await WhatsappService.sendTicket(
//         booking.phone,
//         message,
//         uploadedFile.url
//       );
//     } catch (error) {
//       console.error("WhatsApp sending failed:", error);
//     }

//     return updatedBooking;
//   }

//   // ============================================================
//   // EASEBUZZ SUCCESS
//   // ============================================================
//   static async paymentSuccess(data) {
//     const booking = await prisma.booking.findUnique({
//       where: {
//         txnId: data.txnid,
//       },
//     });

//     if (!booking) {
//       throw ApiError.notFound("Booking not found");
//     }

//     // ----------------------------------------------------------
//     // VERIFY EASEBUZZ HASH
//     // ----------------------------------------------------------

//     if (!this.verifyHash(data)) {
//       throw ApiError.badRequest("Invalid payment");
//     }

//     // ----------------------------------------------------------
//     // VERIFY STATUS
//     // ----------------------------------------------------------

//     if (!data.status || data.status.toLowerCase() !== "success") {
//       throw ApiError.badRequest("Payment failed");
//     }

//     // ----------------------------------------------------------
//     // COMPLETE BOOKING
//     // ----------------------------------------------------------

//     return await this.completeBooking(booking.id, data.easepayid || null);
//   }

//   // ============================================================
//   // PAYMENT FAILURE
//   // ============================================================
//   static async paymentFailure(data) {
//     const booking = await prisma.booking.findUnique({
//       where: {
//         txnId: data.txnid,
//       },
//     });

//     if (!booking) {
//       throw ApiError.notFound("Booking not found");
//     }

//     if (booking.status !== "PENDING") {
//       return booking;
//     }

//     await prisma.booking.update({
//       where: {
//         txnId: data.txnid,
//       },
//       data: {
//         status: "FAILED",
//       },
//     });

//     return true;
//   }

//   // ============================================================
//   // EXPIRE BOOKINGS
//   // ============================================================
//   static async expireBookings() {
//     await prisma.booking.updateMany({
//       where: {
//         status: "PENDING",
//         expiresAt: {
//           lt: new Date(),
//         },
//       },
//       data: {
//         status: "EXPIRED",
//       },
//     });
//   }

//   // ============================================================
//   // SLOT CAPACITY
//   // ============================================================
//   static async getSlotCapacity(tx, placeId, slotDateTime) {
//     const dateObj = new Date(slotDateTime);

//     const startOfDay = new Date(dateObj);
//     startOfDay.setHours(0, 0, 0, 0);

//     const time = new Date(slotDateTime).toISOString().slice(11, 16);

//     // ----------------------------------------------------------
//     // SLOT OVERRIDE
//     // ----------------------------------------------------------

//     const override = await tx.slotOverride.findFirst({
//       where: {
//         placeId,
//         date: startOfDay,
//         startTime: time,
//       },
//     });

//     if (override) {
//       if (override.isClosed) {
//         throw ApiError.badRequest("Slot is closed");
//       }

//       if (override.capacity !== null) {
//         return override.capacity;
//       }
//     }

//     // ----------------------------------------------------------
//     // SLOT TEMPLATE
//     // ----------------------------------------------------------

//     const template = await tx.slotTemplate.findFirst({
//       where: {
//         placeId,
//         startTime: {
//           lte: time,
//         },
//         endTime: {
//           gt: time,
//         },
//       },
//     });

//     if (!template) {
//       throw ApiError.notFound("Slot not found");
//     }

//     return template.capacity;
//   }

//   // ============================================================
//   // VERIFY EASEBUZZ HASH
//   // ============================================================
//   static verifyHash(data) {
//     const salt = envConfig.EASEBUZZ_SALT;
//     const key = envConfig.EASEBUZZ_KEY;

//     const str = `${salt}|${data.status}|||||||||||${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${key}`;

//     const hash = crypto.createHash("sha512").update(str).digest("hex");

//     return hash === data.hash;
//   }

//   // ============================================================
//   // GENERATE TICKET QR
//   // ============================================================
//   static async generateTicketQR(ticket) {
//     const payload = JSON.stringify({
//       ticketId: ticket.id,
//       ts: Date.now(),
//     });

//     const signature = crypto
//       .createHmac("sha256", envConfig.QR_SECRET)
//       .update(payload)
//       .digest("hex");

//     const finalData = JSON.stringify({
//       payload,
//       signature,
//     });

//     const qrImage = await QRCode.toDataURL(finalData);

//     return qrImage;
//   }

//   // ============================================================
//   // GET ALL BOOKINGS
//   // ============================================================
//   static async getAllBookings() {
//     const bookings = await prisma.booking.findMany({
//       include: {
//         place: true,
//         user: true,
//         tickets: {
//           include: {
//             type: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     const result = await Promise.all(
//       bookings.map(async (booking) => {
//         const rawAddonData = Array.isArray(booking.addonIds)
//           ? booking.addonIds
//           : [];

//         if (rawAddonData.length === 0) {
//           return {
//             ...booking,
//             addons: [],
//             bookingAddon: [],
//           };
//         }

//         const normalizedAddons = rawAddonData
//           .map((item) => {
//             if (typeof item === "string") {
//               return {
//                 addonId: item,
//                 quantity: 1,
//               };
//             }

//             if (item && typeof item === "object") {
//               return {
//                 addonId: item.addonId || item.id,
//                 quantity: Number(item.quantity || 1),
//               };
//             }

//             return null;
//           })
//           .filter(
//             (item) =>
//               item?.addonId &&
//               Number.isInteger(item.quantity) &&
//               item.quantity > 0
//           );

//         const addonIds = [
//           ...new Set(normalizedAddons.map((item) => item.addonId)),
//         ];

//         if (addonIds.length === 0) {
//           return {
//             ...booking,
//             addons: [],
//             bookingAddon: [],
//           };
//         }

//         const addonList = await prisma.addon.findMany({
//           where: {
//             id: {
//               in: addonIds,
//             },
//           },
//         });

//         const bookingAddon = normalizedAddons
//           .map((item) => {
//             const addon = addonList.find(
//               (record) => record.id === item.addonId
//             );

//             if (!addon) {
//               return null;
//             }

//             return {
//               id: `${booking.id}-${addon.id}`,
//               addonId: addon.id,
//               name: addon.name,
//               price: Number(addon.price),
//               quantity: item.quantity,
//               addon,
//             };
//           })
//           .filter(Boolean);

//         return {
//           ...booking,
//           addons: bookingAddon,
//           bookingAddon,
//         };
//       })
//     );

//     return result;
//   }

//   // ============================================================
//   // GET BOOKING BY ID
//   // ============================================================
//   static async getBookingById(id) {
//     const booking = await prisma.booking.findUnique({
//       where: {
//         id,
//       },
//       include: {
//         place: true,
//         user: true,
//         tickets: {
//           include: {
//             type: true,
//           },
//         },
//       },
//     });

//     if (!booking) {
//       throw ApiError.notFound("Booking not found");
//     }

//     /**
//      * addonIds can contain:
//      *
//      * Old format:
//      * ["addonId1", "addonId2"]
//      *
//      * New format:
//      * [
//      *   {
//      *     addonId: "addonId1",
//      *     quantity: 2
//      *   }
//      * ]
//      */

//     const rawAddonData = Array.isArray(booking.addonIds)
//       ? booking.addonIds
//       : [];

//     if (rawAddonData.length === 0) {
//       return {
//         ...booking,
//         addons: [],
//         bookingAddon: [],
//       };
//     }

//     const normalizedAddons = rawAddonData
//       .map((item) => {
//         // Old format
//         if (typeof item === "string") {
//           return {
//             addonId: item,
//             quantity: 1,
//           };
//         }

//         // New format
//         if (item && typeof item === "object") {
//           return {
//             addonId: item.addonId || item.id,
//             quantity: Number(item.quantity || 1),
//           };
//         }

//         return null;
//       })
//       .filter(
//         (item) =>
//           item?.addonId && Number.isInteger(item.quantity) && item.quantity > 0
//       );

//     const addonIds = [...new Set(normalizedAddons.map((item) => item.addonId))];

//     if (addonIds.length === 0) {
//       return {
//         ...booking,
//         addons: [],
//         bookingAddon: [],
//       };
//     }

//     const addonList = await prisma.addon.findMany({
//       where: {
//         id: {
//           in: addonIds,
//         },
//       },
//     });

//     /**
//      * Create frontend-friendly addon response.
//      */
//     const bookingAddon = normalizedAddons
//       .map((item) => {
//         const addon = addonList.find((record) => record.id === item.addonId);

//         if (!addon) {
//           return null;
//         }

//         return {
//           id: `${booking.id}-${addon.id}`,
//           addonId: addon.id,
//           name: addon.name,
//           price: Number(addon.price),
//           quantity: item.quantity,

//           // Keep full addon object if frontend needs it
//           addon,
//         };
//       })
//       .filter(Boolean);

//     return {
//       ...booking,

//       // New frontend-friendly field
//       bookingAddon,

//       // Keep addons for compatibility
//       addons: bookingAddon,
//     };
//   }
// }

// export default BookingService;

import prisma from "../db/db.js";
import crypto from "node:crypto";
import QRCode from "qrcode";
import { ApiError } from "../utils/ApiError.js";
import { envConfig } from "../config/env.config.js";
import TicketService from "./ticket.service.js";

import fs from "fs";
import os from "os";
import path from "path";

import { upload } from "../utils/s3Service.js";
import WhatsappService from "./whatsapp.service.js";
import EmailService from "./Email.service.js";

class BookingService {
  // ============================================================
  // CREATE BOOKING
  // ============================================================
  static async createBooking(payload, user) {
    const {
      placeId,
      slotDateTime,
      tickets,
      addons,
      name,
      email,
      phone,
      bookingType = "TICKET",
      paymentMethod = "UPI",
    } = payload;

    // ------------------------------------------------------------
    // BASIC VALIDATION
    // ------------------------------------------------------------

    if (!placeId) {
      throw ApiError.badRequest("Place ID is required");
    }

    if (!slotDateTime) {
      throw ApiError.badRequest("Slot date and time are required");
    }

    if (!Array.isArray(tickets) || tickets.length === 0) {
      throw ApiError.badRequest("At least one ticket is required");
    }

    if (!name || !email || !phone) {
      throw ApiError.badRequest("Name, email and phone are required");
    }

    if (!["CASH", "UPI", "ONLINE"].includes(paymentMethod)) {
      throw ApiError.badRequest("Invalid payment method");
    }

    // Guest user ke liye ONLY ONLINE allowed
    if (!user?.id && paymentMethod !== "ONLINE") {
      throw ApiError.unauthorized("Guest users can only use Online payment");
    }

    // Logged-in user CASH/UPI use kar sakta hai
    if (user?.id && !["CASH", "UPI"].includes(paymentMethod)) {
      throw ApiError.badRequest(
        "Logged-in users can only use Cash or UPI payment"
      );
    }

    const txnId = "TXN_" + Date.now();

    // 🔥 Ab expiry ki zaroorat nahi — booking turant complete hogi
    const expiresAt = null;

    const booking = await prisma.$transaction(
      async (tx) => {
        // --------------------------------------------------------
        // TICKET TYPES
        // --------------------------------------------------------

        const typeIds = tickets.map((ticket) => ticket.typeId);

        const ticketTypes = await tx.ticketType.findMany({
          where: {
            id: {
              in: typeIds,
            },
          },
        });

        if (!ticketTypes.length) {
          throw ApiError.badRequest("Invalid ticket types");
        }

        // Make sure every requested ticket type exists
        if (ticketTypes.length !== typeIds.length) {
          throw ApiError.badRequest("One or more ticket types are invalid");
        }

        // --------------------------------------------------------
        // CALCULATE TICKET TOTAL
        // --------------------------------------------------------

        let totalAmount = 0;
        let totalSeats = 0;

        tickets.forEach((ticket) => {
          const type = ticketTypes.find((item) => item.id === ticket.typeId);

          if (!type) {
            throw ApiError.badRequest("Invalid ticket type");
          }

          const quantity = Number(ticket.quantity);

          if (!Number.isInteger(quantity) || quantity <= 0) {
            throw ApiError.badRequest("Invalid ticket quantity");
          }

          if (quantity > type.maxPerBooking) {
            throw ApiError.badRequest(
              `${type.name} allows maximum ${type.maxPerBooking} tickets per booking`
            );
          }

          totalAmount += type.price * quantity;
          totalSeats += quantity;
        });

        // --------------------------------------------------------
        // ADDONS
        // --------------------------------------------------------

        const rawAddons = Array.isArray(addons) ? addons : [];

        // Support both:
        // Old: ["addonId1", "addonId2"]
        // New: [{ addonId: "addonId1", quantity: 2 }]
        const normalizedAddons = rawAddons
          .map((item) => {
            // Old format
            if (typeof item === "string") {
              return {
                addonId: item,
                quantity: 1,
              };
            }

            // New format
            if (item && typeof item === "object") {
              return {
                addonId: item.addonId || item.id,
                quantity: Number(item.quantity || 1),
              };
            }

            return null;
          })
          .filter(
            (item) =>
              item?.addonId &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0
          );

        // Get unique addon IDs
        const requestedAddonIds = normalizedAddons.map((item) => item.addonId);

        const uniqueAddonIds = [...new Set(requestedAddonIds)];

        // Fetch addons from DB
        const addonList = await tx.addon.findMany({
          where: {
            id: {
              in: uniqueAddonIds,
            },
            placeId,
            isActive: true,
          },
        });

        // Validate addons
        if (uniqueAddonIds.length !== addonList.length) {
          throw ApiError.badRequest(
            "One or more addons are invalid or inactive"
          );
        }

        // Calculate addon amount
        let addonAmount = 0;

        // Final addon payload with quantity
        const addonPayload = normalizedAddons.map((item) => {
          const addon = addonList.find((record) => record.id === item.addonId);

          if (!addon) {
            throw ApiError.badRequest(`Invalid addon: ${item.addonId}`);
          }

          addonAmount += Number(addon.price) * item.quantity;

          return {
            addonId: addon.id,
            quantity: item.quantity,
          };
        });

        // Final booking amount
        const finalAmount = totalAmount + addonAmount;

        // --------------------------------------------------------
        // SLOT CAPACITY
        // --------------------------------------------------------

        const slotDate = new Date(slotDateTime);

        if (Number.isNaN(slotDate.getTime())) {
          throw ApiError.badRequest("Invalid slot date/time");
        }

        const capacity = await this.getSlotCapacity(tx, placeId, slotDateTime);

        // --------------------------------------------------------
        // EXISTING BOOKINGS
        // --------------------------------------------------------

        const activeBookings = await tx.booking.findMany({
          where: {
            placeId,
            slotDateTime: slotDate,
            OR: [
              {
                status: "PAID",
              },
              {
                status: "PENDING",
                expiresAt: {
                  gt: new Date(),
                },
              },
            ],
          },
        });

        const usedSeats = activeBookings.reduce(
          (sum, booking) => sum + booking.totalSeats,
          0
        );

        const availableSeats = capacity - usedSeats;

        if (totalSeats > availableSeats) {
          throw ApiError.badRequest(
            `Not enough seats available. Only ${Math.max(
              availableSeats,
              0
            )} seats remaining`
          );
        }

        // --------------------------------------------------------
        // CREATE BOOKING
        // 🔥 Status ab PENDING rakha hai — completeBooking isko PAID karega
        // --------------------------------------------------------

        const createdBooking = await tx.booking.create({
          data: {
            userId: user?.id || null,
            placeId,
            slotDateTime: slotDate,
            bookingType,
            name,
            email,
            phone,
            paymentMethod,
            totalAmount: finalAmount,
            totalSeats,

            // CASH / UPI direct complete honge
            // ONLINE payment ke liye PENDING rahega
            status: paymentMethod === "ONLINE" ? "PENDING" : "PAID",

            expiresAt,
            txnId,

            ticketPayload: tickets,
            addonIds: addonPayload,
          },
        });

        return createdBooking;
      },
      {
        isolationLevel: "Serializable",
      }
    );

    // ============================================================
    // CASH / UPI
    // ============================================================
    // Logged-in user ke CASH / UPI booking ko direct complete karo.

    if (paymentMethod === "CASH" || paymentMethod === "UPI") {
      const completedBooking = await this.completeBooking(booking.id, null);

      return {
        booking: completedBooking,
        payment: null,
        isCashBooking: paymentMethod === "CASH",
        isOnlinePayment: false,
      };
    }

    // ============================================================
    // ONLINE → EASEBUZZ
    // ============================================================

    if (paymentMethod === "ONLINE") {

      return {
        message: "PG not integrated yet. Please use UPI or Cash for now.",
      }
      // const key = envConfig.EASEBUZZ_KEY;
      // const salt = envConfig.EASEBUZZ_SALT;

      // const hashString = `${key}|${txnId}|${booking.totalAmount}|Ticket Booking|${name}|${email}|||||||||||${salt}`;

      // const hash = crypto.createHash("sha512").update(hashString).digest("hex");

      // return {
      //   booking,
      //   isCashBooking: false,
      //   isOnlinePayment: true,

      //   payment: {
      //     txnid: txnId,
      //     amount: booking.totalAmount,
      //     firstname: name,
      //     email,
      //     phone,
      //     productinfo: "Ticket Booking",

      //     surl: `${envConfig.BASE_URL}/api/booking/success`,

      //     furl: `${envConfig.BASE_URL}/api/booking/failure`,

      //     key,
      //     hash,

      //     url: "https://testpay.easebuzz.in/pay/secure",
      //   },
      // };
    }
  }

  // ============================================================
  // COMPLETE BOOKING
  // ============================================================
  static async completeBooking(bookingId, paymentId = null) {
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        place: true,
        tickets: true,
      },
    });

    if (!booking) {
      throw ApiError.notFound("Booking not found");
    }

    // ----------------------------------------------------------
    // ALREADY COMPLETED
    // ----------------------------------------------------------

    if (booking.status === "PAID" && booking.ticketPdfUrl) {
      return booking;
    }

    // ----------------------------------------------------------
    // UPDATE PAYMENT STATUS
    // ----------------------------------------------------------

    let updatedBooking = booking;

    if (booking.status !== "PAID") {
      updatedBooking = await prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          status: "PAID",
          paymentId: paymentId || booking.paymentId,
        },
        include: {
          place: true,
          tickets: true,
        },
      });
    } else if (paymentId && !booking.paymentId) {
      updatedBooking = await prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          paymentId,
        },
        include: {
          place: true,
          tickets: true,
        },
      });
    }

    // ----------------------------------------------------------
    // CREATE TICKETS
    // ----------------------------------------------------------

    const existingTickets = await prisma.ticket.count({
      where: {
        bookingId: booking.id,
      },
    });

    const ticketPayload = Array.isArray(booking.ticketPayload)
      ? booking.ticketPayload
      : [];

    if (existingTickets === 0 && ticketPayload.length > 0) {
      for (const item of ticketPayload) {
        const quantity = Number(item.quantity);

        for (let i = 0; i < quantity; i++) {
          await prisma.ticket.create({
            data: {
              bookingId: booking.id,
              userId: booking.userId,
              placeId: booking.placeId,
              slotDateTime: booking.slotDateTime,
              typeId: item.typeId,
              qrCode: crypto.randomUUID(),
              status: "PENDING",
            },
          });
        }
      }
    }

    // ----------------------------------------------------------
    // GENERATE PDF
    // ----------------------------------------------------------

    const pdfBuffer = await TicketService.generatePDF(booking.id);

    const tempFile = path.join(os.tmpdir(), `ticket-${booking.id}.pdf`);

    fs.writeFileSync(tempFile, pdfBuffer);

    let uploadedFile;

    try {
      uploadedFile = await upload(tempFile);
    } finally {
      // Delete local temporary PDF
      try {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      } catch (error) {
        console.error("Temporary PDF cleanup failed:", error);
      }
    }

    // ----------------------------------------------------------
    // SAVE PDF URL
    // ----------------------------------------------------------

    updatedBooking = await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        status: "PAID",
        paymentId: paymentId || booking.paymentId,
        ticketPdfUrl: uploadedFile.url,
        ticketPdfKey: uploadedFile.key,
      },
      include: {
        place: true,
        tickets: true,
      },
    });

    // ----------------------------------------------------------
    // EMAIL + WHATSAPP
    // ----------------------------------------------------------

    const message = `🎟️ *Dear ${booking.name},*

Thank you for booking with *${booking.place.name}*! 🥳

Here are your entry ticket details:

📅 Date: ${new Date(booking.slotDateTime).toLocaleDateString("en-IN")}

🎫 Total Tickets: ${booking.totalSeats}

💰 Total Price: Rs ${booking.totalAmount}

💳 Payment Method: ${booking.paymentMethod}

🛑 Important: Please keep your QR code safe and do NOT share it with anyone!

📲 Show it only at the entry gate to authorized staff.

We can't wait to welcome you! 🎉`;

    try {
      await EmailService.sendTicket({
        to: booking.email,
        name: booking.name,
        booking: updatedBooking,
        pdfBuffer,
      });
    } catch (error) {
      console.error("Email sending failed:", error);
    }

    try {
      await WhatsappService.sendTicket(
        booking.phone,
        message,
        uploadedFile.url
      );
    } catch (error) {
      console.error("WhatsApp sending failed:", error);
    }

    return updatedBooking;
  }

  // ============================================================
  // EASEBUZZ SUCCESS (Commented — ab use nahi ho raha)
  // ============================================================
  //
  // static async paymentSuccess(data) {
  //   const booking = await prisma.booking.findUnique({
  //     where: { txnId: data.txnid },
  //   });
  //
  //   if (!booking) throw ApiError.notFound("Booking not found");
  //
  //   if (!this.verifyHash(data)) {
  //     throw ApiError.badRequest("Invalid payment");
  //   }
  //
  //   if (!data.status || data.status.toLowerCase() !== "success") {
  //     throw ApiError.badRequest("Payment failed");
  //   }
  //
  //   return await this.completeBooking(booking.id, data.easepayid || null);
  // }

  // ============================================================
  // PAYMENT FAILURE (Commented — ab use nahi ho raha)
  // ============================================================
  //
  // static async paymentFailure(data) {
  //   const booking = await prisma.booking.findUnique({
  //     where: { txnId: data.txnid },
  //   });
  //
  //   if (!booking) throw ApiError.notFound("Booking not found");
  //
  //   if (booking.status !== "PENDING") return booking;
  //
  //   await prisma.booking.update({
  //     where: { txnId: data.txnid },
  //     data: { status: "FAILED" },
  //   });
  //
  //   return true;
  // }

  // ============================================================
  // EXPIRE BOOKINGS
  // ============================================================
  static async expireBookings() {
    await prisma.booking.updateMany({
      where: {
        status: "PENDING",
        expiresAt: {
          lt: new Date(),
        },
      },
      data: {
        status: "EXPIRED",
      },
    });
  }

  // ============================================================
  // SLOT CAPACITY
  // ============================================================
  static async getSlotCapacity(tx, placeId, slotDateTime) {
    const dateObj = new Date(slotDateTime);

    const startOfDay = new Date(dateObj);
    startOfDay.setHours(0, 0, 0, 0);

    const time = new Date(slotDateTime).toISOString().slice(11, 16);

    // ----------------------------------------------------------
    // SLOT OVERRIDE
    // ----------------------------------------------------------

    const override = await tx.slotOverride.findFirst({
      where: {
        placeId,
        date: startOfDay,
        startTime: time,
      },
    });

    if (override) {
      if (override.isClosed) {
        throw ApiError.badRequest("Slot is closed");
      }

      if (override.capacity !== null) {
        return override.capacity;
      }
    }

    // ----------------------------------------------------------
    // SLOT TEMPLATE
    // ----------------------------------------------------------

    const template = await tx.slotTemplate.findFirst({
      where: {
        placeId,
        startTime: {
          lte: time,
        },
        endTime: {
          gt: time,
        },
      },
    });

    if (!template) {
      throw ApiError.notFound("Slot not found");
    }

    return template.capacity;
  }

  // ============================================================
  // VERIFY EASEBUZZ HASH (Commented — ab use nahi ho raha)
  // ============================================================
  //
  // static verifyHash(data) {
  //   const salt = envConfig.EASEBUZZ_SALT;
  //   const key = envConfig.EASEBUZZ_KEY;
  //
  //   const str = `${salt}|${data.status}|||||||||||${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${key}`;
  //
  //   const hash = crypto.createHash("sha512").update(str).digest("hex");
  //
  //   return hash === data.hash;
  // }

  // ============================================================
  // GENERATE TICKET QR
  // ============================================================
  static async generateTicketQR(ticket) {
    const payload = JSON.stringify({
      ticketId: ticket.id,
      ts: Date.now(),
    });

    const signature = crypto
      .createHmac("sha256", envConfig.QR_SECRET)
      .update(payload)
      .digest("hex");

    const finalData = JSON.stringify({
      payload,
      signature,
    });

    const qrImage = await QRCode.toDataURL(finalData);

    return qrImage;
  }

  // ============================================================
  // GET ALL BOOKINGS
  // ============================================================
  static async getAllBookings() {
    const bookings = await prisma.booking.findMany({
      include: {
        place: true,
        user: true,
        tickets: {
          include: {
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const result = await Promise.all(
      bookings.map(async (booking) => {
        const rawAddonData = Array.isArray(booking.addonIds)
          ? booking.addonIds
          : [];

        if (rawAddonData.length === 0) {
          return {
            ...booking,
            addons: [],
            bookingAddon: [],
          };
        }

        const normalizedAddons = rawAddonData
          .map((item) => {
            if (typeof item === "string") {
              return {
                addonId: item,
                quantity: 1,
              };
            }

            if (item && typeof item === "object") {
              return {
                addonId: item.addonId || item.id,
                quantity: Number(item.quantity || 1),
              };
            }

            return null;
          })
          .filter(
            (item) =>
              item?.addonId &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0
          );

        const addonIds = [
          ...new Set(normalizedAddons.map((item) => item.addonId)),
        ];

        if (addonIds.length === 0) {
          return {
            ...booking,
            addons: [],
            bookingAddon: [],
          };
        }

        const addonList = await prisma.addon.findMany({
          where: {
            id: {
              in: addonIds,
            },
          },
        });

        const bookingAddon = normalizedAddons
          .map((item) => {
            const addon = addonList.find(
              (record) => record.id === item.addonId
            );

            if (!addon) {
              return null;
            }

            return {
              id: `${booking.id}-${addon.id}`,
              addonId: addon.id,
              name: addon.name,
              price: Number(addon.price),
              quantity: item.quantity,
              addon,
            };
          })
          .filter(Boolean);

        return {
          ...booking,
          addons: bookingAddon,
          bookingAddon,
        };
      })
    );

    return result;
  }

  // ============================================================
  // GET BOOKING BY ID
  // ============================================================
  static async getBookingById(id) {
    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        place: true,
        user: true,
        tickets: {
          include: {
            type: true,
          },
        },
      },
    });

    if (!booking) {
      throw ApiError.notFound("Booking not found");
    }

    const rawAddonData = Array.isArray(booking.addonIds)
      ? booking.addonIds
      : [];

    if (rawAddonData.length === 0) {
      return {
        ...booking,
        addons: [],
        bookingAddon: [],
      };
    }

    const normalizedAddons = rawAddonData
      .map((item) => {
        // Old format
        if (typeof item === "string") {
          return {
            addonId: item,
            quantity: 1,
          };
        }

        // New format
        if (item && typeof item === "object") {
          return {
            addonId: item.addonId || item.id,
            quantity: Number(item.quantity || 1),
          };
        }

        return null;
      })
      .filter(
        (item) =>
          item?.addonId && Number.isInteger(item.quantity) && item.quantity > 0
      );

    const addonIds = [...new Set(normalizedAddons.map((item) => item.addonId))];

    if (addonIds.length === 0) {
      return {
        ...booking,
        addons: [],
        bookingAddon: [],
      };
    }

    const addonList = await prisma.addon.findMany({
      where: {
        id: {
          in: addonIds,
        },
      },
    });

    const bookingAddon = normalizedAddons
      .map((item) => {
        const addon = addonList.find((record) => record.id === item.addonId);

        if (!addon) {
          return null;
        }

        return {
          id: `${booking.id}-${addon.id}`,
          addonId: addon.id,
          name: addon.name,
          price: Number(addon.price),
          quantity: item.quantity,
          addon,
        };
      })
      .filter(Boolean);

    return {
      ...booking,
      bookingAddon,
      addons: bookingAddon,
    };
  }
}

export default BookingService;
