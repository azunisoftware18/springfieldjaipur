import prisma from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";

class AddonService {
  static async handle(payload) {
    const { action, data } = payload;

    try {
      switch (action) {
        case "create":
          if (!data.placeId || !data.name || data.price == null) {
            throw ApiError.badRequest("name, price, placeId required");
          }

          return await prisma.addon.create({
            data: {
              name: data.name,
              price: data.price,
              placeId: data.placeId,
              isActive: data.isActive ?? true,
            },
          });

        case "update":
          if (!data.id) throw ApiError.badRequest("ID required");

          return await prisma.addon.update({
            where: { id: data.id },
            data: {
              name: data.name,
              price: data.price,
              isActive: data.isActive,
            },
          });

        case "delete":
          if (!data.id) throw ApiError.badRequest("ID required");

          await prisma.addon.delete({
            where: { id: data.id },
          });

          return { deleted: true };

        // 🔥 GET ALL (WITH FILTER)
        case "getAll":
          if (!data.placeId) throw ApiError.badRequest("placeId required");

          /**
           * type:
           * - "active" → only isActive = true
           * - "all" → no filter (default)
           */
          const type = data.type || "all";

          return await prisma.addon.findMany({
            where: {
              placeId: data.placeId,
              ...(type === "active" ? { isActive: true } : {}),
            },
            orderBy: { createdAt: "desc" },
          });

        // 🔥 UPSERT (same addon name per place)
        case "upsert":
          const { name, placeId, price, isActive } = data;

          if (!name || !placeId) {
            throw ApiError.badRequest("name & placeId required");
          }

          return await prisma.addon.upsert({
            where: {
              name_placeId: { name, placeId }, // needs unique
            },
            update: {
              price,
              isActive,
            },
            create: {
              name,
              placeId,
              price,
              isActive: isActive ?? true,
            },
          });

        default:
          throw ApiError.badRequest("Invalid action");
      }
    } catch (error) {
      if (error.code === "P2002") {
        throw ApiError.conflict("Addon already exists");
      }
      throw error;
    }
  }
}

export default AddonService;
