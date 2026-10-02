// "use client";

// import {
//   TableShell,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableEmpty,
//   TableLoader,
// } from "./core";

// import ActionMenu from "../common/ActionMenu";
// import { Eye, XCircle, Filter } from "lucide-react"; // Filter import add kiya
// import { useState, useMemo, useEffect } from "react";
// import StatusBadge from "../common/StatusBadge";

// export default function BookingTable({
//   data = [],           // Paginated data for display
//   allData = [],        // Complete data for filtering
//   isLoading = false,
//   ticketTypes = [],
//   onView,
//   onCancel,
//   paginationProps,
//   onFilteredDataChange, // Callback to parent with filtered results
// }) {
//   const [search, setSearch] = useState("");
//   const [dateFilter, setDateFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [bookingTypeFilter, setBookingTypeFilter] = useState("");

//   // Filter ALL data (not just current page)
//   const filteredData = useMemo(() => {
//     if (!allData || allData.length === 0) return [];

//     return allData.filter((item) => {
//       // Search filter - checks multiple fields
//       const searchTerm = search.toLowerCase().trim();
//       const matchesSearch = !searchTerm ||
//         item.name?.toLowerCase().includes(searchTerm) ||
//         item.email?.toLowerCase().includes(searchTerm) ||
//         item.place?.name?.toLowerCase().includes(searchTerm) ||
//         item.phone?.includes(searchTerm);

//       // Date filter - filters by slot date
//       const matchesDate = !dateFilter ||
//         item.slotDateTime?.split("T")[0] === dateFilter;

//       // Status filter
//       const matchesStatus = !statusFilter ||
//         item.status?.toLowerCase() === statusFilter.toLowerCase();

//       // Booking type filter
//       const matchesBookingType = !bookingTypeFilter ||
//         item.bookingType?.toLowerCase() === bookingTypeFilter.toLowerCase();

//       return matchesSearch && matchesDate && matchesStatus && matchesBookingType;
//     });
//   }, [allData, search, dateFilter, statusFilter, bookingTypeFilter]);

//   // Notify parent about filtered data for pagination
//   useEffect(() => {
//     if (onFilteredDataChange) {
//       onFilteredDataChange(filteredData);
//     }
//   }, [filteredData, onFilteredDataChange]);

//   // Get unique statuses from ALL data for filter options
//   const statusOptions = useMemo(() => {
//     if (!allData || allData.length === 0) return [];
//     return [...new Set(allData.map(item => item.status))].filter(Boolean).sort();
//   }, [allData]);

//   // Booking type options from ticketTypes prop
//   const bookingTypeOptions = useMemo(() => {
//     return ticketTypes || [];
//   }, [ticketTypes]);

//   const columns = [
//     "Customer",
//     "Phone",
//     "Email",
//     "Place",
//     "Slot",
//     "Total Tickets",
//     "Amount",
//     "Booking Type",
//     "Transaction ID",
//     "Payment ID",
//     "Status",
//     "Created",
//     "Action",
//   ];

//   const clearAllFilters = () => {
//     setSearch("");
//     setDateFilter("");
//     setStatusFilter("");
//     setBookingTypeFilter("");
//   };

//   const hasActiveFilters = search || dateFilter || statusFilter || bookingTypeFilter;

//   return (
//     <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
//       <div className="w-full">
//         <TableShell
//           title="Bookings"
//           subtitle={`${filteredData.length} total bookings${hasActiveFilters ? ' (filtered)' : ''}`}
//           searchProps={{
//             value: search,
//             onChange: (e) => setSearch(e.target.value),
//             onClear: () => setSearch(""),
//             placeholder: "Search name, email or place...",
//           }}
//           paginationProps={paginationProps}
//           customFilters={
//             <div className="w-full">
//               <div className="flex flex-wrap items-center gap-3">
//                 {/* Date Filter */}
//                 <div className="relative">
//                   <input
//                     type="date"
//                     value={dateFilter}
//                     onChange={(e) => setDateFilter(e.target.value)}
//                     className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
//                     title="Filter by booking date"
//                   />
//                 </div>

//                 {/* Status Filter */}
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-w-[140px] cursor-pointer"
//                 >
//                   <option value="">All Status</option>
//                   {statusOptions.map((status) => (
//                     <option key={status} value={status}>
//                       {status}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Booking Type Filter */}
//                 {/* <select
//                   value={bookingTypeFilter}
//                   onChange={(e) => setBookingTypeFilter(e.target.value)}
//                   className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-w-[150px] cursor-pointer"
//                 >
//                   <option value="">All Ticket Types</option>
//                   {bookingTypeOptions.map((type) => (
//                     <option key={type.id || type.name} value={type.name}>
//                       {type.name}
//                     </option>
//                   ))}
//                 </select> */}

