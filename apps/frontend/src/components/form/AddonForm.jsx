"use client";

import { useForm } from "react-hook-form";

import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

import {
  Package,
  IndianRupee,
} from "lucide-react";

export default function AddonForm({
  onSubmit,
  defaultValues = {},
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      isActive: true,
      ...defaultValues,
    },
  });

  const isActive = watch("isActive");

  const submitHandler = async (data) => {
    const formattedData = {
      ...data,
      price: Number(data.price),
    };

    await onSubmit?.(formattedData);

    if (!defaultValues?.id) {
      reset();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl  shadow-sm p-6">

      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {defaultValues?.id
            ? "Update Addon"
            : "Create Addon"}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Configure addon pricing and availability
        </p>
      </div>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="space-y-5"
      >

        {/* Addon Name */}
        <InputField
          label="Addon Name"
          placeholder="e.g. GUIDE / CAMERA / SAFARI"
          icon={Package}
          error={errors.name?.message}
          {...register("name", {
            required: "Addon name is required",
            minLength: {
              value: 2,
              message: "Minimum 2 characters",
            },
          })}
        />

        {/* Price */}
        <InputField
          label="Addon Price"
          type="number"
          placeholder="e.g. 499"
          icon={IndianRupee}
          error={errors.price?.message}
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true,
            min: {
              value: 0,
              message: "Price cannot be negative",
            },
          })}
        />

        {/* Status Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
          
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Active Status
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Enable or disable addon visibility
            </p>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              {...register("isActive")}
            />

            <div
              className="peer h-6 w-11 rounded-full bg-gray-300
              after:absolute after:left-0.5 after:top-0.5
              after:h-5 after:w-5 after:rounded-full
              after:bg-white after:transition-all
              peer-checked:bg-green-500
              peer-checked:after:translate-x-full"
            />
          </label>
        </div>

        {/* Status Preview */}
        <div>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">

          <Button
            type="button"
            text="Reset"
            onClick={() => reset()}
            className="px-6"
          />

          <Button
            type="submit"
            text={
              isSubmitting
                ? "Saving..."
                : defaultValues?.id
                ? "Update Addon"
                : "Create Addon"
            }
            className="px-8"
          />

        </div>

      </form>
    </div>
  );
}