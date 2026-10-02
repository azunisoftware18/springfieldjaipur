"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  PlusIcon,
} from "lucide-react";
import PlaceTable from "@/components/table/PlaceTable";
import AddPlaceModal from "@/components/modals/AddPlaceModal";
import { usePlaces } from "@/lib/queries/usePlace";
import {
  useCreatePlace,
  useDeletePlace,
  useUpdatePlace,
} from "@/lib/mutations/usePlace";
import Button from "@/components/ui/Button";

export default function PlacePage() {
  const { data: places, isLoading } = usePlaces();
  const { mutateAsync: createPlace } = useCreatePlace();
  const { mutateAsync: deletePlace } = useDeletePlace();
  const { mutateAsync: updatePlace } = useUpdatePlace();
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => setAlert({ ...alert, show: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  // const handleFormSubmit = async (formData) => {
  //   try {
  //     const payload = {
  //       name: formData.name.trim(), // Trim whitespace
  //       location: formData.location.trim(),
  //       latitude: Number(formData.latitude),
  //       longitude: Number(formData.longitude),
  //       shortDescription: formData.shortDescription,
  //       description: formData.description,
  //     };

  //     // 🔥 ENHANCED DUPLICATE CHECK
  //     const isDuplicate = places?.some((p) => {
  //       // Name aur Location dono ko lowercase mein check karein taaki "Jaipur" aur "jaipur" same mane jayein
  //       const nameMatch = p.name.toLowerCase() === payload.name.toLowerCase();
  //       const locationMatch =
  //         p.location.toLowerCase() === payload.location.toLowerCase();

  //       // Agar Edit kar rahe hain to khud ko ignore karein
  //       const isNotCurrentItem = p.id !== editData?.id;

  //       return nameMatch && locationMatch && isNotCurrentItem;
  //     });

  //     if (isDuplicate) {
  //       setAlert({
  //         show: true,
  //         message: `Oops! "${payload.name}" already exists in "${payload.location}".`,
  //         type: "error",
  //       });
  //       return; // Code yahan ruk jayega, aage create nahi hoga
  //     }

  //     // Agar duplicate nahi hai, tabhi aage badhega
  //     if (editData) {
  //       await updatePlace({
  //         id: editData.id,
  //         payload,
  //       });
  //     } else {
  //       await createPlace(payload);
  //     }

  //     setEditData(null);
  //     setIsModalOpen(false);

  //     setAlert({
  //       show: true,
  //       message: editData
  //         ? "Place updated successfully!"
  //         : "Place created successfully!",
  //       type: "success",
  //     });
  //   } catch (err) {
  //     setAlert({
  //       show: true,
  //       message: "Something went wrong",
  //       type: "error",
  //     });
  //   }
  // };

  const handleFormSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        shortDescription: formData.shortDescription || "",
        description: formData.description || "",
        image: formData.image || null,
      };

      // Duplicate check
      const isDuplicate = places?.some((p) => {
        const nameMatch = p.name?.toLowerCase() === payload.name.toLowerCase();

        const locationMatch =
          p.location?.toLowerCase() === payload.location.toLowerCase();

        // Edit ke time current place ko ignore karo
        const isNotCurrentItem = p.id !== editData?.id;

        return nameMatch && locationMatch && isNotCurrentItem;
      });

      if (isDuplicate) {
        setAlert({
          show: true,
          message: `Oops! "${payload.name}" already exists in "${payload.location}".`,
          type: "error",
        });

        return;
      }

      // ==============================
      // UPDATE
      // ==============================
      if (editData) {
        await updatePlace({
          id: editData.id,
          payload,
        });
      }

      // ==============================
      // CREATE
      // ==============================
      else {
        await createPlace(payload);
      }

      setEditData(null);
      setIsModalOpen(false);

      setAlert({
        show: true,
        message: editData
          ? "Place updated successfully!"
          : "Place created successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Place submit error:", err);

      setAlert({
        show: true,
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong",
        type: "error",
      });
    }
  };

  const handleDelete = async (place) => {
    if (!confirm("Delete this place?")) return;

    try {
      await deletePlace(place.id);

      setAlert({
        show: true,
        message: "Place deleted successfully!",
        type: "success",
      });
    } catch {
      setAlert({
        show: true,
        message: "Delete failed!",
        type: "error",
      });
    }
  };

  const handleEdit = (place) => {
    setEditData(place);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
      {/* --- INLINE ALERT MESSAGE --- */}
      {alert.show && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-10000 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-top duration-300 ${
            alert.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-bold text-sm">{alert.message}</span>
        </div>
      )}

      <div className="w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Tourist Destinations
          </h1>
          <p className="text-slate-500 font-medium">Manage your locations</p>
        </div>

        {/* {(!places || places.length === 0) && (
          <Button
            icon={PlusIcon}
            iconPosition="left"
            onClick={() => setIsModalOpen(true)}
            text="Add New Place"
          />
        )} */}

        <Button
          icon={PlusIcon}
          iconPosition="left"
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          text="Add New Place"
        />
      </div>

      <div className="w-full mx-auto bg-white border border-slate-200 rounded-xl shadow-sm">
        <PlaceTable
          data={places}
          loading={isLoading}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      <AddPlaceModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null); // 🔥 reset
        }}
        onSubmit={handleFormSubmit}
        defaultValues={editData}
      />
    </div>
  );
}
