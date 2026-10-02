export default function TableEmpty({ message = "No records found" }) {
  return (
    <tr>
      <td colSpan="100%" className="py-20 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-slate-50 p-4 rounded-full mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">{message}</p>
        </div>
      </td>
    </tr>
  );
}