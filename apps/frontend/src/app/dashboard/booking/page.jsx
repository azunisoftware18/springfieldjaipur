// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import BookingTable from "@/components/table/BookingTable";
// import { useBookings } from "@/lib/queries/useBooking";
// import StatCard from "@/components/common/StatCard";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { useTicketTypes } from "@/lib/queries/useTicketType";
// import { Download, FileSpreadsheet } from "lucide-react";
// import * as XLSX from 'xlsx';
// import Button from "@/components/ui/Button";

// export default function Page() {
//   const currentPlace = useSelector((state) => state.place.currentPlace);
//   const placeId = currentPlace?.id;
//   const { data: bookings, isLoading } = useBookings();
//   const router = useRouter();
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 7; // Changed to 7 per page
//   const { data: ticketTypes = [] } = useTicketTypes(placeId);

//   // Filter states for download
//   const [showDownloadOptions, setShowDownloadOptions] = useState(false);
//   const [currentFilteredData, setCurrentFilteredData] = useState([]);

//   const totalBookings = bookings?.length || 0;
//   const today = new Date().toISOString().split("T")[0];

//   const todayBookings =
//     bookings?.filter((booking) => {
//       const bookingDate = new Date(booking.createdAt)
//         .toISOString()
//         .split("T")[0];
//       return bookingDate === today;
//     }).length || 0;

//   const successfulBookings =
//     bookings?.filter(
//       (booking) =>
//         booking.status === "PAID" || booking.paymentStatus === "PAID"
//     ).length || 0;

//   // Calculate total pages based on filtered or all data
//   const activeData = currentFilteredData.length > 0 ? currentFilteredData : (bookings || []);
//   const totalPages = Math.ceil(activeData.length / itemsPerPage) || 1;

//   // Paginate the data (7 items per page)
//   const paginatedBookings = useMemo(() => {
//     const start = (page - 1) * itemsPerPage;
//     const end = start + itemsPerPage;
//     return activeData.slice(start, end);
//   }, [activeData, page, itemsPerPage]);

//   // Reset to page 1 when data changes
//   useEffect(() => {
//     setPage(1);
//   }, [currentFilteredData.length, totalBookings]);

//   // Function to format data for Excel
//   const formatDataForExcel = (data) => {
//     return data.map((booking, index) => ({
//       'Sr. No': index + 1,
//       'Customer Name': booking.name || 'N/A',
//       'Phone': booking.phone || 'N/A',
//       'Email': booking.email || 'N/A',
//       'Place': booking.place?.name || 'N/A',
//       'Date': booking.slotDateTime?.split("T")[0] || 'N/A',
//       'Time': booking.slotDateTime?.split("T")[1]?.slice(0, 5) || 'N/A',
//       'Total Tickets': booking.totalSeats || 0,
//       'Amount (₹)': booking.totalAmount || 0,
//       'Booking Type': booking.bookingType || 'N/A',
//       'Transaction ID': booking.txnId || 'N/A',
//       'Payment ID': booking.paymentId || 'N/A',
//       'Status': booking.status || 'N/A',
//       'Created Date': new Date(booking.createdAt).toLocaleDateString("en-IN"),
//     }));
//   };

//   // Download current page data
//   const downloadCurrentPage = () => {
//     const formattedData = formatDataForExcel(paginatedBookings);
//     downloadExcel(formattedData, `bookings_page_${page}`);
//   };

//   // Download all filtered data
//   const downloadAllFiltered = () => {
//     const dataToDownload = currentFilteredData.length > 0 ? currentFilteredData : (bookings || []);
//     const formattedData = formatDataForExcel(dataToDownload);
//     const prefix = currentFilteredData.length > 0 ? 'filtered' : 'all';
//     downloadExcel(formattedData, `bookings_${prefix}`);
//   };

//   // Download all data without filters
//   const downloadAllData = () => {
//     const formattedData = formatDataForExcel(bookings || []);
//     downloadExcel(formattedData, 'all_bookings');
//   };

//   // Excel download utility
//   const downloadExcel = (data, filename) => {
//     const ws = XLSX.utils.json_to_sheet(data);

//     // Set column widths
//     const colWidths = [
//       { wch: 8 },  // Sr. No
//       { wch: 25 }, // Customer Name
//       { wch: 15 }, // Phone
//       { wch: 30 }, // Email
//       { wch: 20 }, // Place
//       { wch: 12 }, // Date
//       { wch: 10 }, // Time
//       { wch: 15 }, // Total Tickets
//       { wch: 15 }, // Amount
//       { wch: 15 }, // Booking Type
//       { wch: 25 }, // Transaction ID
//       { wch: 25 }, // Payment ID
//       { wch: 15 }, // Status
//       { wch: 15 }, // Created Date
//     ];
//     ws['!cols'] = colWidths;

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Bookings");

