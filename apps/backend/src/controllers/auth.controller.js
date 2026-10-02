import AuthService from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cookieOptions } from "../utils/jwt.js";

class AuthController {
  static login = async (req, res) => {
    const data = await AuthService.login(req.body);

    const { accessToken, refreshToken } = data;

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
    });

    return res
      .status(200)
      .json(ApiResponse.success(data, "Login successful", 200));
  };

  static getMe = async (req, res) => {
    const data = await AuthService.getCurrentUser(req.user.id);

    return res
      .status(200)
      .json(ApiResponse.success(data, "User fetched successfully", 200));
  };

  static refresh = async (req, res) => {
    const { refreshToken } = req.body;

    const data = await AuthService.refreshToken(refreshToken);

    return res.status(200).json(ApiResponse.success(data, "Token refreshed"));
  };

  static logout = async (req, res) => {
    await AuthService.logout(req.user.id);

    res.clearCookie("accessToken", cookieOptions);

    res.clearCookie("refreshToken", cookieOptions);

    return res
      .status(200)
      .json(ApiResponse.success(null, "Logged out successfully"));
  };
  static updateProfile = async (req, res) => {
    const data = await AuthService.updateProfile(req.user.id, req.body);

    return res
      .status(200)
      .json(ApiResponse.success(data, "Profile updated successfully"));
  };

  static updatePassword = async (req, res) => {
    await AuthService.updatePassword(req.user.id, req.body);

    return res
      .status(200)
      .json(ApiResponse.success(null, "Password updated successfully"));
  };
}

export default AuthController;
