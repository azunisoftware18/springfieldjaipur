import { z } from "zod";

class AuthValidation {
  static get login() {
    return z.object({
      identifier: z.string().min(3, "Email Or phone required"),
      password: z.string().min(6, "Password minimum 6 characters"),
    });
  }

  // 🔥 UPDATE PROFILE
  static get updateProfile() {
    return z.object({
      fullName: z.string().min(2).optional(),
      email: z.string().email().optional(),
      phone: z.string().min(10).optional(),
    });
  }

  // 🔥 UPDATE PASSWORD
  static get updatePassword() {
    return z.object({
      oldPassword: z.string().min(6),
      newPassword: z.string().min(6),
    });
  }
}

export default AuthValidation;