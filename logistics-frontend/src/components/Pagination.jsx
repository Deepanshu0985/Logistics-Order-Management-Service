import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="pagination-info">
        Page <span className="text-white font-semibold">{page + 1}</span> of{" "}
        <span className="text-white font-semibold">{totalPages}</span>
      </div>

      <button
        className="pagination-btn"
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Pagination;
