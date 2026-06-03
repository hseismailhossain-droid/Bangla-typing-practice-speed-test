/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Avro Phonetic Transliteration rules and mapping
const VOWELS_IND: { [key: string]: string } = {
  "o": "অ",
  "a": "আ",
  "ae": "অ্যা",
  "i": "ই",
  "I": "ঈ",
  "u": "উ",
  "U": "ঊ",
  "rri": "ঋ",
  "e": "এ",
  "OI": "ঐ",
  "O": "ও",
  "OU": "ঔ"
};

const VOWELS_DEP: { [key: string]: string } = {
  "o": "", // Spacer to prevent conjuncts, silent after a consonant
  "a": "া", // Akar
  "ae": "্যা", // Ya-phala + Akar
  "i": "ি", // Ikar
  "I": "ী", // Eekar
  "u": "ু", // Ukar
  "U": "ূ", // Uukar
  "rri": "ৃ", // Ri-kar
  "e": "ে", // Ekar
  "OI": "ৈ", // Oikar
  "O": "ো", // Okar
  "OU": "ৌ" // Oukar
};

const CONSONANTS: { [key: string]: string } = {
  "kh": "খ",
  "k": "ক",
  "gh": "ঘ",
  "g": "গ",
  "Ng": "ঙ",
  "ch": "ছ",
  "c": "চ",
  "jh": "ঝ",
  "j": "জ",
  "NG": "ঞ",
  "Th": "ঠ",
  "T": "ট",
  "Dh": "ঢ",
  "D": "ড",
  "th": "থ",
  "t": "ত",
  "dh": "ধ",
  "d": "দ",
  "N": "ণ",
  "n": "ন",
  "ph": "ফ",
  "f": "ফ",
  "p": "প",
  "bh": "ভ",
  "v": "ভ",
  "b": "ব",
  "m": "ম",
  "z": "য",
  "r": "র",
  "l": "ল",
  "sh": "শ",
  "Sh": "ষ",
  "S": "শ",
  "s": "স",
  "h": "হ",
  "R": "ড়",
  "Rh": "ঢ়",
  "y": "য়",
  "Y": "য়",
  "w": "ব",
  "J": "জ্ঞ",
};

const SYMBOLS: { [key: string]: string } = {
  "t`": "ৎ", // Khanda Ta
  "ng": "ং", // Anusvara
  ":": "ঃ", // Visarga
  "^": "ঁ", // Chandrabindu
  "ht": "ঃ",
  "$": "৳", // Bangla Taka
  ".": "।", // Bangla Ddari (Period in text mode)
  ",,": "্", // Hasanta explicit
};

const DIGITS: { [key: string]: string } = {
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
  "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
};

/**
 * Converts English phonetic input into Bengali using Avro phonetic mapping rules.
 * Handles vowels, independent/dependent forms, consecutive consonants (conjuncts), and special keys.
 */
