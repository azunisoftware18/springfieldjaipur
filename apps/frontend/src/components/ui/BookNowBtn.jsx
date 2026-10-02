"use client";

export default function BookNowBtn({ title, addClass, onClick, able }) {
    return (
        <button
            onClick={onClick}
            disabled={able}
            className={`px-10 py-3 rounded-lg transition-all duration-300 ease-in-out 
             hover:text-white hover:scale-105 hover:shadow-lg hover:cursor-pointer
            flex items-center justify-center gap-4 border-2 border-jaipur-dark/20 font-bold ${addClass}`}
        >
            <span>{title}</span>
            <span className="relative z-10 w-5 h-5 flex items-center overflow-hidden">
                <span className="arrow text-lg inline-block transition-transform duration-300 group-hover:translate-x-1">
                    ➜
                </span>
            </span>
        </button>
    );
}