"use client";

import {
  TableHead,
  TableRow,
  TableEmpty,
  TableLoader,
  TableShell,
  TableBody,
} from "@/components/table/core";

import ActionMenu from "../common/ActionMenu";
import { Pencil, Trash, Eye } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

export default function TicketTypeTable({
  data = [],
  loading = false,
  onEdit,
  onDelete,
  onView,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // ✅ Ek page par kitne items dikhane hain

  // 🔍 Search Logic
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      [item.name, item.place?.name].some((val) =>
        val?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  // Current page ka data nikalne ke liye slice karein
  const currentData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, page]);

  // Agar search karne par items kam ho jayein, toh page 1 par reset karein
  useEffect(() => {
    setPage(1);
  }, [search]);

  const columns = [
    "Ticket Name",
    "Place",
    "Price",
    "Max Per Booking",
    "Action",
  ];

  return (
    <TableShell
      title="Ticket Types"
      subtitle={`${filteredData.length} total ticket types`}
      searchProps={{
        value: search,
        onChange: (e) => setSearch(e.target.value),
        onClear: () => setSearch(""),
        placeholder: "Search ticket or place...",
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
          <TableEmpty colSpan={5} message="No ticket types found." />
        ) : (
          /* ✅ filteredData ki jagah currentData map karein */
          currentData.map((ticket) => (
            <TableRow
              key={ticket.id}
              renderActions={() => (
                <ActionMenu
                  items={[
                    {
                      label: "View",
                      icon: Eye,
                      onClick: () => onView?.(ticket),
                    },
                    {
                      label: "Edit",
                      icon: Pencil,
                      onClick: () => onEdit?.(ticket),
                    },
                    {
                      label: "Delete",
                      icon: Trash,
                      danger: true,
                      onClick: () => onDelete?.(ticket),
                    },
                  ]}
                />
              )}
            >
              <td className="px-6 py-4 font-semibold text-slate-900">
                {ticket.name}
              </td>

              <td className="px-6 py-4 text-slate-600">
                {ticket.place?.name || "N/A"}
              </td>

              <td className="px-6 py-4 font-medium text-slate-800">
                ₹{ticket.price}
              </td>

              <td className="px-6 py-4 text-slate-500">
                {ticket.maxPerBooking}
              </td>
            </TableRow>
          ))
        )}
      </TableBody>
    </TableShell>
  );
}