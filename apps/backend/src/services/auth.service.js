import prisma from "../db/db.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

class AuthService {
  static async login({ identifier, password }) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  static async getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user;
  }

  static async refreshToken(oldRefreshToken) {
    if (!oldRefreshToken) {
      throw ApiError.unauthorized("Refresh token required");
    }

    let decoded;
    try {
      decoded = jwt.verify(oldRefreshToken, envConfig.REFRESH_TOKEN_SECRET);
    } catch (err) {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.refreshToken !== oldRefreshToken) {
      throw ApiError.unauthorized("Refresh token mismatch");
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // rotate token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return true;
  }
  // 🔥 UPDATE PROFILE
static async updateProfile(userId, payload) {

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
    },

    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  return updatedUser;
}

// 🔥 UPDATE PASSWORD
static async updatePassword(userId, payload) {

  const { oldPassword, newPassword } = payload;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const isMatch = await bcrypt.compare(
    oldPassword,
    user.password
  );

  if (!isMatch) {
    throw ApiError.badRequest("Old password incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      password: hashedPassword,
    },
  });

  return true;
}
}

export default AuthService;
