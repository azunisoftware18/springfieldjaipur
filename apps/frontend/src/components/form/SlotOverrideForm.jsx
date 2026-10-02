"use client";

import { useForm } from "react-hook-form";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useSelector } from "react-redux";
import { useSlotTemplates } from "@/lib/queries/useSlot";

export default function SlotOverrideForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const currentPlace = useSelector(
  (state) => state.place.currentPlace
);

const placeId = currentPlace?.id;

const { data: slots = [] } = useSlotTemplates(placeId);

  const isClosed = watch("isClosed");

  const submitHandler = async (data) => {
    await onSubmit?.(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

      {/* Date */}
      <InputField
        label="Date"
        type="date"
        error={errors.date?.message}
        {...register("date", { required: "Date required" })}
      />

      {/* 🔥 Start Time (24-hour only) */}
      <div>
  <label className="block text-sm font-medium mb-2">
    Select Slot
  </label>

  <select
    className="w-full border rounded-lg px-3 py-2"
    {...register("startTime", {
      required: "Start time required",
    })}
  >
    <option value="">Select Slot</option>

    {slots.map((slot) => (
      <option
        key={slot.id}
        value={slot.startTime}
      >
        {slot.startTime}
      </option>
    ))}
  </select>

  {errors.startTime && (
    <p className="text-red-500 text-sm mt-1">
      {errors.startTime.message}
    </p>
  )}
</div>

      {/* Capacity */}
      {!isClosed && (
        <InputField
          label="Override Capacity"
          type="number"
          error={errors.capacity?.message}
          {...register("capacity", {
            valueAsNumber: true,
          })}
        />
      )}

      {/* Close Toggle */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("isClosed")} />
        <label className="text-sm text-gray-700">
          Mark slot as Closed
        </label>
      </div>

      {/* Button */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          text={isSubmitting ? "Saving..." : "Save Override"}
        />
      </div>

    </form>
  );
}