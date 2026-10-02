import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function TablePagination({ 
  page = 1, 
  totalPages = 1, 
  totalItems = 0,
  itemsPerPage = 7,
  onNext, 
  onPrev,
  onPageChange,
}) {
  const btnBase = "inline-flex items-center justify-center px-3 py-2 text-sm font-medium transition-all border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed";
  const btnActive = "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm";
  const btnIcon = "inline-flex items-center justify-center w-9 h-9 text-sm font-medium transition-all border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm";

  // Calculate showing range
  const startItem = totalItems > 0 ? (page - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(page * itemsPerPage, totalItems) : 0;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      let startPage = Math.max(2, page - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages - 1, page + Math.floor(maxVisiblePages / 2));
      
      // Adjust if we're near the start
      if (page <= Math.floor(maxVisiblePages / 2) + 1) {
        endPage = maxVisiblePages;
      }
      
      // Adjust if we're near the end
      if (page >= totalPages - Math.floor(maxVisiblePages / 2)) {
        startPage = totalPages - maxVisiblePages + 1;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add visible pages
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1 && totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left side - Page info */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-slate-600">
          {totalItems > 0 ? (
            <>
              Showing{" "}
              <span className="font-semibold text-slate-900">{startItem}-{endItem}</span>
              {" "}of{" "}
              <span className="font-semibold text-slate-900">{totalItems}</span>
            </>
          ) : (
            <>
              Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
              <span className="font-semibold text-slate-900">{totalPages}</span>
            </>
          )}
        </p>
      </div>

      {/* Right side - Pagination controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button 
          onClick={() => onPageChange?.(1)} 
          disabled={page === 1} 
          className={btnIcon}
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button 
          onClick={onPrev} 
          disabled={page === 1} 
          className={`${btnBase} ${btnActive} gap-1.5`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="hidden md:flex items-center gap-1">
          {getPageNumbers().map((pageNum, index) => (
            pageNum === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-slate-400 text-sm">
                •••
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange?.(pageNum)}
                disabled={pageNum === page}
                className={`inline-flex items-center justify-center w-9 h-9 text-sm font-medium rounded-lg transition-all border
                  ${pageNum === page 
                    ? 'bg-black text-white border-black shadow-sm' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }
                  ${pageNum === page ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>

        {/* Mobile Page Indicator */}
        <span className="md:hidden px-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md">
          {page}/{totalPages}
        </span>

        {/* Next Page */}
        <button 
          onClick={onNext} 
          disabled={page === totalPages} 
          className={`${btnBase} ${btnActive} gap-1.5`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button 
          onClick={() => onPageChange?.(totalPages)} 
          disabled={page === totalPages} 
          className={btnIcon}
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}