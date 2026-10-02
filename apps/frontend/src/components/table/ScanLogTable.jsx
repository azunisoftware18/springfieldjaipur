"use client";

import {
  TableShell,
  TableHead,
  TableBody,
  TableRow,
  TableEmpty,
  TableLoader,
} from "@/components/table/core";

import { useState, useMemo, useEffect } from "react";
import { Filter, XCircle } from "lucide-react";

export default function ScanLogTable({
  data = [],           // Paginated data for display
  allData = [],        // Complete data for filtering
  loading = false,
  paginationProps,
  onFilteredDataChange, // Callback to parent with filtered results
}) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // ✅ Filter ALL data (not just current page)
  const filteredData = useMemo(() => {
    if (!allData || allData.length === 0) return [];
    
    return allData.filter((log) => {
      // Search filter - checks multiple fields
      const searchTerm = search.toLowerCase().trim();
      const matchesSearch = !searchTerm || 
        log.ticket?.id?.toLowerCase().includes(searchTerm) ||
        log.type?.toLowerCase().includes(searchTerm);

      // Date filter - filters by scannedAt date
      const matchesDate = !dateFilter ||
        log.scannedAt?.split("T")[0] === dateFilter;

      // Type filter
      const matchesType = !typeFilter ||
        log.type?.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesDate && matchesType;
    });
  }, [allData, search, dateFilter, typeFilter]);

  // ✅ Notify parent about filtered data for pagination
  useEffect(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(filteredData);
    }
  }, [filteredData, onFilteredDataChange]);

  // ✅ Get unique types from ALL data for filter options
  const typeOptions = useMemo(() => {
    if (!allData || allData.length === 0) return [];
    return [...new Set(allData.map(log => log.type))].filter(Boolean).sort();
  }, [allData]);

  const clearAllFilters = () => {
    setSearch("");
    setDateFilter("");
    setTypeFilter("");
  };

  const hasActiveFilters = search || dateFilter || typeFilter;

  return (
    <div className="bg-slate-50 min-h-screen">
      <TableShell
        title="Scan Logs"
        subtitle={`${filteredData.length} total logs${hasActiveFilters ? ' (filtered)' : ''}`}
        searchProps={{
          value: search,
          onChange: (e) => setSearch(e.target.value),
          onClear: () => setSearch(""),
          placeholder: "Search ticket ID or type...",
        }}
        paginationProps={paginationProps}
        customFilters={
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-3">
              {/* Date Filter */}
              <div className="relative">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
                  title="Filter by scan date"
                />
              </div>

              {/* Type Filter */}
              {/* <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-w-[140px] cursor-pointer"
              >
                <option value="">All Types</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select> */}

              {/* Active Filters Indicator & Clear Button */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                    <Filter className="w-3 h-3" />
                    Filters active
                  </div>
                  <button
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
        }
      >
        <TableHead columns={["Ticket ID", "Type", "Scanned At"]} />

        <TableBody>
          {loading ? (
            <TableLoader rows={5} />
          ) : data.length === 0 ? (
            <TableEmpty 
              colSpan={3} 
              message={hasActiveFilters ? "No scan logs match your filters" : "No scan logs found"} 
            />
          ) : (
            data.map((log) => (
              <TableRow key={log.id}>
                {/* Ticket ID */}
                <td className="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">
                  {log.ticket?.id || "N/A"}
                </td>

                {/* Type */}
                <td className="px-5 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                      log.type === "ENTRY"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-600 border border-red-200"
                    }`}
                  >
                    {log.type}
                  </span>
                </td>

                {/* Scanned At */}
                <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                  {log.scannedAt 
                    ? new Date(log.scannedAt).toLocaleString("en-IN", {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      }) 
                    : "---"}
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </TableShell>
    </div>
  );
}