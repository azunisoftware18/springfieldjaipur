import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  // ZOD ERROR
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // API ERROR
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      statusCode: err.statusCode,
    });
  }

  // UNKNOWN ERROR
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