//     // Generate filename with timestamp
//     const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
//     XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);

//     setShowDownloadOptions(false);
//   };

//   // Handle filter changes callback from BookingTable
//   const handleFilteredDataChange = (filteredData) => {
//     setCurrentFilteredData(filteredData);
//   };

//   return (
//     <div className="bg-slate-50 min-h-screen">
//       <div className="w-full mx-auto mb-8">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight">
//               Booking Management
//             </h1>
//             <p className="text-slate-500 font-medium">
//               Manage all bookings and ticket activities.
//             </p>
//           </div>

//           {/* Download Button */}
//           <div className="relative">
//             <Button
//             iconPosition="left"
//               icon={Download}
//               text="Download Excel"
//               onClick={() => setShowDownloadOptions(!showDownloadOptions)}

//             >
//               <Download className="w-4 h-4" />
//               Download Excel
//             </Button>

//             {/* Download Options Dropdown */}
//             {showDownloadOptions && (
//               <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
//                 <div className="p-3 border-b border-slate-100">
//                   <h3 className="text-sm font-semibold text-slate-900">Download Options</h3>
//                   <p className="text-xs text-slate-500 mt-1">Select what data you want to export</p>
//                 </div>

//                 <div className="p-2">
//                   <button
//                     onClick={downloadCurrentPage}
//                     className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-lg transition-colors group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
//                         <FileSpreadsheet className="w-4 h-4 text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-slate-900">
//                           Download Current Page
//                         </p>
//                         <p className="text-xs text-slate-500">
//                           Page {page} ({paginatedBookings.length} bookings)
//                         </p>
//                       </div>
//                     </div>
//                   </button>

//                   {/* <button
//                     onClick={downloadAllFiltered}
//                     className="w-full text-left px-3 py-2.5 hover:bg-green-50 rounded-lg transition-colors group mt-1"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
//                         <FileSpreadsheet className="w-4 h-4 text-green-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-slate-900">
//                           Download Filtered Data
//                         </p>
//                         <p className="text-xs text-slate-500">
//                           {currentFilteredData.length > 0
//                             ? `Filtered: ${currentFilteredData.length} bookings`
//                             : `All data: ${totalBookings} bookings`}
//                         </p>
//                       </div>
//                     </div>
//                   </button> */}

//                   <button
//                     onClick={downloadAllData}
//                     className="w-full text-left px-3 py-2.5 hover:bg-purple-50 rounded-lg transition-colors group mt-1"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
//                         <FileSpreadsheet className="w-4 h-4 text-purple-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-slate-900">
//                           Download All Data
//                         </p>
//                         <p className="text-xs text-slate-500">
//                           All bookings ({totalBookings} total)
//                         </p>
//                       </div>
//                     </div>
//                   </button>
//                 </div>

//                 <div className="p-2 border-t border-slate-100">
//                   <button
//                     onClick={() => setShowDownloadOptions(false)}
//                     className="w-full text-center px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* STAT CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
//         <StatCard
//           title="Total Bookings"
//           value={totalBookings}
//           percentage={12}
//           isUp={true}
//           trendingText="All booking records"
//           subText="Total bookings received"
//         />
//         <StatCard
//           title="Today's Bookings"
//           value={todayBookings}
//           percentage={8}
//           isUp={true}
//           trendingText="Today's activity"
//           subText="Bookings created today"
//         />
//         <StatCard
//           title="Successful Bookings"
//           value={successfulBookings}
//           percentage={5}
//           isUp={true}
//           trendingText="Completed bookings"
//           subText="Successfully paid bookings"
//         />
//       </div>

//       <div>
//         <BookingTable
//           data={paginatedBookings}
//           allData={bookings || []}
//           loading={isLoading}
//           ticketTypes={ticketTypes}
//           onFilteredDataChange={handleFilteredDataChange}
//           onView={(booking) => {
//             router.push(`/dashboard/booking/${booking.id}`);
//           }}
//           paginationProps={{
//             page,
//             totalPages,
//             itemsPerPage: itemsPerPage,
//             totalItems: activeData.length,
//             onNext: () => setPage((p) => Math.min(p + 1, totalPages)),
//             onPrev: () => setPage((p) => Math.max(p - 1, 1)),
//             onPageChange: (newPage) => setPage(newPage),
//           }}
//         />
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";

