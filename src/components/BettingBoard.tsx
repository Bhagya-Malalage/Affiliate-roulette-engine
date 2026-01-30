"use client";

interface BoardProps {
  selectedNumbers: number[];
  onToggleNumber: (num: number) => void;
}

export default function BettingBoard({
  selectedNumbers,
  onToggleNumber,
}: BoardProps) {
  const reds = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];

  return (
    <div className="bg-[#0f172a] p-2 rounded-xl border border-[#1e293b] mt-4 shadow-inner">
      {/* Zero Button at Top */}
      <button
        onClick={() => onToggleNumber(0)}
        className={`w-full h-8 mb-1 rounded font-bold text-xs transition-all border border-green-900/50 ${
          selectedNumbers.includes(0)
            ? "bg-gradient-to-b from-yellow-300 to-yellow-600 text-black shadow-[0_0_15px_#eab308]"
            : "bg-[#064e3b] text-white opacity-80"
        }`}
      >
        0
      </button>

      <div className="grid grid-cols-6 gap-1">
        {[...Array(36)].map((_, i) => {
          const num = i + 1;
          const isRed = reds.includes(num);
          const isSelected = selectedNumbers.includes(num);

          return (
            <button
              key={num}
              onClick={() => onToggleNumber(num)}
              className={`
                h-9 w-full rounded font-black text-[10px] transition-all flex items-center justify-center
                ${
                  isSelected
                    ? "bg-gradient-to-b from-yellow-300 to-yellow-600 text-black scale-105 shadow-[0_0_15px_#eab308] z-10"
                    : isRed
                      ? "bg-[#ef4444] text-white border-b-2 border-red-800"
                      : "bg-[#1e293b] text-white border-b-2 border-black"
                }
              `}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
