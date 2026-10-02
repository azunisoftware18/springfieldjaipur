"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Mail, Phone, User, ArrowRight, ShieldCheck } from "lucide-react";
import InputField from "../ui/InputField";
import Button from "../ui/Button";

export default function CustomerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Header Section */}
      <div className="mb-10 space-y-2">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-black">
          Visitor Info
        </h2>
        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
          Please enter your details to receive tickets
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Name Group - Grid for better spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="First Name"
            placeholder="e.g. Sohail"
            icon={User}
            required
            error={errors.firstName?.message}
            {...register("firstName", { required: "First name is required" })}
          />

          <InputField
            label="Last Name"
            placeholder="e.g. Ahmed"
            icon={User}
            required
            error={errors.lastName?.message}
            {...register("lastName", { required: "Last name is required" })}
          />
        </div>

        {/* Email Section */}
        <div className="space-y-2">
          <InputField
            label="Email Address"
            placeholder="your@email.com"
            icon={Mail}
            required
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
          />
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck size={14} className="text-gray-400" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              Tickets will be sent only to this valid ID
            </p>
          </div>
        </div>

        {/* Phone Section */}
        <div className="space-y-2">
          <InputField
            label="Mobile Number"
            placeholder="+91 00000 00000"
            icon={Phone}
            required
            error={errors.mobile?.message}
            {...register("mobile", {
              required: "Mobile number is required",
              minLength: {
                value: 10,
                message: "Enter valid 10-digit number",
              },
            })}
          />
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              For WhatsApp ticket updates
            </p>
          </div>
        </div>

        {/* Submit Button Section */}
        <div className="pt-6">
          <Button
            text="Proceed to Payment"
            icon={ArrowRight}
            type="submit"
            className="w-full h-16 bg-black text-white rounded-2xl text-lg uppercase tracking-widest"
          />

          <p className="text-center mt-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
            Secure 256-bit SSL Encryption
          </p>
        </div>
      </form>
    </div>
  );
}
