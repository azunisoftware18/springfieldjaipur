import TicketTypeService from "../services/ticketType.service.js";

class TicketTypeController {
  static handle = async (req, res) => {
    const data = await TicketTypeService.handle(req.body);
    res.success(data, "Success");
  };
}

export default TicketTypeController;