//                 {/* Active Filters Indicator & Clear Button */}
//                 {hasActiveFilters && (
//                   <div className="flex items-center gap-2">
//                     <div className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
//                       <Filter className="w-3 h-3" />
//                       Filters active
//                     </div>
//                     <button
//                       onClick={clearAllFilters}
//                       className="inline-flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
//                     >
//                       <XCircle className="w-4 h-4" />
//                       Clear All
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           }
//         >
//           <TableHead columns={columns} />

//           <TableBody>
//             {isLoading ? (
//               <TableLoader rows={7} />
//             ) : data.length === 0 ? (
//               <TableEmpty
//                 colSpan={13}
//                 message={hasActiveFilters ? "No bookings match your filters" : "No bookings found"}
//               />
//             ) : (
//               data.map((booking) => (
//                 <TableRow
//                   key={booking.id}
//                   renderActions={() => (
//                     <ActionMenu
//                       items={[
//                         {
//                           label: "View Details",
//                           icon: Eye,
//                           onClick: () => onView?.(booking),
//                         },
//                         {
//                           label: "Cancel Booking",
//                           icon: XCircle,
//                           danger: true,
//                           onClick: () => onCancel?.(booking),
//                           disabled: booking.status === "CANCELLED" || booking.status === "FAILED",
//                         },
//                       ]}
//                     />
//                   )}
//                 >
//                   {/* Customer Column */}
//                   <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
//                     <div className="flex flex-col space-y-1">
//                       <p className="font-semibold text-slate-900">
//                         {booking.name}
//                       </p>
//                     </div>
//                   </td>

//                   {/* Phone Column */}
//                   <td className="px-4 py-3 text-slate-600 md:px-6 md:py-4">
//                     {booking.phone || "N/A"}
//                   </td>

//                   {/* Email Column */}
//                   <td className="px-4 py-3 text-slate-600 md:px-6 md:py-4">
//                     <span className="break-all inline-block max-w-[180px]">
//                       {booking.email || "N/A"}
//                     </span>
//                   </td>

//                   {/* Place Column */}
//                   <td className="px-4 py-3 text-slate-700 md:px-6 md:py-4">
//                     {booking.place?.name || "N/A"}
//                   </td>

//                   {/* Slot Column */}
//                   <td className="px-4 py-3 text-slate-500 md:px-6 md:py-4">
//                     <div className="flex flex-col">
//                       <span className="text-sm">
//                         {booking.slotDateTime?.split("T")[0]}
//                       </span>
//                       <span className="text-xs text-slate-400">
//                         {booking.slotDateTime?.split("T")[1]?.slice(0, 5)}
//                       </span>
//                     </div>
//                   </td>

//                   {/* Total Tickets Column */}
//                   <td className="px-4 py-3 text-slate-600 text-center md:px-6 md:py-4">
//                     {booking.totalSeats || 0}
//                   </td>

//                   {/* Amount Column */}
//                   <td className="px-4 py-3 font-semibold text-slate-800 md:px-6 md:py-4">
//                     ₹{booking.totalAmount?.toLocaleString() || 0}
//                   </td>

//                   {/* Booking Type Column */}
//                   <td className="px-4 py-3 md:px-6 md:py-4">
//                     <span className="inline-flex px-2 py-1 rounded-md text-[11px] font-medium bg-violet-50 text-violet-700 border border-violet-100 whitespace-nowrap">
//                       {booking.bookingType || "TICKET"}
//                     </span>
//                   </td>

//                   {/* Transaction ID Column */}
//                   <td className="px-4 py-3 text-xs font-mono text-slate-500 md:px-6 md:py-4">
//                     <span className="break-all max-w-[140px] inline-block">
//                       {booking.txnId || "N/A"}
//                     </span>
//                   </td>

//                   {/* Payment ID Column */}
//                   <td className="px-4 py-3 text-xs font-mono text-slate-500 md:px-6 md:py-4">
//                     <span className="break-all max-w-[140px] inline-block">
//                       {booking.paymentId || "N/A"}
//                     </span>
//                   </td>

//                   {/* Status Column */}
//                   <td className="px-4 py-3 md:px-6 md:py-4">
//                     <StatusBadge status={booking.status} />
//                   </td>

