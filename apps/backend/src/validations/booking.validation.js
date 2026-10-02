import { z } from "zod";

class BookingValidation {
  static get createBooking() {
    return z.object({
      placeId: z.string().uuid(),
      slotDateTime: z.string(),

      bookingType: z.enum(["TICKET", "PASS"]).optional(),

      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(10),

      tickets: z.array(
        z.object({
          typeId: z.string().uuid(),
          quantity: z.number().min(1),
        })
      ),
    });
  }

  static get paymentSuccess() {
    return z.object({
      txnid: z.string(),
      easepayid: z.string(),
      status: z.string(),
      hash: z.string(),
    });
  }

  static get paymentFailure() {
    return z.object({
      txnid: z.string().min(5),
    });
  }
}

export default BookingValidation;
