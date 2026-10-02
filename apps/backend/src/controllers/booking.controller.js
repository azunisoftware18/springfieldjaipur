import BookingService from "../services/booking.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

class BookingController {
  static create = async (req, res) => {
    const data = await BookingService.createBooking(req.body, req.user);

    return res.status(200).json(ApiResponse.success(data, "Booking initiated"));
  };

  static success = async (req, res) => {
    const data = await BookingService.paymentSuccess(req.body);

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-success?bookingId=${data.id}`
    );
  };

  static failure = async (req, res) => {
    await BookingService.paymentFailure(req.body);

    return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  };

  static getAll = async (req, res) => {
    const data = await BookingService.getAllBookings();

    return res.json(ApiResponse.success(data, "Bookings fetched"));
  };

  static getById = async (req, res) => {
    const id = req.params.id.trim();

    const data = await BookingService.getBookingById(id);

    return res.json(ApiResponse.success(data, "Booking fetched"));
  };

  static async cancelBooking(req, res) {
    const { id } = req.params;

    await BookingService.cancelBooking(id, req.user);
    return res.json(ApiResponse.success(null, "Booking cancelled"));
  }
}

export default BookingController;