import BookingTable from "@/components/table/BookingTable";
import { useBookings } from "@/lib/queries/useBooking";
import StatCard from "@/components/common/StatCard";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useTicketTypes } from "@/lib/queries/useTicketType";
import { Download, FileSpreadsheet, PlusCircle } from "lucide-react";
import * as XLSX from "xlsx";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Page() {
  const currentPlace = useSelector((state) => state.place.currentPlace);

  const placeId = currentPlace?.id;

  const { data: bookings, isLoading } = useBookings();

  const router = useRouter();

  const [page, setPage] = useState(1);

  const itemsPerPage = 7;

  const { data: ticketTypes = [] } = useTicketTypes(placeId);


  const [showDownloadOptions, setShowDownloadOptions] = useState(false);


  const [currentFilteredData, setCurrentFilteredData] = useState([]);

  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const totalBookings = bookings?.length || 0;

  const today = new Date().toISOString().split("T")[0];

  const todayBookings =
    bookings?.filter((booking) => {
      const bookingDate = new Date(booking.createdAt)
        .toISOString()
        .split("T")[0];

      return bookingDate === today;
    }).length || 0;

  const successfulBookings =
    bookings?.filter(
      (booking) =>
        booking.status === "PAID" || booking.paymentStatus === "PAID",
    ).length || 0;


  const activeData = hasActiveFilters ? currentFilteredData : bookings || [];



  const totalPages = Math.ceil(activeData.length / itemsPerPage) || 1;


  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * itemsPerPage;

    const end = start + itemsPerPage;

    return activeData.slice(start, end);
  }, [activeData, page, itemsPerPage]);

 
  useEffect(() => {
    setPage(1);
  }, [currentFilteredData.length, totalBookings, hasActiveFilters]);

 
  const handleFilteredDataChange = useCallback(
    (filteredData, filtersActive) => {
      setCurrentFilteredData((prev) => {
        // Same array reference
        if (prev === filteredData) {
          return prev;
        }

        // Same data - don't trigger unnecessary state update
        if (
          Array.isArray(prev) &&
          Array.isArray(filteredData) &&
          prev.length === filteredData.length &&
          prev.every((item, index) => item?.id === filteredData[index]?.id)
        ) {
          return prev;
        }

        return filteredData;
      });

      setHasActiveFilters(Boolean(filtersActive));
    },
    [],
  );

  // =========================================================
  // FORMAT DATA FOR EXCEL
  // =========================================================

  const formatDataForExcel = (data) => {
    return data.map((booking, index) => ({
      "Sr. No": index + 1,

      "Customer Name": booking.name || "N/A",

      Phone: booking.phone || "N/A",

      Email: booking.email || "N/A",

      Place: booking.place?.name || "N/A",

      Date: booking.slotDateTime?.split("T")[0] || "N/A",

      Time: booking.slotDateTime?.split("T")[1]?.slice(0, 5) || "N/A",

      "Total Tickets": booking.totalSeats || 0,

      "Amount (₹)": booking.totalAmount || 0,

      "Booking Type": booking.bookingType || "N/A",

      "Transaction ID": booking.txnId || "N/A",

      "Payment ID": booking.paymentId || "N/A",

      Status: booking.status || "N/A",

      "Payment Method": booking.paymentMethod || "CASH",

      "Created Date": booking.createdAt
        ? new Date(booking.createdAt).toLocaleDateString("en-IN")
        : "N/A",
    }));
  };

  // =========================================================
  // DOWNLOAD CURRENT PAGE
  // =========================================================

  const downloadCurrentPage = () => {
    const formattedData = formatDataForExcel(paginatedBookings);

    downloadExcel(formattedData, `bookings_page_${page}`);
  };

  // =========================================================
  // DOWNLOAD ALL FILTERED DATA
  // =========================================================

  const downloadAllFiltered = () => {
    const dataToDownload = hasActiveFilters
      ? currentFilteredData
      : bookings || [];

    const formattedData = formatDataForExcel(dataToDownload);

    const prefix = hasActiveFilters ? "filtered" : "all";

    downloadExcel(formattedData, `bookings_${prefix}`);
  };

  // =========================================================
  // DOWNLOAD ALL DATA
  // =========================================================

  const downloadAllData = () => {
    const formattedData = formatDataForExcel(bookings || []);

    downloadExcel(formattedData, "all_bookings");
  };

  // =========================================================
  // EXCEL DOWNLOAD
  // =========================================================

  const downloadExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);

    // =====================================================
    // COLUMN WIDTHS
    // =====================================================

    const colWidths = [
      { wch: 8 }, // Sr. No
      { wch: 25 }, // Customer Name
      { wch: 15 }, // Phone
      { wch: 30 }, // Email
      { wch: 20 }, // Place
      { wch: 12 }, // Date
      { wch: 10 }, // Time
      { wch: 15 }, // Total Tickets
      { wch: 15 }, // Amount
      { wch: 15 }, // Booking Type
      { wch: 25 }, // Transaction ID
      { wch: 25 }, // Payment ID
      { wch: 15 }, // Status
      { wch: 15 }, // Created Date
    ];

    ws["!cols"] = colWidths;

    // =====================================================
    // WORKBOOK
    // =====================================================

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Bookings");

    // =====================================================
    // TIMESTAMP
    // =====================================================

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 19);

    XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);

    setShowDownloadOptions(false);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="w-full mx-auto mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Booking Management
            </h1>

            <p className="text-slate-500 font-medium">
              Manage all bookings and ticket activities.
            </p>
          </div>

          {/* =================================================
              DOWNLOAD BUTTON
          ================================================= */}

          <div className="flex gap-2">
            <div className=" rounded-x border border-black p-2  ">
              <Link
                href={`/book-tickets/${placeId}`}
                iconPosition="left"
                icon={PlusCircle}
                text="Ticket Book"
              >
                {/* <PlusCircle className="w-4 h-4" /> */}
                Ticket Book
              </Link>
            </div>

            <Button
              iconPosition="left"
              icon={Download}
              text="Download Excel"
              onClick={() => setShowDownloadOptions((prev) => !prev)}
            >
              <Download className="w-4 h-4" />
              Download Excel
            </Button>

            {/* ===============================================
                DOWNLOAD DROPDOWN
            =============================================== */}

            {showDownloadOptions && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                <div className="p-3 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Download Options
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Select what data you want to export
                  </p>
                </div>

                <div className="p-2">
                  {/* =========================================
                      CURRENT PAGE
                  ========================================= */}

                  <button
                    onClick={downloadCurrentPage}
                    className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Download Current Page
                        </p>

                        <p className="text-xs text-slate-500">
                          Page {page} ({paginatedBookings.length} bookings)
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* =========================================
                      FILTERED DATA
                  ========================================= */}

                  {/*
                  <button
                    onClick={
                      downloadAllFiltered
                    }
                    className="w-full text-left px-3 py-2.5 hover:bg-green-50 rounded-lg transition-colors group mt-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Download Filtered Data
                        </p>

                        <p className="text-xs text-slate-500">
                          {hasActiveFilters
                            ? `Filtered: ${currentFilteredData.length} bookings`
                            : `All data: ${totalBookings} bookings`}
                        </p>
                      </div>
                    </div>
                  </button>
                  */}

                  {/* =========================================
                      ALL DATA
                  ========================================= */}

                  <button
                    onClick={downloadAllData}
                    className="w-full text-left px-3 py-2.5 hover:bg-purple-50 rounded-lg transition-colors group mt-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Download All Data
                        </p>

                        <p className="text-xs text-slate-500">
                          All bookings ({totalBookings} total)
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* =========================================
                    CANCEL
                ========================================= */}

                <div className="p-2 border-t border-slate-100">
                  <button
                    onClick={() => setShowDownloadOptions(false)}
                    className="w-full text-center px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          percentage={12}
          isUp={true}
          trendingText="All booking records"
          subText="Total bookings received"
        />

        <StatCard
          title="Today's Bookings"
          value={todayBookings}
          percentage={8}
          isUp={true}
          trendingText="Today's activity"
          subText="Bookings created today"
        />

        <StatCard
          title="Successful Bookings"
          value={successfulBookings}
          percentage={5}
          isUp={true}
          trendingText="Completed bookings"
          subText="Successfully paid bookings"
        />
      </div>

      {/* =====================================================
          BOOKING TABLE
      ===================================================== */}

      <div>
        <BookingTable
          data={paginatedBookings}
          allData={bookings || []}
          loading={isLoading}
          ticketTypes={ticketTypes}
          onFilteredDataChange={handleFilteredDataChange}
          onView={(booking) => {
            router.push(`/dashboard/booking/${booking.id}`);
          }}
          paginationProps={{
            page,
            totalPages,
            itemsPerPage,

            totalItems: activeData.length,

            onNext: () => setPage((p) => Math.min(p + 1, totalPages)),

            onPrev: () => setPage((p) => Math.max(p - 1, 1)),

            onPageChange: (newPage) => setPage(newPage),
          }}
        />
      </div>
    </div>
  );
}
