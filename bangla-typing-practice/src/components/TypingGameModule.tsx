/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Flame,
  Award,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  List,
  Star,
  Compass,
  Trophy,
  Zap,
  ShieldAlert,
  Clock,
  CheckCircle,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { getBijoyKeystrokes, convertToBijoy } from "../utils/bijoy";
import { convertToAvro, getPerfectAvroPhonetic } from "../utils/avro";
import { playKeyClick } from "../utils/sound";
import { AvroKeyboard } from "./AvroKeyboard";

function normalizeBengali(text: string): string {
  if (!text) return "";
  return text
    .replace(/\u09AF\u09BC/g, "\u09DF") // য + ় -> য়
    .replace(/\u09A1\u09BC/g, "\u09DC") // ড + ় -> ড়
    .replace(/\u09A2\u09BC/g, "\u09DD"); // ঢ + ় -> ঢ়
}


interface TypingGameModuleProps {
  typingMode: "avro" | "bijoy";
  sfxEnabled: boolean;
  theme: "light" | "dark";
  showPhoneticHints: boolean;
}

// Wordpools categorised by complexity
const VOWELS = ["অ", "আ", "ই", "ঈ", "উ", "ঊ", "ঋ", "এ", "ঐ", "ও", "ঔ"];
const CONSONANTS = ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ", "ট", "ঠ", "ড", "ঢ", "ণ", "ত", "থ", "দ", "ধ", "ন", "প", "ফ", "ব", "ভ", "ম", "য", "র", "ল", "শ", "ষ", "স", "হ", "ড়", "ঢ়", "য়", "ৎ", "ং", "ঃ", "ঁ"];

const SIMPLE_WORDS = [
  "মা", "বাবা", "আম", "জল", "ঘর", "বল", "বই", "খই", "বট", "পথ", "বন", "মন", "রস", "খল", "তল", "পা", "ফল", "ধর", "আশা", "চল",
  "ভয়", "জয়", "পড়", "লেখ", "খাও", "গান", "নাচ", "দল", "বল", "ধান", "পান", "লাল", "নীল", "কাল", "ফুল", "ফল", "পাখি", "নদী"
];

const MEDIUM_WORDS = [
  "আকাশ", "বাতাস", "সাগর", "কলম", "খবর", "জগৎ", "তরল", "সকাল", "বিকেল", "মানুষ", "বাংলা", "আলোক", "সবুজ", "খেলনা", "সোনার",
  "দেশের", "শাপলা", "সহজ", "কঠিন", "আজকে", "কালকে", "এখানে", "সেখানে", "কেমন", "কোথায়", "কেন", "কবে", "খেলোয়াড়", "জাতীয়", "সুন্দর"
];

const CONJUNCTS_WORDS = [
  "কষ্ট", "রক্ত", "জ্ঞান", "স্পষ্ট", "ইচ্ছা", "পক্ষ", "বন্টন", "বিজ্ঞান", "আনন্দ", "বিশ্ব", "মিষ্টি", "চেষ্টা", "শিক্ষা", "সৈনিক",
  "বৈঠক", "শান্ত", "আজাদ", "স্বাধীন", "তত্ত্ব", "উজ্জ্বল", "ব্রাহ্মণ", "উচ্ছ্বাস", "তত্ত্বাবধান", "সাযুজ্য", "পরীক্ষা", "ঈশ্বর"
];

const HARD_WORDS = [
  "ব্রাহ্মণবাড়িয়া", "উচ্ছ্বসিত", "অপরাহ্ণ", "ধূলিসাৎ", "সান্ত্বনা", "উজ্জ্বলতর", "প্রজ্বলিত", "ধীশক্তিযুক্ত",
  "বৈচিত্র্যময়", "আকাঙ্ক্ষা", "উত্তরাধিকার", "স্বাধিকার", "ব্যুৎপত্তি", "ঐতিহ্যবাহী", "কৌতূহলজনক", "মনস্তাত্ত্বিক",
  "স্বতঃস্ফূর্ত", "হৃদয়গ্রাহী"
];

const SENTENCES = [
  "আমাদের দেশের নাম বাংলাদেশ।",
  "বাংলা আমাদের অতি প্রিয় মাতৃভাষা।",
  "আমরা সর্বদা সত্য কথা বলব।",
  "আমাদের জাতীয় ফুল শাপলা।",
  "পাখি পাকা পেঁপে সুস্বাদু করে খায়।",
  "রংধনু ওঠে নীল গগন জুড়ে।",
  "বাংলাদেশ একটি অপরূপ রূপসী দেশ।",
  "সকালবেলা পূর্ব আকাশে সূর্য হাসে।",
  "বই পড়া মানুষের মহৎ অভ্যাস।",
  "একটি শিক্ষিত জাতি গড়ার একমাত্র হাতিয়ার বই।"
];