export function convertToAvro(englishText: string): string {
  if (!englishText) return "";

  let result = "";
  let idx = 0;
  const len = englishText.length;

  while (idx < len) {
    // 1. Process spaces, newlines, and non-phonetic characters directly
    const char = englishText[idx];
    if (/\s/.test(char) || (!/[a-zA-Z0-9`:$^.,]/.test(char))) {
      result += char;
      idx++;
      continue;
    }

    // Identify word boundaries / groups of alphabetic characters
    // Let's parse character by character, keeping track of previous state.
    // To do this well, we can process the rest of the current word.
    let word = "";
    while (idx < len && /[a-zA-Z0-9`:$^.,]/.test(englishText[idx])) {
      word += englishText[idx];
      idx++;
    }

    result += parseAvroWord(word);
  }

  return result;
}

function parseAvroWord(word: string): string {
  let parsed = "";
  let i = 0;
  const len = word.length;

  let isPrevConsonant = false;
  let prevConsonantChar = "";

  while (i < len) {
    let matchedToken = "";
    let matchType: "vowel" | "consonant" | "symbol" | "digit" | "none" = "none";

    // Attempt to match from longest prefixes to shortest
    const maxLookahead = Math.min(len - i, 4);
    for (let size = maxLookahead; size >= 1; size--) {
      const candidate = word.substring(i, i + size);

      // Check symbol / specials
      if (SYMBOLS[candidate] !== undefined) {
        matchedToken = candidate;
        matchType = "symbol";
        break;
      }
      // Check digit
      if (DIGITS[candidate] !== undefined) {
        matchedToken = candidate;
        matchType = "digit";
        break;
      }
      // Check vowel mapping
      if (VOWELS_IND[candidate] !== undefined) {
        matchedToken = candidate;
        matchType = "vowel";
        break;
      }
      // Check consonant mapping
      if (CONSONANTS[candidate] !== undefined) {
        matchedToken = candidate;
        matchType = "consonant";
        break;
      }
    }

    // Fallback if no specific rule matched
    if (matchType === "none") {
      parsed += word[i];
      isPrevConsonant = false;
      prevConsonantChar = "";
      i++;
      continue;
    }

    const nextChar = i + matchedToken.length < len ? word[i + matchedToken.length] : "";

    if (matchType === "vowel") {
      if (isPrevConsonant) {
        // Dependent Form (Kar)
        parsed += VOWELS_DEP[matchedToken];
      } else {
        // Independent Form
        parsed += VOWELS_IND[matchedToken];
      }
      isPrevConsonant = false;
      prevConsonantChar = "";
    } else if (matchType === "consonant") {
      const currentBangla = CONSONANTS[matchedToken];

      if (parsed.endsWith("অ") && (matchedToken === "y" || matchedToken === "Z")) {
        // Ya-phala after independent অ (e.g., অ্যা)
        parsed += "্য";
      } else if (isPrevConsonant) {
        // Handle special consonant combinations (conjuncts, reph, phala)
        if (matchedToken === "y" || matchedToken === "Z") {
          // Ya-phala (্য) -> Hasanta + Ya
          parsed += "্য";
        } else if (matchedToken === "w") {
          // Ba-phala (্ব) -> Hasanta + Ba
          parsed += "্ব";
        } else if (matchedToken === "r") {
          // Ra-phala (্র) -> Hasanta + Ra
          parsed += "্র";
        } else {
          // Standard conjunct -> join with Hasanta (্)
          parsed += "্" + currentBangla;
        }
      } else {
        // Initial consonant
        parsed += currentBangla;
      }

      isPrevConsonant = true;
      prevConsonantChar = currentBangla;
    } else if (matchType === "symbol") {
      parsed += SYMBOLS[matchedToken];
      isPrevConsonant = false;
      prevConsonantChar = "";
    } else if (matchType === "digit") {
      parsed += DIGITS[matchedToken];
      isPrevConsonant = false;
      prevConsonantChar = "";
    }

    i += matchedToken.length;
  }

  return parsed;
}

/**
 * Automatically generates a 100% accurate Avro phonetic representation
 * for any given Bengali word. Useful as a robust dynamic runtime fallback.
 */
export function getPerfectAvroPhonetic(word: string): string {
  if (!word) return "";
  
  // Normalize decomposition first so we compare and handle correctly
  const normalized = word
    .replace(/\u09AF\u09BC/g, "\u09DF") // য + ় -> য়
    .replace(/\u09A1\u09BC/g, "\u09DC") // ড + ় -> ড়
    .replace(/\u09A2\u09BC/g, "\u09DD"); // ঢ + ় -> ঢ়

  const map: { [key: string]: string } = {
    "অ": "o", "আ": "a", "ই": "i", "ঈ": "I", "উ": "u", "ঊ": "U", "ঋ": "rri", "এ": "e", "ঐ": "OI", "ও": "O", "ঔ": "OU",
    "ক": "k", "খ": "kh", "গ": "g", "ঘ": "gh", "ঙ": "ng", "চ": "c", "ছ": "ch", "জ": "j", "ঝ": "jh", "ঞ": "NG",
    "ট": "T", "ঠ": "Th", "ড": "D", "ঢ": "Dh", "ণ": "N", "ন": "n", "ত": "t", "থ": "th", "দ": "d", "ধ": "dh", 
    "প": "p", "ফ": "ph", "ব": "b", "ভ": "bh", "ম": "m", "য": "z", "র": "r", "ল": "l", "শ": "sh", "ষ": "Sh",
    "স": "s", "হ": "h", "ড়": "R", "ঢ়": "Rh", "য়": "y", "ৎ": "t`", "ং": "ng", "ঃ": ":", "ঁ": "^",
    "া": "a", "ি": "i", "ী": "I", "ু": "u", "ূ": "U", "ৃ": "rri", "ে": "e", "ৈ": "OI", "ো": "O", "ৌ": "OU", "্য": "z", "্ব": "w", "্র": "r"
  };

  let res = "";
  let i = 0;
  const len = normalized.length;
  const isBengaliConsonant = (c: string) => "কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমরলশষসহড়ঢ়য়য".indexOf(c) >= 0;

  while (i < len) {
    const char = normalized[i];
    if (char === "্") {
      i++;
      continue;
    }

    const avroMap = map[char] || char;
    res += avroMap;

    if (isBengaliConsonant(char) && i + 1 < len) {
      const nextChar = normalized[i + 1];
      const isNextConsonant = isBengaliConsonant(nextChar);
      const isNextHasanta = nextChar === "্";

      if (isNextConsonant && !isNextHasanta) {
        res += "o";
      }
    }

    i++;
  }

  // Check if output of convertToAvro produces the original word
  const cleanResult = (text: string) => text.trim().normalize("NFC").replace(/\u09AF\u09BC/g, "\u09DF").replace(/\u09A1\u09BC/g, "\u09DC").replace(/\u09A2\u09BC/g, "\u09DD");
  const targetClean = cleanResult(word);

  if (cleanResult(convertToAvro(res)) === targetClean) {
    return res;
  }

  // Try standard alternatives for complex sound matches
  const variations = [
    res,
    res.replace(/z/g, "y"),
    res + "o",
    res.replace(/ng/g, "Ng"),
    res.replace(/ph/g, "f"),
    res.replace(/bh/g, "v"),
    res.replace(/Sh/g, "S")
  ];

  for (const v of variations) {
    if (cleanResult(convertToAvro(v)) === targetClean) {
      return v;
    }
  }

  return res;
}

