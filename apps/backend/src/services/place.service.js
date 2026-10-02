// import prisma from "../db/db.js";
// import { ApiError } from "../utils/ApiError.js";
// import { upload } from "../utils/s3Service.js";

// class PlaceService {
//   static async createPlace(payload) {
//     const { name, location } = payload;
//     const existing = await prisma.place.findFirst({
//       where: {
//         name,
//         location,
//       },
//     });

//     if (existing) {
//       throw ApiError.conflict("Place already exists");
//     }

//     return await prisma.place.create({
//       data: payload,
//     });
//   }

//   static async getAllPlaces() {
//     return await prisma.place.findMany({
//       orderBy: { createdAt: "desc" },
//     });
//   }

//   static async getPlaceById(id) {
//     const place = await prisma.place.findUnique({
//       where: { id },
//     });

//     if (!place) {
//       throw ApiError.notFound("Place not found");
//     }
//     return place;
//   }

  

//   static async updatePlace(id, payload, file) {
//     const existing = await prisma.place.findUnique({
//       where: { id },
//     });

//     if (!existing) {
//       throw ApiError.notFound("Place not found");
//     } 

    
//     let imageUrl = existing.image;
//     let imageKey = existing.imageKey;

//     // 🔥 Agar file aayi hai toh upload karo
//     if (file) {
//       console.log("Uploading file:", file.originalname, file.mimetype);

//       // Agar upload() buffer leta hai
//       const uploaded = await upload(file.buffer);

//       // Agar upload() path leta hai toh:
//       // const uploaded = await upload(file.path);

//       console.log("Uploaded:", uploaded);

//       imageUrl = uploaded.url;
//       imageKey = uploaded.key;
//     }

    
//     const isSame =
//       (payload.name ?? existing.name) === existing.name &&
//       (payload.location ?? existing.location) === existing.location &&
//       (payload.latitude ?? existing.latitude) === existing.latitude &&
//       (payload.longitude ?? existing.longitude) === existing.longitude &&
//       (payload.shortDescription ?? existing.shortDescription) ===
//         existing.shortDescription &&
//       (payload.description ?? existing.description) === existing.description;
//       (payload.imageUrl)
//       (payload.imageKey)

       

//     if (isSame) {
//       throw ApiError.badRequest("Already updated");
//     }

//     if (payload.name || payload.location) {
//       const duplicate = await prisma.place.findFirst({
//         where: {
//           name: payload.name ?? existing.name,
//           location: payload.location ?? existing.location,
//           NOT: { id },
//         },
//       });

//       if (duplicate) {
//         throw ApiError.conflict("Place already exists");
//       }
//     }

//     return await prisma.place.update({
//       where: { id },
//       data: payload,
//     });
//   }

//   static async deletePlace(id) {
//     const existing = await prisma.place.findUnique({
//       where: { id },
//     });

//     if (!existing) {
//       throw ApiError.notFound("Place not found");
//     }

//     await prisma.place.delete({
//       where: { id },
//     });

//     return true;
//   }
// }

// export default PlaceService;




import prisma from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";
import { upload, deleteByKey } from "../utils/s3Service.js";

class PlaceService {
  // =========================================================
  // CREATE PLACE
  // =========================================================
  static async createPlace(payload, file) {
    const {
      name,
      location,
      shortDescription,
      description,
      latitude,
      longitude,
    } = payload;

    // Check duplicate
    const existing = await prisma.place.findFirst({
      where: {
        name,
        location,
      },
    });

    if (existing) {
      throw ApiError.conflict("Place already exists");
    }

    let imageUrl = null;
    let imageKey = null;

    // Upload image
    if (file) {
      console.log("=== CREATE PLACE IMAGE ===");
      console.log("Original name:", file.originalname);
      console.log("Mimetype:", file.mimetype);
      console.log("Path:", file.path);

      if (!file.path) {
        throw ApiError.badRequest("Uploaded file path is missing");
      }

      const uploaded = await upload(file.path);

      console.log("S3 uploaded:", uploaded);

      imageUrl = uploaded?.url || null;
      imageKey = uploaded?.key || null;
    }

    return await prisma.place.create({
      data: {
        name,
        location,
        latitude: Number(latitude),
        longitude: Number(longitude),
        shortDescription: shortDescription || null,
        description: description || null,
        imageUrl,
        imageKey,
      },
    });
  }

