/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson } from "../types";

export interface AlphabetGroup {
  char: string;
  words: string[];
  phonetics: string[];
}

export const VOWELS_ALPHABET: AlphabetGroup[] = [
  {
    char: "অ",
    words: ["অজগর", "অনেক", "অলি", "অমর", "অলংকার", "অপরাধ", "অপেক্ষা", "অবহেলা", "অতীত", "অত্যন্ত", "অলস", "অচল", "অধম", "অণু", "অভাব", "অনল", "অসৎ", "অল্প"],
    phonetics: ["ojogor", "onek", "oli", "omor", "olngkar", "oporadh", "opekSha", "obohela", "otIt", "otzont", "olos", "ocol", "odhom", "oNu", "obhab", "onol", "ost`", "olp"]
  },
  {
    char: "আ",
    words: ["আম", "আলো", "আকাশ", "আনন্দ", "আপন", "আলসেমি", "আদর", "আদা", "আপেল", "আহ্বান", "আগামীকাল", "আজ", "আমরা", "আমাদের", "আঘাত", "আগুন", "আঙ্গুর", "আড্ডা"],
    phonetics: ["am", "alO", "akash", "anond", "apon", "alosemi", "ador", "ada", "apel", "ahban", "agamIkal", "aj", "amora", "amader", "aghat", "agun", "aNggur", "aDDa"]
  },
  {
    char: "ই",
    words: ["ইলিশ", "ইঁদুর", "ইচ্ছা", "ইতিহাস", "ইতি", "ইট", "ইমারত", "ইশারা", "ইস্ত্রি", "ইহকাল", "ইতর", "ইঞ্চি", "ইন্ধন", "ইদানীং", "ইত্যাদি", "ইমান", "ইলেকট্রনিক"],
    phonetics: ["ilish", "i^dur", "iccha", "itihas", "iti", "iT", "imarot", "ishara", "istri", "ihokal", "itor", "iNGci", "indhon", "idanIng", "itzadi", "iman", "ilekoTronik"]
  },
  {
    char: "ঈ",
    words: ["ঈগল", "ঈদ", "ঈশান", "ঈর্ষা", "ঈষৎ", "ঈশ্বর", "ঈপ্সিত", "ঈদৃশ", "ঈক্ষণ", "ঈষদুষ্ণ", "ঈষদ্ধাস্য", "ঈশিতা", "ঈশেন", "ঈর্ষাপরায়ণ", "ঈহমান"],
    phonetics: ["Igol", "Id", "Ishan", "IrSha", "ISht`", "Ishbor", "Ipsit", "Idrrish", "IkShoN", "IShoduShN", "IShoddhasz", "Ishita", "Ishen", "IrShaporayoN", "Ihoman"]
  },
  {
    char: "উ",
    words: ["উট", "উজান", "উৎসব", "উদয়", "উপহার", "উত্তর", "উনুন", "উক্তি", "উচ্চ", "উচ্ছ্বাস", "উঠান", "উড়োজাহাজ", "উদ্ভিদ", "উন্নতি", "উপকার", "উল্লাস", "উদাস", "উদ্যান"],
    phonetics: ["uT", "ujan", "ut`sob", "udoy", "upohar", "uttor", "unun", "ukti", "ucc", "ucchbas", "uThan", "uROjahaj", "udbhid", "unnoti", "upokar", "ullas", "udas", "udzan"]
  },
  {
    char: "ঊ",
    words: ["ঊর্মি", "ঊষা", "ঊর্ধ্ব", "ঊনবিংশ", "ঊরূ", "ঊনপঞ্চাশ", "ঊনষাট", "ঊর্ধসীমা", "ঊনত্রিশ", "ঊনচল্লিশ", "ঊর্ণনাভ", "ঊর্ধ্বে", "ঊষালোক", "ঊষর", "ঊর্ণা"],
    phonetics: ["Urmi", "USha", "Urdhb", "Unobingsh", "UrU", "UnopoNGcash", "UnoShaT", "UrdhosIma", "Unotrish", "Unocollish", "UrNonabh", "Urdhbe", "UShalOk", "UShor", "UrNa"]
  },
  {
    char: "ঋ",
    words: ["ঋতু", "ঋণ", "ঋষি", "ঋজু", "ঋদ্ধ", "ঋকবেদ", "ঋতুরাজ", "ঋণগ্রস্ত", "ঋণমুক্তি", "ঋদ্ধি", "ঋষভ", "ঋষিকল্প", "ঋত্বিক", "ঋষিপুত্র", "ঋণাত্মক"],
    phonetics: ["rritu", "rriN", "rriShi", "rriju", "rriddh", "rrikobed", "rrituraj", "rriNogrost", "rriNomukti", "rriddhi", "rriShobh", "rriShikolp", "rritbik", "rriShiputr", "rriNatmok"]
  },
  {
    char: "এ",
    words: ["এক", "একটি", "একতা", "এমন", "এলাকা", "একুশে", "এলাচি", "এবার", "এগারো", "একলা", "একই", "একাকী", "একদম", "একাগ্রতা", "এলোমেলো", "এপার", "এড়ানো", "এসিড"],
    phonetics: ["ek", "ekoTi", "ekota", "emon", "elaka", "ekushe", "elaci", "ebar", "egarO", "ekola", "ekoi", "ekakI", "ekodom", "ekagrota", "elOmelO", "epar", "eRanO", "esiD"]
  },
  {
    char: "ঐ",
    words: ["ঐক্য", "ঐতিহ্য", "ঐরাবত", "ঐশ্বরিক", "ঐকান্তিক", "ঐশ্বর্য", "ঐকতান", "ঐকমত্য", "ঐচ্ছিক", "ঐন্দ্রজালিক", "ঐশ", "ঐহিক", "ঐক্যবদ্ধ", "ঐকতানবাদক"],
    phonetics: ["OIkz", "OItihz", "OIrabot", "OIshborik", "OIkantik", "OIshborz", "OIkotan", "OIkomotz", "OIcchik", "OIndrojalik", "OIsh", "OIhik", "OIkzoboddh", "OIkotanobadok"]
  },
  {
    char: "ও",
    words: ["ওজন", "ওল", "ওড়না", "ওষুধ", "ওস্তাদ", "ওপার", "ওলটপালট", "ওঝা", "ওকালতি", "ওয়ান", "ওয়ারেন্টি", "ওভার", "ওলকপি", "ওলাওঠা", "ওলন্দাজ"],
    phonetics: ["Ojon", "Ol", "ORona", "OShudh", "Ostad", "Opar", "OloTopaloT", "Ojha", "Okaloti", "Oyan", "OyarenTi", "Obhar", "Olokopi", "OlaOTha", "Olondaj"]
  },
  {
    char: "ঔ",
    words: ["ঔষধ", "ঔদার্য", "ঔপন্যাসিক", "ঔৎসুক্য", "ঔচিত্য", "ঔদাসীন্য", "ঔজ্জ্বল্য", "ঔপনিবেশিক", "ঔরস", "ঔপচায়িক", "ঔদরিক", "ঔপপত্তিক", "ঔপাধিক", "ঔদার্যপূর্ণ"],
    phonetics: ["OUShodh", "OUdarz", "OUponzasik", "OUt`sukz", "OUcitz", "OUdasInz", "OUjjbolz", "OUponibeshik", "OUros", "OUpocayik", "OUdorik", "OUpopottik", "OUpadhik", "OUdarzopUrN"]
  }
];

