import { z } from "zod";

class PlaceValidation {
  static get create() {
    return z.object({
      name: z.string().min(2, "Name required"),
      location: z.string().min(2, "Location required"),
      shortDescription: z.string().min(10).optional(),
      description: z.string().min(10).optional(),
      // latitude: z.number().min(-90).max(90),
      // longitude: z.number().min(-180).max(180),
      latitude: z
        .coerce
        .number()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90"),

      longitude: z
        .coerce
        .number()
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180"),
      image: z.string().url("Invalid image URL").optional(),
    });
  }

  static get update() {
    return z.object({
      name: z.string().min(2).optional(),
      location: z.string().min(2, "Location required").optional(),
      shortDescription: z.string().min(10).optional(),
      description: z.string().min(10).optional(),
      // latitude: z.number().min(-90).max(90).optional(),
      // longitude: z.number().min(-180).max(180).optional(),
      latitude: z
        .coerce
        .number()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90"),

      longitude: z
        .coerce
        .number()
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180"),
      image: z.string().url("Invalid image URL").optional(),

    });
  }
}

export default PlaceValidation;
