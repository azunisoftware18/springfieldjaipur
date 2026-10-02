import prisma from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";

class TicketTypeService {
  static async handle(payload) {
    const { action, data } = payload;

    try {
      switch (action) {
        case "create":
          return await prisma.ticketType.create({
            data,
          });

        case "update":
          if (!data.id) throw ApiError.badRequest("ID required");

          return await prisma.ticketType.update({
            where: { id: data.id },
            data,
          });

        // case "delete":
        //   if (!data.id) throw ApiError.badRequest("ID required");

        //   await prisma.ticketType.delete({
        //     where: { id: data.id },
        //   });

        //   return { deleted: true };

        case "delete":
          if (!data?.id) {
            throw ApiError.badRequest("ID required");
          }

          const ticketType = await prisma.ticketType.findUnique({
            where: {
              id: data.id,
            },
            include: {
              _count: {
                select: {
                  tickets: true,
                },
              },
            },
          });

          if (!ticketType) {
            throw ApiError.notFound("Ticket type not found");
          }

          if (ticketType._count.tickets > 0) {
            throw ApiError.badRequest(
              "Cannot delete ticket type because it is already used by tickets"
            );
          }

          await prisma.ticketType.delete({
            where: {
              id: data.id,
            },
          });

          return { deleted: true };

        case "getAll":
          if (!data.placeId) throw ApiError.badRequest("placeId required");

          return await prisma.ticketType.findMany({
            where: { placeId: data.placeId },

            include: {
              place: true,
            },

            orderBy: {
              createdAt: "desc",
            },
          });

        case "upsert":
          const { name, placeId, price, maxPerBooking } = data;

          return await prisma.ticketType.upsert({
            where: {
              name_placeId: { name, placeId },
            },
            update: {
              price,
              maxPerBooking,
            },
            create: {
              name,
              placeId,
              price,
              maxPerBooking,
            },
          });

        default:
          throw ApiError.badRequest("Invalid action");
      }
    } catch (error) {
      if (error.code === "P2002") {
        throw ApiError.conflict("Ticket type already exists");
      }

      throw error;
    }
  }
}

export default TicketTypeService;
