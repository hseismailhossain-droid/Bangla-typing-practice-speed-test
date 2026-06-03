/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson } from "../types";
import { AlphabetGroup } from "./alphabetPractice";

export const VOWELS_CONJUNCT: AlphabetGroup[] = [
  {
    char: "অ",
    words: ["অন্ধ", "অঙ্ক", "অন্ত", "অল্প", "অশ্ব", "অস্ত্র", "অম্ল", "অশ্রু", "অব্দ", "অর্থ", "অক্ষম", "অদৃশ্য"],
    phonetics: ["ondh", "oNgk", "ont", "olp", "oshb", "ostr", "oml", "oshru", "obd", "orth", "okShom", "odrrishz"]
  },
  {
    char: "আ",
    words: ["আচ্ছা", "আশ্চর্য", "আত্ম", "আগ্রহ", "আড্ডা", "আবিষ্কার", "আসক্তি", "আস্থা", "আল্পনা", "আক্রমণ", "আহ্বান"],
    phonetics: ["accha", "ashcorz", "atm", "agroh", "aDDa", "abiShkar", "asokti", "astha", "alpona", "akromoN", "ahban"]
  },
  {
    char: "ই",
    words: ["ইচ্ছা", "ইস্ত্রি", "ইঞ্জিনিয়ার", "ইনজেকশন", "ইন্সপেক্টর", "ইন্ধন", "ইষ্টক", "ইস্তফা", "ইস্পাত", "ইঞ্চি", "ইচ্ছুক"],
    phonetics: ["iccha", "istri", "iNGjiniyar", "inojekoshon", "insopekTor", "indhon", "iShTok", "istopha", "ispat", "iNGci", "icchuk"]
  },
  {
    char: "ঈ",
    words: ["ঈশ্বর", "ঈশ্বরী", "ঈর্ষা", "ঈর্ষাপরায়ণ", "ঈর্ষান্বিত", "ঈপ্সিত", "তীক্ষ্ণ", "পরীক্ষা", "দীক্ষা", "ক্ষীয়মাণ"],
    phonetics: ["Ishbor", "IshborI", "IrSha", "IrShaporayoN", "IrShanbit", "Ipsit", "tIkShN", "porIkSha", "dIkSha", "kShIyomaN"]
  },
  {
    char: "উ",
    words: ["উৎসব", "উত্তর", "উচ্চ", "উচ্ছ্বাস", "উত্থান", "উন্নতি", "উদ্ভিদ", "উপরিউক্ত", "উল্লাস", "উষ্ণ", "উড্ডীন"],
    phonetics: ["ut`sob", "uttor", "ucc", "ucchbas", "utthan", "unnoti", "udbhid", "uporiukt", "ullas", "uShN", "uDDIn"]
  },
  {
    char: "ঊ",
    words: ["ঊর্ধ্ব", "ঊর্মি", "ঊর্ণা", "ঊর্ণনাভ", "অনূর্ধ্ব", "ঊর্ধ্বগ", "ঊর্ধ্ববাহু", "ঊর্ধ্বে", "ঊর্ধ্বসীমা", "মূর্ছা", "সূক্ষ্ম"],
    phonetics: ["Urdhb", "Urmi", "UrNa", "UrNonabh", "onUrdhb", "Urdhbog", "Urdhbobahu", "Urdhbe", "UrdhbosIma", "mUrcha", "sUkShm"]
  },
  {
    char: "ঋ",
    words: ["ঋদ্ধ", "ঋদ্ধি", "ঋত্বিক", "ঋগ্বেদ", "ঋণগ্রস্ত", "সৃষ্টি", "দৃষ্টি", "কৃষ্টি", "প্রবৃত্তি", "আবৃত্তি", "ধৃতরাষ্ট্র"],
    phonetics: ["rriddh", "rriddhi", "rritbik", "rrigbed", "rriNogrost", "srriShTi", "drriShTi", "krriShTi", "probrritti", "abrritti", "dhrritoraShTr"]
  },
  {
    char: "এ",
    words: ["এক্সরে", "এনট্রেন্স", "এক্সপ্রেস", "এপ্রন", "অ্যালবাম", "অ্যাম্বুলেন্স", "অ্যাসিস্ট্যান্ট", "অ্যাসেম্বলি", "এক্সেপ্ট"],
    phonetics: ["eksore", "enoTrens", "eksopres", "epron", "oyalobam", "oyambulens", "oyasisTzanT", "oyasemboli", "eksepT"]
  },
  {
    char: "ঐ",
    words: ["ঐক্য", "ঐতিহ্য", "ঐশ্বর্য", "ঐকমত্য", "ঐন্দ্রজালিক", "ঐক্যবদ্ধ", "ঐতিহ্যবাহী", "বৈচিত্র্য", "দ্বৈরাজ্য", "দৈন্য"],
    phonetics: ["OIkz", "OItihz", "OIshborz", "OIkomotz", "OIndrojalik", "OIkzoboddh", "OItihzobahI", "bOIcitrz", "dbOIrajz", "dOInz"]
  },
  {
    char: "ও",
    words: ["ওস্তাদ", "অক্সিজেন", "অক্টোবর", "ওভারড্রাফট", "ওলন্দাজ", "ওয়ারেন্ট", "ওয়ার্কশপ", "ওয়াশিংটন", "ওল্ড", "পোস্টার"],
    phonetics: ["Ostad", "oksijen", "okTObor", "ObharoDraphoT", "Olondaj", "OyarenT", "Oyarkoshop", "OyashingTon", "OlD", "pOsTar"]
  },
  {
    char: "ঔ",
    words: ["ঔদার্য", "ঔপন্যাসিক", "ঔৎসুক্য", "ঔচিত্য", "ঔদাসীন্য", "ঔজ্জ্বল্য", "পৌত্তলিক", "সৌন্দর্য", "পৌষ্পিক"],
    phonetics: ["OUdarz", "OUponzasik", "OUt`sukz", "OUcitz", "OUdasInz", "OUjjbolz", "pOUttolik", "sOUndorz", "pOUShpik"]
  }
];

