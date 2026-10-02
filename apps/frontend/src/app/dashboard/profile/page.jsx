"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useUpdatePassword, useUpdateProfile } from "@/lib/mutations/useLogin";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

export default function ProfileSettingsPage() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  // 🔥 PROFILE FORM
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // 🔥 PASSWORD FORM
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI States
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Confirmation Dialog States
  const [showProfileConfirm, setShowProfileConfirm] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [pendingProfileData, setPendingProfileData] = useState(null);
  const [pendingPasswordData, setPendingPasswordData] = useState(null);

  const {
    mutateAsync: updateProfile,
    isPending: profileLoading,
  } = useUpdateProfile();

  const {
    mutateAsync: updatePassword,
    isPending: passwordLoading,
  } = useUpdatePassword();

  // 🔥 PREFILL
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Validation
  const validateProfile = () => {
    const newErrors = {};
    if (!profileForm.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!profileForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!profileForm.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(profileForm.phone)) {
      newErrors.phone = "Phone number is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordForm.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 PROFILE SUBMIT HANDLER
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    
    // Store pending data and show confirmation
    setPendingProfileData(profileForm);
    setShowProfileConfirm(true);
  };

  const confirmProfileUpdate = async () => {
    if (!pendingProfileData) return;
    
    try {
      await updateProfile(pendingProfileData);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
      setShowProfileConfirm(false);
      setPendingProfileData(null);
    } catch (err) {
      setErrors({
        submit: err?.response?.data?.message || "Profile update failed",
      });
      setTimeout(() => setErrors({}), 3000);
    }
  };

  // 🔥 PASSWORD SUBMIT HANDLER
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    
    // Store pending data and show confirmation
    setPendingPasswordData({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    });
    setShowPasswordConfirm(true);
  };

  const confirmPasswordUpdate = async () => {
    if (!pendingPasswordData) return;
    
    try {
      await updatePassword(pendingPasswordData);
      setPasswordSuccess(true);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordSuccess(false), 3000);
      setShowPasswordConfirm(false);
      setPendingPasswordData(null);
    } catch (err) {
      setErrors({
        passwordSubmit: err?.response?.data?.message || "Password update failed",
      });
      setTimeout(() => setErrors({}), 3000);
    }
  };

  // Check if profile has changes
  const hasProfileChanges = () => {
    return (
      profileForm.fullName !== (user?.fullName || "") ||
      profileForm.email !== (user?.email || "") ||
      profileForm.phone !== (user?.phone || "")
    );
  };

  return (
    <div className=" bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full mx-auto">
        {/* BACK BUTTON & HEADER */}
        <div className="mb-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 mb-4 text-slate-600 hover:text-slate-900 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </motion.button>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
          >
            Profile Settings
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-2"
          >
            Manage your account information and password
          </motion.p>
        </div>

        {/* User Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-black to-black rounded-3xl p-6 mb-8 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user?.fullName || "User"}</h2>
              <p className="text-blue-100 mt-1">{user?.email}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
              <Shield size={14} />
              <span className="text-sm font-medium">{user?.role || "User"}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PROFILE CARD */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg">
                  <User className="text-white" size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Profile Information
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Update your personal details
                  </p>
                </div>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {profileSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700"
                  >
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-medium">Profile updated successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <InputField
                  label="Full Name"
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, fullName: e.target.value })
                  }
                  icon={User}
                  error={errors.fullName}
                  placeholder="Enter full name"
                />

                <InputField
                  label="Email Address"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  icon={Mail}
                  error={errors.email}
                  placeholder="Enter email"
                />

                <InputField
                  label="Phone Number"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  icon={Phone}
                  error={errors.phone}
                  placeholder="Enter phone number"
                />

                <Button
                  type="submit"
                  text={profileLoading ? "Updating..." : "Update Profile"}
                  icon={Save}
                  iconPosition="left"
                  className="w-full"
                  disabled={profileLoading || !hasProfileChanges()}
                />
              </form>
            </div>
          </motion.div>

          {/* PASSWORD CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg">
                  <Lock className="text-white" size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Change Password
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Keep your account secure
                  </p>
                </div>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {passwordSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700"
                  >
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-medium">Password updated successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* Old Password */}
                <div className="relative">
                  <InputField
                    label="Current Password"
                    type={showOldPassword ? "text" : "password"}
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                    }
                    icon={Lock}
                    error={errors.oldPassword}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* New Password */}
                <div className="relative">
                  <InputField
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    icon={Lock}
                    error={errors.newPassword}
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <InputField
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    icon={Lock}
                    error={errors.confirmPassword}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {passwordForm.newPassword && (
                  <div className="space-y-1">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordForm.newPassword.length < 6 ? "w-1/3 bg-red-500" :
                          passwordForm.newPassword.length < 10 ? "w-2/3 bg-yellow-500" :
                          "w-full bg-green-500"
                        }`}
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      {passwordForm.newPassword.length < 6 ? "Weak password" :
                       passwordForm.newPassword.length < 10 ? "Medium password" :
                       "Strong password"}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  text={passwordLoading ? "Updating..." : "Update Password"}
                  icon={Lock}
                  iconPosition="left"
                  className="w-full"
                  disabled={passwordLoading || !passwordForm.oldPassword || !passwordForm.newPassword}
                />
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Profile Update Confirmation Dialog */}
      <ConfirmationDialog
        open={showProfileConfirm}
        title="Update Profile?"
        description="Are you sure you want to update your profile information?"
        confirmText="Yes, Update Profile"
        cancelText="Cancel"
        onConfirm={confirmProfileUpdate}
        onCancel={() => {
          setShowProfileConfirm(false);
          setPendingProfileData(null);
        }}
        loading={profileLoading}
        variant="info"
        icon={Shield}
      >
        <div className="space-y-1">
          <p><strong>Name:</strong> {pendingProfileData?.fullName}</p>
          <p><strong>Email:</strong> {pendingProfileData?.email}</p>
          <p><strong>Phone:</strong> {pendingProfileData?.phone}</p>
        </div>
      </ConfirmationDialog>

      {/* Password Update Confirmation Dialog */}
      <ConfirmationDialog
        open={showPasswordConfirm}
        title="Change Password?"
        description="Are you sure you want to change your password? You'll need to use the new password for future logins."
        confirmText="Yes, Change Password"
        cancelText="Cancel"
        onConfirm={confirmPasswordUpdate}
        onCancel={() => {
          setShowPasswordConfirm(false);
          setPendingPasswordData(null);
        }}
        loading={passwordLoading}
        variant="danger"
        icon={AlertTriangle}
        showRemark={true}
      >
        <p>Make sure to remember your new password. You won't be able to recover it if forgotten.</p>
      </ConfirmationDialog>
    </div>
  );
}