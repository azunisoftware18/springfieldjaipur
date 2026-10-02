"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ScanLine,
  X,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from 'xlsx';

import TicketScanner from "@/components/common/TicketScanner";
import ScanLogTable from "@/components/table/ScanLogTable";
import { useScanLogs } from "@/lib/queries/useScanLogs";
import StatCard from "@/components/common/StatCard";
import Button from "@/components/ui/Button";

export default function Page() {
  const [openScanner, setOpenScanner] = useState(false);
  const [page, setPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const itemsPerPage = 10;
  
  const { data: scanLogs, isLoading } = useScanLogs();

  // Calculate total pages based on filtered or all data
  const activeData = filteredData.length > 0 ? filteredData : (scanLogs || []);
  const totalPages = Math.ceil(activeData.length / itemsPerPage) || 1;

  // Paginate the data (10 items per page)
  const currentPageData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return activeData.slice(startIndex, startIndex + itemsPerPage);
  }, [activeData, page, itemsPerPage]);

  // Reset to page 1 when data changes
  useEffect(() => {
    setPage(1);
  }, [filteredData.length, scanLogs?.length]);

  // ✅ Stats always calculate from complete data
  const stats = useMemo(() => {
    if (!scanLogs) return { total: 0, entry: 0, today: 0 };
    
    const today = new Date().toDateString();
    
    return {
      total: scanLogs.length,
      entry: scanLogs.filter((log) => log.type === "ENTRY").length,
      today: scanLogs.filter((log) => {
        return new Date(log.scannedAt).toDateString() === today;
      }).length,
    };
  }, [scanLogs]);

  // ✅ Function to format data for Excel
  const formatDataForExcel = (data) => {
    return data.map((log, index) => ({
      'Sr. No': index + 1,
      'Ticket ID': log.ticket?.id || 'N/A',
      'Type': log.type || 'N/A',
      'Scanned Date': log.scannedAt?.split("T")[0] || 'N/A',
      'Scanned Time': log.scannedAt?.split("T")[1]?.slice(0, 8) || 'N/A',
      'Full Timestamp': log.scannedAt 
        ? new Date(log.scannedAt).toLocaleString("en-IN", {
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          }) 
        : 'N/A',
    }));
  };

  // ✅ Download current page data
  const downloadCurrentPage = () => {
    const formattedData = formatDataForExcel(currentPageData);
    downloadExcel(formattedData, `scan_logs_page_${page}`);
  };

  // ✅ Download all data without filters
  const downloadAllData = () => {
    const formattedData = formatDataForExcel(scanLogs || []);
    downloadExcel(formattedData, 'all_scan_logs');
  };

  // ✅ Excel download utility
  const downloadExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Set column widths
    const colWidths = [
      { wch: 8 },   // Sr. No
      { wch: 25 },  // Ticket ID
      { wch: 15 },  // Type
      { wch: 15 },  // Scanned Date
      { wch: 15 },  // Scanned Time
      { wch: 30 },  // Full Timestamp
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Scan Logs");
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);
    
    setShowDownloadOptions(false);
  };

  // ✅ Handle filter changes callback from ScanLogTable
  const handleFilteredDataChange = (filteredLogs) => {
    setFilteredData(filteredLogs);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* 🔥 HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Ticket Scanner
              </h1>
              <p className="text-slate-500 mt-1">
                Monitor and manage ticket scan activity
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 RIGHT BUTTONS */}
        <div className="flex items-center gap-3">
          {/* Download Excel Button */}
          <div className="relative">
            <Button
              iconPosition="left"
              icon={Download}
              text="Download Excel"
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              
              disabled={!scanLogs || scanLogs.length === 0}
           />
              
            
            {/* Download Options Dropdown */}
            {showDownloadOptions && (
              <>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDownloadOptions(false)}
                />
                
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden">
                  <div className="p-3 border-b border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900">Download Options</h3>
                    <p className="text-xs text-slate-500 mt-1">Select what data you want to export</p>
                  </div>
                  
                  <div className="p-2">
                    {/* Option 1: Current Page */}
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
                            Page {page} ({currentPageData.length} logs)
                          </p>
                        </div>
                      </div>
                    </button>
                    
                    {/* Option 2: All Data */}
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
                            All scan logs ({scanLogs?.length || 0} total)
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="p-2 border-t border-slate-100">
                    <button
                      onClick={() => setShowDownloadOptions(false)}
                      className="w-full text-center px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Scan Ticket Button */}
          <Button
          icon={ScanLine}
          iconPosition="left"
          text="Scan Ticket"
            onClick={() => setOpenScanner(true)}
            className="px-6 rounded-2xl font-bold text-white flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] transition-all"
          />
           
        </div>
      </div>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Scans"
          value={stats.total}
          percentage={12}
          isUp={true}
          trendingText="Live ticket scans"
          subText="Total scanned tickets"
        />

        <StatCard
          title="Entry Scans"
          value={stats.entry}
          percentage={8}
          isUp={true}
          trendingText="Entry activity"
          subText="Visitors entered"
        />

        <StatCard
          title="Scanned Today"
          value={stats.today}
          percentage={15}
          isUp={true}
          trendingText="Today's scans"
          subText="Daily scan activity"
        />
      </div>

      {/* 🔥 TABLE CARD */}
      <ScanLogTable
        data={currentPageData}
        allData={scanLogs || []}
        loading={isLoading}
        paginationProps={{
          page,
          totalPages,
          itemsPerPage: itemsPerPage,
          totalItems: activeData.length,
          onNext: () => setPage((p) => Math.min(p + 1, totalPages)),
          onPrev: () => setPage((p) => Math.max(p - 1, 1)),
          onPageChange: (newPage) => setPage(newPage),
        }}
        onFilteredDataChange={handleFilteredDataChange}
      />

      {/* 🔥 MODAL */}
      {openScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl rounded-[2rem] bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Scan Ticket
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Place QR code inside the scanner
                </p>
              </div>

              <button
                onClick={() => setOpenScanner(false)}
                className="h-11 w-11 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              <TicketScanner />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}