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

export default function SlotOverrideTable({
  data = [],
  loading,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");

  // 🔥 optimize filtering
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.startTime?.toLowerCase().includes(search.toLowerCase()) ||
      item.date?.includes(search)
    );
  }, [data, search]);

  const columns = ["Date", "Start Time", "Capacity", "Status", "Action"];
  

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <TableShell
        title="Slot Overrides"
        searchProps={{
          value: search,
          onChange: (e) => setSearch(e.target.value),
          onClear: () => setSearch(""),
          placeholder: "Search by date or time...",
        }}
      >
        <TableHead columns={columns} />

        <TableBody>
          {loading ? (
            <TableLoader />
          ) : filteredData.length === 0 ? (
            <TableEmpty message="No overrides found" />
          ) : (
            filteredData.map((item) => (
              <TableRow
                key={item.id}
                renderActions={() => (
                  <ActionMenu
                    items={[
                      {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => onEdit?.(item),
                      },
                      {
                        label: "Delete",
                        icon: Trash,
                        danger: true,
                        onClick: () => onDelete?.(item),
                      },
                    ]}
                  />
                )}
              >
                {/* Date */}
                <td className="px-5 py-3 font-medium text-gray-800">
                  {new Date(item.date).toLocaleDateString()}
                </td>

                {/* Start Time */}
                <td className="px-5 py-3 text-gray-600">
                  {item.startTime}
                </td>

                {/* Capacity */}
                <td className="px-5 py-3 text-gray-500">
                  {item.capacity ?? "-"}
                </td>

                {/* Status */}
                <td className="px-5 py-3">
                  {item.isClosed ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
                      Closed
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                      Open
                    </span>
                  )}
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </TableShell>
    </div>
  );
}