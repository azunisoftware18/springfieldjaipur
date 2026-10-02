import TicketService from "../services/ticket.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

class TicketController {
  static async getAll(req, res) {
    const tickets = await TicketService.getAllTickets();

    return res.status(200).json({
      success: true,
      message: "Tickets fetched successfully",
      data: tickets,
    });
  }
  static async download(req, res) {
    const { bookingId } = req.params;

    const pdfBuffer = await TicketService.generatePDF(bookingId);

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ticket-${bookingId}.pdf`
    );

    res.send(pdfBuffer);
  }
  static async scanTicket(req, res) {
    const data = await TicketService.scanTicket(req.body);

    return res.json(ApiResponse.success(data, "Ticket scanned successfully"));
  }
}

export default TicketController;
