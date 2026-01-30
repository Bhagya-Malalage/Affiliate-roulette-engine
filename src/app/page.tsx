"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import BettingBoard from "@/components/BettingBoard";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const RouletteWheel = dynamic(() => import("@/components/RouletteWheel"), {
  ssr: false,
  loading: () => (
    <div className="w-[320px] h-[320px] bg-[#070b14] rounded-full mx-auto border-8 border-[#1f2937] shadow-[0_0_30px_rgba(0,0,0,0.5)]" />
  ),
});

const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

export default function Home() {
  const OFFICIAL_URL = "https://m.fun88ind.com/";

  const [balance, setBalance] = useState(1000);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [message, setMessage] = useState("SELECT A NUMBER TO BET");
  const [spinCount, setSpinCount] = useState(0);
  const [showPopup, setShowPopup] = useState<"none" | "win" | "final">("none");

  const logEvent = useMutation(api.analytics.logEvent);
  const BET_AMOUNT = 100;

  const riggedSequence = [true, true, false];

  const handleToggleNumber = (num: number) => {
    if (mustSpin || spinCount >= 3) return;
    setSelectedNumbers([num]);
    setMessage(`BET PLACED ON ${num}`);
  };

  const handleRedirect = (eventType: string) => {
    logEvent({ eventType }).catch(() => {});
    window.location.href = OFFICIAL_URL;
  };

  const handleSpin = () => {
    if (spinCount >= 3) {
      setShowPopup("final");
      return;
    }
    if (selectedNumbers.length === 0) {
      setMessage("⚠️ PLEASE SELECT A NUMBER");
      return;
    }

    const shouldWin = riggedSequence[spinCount];
    let prizeNumber;

    if (shouldWin) {
      prizeNumber = selectedNumbers[0];
    } else {
      prizeNumber = selectedNumbers[0] === 0 ? 32 : 0;
    }

    const prizeIndex = WHEEL_NUMBERS.indexOf(prizeNumber);
    const segmentAngle = 360 / 37;
    const targetAngle = prizeIndex * segmentAngle;

    const extraSpins = 360 * 8;
    const currentPos = rotation % 360;
    const nextRotation = rotation + extraSpins + (targetAngle - currentPos);

    setRotation(nextRotation);
    setMustSpin(true);
    setBalance((prev) => prev - BET_AMOUNT);
    setMessage("SPINNING...");

    logEvent({
      eventType: "spin_start",
      details: `Spin ${spinCount + 1}: Bet ${selectedNumbers[0]}`,
    }).catch((e) => console.error(e));
  };

  const handleSpinStop = () => {
    if (!mustSpin) return;

    setMustSpin(false);
    const currentIdx = spinCount;
    setSpinCount((prev) => prev + 1);

    const hasWon = riggedSequence[currentIdx];

    if (hasWon) {
      const winAmount = BET_AMOUNT * 35;
      setBalance((prev) => prev + winAmount);
      setMessage(`JACKPOT! YOU WON $${winAmount}`);
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#eab308", "#ffffff", "#00a3ff", "#ef4444"],
      });

      setTimeout(() => {
        if (currentIdx < 2) setShowPopup("win");
      }, 1000);
    } else {
      setMessage("LIMIT REACHED");
      setTimeout(() => setShowPopup("final"), 1200);
    }

    if (currentIdx < 2) {
      setSelectedNumbers([]);
    }
  };

  return (
    <main className="min-h-screen bg-[#050810] flex flex-col items-center pb-32 overflow-x-hidden text-white font-sans selection:bg-[#eab308]">
      {/* LIVE WINNERS TICKER */}
      <div className="w-full bg-[#00a3ff]/10 py-1 border-b border-[#00a3ff]/20 overflow-hidden">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap text-[10px] font-bold text-[#00a3ff] uppercase tracking-widest"
        >
          User id_8422 won $3,500 • User id_1933 won $1,250 • User id_0021 won
          $5,000 • User id_7721 won $3,500 • User id_9921 won $800
        </motion.div>
      </div>

      {/* HEADER */}
      <header className="w-full p-4 flex justify-between items-center max-w-5xl z-50">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-black italic tracking-tighter text-[#00a3ff] drop-shadow-[0_0_10px_#00a3ff]"
        >
          FUN88
        </motion.h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-[-4px]">
              Wallet
            </p>
            <p className="text-[#eab308] font-black text-xl drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">
              ${balance.toLocaleString()}
            </p>
          </div>
          <motion.button
            onClick={() => handleRedirect("header_join_click")}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-b from-[#fef3c7] via-[#eab308] to-[#92400e] text-black font-black px-6 py-2.5 rounded-lg shadow-[0_4px_15px_rgba(234,179,8,0.4)] hover:brightness-125 transition-all uppercase text-xs tracking-wider"
          >
            Join Now
          </motion.button>
        </div>
      </header>

      {/* HERO */}
      <div className="text-center mt-6 px-4 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -12, 0], // Larger movement range
            opacity: 1,
          }}
          transition={{
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.5 },
          }}
          className="bg-[#ef4444] text-white text-[10px] font-black py-1.5 px-6 rounded-full inline-block mb-4 tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-white/20 cursor-default"
        >
          🔥 Live Promo Active
        </motion.div>
        <h2 className="text-5xl md:text-7xl font-serif text-[#eab308] leading-tight drop-shadow-2xl mb-2">
          Spin to <span className="text-white italic">Win</span> <br />
          <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            488% BONUS
          </span>
        </h2>
      </div>

      {/* GAME CONSOLE */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mt-8 bg-gradient-to-b from-[#1a202c] to-[#0a0f1d] border border-white/10 rounded-[45px] p-7 w-full max-w-[440px] shadow-[0_0_80px_rgba(0,0,0,0.8),0_0_20px_rgba(0,163,255,0.1)] relative"
      >
        <RouletteWheel rotation={rotation} onStopSpinning={handleSpinStop} />

        <div className="text-center my-8">
          <div className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-2 font-black">
            Casino Message
          </div>
          <motion.div
            key={message}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xl font-black tracking-[0.1em] px-6 py-4 rounded-2xl bg-black/60 border border-white/10 shadow-inner ${message.includes("WON") ? "text-green-400 drop-shadow-[0_0_8px_#4ade80]" : "text-white"}`}
          >
            {message}
          </motion.div>
        </div>

        <BettingBoard
          selectedNumbers={selectedNumbers}
          onToggleNumber={handleToggleNumber}
        />

        <button
          onClick={handleSpin}
          disabled={mustSpin || spinCount >= 3}
          className="w-full mt-8 bg-gradient-to-b from-[#fef3c7] via-[#eab308] to-[#92400e] text-black font-black py-5 rounded-2xl shadow-[0_8px_0_#78350f,0_10px_20px_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-[0_4px_0_#78350f] transition-all uppercase tracking-widest text-2xl disabled:opacity-30 disabled:grayscale"
        >
          {spinCount >= 3 ? "LOCKED" : "PLACE BET"}
        </button>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={i < spinCount ? { scale: [1, 1.5, 1] } : {}}
                className={`w-4 h-4 rounded-full border-2 border-white/10 ${i < spinCount ? "bg-[#eab308] shadow-[0_0_15px_#eab308]" : "bg-gray-800"}`}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
            Spins Remaining: {3 - spinCount}
          </span>
        </div>
      </motion.div>

      {/* TRUST BADGES */}
      <div className="flex flex-wrap justify-center gap-8 mt-12 opacity-60 text-[10px] font-black tracking-widest uppercase text-gray-300">
        <div className="flex items-center gap-2">
          <span>⚡</span> FAST PAYOUT
        </div>
        <div className="flex items-center gap-2">
          <span>🛡️</span> LICENSED
        </div>
        <div className="flex items-center gap-2">
          <span>🔒</span> SECURE
        </div>
      </div>

      {/* POPUPS */}
      <AnimatePresence>
        {showPopup !== "none" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-[#1a202c] to-[#0a0f1d] border-2 border-[#eab308] p-10 rounded-[40px] max-w-sm text-center shadow-[0_0_100px_rgba(234,179,8,0.2)]"
            >
              <h3 className="text-4xl font-black text-[#eab308] mb-6 uppercase tracking-tighter drop-shadow-lg">
                {showPopup === "win" ? "UNBELIEVABLE!" : "SESSION LIMIT"}
              </h3>
              <p className="text-gray-300 mb-10 text-lg leading-relaxed font-medium">
                {showPopup === "win"
                  ? "You have an incredible winning streak! Don't let the luck cool down. Spin again now!"
                  : "You've hit the maximum demo win limit. Open a Real Account now to keep your winnings and get a 488% Bonus!"}
              </p>
              <button
                onClick={() => {
                  if (showPopup === "win") setShowPopup("none");
                  else handleRedirect("final_popup_claim");
                }}
                className="w-full bg-gradient-to-b from-[#fef3c7] via-[#eab308] to-[#92400e] text-black font-black py-6 rounded-[20px] text-xl uppercase shadow-2xl hover:brightness-110 transition-all"
              >
                {showPopup === "win" ? "NEXT SPIN" : "CLAIM BONUS NOW"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#050810] via-[#050810] to-transparent z-40">
        <motion.button
          onClick={() => handleRedirect("sticky_footer_deposit")}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-full max-w-lg mx-auto block bg-gradient-to-r from-[#00a3ff] to-[#0066ff] text-white font-black py-6 rounded-3xl shadow-[0_0_50px_rgba(0,163,255,0.4)] text-xl uppercase tracking-[0.1em] hover:brightness-110 transition-all"
        >
          🚀 DEPOSIT & START WINNING
        </motion.button>
      </div>
    </main>
  );
}
