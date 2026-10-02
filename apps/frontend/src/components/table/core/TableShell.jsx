"use client";

import SearchField from "@/components/ui/SearchField";
import TablePagination from "./TablePagination";

export default function TableShell({
  title,
  searchProps,
  children,
  paginationProps,
  customFilters, // New prop for custom filters
}) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header with Search and Custom Filters */}
      {(title || searchProps || customFilters) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 border-b border-slate-100 gap-4">
          {title && (
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {title}
            </h2>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {customFilters && (
              <div className="w-full sm:w-auto">
                {customFilters}
              </div>
            )}
            
            {searchProps && (
              <div className="w-full sm:w-72">
                <SearchField {...searchProps} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-sm text-left border-collapse">
          {children}
        </table>
      </div>

      {/* Footer / Pagination */}
      {paginationProps && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30">
          <TablePagination {...paginationProps} />
        </div>
      )}
    </div>
  );
}