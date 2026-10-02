export default function StatusBadge({ status }) {
  const map = {
    PENDING: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700",
    },
    PAID: {
      label: "Paid",
      className: "bg-green-100 text-green-700",
    },
    FAILED: {
      label: "Failed",
      className: "bg-red-100 text-red-600",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-slate-200 text-slate-600",
    },
  };

  const current = map[status] || {
    label: status,
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${current.className}`}
    >
      {current.label}
    </span>
  );
}