//                   {/* Created Column */}
//                   <td className="px-4 py-3 text-slate-500 text-sm md:px-6 md:py-4 whitespace-nowrap">
//                     {new Date(booking.createdAt).toLocaleDateString("en-IN", {
//                       day: "numeric",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </td>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </TableShell>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  TableShell,
  TableHead,
  TableBody,
  TableRow,
  TableEmpty,
  TableLoader,
} from "./core";

import ActionMenu from "../common/ActionMenu";
import { Eye, XCircle, Filter } from "lucide-react";

import { useState, useMemo, useEffect } from "react";

import StatusBadge from "../common/StatusBadge";

export default function BookingTable({
  data = [],
  allData = [],
  isLoading = false,
  loading = false,
  ticketTypes = [],
  onView,
  onCancel,
  paginationProps,
  onFilteredDataChange,
}) {
  // =========================================================
  // FILTER STATES
  // =========================================================

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [bookingTypeFilter, setBookingTypeFilter] = useState("");

  // =========================================================
  // LOADING
  // =========================================================
  //
  // Parent may send either isLoading or loading.
  // Support both so existing usage doesn't break.
  //
  // =========================================================

  const tableLoading = isLoading || loading;

  // =========================================================
  // CHECK ACTIVE FILTERS
  // =========================================================

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      search.trim() || dateFilter || statusFilter || bookingTypeFilter,
    );
  }, [search, dateFilter, statusFilter, bookingTypeFilter]);

  // =========================================================
  // FILTER ALL DATA
  // =========================================================

  const filteredData = useMemo(() => {
    if (!Array.isArray(allData)) {
      return [];
    }

    // No filters active
    // Return all data.
    if (!hasActiveFilters) {
      return allData;
    }

    const searchTerm = search.toLowerCase().trim();

    return allData.filter((item) => {
      // =====================================================
      // SEARCH
      // =====================================================

      const matchesSearch =
        !searchTerm ||
        item.name?.toLowerCase().includes(searchTerm) ||
        item.email?.toLowerCase().includes(searchTerm) ||
        item.place?.name?.toLowerCase().includes(searchTerm) ||
        item.phone?.toString().includes(searchTerm);

      // =====================================================
      // DATE
      // =====================================================

      const matchesDate =
        !dateFilter || item.slotDateTime?.split("T")[0] === dateFilter;

      // =====================================================
      // STATUS
      // =====================================================

      const matchesStatus =
        !statusFilter ||
        item.status?.toLowerCase() === statusFilter.toLowerCase();

      // =====================================================
      // BOOKING TYPE
      // =====================================================

      const matchesBookingType =
        !bookingTypeFilter ||
        item.bookingType?.toLowerCase() === bookingTypeFilter.toLowerCase();

      return (
        matchesSearch && matchesDate && matchesStatus && matchesBookingType
      );
    });
  }, [
    allData,
    search,
    dateFilter,
    statusFilter,
    bookingTypeFilter,
    hasActiveFilters,
  ]);

  // =========================================================
  // NOTIFY PARENT
  // =========================================================
  //
  // IMPORTANT:
  // Do not use a callback that is recreated on every parent
  // render. Parent now uses useCallback.
  //
  // Also pass whether filters are active.
  //
  // =========================================================

  useEffect(() => {
    if (!onFilteredDataChange) {
      return;
    }

    onFilteredDataChange(filteredData, hasActiveFilters);
  }, [filteredData, hasActiveFilters, onFilteredDataChange]);

  // =========================================================
  // STATUS OPTIONS
  // =========================================================

  const statusOptions = useMemo(() => {
    if (!Array.isArray(allData) || allData.length === 0) {
      return [];
    }

    return [
      ...new Set(allData.map((item) => item.status).filter(Boolean)),
    ].sort();
  }, [allData]);

  // =========================================================
  // BOOKING TYPE OPTIONS
  // =========================================================

  const bookingTypeOptions = useMemo(() => {
    return Array.isArray(ticketTypes) ? ticketTypes : [];
  }, [ticketTypes]);

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  const columns = [
    "Customer",
    "Phone",
    "Email",
    "Place",
    "Slot",
    "Total Tickets",
    "Amount",
    "Booking Type",
    "Transaction ID",
    "Payment ID",
    "Status",
    "Created",
    "Action",
  ];

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearAllFilters = () => {
    setSearch("");
    setDateFilter("");
    setStatusFilter("");
    setBookingTypeFilter("");
  };

  // =========================================================
  // RENDER
  // =========================================================

