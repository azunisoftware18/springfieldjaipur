import jwt from "jsonwebtoken";
import prisma from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";
import { envConfig } from "../config/env.config.js";
import { log } from "node:console";

class AuthMiddleware {
  static isAuthenticated = async (req, res, next) => {
    try {
      const token =
        req.headers["authorization"]?.replace("Bearer ", "") ||
        req.cookies?.accessToken;

      if (!token) {
        throw ApiError.unauthorized("No token provided");
      }

      const decoded = jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          role: true,
          email: true,
          phone: true,
        },
      });

      if (!user) {
        throw ApiError.unauthorized("Invalid token user");
      }

      req.user = user;

      next();
    } catch (error) {
      next(error);
    }
  };

  static authorize = (roles = []) => {
    return (req, res, next) => {
      if (!req.user) {
        return next(ApiError.unauthorized("User not authenticated"));
      }

      if (!roles.includes(req.user.role)) {
        return next(ApiError.forbidden("Access denied"));
      }

      next();
    };
  };
}

export default AuthMiddleware;