const AVRO_MAP: { [key: string]: string } = {
  "অ": "o",
  "আ": "a",
  "ই": "i",
  "ঈ": "I",
  "উ": "u",
  "ঊ": "U",
  "ঋ": "rri",
  "এ": "e",
  "ঐ": "OI",
  "ও": "O",
  "ঔ": "OU",
  "ক": "k",
  "খ": "kh",
  "গ": "g",
  "ঘ": "gh",
  "ঙ": "Ng",
  "চ": "c",
  "ছ": "ch",
  "জ": "j",
  "ঝ": "jh",
  "ঞ": "NG",
  "ট": "T",
  "ঠ": "Th",
  "ড": "D",
  "ঢ": "Dh",
  "ণ": "N",
  "ত": "t",
  "থ": "th",
  "দ": "d",
  "ধ": "dh",
  "ন": "n",
  "প": "p",
  "ফ": "ph",
  "ব": "b",
  "ভ": "v",
  "ম": "m",
  "য": "z",
  "র": "r",
  "ল": "l",
  "শ": "sh",
  "ষ": "Sh",
  "s": "s",
  "স": "s",
  "হ": "h",
  "ড়": "R",
  "র়": "R",
  "ঢ়": "Rh",
  "ঢ়": "Rh",
  "ay": "y",
  "য়": "y",
  "য়": "y",
  "য়া": "ya",
  "য়া": "ya",
  "ৎ": "t`",
  "ং": "ng",
  "ঃ": ":",
  "ঁ": "^",
  "া": "a",
  "ি": "i",
  "ী": "I",
  "ু": "u",
  "ূ": "U",
  "ৃ": "rri",
  "ে": "e",
  "ৈ": "OI",
  "ো": "O",
  "ৌ": "OU",
  "্য": "z",
  "্ব": "w",
  "্র": "r",
  "মা": "ma",
  "বাবা": "baba",
  "আম": "am",
  "জল": "jol",
  "ঘর": "ghor",
  "বল": "bol",
  "বই": "boi",
  "খই": "khoi",
  "বট": "boT",
  "পথ": "poth",
  "বন": "bon",
  "মন": "mon",
  "রস": "ros",
  "খল": "khol",
  "তল": "tol",
  "পা": "pa",
  "ফল": "phol",
  "ধর": "dhor",
  "আশা": "asha",
  "চল": "col",
  "ভয়": "voy",
  "ভয়": "voy",
  "জয়": "joy",
  "জয়": "joy",
  "পড়": "poR",
  "পর়": "poR",
  "লেখ": "lekh",
  "খাও": "khaO",
  "গান": "gan",
  "নাচ": "nac",
  "দল": "dol",
  "ধান": "dhan",
  "পান": "pan",
  "লাল": "lal",
  "নীল": "nIl",
  "কাল": "kal",
  "ফুল": "phul",
  "পাখি": "pakhi",
  "নদী": "nodI",
  "আকাশ": "akash",
  "বাতাস": "batas",
  "সাগর": "sagor",
  "কলম": "kolom",
  "খবর": "khobor",
  "জগৎ": "jogt`",
  "তরল": "torol",
  "সকাল": "sokal",
  "বিকেল": "bikel",
  "মানুষ": "manuSh",
  "বাংলা": "bangla",
  "আলোক": "alOk",
  "সবুজ": "sobuj",
  "খেলনা": "khelona",
  "সোনার": "sOnar",
  "দেশের": "desher",
  "শাপলা": "shapola",
  "সহজ": "sohoj",
  "কঠিন": "koThin",
  "আজকে": "ajoke",
  "কালকে": "kaloke",
  "এখানে": "ekhane",
  "সেখানে": "sekhane",
  "কেমন": "kemon",
  "কোথায়": "kOthay",
  "কোথায়": "kOthay",
  "কেন": "ken",
  "কবে": "kobe",
  "খেলোয়াড়": "khelOyaD়",
  "খেলোয়াড়": "khelOyaD়",
  "জাতীয়": "jatIy",
  "জাতীয়": "jatIy",
  "সুন্দর": "sundor",
  "কষ্ট": "koShT",
  "রক্ত": "rokt",
  "জ্ঞান": "jNGan",
  "স্পষ্ট": "spoShT",
  "ইচ্ছা": "iccha",
  "পক্ষ": "pokSh",
  "বন্টন": "bonTon",
  "বিজ্ঞান": "bijNGan",
  "আনন্দ": "anond",
  "বিশ্ব": "bishb",
  "মিষ্টি": "miShTi",
  "চেষ্টা": "ceShTa",
  "শিক্ষা": "shikSha",
  "সৈনিক": "sOInik",
  "বৈঠক": "bOIThok",
  "শান্ত": "shant",
  "আজাদ": "ajad",
  "স্বাধীন": "sbadhIn",
  "তত্ত্ব": "tottb",
  "উজ্জ্বল": "ujjbol",
  "ব্রাহ্মণ": "brahmoN",
  "উচ্ছ্বাস": "ucchbas",
  "তত্ত্বাবধান": "tottbabodhan",
  "সাযুজ্য": "sazujz",
  "পরীক্ষা": "porIkSha",
  "ঈশ্বর": "Ishbor",
  "উচ্ছ্বসিত": "ucchbosit",
  "অপরাহ্ণ": "oporahN",
  "ধূলিসাৎ": "dhUlisat`",
  "সান্ত্বনা": "santbona",
  "উজ্জ্বলতর": "ujjbolotor",
  "প্রজ্বলিত": "projbolit",
  "ধীশক্তিযুক্ত": "dhIshoktizukt",
  "বৈচিত্র্যময়": "bOIcitrzomoy",
  "বৈচিত্র্যময়": "bOIcitrzomoy",
  "আকাঙ্ক্ষা": "akaNgkSha",
  "উত্তরাধিকার": "uttoradhikar",
  "স্বাধিকার": "sbadhikar",
  "ব্যুৎপত্তি": "bzut`potti",
  "ঐতিহ্যবাহী": "OItihzobahI",
  "কৌতূহলজনক": "kOUtUholojonok",
  "মনস্তাত্ত্বিক": "monostattbik",
  "স্বতঃস্ফূর্ত": "sbot:sphUrt",
  "হৃদয়গ্রাহী": "hrridoyograhI",
  "হৃদয়গ্রাহী": "hrridoyograhI",
  "আমাদের": "amader",
  "নাম": "nam",
  "বাংলাদেশ": "bangladesh",
  "অতি": "oti",
  "প্রিয়": "priy",
  "প্রিয়": "priy",
  "মাতৃভাষা": "matrrivaSha",
  "আমরা": "amora",
  "সর্বদা": "sorboda",
  "সত্য": "sotz",
  "কথা": "kotha",
  "বলব": "bolob",
  "পাকা": "paka",
  "পেঁপে": "pe^pe",
  "সুস্বাদু": "susbadu",
  "করে": "kore",
  "খায়": "khay",
  "খায়": "khay",
  "রংধনু": "rngdhonu",
  "ওঠে": "OThe",
  "গগন": "gogon",
  "জুড়ে": "juRe",
  "জুর়ে": "juRe",
  "একটি": "ekoTi",
  "অপরূপ": "oporUp",
  "রূপসী": "rUposI",
  "দেশ": "desh",
  "সকালবেলা": "sokalobela",
  "পূর্ব": "pUrb",
  "আকাশে": "akashe",
  "সূর্য": "sUrz",
  "হাসে": "hase",
  "পড়া": "poRa",
  "পর়া": "poRa",
  "মানুষের": "manuSher",
  "মহৎ": "mohot`",
  "অভ্যাস": "ovzas",
  "শিক্ষিত": "shikShit",
  "জাতি": "jati",
  "গড়ার": "goRar",
  "গর়ার": "goRar",
  "একমাত্র": "ekomatr",
  "হাতিয়ার": "hatiyar",
  "হাতিয়ার": "hatiyar",
  "নৌকা": "nOUka",
  "বায়": "bay",
  "বায়": "bay",
  "আমার": "amar",
  "আমি": "ami",
  "তোমায়": "tOmay",
  "তোমায়": "tOmay",
  "ভালবাসি": "valobasi",
  "কে": "ke",
  "হে": "he",
  "সংসার": "sngsar",
  "সাগরে": "sagore",
  "মেলা": "mela",
  "কূলে": "kUle",
  "একা": "eka",
  "বসে": "bose",
  "আছি": "achi",
  "নাহি": "nahi",
  "ভরসা": "vorosa",
  "একুশে": "ekushe",
  "অহংকার": "ohngkar",
  "ভাষা": "vaSha",
  "অমর": "omor",
  "হোক": "hOk",
  "পাখিরা": "pakhira",
  "বনে": "bone",
  "ফুটে": "phuTe",
  "বাতাসে": "batase",
  "ব্রাহ্মণবাড়িয়া": "brahmoNobaRiya",
  "ব্রাহ্মণবাড়িয়া": "brahmoNobaRiya",
  "সোনার_বাংলা": "sOnar_bangla",
  "স্বাধীনতাহীনতায়": "sbadhInotahInotay",
  "স্বাধীনতাহীনতায়": "sbadhInotahInotay",
  "মা।": "ma.",
  "মা,": "ma,",
  "মা.": "ma.",
  "মা?": "ma?",
  "মা!": "ma!",
  "বাবা।": "baba.",
  "বাবা,": "baba,",
  "বাবা.": "baba.",
  "বাবা?": "baba?",
  "বাবা!": "baba!",
  "আম।": "am.",
  "আম,": "am,",
  "আম.": "am.",
  "আম?": "am?",
  "আম!": "am!",
  "জল।": "jol.",
  "জল,": "jol,",
  "জল.": "jol.",
  "জল?": "jol?",
  "জল!": "jol!",
  "ঘর।": "ghor.",
  "ঘর,": "ghor,",
  "ঘর.": "ghor.",
  "ঘর?": "ghor?",
  "ঘর!": "ghor!",
  "বল।": "bol.",
  "বল,": "bol,",
  "বল.": "bol.",
  "বল?": "bol?",
  "বল!": "bol!",
  "বই।": "boi.",
  "বই,": "boi,",
  "বই.": "boi.",
  "বই?": "boi?",
  "বই!": "boi!",
  "খই।": "khoi.",
  "খই,": "khoi,",
  "খই.": "khoi.",
  "খই?": "khoi?",
  "খই!": "khoi!",
  "বট।": "boT.",
  "বট,": "boT,",
  "বট.": "boT.",
  "বট?": "boT?",
  "বট!": "boT!",
  "পথ।": "poth.",
  "পথ,": "poth,",
  "পথ.": "poth.",
  "পথ?": "poth?",
  "পথ!": "poth!",
  "বন।": "bon.",
  "বন,": "bon,",
  "বন.": "bon.",
  "বন?": "bon?",
  "বন!": "bon!",
  "মন।": "mon.",
  "মন,": "mon,",
  "মন.": "mon.",
  "মন?": "mon?",
  "মন!": "mon!",
  "রস।": "ros.",
  "রস,": "ros,",
  "রস.": "ros.",
  "রস?": "ros?",
  "রস!": "ros!",
  "খল।": "khol.",
  "খল,": "khol,",
  "খল.": "khol.",
  "খল?": "khol?",
  "খল!": "khol!",
  "তল।": "tol.",
  "তল,": "tol,",
  "তল.": "tol.",
  "তল?": "tol?",
  "তল!": "tol!",
  "পা।": "pa.",
  "পা,": "pa,",
  "পা.": "pa.",
  "পা?": "pa?",
  "পা!": "pa!",
  "ফল।": "phol.",
  "ফল,": "phol,",
  "ফল.": "phol.",
  "ফল?": "phol?",
  "ফল!": "phol!",
  "ধর।": "dhor.",
  "ধর,": "dhor,",
  "ধর.": "dhor.",
  "ধর?": "dhor?",
  "ধর!": "dhor!",
  "আশা।": "asha.",
  "আশা,": "asha,",
  "আশা.": "asha.",
  "আশা?": "asha?",
  "আশা!": "asha!",
  "চল।": "col.",
  "চল,": "col,",
  "চল.": "col.",
  "চল?": "col?",
  "চল!": "col!",
  "ভয়।": "voy.",
  "ভয়।": "voy.",
  "ভয়,": "voy,",
  "ভয়,": "voy,",
  "ভয়.": "voy.",
  "ভয়.": "voy.",
  "ভয়?": "voy?",
  "ভয়?": "voy?",
  "ভয়!": "voy!",
  "ভয়!": "voy!",
  "জয়।": "joy.",
  "জয়।": "joy.",
  "জয়,": "joy,",
  "জয়,": "joy,",
  "জয়.": "joy.",
  "জয়.": "joy.",
  "জয়?": "joy?",
  "জয়?": "joy?",
  "জয়!": "joy!",
  "জয়!": "joy!",
  "পড়।": "poR.",
  "পর়।": "poR.",
  "পড়,": "poR,",
  "পর়,": "poR,",
  "পড়.": "poR.",
  "পর়.": "poR.",
  "পড়?": "poR?",
  "পর়?": "poR?",
  "পড়!": "poR!",
  "পর়!": "poR!",
  "লেখ।": "lekh.",
  "লেখ,": "lekh,",
  "লেখ.": "lekh.",
  "লেখ?": "lekh?",
  "লেখ!": "lekh!",
  "খাও।": "khaO.",
  "খাও,": "khaO,",
  "খাও.": "khaO.",
  "খাও?": "khaO?",
  "খাও!": "khaO!",
  "গান।": "gan.",
  "গান,": "gan,",
  "গান.": "gan.",
  "গান?": "gan?",
  "গান!": "gan!",
  "নাচ।": "nac.",
  "নাচ,": "nac,",
  "নাচ.": "nac.",
  "নাচ?": "nac?",
  "নাচ!": "nac!",
  "দল।": "dol.",
  "দল,": "dol,",
  "দল.": "dol.",
  "দল?": "dol?",
  "দল!": "dol!",
  "ধান।": "dhan.",
  "ধান,": "dhan,",
  "ধান.": "dhan.",
  "ধান?": "dhan?",
  "ধান!": "dhan!",
  "পান।": "pan.",
  "পান,": "pan,",
  "পান.": "pan.",
  "পান?": "pan?",
  "পান!": "pan!",
  "লাল।": "lal.",
  "লাল,": "lal,",
  "লাল.": "lal.",
  "লাল?": "lal?",
  "লাল!": "lal!",
  "নীল।": "nIl.",
  "নীল,": "nIl,",
  "নীল.": "nIl.",
  "নীল?": "nIl?",
  "নীল!": "nIl!",
  "কাল।": "kal.",
  "কাল,": "kal,",
  "কাল.": "kal.",
  "কাল?": "kal?",
  "কাল!": "kal!",
  "ফুল।": "phul.",
  "ফুল,": "phul,",
  "ফুল.": "phul.",
  "ফুল?": "phul?",
  "ফুল!": "phul!",
  "পাখি।": "pakhi.",
  "পাখি,": "pakhi,",
  "পাখি.": "pakhi.",
  "পাখি?": "pakhi?",
  "পাখি!": "pakhi!",
  "নদী।": "nodI.",
  "নদী,": "nodI,",
  "নদী.": "nodI.",
  "নদী?": "nodI?",
  "নদী!": "nodI!",
  "আকাশ।": "akash.",
  "আকাশ,": "akash,",
  "আকাশ.": "akash.",
  "আকাশ?": "akash?",
  "আকাশ!": "akash!",
  "বাতাস।": "batas.",
  "বাতাস,": "batas,",
  "বাতাস.": "batas.",
  "বাতাস?": "batas?",
  "বাতাস!": "batas!",
  "সাগর।": "sagor.",
  "সাগর,": "sagor,",
  "সাগর.": "sagor.",
  "সাগর?": "sagor?",
  "সাগর!": "sagor!",
  "কলম।": "kolom.",
  "কলম,": "kolom,",
  "কলম.": "kolom.",
  "কলম?": "kolom?",
  "কলম!": "kolom!",
  "খবর।": "khobor.",
  "খবর,": "khobor,",
  "খবর.": "khobor.",
  "খবর?": "khobor?",
  "খবর!": "khobor!",
  "জগৎ।": "jogt`.",
  "জগৎ,": "jogt`,",
  "জগৎ.": "jogt`.",
  "জগৎ?": "jogt`?",
  "জগৎ!": "jogt`!",
  "তরল।": "torol.",
  "তরল,": "torol,",
  "তরল.": "torol.",
  "তরল?": "torol?",
  "তরল!": "torol!",
  "সকাল।": "sokal.",
  "সকাল,": "sokal,",
  "সকাল.": "sokal.",
  "সকাল?": "sokal?",
  "সকাল!": "sokal!",
  "বিকেল।": "bikel.",
  "বিকেল,": "bikel,",
  "বিকেল.": "bikel.",
  "বিকেল?": "bikel?",
  "বিকেল!": "bikel!",
  "মানুষ।": "manuSh.",
  "মানুষ,": "manuSh,",
  "মানুষ.": "manuSh.",
  "মানুষ?": "manuSh?",
  "মানুষ!": "manuSh!",
  "বাংলা।": "bangla.",
  "বাংলা,": "bangla,",
  "বাংলা.": "bangla.",
  "বাংলা?": "bangla?",
  "বাংলা!": "bangla!",
  "আলোক।": "alOk.",
  "আলোক,": "alOk,",
  "আলোক.": "alOk.",
  "আলোক?": "alOk?",
  "আলোক!": "alOk!",
  "সবুজ।": "sobuj.",
  "সবুজ,": "sobuj,",
  "সবুজ.": "sobuj.",
  "সবুজ?": "sobuj?",
  "সবুজ!": "sobuj!",
  "খেলনা।": "khelona.",
  "খেলনা,": "khelona,",
  "খেলনা.": "khelona.",
  "খেলনা?": "khelona?",
  "খেলনা!": "khelona!",
  "সোনার।": "sOnar.",
  "সোনার,": "sOnar,",
  "সোনার.": "sOnar.",
  "সোনার?": "sOnar?",
  "সোনার!": "sOnar!",
  "দেশের।": "desher.",
  "দেশের,": "desher,",
  "দেশের.": "desher.",
  "দেশের?": "desher?",
  "দেশের!": "desher!",
  "শাপলা।": "shapola.",
  "শাপলা,": "shapola,",
  "শাপলা.": "shapola.",
  "শাপলা?": "shapola?",
  "শাপলা!": "shapola!",
  "সহজ।": "sohoj.",
  "সহজ,": "sohoj,",
  "সহজ.": "sohoj.",
  "সহজ?": "sohoj?",
  "সহজ!": "sohoj!",
  "কঠিন।": "koThin.",
  "কঠিন,": "koThin,",
  "কঠিন.": "koThin.",
  "কঠিন?": "koThin?",
  "কঠিন!": "koThin!",
  "আজকে।": "ajoke.",
  "আজকে,": "ajoke,",
  "আজকে.": "ajoke.",
  "আজকে?": "ajoke?",
  "আজকে!": "ajoke!",
  "কালকে।": "kaloke.",
  "কালকে,": "kaloke,",
  "কালকে.": "kaloke.",
  "কালকে?": "kaloke?",
  "কালকে!": "kaloke!",
  "এখানে।": "ekhane.",
  "এখানে,": "ekhane,",
  "এখানে.": "ekhane.",
  "এখানে?": "ekhane?",
  "এখানে!": "ekhane!",
  "সেখানে।": "sekhane.",
  "সেখানে,": "sekhane,",
  "সেখানে.": "sekhane.",
  "সেখানে?": "sekhane?",
  "সেখানে!": "sekhane!",
  "কেমন।": "kemon.",
  "কেমন,": "kemon,",
  "কেমন.": "kemon.",
  "কেমন?": "kemon?",
  "কেমন!": "kemon!",
  "কোথায়।": "kOthay.",
  "কোথায়।": "kOthay.",
  "কোথায়,": "kOthay,",
  "কোথায়,": "kOthay,",
  "কোথায়.": "kOthay.",
  "কোথায়.": "kOthay.",
  "কোথায়?": "kOthay?",
  "কোথায়?": "kOthay?",
  "কোথায়!": "kOthay!",
  "কোথায়!": "kOthay!",
  "কেন।": "ken.",
  "কেন,": "ken,",
  "কেন.": "ken.",
  "কেন?": "ken?",
  "কেন!": "ken!",
  "কবে।": "kobe.",
  "কবে,": "kobe,",
  "কবে.": "kobe.",
  "কবে?": "kobe?",
  "কবে!": "kobe!",
  "খেলোয়াড়।": "khelOyaD়.",
  "খেলোয়াড়।": "khelOyaD়.",
  "খেলোয়াড়,": "khelOyaD়,",
  "খেলোয়াড়,": "khelOyaD়,",
  "খেলোয়াড়.": "khelOyaD়.",
  "খেলোয়াড়.": "khelOyaD়.",
  "খেলোয়াড়?": "khelOyaD়?",
  "খেলোয়াড়?": "khelOyaD়?",
  "খেলোয়াড়!": "khelOyaD়!",
  "খেলোয়াড়!": "khelOyaD়!",
  "জাতীয়।": "jatIy.",
  "জাতীয়।": "jatIy.",
  "জাতীয়,": "jatIy,",
  "জাতীয়,": "jatIy,",
  "জাতীয়.": "jatIy.",
  "জাতীয়.": "jatIy.",
  "জাতীয়?": "jatIy?",
  "জাতীয়?": "jatIy?",
  "জাতীয়!": "jatIy!",
  "জাতীয়!": "jatIy!",
  "সুন্দর।": "sundor.",
  "সুন্দর,": "sundor,",
  "সুন্দর.": "sundor.",
  "সুন্দর?": "sundor?",
  "সুন্দর!": "sundor!",
  "কষ্ট।": "koShT.",
  "কষ্ট,": "koShT,",
  "কষ্ট.": "koShT.",
  "কষ্ট?": "koShT?",
  "কষ্ট!": "koShT!",
  "রক্ত।": "rokt.",
  "রক্ত,": "rokt,",
  "রক্ত.": "rokt.",
  "রক্ত?": "rokt?",
  "রক্ত!": "rokt!",
  "জ্ঞান।": "jNGan.",
  "জ্ঞান,": "jNGan,",
  "জ্ঞান.": "jNGan.",
  "জ্ঞান?": "jNGan?",
  "জ্ঞান!": "jNGan!",
  "স্পষ্ট।": "spoShT.",
  "স্পষ্ট,": "spoShT,",
  "স্পষ্ট.": "spoShT.",
  "স্পষ্ট?": "spoShT?",
  "স্পষ্ট!": "spoShT!",
  "ইচ্ছা।": "iccha.",
  "ইচ্ছা,": "iccha,",
  "ইচ্ছা.": "iccha.",
  "ইচ্ছা?": "iccha?",
  "ইচ্ছা!": "iccha!",
  "পক্ষ।": "pokSh.",
  "পক্ষ,": "pokSh,",
  "পক্ষ.": "pokSh.",
  "পক্ষ?": "pokSh?",
  "পক্ষ!": "pokSh!",
  "বন্টন।": "bonTon.",
  "বন্টন,": "bonTon,",
  "বন্টন.": "bonTon.",
  "বন্টন?": "bonTon?",
  "বন্টন!": "bonTon!",
  "বিজ্ঞান।": "bijNGan.",
  "বিজ্ঞান,": "bijNGan,",
  "বিজ্ঞান.": "bijNGan.",
  "বিজ্ঞান?": "bijNGan?",
  "বিজ্ঞান!": "bijNGan!",
  "আনন্দ।": "anond.",
  "আনন্দ,": "anond,",
  "আনন্দ.": "anond.",
  "আনন্দ?": "anond?",
  "আনন্দ!": "anond!",
  "বিশ্ব।": "bishb.",
  "বিশ্ব,": "bishb,",
  "বিশ্ব.": "bishb.",
  "বিশ্ব?": "bishb?",
  "বিশ্ব!": "bishb!",
  "মিষ্টি।": "miShTi.",
  "মিষ্টি,": "miShTi,",
  "মিষ্টি.": "miShTi.",
  "মিষ্টি?": "miShTi?",
  "মিষ্টি!": "miShTi!",
  "চেষ্টা।": "ceShTa.",
  "চেষ্টা,": "ceShTa,",
  "চেষ্টা.": "ceShTa.",
  "চেষ্টা?": "ceShTa?",
  "চেষ্টা!": "ceShTa!",
  "শিক্ষা।": "shikSha.",
  "শিক্ষা,": "shikSha,",
  "শিক্ষা.": "shikSha.",
  "শিক্ষা?": "shikSha?",
  "শিক্ষা!": "shikSha!",
  "সৈনিক।": "sOInik.",
  "সৈনিক,": "sOInik,",
  "সৈনিক.": "sOInik.",
  "সৈনিক?": "sOInik?",
  "সৈনিক!": "sOInik!",
  "বৈঠক।": "bOIThok.",
  "বৈঠক,": "bOIThok,",
  "বৈঠক.": "bOIThok.",
  "বৈঠক?": "bOIThok?",
  "বৈঠক!": "bOIThok!",
  "শান্ত।": "shant.",
  "শান্ত,": "shant,",
  "শান্ত.": "shant.",
  "শান্ত?": "shant?",
  "শান্ত!": "shant!",
  "আজাদ।": "ajad.",
  "আজাদ,": "ajad,",
  "আজাদ.": "ajad.",
  "আজাদ?": "ajad?",
  "আজাদ!": "ajad!",
  "স্বাধীন।": "sbadhIn.",
  "স্বাধীন,": "sbadhIn,",
  "স্বাধীন.": "sbadhIn.",
  "স্বাধীন?": "sbadhIn?",
  "স্বাধীন!": "sbadhIn!",
  "তত্ত্ব।": "tottb.",
  "তত্ত্ব,": "tottb,",
  "তত্ত্ব.": "tottb.",
  "তত্ত্ব?": "tottb?",
  "তত্ত্ব!": "tottb!",
  "উজ্জ্বল।": "ujjbol.",
  "উজ্জ্বল,": "ujjbol,",
  "উজ্জ্বল.": "ujjbol.",
  "উজ্জ্বল?": "ujjbol?",
  "উজ্জ্বল!": "ujjbol!",
  "ব্রাহ্মণ।": "brahmoN.",
  "ব্রাহ্মণ,": "brahmoN,",
  "ব্রাহ্মণ.": "brahmoN.",
  "ব্রাহ্মণ?": "brahmoN?",
  "ব্রাহ্মণ!": "brahmoN!",
  "উচ্ছ্বাস।": "ucchbas.",
  "উচ্ছ্বাস,": "ucchbas,",
  "উচ্ছ্বাস.": "ucchbas.",
  "উচ্ছ্বাস?": "ucchbas?",
  "উচ্ছ্বাস!": "ucchbas!",
  "তত্ত্বাবধান।": "tottbabodhan.",
  "তত্ত্বাবধান,": "tottbabodhan,",
  "তত্ত্বাবধান.": "tottbabodhan.",
  "তত্ত্বাবধান?": "tottbabodhan?",
  "তত্ত্বাবধান!": "tottbabodhan!",
  "সাযুজ্য।": "sazujz.",
  "সাযুজ্য,": "sazujz,",
  "সাযুজ্য.": "sazujz.",
  "সাযুজ্য?": "sazujz?",
  "সাযুজ্য!": "sazujz!",
  "পরীক্ষা।": "porIkSha.",
  "পরীক্ষা,": "porIkSha,",
  "পরীক্ষা.": "porIkSha.",
  "পরীক্ষা?": "porIkSha?",
  "পরীক্ষা!": "porIkSha!",
  "ঈশ্বর।": "Ishbor.",
  "ঈশ্বর,": "Ishbor,",
  "ঈশ্বর.": "Ishbor.",
  "ঈশ্বর?": "Ishbor?",
  "ঈশ্বর!": "Ishbor!",
  "উচ্ছ্বসিত।": "ucchbosit.",
  "উচ্ছ্বসিত,": "ucchbosit,",
  "উচ্ছ্বসিত.": "ucchbosit.",
  "উচ্ছ্বসিত?": "ucchbosit?",
  "উচ্ছ্বসিত!": "ucchbosit!",
  "অপরাহ্ণ।": "oporahN.",
  "অপরাহ্ণ,": "oporahN,",
  "অপরাহ্ণ.": "oporahN.",
  "অপরাহ্ণ?": "oporahN?",
  "অপরাহ্ণ!": "oporahN!",
  "ধূলিসাৎ।": "dhUlisat`.",
  "ধূলিসাৎ,": "dhUlisat`,",
  "ধূলিসাৎ.": "dhUlisat`.",
  "ধূলিসাৎ?": "dhUlisat`?",
  "ধূলিসাৎ!": "dhUlisat`!",
  "সান্ত্বনা।": "santbona.",
  "সান্ত্বনা,": "santbona,",
  "সান্ত্বনা.": "santbona.",
  "সান্ত্বনা?": "santbona?",
  "সান্ত্বনা!": "santbona!",
  "উজ্জ্বলতর।": "ujjbolotor.",
  "উজ্জ্বলতর,": "ujjbolotor,",
  "উজ্জ্বলতর.": "ujjbolotor.",
  "উজ্জ্বলতর?": "ujjbolotor?",
  "উজ্জ্বলতর!": "ujjbolotor!",
  "প্রজ্বলিত।": "projbolit.",
  "প্রজ্বলিত,": "projbolit,",
  "প্রজ্বলিত.": "projbolit.",
  "প্রজ্বলিত?": "projbolit?",
  "প্রজ্বলিত!": "projbolit!",
  "ধীশক্তিযুক্ত।": "dhIshoktizukt.",
  "ধীশক্তিযুক্ত,": "dhIshoktizukt,",
  "ধীশক্তিযুক্ত.": "dhIshoktizukt.",
  "ধীশক্তিযুক্ত?": "dhIshoktizukt?",
  "ধীশক্তিযুক্ত!": "dhIshoktizukt!",
  "বৈচিত্র্যময়।": "bOIcitrzomoy.",
  "বৈচিত্র্যময়।": "bOIcitrzomoy.",
  "বৈচিত্র্যময়,": "bOIcitrzomoy,",
  "বৈচিত্র্যময়,": "bOIcitrzomoy,",
  "বৈচিত্র্যময়.": "bOIcitrzomoy.",
  "বৈচিত্র্যময়.": "bOIcitrzomoy.",
  "বৈচিত্র্যময়?": "bOIcitrzomoy?",
  "বৈচিত্র্যময়?": "bOIcitrzomoy?",
  "বৈচিত্র্যময়!": "bOIcitrzomoy!",
  "বৈচিত্র্যময়!": "bOIcitrzomoy!",
  "আকাঙ্ক্ষা।": "akaNgkSha.",
  "আকাঙ্ক্ষা,": "akaNgkSha,",
  "আকাঙ্ক্ষা.": "akaNgkSha.",
  "আকাঙ্ক্ষা?": "akaNgkSha?",
  "আকাঙ্ক্ষা!": "akaNgkSha!",
  "উত্তরাধিকার।": "uttoradhikar.",
  "উত্তরাধিকার,": "uttoradhikar,",
  "উত্তরাধিকার.": "uttoradhikar.",
  "উত্তরাধিকার?": "uttoradhikar?",
  "উত্তরাধিকার!": "uttoradhikar!",
  "স্বাধিকার।": "sbadhikar.",
  "স্বাধিকার,": "sbadhikar,",
  "স্বাধিকার.": "sbadhikar.",
  "স্বাধিকার?": "sbadhikar?",
  "স্বাধিকার!": "sbadhikar!",
  "ব্যুৎপত্তি।": "bzut`potti.",
  "ব্যুৎপত্তি,": "bzut`potti,",
  "ব্যুৎপত্তি.": "bzut`potti.",
  "ব্যুৎপত্তি?": "bzut`potti?",
  "ব্যুৎপত্তি!": "bzut`potti!",
  "ঐতিহ্যবাহী।": "OItihzobahI.",
  "ঐতিহ্যবাহী,": "OItihzobahI,",
  "ঐতিহ্যবাহী.": "OItihzobahI.",
  "ঐতিহ্যবাহী?": "OItihzobahI?",
  "ঐতিহ্যবাহী!": "OItihzobahI!",
  "কৌতূহলজনক।": "kOUtUholojonok.",
  "কৌতূহলজনক,": "kOUtUholojonok,",
  "কৌতূহলজনক.": "kOUtUholojonok.",
  "কৌতূহলজনক?": "kOUtUholojonok?",
  "কৌতূহলজনক!": "kOUtUholojonok!",
  "মনস্তাত্ত্বিক।": "monostattbik.",
  "মনস্তাত্ত্বিক,": "monostattbik,",
  "মনস্তাত্ত্বিক.": "monostattbik.",
  "মনস্তাত্ত্বিক?": "monostattbik?",
  "মনস্তাত্ত্বিক!": "monostattbik!",
  "স্বতঃস্ফূর্ত।": "sbot:sphUrt.",
  "স্বতঃস্ফূর্ত,": "sbot:sphUrt,",
  "স্বতঃস্ফূর্ত.": "sbot:sphUrt.",
  "স্বতঃস্ফূর্ত?": "sbot:sphUrt?",
  "স্বতঃস্ফূর্ত!": "sbot:sphUrt!",
  "হৃদয়গ্রাহী।": "hrridoyograhI.",
  "হৃদয়গ্রাহী।": "hrridoyograhI.",
  "হৃদয়গ্রাহী,": "hrridoyograhI,",
  "হৃদয়গ্রাহী,": "hrridoyograhI,",
  "হৃদয়গ্রাহী.": "hrridoyograhI.",
  "হৃদয়গ্রাহী.": "hrridoyograhI.",
  "হৃদয়গ্রাহী?": "hrridoyograhI?",
  "হৃদয়গ্রাহী?": "hrridoyograhI?",
  "হৃদয়গ্রাহী!": "hrridoyograhI!",
  "হৃদয়গ্রাহী!": "hrridoyograhI!",
  "আমাদের।": "amader.",
  "আমাদের,": "amader,",
  "আমাদের.": "amader.",
  "আমাদের?": "amader?",
  "আমাদের!": "amader!",
  "নাম।": "nam.",
  "নাম,": "nam,",
  "নাম.": "nam.",
  "নাম?": "nam?",
  "নাম!": "nam!",
  "বাংলাদেশ।": "bangladesh.",
  "বাংলাদেশ,": "bangladesh,",
  "বাংলাদেশ.": "bangladesh.",
  "বাংলাদেশ?": "bangladesh?",
  "বাংলাদেশ!": "bangladesh!",
  "অতি।": "oti.",
  "অতি,": "oti,",
  "অতি.": "oti.",
  "অতি?": "oti?",
  "অতি!": "oti!",
  "প্রিয়।": "priy.",
  "প্রিয়।": "priy.",
  "প্রিয়,": "priy,",
  "প্রিয়,": "priy,",
  "প্রিয়.": "priy.",
  "প্রিয়.": "priy.",
  "প্রিয়?": "priy?",
  "প্রিয়?": "priy?",
  "প্রিয়!": "priy!",
  "প্রিয়!": "priy!",
  "মাতৃভাষা।": "matrrivaSha.",
  "মাতৃভাষা,": "matrrivaSha,",
  "মাতৃভাষা.": "matrrivaSha.",
  "মাতৃভাষা?": "matrrivaSha?",
  "মাতৃভাষা!": "matrrivaSha!",
  "আমরা।": "amora.",
  "আমরা,": "amora,",
  "আমরা.": "amora.",
  "আমরা?": "amora?",
  "আমরা!": "amora!",
  "সর্বদা।": "sorboda.",
  "সর্বদা,": "sorboda,",
  "সর্বদা.": "sorboda.",
  "সর্বদা?": "sorboda?",
  "সর্বদা!": "sorboda!",
  "সত্য।": "sotz.",
  "সত্য,": "sotz,",
  "সত্য.": "sotz.",
  "সত্য?": "sotz?",
  "সত্য!": "sotz!",
  "কথা।": "kotha.",
  "কথা,": "kotha,",
  "কথা.": "kotha.",
  "কথা?": "kotha?",
  "কথা!": "kotha!",
  "বলব।": "bolob.",
  "বলব,": "bolob,",
  "বলব.": "bolob.",
  "বলব?": "bolob?",
  "বলব!": "bolob!",
  "পাকা।": "paka.",
  "পাকা,": "paka,",
  "পাকা.": "paka.",
  "পাকা?": "paka?",
  "পাকা!": "paka!",
  "পেঁপে।": "pe^pe.",
  "পেঁপে,": "pe^pe,",
  "পেঁপে.": "pe^pe.",
  "পেঁপে?": "pe^pe?",
  "পেঁপে!": "pe^pe!",
  "সুস্বাদু।": "susbadu.",
  "সুস্বাদু,": "susbadu,",
  "সুস্বাদু.": "susbadu.",
  "সুস্বাদু?": "susbadu?",
  "সুস্বাদু!": "susbadu!",
  "করে।": "kore.",
  "করে,": "kore,",
  "করে.": "kore.",
  "করে?": "kore?",
  "করে!": "kore!",
  "খায়।": "khay.",
  "খায়।": "khay.",
  "খায়,": "khay,",
  "খায়,": "khay,",
  "খায়.": "khay.",
  "খায়.": "khay.",
  "খায়?": "khay?",
  "খায়?": "khay?",
  "খায়!": "khay!",
  "খায়!": "khay!",
  "রংধনু।": "rngdhonu.",
  "রংধনু,": "rngdhonu,",
  "রংধনু.": "rngdhonu.",
  "রংধনু?": "rngdhonu?",
  "রংধনু!": "rngdhonu!",
  "ওঠে।": "OThe.",
  "ওঠে,": "OThe,",
  "ওঠে.": "OThe.",
  "ওঠে?": "OThe?",
  "ওঠে!": "OThe!",
  "গগন।": "gogon.",
  "গগন,": "gogon,",
  "গগন.": "gogon.",
  "গগন?": "gogon?",
  "গগন!": "gogon!",
  "জুড়ে।": "juRe.",
  "জুর়ে।": "juRe.",
  "জুড়ে,": "juRe,",
  "জুর়ে,": "juRe,",
  "জুড়ে.": "juRe.",
  "জুর়ে.": "juRe.",
  "জুড়ে?": "juRe?",
  "জুর়ে?": "juRe?",
  "জুড়ে!": "juRe!",
  "জুর়ে!": "juRe!",
  "একটি।": "ekoTi.",
  "একটি,": "ekoTi,",
  "একটি.": "ekoTi.",
  "একটি?": "ekoTi?",
  "একটি!": "ekoTi!",
  "অপরূপ।": "oporUp.",
  "অপরূপ,": "oporUp,",
  "অপরূপ.": "oporUp.",
  "অপরূপ?": "oporUp?",
  "অপরূপ!": "oporUp!",
  "রূপসী।": "rUposI.",
  "রূপসী,": "rUposI,",
  "রূপসী.": "rUposI.",
  "রূপসী?": "rUposI?",
  "রূপসী!": "rUposI!",
  "দেশ।": "desh.",
  "দেশ,": "desh,",
  "দেশ.": "desh.",
  "দেশ?": "desh?",
  "দেশ!": "desh!",
  "সকালবেলা।": "sokalobela.",
  "সকালবেলা,": "sokalobela,",
  "সকালবেলা.": "sokalobela.",
  "সকালবেলা?": "sokalobela?",
  "সকালবেলা!": "sokalobela!",
  "পূর্ব।": "pUrb.",
  "পূর্ব,": "pUrb,",
  "পূর্ব.": "pUrb.",
  "পূর্ব?": "pUrb?",
  "পূর্ব!": "pUrb!",
  "আকাশে।": "akashe.",
  "আকাশে,": "akashe,",
  "আকাশে.": "akashe.",
  "আকাশে?": "akashe?",
  "আকাশে!": "akashe!",
  "সূর্য।": "sUrz.",
  "সূর্য,": "sUrz,",
  "সূর্য.": "sUrz.",
  "সূর্য?": "sUrz?",
  "সূর্য!": "sUrz!",
  "হাসে।": "hase.",
  "হাসে,": "hase,",
  "হাসে.": "hase.",
  "হাসে?": "hase?",
  "হাসে!": "hase!",
  "পড়া।": "poRa.",
  "পর়া।": "poRa.",
  "পড়া,": "poRa,",
  "পর়া,": "poRa,",
  "পড়া.": "poRa.",
  "পর়া.": "poRa.",
  "পড়া?": "poRa?",
  "পর়া?": "poRa?",
  "পড়া!": "poRa!",
  "পর়া!": "poRa!",
  "মানুষের।": "manuSher.",
  "মানুষের,": "manuSher,",
  "মানুষের.": "manuSher.",
  "মানুষের?": "manuSher?",
  "মানুষের!": "manuSher!",
  "মহৎ।": "mohot`.",
  "মহৎ,": "mohot`,",
  "মহৎ.": "mohot`.",
  "মহৎ?": "mohot`?",
  "মহৎ!": "mohot`!",
  "অভ্যাস।": "ovzas.",
  "অভ্যাস,": "ovzas,",
  "অভ্যাস.": "ovzas.",
  "অভ্যাস?": "ovzas?",
  "অভ্যাস!": "ovzas!",
  "শিক্ষিত।": "shikShit.",
  "শিক্ষিত,": "shikShit,",
  "শিক্ষিত.": "shikShit.",
  "শিক্ষিত?": "shikShit?",
  "শিক্ষিত!": "shikShit!",
  "জাতি।": "jati.",
  "জাতি,": "jati,",
  "জাতি.": "jati.",
  "জাতি?": "jati?",
  "জাতি!": "jati!",
  "গড়ার।": "goRar.",
  "গর়ার।": "goRar.",
  "গড়ার,": "goRar,",
  "গর়ার,": "goRar,",
  "গড়ার.": "goRar.",
  "গর়ার.": "goRar.",
  "গড়ার?": "goRar?",
  "গর়ার?": "goRar?",
  "গড়ার!": "goRar!",
  "গর়ার!": "goRar!",
  "একমাত্র।": "ekomatr.",
  "একমাত্র,": "ekomatr,",
  "একমাত্র.": "ekomatr.",
  "একমাত্র?": "ekomatr?",
  "একমাত্র!": "ekomatr!",
  "হাতিয়ার।": "hatiyar.",
  "হাতিয়ার।": "hatiyar.",
  "হাতিয়ার,": "hatiyar,",
  "হাতিয়ার,": "hatiyar,",
  "হাতিয়ার.": "hatiyar.",
  "হাতিয়ার.": "hatiyar.",
  "হাতিয়ার?": "hatiyar?",
  "হাতিয়ার?": "hatiyar?",
  "হাতিয়ার!": "hatiyar!",
  "হাতিয়ার!": "hatiyar!",
  "নৌকা।": "nOUka.",
  "নৌকা,": "nOUka,",
  "নৌকা.": "nOUka.",
  "নৌকা?": "nOUka?",
  "নৌকা!": "nOUka!",
  "বায়।": "bay.",
  "বায়।": "bay.",
  "বায়,": "bay,",
  "বায়,": "bay,",
  "বায়.": "bay.",
  "বায়.": "bay.",
  "বায়?": "bay?",
  "বায়?": "bay?",
  "বায়!": "bay!",
  "বায়!": "bay!",
  "আমার।": "amar.",
  "আমার,": "amar,",
  "আমার.": "amar.",
  "আমার?": "amar?",
  "আমার!": "amar!",
  "আমি।": "ami.",
  "আমি,": "ami,",
  "আমি.": "ami.",
  "আমি?": "ami?",
  "আমি!": "ami!",
  "তোমায়।": "tOmay.",
  "তোমায়।": "tOmay.",
  "তোমায়,": "tOmay,",
  "তোমায়,": "tOmay,",
  "তোমায়.": "tOmay.",
  "তোমায়.": "tOmay.",
  "তোমায়?": "tOmay?",
  "তোমায়?": "tOmay?",
  "তোমায়!": "tOmay!",
  "তোমায়!": "tOmay!",
  "ভালবাসি।": "valobasi.",
  "ভালবাসি,": "valobasi,",
  "ভালবাসি.": "valobasi.",
  "ভালবাসি?": "valobasi?",
  "ভালবাসি!": "valobasi!",
  "কে।": "ke.",
  "কে,": "ke,",
  "কে.": "ke.",
  "কে?": "ke?",
  "কে!": "ke!",
  "হে।": "he.",
  "হে,": "he,",
  "হে.": "he.",
  "হে?": "he?",
  "হে!": "he!",
  "সংসার।": "sngsar.",
  "সংসার,": "sngsar,",
  "সংসার.": "sngsar.",
  "সংসার?": "sngsar?",
  "সংসার!": "sngsar!",
  "সাগরে।": "sagore.",
  "সাগরে,": "sagore,",
  "সাগরে.": "sagore.",
  "সাগরে?": "sagore?",
  "সাগরে!": "sagore!",
  "মেলা।": "mela.",
  "মেলা,": "mela,",
  "মেলা.": "mela.",
  "মেলা?": "mela?",
  "মেলা!": "mela!",
  "কূলে।": "kUle.",
  "কূলে,": "kUle,",
  "কূলে.": "kUle.",
  "কূলে?": "kUle?",
  "কূলে!": "kUle!",
  "একা।": "eka.",
  "একা,": "eka,",
  "একা.": "eka.",
  "একা?": "eka?",
  "একা!": "eka!",
  "বসে।": "bose.",
  "বসে,": "bose,",
  "বসে.": "bose.",
  "বসে?": "bose?",
  "বসে!": "bose!",
  "আছি।": "achi.",
  "আছি,": "achi,",
  "আছি.": "achi.",
  "আছি?": "achi?",
  "আছি!": "achi!",
  "নাহি।": "nahi.",
  "নাহি,": "nahi,",
  "নাহি.": "nahi.",
  "নাহি?": "nahi?",
  "নাহি!": "nahi!",
  "ভরসা।": "vorosa.",
  "ভরসা,": "vorosa,",
  "ভরসা.": "vorosa.",
  "ভরসা?": "vorosa?",
  "ভরসা!": "vorosa!",
  "একুশে।": "ekushe.",
  "একুশে,": "ekushe,",
  "একুশে.": "ekushe.",
  "একুশে?": "ekushe?",
  "একুশে!": "ekushe!",
  "অহংকার।": "ohngkar.",
  "অহংকার,": "ohngkar,",
  "অহংকার.": "ohngkar.",
  "অহংকার?": "ohngkar?",
  "অহংকার!": "ohngkar!",
  "ভাষা।": "vaSha.",
  "ভাষা,": "vaSha,",
  "ভাষা.": "vaSha.",
  "ভাষা?": "vaSha?",
  "ভাষা!": "vaSha!",
  "অমর।": "omor.",
  "অমর,": "omor,",
  "অমর.": "omor.",
  "অমর?": "omor?",
  "অমর!": "omor!",
  "হোক।": "hOk.",
  "হোক,": "hOk,",
  "হোক.": "hOk.",
  "হোক?": "hOk?",
  "হোক!": "hOk!",
  "পাখিরা।": "pakhira.",
  "পাখিরা,": "pakhira,",
  "পাখিরা.": "pakhira.",
  "পাখিরা?": "pakhira?",
  "পাখিরা!": "pakhira!",
  "বনে।": "bone.",
  "বনে,": "bone,",
  "বনে.": "bone.",
  "বনে?": "bone?",
  "বনে!": "bone!",
  "ফুটে।": "phuTe.",
  "ফুটে,": "phuTe,",
  "ফুটে.": "phuTe.",
  "ফুটে?": "phuTe?",
  "ফুটে!": "phuTe!",
  "বাতাসে।": "batase.",
  "বাতাসে,": "batase,",
  "বাতাসে.": "batase.",
  "বাতাসে?": "batase?",
  "বাতাসে!": "batase!",
  "ব্রাহ্মণবাড়িয়া।": "brahmoNobaRiya.",
  "ব্রাহ্মণবাড়িয়া।": "brahmoNobaRiya.",
  "ব্রাহ্মণবাড়িয়া,": "brahmoNobaRiya,",
  "ব্রাহ্মণবাড়িয়া,": "brahmoNobaRiya,",
  "ব্রাহ্মণবাড়িয়া.": "brahmoNobaRiya.",
  "ব্রাহ্মণবাড়িয়া.": "brahmoNobaRiya.",
  "ব্রাহ্মণবাড়িয়া?": "brahmoNobaRiya?",
  "ব্রাহ্মণবাড়িয়া?": "brahmoNobaRiya?",
  "ব্রাহ্মণবাড়িয়া!": "brahmoNobaRiya!",
  "ব্রাহ্মণবাড়িয়া!": "brahmoNobaRiya!",
  "সোনার_বাংলা।": "sOnar_bangla.",
  "সোনার_বাংলা,": "sOnar_bangla,",
  "সোনার_বাংলা.": "sOnar_bangla.",
  "সোনার_বাংলা?": "sOnar_bangla?",
  "সোনার_বাংলা!": "sOnar_bangla!",
  "স্বাধীনতাহীনতায়।": "sbadhInotahInotay.",
  "স্বাধীনতাহীনতায়।": "sbadhInotahInotay.",
  "স্বাধীনতাহীনতায়,": "sbadhInotahInotay,",
  "স্বাধীনতাহীনতায়,": "sbadhInotahInotay,",
  "স্বাধীনতাহীনতায়.": "sbadhInotahInotay.",
  "স্বাধীনতাহীনতায়.": "sbadhInotahInotay.",
  "স্বাধীনতাহীনতায়?": "sbadhInotahInotay?",
  "স্বাধীনতাহীনতায়?": "sbadhInotahInotay?",
  "স্বাধীনতাহীনতায়!": "sbadhInotahInotay!",
  "স্বাধীনতাহীনতায়!": "sbadhInotahInotay!"
};

