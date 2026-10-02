"use client";

export default function SlotBtn({ title, addClass, onClick, able }) {
    return (
        <button onClick={onClick} disabled={able} className={`px-10 py-3  text-black rounded-lg transition-all duration-300 ease-in-out hover:bg-[#c14d26] hover:text-white hover:scale-105 hover:shadow-lg flex items-center gap-4 border ${addClass}`} >
            {title}
        </button>
    );
}