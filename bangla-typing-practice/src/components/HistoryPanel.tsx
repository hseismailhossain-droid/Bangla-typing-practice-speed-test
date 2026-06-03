/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { History, Calendar, Trash2, ShieldAlert, Award } from "lucide-react";
import { SessionHistory } from "../types";

interface HistoryPanelProps {
  history: SessionHistory[];
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClearHistory }) => {
  const [showConfirm, setShowConfirm] = React.useState(false);

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "অজানা সময়";
    }
  };

  const getDifficultyBadgeColor = (diff: string) => {
    switch (diff) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 border border-green-500/10";
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-500/10";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 border border-red-500/10";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/10";
    }
  };

  return (
    <div id="history-panel-card" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-5 mt-4 relative overflow-hidden backdrop-blur-md">
      {/* Glow highlight */}
      <div className="absolute top-0 right-1/4 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent"></div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-505 rounded-xl text-indigo-550 dark:text-indigo-400">
            <History size={16} />
          </div>
          <h3 className="text-xs sm:text-sm font-black font-sans text-slate-800 dark:text-slate-100 uppercase tracking-tight">
            অনুশীলন ইতিহাস লগ (History)
          </h3>
        </div>
        {history.length > 0 && (
          <div className="flex items-center gap-1 sm:gap-2">
            {!showConfirm ? (
              <button
                id="btn-clear-history-trigger"
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all font-sans font-bold border border-rose-200/40 cursor-pointer"
              >
                <Trash2 size={12} />
                মুছে ফেলুন
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-500/10 dark:bg-rose-500/5 p-1 rounded-xl border border-rose-500/20 animate-scale-up">
                <span className="text-[10px] sm:text-xs text-rose-600 dark:text-rose-400 font-extrabold px-1.5 leading-none">
                  ডিলিট করবেন?
                </span>
                <button
                  id="btn-clear-confirm-yes"
                  onClick={() => {
                    onClearHistory();
                    setShowConfirm(false);
                  }}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  হ্যাঁ
                </button>
                <button
                  id="btn-clear-confirm-no"
                  onClick={() => setShowConfirm(false)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] text-slate-500 dark:text-slate-400 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  না
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div id="no-history-state" className="text-center py-6 px-4 flex flex-col items-center justify-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 text-slate-300 dark:text-slate-700 rounded-full mb-2">
            <ShieldAlert size={24} />
          </div>
          <p className="text-xs font-sans text-slate-400 dark:text-slate-500 leading-relaxed max-w-sm">
            কোনো অতীত রেকর্ডের হিস্ট্রি পাওয়া যায়নি। কোনো লেসন সফলভাবে শেষ করলে গতির রেকর্ড ও চার্ট সহ এখানে ডেটা যোগ হবে।
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans font-bold">
                <th className="py-2.5 px-2">তারিখ ও সময়</th>
                <th className="py-2.5 px-2">লেসনের নাম</th>
                <th className="py-2.5 px-2">অসুবিধা মাত্রা</th>
                <th className="py-2.5 px-2 text-right">টাইপিং গতি</th>
                <th className="py-2.5 px-2 text-right">নির্ভুলতা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-300">
              {[...history].reverse().slice(0, 10).map((session, index) => (
                <tr key={index} className="hover:bg-slate-50/70 dark:hover:bg-slate-950/30 transition-all">
                  <td className="py-3 px-2 text-slate-400 dark:text-slate-500 font-mono text-[10px] whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {formatDate(session.completedAt)}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-extrabold text-slate-800 dark:text-slate-150 max-w-[200px] truncate">
                    {session.lessonTitle}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wide ${getDifficultyBadgeColor(session.difficulty)}`}>
                      {session.difficulty === "beginner" ? "বেসিক" : session.difficulty === "intermediate" ? "শব্দ" : session.difficulty === "advanced" ? "অ্যাডভান্সড" : "কাস্টম"}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-black text-slate-900 dark:text-white font-mono">
                    <div className="flex items-center justify-end gap-1">
                      <Award size={11} className="text-amber-500" />
                      <span>{session.wpm} WPM</span>
                    </div>
                  </td>
                  <td className={`py-3 px-2 text-right font-extrabold font-mono ${
                    session.accuracy >= 90 ? "text-emerald-500" : session.accuracy >= 75 ? "text-amber-500" : "text-rose-500"
                  }`}>
                    {session.accuracy}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {history.length > 10 && (
            <div className="text-center pt-3 text-[10px] text-slate-400 dark:text-slate-500 font-sans border-t border-slate-100 dark:border-slate-807">
              * সাম্প্রতিক ১০টি অনুশীলনের হিস্ট্রি প্রদর্শন করা হচ্ছে (মোট সেশন: {history.length}টি)
            </div>
          )}
        </div>
      )}
    </div>
  );
};
