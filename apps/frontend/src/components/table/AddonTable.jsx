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
import { useState, useMemo, useEffect } from "react";

export default function AddonTable({
  data = [],
  loading = false,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // ✅ Ek page par kitne items dikhane hain

  const filteredAddons = useMemo(() => {
    return data.filter((addon) =>
      addon.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredAddons.length / itemsPerPage) || 1;

  const currentData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredAddons.slice(start, start + itemsPerPage);
  }, [filteredAddons, page]);

  // Search badalne par page 1 par reset karein
  useEffect(() => {
    setPage(1);
  }, [search]);

  const columns = ["Addon Name", "Price", "Status", "Created At", "Actions"];

  return (
    <div className="p-6">
      <TableShell
        title="Place Addons"
        subtitle={`${filteredAddons.length} total addons found`}
        searchProps={{
          value: search,
          onChange: (e) => setSearch(e.target.value),
          onClear: () => setSearch(""),
          placeholder: "Search addons...",
        }}
        paginationProps={{
          page,
          totalPages: totalPages,
          onNext: () => setPage((p) => Math.min(p + 1, totalPages)),
          onPrev: () => setPage((p) => Math.max(p - 1, 1)),
        }}
      >
        <TableHead columns={columns} />

        <TableBody>
          {loading ? (
            <TableLoader rows={5} />
          ) : currentData.length === 0 ? (
            <TableEmpty colSpan={5} message="No addons found" />
          ) : (
            currentData.map((addon) => (
              <TableRow 
                key={addon.id}
                // ✅ renderActions ka use karein jo aapne TableRow mein banaya hai
                renderActions={() => (
                  <ActionMenu
                    items={[
                      {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => onEdit?.(addon),
                      },
                      {
                        label: "Delete",
                        icon: Trash,
                        danger: true,
                        onClick: () => onDelete?.(addon),
                      },
                    ]}
                  />
                )}
              >
                {/* Addon Name */}
                <td className="px-6 py-4 font-medium text-slate-900">
                  {addon.name}
                </td>

                {/* Price */}
                <td className="px-6 py-4 text-slate-600 font-mono">
                  ₹{addon.price}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      addon.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {addon.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Created At */}
                <td className="px-6 py-4 text-slate-500 italic">
                  {addon.createdAt}
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </TableShell>
    </div>
  );
}