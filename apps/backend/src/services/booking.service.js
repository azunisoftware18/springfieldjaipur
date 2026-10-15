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
import { cashfreeApi } from "../config/cashfree.config.js";

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

    if (!["CASH", "UPI", "ONLINE", "FREE"].includes(paymentMethod)) {
      throw ApiError.badRequest("Invalid payment method");
    }

    // Guest user ke liye ONLY ONLINE allowed
    if (!user?.id && paymentMethod !== "ONLINE") {
      throw ApiError.unauthorized("Guest users can only use Online payment");
    }

    // Logged-in user CASH/UPI use kar sakta hai
    if (
      user?.id &&
      !["CASH", "UPI", "ONLINE", "FREE"].includes(paymentMethod)
    ) {
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

    if (
      paymentMethod === "CASH" ||
      paymentMethod === "UPI" ||
      paymentMethod === "FREE"
    ) {
      const completedBooking = await this.completeBooking(booking.id, null);

      return {
        booking: completedBooking,
        payment: null,
        isCashBooking: paymentMethod === "CASH",
        isOnlinePayment: false,
      };
    }

    if (paymentMethod === "ONLINE") {
      const requestId = crypto.randomUUID();

      try {
        // Check required configuration without exposing credentials.
        const frontendUrl = envConfig.FRONTEND_URL;

        if (!frontendUrl) {
          throw new Error("FRONTEND_URL is missing");
        }

        const returnUrl = new URL("/payment-success/return", frontendUrl);

        returnUrl.searchParams.set("order_id", booking.txnId);

        const orderRequest = {
          order_id: booking.txnId,
          order_amount: Number(Number(booking.totalAmount).toFixed(2)),
          order_currency: "INR",

          customer_details: {
            customer_id: user?.id ? String(user.id) : `guest_${booking.id}`,
            customer_name: name,
            customer_email: email,
            customer_phone: String(phone),
          },

          order_meta: {
            return_url: returnUrl.toString(),
          },

          order_note: `Ticket booking ${booking.id}`,
        };

        let response;

        try {
          response = await cashfreeApi.post("/orders", orderRequest);
        } catch (error) {
          throw error;
        }
        const cashfreeOrder = response?.data;

        console.info("[CASHFREE][CREATE_ORDER][RESPONSE]", {
          requestId,
          httpStatus: response?.status,
          orderId: cashfreeOrder?.order_id,
          orderStatus: cashfreeOrder?.order_status,
          hasPaymentSessionId: Boolean(cashfreeOrder?.payment_session_id),
          responseTimestamp: new Date().toISOString(),
        });

        if (!cashfreeOrder?.order_id || !cashfreeOrder?.payment_session_id) {
          console.error("[CASHFREE][CREATE_ORDER][INVALID_RESPONSE]", {
            requestId,
            httpStatus: response?.status,
            responseKeys: Object.keys(cashfreeOrder || {}),
          });

          throw new Error(
            "Cashfree did not return order ID or payment session ID"
          );
        }

        if (cashfreeOrder.order_id !== booking.txnId) {
          console.error("[CASHFREE][CREATE_ORDER][ORDER_MISMATCH]", {
            requestId,
            expectedOrderId: booking.txnId,
            receivedOrderId: cashfreeOrder.order_id,
          });

          throw new Error("Cashfree returned a different order ID");
        }

        console.info("[CASHFREE][CREATE_ORDER][SUCCESS]", {
          requestId,
          bookingId: booking.id,
          orderId: cashfreeOrder.order_id,
        });

        return {
          booking,
          isCashBooking: false,
          isOnlinePayment: true,
          payment: {
            provider: "CASHFREE",
            orderId: cashfreeOrder.order_id,
            paymentSessionId: cashfreeOrder.payment_session_id,
            amount: Number(booking.totalAmount),
            currency: "INR",
          },
        };
      } catch (error) {
        // Log provider diagnostics, but NEVER log credentials or full request data.
        console.error("[CASHFREE][CREATE_ORDER][FAILED]", {
          requestId,

          bookingId: booking.id,
          orderId: booking.txnId,
          errorName: error?.name,
          errorMessage: error?.message,
          httpStatus: error?.response?.status ?? null,
          providerCode: error?.response?.data?.code ?? null,
          providerType: error?.response?.data?.type ?? null,
          providerMessage: error?.response?.data?.message ?? null,
          cashfreeRequestId:
            error?.response?.headers?.["x-request-id"] ??
            error?.response?.headers?.["x-cf-request-id"] ??
            null,

          timestamp: new Date().toISOString(),
        });

        throw new ApiError(
          "Unable to initialize online payment. Please try again.",
          502
        );
      }
    }
  }
  static async verifyCashfreePayment(orderId) {
    if (!orderId) {
      throw ApiError.badRequest("Cashfree order ID is required");
    }

    const booking = await prisma.booking.findUnique({
      where: { txnId: orderId },
    });

    if (!booking) {
      throw ApiError.notFound("Booking not found");
    }

    // Idempotency: already completed booking return karein.
    if (booking.status === "PAID" && booking.ticketPdfUrl) {
      return booking;
    }

    const response = await cashfreeApi.get(
      `/orders/${encodeURIComponent(orderId)}`
    );
    const order = response.data;

    // Verify order identity and amount.
    if (
      order.order_id !== booking.txnId ||
      Number(order.order_amount) !==
        Number(Number(booking.totalAmount).toFixed(2))
    ) {
      throw ApiError.badRequest("Cashfree order details do not match booking");
    }

    // Cashfree ka server-side status hi authoritative hai.
    if (order.order_status !== "PAID") {
      return {
        success: false,
        message: "Payment is not completed yet",
        status: order.order_status,
        bookingId: booking.id,
      };
    }

    // Existing PDF, QR, email aur WhatsApp workflow reuse hoga.
    return await this.completeBooking(
      booking.id,
      order.cf_order_id ? String(order.cf_order_id) : orderId
    );
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
  static async paymentSuccess(data) {
    const booking = await prisma.booking.findUnique({
      where: { txnId: data.txnid },
    });

    if (!booking) throw ApiError.notFound("Booking not found");

    if (!this.verifyHash(data)) {
      throw ApiError.badRequest("Invalid payment");
    }

    if (!data.status || data.status.toLowerCase() !== "success") {
      throw ApiError.badRequest("Payment failed");
    }

    return await this.completeBooking(booking.id, data.easepayid || null);
  }

  // ============================================================
  // PAYMENT FAILURE (Commented — ab use nahi ho raha)
  // ============================================================

  static async paymentFailure(data) {
    const booking = await prisma.booking.findUnique({
      where: { txnId: data.txnid },
    });

    if (!booking) throw ApiError.notFound("Booking not found");

    if (booking.status !== "PENDING") return booking;

    await prisma.booking.update({
      where: { txnId: data.txnid },
      data: { status: "FAILED" },
    });

    return true;
  }

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
  static verifyHash(data) {
    const salt = envConfig.EASEBUZZ_SALT;
    const key = envConfig.EASEBUZZ_KEY;

    const str = `${salt}|${data.status}|||||||||||${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${key}`;

    const hash = crypto.createHash("sha512").update(str).digest("hex");

    return hash === data.hash;
  }

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

  // ============================================================
  // DELETE BOOKING
  // ============================================================
  static async deleteBooking(id) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!booking) {
        throw ApiError.notFound("Booking not found");
      }

      const tickets = await tx.ticket.findMany({
        where: { bookingId: id },
        select: { id: true },
      });

      if (tickets.length > 0) {
        await tx.scanLog.deleteMany({
          where: {
            ticketId: {
              in: tickets.map((ticket) => ticket.id),
            },
          },
        });
      }

      await tx.ticket.deleteMany({
        where: { bookingId: id },
      });

      await tx.booking.delete({
        where: { id },
      });

      return { id: booking.id };
    });
  }
}

export default BookingService;
