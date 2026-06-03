/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { Lesson, LessonDifficulty } from "../types";
import { BUILTIN_LESSONS } from "../data/lessons";

interface LessonSelectorProps {
  currentLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
}

export const LessonSelector: React.FC<LessonSelectorProps> = ({
  currentLessonId,
  onSelectLesson,
}) => {
  const [activeTab, setActiveTab] = useState<LessonDifficulty>("beginner");

  const filterLessons = (difficulty: LessonDifficulty) => {
    return BUILTIN_LESSONS.filter((l) => l.difficulty === difficulty);
  };

  return (
    <div id="lesson-selector-container" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-5 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-400 to-amber-600"></div>

      {/* Selector Header */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="text-amber-500 animate-pulse" size={20} />
        <h3 className="text-sm sm:text-base font-black font-sans text-slate-800 dark:text-white uppercase tracking-tight">
          অধ্যায় বাছাই করুন (Lessons)
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 mb-5 gap-1">
        {(["beginner", "intermediate", "advanced"] as LessonDifficulty[]).map((diff) => (
          <button
            key={diff}
            id={`tab-button-${diff}`}
            onClick={() => setActiveTab(diff)}
            className={`
              flex-1 min-w-[70px] text-center pb-2.5 pt-1 text-[11px] sm:text-xs font-bold capitalize border-b-2 transition-all font-sans duration-200
              ${activeTab === diff
                ? "border-amber-500 text-amber-500 font-extrabold"
                : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-205"
              }
            `}
          >
            {diff === "beginner" ? "বেসিক" : diff === "intermediate" ? "শব্দ" : "উচ্চস্তর"}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="min-h-[220px]">
        <div className="flex flex-col gap-3">
          {filterLessons(activeTab).map((lesson) => {
            const isSelected = currentLessonId === lesson.id;
            return (
              <div
                key={lesson.id}
                id={`lesson-card-${lesson.id}`}
                onClick={() => onSelectLesson(lesson)}
                className={`
                  p-3.5 rounded-xl border transition-all cursor-pointer select-none group flex flex-col justify-between relative overflow-hidden
                  ${isSelected
                    ? "border-amber-500 bg-amber-500/5 dark:bg-amber-500/10 shadow-md shadow-amber-500/5 translate-x-1"
                    : "border-slate-200 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/45"
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute right-0 top-0 w-8 h-8 bg-amber-500 text-slate-950 flex items-center justify-center rounded-bl-xl font-bold text-[10px]">
                    LIVE
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors font-sans flex items-center gap-1.5">
                      <BookOpen size={14} className={isSelected ? "text-amber-500" : "text-slate-400"} />
                      {lesson.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-snug font-sans mb-2.5">
                    {lesson.description}
                  </p>
                </div>
                
                {/* Micro Preview of Content */}
                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-2 mt-auto">
                  <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans mb-1 font-semibold">
                    লেসন পাঠ্য সংক্ষেপ:
                  </div>
                  <div className="text-[11px] font-bold text-slate-705 dark:text-slate-300 truncate font-sans">
                    {lesson.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
