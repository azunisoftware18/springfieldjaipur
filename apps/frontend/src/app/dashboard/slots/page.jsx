"use client";

import { useState } from "react";
import { Calendar, Layers, Plus, Clock } from "lucide-react";
import SlotTemplateTable from "@/components/table/SlotTemplateTable";
import SlotOverrideTable from "@/components/table/SlotOverrideTable";
import SlotTemplateModal from "@/components/modals/SlotTemplateModal";
import SlotOverrideModal from "@/components/modals/SlotOverrideModal";
import {
  useCreateSlotTemplate,
  useDeleteSlotTemplate,
  useOverrideSlot,
  useUpdateSlotTemplate,
} from "@/lib/mutations/useSlot";
import {
  useOverrides,
  useSlots,
  useSlotTemplates,
} from "@/lib/queries/useSlot";
import Button from "@/components/ui/Button";
import { useSelector } from "react-redux";
import StatCard from "@/components/common/StatCard";

export default function SlotPage() {
  const [activeTab, setActiveTab] = useState("template");
  const [isOpen, setIsOpen] = useState(false);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const currentPlace = useSelector((state) => state.place.currentPlace);

  const placeId = currentPlace?.id;
  const date = new Date().toISOString().split("T")[0];
  const [editData, setEditData] = useState(null);
  const { mutateAsync: deleteTemplate } = useDeleteSlotTemplate();
  const { mutateAsync: createTemplate } = useCreateSlotTemplate();
  const { mutateAsync: updateTemplate } = useUpdateSlotTemplate();
  const { mutateAsync: createOverride } = useOverrideSlot();
  const { data: templates, isLoading: templateLoading } =
    useSlotTemplates(placeId);

  const { data: overrides, isLoading: overrideLoading } = useOverrides({
    placeId,
    date,
  });

  const { data: slots } = useSlots({
    placeId,
    date,
  });

  const totalSlots = slots?.length || 0;

  const totalOverrides = overrides?.length || 0;

  const closedSlots =
    overrides?.filter((slot) => slot.isClosed === true).length || 0;

  const handleTemplateEdit = (slot) => {
    setEditData(slot);
    setIsOpen(true);
  };

  const handleTemplateDelete = async (slot) => {
    if (!confirm("Delete this template?")) return;

    try {
      await deleteTemplate({
        id: slot.id,
        placeId,
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handleFormSubmit = async (data) => {
    if (editData) {
      await updateTemplate({
        id: editData.id,
        payload: {
          ...data,
          placeId,
        },
      });
    } else {
      await createTemplate({
        ...data,
        placeId,
      });
    }

    setEditData(null);
    setIsOpen(false);
  };
  const handleOverrideSubmit = async (data) => {
    await createOverride({
      ...data,
      placeId,
    });

    setIsOverrideOpen(false);
  };

  return (
    <div className=" bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Slot Management
        </h1>

        <p className="text-slate-500 font-medium">
          Manage your weekly schedules and exceptions.
        </p>
      </div>

      {/* ===================== */}
      {/* STAT CARDS */}
      {/* ===================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Slots"
          value={totalSlots}
          percentage={12}
          isUp={true}
          trendingText="All active slots"
          subText="Current available slot count"
        />

        <StatCard
          title="Override Slots"
          value={totalOverrides}
          percentage={8}
          isUp={true}
          trendingText="Manual overrides"
          subText="Custom updated slots"
        />

        <StatCard
          title="Closed Slots"
          value={closedSlots}
          percentage={5}
          isUp={false}
          trendingText="Unavailable slots"
          subText="Currently closed slots"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/40 gap-4">
          <div className="flex gap-2 p-1.5 bg-slate-200/60 rounded-3xl">
            <TabButton
              active={activeTab === "template"}
              onClick={() => setActiveTab("template")}
              icon={<Layers size={18} />}
              label="Templates"
            />
            <TabButton
              active={activeTab === "override"}
              onClick={() => setActiveTab("override")}
              icon={<Calendar size={18} />}
              label="Overrides"
            />
          </div>

          <Button
            text={activeTab === "template" ? "Create Template" : "Add Override"}
            icon={Plus}
            iconPosition="left"
            variant="primary"
            onClick={() =>
              activeTab === "template"
                ? setIsOpen(true)
                : setIsOverrideOpen(true)
            }
            className="shadow-sm"
          />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === "template" ? (
            <div className="space-y-6">
              <SlotTemplateTable
                data={templates || []}
                loading={templateLoading}
                onEdit={handleTemplateEdit}
                onDelete={handleTemplateDelete}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <SlotOverrideTable
                data={overrides || []}
                loading={overrideLoading}
              />
            </div>
          )}
        </div>
      </div>

      <SlotTemplateModal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditData(null);
        }}
        onSubmit={handleFormSubmit}
        defaultValues={editData}
      />
      <SlotOverrideModal
        open={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        onSubmit={handleOverrideSubmit}
      />
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
        active
          ? "bg-white text-gray-600 shadow-sm"
          : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
