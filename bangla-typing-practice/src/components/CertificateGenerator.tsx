/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Award, 
  Printer, 
  Download,
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Bookmark, 
  ArrowRight,
  TrendingUp,
  User,
  Palette,
  Timer,
  RefreshCw,
  Trophy,
  History,
  FileCheck,
  Play,
  RotateCcw
} from "lucide-react";
import { SessionHistory } from "../types";
import { convertToAvro, getPerfectAvroPhonetic } from "../utils/avro";
import { convertToBijoy, getBijoyKeystrokes } from "../utils/bijoy";
import { playKeyClick } from "../utils/sound";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";

interface CertificateGeneratorProps {
  history: SessionHistory[];
  highestWpm: number;
  currentStreak: number;
  onNavigateToPractice: () => void;
  sfxEnabled?: boolean;
}

interface ExamCertificate {
  userName: string;
  lessonTitle: string;
  difficulty: string;
  wpm: number;
  accuracy: number;
  grade: string;
  badge: string;
  completedAt: string;
  serialNo: string;
  layoutMode: string;
}

const EXAM_TOPICS = [
  {
    id: "exam-beginner",
    title: "আমাদের বাংলাদেশ (বেসিক)",
    description: "সহজ বাক্য ও সাধারণ শব্দের চমৎকার সমন্বয় প্র্যাক্টিস লেভেল।",
    difficulty: "সহজ",
    content: "আমাদের দেশের নাম বাংলাদেশ। বাংলা আমাদের মাতৃভাষা। আমরা বাংলাকে অন্তরের সাথে ভালবাসি। আমাদের জাতীয় ফুল শাপলা।",
    expectedPhonetic: "amader desher nam bangladesh. bangla amader matrribhaSha. amora banglake ontorer sathe bhalobasi. amader jatIyo phul shapola."
  },
  {
    id: "exam-common",
    title: "দৈনন্দিন সাধারণ শব্দ (সহজ)",
    description: "সহজ ও বহুল ব্যবহৃত সাধারণ বাংলা শব্দের বিশেষ টাইপিং পরীক্ষা।",
    difficulty: "সহজ",
    content: "হাতে কলমে সুন্দর বাংলা টাইপিং শেখা খুবই সহজ ও আনন্দের কাজ। নিয়মিত নতুন বই পড়া আর স্বপ্ন পূরণের জন্য চেষ্টা করা উচিত।",
    expectedPhonetic: "hate kolome sundor bangla Taiping shekha khub-i shohoj o anonder kaj. niyomito notun boi poRa ar shopno puroner jonyo chesTa kora uchit."
  },
  {
    id: "exam-intermediate",
    title: "সোনার তরী - রবীন্দ্রনাথ ঠাকুর (মধ্যম)",
    description: "কবিতার পঙ্ক্তিমালা ও মিশ্র অক্ষরগঠনের আদর্শ পরীক্ষা।",
    difficulty: "মধ্যম",
    content: "গগন গরজে মেঘ ঘন বরষা কূলে একা বসে আছি নাহি ভরসা। রাশি রাশি ভারা ভারা ধান কাটা হলো সারা ভরা নদী ক্ষুরধারা খরপরশা।",
    expectedPhonetic: "gogon goroje megh ghono boroSha kUle eka bose achi nahi bhorosa. rashi rashi bhara bhara dhan kaTa holO sara bhora nodI kShurodhara khoroporosha."
  },
  {
    id: "exam-conjuncts",
    title: "যুক্তবর্ণ স্পেশাল টেস্ট (উচ্চস্তর)",
    description: "কঠিন ও জটিল যুক্তবর্ণযুক্ত শব্দের নিখুঁত টাইপিং স্পীড পরীক্ষা।",
    difficulty: "উচ্চস্তর",
    content: "বিজ্ঞান ও প্রযুক্তির যুগে সুশিক্ষিত ও বুদ্ধিমান হওয়া জরুরি। আমাদের স্পষ্ট আকাঙ্ক্ষা ও উজ্জ্বল ভবিষ্যৎ রাষ্ট্র গঠনে সাহায্য করবে।",
    expectedPhonetic: "bignan O projuktir juge sushikkhito O buddhiman hOya jorurI. amader spoSTo akankha O ujshol bobiShyot raSTro goThone sahajyo korobe."
  },
  {
    id: "exam-advanced",
    title: "ভাষা আন্দোলন ও স্বাধীনতা (উচ্চস্তর)",
    description: "যুক্তবর্ণ ও কঠিন বানানের সমন্বয়ে গঠিত টেস্ট।",
    difficulty: "উচ্চস্তর",
    content: "১৯৫২ সালের একুশে ফেব্রুয়ারি বাংলা ভাষার জন্য রফিক সালাম বরকত শফিউর ও জব্বার জীবন বিসর্জন দিয়েছিলেন। আমরা তাদের শ্রদ্ধাভরে স্মরণ করি।",
    expectedPhonetic: "1952 saler ekushe februyari bangla bhaShar jonyo rofik salam borokot shofiur O jobbar jIbon bisorjon diyechilen. amora tader shroddhabhore smoroN kori."
  }
];

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  history,
  highestWpm,
  currentStreak,
  onNavigateToPractice,
  sfxEnabled = true,
}) => {
  // Load saved certificate from localStorage if it exists
  const [savedCert, setSavedCert] = useState<ExamCertificate | null>(() => {
    try {
      const saved = localStorage.getItem("bengali_typing_exam_certificate");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation state between views
  // "view" = Inspect and print certificate, "exam" = Configure and take an exam
  const [activeSubTab, setActiveSubTab] = useState<"view" | "exam">(
    savedCert ? "view" : "exam"
  );

  const [candidateName, setCandidateName] = useState<string>(
    savedCert?.userName || ""
  );
  const [selectedTheme, setSelectedTheme] = useState<"ivory" | "dark" | "emerald">("ivory");
  const [selectedExamIndex, setSelectedExamIndex] = useState<number>(0);
  const [examLayoutMode, setExamLayoutMode] = useState<"avro" | "bijoy">("avro");
  const [examDisplayMode, setExamDisplayMode] = useState<"paragraph" | "single">("paragraph");

  // Live Exam States
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdownValue, setCountdownValue] = useState<number>(3);
  const [examSecondsLeft, setExamSecondsLeft] = useState<number>(60);
  
  const [examPastEnglishWords, setExamPastEnglishWords] = useState<string[]>([]);
  const [examCurrentWordTyped, setExamCurrentWordTyped] = useState<string>("");
  const [examActiveWordIndex, setExamActiveWordIndex] = useState<number>(0);
  const [examIsPracticing, setExamIsPracticing] = useState<boolean>(false);
  
  const [examCorrectCharsCount, setExamCorrectCharsCount] = useState<number>(0);
  const [examTotalTypedCharsCount, setExamTotalTypedCharsCount] = useState<number>(0);
  const [showResultsOverlay, setShowResultsOverlay] = useState<boolean>(false);
  const [tempExamDetails, setTempExamDetails] = useState<{
    wpm: number;
    accuracy: number;
    grade: string;
    badge: string;
    lessonTitle: string;
    difficulty: string;
  } | null>(null);

  // Custom interactive dialog states to avoid Native alert()/confirm() blocks in iframes
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    showCancel?: boolean;
  } | null>(null);

  const examInputRef = useRef<HTMLInputElement>(null);
  const examTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeTopic = EXAM_TOPICS[selectedExamIndex];
  const examTargetWords = activeTopic.content.trim().split(/\s+/);

  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownloadImage = () => {
    const node = document.getElementById("print-area-certificate");
    if (!node) {
      setDialogConfig({
        isOpen: true,
        title: "ডাউনলোড ব্যর্থ হয়েছে",
        message: "সার্টিফিকেট প্রিভিউ এলিমেন্ট পাওয়া যায়নি। অনুগ্রহ করে আগে পরীক্ষা সফলভাবে সম্পন্ন করে এই পাতায় আসুন।",
        confirmText: "ঠিক আছে",
        showCancel: false,
        onConfirm: () => setDialogConfig(null)
      });
      return;
    }
    
    setIsDownloading(true);
    
    // Convert DOM node to high resolution PNG
    toPng(node, {
      cacheBust: true,
      backgroundColor: undefined, // transparent background defaults so that matching theme cards display correctly
      style: {
        transform: "scale(1)",
        boxShadow: "none",
        margin: "0"
      },
      quality: 1,
      pixelRatio: 3 // Ultra-sharp print quality
    })
    .then((dataUrl) => {
      const link = document.createElement("a");
      const name = savedCert ? savedCert.userName.replace(/\s+/g, "_") : "student_certificate";
      link.download = `Typing_Certificate_${name}.png`;
      link.href = dataUrl;
      link.click();
      setIsDownloading(false);
      
      // Fire confetti burst on successful download
      try {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      } catch (e) {
        console.error("Confetti error:", e);
      }
    })
    .catch((err) => {
      console.error("Image generation error:", err);
      setIsDownloading(false);
      setDialogConfig({
        isOpen: true,
        title: "ডাউনলোড ব্যর্থ হয়েছে",
        message: "দুঃখিত, ইমেজটি ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে স্ক্রিনশট নিন অথবা প্রিন্ট বোতাম ব্যবহার করুন।",
        confirmText: "ঠিক আছে",
        showCancel: false,
        onConfirm: () => setDialogConfig(null)
      });
    });
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.error("Print function error inside iframe:", err);
    }
  };

  // Convert English user text into target script depending on selection
  const convertExamInput = (engTxt: string): string => {
    return examLayoutMode === "avro" ? convertToAvro(engTxt) : convertToBijoy(engTxt);
  };

  // Character status highlighter during Live typing test
  const getExamHintForWord = (word: string, index: number) => {
    if (examLayoutMode === "bijoy") {
      return getBijoyKeystrokes(word);
    } else {
      let ph = "";
      if (activeTopic.expectedPhonetic) {
        ph = activeTopic.expectedPhonetic.split(/\s+/)[index] || "";
      }
      if (!ph || convertToAvro(ph) !== word) {
        ph = getPerfectAvroPhonetic(word);
      }
      return ph;
    }
  };

  // Start the Exam Flow
  const handleLaunchExam = () => {
    if (!candidateName.trim()) {
      setDialogConfig({
        isOpen: true,
        title: "নাম দেওয়া আবশ্যক",
        message: "পরীক্ষা শুরু করার পূর্বে অনুগ্রহ করে আপনার পুরো নাম প্রদান করুন।",
        confirmText: "ঠিক আছে",
        showCancel: false,
        onConfirm: () => setDialogConfig(null)
      });
      return;
    }
    
    // Reset all parameters
    setExamPastEnglishWords([]);
    setExamCurrentWordTyped("");
    setExamActiveWordIndex(0);
    setExamSecondsLeft(60);
    setExamIsPracticing(false);
    setExamCorrectCharsCount(0);
    setExamTotalTypedCharsCount(0);
    setShowResultsOverlay(false);

    // Run 3-2-1 countdown sequence
    setIsCountingDown(true);
    setCountdownValue(3);
    if (sfxEnabled) playKeyClick("space");

    let count = 3;
    countdownTimerRef.current = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdownValue(count);
        if (sfxEnabled) playKeyClick("normal");
      } else {
        clearInterval(countdownTimerRef.current!);
        setIsCountingDown(false);
        setIsExamActive(true);
        if (sfxEnabled) playKeyClick("success");
        setTimeout(() => {
          examInputRef.current?.focus();
        }, 100);
      }
    }, 1000);
  };

  // Ticking countdown effect once exam is active
  useEffect(() => {
    if (isExamActive && examSecondsLeft > 0) {
      examTimerRef.current = setInterval(() => {
        setExamSecondsLeft((prev) => {
          if (prev <= 1) {
            handleCompleteExam(examPastEnglishWords, examCurrentWordTyped, true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (examTimerRef.current) clearInterval(examTimerRef.current);
    };
  }, [isExamActive, examPastEnglishWords, examCurrentWordTyped]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (examTimerRef.current) clearInterval(examTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  // Live calculation helpers
  const getCorrectCharsLive = (past: string[], current: string) => {
    let count = 0;
    past.forEach((eng, idx) => {
      const bangla = convertExamInput(eng);
      const target = examTargetWords[idx] || "";
      for (let c = 0; c < Math.min(bangla.length, target.length); c++) {
        if (bangla[c] === target[c]) count++;
      }
      if (bangla === target && idx < examTargetWords.length) {
        count++; // accurate space bar
      }
    });

    const currentBangla = convertExamInput(current);
    const activeTarget = examTargetWords[examActiveWordIndex] || "";
    for (let c = 0; c < Math.min(currentBangla.length, activeTarget.length); c++) {
      if (currentBangla[c] === activeTarget[c]) count++;
    }
    return count;
  };

  const getTotalTypedCharsLive = (past: string[], current: string) => {
    let total = 0;
    past.forEach((eng) => {
      total += convertExamInput(eng).length + 1; // including spaces
    });
    total += convertExamInput(current).length;
    return total;
  };

  const correctCharsLive = getCorrectCharsLive(examPastEnglishWords, examCurrentWordTyped);
  const totalTypedLive = getTotalTypedCharsLive(examPastEnglishWords, examCurrentWordTyped);

  const liveWpm = (() => {
    const elapsed = 60 - examSecondsLeft;
    const mins = elapsed > 0 ? elapsed / 60 : (1 / 60);
    return Math.max(0, Math.round((correctCharsLive / 5) / mins));
  })();

  const liveAccuracy = (() => {
    if (totalTypedLive === 0) return 100;
    return Math.min(100, Math.round((correctCharsLive / totalTypedLive) * 100));
  })();

  // Handle typing input event
  const handleExamInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Start measuring on first input
    if (!examIsPracticing && val.length > 0) {
      setExamIsPracticing(true);
    }

    const currentTarget = examTargetWords[examActiveWordIndex] || "";
    const parsedBangla = convertExamInput(val);

    // Check Auto-advance match
    if (parsedBangla === currentTarget) {
      if (sfxEnabled) playKeyClick("space");
      const nextPast = [...examPastEnglishWords, val];
      setExamPastEnglishWords(nextPast);
      setExamCurrentWordTyped("");
      
      const nextIndex = examActiveWordIndex + 1;
      setExamActiveWordIndex(nextIndex);

      if (nextIndex >= examTargetWords.length) {
        handleCompleteExam(nextPast, "");
      }
      return;
    }

    // Capture standard space boundaries
    if (val.endsWith(" ")) {
      const trimmed = val.slice(0, -1);
      if (trimmed.length > 0) {
        if (sfxEnabled) playKeyClick("space");
        const nextPast = [...examPastEnglishWords, trimmed];
        setExamPastEnglishWords(nextPast);
        setExamCurrentWordTyped("");
        
        const nextIndex = examActiveWordIndex + 1;
        setExamActiveWordIndex(nextIndex);

        if (nextIndex >= examTargetWords.length) {
          handleCompleteExam(nextPast, "");
        }
      }
    } else {
      if (sfxEnabled && val.length > examCurrentWordTyped.length) {
        playKeyClick("normal");
      }
      setExamCurrentWordTyped(val);

      // Handle direct finish on last character of paragraph
      if (examActiveWordIndex === examTargetWords.length - 1) {
        if (parsedBangla === currentTarget) {
          handleCompleteExam(examPastEnglishWords, val);
        }
      }
    }
  };

  const handleExamKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (sfxEnabled) playKeyClick("backspace");
      
      if (examCurrentWordTyped.length === 0 && examActiveWordIndex > 0) {
        e.preventDefault();
        const prevText = examPastEnglishWords[examPastEnglishWords.length - 1];
        setExamPastEnglishWords(examPastEnglishWords.slice(0, -1));
        setExamCurrentWordTyped(prevText);
        setExamActiveWordIndex((prev) => prev - 1);
      }
    }
  };

  // Logic to process exam completion
  const handleCompleteExam = (past: string[], current: string, timedOut = false) => {
    setIsExamActive(false);
    if (examTimerRef.current) clearInterval(examTimerRef.current);
    if (sfxEnabled) playKeyClick("success");

    // Recalculate official metrics
    const finalCorrect = getCorrectCharsLive(past, current);
    const finalTotal = getTotalTypedCharsLive(past, current);

    const elapsed = 60 - examSecondsLeft;
    const finalMins = elapsed > 0 ? elapsed / 60 : (1 / 60);
    const finalWpm = Math.max(1, Math.round((finalCorrect / 5) / finalMins));
    const finalAccuracy = finalTotal > 0 ? Math.min(100, Math.round((finalCorrect / finalTotal) * 100)) : 100;

    // Define Level Metrics (ক্যাটাগরি ভিত্তিক গ্রেডিং)
    let computedGrade = "C";
    let badgeText = "অংশগ্রহণ মেডেল";

    if (finalAccuracy < 70) {
      computedGrade = "F";
      badgeText = "অনুত্তীর্ণ";
    } else if (finalWpm >= 40 && finalAccuracy >= 95) {
      computedGrade = "A+";
      badgeText = "গোল্ডেন মেডেল";
    } else if (finalWpm >= 30 && finalAccuracy >= 90) {
      computedGrade = "A";
      badgeText = "সিলভার মেডেল";
    } else if (finalWpm >= 20 && finalAccuracy >= 80) {
      computedGrade = "B";
      badgeText = "ব্রোঞ্জ মেডেল";
    } else {
      computedGrade = "C";
      badgeText = "অংশগ্রহণ সনদ";
    }

    const testDetails = {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      grade: computedGrade,
      badge: badgeText,
      lessonTitle: activeTopic.title,
      difficulty: activeTopic.difficulty
    };

    setTempExamDetails(testDetails);
    setShowResultsOverlay(true);

    // Save certificate data only if they passed (Grade !== F)
    if (computedGrade !== "F") {
      const serial = `ELZ-${(finalAccuracy * 17).toString(16).toUpperCase()}-${(finalWpm * 31).toString(10)}-EXAM`;
      
      const newCert: ExamCertificate = {
        userName: candidateName.trim(),
        lessonTitle: activeTopic.title,
        difficulty: activeTopic.difficulty,
        wpm: finalWpm,
        accuracy: finalAccuracy,
        grade: computedGrade,
        badge: badgeText,
        completedAt: new Date().toISOString(),
        serialNo: serial,
        layoutMode: examLayoutMode.toUpperCase()
      };

      setSavedCert(newCert);
      localStorage.setItem("bengali_typing_exam_certificate", JSON.stringify(newCert));

      // Fire beautiful celebratory confetti
      try {
        confetti({
          particleCount: 150,
          spread: 85,
          origin: { y: 0.6 }
        });
        // Slower second burst for a premium celebratory feeling
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 120,
            origin: { y: 0.65 }
          });
        }, 350);
      } catch (err) {
        console.error("Confetti error:", err);
      }
    }
  };

  const handleClearSavedExam = () => {
    setDialogConfig({
      isOpen: true,
      title: "সনদ ডিলিট নিশ্চিত করুন",
      message: "আপনি কি নিশ্চিতভাবে পরীক্ষার সনদপত্রটি ডিলিট করতে চান? ডিলিট করার পর এটি আর ফিরে পাওয়া যাবে না।",
      confirmText: "হ্যাঁ, ডিলিট করুন",
      cancelText: "না, ফিরে যান",
      showCancel: true,
      onConfirm: () => {
        localStorage.removeItem("bengali_typing_exam_certificate");
        setSavedCert(null);
        setActiveSubTab("exam");
      }
    });
  };

  const todayStr = new Date().toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in relative z-10">
      
      {/* Media Print Style Rules */}
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          html, body {
            width: 100vw !important;
            height: 100vh !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            background: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide everything in interface using display: none for major containers */
          #root > *:not(main),
          main > *:not(.grid),
          nav, footer, header, button, .no-print {
            display: none !important;
          }
          body * {
            visibility: hidden !important;
          }
          #print-area-certificate, #print-area-certificate * {
            visibility: visible !important;
          }
          #print-area-certificate {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-height: 100vh !important;
            border-width: 16px !important;
            border-style: solid !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 3.5% 6% !important;
            box-sizing: border-box !important;
            z-index: 9999999 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            align-items: center !important;
            border-radius: 0 !important;
          }
          /* High quality scaling for A4 landscape paper */
          #print-area-certificate h2 {
            font-size: 2rem !important;
            line-height: 1.2 !important;
            margin-top: 4px !important;
            margin-bottom: 8px !important;
          }
          #print-area-certificate p {
            font-size: 0.95rem !important;
            line-height: 1.6 !important;
          }
          #print-area-certificate .text-amber-500 {
            font-size: 0.95rem !important;
          }
          #print-area-certificate .text-xl {
            font-size: 2.2rem !important;
            line-height: 1.1 !important;
          }
          #print-area-certificate .text-[11px] {
            font-size: 1rem !important;
          }
          #print-area-certificate .text-[8px] {
            font-size: 0.75rem !important;
          }
          #print-area-certificate .text-[10px], #print-area-certificate .text-[9px] {
            font-size: 0.8rem !important;
          }
          #print-area-certificate .sign-line {
            border-top: 1.5px solid #1e293b !important;
            width: 120px !important;
          }
          /* Keep watermark light */
          #print-area-certificate .absolute.inset-0.opacity-5 {
            opacity: 0.04 !important;
            font-size: 20rem !important;
          }
        }
      `}</style>

      {/* LEFT COLUMN: Controls & Modes */}
      <div className="md:col-span-1 flex flex-col gap-4">
        
        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 flex flex-col gap-2">
          <button
            onClick={() => setActiveSubTab("exam")}
            className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "exam"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-slate-950"
            }`}
          >
            <Trophy size={14} />
            পরীক্ষা দিন (Take Exam)
          </button>
          
          <button
            onClick={() => {
              if (savedCert) {
                setActiveSubTab("view");
              } else {
                setDialogConfig({
                  isOpen: true,
                  title: "সনদপত্র পাওয়া যায়নি",
                  message: "আপনার কোনো সার্টিফিকেট রেকর্ড নেই! অনুগ্রহ করে আগে সফলভাবে পরীক্ষা সম্পন্ন করুন।",
                  confirmText: "ঠিক আছে",
                  showCancel: false,
                  onConfirm: () => setDialogConfig(null)
                });
              }
            }}
            className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              savedCert 
                ? "cursor-pointer" 
                : "opacity-40 cursor-not-allowed"
            } ${
              activeSubTab === "view"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-slate-950"
            }`}
          >
            <Award size={14} />
            পরীক্ষার সনদপত্র (Certificate)
          </button>
        </div>

        {/* Certificate / Exam Information Box */}
        {activeSubTab === "view" && savedCert && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
              <div className="p-2 bg-amber-500/10 text-amber-550 dark:text-amber-400 rounded-xl">
                <FileCheck size={16} />
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">
                সনদ বিস্তারিত
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between font-semibold border-b border-slate-50 dark:border-slate-950 pb-1.5">
                <span className="text-slate-400">পরীক্ষার্থী:</span>
                <span className="text-slate-800 dark:text-zinc-200 font-extrabold">{savedCert.userName}</span>
              </div>
              <div className="flex justify-between font-semibold border-b border-slate-50 dark:border-slate-950 pb-1.5">
                <span className="text-slate-400">কিবোর্ড লেআউট:</span>
                <span className="text-slate-800 dark:text-zinc-200 font-bold">{savedCert.layoutMode === "AVRO" ? "অভ্র ফোনেটিক" : "বিজয় লেআউট"}</span>
              </div>
              <div className="flex justify-between font-semibold border-b border-slate-50 dark:border-slate-950 pb-1.5">
                <span className="text-slate-400">অসুবিধার মাত্রা:</span>
                <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-500 rounded font-black text-[10px]">{savedCert.difficulty}</span>
              </div>
              <div className="flex justify-between font-semibold border-b border-slate-50 dark:border-slate-950 pb-1.5">
                <span className="text-slate-400">টাইপিং স্পিড:</span>
                <span className="text-slate-800 dark:text-zinc-200 font-black text-amber-500 font-mono">{savedCert.wpm} WPM</span>
              </div>
              <div className="flex justify-between font-semibold border-b border-slate-50 dark:border-slate-950 pb-1.5">
                <span className="text-slate-400">নির্ভুলতা:</span>
                <span className="text-slate-805 dark:text-zinc-200 font-black text-emerald-500 font-mono">{savedCert.accuracy}%</span>
              </div>
              <div className="flex justify-between font-semibold border-b border-slate-50 dark:border-slate-950 pb-1.5">
                <span className="text-slate-400">অর্জিত গ্রেড:</span>
                <span className="text-rose-500 font-black text-sm">{savedCert.grade}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-extrabold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Palette size={13} className="text-amber-500" />
                সনদের ডিজাইন থিম:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setSelectedTheme("ivory")}
                  className={`py-1.5 px-1 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                    selectedTheme === "ivory"
                      ? "bg-amber-500 border-amber-500 text-slate-950 font-black"
                      : "bg-slate-50 border-slate-205 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
                  }`}
                >
                  Ivory ক্রীম
                </button>
                <button
                  onClick={() => setSelectedTheme("dark")}
                  className={`py-1.5 px-1 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                    selectedTheme === "dark"
                      ? "bg-slate-800 border-slate-700 text-indigo-400 font-extrabold dark:bg-slate-950"
                      : "bg-slate-50 border-slate-205 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
                  }`}
                >
                  Modern ডার্ক
                </button>
                <button
                  onClick={() => setSelectedTheme("emerald")}
                  className={`py-1.5 px-1 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                    selectedTheme === "emerald"
                      ? "bg-emerald-600 border-emerald-600 text-white font-black"
                      : "bg-slate-50 border-slate-205 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
                  }`}
                >
                  Prestige
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                disabled={isDownloading}
                onClick={handleDownloadImage}
                className={`w-full py-2.5 px-4 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                  isDownloading 
                    ? "bg-emerald-700 opacity-80 cursor-wait animate-pulse" 
                    : "bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.01]"
                }`}
              >
                <Download size={14} />
                {isDownloading ? "ইমেজ প্রসেস হচ্ছে..." : "সনদ সরাসরি ডাউনলোড করুন (PNG)"}
              </button>

              <button
                onClick={handlePrint}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Printer size={14} />
                প্রিন্ট / পিডিএফ ডাউনলোড
              </button>

              {/* PDF printing support guide */}
              <div className="p-2 sm:p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 rounded-xl text-[9.5px] text-slate-550 dark:text-amber-400/90 leading-normal text-left">
                <span className="font-extrabold block text-amber-550 dark:text-amber-400 mb-0.5">💡 প্রিন্ট / পিডিএফ ডাউনলোড গাইড:</span>
                ব্রাউজার সুরক্ষার কারণে এই প্রিভিউ ফ্রেম থেকে সরাসরি প্রিন্ট ব্লক হতে পারে। আসল সার্টিফিকেট কপি পেতে নিচের বোতাম দিয়ে অ্যাপটি নতুন ট্যাবে খুলে প্রিন্ট করুন:
                <a
                  href={typeof window !== "undefined" ? window.location.href : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 w-full py-1.5 px-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-500 rounded-lg text-[9.5px] font-black cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                  <Sparkles size={11} />
                  নতুন ট্যাবে ওপেন করে প্রিন্ট করুন
                </a>
              </div>

              <button
                onClick={handleClearSavedExam}
                className="w-full py-2 px-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 text-rose-500 font-extrabold text-[10px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                সনদ ডিলিট করুন (Reset)
              </button>
            </div>
          </div>
        )}

        {/* Setup Panel for New Exam */}
        {activeSubTab === "exam" && !isExamActive && !isCountingDown && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
                <Trophy size={16} />
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">
                পরীক্ষা কনফিগার করুন
              </h3>
            </div>

            {/* Candidate Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-505 dark:text-zinc-400 flex items-center gap-1.5">
                <User size={13} className="text-amber-500" />
                পরীক্ষার্থীর পূর্ণ নাম:
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="উদা: আসিফুর রহমান"
                maxLength={45}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-205 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-550/25 focus:border-indigo-500 text-slate-900 dark:text-slate-100 font-bold"
              />
            </div>

            {/* Typing standard layout selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-505 dark:text-zinc-400">কিবোর্ড লেআউট:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExamLayoutMode("avro")}
                  className={`py-2 px-1 text-[11px] font-black rounded-lg border transition-all cursor-pointer ${
                    examLayoutMode === "avro"
                      ? "bg-indigo-505 border-indigo-500 bg-indigo-600 text-white font-black"
                      : "bg-slate-50 border-slate-205 text-slate-500 dark:bg-slate-950 dark:border-slate-800 text-zinc-400"
                  }`}
                >
                  অভ্র ফোনেটিক
                </button>
                <button
                  type="button"
                  onClick={() => setExamLayoutMode("bijoy")}
                  className={`py-2 px-1 text-[11px] font-black rounded-lg border transition-all cursor-pointer ${
                    examLayoutMode === "bijoy"
                      ? "bg-indigo-505 border-indigo-500 bg-indigo-600 text-white font-black"
                      : "bg-slate-50 border-slate-205 text-slate-500 dark:bg-slate-950 dark:border-slate-800 text-zinc-400"
                  }`}
                >
                  বিজয় কিবোর্ড
                </button>
              </div>
            </div>

            {/* Word Display Mode Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-505 dark:text-zinc-400">শব্দ প্রদর্শনীর মোড (Display Mode):</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExamDisplayMode("paragraph")}
                  className={`py-2 px-1 text-[11px] font-black rounded-lg border transition-all cursor-pointer ${
                    examDisplayMode === "paragraph"
                      ? "bg-indigo-600 text-white font-black border-indigo-600"
                      : "bg-slate-50 border-slate-205 text-slate-500 dark:bg-slate-950 dark:border-slate-800 text-zinc-400"
                  }`}
                >
                  সব শব্দ একসাথে (Paragraph)
                </button>
                <button
                  type="button"
                  onClick={() => setExamDisplayMode("single")}
                  className={`py-2 px-1 text-[11px] font-black rounded-lg border transition-all cursor-pointer ${
                    examDisplayMode === "single"
                      ? "bg-indigo-600 text-white font-black border-indigo-600"
                      : "bg-slate-50 border-slate-205 text-slate-500 dark:bg-slate-950 dark:border-slate-800 text-zinc-400"
                  }`}
                >
                  সিঙ্গেল শব্দ (এক এক করে)
                </button>
              </div>
            </div>

            {/* Print warnings / details */}
            <div className="p-3 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 rounded-xl space-y-1.5 text-[10px] leading-relaxed text-slate-500 dark:text-indigo-400">
              <p className="font-semibold">
                * ৬০ সেকেন্ডের একটি টাইপিং সেশনের মাধ্যমে পরীক্ষা মূল্যায়ন করা হবে।
              </p>
              <p className="font-semibold">
                * গোল্ডেন মেডেল সনদ পেতে হলে স্পিড কমপক্ষে <strong className="text-amber-500">৪০ WPM</strong> এবং নির্ভুুলতা <strong className="text-emerald-500">৯৫%</strong> অর্জন করুন!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Interactive Arena / Certificate Board */}
      <div className="md:col-span-3 flex flex-col justify-between">
        
        {/* CountDown Stage Screen */}
        {isCountingDown && (
          <div className="flex-1 min-h-[420px] flex flex-col items-center justify-center text-center p-8 bg-slate-900/40 rounded-3xl border border-indigo-500/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500"></div>
            <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-center mb-6 shadow-xl animate-ping-once">
              <span className="text-5xl font-black text-amber-500 font-mono italic">
                {countdownValue}
              </span>
            </div>
            <h3 className="text-xl font-black text-white font-sans max-w-sm mb-1">
              প্রস্তুত তো? পরীক্ষা শুরু হচ্ছে!
            </h3>
            <p className="text-xs text-indigo-400 font-semibold font-sans">
              পর্দার লেখা ক্রমানুসারে দেখে টাইপিং শুরু করুন।
            </p>
          </div>
        )}

        {/* Live Active Typing Exam Window */}
        {isExamActive && (
          <div className="flex-1 min-h-[420px] flex flex-col justify-between p-6 sm:p-8 bg-slate-905 dark:bg-[#0c101b] rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden animate-scale-up">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-amber-500"></div>
            
            {/* Live exam header indicator bar */}
            <div className="flex justify-between items-center bg-slate-950/40 p-4 rounded-2xl border border-white/5 mb-5 select-none font-sans">
              <div className="flex items-center gap-2">
                <Timer size={16} className="text-amber-500 animate-pulse" />
                <span className="text-sm font-black font-mono text-amber-500">{examSecondsLeft}s</span>
                <span className="text-[10px] bg-indigo-650 text-indigo-100 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-95 opacity-80">
                  {examLayoutMode === "avro" ? "Phonetic AVRO" : "BIJOY"}
                </span>
              </div>

              <div className="flex gap-4">
                <div className="text-xs text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-extrabold font-mono tracking-wider">স্পিড WPM</span>
                  <strong className="text-sm font-black text-amber-400 font-mono">{liveWpm}</strong>
                </div>
                <div className="text-xs text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-extrabold font-mono tracking-wider">নির্ভুলতা</span>
                  <strong className="text-sm font-black text-emerald-400 font-mono">{liveAccuracy}%</strong>
                </div>
              </div>
            </div>

            {/* Large Text Area block highlights word by word */}
            <div className="flex-1 my-4 bg-slate-950/20 p-5 rounded-2xl border border-white/5 flex items-center justify-center text-center">
              <div className="max-w-2xl leading-loose select-none w-full">
                {examDisplayMode === "paragraph" ? (
                  examTargetWords.map((word, idx) => {
                    const isActive = examActiveWordIndex === idx;
                    const isPast = idx < examActiveWordIndex;
                    const pastInputEng = examPastEnglishWords[idx];
                    
                    let isWordCorrect = true;
                    if (isPast && pastInputEng) {
                      isWordCorrect = convertExamInput(pastInputEng) === word;
                    }

                    return (
                      <span 
                        key={idx} 
                        className={`
                          inline-block mx-1.5 my-1 px-1.5 py-0.5 rounded-lg text-sm sm:text-base transition-all font-bold font-sans relative
                          ${
                            isActive 
                              ? "bg-amber-500/10 text-amber-500 font-black border-b-2 border-amber-500 scale-105 shadow-md shadow-amber-500/5"
                              : isPast
                                ? isWordCorrect
                                  ? "text-emerald-500 bg-emerald-500/5 opacity-90 font-medium"
                                  : "text-rose-500 bg-rose-500/10 line-through decoration-rose-600 font-medium opacity-80"
                                : "text-zinc-550 dark:text-zinc-500 opacity-55 font-medium hover:opacity-75"
                          }
                        `}
                      >
                        {word}

                        {/* Floating Phonetic Advice bubble directly under the active word */}
                        {isActive && (
                          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs sm:text-sm bg-slate-950 border-2 border-amber-500 text-amber-400 font-black px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl z-30 animate-bounce tracking-widest font-mono">
                            {getExamHintForWord(word, idx)}
                          </span>
                        )}
                      </span>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 w-full">
                    {/* Single Word Layout */}
                    <div className="text-center space-y-5 w-full">
                      
                      {/* Word index indicators and mini progress bar */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[11px] bg-indigo-500/15 border border-indigo-500/10 text-indigo-400 px-3.5 py-0.5 rounded-full font-black font-sans uppercase tracking-widest scale-95 opacity-90">
                          শব্দ নম্বর: {examActiveWordIndex + 1} / {examTargetWords.length}
                        </span>
                        
                        <div className="w-48 bg-slate-900/60 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(0, ((examActiveWordIndex + 1) / examTargetWords.length) * 100))}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Main Big Word Canvas card */}
                      <div className="py-6 px-10 bg-slate-950/40 border border-white/5 rounded-3xl shadow-xl max-w-sm mx-auto select-none transition-all transform hover:scale-[1.01]">
                        <span className="block text-2xl sm:text-3xl font-black text-amber-500 font-sans tracking-wide">
                          {examTargetWords[examActiveWordIndex]}
                        </span>
                        
                        {/* Dynamic phonetic/layout keys help */}
                        <div className="mt-4 flex flex-col items-center gap-1.5 ">
                          <span className="text-[11px] uppercase font-sans font-black tracking-widest text-slate-400">
                            {examLayoutMode === "avro" ? "Phonetic Keys to Press:" : "Bijoy Keys to Press:"}
                          </span>
                          <span className="inline-block text-base sm:text-lg md:text-xl text-amber-400 font-mono font-black tracking-widest bg-amber-500/15 border border-amber-500/35 rounded-2xl py-2 px-5 z-35 shadow-md select-all cursor-pointer hover:bg-amber-500/20 transition-all">
                            {getExamHintForWord(examTargetWords[examActiveWordIndex], examActiveWordIndex)}
                          </span>
                        </div>
                      </div>

                      {/* Next word cueing flow */}
                      {examActiveWordIndex + 1 < examTargetWords.length ? (
                        <div className="text-xs text-slate-500 font-bold font-sans">
                          পরবর্তী শব্দ: <span className="text-slate-400 font-bold font-sans">{examTargetWords[examActiveWordIndex + 1]}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-emerald-500 font-semibold font-sans">
                          এইটিই ফাইনাল শব্দ! স্পেসবার দিয়ে পরীক্ষা শেষ করুন।
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Exam Live Input Elements */}
            <div className="mt-8 space-y-4">
              <input
                ref={examInputRef}
                type="text"
                value={examCurrentWordTyped}
                onChange={handleExamInputChange}
                onKeyDown={handleExamKeyDown}
                placeholder="সঠিক বাংলা শব্দটি সরাসরি কিবোর্ডে লিখে স্পেসবার দিন..."
                className="w-full text-center px-4 py-3.5 rounded-2xl border-2 border-indigo-500/35 focus:border-indigo-500 focus:outline-none bg-slate-950 text-slate-100 font-sans text-sm sm:text-base font-bold transition-all focus:ring-4 focus:ring-indigo-500/15"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />

              <div className="flex justify-between items-center text-[11px] text-slate-400 font-sans">
                <span className="flex items-center gap-1 opacity-70">
                  <Play size={10} className="text-indigo-400" />
                  টাইপিং শুরু করলে সময় সয়ংক্রিয়ভাবে গণনা হবে।
                </span>
                
                <button
                  type="button"
                  onClick={() => {
                    setDialogConfig({
                      isOpen: true,
                      title: "পরীক্ষা বাতিল নিশ্চিত করুন",
                      message: "আপনি কি নিশ্চিতভাবে এই টাইপিং পরীক্ষাটি বাতিল করতে চান? আপনার বর্তমান পরীক্ষার অগ্রগতি মুছে যাবে।",
                      confirmText: "হ্যাঁ, বাতিল করুন",
                      cancelText: "না, ফিরে যান",
                      showCancel: true,
                      onConfirm: () => {
                        setIsExamActive(false);
                        if (examTimerRef.current) clearInterval(examTimerRef.current);
                        if (sfxEnabled) playKeyClick("space");
                      }
                    });
                  }}
                  className="text-rose-500 hover:underline p-1 text-[10px] font-bold cursor-pointer"
                >
                  পরীক্ষা বাতিল করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SETUP SCREEN FOR EXAM CONFIG */}
        {activeSubTab === "exam" && !isExamActive && !isCountingDown && (
          <div className="flex-1 min-h-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col justify-between animate-fade-in relative z-20">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#6366f1]">
                <Sparkles size={14} className="text-indigo-550 animate-spin-slow" />
                <span>OFFICIAL CERTIFICATE EXAM</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-tight font-sans">
                অনলাইন বাংলা টাইপিং স্কিল টেস্ট
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-xl">
                আপনার কিবোর্ড ক্যারেক্টার ও গতি নিখুঁতভাবে যাচাই করতে এক মিনিটের অফিশিয়াল পরীক্ষা দিন। আপনার নাম ও স্পিড সরাসরি আমাদের সনদপত্রের পাতায় মুদ্রিত হয়ে যাবে এবং সয়ংক্রিয়ভাবে ডেটাবেজ ভেরিফাই করতে একটি মেডেল ও আইডি তৈরি করা হবে।
              </p>

              {/* Exam lesson selection cards */}
              <div className="pt-4 space-y-3">
                <label className="text-xs font-extrabold text-slate-500 dark:text-zinc-400 block">পরীক্ষার প্যারাগ্রাফ নির্বাচন করুন:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {EXAM_TOPICS.map((topic, i) => (
                    <div
                      key={topic.id}
                      onClick={() => {
                        setSelectedExamIndex(i);
                        if (sfxEnabled) playKeyClick("normal");
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden select-none flex flex-col justify-between ${
                        selectedExamIndex === i
                          ? "border-amber-500 bg-amber-500/5 dark:bg-amber-500/10 shadow-md translate-y-[-2px]"
                          : "border-slate-205 dark:border-slate-850 hover:bg-slate-50/20 dark:hover:bg-slate-950/20 bg-slate-50/50 dark:bg-slate-950/50"
                      }`}
                    >
                      {selectedExamIndex === i && (
                        <div className="absolute right-0 top-0 w-6 h-6 bg-amber-550 text-slate-950 flex items-center justify-center rounded-bl-lg font-bold text-[8px]">
                          ✓
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-100 font-sans truncate mb-1">
                          {topic.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-snug font-sans">
                          {topic.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-[9px] font-sans">
                        <span className="text-slate-450">অসুবিধা: <strong className="text-indigo-400 font-bold">{topic.difficulty}</strong></span>
                        <span className="text-slate-455 font-mono">{topic.content.split(/\s+/).length} টি শব্দ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Exam Actions Bar */}
            <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 max-w-sm">
                <div className="p-2 sm:p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl shrink-0">
                  <Award size={20} className="animate-pulse" />
                </div>
                <div className="text-[11px] leading-relaxed text-slate-450">
                  পরীক্ষা দেওয়ার জন্য উপরে আপনার নাম লিখুন। পরীক্ষা সম্পূর্ণ হলে আমরা <strong className="text-amber-500">Easy learning zone</strong> একাডেমি সনদ দেব।
                </div>
              </div>

              <button
                id="btn-trigger-exam"
                onClick={handleLaunchExam}
                className="py-3 px-8 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <Trophy size={14} className="text-slate-950" />
                পরীক্ষা শুরু করুন
              </button>
            </div>
          </div>
        )}

        {/* RESULTS OVERLAY POPUP */}
        {showResultsOverlay && tempExamDetails && (
          <div className="flex-1 min-h-[420px] bg-slate-950/95 dark:bg-[#060a12]/98 border border-indigo-500/25 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-center animate-fade-in z-20">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
              <Trophy size={32} className="animate-pulse" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-sans mb-1 text-slate-100">
              {tempExamDetails.grade === "F" ? "পরীক্ষার ফলাফল" : "অভিনন্দন! আপনি উত্তীর্ণ হয়েছেন!"}
            </h3>
            
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6 font-semibold font-sans">
              সাফল্যের সাথে ৬০ সেকেন্ডের কিবোর্ড মূল্যায়ন টেস্ট সম্পূর্ণ হয়েছে। নিচে আপনার পরীক্ষার মার্কশিট দেওয়া হলো:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg w-full mb-8 font-sans">
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase font-extrabold font-mono tracking-wider mb-1">মোট গতি</span>
                <strong className="text-lg font-black text-amber-400 font-mono">{tempExamDetails.wpm} WPM</strong>
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase font-extrabold font-mono tracking-wider mb-1">নির্ভুলতা</span>
                <strong className="text-lg font-black text-emerald-400 font-mono">{tempExamDetails.accuracy}%</strong>
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase font-extrabold font-mono tracking-wider mb-1">অসুবিধা মাত্রা</span>
                <strong className="text-xs font-black text-indigo-400 leading-none h-full flex items-center justify-center pt-1.5">{tempExamDetails.difficulty}</strong>
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase font-extrabold font-mono tracking-wider mb-1">অর্জিত গ্রেড</span>
                <strong className={`text-lg font-black font-mono ${tempExamDetails.grade === "F" ? "text-rose-500" : "text-amber-500"}`}>
                  {tempExamDetails.grade}
                </strong>
              </div>
            </div>

            {tempExamDetails.grade === "F" ? (
              <div className="space-y-4">
                <p className="text-xs text-rose-450 leading-relaxed max-w-sm mx-auto font-medium">
                  দুঃখিত, নির্ভুলতা ৭০% এর কম হওয়াতে আমরা সনদ দিতে পারিনি। অনুগ্রহ করে ভুলগুলো এড়িয়ে আবার ট্রাই করুন।
                </p>
                <button
                  onClick={handleLaunchExam}
                  className="py-2.5 px-6 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-md mx-auto"
                >
                  <RotateCcw size={14} />
                  পুনরায় পরীক্ষা দিন
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-[11px] text-emerald-400 font-semibold max-w-sm mx-auto leading-relaxed">
                  ✓ অর্জিত মেডেল: <strong className="text-amber-450 font-bold">{tempExamDetails.badge}</strong><br/>
                  আপনার সার্টিফিকেট সয়ংক্রিয়ভাবে জেনারেট হয়ে গেছে!
                </div>
                <button
                  onClick={() => {
                    setShowResultsOverlay(false);
                    setActiveSubTab("view");
                  }}
                  className="py-2.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg hover:shadow-amber-500/10 text-slate-950 text-xs font-black rounded-xl cursor-pointer transition-all flex items-center gap-1.5 justify-center mx-auto"
                >
                  সার্টিফিকেট দেখুন
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* PRINTABLE ACTUAL CERTIFICATE CARD RENDER FRAME */}
        {activeSubTab === "view" && savedCert && !isExamActive && !isCountingDown && (
          <div 
            id="print-area-certificate"
            className={`
              flex-1 pb-6 w-full relative border-[12px] sm:border-[20px] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 md:aspect-[1.5] flex flex-col items-center justify-between p-6 sm:p-14 text-center select-none print-border
              ${
                selectedTheme === "ivory"
                  ? "bg-[#faf8f4] border-[#d4af37] text-slate-900"
                  : selectedTheme === "dark"
                    ? "bg-[#090d16] border-slate-800 text-[#f8fafc]"
                    : "bg-[#042417] border-emerald-500 text-emerald-100"
              }
            `}
          >
            {/* Elegant watermark background */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none select-none transition-all flex items-center justify-center font-sans tracking-widest font-black text-[22vw] select-none uppercase"
            >
              অ
            </div>

            {/* Corner Decorative Borders */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 opacity-30 select-none pointer-events-none rounded-tl-xl border-current"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 opacity-30 select-none pointer-events-none rounded-tr-xl border-current"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 opacity-30 select-none pointer-events-none rounded-bl-xl border-current"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 opacity-30 select-none pointer-events-none rounded-br-xl border-current"></div>

            {/* Certificate Header Banner */}
            <div className="space-y-1 sm:space-y-2 mt-2">
              <div className="flex items-center justify-center gap-1.5 text-[9px] sm:text-xs font-black uppercase tracking-widest text-amber-500 mb-1">
                <Sparkles size={14} className="text-amber-500 animate-pulse" />
                <span>CERTIFICATE OF TYPING MASTER</span>
                <Sparkles size={14} className="text-amber-500 animate-pulse" />
              </div>
              
              <h2 className="text-xl sm:text-3xl font-black tracking-tight font-sans">
                বাংলা টাইপিং দক্ষতা সনদপত্র
              </h2>
              <div className="h-0.5 w-24 bg-[#d4af37] mx-auto rounded-full mt-2"></div>
            </div>

            {/* Central Statement Box */}
            <div className="my-4 sm:my-6 max-w-xl space-y-4">
              <p className="text-[11px] sm:text-xs font-bold opacity-75 tracking-wide font-sans">
                এই মর্মে গর্বের সাথে সনদ প্রদান করা যাচ্ছে যে,
              </p>

              {/* Realtime Candidate Name Box */}
              <div className="h-10 sm:h-12 flex items-center justify-center">
                <span className={`text-xl sm:text-3xl font-black italic tracking-wide font-sans border-b border-dashed pb-1 w-full max-w-md ${
                  savedCert.userName 
                    ? selectedTheme === "ivory" ? "text-amber-600" : "text-amber-400"
                    : "text-slate-350"
                }`}>
                  {savedCert.userName || "[ পরীক্ষার্থীর নাম ]"}
                </span>
              </div>

              {/* Stat statement */}
              <p className="text-[11px] sm:text-xs leading-relaxed font-sans px-2 font-semibold">
                সাফল্যের সাথে <span className="text-amber-500 font-extrabold">Bangla Typing Practice</span> অফিশিয়াল কিবোর্ড মূল্যায়নে অংশগ্রহণ করেছেন। তিনি তাঁর পরীক্ষায় <strong className="text-indigo-400 font-bold">{savedCert.lessonTitle}</strong> (অসুবিধা মাত্রা: <strong className="text-amber-550 dark:text-amber-400 font-extrabold">{savedCert.difficulty}</strong>) এ সফলভাবে টাইপ করে সর্বোচ্চ টাইপিং গতি <span className="font-mono font-black text-amber-500 text-sm sm:text-base">{savedCert.wpm} WPM</span> বজায় রেখে ক্যাটাগরি অনুযায়ী চূড়ান্ত গ্রেড <span className="font-mono font-black text-rose-500 text-sm sm:text-base">{savedCert.grade}</span> ও <span className="text-emerald-500 font-black">{savedCert.badge}</span> অর্জন করে প্রশংসনীয় যোগ্যতার প্রমাণ দিয়েছেন।
              </p>
            </div>

            {/* Bottom block containing authentication seals & signatures */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full mt-4 items-end scale-95 sm:scale-100">
              
              {/* Credentials detail block */}
              <div className="flex flex-col items-start gap-1 text-[8px] sm:text-[10px] text-left opacity-70 font-sans font-bold select-none h-full justify-end">
                <div className="truncate text-[8px] text-[#94a3b8]">ক্রেডেন্সিয়াল আইডি:</div>
                <div className="font-mono font-black text-[8px] tracking-wide truncate max-w-[150px]">{savedCert.serialNo}</div>
                <div className="text-[8px] mt-0.5">তারিখ: <span className="font-semibold">{todayStr}</span></div>
              </div>

              {/* Middle Medallion Seal badge */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-500 flex items-center justify-center p-0.5 border-4 border-white/25 shadow-xl relative">
                  <div className="absolute inset-0 rounded-full border border-dashed border-slate-900/40"></div>
                  <Award size={24} className="text-slate-950 animate-pulse" />
                </div>
                <span className="text-[8px] sm:text-[9px] tracking-wider uppercase font-extrabold mt-1 text-amber-500 block truncate max-w-full">
                  {savedCert.badge}
                </span>
              </div>

              {/* Academy Official Autograph Signature */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="font-mono italic text-[10px] sm:text-xs select-none text-slate-400 opacity-60 leading-none h-5 flex items-end">
                  Easy_Learning_Zone
                </div>
                <div className="h-px bg-slate-400/40 w-24 sign-line"></div>
                <div className="text-[8px] sm:text-[9px] uppercase tracking-widest font-extrabold opacity-70 leading-normal">
                  Easy learning zone
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Custom Interactive Dialog Overlay (Alert / Confirm) to prevent iframe alert() / confirm() blockages */}
      {dialogConfig && dialogConfig.isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-up space-y-4">
            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Award className="text-amber-500 animate-pulse shrink-0" size={18} />
              {dialogConfig.title}
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              {dialogConfig.message}
            </p>

            <div className="flex gap-2.5 justify-end pt-2">
              {dialogConfig.showCancel && (
                <button
                  type="button"
                  onClick={() => setDialogConfig(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-zinc-300 rounded-xl cursor-pointer transition-all"
                >
                  {dialogConfig.cancelText || "না"}
                </button>
              )}
              <button
                type="button"
                onClick={dialogConfig.onConfirm}
                className="px-5 py-2 text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-xl cursor-pointer transition-all shadow-md"
              >
                {dialogConfig.confirmText || "হ্যাঁ, নিশ্চিত"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
