import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    envConfig.ACCESS_TOKEN_SECRET,
    { expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN || "1d" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, envConfig.REFRESH_TOKEN_SECRET, {
    expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN || "7d",
  });
};

const isProduction = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};