return (
  <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">

    {/* FILTERS OUTSIDE TABLE */}
    <div className="w-full border-b border-slate-100 bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">

        {/* Date Filter */}
        <div className="relative">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
            title="Filter by booking date"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-w-[140px] cursor-pointer"
        >
          <option value="">All Status</option>

          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">

            <div className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
              <Filter className="w-3 h-3" />
              Filters active
            </div>

            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <XCircle className="w-4 h-4" />
              Clear All
            </button>

          </div>
        )}

      </div>
    </div>

    {/* TABLE */}
    <div className="w-full">
      <TableShell
        title="Bookings"
        subtitle={`${filteredData.length} total bookings${
          hasActiveFilters ? " (filtered)" : ""
        }`}
        searchProps={{
          value: search,
          onChange: (e) => setSearch(e.target.value),
          onClear: () => setSearch(""),
          placeholder: "Search name, email or place...",
        }}
        paginationProps={paginationProps}
      >

        <TableHead columns={columns} />

        <TableBody>

          {isLoading ? (
            <TableLoader rows={7} />
          ) : data.length === 0 ? (
            <TableEmpty
              colSpan={13}
              message={
                hasActiveFilters
                  ? "No bookings match your filters"
                  : "No bookings found"
              }
            />
          ) : (
            data.map((booking) => (
              <TableRow
                key={booking.id}
                renderActions={() => (
                  <ActionMenu
                    items={[
                      {
                        label: "View Details",
                        icon: Eye,
                        onClick: () => onView?.(booking),
                      },
                      {
                        label: "Cancel Booking",
                        icon: XCircle,
                        danger: true,
                        onClick: () => onCancel?.(booking),
                        disabled:
                          booking.status === "CANCELLED" ||
                          booking.status === "FAILED",
                      },
                    ]}
                  />
                )}
              >

                {/* Customer */}
                <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
                  <div className="flex flex-col space-y-1">
                    <p className="font-semibold text-slate-900">
                      {booking.name}
                    </p>
                  </div>
                </td>

                {/* Phone */}
                <td className="px-4 py-3 text-slate-600 md:px-6 md:py-4">
                  {booking.phone || "N/A"}
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-slate-600 md:px-6 md:py-4">
                  <span className="break-all inline-block max-w-[180px]">
                    {booking.email || "N/A"}
                  </span>
                </td>

                {/* Place */}
                <td className="px-4 py-3 text-slate-700 md:px-6 md:py-4">
                  {booking.place?.name || "N/A"}
                </td>

                {/* Slot */}
                <td className="px-4 py-3 text-slate-500 md:px-6 md:py-4">
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {booking.slotDateTime?.split("T")[0] || "N/A"}
                    </span>

                    <span className="text-xs text-slate-400">
                      {booking.slotDateTime
                        ?.split("T")[1]
                        ?.slice(0, 5) || "N/A"}
                    </span>
                  </div>
                </td>

                {/* Total Tickets */}
                <td className="px-4 py-3 text-slate-600 text-center md:px-6 md:py-4">
                  {booking.totalSeats || 0}
                </td>

                {/* Amount */}
                <td className="px-4 py-3 font-semibold text-slate-800 md:px-6 md:py-4">
                  ₹{booking.totalAmount?.toLocaleString() || 0}
                </td>

                {/* Booking Type */}
                <td className="px-4 py-3 md:px-6 md:py-4">
                  <span className="inline-flex px-2 py-1 rounded-md text-[11px] font-medium bg-violet-50 text-violet-700 border border-violet-100 whitespace-nowrap">
                    {booking.bookingType || "TICKET"}
                  </span>
                </td>

                {/* Transaction ID */}
                <td className="px-4 py-3 text-xs font-mono text-slate-500 md:px-6 md:py-4">
                  <span className="break-all max-w-[140px] inline-block">
                    {booking.txnId || "N/A"}
                  </span>
                </td>

                {/* Payment ID */}
                <td className="px-4 py-3 text-xs font-mono text-slate-500 md:px-6 md:py-4">
                  <span className="break-all max-w-[140px] inline-block">
                    {booking.paymentId || "N/A"}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3 md:px-6 md:py-4">
                  <StatusBadge status={booking.status} />
                </td>

                {/* Created */}
                <td className="px-4 py-3 text-slate-500 text-sm md:px-6 md:py-4 whitespace-nowrap">
                  {booking.createdAt
                    ? new Date(booking.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>

              </TableRow>
            ))
          )}

        </TableBody>

      </TableShell>
    </div>
  </div>
);
}
