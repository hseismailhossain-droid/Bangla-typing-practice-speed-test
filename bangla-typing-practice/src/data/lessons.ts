/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson } from "../types";

export const BUILTIN_LESSONS: Lesson[] = [
  {
    id: "vowels",
    title: "স্বরবর্ণ প্র্যাক্টিস (Vowels)",
    description: "ভাষা শিক্ষার প্রথম ধাপ - বাংলা স্বরবর্ণগুলো প্র্যাক্টিস করুন।",
    difficulty: "beginner",
    content: "অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ",
    expectedPhonetic: "o a i I u U rri e OI O OU"
  },
  {
    id: "consonants-1",
    title: "ব্যঞ্জনবর্ণ - গ্রুপ ১ (Consonants Part 1)",
    description: "ক থেকে ঞ পর্যন্ত ব্যঞ্জনবর্ণের অনুশীলন।",
    difficulty: "beginner",
    content: "ক খ গ ঘ ঙ চ ছ জ ঝ ঞ",
    expectedPhonetic: "k kh g gh Ng c ch j jh NG"
  },
  {
    id: "consonants-2",
    title: "ব্যঞ্জনবর্ণ - গ্রুপ ২ (Consonants Part 2)",
    description: "ট থেকে ন পর্যন্ত ব্যঞ্জনবর্ণের অনুশীলন।",
    difficulty: "beginner",
    content: "ট ঠ ড ঢ ণ ত থ দ ধ ন",
    expectedPhonetic: "T Th D Dh N t th d dh n"
  },
  {
    id: "consonants-3",
    title: "ব্যঞ্জনবর্ণ - গ্রুপ ৩ (Consonants Part 3)",
    description: "প থেকে হসন্ত ও চন্দ্রবিন্দু পর্যন্ত অনুশীলন।",
    difficulty: "beginner",
    content: "প ফ ব ভ ম য র ল শ ষ স হ ড় ঢ় য় ৎ ং ঃ ঁ",
    expectedPhonetic: "p ph b bh m z r l sh Sh s h R Rh y t` ng : ^"
  },
  {
    id: "conjuncts-basics",
    title: "সহজ যুক্তাক্ষর (Simple Conjuncts)",
    description: "কষ্ট, রক্ত, জ্ঞান, স্পষ্ট এর মতো সাধারণ যুক্তাক্ষর অনুশীলন।",
    difficulty: "intermediate",
    content: "কষ্ট রক্ত জ্ঞান স্পষ্ট ইচ্ছা পক্ষ বন্টন বিজ্ঞান আনন্দ বিশ্ব",
    expectedPhonetic: "koShTo rokto Jan spoShTo iccha pokSho bonTon biJan anondo bishwo"
  },
  {
    id: "common-sentences-1",
    title: "সহজ বাক্য - আমাদের বাংলাদেশ",
    description: "আমাদের মাতৃভূমি ও ভাষা নিয়ে সহজ কথামালা টাইপিং প্র্যাক্টিস করুন।",
    difficulty: "intermediate",
    content: "আমাদের দেশের নাম বাংলাদেশ। বাংলা আমাদের মাতৃভাষা। আমরা বাংলাকে অন্তরের সাথে ভালবাসি। আমাদের জাতীয় ফুল শাপলা।",
    expectedPhonetic: "amader desher nam bangladesh. bangla amader matrribhaSha. amora banglake ontorer sathe bhalobasi. amader jatIyo phul shapola."
  },
  {
    id: "famous-quote-tagore",
    title: "রবীন্দ্রনাথ ঠাকুর - সোনার তরী",
    description: "রবীন্দ্রনাথ ঠাকুরের বিখ্যাত কবিতা 'সোনার তরী'র অংশবিশেষ অনুশীলন।",
    difficulty: "advanced",
    content: "গগন গরজে মেঘ ঘন বরষা কূলে একা বসে আছি নাহি ভরসা। রাশি রাশি ভারা ভারা ধান কাটা হলো সারা ভরা নদী ক্ষুরধারা খরপরশা।",
    expectedPhonetic: "gogon goroje megh ghono boroSha kUle eka bose achi nahi bhorosa. rashi rashi bhara bhara dhan kaTa holO sara bhora nodI kShurodhara khoroporosha."
  },
  {
    id: "famous-quote-nazrul",
    title: "কাজী নজরুল ইসলাম - সংকল্প",
    description: "জাতীয় কবি কাজী নজরুল ইসলামের চিরসবুজ ও অনুপ্রেরণামূলক পঙ্ক্তি।",
    difficulty: "advanced",
    content: "থাকব নাকো বদ্ধ খাঁচায় দেখব এবার জগৎটাকে কেমন করে ঘুরছে মানুষ যুগান্তরের ঘূর্ণিপাকে। দেশ হতে দেশ দেশান্তরে ছুটছে তারা কেমন করে।",
    expectedPhonetic: "thakobo nakO boddho kha^cay dekhobo ebar jogot`Take kemon kore ghuroche manuSh zugantorer ghUrNipake. desh hote desh deshantore chuToche tara kemon kore."
  },
  {
    id: "bengali-history-1",
    title: "ভাষা আন্দোলন ও স্বাধীনতা",
    description: "১৯৫২ সালের মহান ভাষা আন্দোলন নিয়ে একটি সংক্ষিপ্ত পরিচ্ছেদ অনুশীলন।",
    difficulty: "advanced",
    content: "১৯৫২ সালের একুশে ফেব্রুয়ারি বাংলা ভাষার জন্য রফিক সালাম বরকত শফিউর ও জব্বার জীবন বিসর্জন দিয়েছিলেন। আমরা তাদের শ্রদ্ধাভরে স্মরণ করি।",
    expectedPhonetic: "1952 saler ekushe februyari bangla bhaShar jonyo rofik salam borokot shofiur O jobbar jIbon bisorjon diyechilen. amora tader shroddhabhore smoroN kori."
  }
];
