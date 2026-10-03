// import jwt from "jsonwebtoken";
// import prisma from "../db/db.js";
// import { ApiError } from "../utils/ApiError.js";
// import { envConfig } from "../config/env.config.js";
// import { log } from "node:console";

// class AuthMiddleware {
//   static isAuthenticated = async (req, res, next) => {
//     try {
//       const token =
//         req.headers["authorization"]?.replace("Bearer ", "") ||
//         req.cookies?.accessToken;

//       if (!token) {
//         throw ApiError.unauthorized("No token provided");
//       }

//       const decoded = jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET);

//       const user = await prisma.user.findUnique({
//         where: { id: decoded.id },
//         select: {
//           id: true,
//           role: true,
//           email: true,
//           phone: true,
//         },
//       });

//       if (!user) {
//         throw ApiError.unauthorized("Invalid token user");
//       }

//       req.user = user;

//       next();
//     } catch (error) {
//       next(error);
//     }
//   };

//   static authorize = (roles = []) => {
//     return (req, res, next) => {
//       if (!req.user) {
//         return next(ApiError.unauthorized("User not authenticated"));
//       }

//       if (!roles.includes(req.user.role)) {
//         return next(ApiError.forbidden("Access denied"));
//       }

//       next();
//     };
//   };
// }

// export default AuthMiddleware;


import jwt from "jsonwebtoken";
import prisma from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";
import { envConfig } from "../config/env.config.js";

class AuthMiddleware {
  /**
   * Required authentication
   * User must be logged in.
   */
  static isAuthenticated = async (req, res, next) => {
    try {
      const token =
        req.headers["authorization"]?.replace("Bearer ", "") ||
        req.cookies?.accessToken;

      if (!token) {
        throw ApiError.unauthorized("No token provided");
      }

      const decoded = jwt.verify(
        token,
        envConfig.ACCESS_TOKEN_SECRET
      );

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
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

  /**
   * Optional authentication
   *
   * Logged-in user:
   *   req.user = user
   *
   * Guest:
   *   req.user = null
   *
   * This is required for booking because:
   * - Guest can use UPI
   * - Logged-in user can use CASH + UPI
   */
  static optionalAuthentication = async (req, res, next) => {
    try {
      const token =
        req.headers["authorization"]?.replace("Bearer ", "") ||
        req.cookies?.accessToken;

      // No token = guest user
      if (!token) {
        req.user = null;
        return next();
      }

      const decoded = jwt.verify(
        token,
        envConfig.ACCESS_TOKEN_SECRET
      );

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          role: true,
          email: true,
          phone: true,
        },
      });

      // Token exists but user doesn't
      if (!user) {
        req.user = null;
        return next();
      }

      req.user = user;

      next();
    } catch (error) {
      // Invalid/expired token is treated as guest
      req.user = null;
      next();
    }
  };

  /**
   * Role authorization
   */
  static authorize = (roles = []) => {
    return (req, res, next) => {
      if (!req.user) {
        return next(
          ApiError.unauthorized("User not authenticated")
        );
      }

      if (!roles.includes(req.user.role)) {
        return next(
          ApiError.forbidden("Access denied")
        );
      }

      next();
    };
  };
}

export default AuthMiddleware;