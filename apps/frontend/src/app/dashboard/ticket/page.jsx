"use client";

import React, { useState } from "react";
import { Info, Plus } from "lucide-react";

import TicketTypeTable from "@/components/table/TicketTypeTable";
import TicketTypeModal from "@/components/modals/TicketTypeModal";
import Button from "@/components/ui/Button";

import { useHandleTicketType } from "@/lib/mutations/useTicketType";
import { useTicketTypes } from "@/lib/queries/useTicketType";
import { useSelector } from "react-redux";
import StatCard from "@/components/common/StatCard";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

export default function TicketTypePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editData, setEditData] = useState(null);
  const [dialogConfig, setDialogConfig] = useState({
    open: false,
    title: "",
    description: "",
    variant: "success",
  });

  const { mutateAsync: handleTicketType } = useHandleTicketType();
  const currentPlace = useSelector((state) => state.place.currentPlace);

  const placeId = currentPlace?.id;
  const { data: ticketTypes, isLoading } = useTicketTypes(placeId);

  const totalTicketTypes = ticketTypes?.length || 0;

  const totalPrice =
    ticketTypes?.reduce((sum, ticket) => {
      return sum + Number(ticket.price || 0);
    }, 0) || 0;

  const totalBookingLimit =
    ticketTypes?.reduce((sum, ticket) => {
      return sum + Number(ticket.maxPerBooking || 0);
    }, 0) || 0;

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      await handleTicketType({
        action: "delete",

        data: {
          id: deleteItem.id,
          placeId: deleteItem.placeId,
        },
      });

      setDeleteItem(null);
      setDialogConfig({
        open: true,
        title: "Deleted Successfully",
        description: "Ticket type has been deleted successfully.",
        variant: "success",
      });
    } catch (err) {
      setDialogConfig({
  open: true,
  title: "Delete Failed",
  description: err?.message || "Something went wrong.",
  variant: "danger",
});
    }
  };
  // 🔥 SUBMIT
  const handleFormSubmit = async (formData) => {

  try {

    const payload = {
      action: editData ? "update" : "create",

      data: {
        id: editData?.id,

        name: formData.name,

        price: Number(formData.price),

        maxPerBooking: Number(formData.maxPerBooking),

        placeId: currentPlace?.id,
      },
    };

    await handleTicketType(payload);

    setDialogConfig({
      open: true,

      title: editData
        ? "Updated Successfully"
        : "Created Successfully",

      description: editData
        ? "Ticket type updated successfully."
        : "New ticket type created successfully.",

      variant: "success",
    });

    setIsModalOpen(false);
    setEditData(null);

  } catch (err) {

    console.error(err);

    setDialogConfig({
      open: true,

      title: "Operation Failed",

      description:
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong.",

      variant: "danger",
    });
  }
};
  // 🔥 EDIT
  const handleEdit = (ticket) => {
    setEditData(ticket);
    setIsModalOpen(true);
  };

  return (
    <div className=" bg-slate-50 ">
      {/* --- Header Section --- */}
      <div className="w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Ticket Types
          </h1>

          <p className="text-slate-500 font-medium">
            Configure pricing tiers and booking restrictions.
          </p>
        </div>

        <Button
        icon={Plus}
        iconPosition="left"
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          text="Create Ticket Type"
        />
      </div>
      {/* ===================== */}
      {/* STAT CARDS */}
      {/* ===================== */}

      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Ticket Types"
          value={totalTicketTypes}
          percentage={12}
          isUp={true}
          trendingText="Available ticket categories"
          subText="Total configured ticket types"
        />

        <StatCard
          title="Total Pricing"
          value={`₹${totalPrice}`}
          percentage={8}
          isUp={true}
          trendingText="Combined pricing"
          subText="Total ticket pricing value"
        />

        <StatCard
          title="Booking Limit"
          value={totalBookingLimit}
          percentage={5}
          isUp={false}
          trendingText="Max booking capacity"
          subText="Combined per booking limits"
        />
      </div>
      {/* --- Table Container --- */}
      <div className="w-full mx-auto">
        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {/* 🔥 TABLE */}

          <TicketTypeTable
            data={ticketTypes || []}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={(ticket) => setDeleteItem(ticket)}
          />
        </div>
      </div>

      {/* --- Modal --- */}
      <TicketTypeModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleFormSubmit}
        defaultValues={editData}
      />
      <ConfirmationDialog
        open={!!deleteItem}
        title="Delete Ticket Type?"
        description="This action cannot be undone. The selected ticket type will be permanently deleted."
        confirmText="Delete Ticket"
        cancelText="Cancel"
        variant="danger"
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleDelete}
      />
      <ConfirmationDialog
  open={dialogConfig.open}
  title={dialogConfig.title}
  description={dialogConfig.description}
  confirmText="Okay"
  variant={dialogConfig.variant}
  onCancel={() =>
    setDialogConfig((prev) => ({
      ...prev,
      open: false,
    }))
  }
  onConfirm={() =>
    setDialogConfig((prev) => ({
      ...prev,
      open: false,
    }))
  }
  showCancelButton={false}
/>  
    </div>
  );
}
