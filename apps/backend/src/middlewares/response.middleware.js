import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const responseHandler = (req, res, next) => {
  // SUCCESS HANDLER
  res.success = (data = null, message = "Success", statusCode = 200) => {
    const response = ApiResponse.success(data, message, statusCode);
    return res.status(statusCode).json(response.toJSON());
  };

  // ERROR HANDLER
  res.error = (error) => {
    let err = error;

    if (!(err instanceof ApiError)) {
      err = ApiError.internal(err.message);
    }

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      statusCode: err.statusCode,
    });
  };

  next();
};
