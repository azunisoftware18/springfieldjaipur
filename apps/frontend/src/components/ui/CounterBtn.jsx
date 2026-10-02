export default function Counter({
  text,
  onClick,
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-transform
        ${
          disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
            : "bg-orange-400 text-white border-orange-700 hover:bg-orange-500 cursor-pointer active:scale-90"
        }`}
    >
      {text}
    </button>
  );
}