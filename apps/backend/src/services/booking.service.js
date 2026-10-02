import prisma from "../db/db.js";
import crypto from "node:crypto";
import QRCode from "qrcode";
import { ApiError } from "../utils/ApiError.js";
import { envConfig } from "../config/env.config.js";
import { log } from "node:console";
import TicketService from "./ticket.service.js";

import fs from "fs";
import os from "os";
import path from "path";

import { upload } from "../utils/s3Service.js";
import WhatsappService from "./whatsapp.service.js";
import EmailService from "./Email.service.js";

class BookingService {
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
    } = payload;

    const txnId = "TXN_" + Date.now();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    return prisma.$transaction(
      async (tx) => {
        const typeIds = tickets.map((t) => t.typeId);

        const ticketTypes = await tx.ticketType.findMany({
          where: { id: { in: typeIds } },
        });

        if (!ticketTypes.length) {
          throw ApiError.badRequest("Invalid ticket types");
        }

        let totalAmount = 0;
        let totalSeats = 0;

        tickets.forEach((t) => {
          const type = ticketTypes.find((x) => x.id === t.typeId);
          totalAmount += type.price * t.quantity;
          totalSeats += t.quantity;
        });

        const addonIds = addons || [];

        const addonList = await tx.addon.findMany({
          where: {
            id: { in: addonIds },
            placeId,
            isActive: true,
          },
        });

        if (addons?.length) {
          if (addonList.length !== addons.length) {
            throw ApiError.badRequest("Invalid or inactive addon");
          }
        }

        let addonAmount = 0;

        addonList.forEach((addon) => {
          addonAmount += addon.price;
        });

        const finalAmount = totalAmount + addonAmount;

        const capacity = await this.getSlotCapacity(tx, placeId, slotDateTime);

        const activeBookings = await tx.booking.findMany({
          where: {
            placeId,
            slotDateTime: new Date(slotDateTime),
            OR: [
              { status: "PAID" },
              { status: "PENDING", expiresAt: { gt: new Date() } },
            ],
          },
        });

        const usedSeats = activeBookings.reduce(
          (sum, b) => sum + b.totalSeats,
          0
        );

        if (totalSeats > capacity - usedSeats) {
          throw ApiError.badRequest("Not enough seats available");
        }

        const booking = await tx.booking.create({
          data: {
            userId: user?.id,

            placeId,

            slotDateTime: new Date(slotDateTime),

            name,
            email,
            phone,

            totalAmount: finalAmount,

            totalSeats,

            bookingType,

            txnId,

            status: "PENDING",

            expiresAt,

            // ✅ SAVE REQUESTED TICKETS
            ticketPayload: tickets,
            addonIds: addons || [],
          },
        });



        const key = envConfig.EASEBUZZ_KEY;
        const salt = envConfig.EASEBUZZ_SALT;

        const hashString = `${key}|${txnId}|${finalAmount}|Ticket Booking|${name}|${email}|||||||||||${salt}`;
        const hash = crypto
          .createHash("sha512")
          .update(hashString)
          .digest("hex");

        return {
          booking,
          payment: {
            txnid: txnId,
            amount: finalAmount,
            firstname: name,
            email,
            phone,
            productinfo: "Ticket Booking",
            surl: `${envConfig.BASE_URL}/api/booking/success`,
            furl: `${envConfig.BASE_URL}/api/booking/failure`,
            key,
            hash,
            url: "https://testpay.easebuzz.in/pay/secure",
          },
        };
      },
      { isolationLevel: "Serializable" }
    );
  }

  static async paymentSuccess(data) {
    const booking = await prisma.booking.findUnique({
      where: {
        txnId: data.txnid,
      },
    });

    if (!booking) {
      throw ApiError.notFound("Booking not found");
    }

    // ✅ HASH VERIFY
    if (!this.verifyHash(data)) {
      throw ApiError.badRequest("Invalid payment");
    }

    // ✅ PAYMENT STATUS
    if (data.status.toLowerCase() !== "success") {
      throw ApiError.badRequest("Payment failed");
    }

    // ✅ ALREADY PAID
    if (booking.status === "PAID") {
      return booking;
    }

    // ✅ UPDATE BOOKING
    const updatedBooking = await prisma.booking.update({
      where: {
        txnId: data.txnid,
      },

      data: {
        status: "PAID",

        paymentId: data.easepayid,
      },
    });

    // 🔥 GET ORIGINAL BOOKING DATA
    const originalBooking = await prisma.booking.findUnique({
      where: {
        id: booking.id,
      },

      include: {
        place: true,
      },
    });

    // 🔥 GET TICKET TYPES
    const ticketPayload = booking.ticketPayload || [];

    // 🔥 CREATE TICKETS
    for (const item of ticketPayload) {
      for (let i = 0; i < item.quantity; i++) {
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

    // Generate PDF
const pdfBuffer = await TicketService.generatePDF(booking.id);

// Temporary file
const tempFile = path.join(
  os.tmpdir(),
  `ticket-${booking.id}.pdf`
);

fs.writeFileSync(tempFile, pdfBuffer);

// Upload S3
const uploadedFile = await upload(tempFile);

// Save URL
await prisma.booking.update({
  where: {
    id: booking.id,
  },

  data: {
    ticketPdfUrl: uploadedFile.url,
    ticketPdfKey: uploadedFile.key,
  },
});

const message = `☃️*Dear ${booking.name},*

Thank you for booking with ❄️${originalBooking.place.name}!❄️🥳

Here are your 🎟️ entry ticket details:

📅 Date: ${new Date(booking.slotDateTime).toLocaleDateString("en-IN")}

🎫 Total Tickets: ${booking.totalSeats}

💰 Total Price: Rs ${booking.totalAmount}

🛑 Important: Please keep your QR code safe and do NOT share it with anyone!

📲 Show it only at the entry gate to authorized staff.

Bundle up and get ready for a snow-tastic time! ⛷️🎿

We can't wait to welcome you! ☕🔥`;

try {


 await EmailService.sendTicket({
  to: booking.email,
  name: booking.name,
  booking,           // must include: id, phone, slotDateTime, totalAmount, status, place.name
  pdfBuffer,         // 🔥 best — direct buffer se attach
});

await WhatsappService.sendTicket(
    booking.phone,
    message,
    uploadedFile.url
);
} catch (error) {
  console.log("WhatsApp sending failed", error);
}

    return updatedBooking;
  }

  static async paymentFailure(data) {
    const booking = await prisma.booking.findUnique({
      where: { txnId: data.txnid },
    });

    if (!booking) throw ApiError.notFound("Booking not found");

    if (booking.status !== "PENDING") return true;

    await prisma.booking.update({
      where: { txnId: data.txnid },
      data: { status: "FAILED" },
    });

    return true;
  }

  static async expireBookings() {
    await prisma.booking.updateMany({
      where: {
        status: "PENDING",
        expiresAt: { lt: new Date() },
      },
      data: {
        status: "EXPIRED",
      },
    });
  }

  static async getSlotCapacity(tx, placeId, slotDateTime) {
    const dateObj = new Date(slotDateTime);

    const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));

    const time = new Date(slotDateTime).toISOString().slice(11, 16); // HH:mm

    // OVERRIDE CHECK
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

    // TEMPLATE RANGE MATCH
    const template = await tx.slotTemplate.findFirst({
      where: {
        placeId,
        startTime: { lte: time },
        endTime: { gt: time },
      },
    });

    if (!template) {
      throw ApiError.notFound("Slot not found");
    }

    return template.capacity;
  }

  static verifyHash(data) {
    const salt = envConfig.EASEBUZZ_SALT;
    const key = envConfig.EASEBUZZ_KEY;

    const str = `${salt}|${data.status}|||||||||||${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${key}`;

    const hash = crypto.createHash("sha512").update(str).digest("hex");

    return hash === data.hash;
  }

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

  static async getAllBookings() {
    return await prisma.booking.findMany({
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
  }
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

    const addonIds = Array.isArray(booking.addonIds) ? booking.addonIds : [];

    if (addonIds.length) {
      const addons = await prisma.addon.findMany({
        where: {
          id: { in: addonIds },
        },
      });

      return {
        ...booking,
        addons,
      };
    }

    return booking;
  }
}

export default BookingService;
