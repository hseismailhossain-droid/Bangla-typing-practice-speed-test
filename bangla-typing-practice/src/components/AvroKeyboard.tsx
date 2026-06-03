/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";

interface AvroKeyboardProps {
  activeKey: string | null;
  shiftPressed: boolean;
  layout?: "avro" | "bijoy";
}

interface KeyConfig {
  code: string;
  normalLabel: string;
  shiftLabel: string;
  banglaNormal: string;
  banglaShift: string;
  width?: string;
}

export const AvroKeyboard: React.FC<AvroKeyboardProps> = ({ activeKey, shiftPressed, layout = "avro" }) => {
  const [pressedCode, setPressedCode] = useState<string | null>(null);

  useEffect(() => {
    if (activeKey) {
      setPressedCode(activeKey);
    } else {
      setPressedCode(null);
    }
  }, [activeKey]);

  const isBijoy = layout === "bijoy";

  const row1: KeyConfig[] = isBijoy ? [
    { code: "Digit1", normalLabel: "1", shiftLabel: "!", banglaNormal: "১", banglaShift: "!" },
    { code: "Digit2", normalLabel: "2", shiftLabel: "@", banglaNormal: "২", banglaShift: "@" },
    { code: "Digit3", normalLabel: "3", shiftLabel: "#", banglaNormal: "৩", banglaShift: "#" },
    { code: "Digit4", normalLabel: "4", shiftLabel: "$", banglaNormal: "৪", banglaShift: "৳" },
    { code: "Digit5", normalLabel: "5", shiftLabel: "%", banglaNormal: "৫", banglaShift: "%" },
    { code: "Digit6", normalLabel: "6", shiftLabel: "^", banglaNormal: "৬", banglaShift: "^" },
    { code: "Digit7", normalLabel: "7", shiftLabel: "&", banglaNormal: "৭", banglaShift: "ঁ" },
    { code: "Digit8", normalLabel: "8", shiftLabel: "*", banglaNormal: "৮", banglaShift: "*" },
    { code: "Digit9", normalLabel: "9", shiftLabel: "(", banglaNormal: "৯", banglaShift: "(" },
    { code: "Digit0", normalLabel: "0", shiftLabel: ")", banglaNormal: "০", banglaShift: ")" },
    { code: "Minus", normalLabel: "-", shiftLabel: "_", banglaNormal: "-", banglaShift: "ঃ" },
    { code: "Equal", normalLabel: "=", shiftLabel: "+", banglaNormal: "=", banglaShift: "+" },
    { code: "Backspace", normalLabel: "Backspace", shiftLabel: "Backspace", banglaNormal: "মুছুন", banglaShift: "মুছুন", width: "flex-1" }
  ] : [
    { code: "Digit1", normalLabel: "1", shiftLabel: "!", banglaNormal: "১", banglaShift: "!" },
    { code: "Digit2", normalLabel: "2", shiftLabel: "@", banglaNormal: "২", banglaShift: "@" },
    { code: "Digit3", normalLabel: "3", shiftLabel: "#", banglaNormal: "৩", banglaShift: "#" },
    { code: "Digit4", normalLabel: "4", shiftLabel: "$", banglaNormal: "৪", banglaShift: "৳" },
    { code: "Digit5", normalLabel: "5", shiftLabel: "%", banglaNormal: "৫", banglaShift: "%" },
    { code: "Digit6", normalLabel: "6", shiftLabel: "^", banglaNormal: "৬", banglaShift: "ঁ" },
    { code: "Digit7", normalLabel: "7", shiftLabel: "&", banglaNormal: "৭", banglaShift: "&" },
    { code: "Digit8", normalLabel: "8", shiftLabel: "*", banglaNormal: "৮", banglaShift: "*" },
    { code: "Digit9", normalLabel: "9", shiftLabel: "(", banglaNormal: "৯", banglaShift: "(" },
    { code: "Digit0", normalLabel: "0", shiftLabel: ")", banglaNormal: "০", banglaShift: ")" },
    { code: "Minus", normalLabel: "-", shiftLabel: "_", banglaNormal: "-", banglaShift: "_" },
    { code: "Equal", normalLabel: "=", shiftLabel: "+", banglaNormal: "=", banglaShift: "+" },
    { code: "Backspace", normalLabel: "Backspace", shiftLabel: "Backspace", banglaNormal: "মুছুন", banglaShift: "মুছুন", width: "flex-1" }
  ];

  const row2: KeyConfig[] = isBijoy ? [
    { code: "KeyQ", normalLabel: "q", shiftLabel: "Q", banglaNormal: "ঙ", banglaShift: "ং" },
    { code: "KeyW", normalLabel: "w", shiftLabel: "W", banglaNormal: "য", banglaShift: "য়" },
    { code: "KeyE", normalLabel: "e", shiftLabel: "E", banglaNormal: "ড", banglaShift: "ঢ" },
    { code: "KeyR", normalLabel: "r", shiftLabel: "R", banglaNormal: "প", banglaShift: "ফ" },
    { code: "KeyT", normalLabel: "t", shiftLabel: "T", banglaNormal: "ট", banglaShift: "ঠ" },
    { code: "KeyY", normalLabel: "y", shiftLabel: "Y", banglaNormal: "চ", banglaShift: "ছ" },
    { code: "KeyU", normalLabel: "u", shiftLabel: "U", banglaNormal: "জ", banglaShift: "ঝ" },
    { code: "KeyI", normalLabel: "i", shiftLabel: "I", banglaNormal: "হ", banglaShift: "ঞ" },
    { code: "KeyO", normalLabel: "o", shiftLabel: "O", banglaNormal: "গ", banglaShift: "ঘ" },
    { code: "KeyP", normalLabel: "p", shiftLabel: "P", banglaNormal: "ড়", banglaShift: "ঢ়" },
    { code: "BracketLeft", normalLabel: "[", shiftLabel: "{", banglaNormal: "[", banglaShift: "{" },
    { code: "BracketRight", normalLabel: "]", shiftLabel: "}", banglaNormal: "]", banglaShift: "}" },
    { code: "Backslash", normalLabel: "\\", shiftLabel: "|", banglaNormal: "ৎ", banglaShift: "ঃ" }
  ] : [
    { code: "KeyQ", normalLabel: "q", shiftLabel: "Q", banglaNormal: "", banglaShift: "" },
    { code: "KeyW", normalLabel: "w", shiftLabel: "W", banglaNormal: "্ব", banglaShift: "্ব" },
    { code: "KeyE", normalLabel: "e", shiftLabel: "E", banglaNormal: "ে/এ", banglaShift: "এ" },
    { code: "KeyR", normalLabel: "r", shiftLabel: "R", banglaNormal: "র", banglaShift: "ড়" },
    { code: "KeyT", normalLabel: "t", shiftLabel: "T", banglaNormal: "ত/ৎ", banglaShift: "ট" },
    { code: "KeyY", normalLabel: "y", shiftLabel: "Y", banglaNormal: "য়/্য", banglaShift: "য়" },
    { code: "KeyU", normalLabel: "u", shiftLabel: "U", banglaNormal: "ু/উ", banglaShift: "ঊ/ূ" },
    { code: "KeyI", normalLabel: "i", shiftLabel: "I", banglaNormal: "ি/ই", banglaShift: "ঈ/ী" },
    { code: "KeyO", normalLabel: "o", shiftLabel: "O", banglaNormal: "অ", banglaShift: "ও/ো" },
    { code: "KeyP", normalLabel: "p", shiftLabel: "P", banglaNormal: "প", banglaShift: "প" },
    { code: "BracketLeft", normalLabel: "[", shiftLabel: "{", banglaNormal: "[", banglaShift: "{" },
    { code: "BracketRight", normalLabel: "]", shiftLabel: "}", banglaNormal: "]", banglaShift: "}" },
    { code: "Backslash", normalLabel: "\\", shiftLabel: "|", banglaNormal: "\\", banglaShift: "|" }
  ];

  const row3: KeyConfig[] = isBijoy ? [
    { code: "KeyA", normalLabel: "a", shiftLabel: "A", banglaNormal: "ৃ", banglaShift: "র্" },
    { code: "KeyS", normalLabel: "s", shiftLabel: "S", banglaNormal: "ু", banglaShift: "ূ" },
    { code: "KeyD", normalLabel: "d", shiftLabel: "D", banglaNormal: "ি", banglaShift: "ী" },
    { code: "KeyF", normalLabel: "f", shiftLabel: "F", banglaNormal: "া", banglaShift: "অ" },
    { code: "KeyG", normalLabel: "g", shiftLabel: "G", banglaNormal: "্", banglaShift: "।" },
    { code: "KeyH", normalLabel: "h", shiftLabel: "H", banglaNormal: "ব", banglaShift: "ভ" },
    { code: "KeyJ", normalLabel: "j", shiftLabel: "J", banglaNormal: "ক", banglaShift: "খ" },
    { code: "KeyK", normalLabel: "k", shiftLabel: "K", banglaNormal: "ত", banglaShift: "থ" },
    { code: "KeyL", normalLabel: "l", shiftLabel: "L", banglaNormal: "দ", banglaShift: "ধ" }, // ধ
    { code: "Semicolon", normalLabel: ";", shiftLabel: ":", banglaNormal: ";", banglaShift: ":" },
    { code: "Quote", normalLabel: "'", shiftLabel: '"', banglaNormal: "'", banglaShift: '"' },
    { code: "Enter", normalLabel: "Enter", shiftLabel: "Enter", banglaNormal: "এন্টার", banglaShift: "এন্টার", width: "w-20 sm:w-24" }
  ] : [
    { code: "KeyA", normalLabel: "a", shiftLabel: "A", banglaNormal: "া/আ", banglaShift: "আ" },
    { code: "KeyS", normalLabel: "s", shiftLabel: "S", banglaNormal: "স", banglaShift: "শ" },
    { code: "KeyD", normalLabel: "d", shiftLabel: "D", banglaNormal: "দ", banglaShift: "ড" },
    { code: "KeyF", normalLabel: "f", shiftLabel: "F", banglaNormal: "ফ", banglaShift: "ফ" },
    { code: "KeyG", normalLabel: "g", shiftLabel: "G", banglaNormal: "গ", banglaShift: "গ" },
    { code: "KeyH", normalLabel: "h", shiftLabel: "H", banglaNormal: "হ", banglaShift: "ঃ" },
    { code: "KeyJ", normalLabel: "j", shiftLabel: "J", banglaNormal: "জ", banglaShift: "জ্ঞ" },
    { code: "KeyK", normalLabel: "k", shiftLabel: "K", banglaNormal: "ক", banglaShift: "ক" },
    { code: "KeyL", normalLabel: "l", shiftLabel: "L", banglaNormal: "ল", banglaShift: "ল" },
    { code: "Semicolon", normalLabel: ";", shiftLabel: ":", banglaNormal: ";", banglaShift: ":" },
    { code: "Quote", normalLabel: "'", shiftLabel: '"', banglaNormal: "'", banglaShift: '"' },
    { code: "Enter", normalLabel: "Enter", shiftLabel: "Enter", banglaNormal: "এন্টার", banglaShift: "এন্টার", width: "w-20 sm:w-24" }
  ];

  const row4: KeyConfig[] = isBijoy ? [
    { code: "ShiftLeft", normalLabel: "Shift", shiftLabel: "Shift", banglaNormal: "শিফট", banglaShift: "শিফট", width: "w-16 sm:w-20" },
    { code: "KeyZ", normalLabel: "z", shiftLabel: "Z", banglaNormal: "্র", banglaShift: "্য" },
    { code: "KeyX", normalLabel: "x", shiftLabel: "X", banglaNormal: "ও", banglaShift: "ৌ" },
    { code: "KeyC", normalLabel: "c", shiftLabel: "C", banglaNormal: "ে", banglaShift: "ৈ" },
    { code: "KeyV", normalLabel: "v", shiftLabel: "V", banglaNormal: "র", banglaShift: "ল" },
    { code: "KeyB", normalLabel: "b", shiftLabel: "B", banglaNormal: "ন", banglaShift: "ণ" },
    { code: "KeyN", normalLabel: "n", shiftLabel: "N", banglaNormal: "স", banglaShift: "ষ" },
    { code: "KeyM", normalLabel: "m", shiftLabel: "M", banglaNormal: "ম", banglaShift: "শ" },
    { code: "Comma", normalLabel: ",", shiftLabel: "<", banglaNormal: ",", banglaShift: "<" },
    { code: "Period", normalLabel: ".", shiftLabel: ">", banglaNormal: "। / .", banglaShift: ">" },
    { code: "Slash", normalLabel: "/", shiftLabel: "?", banglaNormal: "/", banglaShift: "?" },
    { code: "ShiftRight", normalLabel: "Shift", shiftLabel: "Shift", banglaNormal: "শিফট", banglaShift: "শিফট", width: "flex-grow" }
  ] : [
    { code: "ShiftLeft", normalLabel: "Shift", shiftLabel: "Shift", banglaNormal: "শিফট", banglaShift: "শিফট", width: "w-16 sm:w-20" },
    { code: "KeyZ", normalLabel: "z", shiftLabel: "Z", banglaNormal: "য", banglaShift: "্য" },
    { code: "KeyX", normalLabel: "x", shiftLabel: "X", banglaNormal: "ক্স", banglaShift: "ক্স" },
    { code: "KeyC", normalLabel: "c", shiftLabel: "C", banglaNormal: "চ", banglaShift: "চ" },
    { code: "KeyV", normalLabel: "v", shiftLabel: "V", banglaNormal: "ভ", banglaShift: "ভ" },
    { code: "KeyB", normalLabel: "b", shiftLabel: "B", banglaNormal: "ব", banglaShift: "ব" },
    { code: "KeyN", normalLabel: "n", shiftLabel: "N", banglaNormal: "ন", banglaShift: "ণ" },
    { code: "KeyM", normalLabel: "m", shiftLabel: "M", banglaNormal: "ম", banglaShift: "ম" },
    { code: "Comma", normalLabel: ",", shiftLabel: "<", banglaNormal: ",", banglaShift: "<" },
    { code: "Period", normalLabel: ".", shiftLabel: ">", banglaNormal: "। / .", banglaShift: ">" },
    { code: "Slash", normalLabel: "/", shiftLabel: "?", banglaNormal: "/", banglaShift: "?" },
    { code: "ShiftRight", normalLabel: "Shift", shiftLabel: "Shift", banglaNormal: "শিফট", banglaShift: "শিফট", width: "flex-grow" }
  ];

  const renderKey = (key: KeyConfig) => {
    const isPressed = pressedCode?.toLowerCase() === key.code.toLowerCase() ||
      (key.code === "PrimarySpace" && pressedCode === "Space") ||
      (key.code === "ShiftLeft" && shiftPressed) ||
      (key.code === "ShiftRight" && shiftPressed);

    const isSystemKey = ["Backspace", "Enter", "ShiftLeft", "ShiftRight"].includes(key.code);

    return (
      <div
        id={`key-${key.code}`}
        key={key.code}
        className={`
          flex flex-col justify-between p-1.5 sm:p-2 rounded-xl text-xs font-sans select-none transition-all duration-100 ease-out h-[46px] sm:h-[58px]
          ${key.width || "flex-1"}
          relative overflow-hidden
          ${isPressed
            ? "bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-505/30 scale-[0.96] translate-y-[3px] border-b-[1px] border-amber-600 font-extrabold"
            : isSystemKey
              ? "bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 text-slate-700 dark:text-slate-350 border-b-[4px] border-slate-450 dark:border-slate-950 active:scale-95"
              : "bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800/80 border-b-[4px] border-slate-300 dark:border-b-slate-955 active:scale-95 hover:from-white hover:to-white dark:hover:from-slate-850 dark:hover:to-slate-900"
          }
        `}
      >
        {/* Soft atmospheric LED illumination behind active key */}
        {isPressed && (
          <span className="absolute inset-0 bg-amber-400/20 blur-sm rounded-xl"></span>
        )}

        {/* Phonetic key (English character) */}
        <div className="flex justify-between items-center w-full relative z-10">
          <span className={`text-[9.5px] sm:text-[11.5px] font-bold ${isPressed ? "text-slate-950/80" : "text-slate-400 dark:text-slate-500"}`}>
            {shiftPressed ? key.shiftLabel : key.normalLabel}
          </span>
          {key.code === "Digit4" && !isPressed && (
            <span className="text-[9px] text-emerald-500 font-bold font-mono">$</span>
          )}
        </div>

        {/* Transliterated Bangla Letter */}
        <div className="text-right font-black self-end text-[12.5px] sm:text-[16px] font-sans tracking-wide relative z-10">
          {shiftPressed ? key.banglaShift : key.banglaNormal}
        </div>
      </div>
    );
  };

  return (
    <div id="avro-keyboard-wrapper" className="w-full bg-slate-100/90 dark:bg-slate-900/60 p-3 sm:p-5 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-xl max-w-4xl mx-auto backdrop-blur-md relative overflow-hidden">
      {/* Light glow pattern inside keyboard container */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>

      {/* Keyboard Header / Live Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1 pb-2 border-b border-slate-200 dark:border-slate-800/70">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <h3 className="text-[11px] font-bold font-sans text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {isBijoy ? "ভার্চুয়াল বিজয় কীবোর্ড লেআউট (Virtual Bijoy Keyboard)" : "ভার্চুয়াল অভ্র লেআউট (Virtual Phonetic Keyboard)"}
          </h3>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold transition-all duration-200 ${shiftPressed ? "bg-amber-500 text-slate-950 shadow-sm" : "bg-slate-200 dark:bg-slate-800 text-slate-550"}`}>
            SHIFT
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-slate-200 dark:bg-slate-800 text-slate-550 tracking-wider">
            {isBijoy ? "SUTONNYMJ / BIJOY" : "HIND SILIGURI"}
          </span>
        </div>
      </div>

      {/* Grid containing Rows */}
      <div className="flex flex-col gap-1 sm:gap-1.5">
        <div className="flex gap-0.5 sm:gap-1 w-full">
          {row1.map(renderKey)}
        </div>

        <div className="flex gap-0.5 sm:gap-1 w-full pl-1 sm:pl-2">
          {row2.map(renderKey)}
        </div>

        <div className="flex gap-0.5 sm:gap-1 w-full pl-2 sm:pl-4">
          {row3.map(renderKey)}
        </div>

        <div className="flex gap-0.5 sm:gap-1 w-full">
          {row4.map(renderKey)}
        </div>

        {/* Spacebar Row */}
        <div className="flex justify-center w-full pt-1.5">
          <div
            id="key-Space"
            className={`
              h-[46px] sm:h-[58px] w-[50%] sm:w-[45%] rounded-xl flex items-center justify-center font-sans font-extrabold text-[12px] sm:text-[13px] transition-all duration-100 select-none relative overflow-hidden
              ${pressedCode === "Space"
                ? "bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 translate-y-[3px] border-b-[1px] border-amber-600 shadow-md scale-[0.98]"
                : "bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 text-slate-500 dark:text-slate-405 border border-slate-200 dark:border-slate-800 border-b-[4px] border-slate-300 dark:border-b-slate-955 hover:from-white hover:to-white dark:hover:from-slate-850 dark:hover:to-slate-900 active:scale-95"
              }
            `}
          >
            {pressedCode === "Space" && (
              <span className="absolute inset-0 bg-amber-400/20 blur-sm rounded-xl"></span>
            )}
            স্পেসবার (Spacebar)
          </div>
        </div>
      </div>

      {/* Helper Legend */}
      {isBijoy ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mt-3 text-[11px] text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-200 dark:border-slate-800/60 px-1 font-sans leading-relaxed">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 font-bold">g</kbd> +
            <kbd className="px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 font-bold">f/d/c...</kbd>
            <span>দিয়ে স্বাধীন স্বরবর্ণ করুন (আ, ই, এ...)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 font-bold">c</kbd> /
            <kbd className="px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 font-bold">d</kbd>
            <span>স্বরচিহ্ন ব্যঞ্জনবর্ণের আগে টাইপ করুন (ে, ি...)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 font-bold">g</kbd>
            <span>যুক্তাক্ষর বা লিঙ্ক কী হিসাবে ব্যবহৃত হয় (ক + g + ক = ক্ক)</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mt-3 text-[11px] text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-200 dark:border-slate-800/60 px-1 font-sans">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 font-bold">T</kbd>
            <span>দিয়ে <strong className="text-slate-700 dark:text-slate-200 font-extrabold text-xs">ট</strong> এবং</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 font-bold">t</kbd>
            <span>দিয়ে <strong className="text-slate-700 dark:text-slate-200 font-extrabold text-xs">ত</strong> হয়।</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 font-bold">g + g</kbd>
            <span>যুক্তাক্ষর তৈরি করে (যেমন: <strong className="text-slate-700 dark:text-slate-200 font-extrabold text-xs">গ্ধ</strong>)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 font-bold">y</kbd> /
            <kbd className="px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 font-bold">Z</kbd>
            <span>দিলে <strong className="text-slate-700 dark:text-slate-200 font-extrabold text-xs">য-ফলা (্য)</strong> যুক্ত হয়।</span>
          </div>
        </div>
      )}
    </div>
  );
};
