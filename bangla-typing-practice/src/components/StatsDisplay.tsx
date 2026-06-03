/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Zap, Award, CheckCircle2, AlertTriangle, Play, RefreshCw, BarChart2 } from "lucide-react";
import { TypingStats } from "../types";

interface StatsDisplayProps {
  stats: TypingStats;
  currentStreak: number;
  highestWpm: number;
  onReset: () => void;
  isCompleted: boolean;
  onNextLesson?: () => void;
  hasHistory: boolean;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  stats,
  currentStreak,
  highestWpm,
  onReset,
  isCompleted,
  onNextLesson,
  hasHistory,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.round(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Get color and feedback based on speed
  const getSpeedRating = (wpm: number) => {
    if (wpm < 20) return { label: "শিক্ষানবিস (Novice)", color: "text-slate-400 bg-slate-500/10", border: "border-slate-500/20" };
    if (wpm < 35) return { label: "মধ্যম (Average)", color: "text-amber-500 bg-amber-500/10", border: "border-amber-400/20" };
    if (wpm < 50) return { label: "পেশাদার (Advanced)", color: "text-emerald-500 bg-emerald-500/10", border: "border-emerald-400/20" };
    return { label: "বিদ্যুৎ গতি (Hyper-speed)", color: "text-indigo-500 bg-indigo-505/10", border: "border-indigo-400/20" };
  };

  const speedRating = getSpeedRating(stats.wpm);

  return (
    <div id="stats-display-wrapper" className="w-full flex flex-col gap-4">
      {/* Primary Stats Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
        {/* Speed Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 transition-all hover:translate-y-[-2px] hover:shadow-md">
          <div className="p-2 sm:p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
            <Zap size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-sans">
              টাইপিং গতি
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-sans mt-0.5 flex items-baseline gap-1">
              {stats.wpm} 
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">WPM</span>
            </div>
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 transition-all hover:translate-y-[-2px] hover:shadow-md">
          <div className="p-2 sm:p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Award size={22} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-sans">
              নির্ভুলতা
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-sans mt-0.5">
              {stats.accuracy}%
            </div>
          </div>
        </div>

        {/* Streak/Time Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 transition-all hover:translate-y-[-2px] hover:shadow-md">
          <div className="p-2 sm:p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-sans">
              সময় অতিবাহিত
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-sans mt-0.5">
              {formatTime(stats.timeSpentSecs)}
            </div>
          </div>
        </div>

        {/* Mistakes Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 transition-all hover:translate-y-[-2px] hover:shadow-md">
          <div className="p-2 sm:p-2.5 bg-rose-500/10 text-rose-500 rounded-xl">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-sans">
              ভুল সংখ্যা
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-sans mt-0.5 flex items-baseline gap-1">
              {stats.errorChars}
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">অক্ষর</span>
            </div>
          </div>
        </div>
      </div>

      {/* Speed Gauge Indicator */}
      {stats.wpm > 0 && (
        <div className={`p-2.5 rounded-xl border transition-all text-center text-xs font-semibold flex items-center justify-between px-4 ${speedRating.color} ${speedRating.border}`}>
          <div className="flex items-center gap-1.5 font-sans">
            <span className="h-2 w-2 rounded-full bg-current animate-pulse"></span>
            <span>লাইভ রেটিং:</span>
          </div>
          <span className="font-extrabold tracking-wide font-sans">{speedRating.label}</span>
        </div>
      )}

      {/* Completion Screen Block with Confetti Accent */}
      {isCompleted && (
        <div id="lesson-completed-card" className="w-full bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border-2 border-emerald-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-xl shadow-emerald-500/5 glow">
          <div className="flex items-center gap-3 px-1">
            <div className="p-3 bg-gradient-to-tr from-amber-400 to-amber-500 rounded-full text-slate-950 shadow-md animate-bounce">
              <Award size={28} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-amber-400 font-sans leading-snug">
                অসাধারণ! লেসন সম্পন্ন হয়েছে! 🎉
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-sans mt-1">
                আপনার চূড়ান্ত স্কোর: <strong className="text-slate-900 dark:text-white text-sm">{stats.wpm} WPM</strong> এবং{" "}
                <strong className="text-slate-900 dark:text-white text-sm">{stats.accuracy}% নির্ভুলতা</strong>!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
            <button
              id="btn-retry-lesson"
              onClick={onReset}
              className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-extrabold font-sans rounded-xl border border-slate-350 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-855 active:scale-95 transition-all text-center"
            >
              <RefreshCw size={14} />
              আবার দিন
            </button>
            {onNextLesson && (
              <button
                id="btn-next-lesson"
                onClick={onNextLesson}
                className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-extrabold font-sans rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer text-center"
              >
                <Play size={14} fill="currentColor" />
                পরবর্তী লেসন
              </button>
            )}
          </div>
        </div>
      )}

      {/* Record panel values */}
      <div className="grid grid-cols-2 gap-3 mt-1">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
            <Zap size={16} fill="currentColor" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-sans">
              রেকর্ড স্পিড
            </div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 font-sans mt-0.5">
              {highestWpm || stats.wpm} <span className="text-[10px] font-normal text-slate-400">WPM</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
            <BarChart2 size={16} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-sans">
              সম্পন্ন সেশন
            </div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 font-sans mt-0.5">
              {currentStreak} বার
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