export const CONSONANTS_CONJUNCT: AlphabetGroup[] = [
  {
    char: "ক",
    words: ["রক্ত", "শক্ত", "ছক্কা", "মক্কা", "অঙ্ক", "কঙ্কাল", "চক্র", "বক্র", "ক্ষমতা", "শিক্ষা", "দীক্ষা"],
    phonetics: ["rokt", "shokt", "chokka", "mokka", "oNgk", "koNgkal", "cokr", "bokr", "kShomota", "shikSha", "dIkSha"]
  },
  {
    char: "খ",
    words: ["সখ্য", "মুখ্য", "বিখ্যাত", "উপাখ্যান", "আখ্যান", "খ্রিষ্টান", "খ্রিষ্টাব্দ", "শঙ্খ", "শৃঙ্খলা", "পঙ্খি"],
    phonetics: ["sokhz", "mukhz", "bikhzat", "upakhzan", "akhzan", "khriShTan", "khriShTabd", "shoNgkh", "shrriNgkhola", "poNgkhi"]
  },
  {
    char: "গ",
    words: ["দুগ্ধ", "মুগ্ধ", "গ্রাম", "গ্রহণ", "গ্লাস", "গ্লানি", "ভাগ্য", "যোগ্য", "খড়্গ", "বাগ্দেবী"],
    phonetics: ["dugdh", "mugdh", "gram", "grohoN", "glas", "glani", "bhagz", "zOgz", "khoRg", "bagdebI"]
  },
  {
    char: "ঘ",
    words: ["কৃতজ্ঞ", "বিঘ্ন", "জঘন্য", "জঙ্ঘা", "লঙ্ঘন", "দীর্ঘ", "অর্ঘ্য", "সঙ্ঘ", "সঙ্ঘবদ্ধ", "রাজঘ্ন"],
    phonetics: ["krritojNG", "bighn", "joghonz", "joNggha", "loNgghon", "dIrgh", "orghz", "soNggh", "soNgghoboddh", "rajoghn"]
  },
  {
    char: "ঙ",
    words: ["পঙ্কজ", "কঙ্কণ", "অঙ্গ", "বঙ্গ", "গঙ্গা", "দাঙ্গা", "পঙ্গু", "লিঙ্গ", "শঙ্খধ্বনি", "সঙ্ঘমিত্রা"],
    phonetics: ["poNgkoj", "koNgkoN", "oNgg", "boNgg", "goNgga", "daNgga", "poNggu", "liNgg", "shoNgkhodhboni", "soNgghomitra"]
  },
  {
    char: "চ",
    words: ["উচ্চ", "উচ্চারণ", "ইচ্ছা", "আচ্ছা", "কচ্ছপ", "যাচ্ঞা", "পশ্চিম", "নিশ্চয়", "আশ্চর্য", "পুনশ্চ"],
    phonetics: ["ucc", "uccaroN", "iccha", "accha", "kocchop", "zacNGa", "poshcim", "nishcoy", "ashcorz", "punoshc"]
  },
  {
    char: "ছ",
    words: ["গুচ্ছ", "তুচ্ছ", "পরিচ্ছন্ন", "বিচ্ছন্ন", "উচ্ছেদ", "আচ্ছাদন", "বিচ্ছুরণ", "শিরচ্ছেদ", "আচ্ছন্ন", "উচ্ছ্বল"],
    phonetics: ["gucch", "tucch", "poricchonn", "bicchonn", "ucched", "acchadon", "bicchuroN", "shirocched", "acchonn", "ucchbol"]
  },
  {
    char: "জ",
    words: ["লজ্জা", "সজ্জা", "উজ্জ্বল", "প্রোজ্জ্বল", "জ্ঞান", "বিজ্ঞান", "আজ্ঞা", "অঞ্জন", "গঞ্জ", "কুঞ্জ", "ব্যঞ্জন"],
    phonetics: ["lojja", "sojja", "ujjbol", "prOjjbol", "jNGan", "bijNGan", "ajNGa", "oNGjon", "goNGj", "kuNGj", "byoNGjon"]
  },
  {
    char: "ঝ",
    words: ["ঝঞ্ঝা", "ঝঞ্ঝাট", "কুজ্জ্বটিকা", "নির্ঝর", "নির্ঝরিণী", "ঝঞ্ঝাবর্ত", "ঝঞ্ঝামুখর", "ঝঞ্ঝানিলা", "ঝাঞ্ঝা"],
    phonetics: ["jhoNGjha", "jhoNGjhaT", "kujjboTika", "nirjhor", "nirjhoriNI", "jhoNGjhabort", "jhoNGjhamukhor", "jhoNGjhanila", "jhaNGjha"]
  },
  {
    char: "ঞ",
    words: ["চঞ্চল", "অঞ্চল", "লাঞ্ছনা", "বাঞ্ছা", "বাঞ্ছিত", "রঞ্জক", "গুঞ্জন", "পুঞ্জ", "জঞ্জাল", "খঞ্জনি"],
    phonetics: ["coNGcol", "oNGcol", "laNGchona", "baNGcha", "baNGchit", "roNGjok", "guNGjon", "puNGj", "joNGjal", "khoNGjoni"]
  },
  {
    char: "ট",
    words: ["টাট্টু", "চট্টগ্রাম", "খাট্টা", "প্রজেক্ট", "ডিরেক্টর", "কষ্ট", "নষ্ট", "স্পষ্ট", "সৃষ্টি", "প্যান্ট", "সেন্ট"],
    phonetics: ["TaTTu", "coTTogram", "khaTTa", "projekT", "DirekTor", "koShT", "noShT", "spoShT", "srriShTi", "pzanT", "senT"]
  },
  {
    char: "ঠ",
    words: ["পাঠ্য", "শ্রেষ্ঠ", "পৃষ্ঠা", "কাষ্ঠ", "ওষ্ঠ", "জ্যেষ্ঠ", "কণ্ঠ", "উপকণ্ঠ", "লণ্ঠন", "কুণ্ঠা", "উৎকণ্ঠা"],
    phonetics: ["paThz", "shreShTh", "prriShTha", "kaShTh", "OShTh", "jzeShTh", "koNTh", "upokoNTh", "loNThon", "kuNTha", "ut`koNTha"]
  },
  {
    char: "ড",
    words: ["আড্ডা", "গড্ডলিকা", "উড্ডীন", "লাড্ডু", "কাণ্ড", "খণ্ড", "পাণ্ডব", "ভণ্ড", "ফিল্ড", "গোল্ড", "ব্র্যান্ড"],
    phonetics: ["aDDa", "goDDolika", "uDDIn", "laDDu", "kaND", "khoND", "paNDob", "bhoND", "philD", "gOlD", "brzanD"]
  },
  {
    char: "ঢ",
    words: ["আঢ্য", "আঢ্যতা", "ঢ্যামো", "নির্ঢাল", "গাঢ়ত্ব", "প্রৌঢ়ত্ব", "সুদৃঢ়তা", "মূঢ়ত্ব"],
    phonetics: ["aDhz", "aDhzota", "DhzamO", "nirDhal", "gaRhotb", "prOURhotb", "sudrriRhota", "mURhotb"]
  },
  {
    char: "ণ",
    words: ["ঘণ্টা", "বণ্টন", "কণ্ঠ", "কাণ্ড", "পাণ্ডিত্য", "বিষণ্ণ", "প্রসন্ন", "কৃষ্ণ", "বিষ্ণু", "উষ্ণ", "তৃষ্ণা"],
    phonetics: ["ghoNTa", "boNTon", "koNTh", "kaND", "paNDitz", "biShoNN", "prosonn", "krriShN", "biShNu", "uShN", "trriShNa"]
  },
  {
    char: "ত",
    words: ["উত্তর", "বৃত্ত", "উত্থান", "রত্ন", "যত্ন", "ছাত্র", "পাত্র", "তত্ত্ব", "রাজত্ব", "মহত্ব", "রাস্তা"],
    phonetics: ["uttor", "brritt", "utthan", "rotn", "zotn", "chatr", "patr", "tottb", "rajotb", "mohotb", "rasta"]
  },
  {
    char: "থ",
    words: ["তথ্য", "পথ্য", "মিথ্যা", "উত্থাপন", "অশ্বত্থ", "পন্থ", "পন্থা", "গ্রন্থ", "স্থান", "সুস্থ", "মুখস্থ"],
    phonetics: ["tothz", "pothz", "mithza", "utthapon", "oshbotth", "ponth", "pontha", "gronth", "sthan", "susth", "mukhosth"]
  },
  {
    char: "দ",
    words: ["উদ্দেশ্য", "উদ্ধার", "পদ্ধতি", "স্বাধীন", "দ্বার", "পদ্ম", "ছদ্ম", "আনন্দ", "সুন্দর", "শব্দ", "অব্দ"],
    phonetics: ["uddeshz", "uddhar", "poddhoti", "sbadhIn", "dbar", "podm", "chodm", "anond", "sundor", "shobd", "obd"]
  },
  {
    char: "ধ",
    words: ["বাধ্য", "সাধ্য", "যুদ্ধ", "বৃদ্ধ", "অন্ধ", "গন্ধ", "বন্ধু", "সন্ধ্যা", "অর্ধ", "বর্ধন", "দীর্ঘায়ু"],
    phonetics: ["badhz", "sadhz", "zuddh", "brriddh", "ondh", "gondh", "bondhu", "sondhza", "ordh", "bordhon", "dIrghayu"]
  },
  {
    char: "ন",
    words: ["অন্ন", "ভিন্ন", "শান্ত", "বসন্ত", "যন্ত্র", "মন্ত্র", "বিন্দু", "সিন্ধু", "জন্ম", "চিন্ময়", "উন্মুখ"],
    phonetics: ["onn", "bhinn", "shant", "bosont", "zontr", "montr", "bindu", "sindhu", "jonm", "cinmoy", "unmukh"]
  },
  {
    char: "প",
    words: ["সুপ্ত", "প্রাপ্ত", "বাপ্পা", "থাপ্পড়", "কম্প", "সম্পদ", "স্পর্শ", "স্পষ্ট", "প্রথম", "প্রধান", "প্লাবন"],
    phonetics: ["supt", "prapt", "bappa", "thappoR", "komp", "sompod", "sporsh", "spoShT", "prothom", "prodhan", "plabon"]
  },
  {
    char: "ফ",
    words: ["সফট", "লিফট", "লম্ফ", "ঝম্প", "গুম্ফ", "স্ফটিক", "স্ফূর্তি", "স্বতঃস্ফূর্ত", "ফ্রেম", "ফ্রক", "ফ্রিজ"],
    phonetics: ["sophoT", "liphoT", "lomph", "jhomp", "gumph", "sphoTik", "sphUrti", "sbot:sphUrt", "phrem", "phrok", "phrij"]
  },
  {
    char: "ব",
    words: ["আব্বা", "ডাব্বা", "শব্দ", "স্তব্ধ", "লব্ধ", "কম্বল", "লম্বা", "সম্ভব", "স্তম্ভ", "আরম্ভ", "স্বভাব"],
    phonetics: ["abba", "Dabba", "shobd", "stobdh", "lobdh", "kombol", "lomba", "sombhob", "stombh", "arombh", "sbobhab"]
  },
  {
    char: "ভ",
    words: ["সভ্য", "অভ্যাস", "সম্ভাবনা", "স্বয়ম্ভূ", "ভ্রমণ", "ভ্রাতা", "গর্ভ", "নির্ভীক", "আবির্ভাব", "উর্বর"],
    phonetics: ["sobhz", "obhzas", "sombhabona", "sboyombhU", "bhromoN", "bhrata", "gorbh", "nirbhIk", "abirbhab", "urbor"]
  },
  {
    char: "ম",
    words: ["সম্মান", "সম্মত", "সম্মেলন", "কম্পন", "কম্বল", "জম্ভ", "জন্ম", "পদ্ম", "স্মরণ", "স্মৃতি", "বিস্ময়"],
    phonetics: ["somman", "sommot", "sommelon", "kompon", "kombol", "jombh", "jonm", "podm", "smoroN", "smrriti", "bismoy"]
  },
  {
    char: "য/য়",
    words: ["সত্য", "বিদ্যা", "কাব্য", "হাস্য", "বাক্য", "কার্য", "ধার্য", "আর্য", "সূর্য", "বীর্য", "ঐশ্বর্য"],
    phonetics: ["sotz", "bidza", "kabz", "hasz", "bakz", "karz", "dharz", "arz", "sUrz", "bIrz", "OIshborz"]
  },
  {
    char: "র",
    words: ["চক্র", "গ্রাম", "ছাত্র", "প্রথম", "তর্ক", "স্বর্গ", "কর্তা", "ধর্ম", "কর্ম", "বর্ষা", "মূর্ত"],
    phonetics: ["cokr", "gram", "chatr", "prothom", "tork", "sborg", "korta", "dhorm", "korm", "borSha", "mUrt"]
  },
  {
    char: "ল",
    words: ["দিল্লি", "উল্লাস", "পল্লব", "শুল্ক", "উল্কা", "অল্প", "গল্প", "কল্পনা", "গুল্ম", "প্লাস্টিক", "ব্লক"],
    phonetics: ["dilli", "ullas", "pollob", "shulk", "ulka", "olp", "golp", "kolpona", "gulm", "plasTik", "blok"]
  },
  {
    char: "শ",
    words: ["পশ্চিম", "প্রশ্ন", "অশ্ব", "বিশ্ব", "বিশ্বাস", "শ্লোক", "শ্লাঘা", "দর্শন", "আদর্শ", "স্পর্শ", "পতিশ্চ"],
    phonetics: ["poshcim", "proshn", "oshb", "bishb", "bishbas", "shlOk", "shlagha", "dorshon", "adorsh", "sporsh", "potishc"]
  },
  {
    char: "ষ",
    words: ["পরিষ্কার", "আবিষ্কার", "কষ্ট", "শ্রেষ্ঠ", "পৃষ্ঠা", "কৃষ্ণ", "বিষ্ণু", "পুষ্প", "বর্ষা", "হর্ষ", "আকর্ষণ"],
    phonetics: ["poriShkar", "abiShkar", "koShT", "shreShTh", "prriShTha", "krriShN", "biShNu", "puShp", "borSha", "horSh", "akorShoN"]
  },
  {
    char: "স",
    words: ["স্কুল", "রাস্তা", "ব্যস্ত", "স্থান", "সুস্থ", "স্পর্শ", "পরস্পর", "স্বাধীন", "স্বামী", "স্মরণ", "স্নান"],
    phonetics: ["skul", "rasta", "byosto", "sthan", "susth", "sporsh", "porospor", "sbadhIn", "sbamI", "smoroN", "snan"]
  },
  {
    char: "হ",
    words: ["চিহ্ন", "বহ্নি", "মধ্যাহ্ন", "অপরাহ্ণ", "ব্রাহ্মণ", "ব্রহ্ম", "আহ্বান", "জিহ্বা", "বাহ্য", "সহ্য", "হৃদয়"],
    phonetics: ["cihn", "bohni", "modhzahn", "oporahN", "brahmoN", "brohm", "ahban", "jihba", "bahz", "sohz", "hrridoy"]
  },
  {
    char: "ড়",
    words: ["খড়্গ", "খড়্গপুর", "খড়্গধারী", "খড়্গহস্ত", "খড়্গবিলাস", "খড়্গী", "খড়্গাকার", "খড়্গপাণি", "খড়্গচক্র"],
    phonetics: ["khoRg", "khoRgopur", "khoRgodharI", "khoRgohost", "khoRgobilas", "khoRgI", "khoRgakar", "khoRgopaNi", "khoRgocokr"]
  },
  {
    char: "ঢ়",
    words: ["গাঢ়ত্ব", "দৃঢ়ত্ব", "মূঢ়ত্ব", "প্রৌঢ়ত্ব", "সুদৃঢ়ত্ব", "প্রৌঢ়ত্বাবস্থা", "সুদৃঢ়প্রমাণ", "গাঢ় নীলিমা"],
    phonetics: ["gaRhotb", "drriRhotb", "mURhotb", "prOURhotb", "sudrriRhotb", "prOURhotbabostha", "sudrriRhopromaN", "gaRh nIlima"]
  },
  {
    char: "ৎ",
    words: ["বৎসর", "উৎসব", "মৎস্য", "কুৎসিত", "উৎসাহ", "আত্মসাৎ", "ভবিষ্যৎবাণী", "সপাৎ", "চিৎকার", "উৎপাত"],
    phonetics: ["bt`sor", "ut`sob", "mt`sz", "kut`sit", "ut`sah", "atmosat`", "bhobiShzt`baNI", "sopat`", "cit`kar", "ut`pat"]
  },
  {
    char: "ং",
    words: ["বংশ", "অংশ", "ধ্বংস", "সিংহ", "হিংসা", "সংসার", "সংক্ষেপ", "আংটি", "সংবাদ", "সংহার", "মাংস"],
    phonetics: ["bngsh", "ongsh", "dhbngs", "singh", "hingsa", "sngsar", "sngkShep", "angTi", "sngbad", "snghar", "mangs"]
  },
  {
    char: "ঃ",
    words: ["দুঃখ", "নিঃশব্দ", "দুঃসাহস", "স্বতঃস্ফূর্ত", "নিঃশ্বাস", "দুঃখিত", "প্রাতঃকাল", "মনঃকষ্ট", "অন্তঃপুর", "দুঃসময়"],
    phonetics: ["du:kh", "ni:shobd", "du:sahos", "sbot:sphUrt", "ni:shbas", "du:khit", "prat:kal", "mon:koShT", "ont:pur", "du:somoy"]
  },
  {
    char: "ঁ",
    words: ["চাঁদ", "বাঁশ", "দাঁত", "পাঁচ", "হাঁস", "কাঁঠাল", "ইঁদুর", "ধোঁয়া", "পেঁচা", "খাঁচা", "কাঁচ", "ফাঁদ", "ঝাঁঝ"],
    phonetics: ["ca^d", "ba^sh", "da^t", "pa^c", "ha^s", "ka^Thal", "i^dur", "dhO^ya", "pe^ca", "kha^ca", "ka^c", "pha^d", "jha^jh"]
  }
];
