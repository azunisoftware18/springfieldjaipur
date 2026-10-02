"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddonTable from "@/components/table/AddonTable";
import Button from "@/components/ui/Button";
import AddonModal from "@/components/modals/AddonModal";
import { useAddons } from "@/lib/queries/useAddon";
import { useHandleAddon } from "@/lib/mutations/useAddon";
import { useSelector } from "react-redux";
import StatCard from "@/components/common/StatCard";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

export default function AddonPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const [dialogConfig, setDialogConfig] = useState({
    open: false,
    title: "",
    description: "",
    variant: "success",
  });

  const currentPlace = useSelector((state) => state.place.currentPlace);
  const placeId = currentPlace?.id;
  
  const { mutateAsync: handleAddon } = useHandleAddon();
  const { data: addons, isLoading } = useAddons(placeId);

  // Stats Logic
  const totalAddons = addons?.length || 0;
  const activeAddons = addons?.filter((addon) => addon.isActive === true).length || 0;

  const handleFormSubmit = async (data) => {
    try {
      const payload = {
        action: editData ? "update" : "create",
        data: {
          ...(editData?.id && { id: editData.id }),
          name: data.name,
          price: Number(data.price),
          isActive: data.isActive,
          placeId,
        },
      };

      await handleAddon(payload);

      setDialogConfig({
        open: true,
        title: editData ? "Updated Successfully" : "Created Successfully",
        description: editData ? "Addon updated successfully." : "New addon created successfully.",
        variant: "success",
      });

      setIsModalOpen(false);
      setEditData(null);
    } catch (err) {
      console.error(err);
      setDialogConfig({
        open: true,
        title: "Operation Failed",
        description: err?.response?.data?.message || err?.message || "Something went wrong.",
        variant: "danger",
      });
    }
  };

  const handleEdit = (addon) => {
    setEditData(addon);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await handleAddon({
        action: "delete",
        data: { id: deleteItem.id, placeId },
      });
      setDeleteItem(null);
      setDialogConfig({
        open: true,
        title: "Deleted Successfully",
        description: "Addon deleted successfully.",
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      setDialogConfig({
        open: true,
        title: "Delete Failed",
        description: err?.response?.data?.message || err?.message || "Something went wrong.",
        variant: "danger",
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* --- Header Section --- */}
      <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Add-ons Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage your place's additional services and rentals.
          </p>
        </div>

        <Button
          text="Create New Add-on"
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          icon={Plus}
          iconPosition="left"
          className="px-6 py-3.5 rounded-2xl   "
        />
      </div>

      {/* --- STAT CARDS --- */}
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          title="Total Add-ons"
          value={totalAddons}
          percentage={12}
          isUp={true}
          trendingText="All available add-ons"
          subText="Total configured services"
        />

        <StatCard
          title="Active Add-ons"
          value={activeAddons}
          percentage={8}
          isUp={true}
          trendingText="Currently enabled"
          subText="Services available for booking"
        />
      </div>

      {/* --- Main Content Table --- */}
      <div className="w-full ">
            <AddonTable
              data={addons || []}
              loading={isLoading}
              onEdit={handleEdit}
              onDelete={(addon) => setDeleteItem(addon)}
            />
      </div>

      {/* Modals & Dialogs */}
      <AddonModal
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
        title="Delete Addon?"
        description="This action cannot be undone. The selected addon will be permanently deleted."
        confirmText="Delete Addon"
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
        onCancel={() => setDialogConfig((prev) => ({ ...prev, open: false }))}
        onConfirm={() => setDialogConfig((prev) => ({ ...prev, open: false }))}
        showCancelButton={false}
      />
    </div>
  );
}