  // =========================================================
  // GET ALL
  // =========================================================
  static async getAllPlaces() {
    return await prisma.place.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // =========================================================
  // GET BY ID
  // =========================================================
  static async getPlaceById(id) {
    const place = await prisma.place.findUnique({
      where: {
        id,
      },
    });

    if (!place) {
      throw ApiError.notFound("Place not found");
    }

    return place;
  }

  // =========================================================
  // UPDATE PLACE
  // =========================================================
  static async updatePlace(id, payload, file) {
    const existing = await prisma.place.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw ApiError.notFound("Place not found");
    }

    const {
      name,
      location,
      shortDescription,
      description,
      latitude,
      longitude,
    } = payload;

    const nextName = name ?? existing.name;
    const nextLocation = location ?? existing.location;

    // Check duplicate
    const duplicate = await prisma.place.findFirst({
      where: {
        name: nextName,
        location: nextLocation,
        NOT: {
          id,
        },
      },
    });

    if (duplicate) {
      throw ApiError.conflict("Place already exists");
    }

    let imageUrl = existing.imageUrl;
    let imageKey = existing.imageKey;

    // =======================================================
    // UPLOAD NEW IMAGE
    // =======================================================
    if (file) {
      console.log("=== UPDATE PLACE IMAGE ===");
      console.log("Original name:", file.originalname);
      console.log("Mimetype:", file.mimetype);
      console.log("Path:", file.path);

      if (!file.path) {
        throw ApiError.badRequest("Uploaded file path is missing");
      }

      const uploaded = await upload(file.path);

      console.log("S3 uploaded:", uploaded);

      imageUrl = uploaded?.url || null;
      imageKey = uploaded?.key || null;
    }

    // =======================================================
    // CHECK CHANGES
    // =======================================================
    const nextLatitude =
      latitude !== undefined
        ? Number(latitude)
        : Number(existing.latitude);

    const nextLongitude =
      longitude !== undefined
        ? Number(longitude)
        : Number(existing.longitude);

    const nextShortDescription =
      shortDescription !== undefined
        ? shortDescription || null
        : existing.shortDescription;

    const nextDescription =
      description !== undefined
        ? description || null
        : existing.description;

    const isSame =
      nextName === existing.name &&
      nextLocation === existing.location &&
      nextLatitude === Number(existing.latitude) &&
      nextLongitude === Number(existing.longitude) &&
      nextShortDescription === existing.shortDescription &&
      nextDescription === existing.description &&
      imageUrl === existing.imageUrl &&
      imageKey === existing.imageKey;

    if (isSame) {
      throw ApiError.badRequest("Already updated");
    }

    // =======================================================
    // UPDATE DATABASE
    // =======================================================
    const updatedPlace = await prisma.place.update({
      where: {
        id,
      },
      data: {
        name: nextName,
        location: nextLocation,
        latitude: nextLatitude,
        longitude: nextLongitude,
        shortDescription: nextShortDescription,
        description: nextDescription,
        imageUrl,
        imageKey,
      },
    });

    // =======================================================
    // DELETE OLD S3 IMAGE
    // =======================================================
    if (
      file &&
      existing.imageKey &&
      existing.imageKey !== imageKey
    ) {
      try {
        await deleteByKey(existing.imageKey);
      } catch (error) {
        console.error(
          "Failed to delete old place image:",
          error
        );
      }
    }

    return updatedPlace;
  }

  // =========================================================
  // DELETE PLACE
  // =========================================================
  static async deletePlace(id) {
    const existing = await prisma.place.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw ApiError.notFound("Place not found");
    }

    // Delete image from S3
    if (existing.imageKey) {
      try {
        await deleteByKey(existing.imageKey);
      } catch (error) {
        console.error(
          "Failed to delete place image:",
          error
        );
      }
    }

    await prisma.place.delete({
      where: {
        id,
      },
    });

    return true;
  }
}

export default PlaceService;