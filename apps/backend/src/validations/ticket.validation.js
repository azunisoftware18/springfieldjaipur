import { z } from "zod";

class TicketValidation {

  static get scanTicket() {
    return z.object({
      qrCode: z.string(),
    });
  }
}

export default TicketValidation;