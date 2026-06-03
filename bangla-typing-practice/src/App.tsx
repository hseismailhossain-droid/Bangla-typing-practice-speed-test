/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  RefreshCw, 
  Sparkles, 
  Upload, 
  Eye, 
  EyeOff, 
  Laptop, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Keyboard as KeyboardIcon,
  Flame,
  Award
} from "lucide-react";
import { convertToAvro, getPerfectAvroPhonetic } from "./utils/avro";
import { convertToBijoy, getBijoyKeystrokes } from "./utils/bijoy";
import { Lesson, TypingStats, SessionHistory } from "./types";
import { BUILTIN_LESSONS } from "./data/lessons";
import { AvroKeyboard } from "./components/AvroKeyboard";
import { LessonSelector } from "./components/LessonSelector";
import { StatsDisplay } from "./components/StatsDisplay";
import { HistoryPanel } from "./components/HistoryPanel";
import { playKeyClick } from "./utils/sound";
import { TypingGameModule } from "./components/TypingGameModule";
import { AlphabetSelector } from "./components/AlphabetSelector";
import { CertificateGenerator } from "./components/CertificateGenerator";

export default function App() {
  // Lessons State
  const [activeLesson, setActiveLesson] = useState<Lesson>(BUILTIN_LESSONS[0]);

  // Split Words list for comparison
  const targetWords = activeLesson.content.trim().split(/\s+/);

  // Typing Active Tracker
  const [pastEnglishWords, setPastEnglishWords] = useState<string[]>([]);
  const [currentWordTyped, setCurrentWordTyped] = useState<string>("");
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);

  // Statistics
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [highestWpm, setHighestWpm] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);

  // Sound & Theme customizations
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Typing Mode ("avro" | "bijoy")
  const [typingMode, setTypingMode] = useState<"avro" | "bijoy">("avro");

  // Active Tab Mode ("practice" | "game" | "alphabet" | "certificate")
  const [activeTab, setActiveTab] = useState<"practice" | "game" | "alphabet" | "certificate">("practice");

  // Custom interactive modes requested by user
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"paragraph" | "focus">("focus");

  // Keyboard Assist states
  const [activeKeyCode, setActiveKeyCode] = useState<string | null>(null);
  const [shiftPressed, setShiftPressed] = useState<boolean>(false);
  const [showPhoneticHints, setShowPhoneticHints] = useState<boolean>(true);

  // References
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load localStorage data on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("avro_typing_history");
      const savedRecordWpm = localStorage.getItem("avro_typing_highest_wpm");
      const savedStreak = localStorage.getItem("avro_typing_streak");
      const savedSfx = localStorage.getItem("avro_sfx_enabled");
      const savedTheme = localStorage.getItem("avro_theme") || "dark";
      const savedAutoAdvance = localStorage.getItem("avro_auto_advance");
      const savedViewMode = localStorage.getItem("avro_view_mode");
      const savedTypingMode = localStorage.getItem("avro_typing_mode");

      if (savedHistory) {
        setSessionHistory(JSON.parse(savedHistory));
      }
      if (savedRecordWpm) {
        setHighestWpm(parseInt(savedRecordWpm, 10));
      }
      if (savedStreak) {
        setCurrentStreak(parseInt(savedStreak, 10));
      }
      if (savedSfx !== null) {
        setSfxEnabled(savedSfx === "true");
      }
      if (savedAutoAdvance !== null) {
        setAutoAdvance(savedAutoAdvance === "true");
      }
      if (savedViewMode !== null) {
        setViewMode(savedViewMode as "paragraph" | "focus");
      }
      if (savedTypingMode !== null) {
        setTypingMode(savedTypingMode as "avro" | "bijoy");
      }
      setTheme(savedTheme as "light" | "dark");
    } catch (e) {
      console.warn("Could not read localStorage parameters", e);
    }
  }, []);

  // Theme apply side effect
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Timer Controller
  useEffect(() => {
    if (isPracticing && !isCompleted) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPracticing, isCompleted]);

  // Focus input automatically on load or lesson change
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeLesson]);

  // Keyboard hook listeners to animate virtual keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setActiveKeyCode(e.code);
      if (e.shiftKey) {
        setShiftPressed(true);
      }
      // Autofocus typing element if they start typing blindly
      if (document.activeElement !== inputRef.current && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        inputRef.current?.focus();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeyCode(null);
      if (!e.shiftKey) {
        setShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Resets the state for an active lesson
  const resetStats = () => {
    setPastEnglishWords([]);
    setCurrentWordTyped("");
    setActiveWordIndex(0);
    setSecondsElapsed(0);
    setIsPracticing(false);
    setIsCompleted(false);
    if (sfxEnabled) playKeyClick("space");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setPastEnglishWords([]);
    setCurrentWordTyped("");
    setActiveWordIndex(0);
    setSecondsElapsed(0);
    setIsPracticing(false);
    setIsCompleted(false);
    if (sfxEnabled) playKeyClick("success");
  };

  const convertText = (englishText: string): string => {
    return typingMode === "avro" ? convertToAvro(englishText) : convertToBijoy(englishText);
  };

  const getHintForWord = (word: string, index: number) => {
    if (typingMode === "bijoy") {
      return getBijoyKeystrokes(word);
    } else {
      let ph = "";
      if (activeLesson.expectedPhonetic) {
        ph = activeLesson.expectedPhonetic.split(/\s+/)[index] || "";
      }
      // If the static phonetic doesn't produce the exact target word, fall back to our perfect dynamic generator!
      if (!ph || convertToAvro(ph) !== word) {
        ph = getPerfectAvroPhonetic(word);
      }
      return ph;
    }
  };

  // Typing calculation metrics helper
  const calculateCorrectChars = () => {
    let count = 0;
    
    // 1. Process fully committed past words
    pastEnglishWords.forEach((eng, idx) => {
      const bangla = convertText(eng);
      const target = targetWords[idx] || "";
      for (let c = 0; c < Math.min(bangla.length, target.length); c++) {
        if (bangla[c] === target[c]) {
          count++;
        }
      }
      // Count space as correct if words match fully
      if (bangla === target && idx < targetWords.length) {
        count++;
      }
    });

    // 2. Process current active word characters
    const currentBangla = convertText(currentWordTyped);
    const activeTarget = targetWords[activeWordIndex] || "";
    for (let c = 0; c < Math.min(currentBangla.length, activeTarget.length); c++) {
      if (currentBangla[c] === activeTarget[c]) {
        count++;
      }
    }

    return count;
  };

  const calculateTotalTypedChars = () => {
    let total = 0;
    pastEnglishWords.forEach((eng) => {
      total += convertText(eng).length + 1; // +1 space
    });
    total += convertText(currentWordTyped).length;
    return total;
  };

  const correctChars = calculateCorrectChars();
  const totalTyped = calculateTotalTypedChars();

  const currentWpm = (() => {
    const min = secondsElapsed > 0 ? secondsElapsed / 60 : (1 / 60);
    return Math.max(0, Math.round((correctChars / 5) / min));
  })();

  const currentAccuracy = (() => {
    if (totalTyped === 0) return 100;
    return Math.min(100, Math.round((correctChars / totalTyped) * 100));
  })();

  // Handle typing input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    const val = e.target.value;

    // Start timer on first keypress
    if (!isPracticing && val.length > 0) {
      setIsPracticing(true);
    }

    const currentTarget = targetWords[activeWordIndex] || "";
    const parsedBanglaCurrent = convertText(val);

    // If auto-advance is enabled AND user successfully types the exact active word / character,
    // we automatically advance to the next index without requiring an ending spacebar!
    if (autoAdvance && parsedBanglaCurrent === currentTarget) {
      if (sfxEnabled) playKeyClick("space");
      const updatedPast = [...pastEnglishWords, val];
      setPastEnglishWords(updatedPast);
      setCurrentWordTyped("");
      
      const nextIndex = activeWordIndex + 1;
      setActiveWordIndex(nextIndex);

      if (nextIndex >= targetWords.length) {
        completeLesson(updatedPast, "");
      }
      return;
    }

    // Process Word boundaries space bar
    if (val.endsWith(" ")) {
      const cleaned = val.slice(0, -1);
      if (cleaned.length > 0) {
        if (sfxEnabled) playKeyClick("space");
        // Commit word and advance
        const updatedPast = [...pastEnglishWords, cleaned];
        setPastEnglishWords(updatedPast);
        setCurrentWordTyped("");
        
        const nextIndex = activeWordIndex + 1;
        setActiveWordIndex(nextIndex);

        // Check completion condition
        if (nextIndex >= targetWords.length) {
          completeLesson(updatedPast, "");
        }
      }
    } else {
      if (sfxEnabled && val.length > currentWordTyped.length) {
        playKeyClick("normal");
      }
      setCurrentWordTyped(val);

      // Handle direct character matching for single character words or end of lesson without training space
      if (activeWordIndex === targetWords.length - 1) {
        if (parsedBanglaCurrent === currentTarget) {
          completeLesson(pastEnglishWords, val);
        }
      }
    }
  };

  // Intercept special keyboard behaviors (backspaces crossing word limits)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    if (e.key === "Backspace") {
      if (sfxEnabled) playKeyClick("backspace");
      
      if (currentWordTyped.length === 0 && activeWordIndex > 0) {
        e.preventDefault();
        // Go back to the previous word
        const prevWord = pastEnglishWords[pastEnglishWords.length - 1];
        setPastEnglishWords(pastEnglishWords.slice(0, -1));
        setCurrentWordTyped(prevWord);
        setActiveWordIndex((prev) => prev - 1);
      }
    }
  };

  // Completion logging and localStorage persistence state
  const completeLesson = (completedPast: string[], completedCurrent: string) => {
    setIsCompleted(true);
    setIsPracticing(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (sfxEnabled) playKeyClick("success");

    // Re-verify exact numbers
    let finalCorrect = 0;
    completedPast.forEach((eng, idx) => {
      const b = convertText(eng);
      const t = targetWords[idx] || "";
      for (let c = 0; c < Math.min(b.length, t.length); c++) {
        if (b[c] === t[c]) finalCorrect++;
      }
      if (b === t) finalCorrect++; // space
    });

    if (completedCurrent.length > 0) {
      const b = convertText(completedCurrent);
      const t = targetWords[activeWordIndex] || "";
      for (let c = 0; c < Math.min(b.length, t.length); c++) {
        if (b[c] === t[c]) finalCorrect++;
      }
    }

    let finalTotal = 0;
    completedPast.forEach((eng) => {
      finalTotal += convertText(eng).length + 1;
    });
    if (completedCurrent.length > 0) {
      finalTotal += convertText(completedCurrent).length;
    }

    const elapsedMins = secondsElapsed > 0 ? secondsElapsed / 60 : (1 / 60);
    const finalWpm = Math.max(1, Math.round((finalCorrect / 5) / elapsedMins));
    const finalAccuracy = finalTotal > 0 ? Math.min(100, Math.round((finalCorrect / finalTotal) * 100)) : 100;

    // Update Streak
    const nextStreak = currentStreak + 1;
    setCurrentStreak(nextStreak);
    localStorage.setItem("avro_typing_streak", nextStreak.toString());

    // Update Record Speed (WPM)
    if (finalWpm > highestWpm) {
      setHighestWpm(finalWpm);
      localStorage.setItem("avro_typing_highest_wpm", finalWpm.toString());
    }

    // Save session logs
    const newSession: SessionHistory = {
      id: "session_" + Date.now(),
      lessonId: activeLesson.id,
      lessonTitle: activeLesson.title,
      difficulty: activeLesson.difficulty,
      wpm: finalWpm,
      accuracy: finalAccuracy,
      timeSpentSecs: secondsElapsed,
      completedAt: new Date().toISOString(),
    };

    const updatedHistory = [...sessionHistory, newSession];
    setSessionHistory(updatedHistory);
    localStorage.setItem("avro_typing_history", JSON.stringify(updatedHistory));
  };

  const handleClearHistory = () => {
    localStorage.removeItem("avro_typing_history");
    localStorage.removeItem("avro_typing_streak");
    localStorage.removeItem("avro_typing_highest_wpm");
    setSessionHistory([]);
    setCurrentStreak(0);
    setHighestWpm(0);
  };

  // Select next lesson item in order
  const handleNextLesson = () => {
    const list = BUILTIN_LESSONS;
    const currentIndex = list.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex !== -1 && currentIndex < list.length - 1) {
      handleSelectLesson(list[currentIndex + 1]);
    } else {
      handleSelectLesson(list[0]);
    }
  };

  // Toggle audio clicking effects
  const toggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    localStorage.setItem("avro_sfx_enabled", next.toString());
    if (next) playKeyClick("normal");
  };

  // Toggle light-dark themes
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("avro_theme", next);
  };

  // Progress Bar percentage calculation
  const progressPercent = Math.min(100, Math.round((activeWordIndex / targetWords.length) * 100));

  return (
    <div id="main-interface-root" className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-12 relative overflow-hidden">
      
      {/* Background ambient mesh elements for ultra-styled look */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Top Stylish Global Banner Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/70 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo with high contrast branding */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-900 font-black text-xl shadow-lg shadow-amber-500/20 active:rotate-12 transition-transform duration-300">
              অ
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight font-sans text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                Bangla Typing Practice
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-extrabold font-sans mt-1">
                {typingMode === "avro" ? "অভ্র ফোনেটিক লেআউট" : "বিজয় কিবোর্ড লেআউট"}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Direct SFX Control */}
            <button
              id="toggle-sfx-btn"
              onClick={toggleSfx}
              className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-bold ${
                sfxEnabled 
                  ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title="কী-বোর্ড ক্লিক শব্দ নিয়ন্ত্রণ করুন"
            >
              {sfxEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="hidden sm:inline">সাউন্ড {sfxEnabled ? "চালু" : "বন্ধ"}</span>
            </button>

            {/* Hint Qs Toggle */}
            <button
              id="toggle-hints-btn"
              onClick={() => setShowPhoneticHints(!showPhoneticHints)}
              className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-bold ${
                showPhoneticHints 
                  ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-250"
              }`}
              title="ইংরেজি প্রতিশব্দ সহায়ক গাইড"
            >
              {showPhoneticHints ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="hidden md:inline">সহায়ক গাইড</span>
            </button>

            {/* Custom Theme Switcher */}
            <button
              id="toggle-theme-btn"
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
              title="থিম পরিবর্তন"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-extrabold shadow-inner">
              <Laptop size={13} className="text-amber-500 animate-pulse" />
              <span>লোকাল রানটাইম</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Capsule Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6">
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-md">
          <button
            onClick={() => {
              setActiveTab("practice");
              if (sfxEnabled) playKeyClick("space");
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "practice"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <BookOpen size={15} />
            <span>প্র্যাক্টিস লেসন</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("game");
              if (sfxEnabled) playKeyClick("space");
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "game"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Flame size={15} className="text-current animate-bounce" />
            <span>১-১০০ লেভেল গেম (Arcade)</span>
          </button>
          <button
            id="tab-btn-alphabet"
            onClick={() => {
              setActiveTab("alphabet");
              if (sfxEnabled) playKeyClick("space");
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "alphabet"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Award size={15} />
            <span>বর্ণভিত্তিক অনুশীলন (Cards)</span>
          </button>
          <button
            id="tab-btn-certificate"
            onClick={() => {
              setActiveTab("certificate");
              if (sfxEnabled) playKeyClick("space");
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "certificate"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles size={15} />
            <span>সনদপত্র (Certificate)</span>
          </button>
        </div>
      </div>

      {/* Main Container Dashboard */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-5 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {activeTab === "game" ? (
          <TypingGameModule
            typingMode={typingMode}
            sfxEnabled={sfxEnabled}
            theme={theme}
            showPhoneticHints={showPhoneticHints}
          />
        ) : activeTab === "alphabet" ? (
          <AlphabetSelector
            onSelectLesson={(lesson) => {
              setActiveLesson(lesson);
              resetStats();
              setTimeout(() => {
                inputRef.current?.focus();
              }, 100);
            }}
            onSwitchTab={setActiveTab}
            sfxEnabled={sfxEnabled}
          />
        ) : activeTab === "certificate" ? (
          <CertificateGenerator
            history={sessionHistory}
            highestWpm={highestWpm}
            currentStreak={currentStreak}
            onNavigateToPractice={() => setActiveTab("practice")}
            sfxEnabled={sfxEnabled}
          />
        ) : (
          <>
            {/* Left column - The Typing Arena & Keyboard */}
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          
          {/* Typing Arena Card */}
          <div id="typing-arena-card" className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

            {/* Typing card title info */}
            <div className="px-5 py-4.5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/20 dark:bg-slate-950/20">
              <div className="flex items-center gap-2">
                <span className="p-1 px-3 rounded-full bg-amber-500/15 text-amber-505 dark:text-amber-400 text-xs font-black tracking-wide font-sans flex items-center gap-1">
                  <Flame size={12} className="text-amber-500 animate-bounce" />
                  অধ্যায়: {activeLesson.title}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold font-sans">
                মোট শব্দ: {targetWords.length}টি • স্পিড: {currentWpm} WPM
              </div>
            </div>

            {/* Micro progress line */}
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-950">
              <div
                className="h-full bg-gradient-to-r from-amber-405 to-amber-500 transition-all duration-350 ease-out shadow-sm"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Visual Customizers Sub-Bar */}
            <div className="px-4 py-2 border-b border-slate-150 dark:border-slate-800/50 bg-slate-100/10 dark:bg-slate-950/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              
              {/* Interactive Typing Layout Controls */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold font-sans">কীবোর্ড লেআউট:</span>
                <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <button
                    id="select-layout-avro"
                    onClick={() => {
                      setTypingMode("avro");
                      localStorage.setItem("avro_typing_mode", "avro");
                      resetStats();
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-extrabold font-sans transition-all cursor-pointer ${
                      typingMode === "avro"
                        ? "bg-amber-500 text-slate-950 shadow-sm font-black animate-scale-up"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"
                    }`}
                  >
                    অভ্র (Phonetic)
                  </button>
                  <button
                    id="select-layout-bijoy"
                    onClick={() => {
                      setTypingMode("bijoy");
                      localStorage.setItem("avro_typing_mode", "bijoy");
                      resetStats();
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-extrabold font-sans transition-all cursor-pointer ${
                      typingMode === "bijoy"
                        ? "bg-amber-500 text-slate-950 shadow-sm font-black animate-scale-up"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"
                    }`}
                  >
                    বিজয় (Bijoy)
                  </button>
                </div>
              </div>

              {/* Interactive View Mode Controls */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold font-sans">ডিসপ্লে মোড:</span>
                <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <button
                    id="select-view-mode-paragraph"
                    onClick={() => {
                      setViewMode("paragraph");
                      localStorage.setItem("avro_view_mode", "paragraph");
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-extrabold font-sans transition-all cursor-pointer ${
                      viewMode === "paragraph"
                        ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-855 dark:hover:text-slate-200"
                    }`}
                  >
                    সব শব্দ এক সাথে
                  </button>
                  <button
                    id="select-view-mode-focus"
                    onClick={() => {
                      setViewMode("focus");
                      localStorage.setItem("avro_view_mode", "focus");
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-extrabold font-sans transition-all cursor-pointer ${
                      viewMode === "focus"
                        ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-855 dark:hover:text-slate-200"
                    }`}
                  >
                    ফোকাস
                  </button>
                </div>
              </div>

              {/* Auto-Advance Toggle Controls */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-405 dark:text-slate-400 font-bold font-sans">অটো-অ্যাডভান্স:</span>
                <button
                  id="toggle-auto-advance-btn"
                  onClick={() => {
                    const next = !autoAdvance;
                    setAutoAdvance(next);
                    localStorage.setItem("avro_auto_advance", next.toString());
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-black font-sans transition-all cursor-pointer border ${
                    autoAdvance
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-slate-100 dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-800"
                  }`}
                  title="সঠিক অক্ষর টাইপ করলেই কীবোর্ড স্পেস চাপার প্রয়োজন ছাড়া স্বয়ংক্রিয়ভাবে পরবর্তী অক্ষরে চলে যাবে।"
                >
                  {autoAdvance ? "চালু" : "বন্ধ"}
                </button>
              </div>
            </div>

            {/* Text displaying/visualizing workspace */}
            <div className="p-5 sm:p-7 flex flex-col gap-6">
              
              {/* Display view conditional wrapper */}
              {viewMode === "focus" ? (
                /* Focused Single Word/Letter Display Card */
                <div id="target-bangla-single-focus" className="relative flex flex-col items-center justify-center py-6 sm:py-8 px-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-800/40 relative overflow-hidden backdrop-blur-sm self-stretch text-center font-sans">
                  
                  {/* Subtle radiating glow */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none"></div>

                  <div className="flex items-center gap-1.5 mb-2.5 text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-widest text-[#94a3b8] dark:text-[#475569]">
                    <Sparkles size={11} className="text-amber-500 animate-pulse" />
                    <span>বর্তমান টাইপিং লক্ষ্য</span>
                  </div>

                  {/* Previous, active, and upcoming ribbon */}
                  <div className="flex items-center justify-between gap-4 w-full max-w-lg mt-1 select-none">
                    {/* Previous Words Queue (Left Hand side) */}
                    <div className="flex items-center gap-2 lg:gap-3.5 opacity-25 text-slate-400 dark:text-slate-600 font-sans text-xs sm:text-base select-none w-1/4 justify-end overflow-hidden">
                      {targetWords.slice(Math.max(0, activeWordIndex - 2), activeWordIndex).map((w, i) => (
                        <span key={i} className="font-semibold whitespace-nowrap">{w}</span>
                      ))}
                    </div>

                    {/* Massive Active Word Card */}
                    <div className="flex flex-col items-center justify-center relative px-6 sm:px-10 py-5 sm:py-7 bg-white dark:bg-slate-900/90 border border-amber-500/30 dark:border-amber-500/25 rounded-3xl shadow-xl shadow-amber-500/2.5 w-1/2 transform hover:scale-[1.01] transition-transform duration-200">
                      
                      {/* Accent glow corner */}
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>

                      <span className="text-5xl sm:text-7xl font-sans font-black tracking-wide text-slate-950 dark:text-white select-none">
                        {targetWords[activeWordIndex] ? (
                          (() => {
                            const currentTargetWord = targetWords[activeWordIndex];
                            const userWordChars = Array.from(convertText(currentWordTyped));
                            const targetWordChars = Array.from(currentTargetWord);
                            return targetWordChars.map((char, charIdx) => {
                              const userChar = userWordChars[charIdx];
                              const isTyped = charIdx < userWordChars.length;
                              const isCharCorrect = isTyped && userChar === char;

                              return (
                                <span
                                  key={charIdx}
                                  className={`
                                    transition-all duration-100 pb-0.5
                                    ${isTyped 
                                      ? isCharCorrect 
                                        ? "text-emerald-500 dark:text-emerald-400 font-extrabold border-b-2 border-emerald-500" 
                                        : "text-rose-500 dark:text-rose-450 font-extrabold bg-rose-500/10 rounded px-0.5 border-b-2 border-rose-500 animate-pulse"
                                      : "text-slate-900 dark:text-slate-100 font-black"
                                    }
                                  `}
                                >
                                  {char}
                                </span>
                              );
                            });
                          })()
                        ) : (
                          ""
                        )}
                      </span>

                      {/* Display Expected keys helper pronunciation keys under focus */}
                      {showPhoneticHints && (
                        <div className="mt-3.5 px-4.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 text-sm sm:text-base font-mono font-black tracking-widest text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm">
                          {getHintForWord(targetWords[activeWordIndex] || "", activeWordIndex) || "প্র্যাক্টিস কি"}
                        </div>
                      )}
                    </div>

                    {/* Upcoming Words Queue (Right Hand side) */}
                    <div className="flex items-center gap-2 lg:gap-3.5 opacity-25 text-slate-400 dark:text-slate-600 font-sans text-xs sm:text-base select-none w-1/4 justify-start overflow-hidden">
                      {targetWords.slice(activeWordIndex + 1, activeWordIndex + 3).map((w, i) => (
                        <span key={i} className="font-semibold whitespace-nowrap">{w}</span>
                      ))}
                    </div>
                  </div>

                  {/* Positioning detail and metadata indicators */}
                  <div className="mt-4 text-[10px] sm:text-xs font-sans text-slate-400 dark:text-slate-500 font-bold">
                    অবস্থান: <span className="text-slate-700 dark:text-slate-350">{activeWordIndex + 1}</span> / {targetWords.length} ({(progressPercent)}% সম্পন্ন)
                  </div>

                </div>
              ) : (
                /* Target paragraph flowing (Classic Grid View) */
                <div id="target-bangla-paragraphs" className="relative flex flex-wrap gap-x-2 sm:gap-x-3.5 gap-y-4 sm:gap-y-6 text-base sm:text-2xl leading-relaxed font-sans px-1 text-slate-800 dark:text-slate-150 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
                  {targetWords.map((word, index) => {
                    const isActive = index === activeWordIndex;
                    const isPast = index < activeWordIndex;
                    const pastWordCorrect = isPast && convertText(pastEnglishWords[index]) === word;

                    return (
                      <div
                        key={index}
                        className={`
                          relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-all duration-150 font-sans
                          ${isActive ? "ring-2 ring-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 scale-[1.05] shadow-lg shadow-amber-500/5 font-extrabold" : ""}
                          ${isPast ? "opacity-60" : ""}
                        `}
                      >
                        {/* Dynamic highlights for correct/incorrect spelling */}
                        <span className="text-xl sm:text-2xl tracking-wide">
                          {isActive ? (
                            (() => {
                              const userWordChars = Array.from(convertText(currentWordTyped));
                              const targetWordChars = Array.from(word);
                              return targetWordChars.map((char, charIdx) => {
                                const userChar = userWordChars[charIdx];
                                const isTyped = charIdx < userWordChars.length;
                                const isCharCorrect = isTyped && userChar === char;

                                return (
                                  <span
                                    key={charIdx}
                                    className={`
                                      transition-all duration-100 pb-0.5
                                      ${isTyped 
                                        ? isCharCorrect 
                                          ? "text-emerald-500 dark:text-emerald-400 font-extrabold border-b-2 border-emerald-500" 
                                          : "text-rose-500 dark:text-rose-450 font-extrabold bg-rose-500/10 rounded px-0.5 border-b-2 border-rose-500 animate-pulse"
                                        : "text-amber-500 dark:text-amber-400 font-black"
                                      }
                                    `}
                                  >
                                    {char}
                                  </span>
                                );
                              });
                            })()
                          ) : (
                            <span
                              className={`
                                transition-colors font-semibold
                                ${isPast ? (pastWordCorrect ? "text-emerald-500 dark:text-emerald-400 font-extrabold" : "text-rose-500 dark:text-rose-450 line-through underline underline-offset-4 decoration-rose-400 decoration-2") : "text-slate-500 dark:text-slate-400 font-semibold"}
                              `}
                            >
                              {word}
                            </span>
                          )}
                        </span>

                        {/* Matching dynamic phonetic or layout equivalent guide */}
                        {showPhoneticHints && getHintForWord(word, index) && (
                          <span className="text-[12px] sm:text-sm font-mono font-black mt-1.5 select-none tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/10">
                            {getHintForWord(word, index)}
                          </span>
                        )}

                        {/* Cursor indicator */}
                        {isActive && (
                          <div className="absolute -bottom-1 left-2 right-2 h-[3px] bg-gradient-to-r from-amber-400 to-amber-600 rounded-full animate-pulse shadow-md shadow-amber-500/50"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Input area triggers and on-flight parser popups */}
              <div className="mt-2 flex flex-col gap-3.5">
                {/* Text entry field */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    id="typing-avro-input"
                    type="text"
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    value={currentWordTyped}
                    disabled={isCompleted}
                    placeholder={
                      isCompleted 
                        ? 'অভিনন্দন! ডানে পরবর্তী লেসন বাছাই করুন' 
                        : typingMode === "avro"
                          ? 'ইংরেজি কিবোর্ডে ফোনেটিক বাংলা টাইপ করুন (যেমন: amader)...'
                          : 'বিজয় কিবোর্ড লেআউট অনুযায়ী ইংরেজি কি চাপুন (যেমন: আমার = gfmfv)...'
                    }
                    className="w-full px-5 py-4 pr-14 text-sm sm:text-base border border-slate-200 dark:border-slate-800/80 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-505 rounded-xl bg-slate-50 dark:bg-slate-950 font-sans tracking-wide shadow-inner text-slate-950 dark:text-slate-100 disabled:opacity-60 placeholder-slate-400 font-medium"
                    autoComplete="off"
                    autoCapitalize="none"
                  />
                  
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none text-slate-400">
                    <kbd className="hidden sm:inline-block px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[9px] font-bold font-mono leading-none shadow-sm text-slate-400">
                      SPACE
                    </kbd>
                    <button
                      id="reset-lesson-stats-micro"
                      onClick={resetStats}
                      className="p-1 px-[5px] rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 pointer-events-auto hover:text-amber-500 active:rotate-180 transition-all duration-300 shadow-sm"
                      title="পুনরায় চেষ্টা করুন"
                    >
                      <RefreshCw size={13} />
                    </button>
                  </div>
                </div>

                {/* Real-time conversion tooltip inside typing card */}
                {currentWordTyped.length > 0 && !isCompleted && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-amber-500/20 bg-amber-500/5 p-3 px-4 rounded-xl text-xs font-semibold animate-fade-in gap-2">
                    <div className="flex items-center gap-1.5 leading-none">
                      <Sparkles size={13} className="text-amber-500 animate-spin" />
                      <span className="text-slate-500 font-sans">কীস্ট্রোক ইংলিশ:</span>
                      <kbd className="px-1.5 py-0.5 bg-slate-200/80 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 rounded text-[11px] font-bold">
                        {currentWordTyped}
                      </kbd>
                    </div>
                    <div className="flex items-center gap-2 leading-none">
                      <span className="text-slate-500 font-sans">সরাসরি {typingMode === "avro" ? "অভ্র" : "বিজয়"} বাংলা:</span>
                      <span className="text-[13px] font-sans font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg tracking-wide border border-amber-500/10">
                        {convertText(currentWordTyped)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Virtual Keyboard */}
          <AvroKeyboard activeKey={activeKeyCode} shiftPressed={shiftPressed} layout={typingMode} />

        </div>

        {/* Right column - Side configuration lists & stats controllers */}
        <div className="col-span-1 flex flex-col gap-6">
          
          {/* Active Statistics cards */}
          <StatsDisplay
            stats={{
              wpm: currentWpm,
              accuracy: currentAccuracy,
              correctChars: correctChars,
              errorChars: Math.max(0, totalTyped - correctChars),
              timeSpentSecs: secondsElapsed,
              completedAt: "",
            }}
            currentStreak={currentStreak}
            highestWpm={highestWpm}
            onReset={resetStats}
            isCompleted={isCompleted}
            onNextLesson={handleNextLesson}
            hasHistory={sessionHistory.length > 0}
          />

          {/* Practice Material Selector Dashboard */}
          <LessonSelector
            currentLessonId={activeLesson.id}
            onSelectLesson={handleSelectLesson}
          />

        </div>
          </>
        )}

      </main>

      {/* History table panel - Full width bottom container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-5">
        <HistoryPanel history={sessionHistory} onClearHistory={handleClearHistory} />
      </div>

    </div>
  );
}
