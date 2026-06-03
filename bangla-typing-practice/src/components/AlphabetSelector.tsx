/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, BookOpen, ChevronRight, Play, Eye, ArrowLeft, Keyboard, Languages, Award } from "lucide-react";
import { Lesson } from "../types";
import { VOWELS_ALPHABET, CONSONANTS_ALPHABET, makeLessonFromAlphabet, AlphabetGroup } from "../data/alphabetPractice";
import { VOWELS_CONJUNCT, CONSONANTS_CONJUNCT } from "../data/conjunctPractice";
import { getBijoyKeystrokes } from "../utils/bijoy";

interface AlphabetSelectorProps {
  onSelectLesson: (lesson: Lesson) => void;
  onSwitchTab: (tab: "practice" | "game" | "alphabet") => void;
  sfxEnabled: boolean;
}

export const AlphabetSelector: React.FC<AlphabetSelectorProps> = ({
  onSelectLesson,
  onSwitchTab,
  sfxEnabled,
}) => {
  const [deckMode, setDeckMode] = useState<"simple" | "conjunct">("simple");
  const [activeGroup, setActiveGroup] = useState<"vowels" | "consonants">("vowels");
  const [selectedChar, setSelectedChar] = useState<AlphabetGroup | null>(null);

  const listToRender = deckMode === "simple"
    ? (activeGroup === "vowels" ? VOWELS_ALPHABET : CONSONANTS_ALPHABET)
    : (activeGroup === "vowels" ? VOWELS_CONJUNCT : CONSONANTS_CONJUNCT);

  const handleStartPractice = (group: AlphabetGroup) => {
    const lessonType = activeGroup === "vowels" ? "vowel" : "consonant";
    const lesson = makeLessonFromAlphabet(group, lessonType);
    if (deckMode === "conjunct") {
      lesson.id = `alphabet_conjunct_${lessonType}_${group.char}`;
      lesson.title = `পূর্ণাঙ্গ যুক্তবর্ণ অনুশীলন: '${group.char}'`;
      lesson.description = `'${group.char}' দিয়ে গঠিত চমৎকার যুক্তবর্ণ শব্দগুলোর টাইপিং প্র্যাক্টিস।`;
    }
    onSelectLesson(lesson);
    onSwitchTab("practice");
  };

  return (
    <div id="alphabet-selector-section" className="col-span-1 lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
      
      {/* Decorative ambient subtle gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {!selectedChar ? (
          // GRID VIEW OF ALPHABETS
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {/* Header Title */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] rounded-full uppercase tracking-wider font-mono">
                    অক্ষর ভিত্তিক শব্দকোষ {deckMode === "conjunct" ? "• যুক্তবর্ণ" : ""}
                  </span>
                  <Sparkles size={14} className="text-amber-500 animate-pulse" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white font-sans tracking-tight leading-none">
                  বর্ণভিত্তিক শব্দ অনুশীলন <span className="text-amber-500 font-extrabold font-sans">কার্ডস</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-2 font-sans font-medium max-w-2xl">
                  {deckMode === "simple" 
                    ? "প্রতিটি স্বরবর্ণ এবং ব্যঞ্জনবর্ণ দিয়ে গঠিত সাধারণ ও চমৎকার শব্দগুলোর ডেক প্র্যাক্টিস বা পর্যবেক্ষণ করুন।"
                    : "স্বরবর্ণযুক্ত যুক্তবর্ণ ও ব্যঞ্জনবর্ণের জটিল যুক্তবর্ণগুলোর বিশেষ ডেক প্র্যাক্টিস করুন।"
                  }
                </p>
              </div>

              {/* Toggles Container */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                {/* Deck Selector (Simple vs. Conjunct) */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800 rounded-2xl">
                  <button
                    id="switch-deck-simple-btn"
                    onClick={() => {
                      setDeckMode("simple");
                      setSelectedChar(null);
                    }}
                    className={`px-3 sm:px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer font-sans flex items-center justify-center gap-1.5 ${
                      deckMode === "simple"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-slate-405 dark:text-slate-405 hover:text-slate-805 dark:hover:text-slate-100"
                    }`}
                  >
                    <BookOpen size={13} />
                    সাধারণ শব্দ
                  </button>
                  <button
                    id="switch-deck-conjunct-btn"
                    onClick={() => {
                      setDeckMode("conjunct");
                      setSelectedChar(null);
                    }}
                    className={`px-3 sm:px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer font-sans flex items-center justify-center gap-1.5 ${
                      deckMode === "conjunct"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-slate-405 dark:text-slate-450 hover:text-slate-905 dark:hover:text-slate-100"
                    }`}
                  >
                    <Sparkles size={13} className="text-slate-950/10 dark:text-amber-400" />
                    যুক্তবর্ণ শব্দ
                  </button>
                </div>

                {/* Main Letters Selector (Vowels vs. Consonants) */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800 rounded-2xl">
                  <button
                    id="switch-vowels-btn"
                    onClick={() => {
                      setActiveGroup("vowels");
                      setSelectedChar(null);
                    }}
                    className={`px-3 sm:px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer font-sans flex items-center justify-center gap-1.5 ${
                      activeGroup === "vowels"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-slate-405 dark:text-slate-400 hover:text-slate-805 dark:hover:text-slate-100"
                    }`}
                  >
                    <Languages size={13} />
                    স্বরবর্ণ (Vowels)
                  </button>
                  <button
                    id="switch-consonants-btn"
                    onClick={() => {
                      setActiveGroup("consonants");
                      setSelectedChar(null);
                    }}
                    className={`px-3 sm:px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer font-sans flex items-center justify-center gap-1.5 ${
                      activeGroup === "consonants"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-slate-450 dark:text-slate-400 hover:text-slate-855 dark:hover:text-slate-100"
                    }`}
                  >
                    <Keyboard size={13} />
                    ব্যঞ্জনবর্ণ (Consonants)
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-50/50 dark:bg-slate-950/40 p-4 border border-slate-150 dark:border-slate-800/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                  <BookOpen size={18} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-sans">মোট ক্যাটাগরি কভার্ড</div>
                  <div className="text-sm font-black text-slate-800 dark:text-slate-200 font-sans">{listToRender.length}টি প্রধান বর্ণমালা</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Award size={18} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-sans">মোট অনুশীলনযোগ্য শব্দ</div>
                  <div className="text-sm font-black text-slate-800 dark:text-slate-200 font-sans">
                    {listToRender.reduce((acc, current) => acc + current.words.length, 0)}টি প্রমিত বাংলা শব্দ
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-550 dark:text-purple-400">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-sans">সাপোর্টেড কিবোর্ড লেআউট</div>
                  <div className="text-sm font-black text-slate-800 dark:text-slate-200 font-sans">অভ্র ফোনেটিক + বিজয় প্র্যাক্টিস</div>
                </div>
              </div>
            </div>

            {/* Grid of Alphabet Cards */}
            <div id="grid-alphabets-list" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {listToRender.map((group, index) => (
                <motion.div
                  key={group.char}
                  id={`alphabet-cell-${group.char}`}
                  onClick={() => setSelectedChar(group)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(10, index) * 0.03 }}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-white dark:hover:bg-slate-900/60 hover:dark:border-amber-500/40 hover:border-amber-400 shadow-sm cursor-pointer select-none relative group overflow-hidden transition-colors"
                >
                  {/* Subtle top horizontal accent */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-black font-sans px-2 py-0.5 bg-slate-200/60 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 rounded-full">
                      {group.words.length} শব্দ
                    </span>
                    <ChevronRight size={14} className="text-slate-350 dark:text-slate-500 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="text-center py-2">
                    {/* Big Bold letter display */}
                    <div className="text-4xl sm:text-5xl font-black font-sans text-slate-805 dark:text-white dark:group-hover:text-amber-400 group-hover:text-amber-600 transition-colors">
                      {group.char}
                    </div>
                  </div>

                  <div className="border-t border-slate-200/50 dark:border-slate-800/40 mt-3 pt-2.5 text-center">
                    <div className="text-[9px] text-slate-405 dark:text-slate-500 font-sans tracking-wide uppercase font-semibold mb-1">প্রাকদর্শন:</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-black truncate font-sans tracking-wide">
                      {group.words.slice(0, 3).join(", ")}...
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          // CARD DETAILS / ACTIVE WORD LIST MODAL VIEW
          <motion.div
            key="details-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative z-10"
          >
            {/* Header Actions */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-5 sm:mb-6">
              <button
                id="back-to-alphabet-grid"
                onClick={() => setSelectedChar(null)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-extrabold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors font-sans border border-slate-200 dark:border-slate-800 bg-slate-55 dark:bg-slate-950 rounded-xl cursor-pointer"
              >
                <ArrowLeft size={15} />
                তালিকায় ফিরে যান
              </button>

              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black tracking-widest font-sans uppercase">
                  {activeGroup === "vowels" ? "স্বরবর্ণমালা" : "ব্যঞ্জনবর্ণমালা"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Column: Big visual display */}
              <div className="col-span-1 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-between text-center min-h-[300px]">
                
                <div className="mt-2 text-slate-400 text-xs font-bold font-sans">অনুশীলনের জন্য নির্বাচিত বর্ণ</div>

                {/* Gigantic visual */}
                <div className="my-5 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-2xl shadow-amber-500/10 flex items-center justify-center border border-amber-400/20">
                  <div className="text-6xl sm:text-7xl font-sans font-black text-slate-950 leading-none">
                    {selectedChar.char}
                  </div>
                </div>

                <div className="w-full">
                  <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mb-1 font-sans">
                    {selectedChar.words.length}টি শব্দ
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-sans max-w-xs mx-auto mb-4">
                    ক্লিক করলেই শব্দগুলো প্রধান টাইপিং এরিনায় লোড হবে।
                  </p>
                  
                  <button
                    id="btn-play-selected-alphabet"
                    onClick={() => handleStartPractice(selectedChar)}
                    className="w-full py-4.5 bg-amber-500 text-slate-950 hover:bg-amber-400 font-sans font-black shadow-lg shadow-amber-500/5 rounded-2xl cursor-pointer flex items-center justify-center gap-2 group transform active:scale-95 transition-all text-sm uppercase tracking-wide"
                  >
                    <Play size={16} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                    টাইপিং অনুশীলন শুরু করুন
                  </button>
                </div>
              </div>

              {/* Right Column: List of Words with conversions */}
              <div className="col-span-1 lg:col-span-2 flex flex-col">
                <div className="flex items-center gap-1.5 mb-3">
                  <Eye size={15} className="text-amber-500" />
                  <h3 className="text-sm font-black font-sans uppercase text-slate-800 dark:text-white tracking-tight">
                    নিচের শব্দগুলো এই অনুশীলনে টাইপ করতে হবে:
                  </h3>
                </div>

                {/* Words display grid */}
                <div id="selected-alphabet-words-list" className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                  {selectedChar.words.map((word, wordIdx) => {
                    const phoneticAvro = selectedChar.phonetics[wordIdx];
                    const phoneticBijoy = getBijoyKeystrokes(word);

                    return (
                      <div
                        key={word}
                        className="p-3 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2 font-sans">
                          {/* Rich large word display */}
                          <div className="text-xl font-bold text-slate-805 dark:text-white">
                            {word}
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950/60 text-slate-400 group-hover:text-amber-500 font-mono">
                            #{wordIdx + 1}
                          </span>
                        </div>

                        {/* Phonetic key equivalents clues */}
                        <div className="flex flex-col gap-1.5 text-xs font-mono select-none mt-1">
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="font-sans font-extrabold text-[11px]">অভ্র (Phonetic keys):</span>
                            <span className="text-amber-600 dark:text-amber-400 font-black text-sm bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/10 tracking-wide">{phoneticAvro}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="font-sans font-extrabold text-[11px]">বিজয় (Bijoy layout):</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 tracking-wide">{phoneticBijoy}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Floating helpful footnote summary */}
                <div className="mt-5 border-t border-slate-200/50 dark:border-slate-800/40 pt-4 text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-sans font-semibold flex items-start gap-1.5">
                  <Sparkles size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    নির্দেশিকা: যেকোনো লেআউট ব্যবহার করেই অনুশীলন সম্ভব। আপনি যদি <b>অভ্র ফোনেটিক</b> ব্যবহার করেন, তবে শব্দের পাশের অভ্র কীস্ট্রোকে টাইপ করতে পারেন। আপনি যদি <b>বিজয় লেআউট</b> ব্যবহার করেন, তবে বিজয় কীগুলোর সমন্বয়ে লিখতে পারেন।
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
