"use client";

import { useForm } from "react-hook-form";

import { Ticket, IndianRupee, Hash } from "lucide-react";
import InputField from "../ui/InputField";
import Button from "../ui/Button";

export default function TicketTypeForm({ onSubmit, defaultValues = {} }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      maxPerBooking: 6,
      ...defaultValues,
    },
  });

  const submitHandler = async (data) => {
    const formattedData = {
      ...data,
      price: Number(data.price),
      maxPerBooking: Number(data.maxPerBooking),
    };

    await onSubmit?.(formattedData);

    if (!defaultValues?.id) {
      reset();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl p-6 shadow-sm ">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {defaultValues?.id ? "Update Ticket Type" : "Create Ticket Type"}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Configure ticket pricing and booking limits
        </p>
      </div>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        {/* Ticket Name */}
        <InputField
          label="Ticket Name"
          placeholder="e.g. Adult / Child / VIP"
          icon={Ticket}
          error={errors.name?.message}
          {...register("name", {
            required: "Ticket name is required",
            minLength: {
              value: 2,
              message: "Minimum 2 characters",
            },
          })}
        />

        {/* Price */}
        <InputField
          label="Ticket Price"
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

        {/* Max Per Booking */}
        <InputField
          label="Max Per Booking"
          type="number"
          placeholder="e.g. 6"
          icon={Hash}
          error={errors.maxPerBooking?.message}
          {...register("maxPerBooking", {
            required: "Max booking limit required",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "Minimum 1 ticket required",
            },
          })}
        />

        {/* Actions */}
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
                  ? "Update Ticket Type"
                  : "Create Ticket Type"
            }
            className="px-8"
          />
        </div>
      </form>
    </div>
  );
}
