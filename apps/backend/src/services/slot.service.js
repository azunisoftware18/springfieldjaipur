import prisma from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";

class SlotTemplateService {
  static async create(payload) {
    const { placeId, startTime, endTime, capacity } = payload;

    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!place) throw ApiError.notFound("Place not found");

    const existingTemplate = await prisma.slotTemplate.findUnique({
      where: {
        placeId_startTime: {
          placeId,
          startTime,
        },
      },
    });

    if (existingTemplate) {
      throw ApiError.conflict("Slot template already exists");
    }

    return prisma.slotTemplate.create({
      data: { placeId, startTime, endTime, capacity },
    });
  }

  static async getAll(placeId) {
    console.log("Fetching slot templates for placeId:", placeId);
    return prisma.slotTemplate.findMany({
      where: { placeId },
      orderBy: { startTime: "asc" },
    });
  }

  static async update(id, payload) {
    return prisma.slotTemplate.update({
      where: { id },
      data: payload,
    });
  }

  static async delete(id) {
    await prisma.slotTemplate.delete({ where: { id } });
    return true;
  }
}

class SlotOverrideService {
  static async upsert(payload) {
    const { placeId, date, startTime, capacity, isClosed } = payload;

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    return prisma.slotOverride.upsert({
      where: {
        placeId_date_startTime: {
          placeId,
          date: parsedDate,
          startTime,
        },
      },
      update: {
        capacity,
        isClosed,
        date: parsedDate,
      },
      create: {
        placeId,
        date: parsedDate,
        startTime,
        capacity,
        isClosed,
      },
    });
  }
  static async getAll(placeId, date) {
    const start = new Date(`${date}T00:00:00.000Z`);

    const end = new Date(`${date}T23:59:59.999Z`);

    return prisma.slotOverride.findMany({
      where: {
        placeId,
        date: {
          gte: start,
          lte: end,
        },
      },

      orderBy: {
        startTime: "asc",
      },
    });
  }
}

const formatTime12Hour = (time) => {
  const [hour, minute] = time.split(":");

  const date = new Date();

  date.setHours(hour);
  date.setMinutes(minute);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
class SlotService {
  static async getSlotsByDate(placeId, date) {
    const templates = await prisma.slotTemplate.findMany({
      where: { placeId },
    });

    console.log(placeId, date);

    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);

    const overrides = await prisma.slotOverride.findMany({
      where: {
        placeId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const bookings = await prisma.ticket.findMany({
      where: {
        placeId,

        status: {
          not: "CANCELLED",
        },

        slotDateTime: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lt: new Date(`${date}T23:59:59.999Z`),
        },
      },

      select: {
        slotDateTime: true,
      },
    });

    const now = new Date();

    return templates.map((t) => {
      const override = overrides.find((o) => o.startTime === t.startTime);

      const capacity = override?.capacity ?? t.capacity;

      const slotDateTime = new Date(`${date}T${t.startTime}:00`);

      const booked = bookings.filter((b) => {
        const bookingHour = new Date(b.slotDateTime).getUTCHours();

        const slotHour = Number(t.startTime.split(":")[0]);

        return bookingHour === slotHour;
      }).length;

      const available = Math.max(capacity - booked, 0);

      let status = "available";

      if (override?.isClosed) status = "unavailable";
      else if (slotDateTime < now) status = "unavailable";
      else if (available === 0) status = "Slot full";

      return {
        time: t.startTime,
        displayTime: formatTime12Hour(t.startTime),
        capacity,
        booked,
        available,
        status,
      };
    });
  }
}

export { SlotTemplateService, SlotOverrideService, SlotService };
