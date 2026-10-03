// import BookingService from "../services/booking.service.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// class BookingController {
//   static create = async (req, res) => {
//     const data = await BookingService.createBooking(req.body, req.user);

//     return res.status(200).json(ApiResponse.success(data, "Booking initiated"));
//   };

//   static success = async (req, res) => {
//     const data = await BookingService.paymentSuccess(req.body);

//     return res.redirect(
//       `${process.env.FRONTEND_URL}/payment-success?bookingId=${data.id}`
//     );
//   };

//   static failure = async (req, res) => {
//     await BookingService.paymentFailure(req.body);

//     return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
//   };

//   static getAll = async (req, res) => {
//     const data = await BookingService.getAllBookings();

//     return res.json(ApiResponse.success(data, "Bookings fetched"));
//   };

//   static getById = async (req, res) => {
//     const id = req.params.id.trim();

//     const data = await BookingService.getBookingById(id);

//     return res.json(ApiResponse.success(data, "Booking fetched"));
//   };

//   static async cancelBooking(req, res) {
//     const { id } = req.params;

//     await BookingService.cancelBooking(id, req.user);
//     return res.json(ApiResponse.success(null, "Booking cancelled"));
//   }
// }

// export default BookingController;

import BookingService from "../services/booking.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

class BookingController {
  // ============================================================
  // CREATE BOOKING
  // ============================================================
  static create = async (req, res) => {
    const data = await BookingService.createBooking(req.body, req.user);

    // Cash Booking
    if (data.isCashBooking) {
      return res.status(201).json(
        ApiResponse.success(
          {
            bookingId: data.booking.id,
            paymentMethod: data.booking.paymentMethod,
            status: data.booking.status,
            ticketPdfUrl: data.booking.ticketPdfUrl,
            payment: null,
          },
          "Cash booking successful"
        )
      );
    }

    // UPI / Online Booking
    return res.status(200).json(
      ApiResponse.success(
        {
          bookingId: data.booking.id,
          paymentMethod: data.booking.paymentMethod,
          status: data.booking.status,
          payment: data.payment,
        },
        "Booking initiated"
      )
    );
  };

  // ============================================================
  // PAYMENT SUCCESS
  // ============================================================
  static success = async (req, res) => {
    const data = await BookingService.paymentSuccess(req.body);

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-success?bookingId=${data.id}`
    );
  };

  // ============================================================
  // PAYMENT FAILURE
  // ============================================================
  static failure = async (req, res) => {
    await BookingService.paymentFailure(req.body);

    return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  };

  // ============================================================
  // GET ALL BOOKINGS
  // ============================================================
  static getAll = async (req, res) => {
    const data = await BookingService.getAllBookings();

    return res.json(ApiResponse.success(data, "Bookings fetched"));
  };

  // ============================================================
  // GET BOOKING BY ID
  // ============================================================
  static getById = async (req, res) => {
    const id = req.params.id.trim();

    const data = await BookingService.getBookingById(id);

    return res.json(ApiResponse.success(data, "Booking fetched"));
  };

  // ============================================================
  // CANCEL BOOKING
  // ============================================================
  static cancelBooking = async (req, res) => {
    const { id } = req.params;

    await BookingService.cancelBooking(id, req.user);

    return res.json(ApiResponse.success(null, "Booking cancelled"));
  };
}

export default BookingController;