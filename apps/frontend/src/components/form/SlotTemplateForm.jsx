"use client";

import { useForm } from "react-hook-form";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useEffect } from "react";

// 🔥 helper function
const formatTime24 = (time) => {
  // already 24h format ho to return
  if (!time?.includes("AM") && !time?.includes("PM")) return time;

  const [t, modifier] = time.split(" ");
  let [hours, minutes] = t.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = String(parseInt(hours, 10) + 12);
  }
  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours.padStart(2, "0")}:${minutes}`;
};

export default function SlotTemplateForm({
  onSubmit,
  defaultValues,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
  defaultValues: {
    startTime: defaultValues?.startTime || "",
    endTime: defaultValues?.endTime || "",
    capacity: defaultValues?.capacity || "",
  },
});

useEffect(() => {
  if (defaultValues) {
    reset({
      startTime: defaultValues.startTime || "",
      endTime: defaultValues.endTime || "",
      capacity: defaultValues.capacity || "",
    });
  }
}, [defaultValues, reset]);

  const submitHandler = async (data) => {
    const payload = {
      ...data,
      startTime: formatTime24(data.startTime),
      endTime: formatTime24(data.endTime),
    };

    console.log("FINAL PAYLOAD:", payload); // ✅ check

    await onSubmit?.(payload);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <InputField
        label="Start Time"
        placeholder="HH:mm (e.g. 14:00)"
        error={errors.startTime?.message}
        {...register("startTime", {
          required: "Start time required",
          pattern: {
            value: /^([01]\d|2[0-3]):([0-5]\d)$/,
            message: "Use 24-hour format (HH:mm)",
          },
        })}
      />

      <InputField
        label="End Time"
        placeholder="HH:mm (e.g. 18:30)"
        error={errors.endTime?.message}
        {...register("endTime", {
          required: "End time required",
          pattern: {
            value: /^([01]\d|2[0-3]):([0-5]\d)$/,
            message: "Use 24-hour format (HH:mm)",
          },
        })}
      />
      <InputField
        label="Capacity"
        type="number"
        error={errors.capacity?.message}
        {...register("capacity", {
          required: "Capacity required",
          valueAsNumber: true,
        })}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          text={isSubmitting ? "Saving..." : "Save Template"}
        />
      </div>
    </form>
  );
}