// Seed based deterministic drawer for unique repeatable levels ensuring variety and avoiding immediate repeats
function getDrawnWordsForPool(pool: string[], count: number, seed: number): string[] {
  const result: string[] = [];
  if (pool.length === 0 || count <= 0) return result;
  
  const poolCopy = [...pool];
  for (let i = 0; i < count; i++) {
    const idx = (seed * 19 + i * 37) % poolCopy.length;
    result.push(poolCopy[idx]);
    // Remove chosen element to support unique selections in this level
    if (poolCopy.length > 1) {
      poolCopy.splice(idx, 1);
    }
  }
  return result;
}

// Generate complete game configurations for levels 1 to 100 with exactly 30 words per game
export function getLevelDetails(level: number) {
  let title = "";
  let categoryName = "";
  let words: string[] = [];
  let wpmTarget = 15; // Target speed to get stars
  let timeLimitSeconds = 120; // 30 words deserves substantial time, especially for beginners

  let easyCount = 0;
  let mediumCount = 0;
  let conjunctsCount = 0;
  let hardCount = 0;

  // Compile unique lists from our collections
  const poolEasy = Array.from(new Set([...VOWELS, ...SIMPLE_WORDS]));
  const phraseWords = [
    "আমাদের", "দেশের", "নাম", "বাংলাদেশ", "বাংলা", "অতি", "প্রিয়", "আমরা", "সর্বদা", "সত্য", "কথা", "বলব",
    "জাতীয়", "ফুল", "শাপলা", "পাখি", "পাকা", "পেঁপে", "সুস্বাদু", "করে", "খায়", "ওঠে", "নীল", "গগন", "জুড়ে",
    "একটি", "দেশ", "সকালবেলা", "পূর্ব", "আকাশে", "সূর্য", "হাসে", "বই", "পড়া", "মহৎ", "অভ্যাস", "শিক্ষা", "জাতি",
    "একমাত্র", "সোনার", "নৌকা", "বায়", "আমার", "আমি", "তোমায়", "ভালবাসি", "কে", "হে", "সংসার", "সাগরে", "মেলা",
    "কূলে", "একা", "বসে", "আছি", "নাহি", "ভরসা", "একুশে", "আমাদের", "অহংকার", "ভাষা", "অমর", "হোক", "পাখিরা",
    "বনে", "ফুটে", "বাতাসে"
  ];
  const poolMedium = Array.from(new Set([...MEDIUM_WORDS, ...phraseWords.filter(w => w.length <= 4)]));
  const poolConjuncts = Array.from(new Set([...CONJUNCTS_WORDS]));
  const poolHard = Array.from(new Set([...HARD_WORDS, ...phraseWords.filter(w => w.length > 4)]));

  // 1. Calculate composition ratios for exactly 30 words with progressive difficulty
  if (level >= 1 && level <= 15) {
    categoryName = "১ম ধাপ: নবীন টাইপিস্ট (Beginner Letters)";
    title = `স্বাক্ষরতা প্রশিক্ষণ - লেভেল ${level}`;
    mediumCount = Math.min(15, Math.floor((level - 1) * 1.1));
    easyCount = 30 - mediumCount;
    wpmTarget = 10 + Math.floor(level / 3);
    timeLimitSeconds = 120;
  } else if (level >= 16 && level <= 45) {
    categoryName = "২য় ধাপ: শব্দ পরিব্রাজক (Word Nomad)";
    title = `আকার-ইকার যুক্ত শব্দ - লেভেল ${level}`;
    easyCount = Math.max(0, 15 - Math.floor((level - 15) * 0.5));
    conjunctsCount = Math.min(10, Math.floor((level - 15) * 0.35));
    mediumCount = 30 - easyCount - conjunctsCount;
    wpmTarget = 15 + Math.floor((level - 12) / 2);
    timeLimitSeconds = 105;
  } else if (level >= 46 && level <= 60) {
    categoryName = "৩য় ধাপ: শব্দ যোদ্ধা (Word Warrior)";
    title = `মিশ্র কার-চিহ্ন টাইপিং - লেভেল ${level}`;
    easyCount = Math.max(0, 10 - Math.floor((level - 45) * 0.5));
    conjunctsCount = Math.min(15, 6 + Math.floor((level - 45) * 0.5));
    mediumCount = 30 - easyCount - conjunctsCount;
    wpmTarget = 22 + Math.floor((level - 28) / 3);
    timeLimitSeconds = 95;
  } else if (level >= 61 && level <= 75) {
    categoryName = "৪র্থ ধাপ: যুক্তাক্ষর সাধক (Conjunct Master)";
    title = `জটিল যুক্তাক্ষরের দুনিয়া - লেভেল ${level}`;
    hardCount = Math.min(10, Math.floor((level - 60) * 0.5));
    conjunctsCount = Math.min(18, 10 + Math.floor((level - 60) * 0.5));
    mediumCount = 30 - conjunctsCount - hardCount;
    wpmTarget = 26 + Math.floor((level - 45) / 3);
    timeLimitSeconds = 85;
  } else if (level >= 76 && level <= 90) {
    categoryName = "৫ম ধাপ: বাক্য নির্মাতা (Sentence Builder)";
    title = `সহজ বাক্য কাঠামো - লেভেল ${level}`;
    hardCount = Math.min(15, 10 + Math.floor((level - 75) * 0.4));
    conjunctsCount = Math.min(15, 10 + Math.floor((level - 75) * 0.3));
    mediumCount = 30 - conjunctsCount - hardCount;
    wpmTarget = 30 + Math.floor((level - 60) / 3);
    timeLimitSeconds = 75;
  } else {
    // 91 to 100
    categoryName = "৬ষ্ঠ ধাপ: কঠিন শব্দজট (Elite Typist)";
    title = `অভিধানের কঠিন শব্দসমূহ - লেভেল ${level}`;
    mediumCount = Math.max(0, 5 - Math.floor((level - 90) * 0.5));
    hardCount = Math.min(22, 12 + Math.floor((level - 90) * 1.0));
    conjunctsCount = 30 - mediumCount - hardCount;
    wpmTarget = 34 + Math.floor((level - 75) / 2);
    timeLimitSeconds = 65;
  }

  // 2. Deterministically draw precise counts from respective categories
  const drawnEasy = getDrawnWordsForPool(poolEasy, easyCount, level);
  const drawnMedium = getDrawnWordsForPool(poolMedium, mediumCount, level + 1);
  const drawnConjuncts = getDrawnWordsForPool(poolConjuncts, conjunctsCount, level + 2);
  const drawnHard = getDrawnWordsForPool(poolHard, hardCount, level + 3);

  // Combine and shuffle deterministically
  const rawCombined = [...drawnEasy, ...drawnMedium, ...drawnConjuncts, ...drawnHard];
  const combined: string[] = [];
  const combinedSource = [...rawCombined];
  for (let i = 0; i < rawCombined.length; i++) {
    const selectIdx = (level * 7 + i * 13) % combinedSource.length;
    combined.push(combinedSource[selectIdx]);
    combinedSource.splice(selectIdx, 1);
  }

  words = combined.slice(0, 30);

  return {
    title,
    categoryName,
    words: words.map(w => normalizeBengali(w)),
    wpmTarget,
    timeLimitSeconds
  };
}

