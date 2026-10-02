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
import { useState } from "react";

// ✅ Dummy Data (BookingAddon Model Based)
const BOOKING_ADDONS = [
  {
    id: "1",
    bookingId: "BK001",
    addonName: "GUIDE",
    quantity: 2,
    price: 499,
  },
  {
    id: "2",
    bookingId: "BK002",
    addonName: "CAMERA",
    quantity: 1,
    price: 299,
  },
  {
    id: "3",
    bookingId: "BK003",
    addonName: "SAFARI",
    quantity: 4,
    price: 999,
  },
];

export default function BookingAddonTable() {
  const [search, setSearch] = useState("");
  const [loading] = useState(false);
  const [page, setPage] = useState(1);

  // ✅ Filter
  const filteredData = BOOKING_ADDONS.filter((item) =>
    item.bookingId.toLowerCase().includes(search.toLowerCase()) ||
    item.addonName.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Actions
  const handleEdit = (item) => {
    console.log("Edit:", item);
  };

  const handleDelete = (item) => {
    console.log("Delete:", item);
  };

  const columns = [
    "Booking ID",
    "Addon",
    "Quantity",
    "Price",
    "Total",
    "Actions",
  ];

  return (
    <div className="p-6 ">

      <TableShell
        title="Booking Addons"
        searchProps={{
          value: search,
          onChange: (e) => setSearch(e.target.value),
          onClear: () => setSearch(""),
          placeholder: "Search booking or addon...",
        }}
        paginationProps={{
          page,
          totalPages: 3,
          onNext: () => setPage((p) => p + 1),
          onPrev: () => setPage((p) => p - 1),
        }}
      >
        <TableHead columns={columns} />

        <TableBody>
          {loading ? (
            <TableLoader />
          ) : filteredData.length === 0 ? (
            <TableEmpty message="No booking addons found" />
          ) : (
            filteredData.map((item) => (
              <TableRow key={item.id}>

                {/* Booking ID */}
                <td className="px-5 py-3 font-medium text-gray-800">
                  {item.bookingId}
                </td>

                {/* Addon Name */}
                <td className="px-5 py-3 text-gray-600">
                  {item.addonName}
                </td>

                {/* Quantity */}
                <td className="px-5 py-3 text-gray-500">
                  {item.quantity}
                </td>

                {/* Price */}
                <td className="px-5 py-3 text-gray-500">
                  ₹ {item.price}
                </td>

                {/* Total */}
                <td className="px-5 py-3 font-semibold text-slate-700">
                  ₹ {item.price * item.quantity}
                </td>

                {/* Actions */}
                <td className="px-5 py-3 text-right w-20">
                  <ActionMenu
                    items={[
                      {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => handleEdit(item),
                      },
                      {
                        label: "Delete",
                        icon: Trash,
                        danger: true,
                        onClick: () => handleDelete(item),
                      },
                    ]}
                  />
                </td>

              </TableRow>
            ))
          )}
        </TableBody>
      </TableShell>
    </div>
  );
}