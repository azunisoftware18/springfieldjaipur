"use client";

import {
  TableShell,
  TableHead,
  TableBody,
  TableRow,
  TableEmpty,
  TableLoader,
} from "@/components/table/core";

import ActionMenu from "@/components/common/ActionMenu";
import { Pencil, Trash } from "lucide-react";
import { useState, useMemo } from "react";


export default function SlotTemplateTable({
  data = [],
  loading,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");

  // 🔥 optimized filter
  const filteredSlots = useMemo(() => {
    return data.filter((slot) =>
      slot.startTime?.toLowerCase().includes(search.toLowerCase()) ||
      slot.endTime?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const columns = ["Start Time", "End Time", "Capacity", "Action"];
  const formatTime12Hour = (time) => {

  const [hour, minute] = time.split(":");

  const date = new Date();

  date.setHours(hour);
  date.setMinutes(minute);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <TableShell
        title="Slot Templates"
        searchProps={{
          value: search,
          onChange: (e) => setSearch(e.target.value),
          onClear: () => setSearch(""),
          placeholder: "Search slots...",
        }}
      >
        <TableHead columns={columns} />

        <TableBody>
          {loading ? (
            <TableLoader />
          ) : filteredSlots.length === 0 ? (
            <TableEmpty message="No slots found" />
          ) : (
            filteredSlots.map((slot) => (
              <TableRow
                key={slot.id}
                renderActions={() => (
                  <ActionMenu
                    items={[
                      {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => onEdit?.(slot),
                      },
                      {
                        label: "Delete",
                        icon: Trash,
                        danger: true,
                        onClick: () => onDelete?.(slot),
                      },
                    ]}
                  />
                )}
              >
                {/* Start Time */}
                <td className="px-5 py-3 font-medium text-gray-800">
                  {formatTime12Hour(slot.startTime)}
                </td>

                {/* End Time */}
                <td className="px-5 py-3 text-gray-600">
                  {formatTime12Hour(slot.endTime)}
                </td>

                {/* Capacity */}
                <td className="px-5 py-3 text-gray-500">
                  {slot.capacity}
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </TableShell>
    </div>
  );
}