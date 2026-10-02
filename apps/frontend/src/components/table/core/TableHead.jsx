export default function TableHead({ columns = [] }) {
  return (
    <thead className="bg-slate-50 border-b border-slate-200">
      <tr>
        {columns.map((col, index) => (
          <th
            key={index}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/3 ${
              col === "Action"
                ? "text-right"
                : "text-left"
            }`}
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}