export const CONSONANTS_ALPHABET: AlphabetGroup[] = [
  {
    char: "ক",
    words: ["কলম", "কাক", "কৃষক", "কাগজ", "কথা", "কাজ", "কাল", "কলহ", "কবিতা", "কদম", "কপাল", "করাত", "কমলা", "কনিষ্ঠ", "করুণা", "ক্ষমতা", "ক্রিকেট", "ক্যামেরা", "কষ্ট"],
    phonetics: ["kolom", "kak", "krriShok", "kagoj", "kotha", "kaj", "kal", "koloh", "kobita", "kodom", "kopal", "korat", "komola", "koniShTh", "koruNa", "kShomota", "krikeT", "kzamera", "koShT"]
  },
  {
    char: "খ",
    words: ["খবর", "খাতা", "খোলা", "খেলনা", "খাবার", "খাঁচা", "খাট", "খাম", "খাসিয়া", "খারাপ", "খাতক", "খনিজ", "খড়গ", "খঞ্জন", "খদ্দের", "খলনায়ক", "খড়কুটো", "খিলান", "খুশি"],
    phonetics: ["khobor", "khata", "khOla", "khelona", "khabar", "kha^ca", "khaT", "kham", "khasiya", "kharap", "khatok", "khonij", "khoRog", "khoNGjon", "khodder", "kholonayok", "khoRokuTO", "khilan", "khushi"]
  },
  {
    char: "গ",
    words: ["গাছ", "গান", "গোলাপ", "গরম", "গগন", "গল্প", "গরু", "গভীর", "গাধা", "গাজর", "গরিমা", "গণিত", "গহনা", "গতি", "গম", "গরাদ", "গঠন", "গৌরব", "গ্রীষ্ম"],
    phonetics: ["gach", "gan", "gOlap", "gorom", "gogon", "golp", "goru", "gobhIr", "gadha", "gajor", "gorima", "goNit", "gohona", "goti", "gom", "gorad", "goThon", "gOUrob", "grIShm"]
  },
  {
    char: "ঘ",
    words: ["ঘর", "ঘড়ি", "ঘুম", "ঘাস", "ঘটনা", "ঘুড়ি", "ঘৃণা", "ঘূর্ণন", "ঘাম", "ঘি", "ঘণ্টা", "ঘাট", "ঘোড়া", "ঘুঙুর", "ঘষা", "ঘাতক", "ঘরণী", "ঘেরাও", "ঘোলা"],
    phonetics: ["ghor", "ghoRi", "ghum", "ghas", "ghoTona", "ghuRi", "ghrriNa", "ghUrNon", "gham", "ghi", "ghoNTa", "ghaT", "ghORa", "ghuNgur", "ghoSha", "ghatok", "ghoroNI", "gheraO", "ghOla"]
  },
  {
    char: "ঙ",
    words: ["আঙুল", "ব্যাঙ", "রঙিন", "ভাঙা", "বাঙালি", "রাঙা", "ডাঙা", "সং", "সঙ", "লাঙল", "জঙ্গল", "মঙ্গল", "দাঙ্গা", "পঙ্গু", "কঙ্কাল", "অঙ্ক", "শঙ্খ", "লিঙ্গ", "রিং"],
    phonetics: ["aNgul", "bzaNg", "roNgin", "bhaNga", "baNgali", "raNga", "DaNga", "sng", "soNg", "laNgol", "joNggol", "moNggol", "daNgga", "poNggu", "koNgkal", "oNgk", "shoNgkh", "liNgg", "ring"]
  },
  {
    char: "চ",
    words: ["চোখ", "চশমা", "চাঁদ", "চা", "চাকা", "চুল", "চামচ", "চাদর", "চিল", "চিতাবাঘ", "চর্বি", "চিত্র", "চরিত্র", "চমৎকার", "চামড়া", "চোর", "চৌকি", "চুন", "চড়ুই", "চক্র"],
    phonetics: ["cOkh", "coshoma", "ca^d", "ca", "caka", "cul", "camoc", "cador", "cil", "citabagh", "corbi", "citr", "coritr", "comt`kar", "camoRa", "cOr", "cOUki", "cun", "coRui", "cokr"]
  },
  {
    char: "ছ",
    words: ["ছাতা", "ছবি", "ছাগল", "ছোট", "ছড়া", "ছাদ", "ছাই", "ছিপি", "ছুড়ি", "ছেলে", "ছক্কা", "ছদ্মবেশ", "ছাত্র", "ছায়া", "ছাল", "ছিটকিনি", "ছটফট", "ছিটানো", "ছারপোকা"],
    phonetics: ["chata", "chobi", "chagol", "chOT", "choRa", "chad", "chai", "chipi", "chuRi", "chele", "chokka", "chodmobesh", "chatr", "chaya", "chal", "chiTokini", "choTophoT", "chiTanO", "charopOka"]
  },
  {
    char: "জ",
    words: ["জল", "জাহাজ", "জাল", "জামা", "জীবন", "জুতো", "জবা", "জগৎ", "জন্তু", "জামিন", "জানালা", "জাদু", "জমি", "জমা", "জলপ্রপাত", "জন্ম", "জয়", "জলপাই", "জঙ্গল", "জ্যৈষ্ঠ"],
    phonetics: ["jol", "jahaj", "jal", "jama", "jIbon", "jutO", "joba", "jogt`", "jontu", "jamin", "janala", "jadu", "jomi", "joma", "jolopropat", "jonm", "joy", "jolopai", "joNggol", "jzOIShTh"]
  },
  {
    char: "ঝ",
    words: ["ঝর্ণা", "ঝুড়ি", "ঝড়", "ঝিনুক", "ঝাল", "ঝাড়ু", "ঝিঙে", "ঝিঁঝিঁ", "ঝিলমেল", "ঝালমুড়ি", "ঝোপ", "ঝগড়া", "ঝংকার", "ঝুলা", "ঝিল", "ঝোল", "ঝাপসা", "ঝাঁকুনি"],
    phonetics: ["jhorNa", "jhuRi", "jhoR", "jhinuk", "jhal", "jhaRu", "jhiNge", "jhi^jhi^", "jhilomel", "jhalomuRi", "jhOp", "jhogoRa", "jhngkar", "jhula", "jhil", "jhOl", "jhaposa", "jha^kuni"]
  },
  {
    char: "ঞ",
    words: ["মিঞা", "ভূঞা", "ব্যঞ্জন", "বিজ্ঞান", "চঞ্চল", "লাঞ্ছনা", "অঞ্জন", "কুঞ্জ", "খঞ্জ", "রঞ্জক", "গুঞ্জন", "গঞ্জনা", "পুঞ্জ", "মুঞ্জরী", "আজ্ঞা", "প্রজ্ঞা", "বিজ্ঞ", "সংজ্ঞা"],
    phonetics: ["miNGa", "bhUNGa", "byoNGjon", "bijNGan", "coNGcol", "laNGchona", "oNGjon", "kuNGj", "khoNGj", "roNGjok", "guNGjon", "goNGjona", "puNGj", "muNGjorI", "ajNGa", "projNGa", "bijNG", "sngjNGa"]
  },
  {
    char: "ট",
    words: ["টাকা", "টুপি", "টমেটো", "টেনিস", "টক", "টিয়া", "টব", "টিন", "টুকরো", "টহল", "টর্চ", "টাট্টু", "টেবিল", "টিম", "টোকা", "ট্রাক", "ট্রাম", "টুথপেস্ট", "ট্যাগ", "টাটকা"],
    phonetics: ["Taka", "Tupi", "TomeTO", "Tenis", "Tok", "Tiya", "Tob", "Tin", "TukorO", "Tohol", "Torc", "TaTTu", "Tebil", "Tim", "TOka", "Trak", "Tram", "TuthopesT", "Tzag", "TaToka"]
  },
  {
    char: "ঠ",
    words: ["ঠোঁট", "ঠিক", "ঠিকানা", "ঠান্ডা", "ঠাকুর", "ঠাট্টা", "ঠক", "ঠেলাগাড়ি", "ঠোঙা", "ঠাহর", "ঠাসা", "ঠুকো", "ঠোঁটকাটা", "ঠাওরানো", "ঠুকঠুক", "ঠুনকো", "ঠাট"],
    phonetics: ["ThO^T", "Thik", "Thikana", "ThanDa", "Thakur", "ThaTTa", "Thok", "ThelagaRi", "ThONga", "Thahor", "Thasa", "ThukO", "ThO^TokaTa", "ThaOranO", "ThukoThuk", "ThunokO", "ThaT"]
  },
  {
    char: "ড",
    words: ["ডাব", "ডিম", "ডানা", "ডাকঘর", "ডাল", "ডালিম", "ডাক্তার", "ডালপালা", "ডায়েরি", "ডুবুরি", "ডেকোরেটর", "ডিনামাইট", "ডমরু", "ডোম", "ডাস্টবিন", "ড্রাইভার", "ড্রাম", "ডজন"],
    phonetics: ["Dab", "Dim", "Dana", "Dakoghor", "Dal", "Dalim", "Daktar", "Dalopala", "Dayeri", "Duburi", "DekOreTor", "DinamaiT", "Domoru", "DOm", "DasTobin", "Draibhar", "Dram", "Dojon"]
  },
  {
    char: "ঢ",
    words: ["ঢাক", "ঢোল", "ঢাকা", "ঢেউ", "ঢাল", "ঢ্যাঁড়শ", "ঢিবি", "ঢিলা", "ঢোক", "ঢিল", "ঢং", "ঢাকি", "ঢালু", "ঢিমেতেতালা", "ঢোকা", "ঢেকুর", "ঢেঁকি", "ঢের"],
    phonetics: ["Dhak", "DhOl", "Dhaka", "Dheu", "Dhal", "Dhza^Rosh", "Dhibi", "Dhila", "DhOk", "Dhil", "Dhng", "Dhaki", "Dhalu", "Dhimetetala", "DhOka", "Dhekur", "Dhe^ki", "Dher"]
  },
  {
    char: "ণ",
    words: ["হরিণ", "লবণ", "কারণ", "কিরণ", "পাষাণ", "বীণা", "কণা", "গুণ", "ফণা", "মণি", "বাণিজ্য", "ব্রণ", "পুণ্য", "গণনা", "দণ্ড", "অণু", "ঋণ", "কাণ্ড", "খণ্ড", "পণ্ডিত"],
    phonetics: ["horiN", "loboN", "karoN", "kiroN", "paShaN", "bINa", "koNa", "guN", "phoNa", "moNi", "baNijz", "broN", "puNz", "goNona", "doND", "oNu", "rriN", "kaND", "khoND", "poNDit"]
  },
  {
    char: "ত",
    words: ["তাল", "তারা", "তরমুজ", "তিমি", "তুষার", "তুলো", "তিল", "তীর", "তুমি", "তেল", "তোতা", "তলোয়ার", "তালি", "তামাক", "তরঙ্গ", "তত্ত্ব", "তাপ", "তর্ক", "তামা", "তৈরি"],
    phonetics: ["tal", "tara", "toromuj", "timi", "tuShar", "tulO", "til", "tIr", "tumi", "tel", "tOta", "tolOyar", "tali", "tamak", "toroNgg", "tottb", "tap", "tork", "tama", "tOIri"]
  },
  {
    char: "থ",
    words: ["থালা", "থলি", "থানা", "থোকা", "থাবা", "থুথু", "থিয়েটার", "থার্মোমিটার", "থমথমে", "থিতু", "থমকানো", "থমতত", "থোর", "থইথই", "থকথকে", "থলে", "থাবড়া", "থুতনি"],
    phonetics: ["thala", "tholi", "thana", "thOka", "thaba", "thuthu", "thiyeTar", "tharmOmiTar", "thomothome", "thitu", "thomokanO", "thomotot", "thOr", "thoithoi", "thokothoke", "thole", "thaboRa", "thutoni"]
  },
  {
    char: "দ",
    words: ["দাঁত", "দই", "দরজা", "দিন", "দেশ", "নদী", "দুধ", "দোয়েল", "দল", "দড়ি", "দাদু", "দোকান", "দাগ", "দাম", "দান", "দক্ষিণ", "দুঃখ", "দয়া", "দলিল", "দেওয়াল"],
    phonetics: ["da^t", "doi", "doroja", "din", "desh", "nodI", "dudh", "dOyel", "dol", "doRi", "dadu", "dOkan", "dag", "dam", "dan", "dokShiN", "du:kh", "doya", "dolil", "deOyal"]
  },
  {
    char: "ধ",
    words: ["ধান", "ধুলো", "ধনুক", "ধোঁয়া", "ধ্য্যান", "ধামা", "ধারা", "ধাতু", "ধীর", "ধর্ম", "ধনী", "ধোপামশাই", "ধামাকা", "ধনেপাতা", "ধড়ফড়", "ধীশক্তি", "ধূপদানি", "ধূমকেতু", "ধস", "ধূর্ত"],
    phonetics: ["dhan", "dhulO", "dhonuk", "dhO^ya", "dhzzan", "dhama", "dhara", "dhatu", "dhIr", "dhorm", "dhonI", "dhOpamoshai", "dhamaka", "dhonepata", "dhoRophoR", "dhIshokti", "dhUpodani", "dhUmoketu", "dhos", "dhUrt"]
  },
  {
    char: "ন",
    words: ["নদী", "নৌকা", "নাক", "নীল", "নতুন", "নাম", "নখ", "নারকেল", "নাচ", "নুন", "নিয়ম", "নরম", "নগর", "নথ", "নগদ", "নক্ষত্র", "নাটক", "নালিশ", "নোংরা", "নেতা"],
    phonetics: ["nodI", "nOUka", "nak", "nIl", "notun", "nam", "nokh", "narokel", "nac", "nun", "niyom", "norom", "nogor", "noth", "nogod", "nokShotr", "naTok", "nalish", "nOngra", "neta"]
  },
  {
    char: "প",
    words: ["পাখি", "পাতা", "পানি", "পাহাড়", "পথ", "পদ্ম", "পাখা", "পিঁপড়ে", "পুতুল", "পেঁচা", "পেয়ারা", "পোশাক", "পালক", "প্রদীপ", "পরীক্ষা", "পরিবার", "পাউরুটি", "পৃথিবী", "পরিষ্কার"],
    phonetics: ["pakhi", "pata", "pani", "pahaR", "poth", "podm", "pakha", "pi^poRe", "putul", "pe^ca", "peyara", "pOshak", "palok", "prodIp", "porIkSha", "poribar", "pauruTi", "prrithibI", "poriShkar"]
  },
  {
    char: "ফ",
    words: ["ফুল", "ফল", "ফিতা", "ফড়িং", "ফাগুন", "ফালতু", "ফানুস", "ফেরা", "ফেনা", "ফটো", "ফতুয়া", "ফরমালিন", "ফসল", "ফাল্গুন", "ফাঁদ", "ফিসফিস", "ফাটল", "ফ্রিজ", "ফ্রক"],
    phonetics: ["phul", "phol", "phita", "phoRing", "phagun", "phalotu", "phanus", "phera", "phena", "phoTO", "photuya", "phoromalin", "phosol", "phalgun", "pha^d", "phisophis", "phaTol", "phrij", "phrok"]
  },
  {
    char: "ব",
    words: ["বই", "বাবা", "বাঘ", "বাগান", "বাতাস", "বেগুন", "বিড়াল", "বানর", "বল", "বাসা", "বালতি", "বোতল", "বিদ্যুৎ", "বৃষ্টি", "বিজ্ঞান", "বন্ধু", "বাজার", "বিছানা", "বরফ", "বোতাম"],
    phonetics: ["boi", "baba", "bagh", "bagan", "batas", "begun", "biRal", "banor", "bol", "basa", "baloti", "bOtol", "bidzut`", "brriShTi", "bijNGan", "bondhu", "bajar", "bichana", "boroph", "bOtam"]
  },
  {
    char: "ভ",
    words: ["ভাই", "ভালো", "ভোর", "ভূত", "ভাষা", "ভাত", "ভাল্লুক", "ভেড়া", "ভিমরুল", "ভুবন", "ভাগ্য", "ভাবনা", "ভাজা", "ভাপ", "ভার", "ভারী", "ভাড়া", "ভস্ম", "ভীতি", "ভুল"],
    phonetics: ["bhai", "bhalO", "bhOr", "bhUt", "bhaSha", "bhat", "bhalluk", "bheRa", "bhimorul", "bhubon", "bhagz", "bhabona", "bhaja", "bhap", "bhar", "bharI", "bhaRa", "bhosm", "bhIti", "bhul"]
  },
  {
    char: "ম",
    words: ["মা", "মাছ", "মই", "মিষ্টি", "মানুষ", "মেঘ", "ময়ূর", "মষা", "মাছি", "মাদুর", "মালা", "মোমবাতি", "মুখ", "মাটি", "মন্দির", "মসজিদ", "মোটর", "মগজ", "ম্যাপ", "মুদ্রা"],
    phonetics: ["ma", "mach", "moi", "miShTi", "manuSh", "megh", "moyUr", "moSha", "machi", "madur", "mala", "mOmobati", "mukh", "maTi", "mondir", "mosojid", "mOTor", "mogoj", "mzap", "mudra"]
  },
  {
    char: "য",
    words: ["যুবক", "যোগ", "যত্ন", "যাতো", "যাত্রা", "যুদ্ধ", "যমুনা", "যম", "যষ্টি", "যকৃৎ", "যমজ", "যন্ত্র", "যজ্ঞ", "যত্রতত্র", "যখন", "যদি", "যশ", "যাতায়াত", "যানবাহন"],
    phonetics: ["zubok", "zOg", "zotn", "zatO", "zatra", "zuddh", "zomuna", "zom", "zoShTi", "zokrrit`", "zomoj", "zontr", "zojNG", "zotrototr", "zokhon", "zodi", "zosh", "zatayat", "zanobahon"]
  },
  {
    char: "র",
    words: ["রাজা", "রাত", "রং", "রোদ", "রূপ", "রেল", "রুটি", "রসুন", "রাস্তা", "রানি", "রাখি", "রক্ত", "রবার", "রকেট", "রোদচশমা", "রেডিও", "রূপা", "রেশম", "রহস্য", "রসদ"],
    phonetics: ["raja", "rat", "rng", "rOd", "rUp", "rel", "ruTi", "rosun", "rasta", "rani", "rakhi", "rokt", "robar", "rokeT", "rOdocoshoma", "reDiO", "rUpa", "reshom", "rohosz", "rosod"]
  },
  {
    char: "ল",
    words: ["লাল", "লাটিম", "লতা", "লবণ", "লোহা", "লেবু", "লেপ", "লাউ", "লঙ্কা", "লম্বা", "লাঠি", "লোক", "লটারি", "লক্ষ্মী", "লক্ষ্য", "লিচু", "লেজ", "লবঙ্গ", "ল্যাপটপ", "লাইন"],
    phonetics: ["lal", "laTim", "lota", "loboN", "lOha", "lebu", "lep", "lau", "loNgka", "lomba", "laThi", "lOk", "loTari", "lokShmI", "lokShz", "licu", "lej", "loboNgg", "lzapoTop", "lain"]
  },
  {
    char: "শ",
    words: ["শাপলা", "শিয়াল", "শীত", "শসা", "শান্তি", "শরীর", "শহর", "শত্রু", "শব্দ", "শঙ্খ", "শনি", "শাখা", "শামুক", "শালগম", "শার্ট", "শিক্ষক", "শিশু", "শেষ"],
    phonetics: ["shapola", "shiyal", "shIt", "shosa", "shanti", "shorIr", "shohor", "shotru", "shobd", "shoNgkh", "shoni", "shakha", "shamuk", "shalogom", "sharT", "shikShok", "shishu", "sheSh"]
  },
  {
    char: "ষ",
    words: ["ষাঁড়", "ষড়ঋতু", "আষাঢ়", "পাষাণ", "ষোল", "চাষী", "মহিষ", "বিষ", "শেষ", "বৃষ", "মানুষ", "চোষক", "ষণ্ড", "ষান্মাসিক", "বিশেষণ", "বিশেষ্য", "ষড়যন্ত্র", "ষষ্ঠী"],
    phonetics: ["Sha^R", "ShoRorritu", "aShaRh", "paShaN", "ShOl", "caShI", "mohiSh", "biSh", "sheSh", "brriSh", "manuSh", "cOShok", "ShoND", "Shanmasik", "bisheShoN", "bisheShz", "ShoRozontr", "ShoShThI"]
  },
  {
    char: "স",
    words: ["সাদা", "সাগর", "সাপ", "সকাল", "সূর্য", "সবুজ", "সিংহ", "সিঁড়ি", "সুতো", "সর্ষে", "সিনেমা", "সময়", "সত্য", "সুন্দর", "সাহস", "সাবান", "সুড়ঙ্গ", "সেতু", "সোনা", "সাইকেল"],
    phonetics: ["sada", "sagor", "sap", "sokal", "sUrz", "sobuj", "singh", "si^Ri", "sutO", "sorShe", "sinema", "somoy", "sotz", "sundor", "sahos", "saban", "suRoNgg", "setu", "sOna", "saikel"]
  },
  {
    char: "হ",
    words: ["হাত", "হাতি", "হাঁস", "হলুদ", "হাসি", "হরিণ", "হ্রদ", "হাতুড়ি", "হাঁড়ি", "হাওয়া", "হিসাব", "হীরা", "হোটেল", "হাড়", "হিংসা", "হৃদয়", "হেমন্ত", "হোলি", "হুল্লোড়"],
    phonetics: ["hat", "hati", "ha^s", "holud", "hasi", "horiN", "hrod", "hatuRi", "ha^Ri", "haOya", "hisab", "hIra", "hOTel", "haR", "hingsa", "hrridoy", "hemont", "hOli", "hullOR"]
  },
  {
    char: "ড়",
    words: ["পাহাড়", "ঘড়ি", "বাড়ি", "শাড়ি", "কড়া", "জড়া", "ভেড়া", "চড়ুই", "বড়", "ঝুড়ি", "পোড়া", "হাঁড়ি", "দাড়ি", "গুড়", "মুড়ি", "খড়", "গাড়ি", "চড়"],
    phonetics: ["pahaR", "ghoRi", "baRi", "shaRi", "koRa", "joRa", "bheRa", "coRui", "boR", "jhuRi", "pORa", "ha^Ri", "daRi", "guR", "muRi", "khoR", "gaRi", "coR"]
  },
  {
    char: "ঢ়",
    words: ["আষাঢ়", "গাঢ়", "মূঢ়", "দৃঢ়", "রূঢ়", "প্রৌঢ়", "মূঢ়তা", "দৃঢ়তা", "গাঢ়ত্ব", "রূঢ়তা", "প্রৌঢ়ত্ব", "সুদৃঢ়", "আলীঢ়", "মূঢ়চেতা"],
    phonetics: ["aShaRh", "gaRh", "mURh", "drriRh", "rURh", "prOURh", "mURhota", "drriRhota", "gaRhotb", "rURhota", "prOURhotb", "sudrriRh", "alIRh", "mURhoceta"]
  },
  {
    char: "য়",
    words: ["আয়না", "ময়ূর", "গয়না", "সময়", "বয়স", "দয়া", "ছায়া", "কায়া", "নায়িকা", "গায়ক", "বায়ু", "পায়রা", "শিয়াল", "পিয়ানো", "বিদায়", "বিদ্যালয়", "বিষয়", "জয়", "ভয়"],
    phonetics: ["ayona", "moyUr", "goyona", "somoy", "boyos", "doya", "chaya", "kaya", "nayika", "gayok", "bayu", "payora", "shiyal", "piyanO", "biday", "bidzaloy", "biShoy", "joy", "bhoy"]
  },
  {
    char: "ৎ",
    words: ["হঠাৎ", "শরৎ", "বিদ্যুৎ", "মহৎ", "ভবিষ্যৎ", "জগৎ", "সপাৎ", "চিৎকার", "উৎপাত", "উৎসব", "চমৎকার", "উৎপল", "আত্মসাৎ", "আত্মোৎসর্গ", "অসৎ", "কদাচিৎ", "কিঞ্চিৎ", "যকৃৎ"],
    phonetics: ["hoThat`", "short`", "bidzut`", "mohot`", "bhobiShzt`", "jogt`", "sopat`", "cit`kar", "ut`pat", "ut`sob", "comt`kar", "ut`pol", "atmosat`", "atmOt`sorg", "ost`", "kodacit`", "kiNGcit`", "zokrrit`"]
  },
  {
    char: "ং",
    words: ["রং", "শিং", "বাংলা", "সুতরাং", "ফড়িং", "সিংহ", "মাংস", "অংশ", "বংশ", "ধ্বংস", "হিংসা", "আংটি", "সংসার", "সংক্ষেপ", "কংস", "ধ্বংসাবশেষ", "ঢং", "সং", "বংশী", "সংহার"],
    phonetics: ["rng", "shing", "bangla", "sutorang", "phoRing", "singh", "mangs", "ongsh", "bngsh", "dhbngs", "hingsa", "angTi", "sngsar", "sngkShep", "kngs", "dhbngsabosheSh", "Dhng", "sng", "bngshI", "snghar"]
  },
  {
    char: "ঃ",
    words: ["দুঃখ", "প্রাতঃকাল", "দুঃসাহস", "স্বতঃস্ফূর্ত", "নিঃশ্বাস", "দুঃসময়", "দুঃখিত", "নিঃশব্দ", "দুঃস্থ", "অন্তঃপুর", "স্বতঃসিদ্ধ", "পুনঃপুন", "দুঃস্বপ্ন", "নিঃস্ব", "মনঃকষ্ট", "ফলতঃ", "অন্তঃকরণ", "প্রাতঃভ্রমণ", "নিঃসঙ্গ"],
    phonetics: ["du:kh", "prat:kal", "du:sahos", "sbot:sphUrt", "ni:shbas", "du:somoy", "du:khit", "ni:shobd", "du:sth", "ont:pur", "sbot:siddh", "pun:pun", "du:sbopn", "ni:sb", "mon:koShT", "pholot:", "ont:koroN", "prat:bhromoN", "ni:soNgg"]
  },
  {
    char: "ঁ",
    words: ["চাঁদ", "বাঁশ", "দাঁত", "পাঁচ", "হাঁস", "কাঁঠাল", "ইঁদুর", "ধোঁয়া", "পেঁচা", "কুঁড়ি", "খাঁচা", "গুঁড়ো", "কাঁচ", "ফাঁদ", "ঝাঁঝ", "গাঁদা", "সাঁজ", "রাঁধুনী", "গোঁফ"],
    phonetics: ["ca^d", "ba^sh", "da^t", "pa^c", "ha^s", "ka^Thal", "i^dur", "dhO^ya", "pe^ca", "ku^Ri", "kha^ca", "gu^RO", "ka^c", "pha^d", "jha^jh", "ga^da", "sa^j", "ra^dhunI", "gO^ph"]
  }
];

export function makeLessonFromAlphabet(group: AlphabetGroup, type: "vowel" | "consonant"): Lesson {
  return {
    id: `alphabet_${type}_${group.char}`,
    title: `বর্ণ অনুশীলন: '${group.char}'`,
    description: `'${group.char}' দিয়ে গঠিত শব্দসমূহের টাইপিং প্র্যাক্টিস।`,
    difficulty: "custom",
    content: group.words.join(" "),
    expectedPhonetic: group.phonetics.join(" ")
  };
}
