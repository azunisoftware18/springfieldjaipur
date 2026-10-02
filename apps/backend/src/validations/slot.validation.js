import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
class SlotValidation {
  static get createSlot() {
    return z.object({
      placeId: z.string().uuid(),
      startTime: z.string().regex(timeRegex, "Invalid time format (HH:mm)"),
      endTime: z.string().regex(timeRegex, "Invalid time format (HH:mm)"),
      capacity: z.number().min(1),
    });
  }

  static get updateSlot() {
    return z.object({
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      capacity: z.number().min(1).optional(),
    });
  }
}

export default SlotValidation;