export const TypingGameModule: React.FC<TypingGameModuleProps> = ({
  typingMode,
  sfxEnabled,
  theme,
  showPhoneticHints
}) => {
  // Game layout state specifically for the game panel to toggle between Avro and Bijoy
  const [gameLayout, setGameLayout] = useState<"avro" | "bijoy">("avro");

  // Game states
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [completedLevels, setCompletedLevels] = useState<{ [key: number]: { stars: number; highWpm: number; score: number } }>({});
  
  // Active gameplay states
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [wordList, setWordList] = useState<string[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [typedInput, setTypedInput] = useState<string>("");
  const [hp, setHp] = useState<number>(100);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [totalKeypresses, setTotalKeypresses] = useState<number>(0);
  const [correctKeypresses, setCorrectKeypresses] = useState<number>(0);
  
  // Game Status screens
  const [gameResult, setGameResult] = useState<"none" | "win" | "fail">("none");
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // References
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputElRef = useRef<HTMLInputElement>(null);

  // Sync game layout with typingMode prop when it changes
  useEffect(() => {
    setGameLayout(typingMode);
  }, [typingMode]);

  // Load level progress from localStorage on mount or when gameLayout changes
  useEffect(() => {
    try {
      const key = gameLayout === "avro" ? "avro_typing_game_completed_levels" : "bijoy_typing_game_completed_levels";
      const saved = localStorage.getItem(key);
      if (saved) {
        setCompletedLevels(JSON.parse(saved));
      } else {
        setCompletedLevels({});
      }
    } catch (e) {
      console.error(e);
    }
  }, [gameLayout]);

  // Save level progress to localStorage
  const saveProgress = (newProgress: typeof completedLevels) => {
    setCompletedLevels(newProgress);
    try {
      const key = gameLayout === "avro" ? "avro_typing_game_completed_levels" : "bijoy_typing_game_completed_levels";
      localStorage.setItem(key, JSON.stringify(newProgress));
    } catch (e) {
      console.error(e);
    }
  };

  // Determine phonetic or raw keyboard guide
  const getHelperHint = (banglaWord: string) => {
    if (gameLayout === "bijoy") {
      return getBijoyKeystrokes(banglaWord);
    } else {
      // Look up transliteration mapping
      const wordClean = normalizeBengali(banglaWord.replace(/[.,!?।]/g, ""));
      if (AVRO_MAP[wordClean]) {
        return AVRO_MAP[wordClean];
      }
      // If we don't have it, write a perfect fallback representation
      return getPerfectAvroPhonetic(wordClean);
    }
  };

  // Get matching status of current word
  const getWordMatchStatuses = () => {
    const target = wordList[currentWordIdx] || "";
    
    // In Bijoy mode, the typed input *is* the Bijoy keys which we map to Bangla words to compare
    let userBangla = "";
    if (gameLayout === "avro") {
      userBangla = convertToAvro(typedInput);
    } else {
      userBangla = convertToBijoy(typedInput);
    }

    const statuses: { char: string; status: "correct" | "incorrect" | "pending" }[] = [];
    const targetChars = target.split("");
    const userChars = userBangla.split("");

    const targetKeystrokes = gameLayout === "avro" ? getHelperHint(target) : getBijoyKeystrokes(target);
    const isPrefixCorrect = targetKeystrokes.startsWith(typedInput);

    for (let i = 0; i < targetChars.length; i++) {
      if (i < userChars.length) {
        if (targetChars[i] === userChars[i]) {
          statuses.push({ char: targetChars[i], status: "correct" });
        } else {
          // If the typed physical keystrokes are a correct partial prefix of the target word,
          // don't mark as incorrect (red) yet. Keep it pending!
          if (isPrefixCorrect) {
            statuses.push({ char: targetChars[i], status: "pending" });
          } else {
            statuses.push({ char: targetChars[i], status: "incorrect" });
          }
        }
      } else {
        statuses.push({ char: targetChars[i], status: "pending" });
      }
    }

    return statuses;
  };

  // Launch the game play for a specific level code
  const startLevel = (lvlNum: number) => {
    setActiveLevel(lvlNum);
    const details = getLevelDetails(lvlNum);
    setWordList(details.words);
    setCurrentWordIdx(0);
    setTypedInput("");
    setHp(100);
    setTimeLeft(details.timeLimitSeconds);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTotalKeypresses(0);
    setCorrectKeypresses(0);
    setSecondsElapsed(0);
    setGameResult("none");
    setGameActive(true);

    if (sfxEnabled) playKeyClick("success");

    // Start timer loops
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (playTimerIntervalRef.current) clearInterval(playTimerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          triggerLevelFailed("time");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    playTimerIntervalRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    // Dynamic autofocus
    setTimeout(() => {
      inputElRef.current?.focus();
    }, 100);
  };

  // Exit current play and go back to grid
  const exitToGrid = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (playTimerIntervalRef.current) clearInterval(playTimerIntervalRef.current);
    setGameActive(false);
    setActiveLevel(null);
    setGameResult("none");
    if (sfxEnabled) playKeyClick("space");
  };

  // Check user keystroke typing logic
  const handleKeystrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gameActive || gameResult !== "none") return;

    const val = e.target.value;
    const lastChar = val.charAt(val.length - 1);
    
    // Play keystroke click
    if (sfxEnabled) playKeyClick(lastChar === " " ? "space" : "normal");

    setTotalKeypresses((prev) => prev + 1);

    const activeWord = wordList[currentWordIdx] || "";

    // Standard split for trailing space check to trigger next word
    if (val.endsWith(" ") || val.endsWith(" ")) {
      const typedWordRaw = val.trim();
      let isCorrect = false;

      if (gameLayout === "avro") {
        isCorrect = normalizeBengali(convertToAvro(typedWordRaw)) === activeWord;
      } else {
        // Bijoy keystrokes check
        const targetKeystrokesClean = getBijoyKeystrokes(activeWord).trim();
        isCorrect = typedWordRaw === targetKeystrokesClean;
      }

      if (isCorrect) {
        // Success word completion
        const wordPoints = Math.round(activeWord.length * 10 * (1 + combo * 0.1));
        setScore((prev) => prev + wordPoints);
        setCombo((prev) => prev + 1);
        setMaxCombo((prev) => Math.max(prev, combo + 1));
        setCorrectKeypresses((prev) => prev + val.length);

        if (sfxEnabled) playKeyClick("success");

        if (currentWordIdx + 1 >= wordList.length) {
          triggerLevelCompleted();
        } else {
          setCurrentWordIdx((prev) => prev + 1);
          setTypedInput("");
        }
      } else {
        // Misspelled word
        setHp((prev) => {
          const nextHp = prev - 15;
          if (nextHp <= 0) {
            triggerLevelFailed("shield");
            return 0;
          }
          return nextHp;
        });
        setCombo(0);
        if (sfxEnabled) playKeyClick("backspace");
        
        // Advance anyway to keep arcade action fast-paced
        if (currentWordIdx + 1 >= wordList.length) {
          triggerLevelFailed("shield");
        } else {
          setCurrentWordIdx((prev) => prev + 1);
          setTypedInput("");
        }
      }
      return;
    }

    // Interactive incremental checking for letter-by-letter correct input
    if (gameLayout === "avro") {
      const expectedAvroKeys = getHelperHint(activeWord || "");
      const isLetterMatch = expectedAvroKeys.startsWith(val) || convertToAvro(val) === convertToAvro(activeWord).substring(0, convertToAvro(val).length);
      if (isLetterMatch) {
        setCorrectKeypresses((prev) => prev + 1);
      } else {
        // Slight deduction on Shield HP for rapid wrong keystrokes
        setHp((prev) => {
          const nextHp = Math.max(0, prev - 2);
          if (nextHp <= 0) {
            triggerLevelFailed("shield");
          }
          return nextHp;
        });
        setCombo(0);
      }
    } else {
      // Bijoy key checks
      const targetBijoyKeys = getBijoyKeystrokes(activeWord);
      const isBijoyMatch = targetBijoyKeys.startsWith(val);
      if (isBijoyMatch) {
         setCorrectKeypresses((prev) => prev + 1);
      } else {
         setHp((prev) => {
          const nextHp = Math.max(0, prev - 2);
          if (nextHp <= 0) {
            triggerLevelFailed("shield");
          }
          return nextHp;
         });
         setCombo(0);
      }
    }

    setTypedInput(val);
  };

  // Completed win handler
  const triggerLevelCompleted = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (playTimerIntervalRef.current) clearInterval(playTimerIntervalRef.current);
    
    setGameResult("win");
    if (sfxEnabled) playKeyClick("success");

    // Calculate accuracy and WPM
    const levelsDetails = getLevelDetails(activeLevel || 1);
    const totalCharsTyped = wordList.slice(0, currentWordIdx + 1).join(" ").length;
    const timeMins = (secondsElapsed > 0 ? secondsElapsed : 1) / 60;
    const calculatedWpm = Math.round((totalCharsTyped / 5) / timeMins);
    
    let accuracyFinal = 100;
    if (totalKeypresses > 0) {
      accuracyFinal = Math.min(100, Math.round((correctKeypresses / totalKeypresses) * 100));
    }

    // Determine Stars
    let starsWon = 1;
    if (calculatedWpm >= levelsDetails.wpmTarget && accuracyFinal >= 94) {
      starsWon = 3;
    } else if (calculatedWpm >= Math.max(10, levelsDetails.wpmTarget - 8) && accuracyFinal >= 88) {
      starsWon = 2;
    } else if (accuracyFinal < 75) {
      starsWon = 1; // absolute pass minimal
    }

    const nextProgress = { ...completedLevels };
    const currentRecord = nextProgress[activeLevel || 1];
    
    if (!currentRecord || starsWon > currentRecord.stars || calculatedWpm > currentRecord.highWpm) {
      nextProgress[activeLevel || 1] = {
        stars: Math.max(starsWon, currentRecord?.stars || 0),
        highWpm: Math.max(calculatedWpm, currentRecord?.highWpm || 0),
        score: Math.max(score, currentRecord?.score || 0)
      };
      saveProgress(nextProgress);
    }
  };

  // Failed loss handler
  const triggerLevelFailed = (reason: "time" | "shield") => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (playTimerIntervalRef.current) clearInterval(playTimerIntervalRef.current);
    
    setGameResult("fail");
    if (sfxEnabled) playKeyClick("backspace");
  };

  // Clean timeouts on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (playTimerIntervalRef.current) clearInterval(playTimerIntervalRef.current);
    };
  }, []);

  // Compute stats calculations
  const calculateAggregateStats = () => {
    let totalStars = 0;
    let unlockedCount = 1;
    let highWpmRecord = 0;
    let totalScore = 0;

    Object.keys(completedLevels).forEach((lvlStr) => {
      const lvl = parseInt(lvlStr, 10);
      const rec = completedLevels[lvl];
      totalStars += rec.stars;
      totalScore += rec.score;
      if (rec.highWpm > highWpmRecord) {
        highWpmRecord = rec.highWpm;
      }
    });

    const completedArray = Object.keys(completedLevels).map(Number);
    if (completedArray.length > 0) {
      const maxCompleted = Math.max(...completedArray);
      unlockedCount = Math.min(100, maxCompleted + 1);
    }

    return {
      totalStars,
      unlockedCount,
      highWpmRecord,
      totalScore
    };
  };

  const aggregateStats = calculateAggregateStats();

  // Draw details for stage divisions
  const STAGES_CONFIG = [
    { id: 1, title: "১ম ধাপ: নবীন টাইপিস্ট", subtitle: "লেভেল ১ - ১২: স্বরবর্ণ ও মৌলিক শব্দাবলী", levels: [1, 12], bg: "from-blue-600/10 to-indigo-600/5 border-blue-500/20 text-blue-400" },
    { id: 2, title: "২য় ধাপ: শব্দ পরিব্রাজক", subtitle: "লেভেল ১৩ - ২৮: আ-কার ও ই-কার যুক্ত শব্দাবলী", levels: [13, 28], bg: "from-emerald-600/10 to-teal-600/5 border-emerald-500/20 text-emerald-400" },
    { id: 3, title: "৩য় ধাপ: শব্দ যোদ্ধা", subtitle: "লেভেল ২৯ - ৪৫: কীন-বোর্ড কার-চিহ্ন মিক্সচার", levels: [29, 45], bg: "from-amber-600/10 to-orange-600/5 border-amber-500/20 text-amber-400" },
    { id: 4, title: "৪র্থ ধাপ: যুক্তাক্ষর সাধক", subtitle: "লেভেল ৪৬ - ৬০: কঠিন বাংলা যুক্তবর্ণ টাইপিং", levels: [46, 60], bg: "from-cyan-600/10 to-sky-600/5 border-cyan-500/20 text-cyan-400" },
    { id: 5, title: "৫ম ধাপ: বাক্য নির্মাতা", subtitle: "লেভেল ৬১ - ৭৫: বাস্তব ছোট বাক্য টাইপিং রেস", levels: [61, 75], bg: "from-violet-600/10 to-fuchsia-600/5 border-violet-500/20 text-violet-400" },
    { id: 6, title: "৬ষ্ঠ ধাপ: কঠিন শব্দজট", subtitle: "লেভেল ৭৬ - ৯০: জটিল ডিকশনারি ও সংযুক্ত বর্ণসমষ্টি", levels: [76, 90], bg: "from-rose-600/10 to-pink-600/5 border-rose-500/20 text-rose-400" },
    { id: 7, title: "৭ম ধাপ: টাইপিং মহাবীর", subtitle: "লেভেল ৯১ - ১০০: মহাকাব্যিক সাহিত্য অনুচ্ছেদ ও সাহিত্যিক বাক্য", levels: [91, 100], bg: "from-purple-600/10 to-violet-900/5 border-purple-500/20 text-purple-400" }
  ];

  return (
    <div className="col-span-1 lg:col-span-3 min-h-[500px] flex flex-col gap-6" id="game-arcade-panel">
      
      {/* Dynamic Selector Page or Gameplay Scene */}
      {!gameActive ? (
        <div className="w-full flex flex-col gap-6">
          
          {/* Dashboard Header Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/10 text-amber-500 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                    <Zap size={12} className="animate-pulse text-amber-400" />
                    বাংলা টাইপিং অ্যাডভেঞ্চার
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white mt-1.5 leading-tight">
                  ১-১০০ লেভেল টাইপিং যুদ্ধ
                </h2>
                <p className="text-xs text-slate-400 mt-2 font-medium max-w-xl leading-relaxed">
                  ধাপে ধাপে অগ্রসর হয়ে আপনার টাইপিং গতির চ্যালেঞ্জ মোকাবেলা করুন! প্রতিটি লেভেল সফলভাবে টাইপ করে ৩-স্টার অর্জন করুন এবং পরবর্তী মিশন আনলক করুন।
                </p>

                {/* Keyboard layout switcher controls */}
                <div className="flex items-center gap-3 mt-4" id="game-layout-selector-wrapper">
                  <span className="text-xs font-bold text-slate-400">গেম কীবোর্ড লেআউট:</span>
                  <div className="flex bg-slate-950 border border-slate-800 p-0.5 rounded-lg">
                    <button
                      id="toggle-game-layout-avro"
                      onClick={() => {
                        setGameLayout("avro");
                        if (sfxEnabled) playKeyClick("success");
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        gameLayout === "avro"
                          ? "bg-indigo-600 text-white shadow font-black"
                          : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                      }`}
                    >
                      অভ্র (Avro Keyboard)
                    </button>
                    <button
                      id="toggle-game-layout-bijoy"
                      onClick={() => {
                        setGameLayout("bijoy");
                        if (sfxEnabled) playKeyClick("success");
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        gameLayout === "bijoy"
                          ? "bg-indigo-600 text-white shadow font-black"
                          : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                      }`}
                    >
                      বিজয় (Bijoy Keyboard)
                    </button>
                  </div>
                </div>
              </div>

              {/* Aggregated achievements displays */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
                <div className="text-center p-1 px-3">
                  <div className="text-slate-550 text-[10px] font-bold uppercase tracking-wider text-slate-400">মোট স্কোর</div>
                  <div className="text-xl font-black text-amber-505 font-mono mt-1 text-amber-400">
                    {aggregateStats.totalScore.toLocaleString()}
                  </div>
                </div>
                <div className="text-center p-1 px-3 border-l border-slate-800/80">
                  <div className="text-slate-550 text-[10px] font-bold uppercase tracking-wider text-slate-400">সর্বমোট স্টার</div>
                  <div className="text-xl font-black text-emerald-405 font-mono mt-1 text-emerald-400 flex items-center justify-center gap-1">
                    <Star size={16} fill="currentColor" className="text-amber-400" />
                    {aggregateStats.totalStars}
                  </div>
                </div>
                <div className="text-center p-1 px-3 border-l border-slate-800/80">
                  <div className="text-slate-550 text-[10px] font-bold uppercase tracking-wider text-slate-400">সর্বোচ্চ গতি</div>
                  <div className="text-xl font-black text-sky-405 font-mono mt-1 text-sky-450 text-sky-400">
                    {aggregateStats.highWpmRecord} <span className="text-[10px] uppercase font-bold text-slate-500">WPM</span>
                  </div>
                </div>
                <div className="text-center p-1 px-3 border-l border-slate-800/80">
                  <div className="text-slate-550 text-[10px] font-bold uppercase tracking-wider text-slate-400">আনলকড মিশন</div>
                  <div className="text-xl font-black text-violet-405 font-mono mt-1 text-violet-400">
                    {aggregateStats.unlockedCount} / 100
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map of All Seven Stages */}
          <div className="flex flex-col gap-8">
            {STAGES_CONFIG.map((stage) => {
              const startLvl = stage.levels[0];
              const endLvl = stage.levels[1];
              const levelArray: number[] = [];
              for (let l = startLvl; l <= endLvl; l++) {
                levelArray.push(l);
              }

              return (
                <div key={stage.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-md">
                  
                  {/* Stage title details */}
                  <div className={`p-4 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-r ${stage.bg} flex items-center justify-between`}>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black font-sans leading-none">
                        {stage.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium font-sans mt-1.5">
                        {stage.subtitle}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded bg-slate-950/20 dark:text-slate-200 border border-slate-400/20">
                      {levelArray.filter(l => completedLevels[l]).length} / {levelArray.length} সম্পন্ন
                    </span>
                  </div>

                  {/* Level Item Buttons Grid */}
                  <div className="p-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {levelArray.map((lvl) => {
                      const isUnlocked = lvl <= aggregateStats.unlockedCount;
                      const record = completedLevels[lvl];
                      const starCount = record ? record.stars : 0;

                      return (
                        <button
                          key={lvl}
                          disabled={!isUnlocked}
                          onClick={() => startLevel(lvl)}
                          className={`group aspect-square rounded-xl p-3 flex flex-col items-center justify-between border transition-all cursor-pointer relative overflow-hidden ${
                            isUnlocked
                              ? record
                                ? "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 hover:border-amber-500 dark:hover:bg-slate-800/50 hover:scale-105"
                                : "bg-slate-50 dark:bg-slate-950 border-slate-220 dark:border-slate-800/60 hover:border-amber-500 hover:bg-amber-500/5 hover:-translate-y-1"
                              : "bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/30 opacity-60 cursor-not-allowed"
                          }`}
                        >
                          {/* Stars display mini */}
                          <div className="flex gap-0.5 justify-center h-4 items-center">
                            {isUnlocked && record ? (
                              Array.from({ length: 3 }).map((_, sIdx) => (
                                <Star
                                  key={sIdx}
                                  size={10}
                                  fill={sIdx < starCount ? "currentColor" : "none"}
                                  className={sIdx < starCount ? "text-amber-500" : "text-slate-300 dark:text-slate-700"}
                                />
                              ))
                            ) : !isUnlocked ? (
                              <Lock size={10} className="text-slate-450 dark:text-slate-600" />
                            ) : (
                              <span className="text-[9px] font-sans font-bold text-slate-400 hover:text-amber-500">খেলুন</span>
                            )}
                          </div>

                          {/* Level Number large */}
                          <span className={`text-md sm:text-lg font-black font-mono leading-none tracking-tight ${
                            isUnlocked 
                              ? "text-slate-900 dark:text-slate-100 group-hover:text-amber-500" 
                              : "text-slate-400 dark:text-slate-700"
                          }`}>
                            {lvl}
                          </span>

                          {/* Level high score metric */}
                          <span className="text-[9px] font-mono opacity-80 text-slate-500 dark:text-slate-400 font-bold leading-none">
                            {record ? `${record.highWpm} W` : isUnlocked ? "NEW" : "LOCKED"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Gameplay Action Screen Arena */
        <div className="w-full bg-slate-950/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative">
          
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse"></div>

          {/* Gameplay Header bar */}
          <div className="px-5 py-4.5 border-b border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div>
              <span className="text-[10px] font-serif font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/10">
                {getLevelDetails(activeLevel || 1).categoryName}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1 leading-none font-sans">
                {getLevelDetails(activeLevel || 1).title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Reset retry buttons */}
              <button
                id="gameplay-restart-btn"
                onClick={() => startLevel(activeLevel || 1)}
                className="p-1 px-3 sm:px-3 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <RotateCcw size={12} />
                <span>রি-স্টার্ট</span>
              </button>

              <button
                id="gameplay-exit-btn"
                onClick={exitToGrid}
                className="p-1 px-3 sm:px-3 text-xs font-black rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <List size={12} />
                <span>লেভেল তালিকা</span>
              </button>
            </div>
          </div>

          {gameResult === "none" ? (
            /* Active Typing Battle Screen */
            <div className="p-6 sm:p-8 flex flex-col gap-6 relative z-10" id="gameplay-active-battle">
              
              {/* Gameplay Dashboard Panel (HP, WPM, progress, score) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/80 border border-slate-850/80 p-4 rounded-xl">
                
                {/* Shield HP Indicator */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                    <ShieldAlert size={18} className={hp <= 30 ? "animate-bounce" : ""} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold font-sans">শিল্ড প্রোটেকশন</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-black font-mono text-rose-400">{hp}%</span>
                      <div className="flex-1 h-1.5 bg-slate-850 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500 transition-all duration-300"
                          style={{ width: `${hp}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score panel */}
                <div className="flex items-center gap-2.5 pl-0 md:pl-4 border-l-0 md:border-l border-slate-800">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-405 uppercase tracking-wider font-extrabold font-sans">যুদ্ধ স্কোর</span>
                    <div className="text-md sm:text-lg font-black font-mono text-white leading-none mt-1">
                      {score}
                    </div>
                  </div>
                </div>

                {/* Combos display */}
                <div className="flex items-center gap-2.5 pl-0 md:pl-4 border-l-0 md:border-l border-slate-800">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
                    combo > 0 
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/40 animate-scale-up scale-105" 
                      : "bg-slate-800/40 text-slate-500 border-slate-800"
                  }`}>
                    <Zap size={18} fill={combo > 0 ? "currentColor" : "none"} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-405 uppercase tracking-wider font-extrabold font-sans">কম্বো স্ট্রাইক</span>
                    <div className="text-md sm:text-lg font-black font-mono text-amber-400 leading-none mt-1">
                      x{combo} <span className="text-[9px] text-slate-500 font-bold font-sans">ম্যাক্স: x{maxCombo}</span>
                    </div>
                  </div>
                </div>

                {/* Timer Countdown limits */}
                <div className="flex items-center gap-2.5 pl-0 md:pl-4 border-l-0 md:border-l border-slate-800">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
                    timeLeft <= 10 
                      ? "bg-rose-500/20 text-rose-505 border-rose-500/40 animate-pulse" 
                      : "bg-slate-800/40 text-slate-400 border-slate-850"
                  }`}>
                    <Clock size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-slate-405 uppercase tracking-wider font-extrabold font-sans">সময়সীমা</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-md sm:text-lg font-black font-mono ${timeLeft <= 10 ? "text-rose-500" : "text-white"}`}>
                        {timeLeft} <span className="text-[10px] uppercase font-bold text-slate-500">S</span>
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Progress counter line */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold font-sans">
                <span>শব্দ সমাপ্তি প্রগতি</span>
                <span>{currentWordIdx + 1} / {wordList.length} শব্দ</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-350"
                  style={{ width: `${((currentWordIdx + 1) / wordList.length) * 100}%` }}
                ></div>
              </div>

              {/* Floating Arcade Platform with Active Word */}
              <div className="my-8 py-10 rounded-2xl bg-slate-950/50 border border-slate-850 flex flex-col items-center justify-center text-center relative shadow-inner overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 to-transparent pointer-events-none"></div>

                {/* Active index status glow */}
                <span className="text-[10px] font-mono tracking-widest text-[#6366f1] font-black uppercase mb-3 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/15">
                  শব্দ যুদ্ধ # {currentWordIdx + 1}
                </span>

                {/* Main Glowing Target Bengali Word */}
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white py-2 select-none tracking-wide flex items-center justify-center gap-1.5 leading-tight select-none">
                  {getWordMatchStatuses().map((charOb, sIdx) => (
                    <span
                      key={sIdx}
                      className={`transition-all duration-150 ${
                        charOb.status === "correct"
                          ? "text-emerald-400 [text-shadow:0_0_15px_rgba(16,185,129,0.4)]"
                          : charOb.status === "incorrect"
                            ? "text-rose-500 [text-shadow:0_0_15px_rgba(239,68,68,0.5)] scale-110"
                            : "text-slate-400"
                      }`}
                    >
                      {charOb.char}
                    </span>
                  ))}
                </div>

                {/* Expected guides equivalent badge */}
                {showPhoneticHints && (
                  <div className="mt-4 flex flex-col items-center gap-1">
                    <span className="text-[11px] uppercase font-serif font-black tracking-widest text-slate-400">
                      {gameLayout === "avro" ? "Phonetic Keys to Press:" : "Bijoy Keys to Press:"}
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm sm:text-base md:text-lg font-mono font-black text-amber-400 tracking-widest bg-amber-500/15 border border-amber-500/25 px-4.5 py-1.5 rounded-xl shadow-md">
                        {getHelperHint(wordList[currentWordIdx] || "")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Game input field invisible or visible */}
              <div className="w-full flex flex-col gap-4 relative">
                
                {/* Glowing Input Wrapper */}
                <div className="relative">
                  <input
                    ref={inputElRef}
                    type="text"
                    value={typedInput}
                    onChange={handleKeystrokeChange}
                    placeholder="ইংরেজি কীবোর্ড কি চাপুন..."
                    className="w-full px-5 py-4 text-center text-lg sm:text-xl font-bold bg-slate-900/90 border border-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl text-white shadow-2xl placeholder-slate-600 disabled:opacity-50"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                  />
                  
                  {/* Absolute helper hint to guide them back if unfocused */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase hidden sm:inline">সক্রিয়</span>
                  </div>
                </div>

                {/* Mini instructions instructions helper */}
                <div className="text-center text-[11px] text-slate-500 font-medium leading-relaxed font-sans">
                  পরবর্তী শব্দ লোড করতে কীবোর্ডের <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold mx-0.5 text-slate-300">Spacebar</kbd> বাটন চাপুন।
                </div>
              </div>

              {/* Embed helper keyboard in gameplay screen */}
              <div className="mt-4 pointer-events-none opacity-80 scale-95 origin-top">
                <AvroKeyboard activeKey={null} shiftPressed={false} layout={gameLayout} />
              </div>

            </div>
          ) : gameResult === "win" ? (
            /* Level Completed WIN SCREEN */
            <div className="p-8 flex flex-col items-center text-center gap-6 relative z-10 animate-fade-in" id="gameplay-win-page">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
                <Award size={40} className="animate-bounce" />
              </div>

              <div>
                <h4 className="text-[11px] uppercase tracking-widest font-serif font-black text-emerald-400">মিশন সফল হয়েছে!</h4>
                <h2 className="text-2xl sm:text-3.5xl font-black tracking-tight text-white mt-1 leading-tight font-sans">
                  লেভেল {activeLevel} জয়ী!
                </h2>
                <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
                  অভিনন্দন, আপনি নিখুঁতভাবে টাইপিং গতির চ্যালেঞ্জ মোকাবেলা করেছেন এবং নতুন দিগন্ত উন্মুক্ত করেছেন!
                </p>
              </div>

              {/* Dynamic Golden Award Stars */}
              <div className="flex gap-2 justify-center my-1 animate-scale-up">
                {Array.from({ length: 3 }).map((_, sIdx) => {
                  const timeSpentMins = (secondsElapsed > 0 ? secondsElapsed : 1) / 60;
                  const currentCharsTyped = wordList.join(" ").length;
                  const calculatedWpm = Math.round((currentCharsTyped / 5) / timeSpentMins);
                  
                  let accuracyPercent = 100;
                  if (totalKeypresses > 0) {
                    accuracyPercent = Math.min(100, Math.round((correctKeypresses / totalKeypresses) * 100));
                  }

                  const activeLevelDetails = getLevelDetails(activeLevel || 1);
                  let calculatedStars = 1;
                  if (calculatedWpm >= activeLevelDetails.wpmTarget && accuracyPercent >= 94) {
                    calculatedStars = 3;
                  } else if (calculatedWpm >= Math.max(10, activeLevelDetails.wpmTarget - 8) && accuracyPercent >= 88) {
                    calculatedStars = 2;
                  }

                  const won = sIdx < calculatedStars;
                  return (
                    <div key={sIdx} className="relative">
                      <Star
                        size={36}
                        fill={won ? "currentColor" : "none"}
                        className={`transition-transform duration-500 hover:scale-115 ${
                          won ? "text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-110" : "text-slate-800"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Stats Panel summary */}
              <div className="grid grid-cols-3 gap-6 bg-slate-900 border border-slate-850 p-4.5 rounded-xl w-full max-w-md my-1">
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold font-sans">টাইপিং স্পিড</div>
                  <div className="text-xl font-mono text-white font-black mt-1">
                    {Math.round((wordList.join(" ").length / 5) / ((secondsElapsed > 0 ? secondsElapsed : 1) / 60))} <span className="text-[10px] text-slate-500 font-bold uppercase font-sans">WPM</span>
                  </div>
                </div>
                <div className="text-center border-l border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold font-sans">সঠিকতা</div>
                  <div className="text-xl font-mono text-emerald-400 font-black mt-1">
                    {totalKeypresses > 0 ? Math.min(100, Math.round((correctKeypresses / totalKeypresses) * 100)) : 100}%
                  </div>
                </div>
                <div className="text-center border-l border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold font-sans">চূড়ান্ত স্কোর</div>
                  <div className="text-xl font-mono text-amber-400 font-black mt-1">
                    {score}
                  </div>
                </div>
              </div>

              {/* Completed action layouts buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-2">
                {activeLevel && activeLevel < 100 ? (
                  <button
                    id="win-next-level-btn"
                    onClick={() => startLevel(activeLevel + 1)}
                    className="flex-1 py-3 px-5 text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:transform hover:translate-y-[-2px] active:translate-y-0 transition-all rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play size={16} fill="currentColor" />
                    <span>পরবর্তী লেভেল {activeLevel + 1} খেলুন</span>
                  </button>
                ) : (
                  <div className="flex-1 py-3 text-sm font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    শততম মিশন সম্পন্ন! আপনি টাইপিং ঈশ্বর!
                  </div>
                )}
                
                <button
                  id="win-retry-btn"
                  onClick={() => startLevel(activeLevel || 1)}
                  className="py-3 px-5 text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  <span>আবার খেলুন</span>
                </button>
              </div>

              <button
                id="win-back-grid-btn"
                onClick={exitToGrid}
                className="mt-2 text-xs font-black text-[#6366f1] hover:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <List size={12} />
                <span>লেভেল নির্বাচন তালিকায় ফিরে যান</span>
              </button>
            </div>
          ) : (
            /* Level Failed FAIL SCREEN */
            <div className="p-8 flex flex-col items-center text-center gap-6 relative z-10 animate-fade-in" id="gameplay-fail-page">
              <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-xl shadow-rose-500/10">
                <ShieldAlert size={40} className="animate-pulse" />
              </div>

              <div>
                <h4 className="text-[11px] uppercase tracking-widest font-serif font-black text-rose-500">মিশন ব্যর্থ হয়েছে!</h4>
                <h2 className="text-2xl sm:text-3.5xl font-black tracking-tight text-white mt-1 leading-tight font-sans">
                  লেভেল {activeLevel} সম্পন্ন করা যায়নি!
                </h2>
                <p className="text-xs text-slate-450 max-w-sm mt-2 leading-relaxed">
                  শিল্ড ড্যামেজ প্রতিরোধ করুন অথবা সময় ফুরিয়ে যাওয়ার আগে সবগুলো শব্দ টাইপ করুন! মনোবল হারাবেন না, আবার চেষ্টা করুন।
                </p>
              </div>

              {/* Action layout buttons fails */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-4">
                <button
                  id="fail-retry-btn"
                  onClick={() => startLevel(activeLevel || 1)}
                  className="flex-1 py-3.5 px-5 text-sm font-black text-slate-950 bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:transform hover:translate-y-[-2px] active:translate-y-0 shadow-lg shadow-rose-500/20 transition-all rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={16} />
                  <span>আবার চেষ্টা করুন</span>
                </button>
                
                <button
                  id="fail-back-grid-btn"
                  onClick={exitToGrid}
                  className="py-3.5 px-5 text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <List size={14} />
                  <span>লেভেল নির্বাচন তালিকা</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
