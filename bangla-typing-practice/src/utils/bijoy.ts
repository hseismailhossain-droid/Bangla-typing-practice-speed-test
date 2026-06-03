/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Bijoy Keyboard Layout characters mapping
const BIJOY_KEYS: { [key: string]: string } = {
  "a": "ৃ",
  "b": "ন",
  "c": "ে",
  "d": "ি",
  "e": "ড",
  "f": "া",
  "g": "্", // Hasanta
  "h": "ব",
  "i": "হ",
  "j": "ক",
  "k": "ত",
  "l": "দ",
  "m": "ম",
  "n": "স",
  "o": "গ",
  "p": "ড়",
  "q": "ঙ",
  "r": "প",
  "s": "ু",
  "t": "ট",
  "u": "জ",
  "v": "র",
  "w": "য",
  "x": "ও",
  "y": "চ",
  "z": "্র", // Ra-phala

  // Uppercase / Shift keys
  "A": "র্", // Reph
  "B": "ণ",
  "C": "ৈ",
  "D": "ী",
  "E": "ঢ",
  "F": "অ",
  "G": "।", // Ddari (Bangla full stop)
  "H": "ভ",
  "I": "ঞ",
  "J": "খ",
  "K": "থ",
  "L": "ধ",
  "M": "শ",
  "N": "ষ", // ষ
  "O": "ঘ",
  "P": "ঢ়",
  "Q": "ং",
  "R": "ফ",
  "S": "ূ",
  "T": "ঠ",
  "U": "ঝ",
  "V": "ল",
  "W": "য়",
  "X": "ৌ",
  "Y": "ছ",
  "Z": "্য", // Ya-phala
  "\\": "ৎ", // Khanda-Ta
  "&": "ঁ", // Chandrabindu
  ":": "ঃ", // Visarga
};

// Independent vowels formed when Hasanta (g) precedes a vowel modifier
const INDEPENDENT_VOWELS: { [key: string]: string } = {
  "f": "আ", // g + f (akar)
  "d": "ই", // g + d (ikar)
  "D": "ঈ", // g + D (eekar)
  "s": "উ", // g + s (ukar)
  "S": "ঊ", // g + S (uukar)
  "a": "ঋ", // g + a (ri-kar)
  "c": "এ", // g + c (ekar)
  "C": "ঐ", // g + C (oikar)
  "X": "ঔ", // g + X (oukar)
};

// Vowel signs that are typed BEFORE the consonant cluster in Bijoy layout
// but must reside AFTER the cluster in standard Unicode.
const PRECURSOR_KARS = new Set(["ে", "ি", "ৈ"]);

export function normalizeBengali(text: string): string {
  if (!text) return "";
  return text
    .replace(/\u09AF\u09BC/g, "\u09DF") // য + ় -> য়
    .replace(/\u09A1\u09BC/g, "\u09DC") // ড + ় -> ড়
    .replace(/\u09A2\u09BC/g, "\u09DD"); // ঢ + ় -> ঢ়
}

/**
 * Converts English keystroke inputs to Bengali using Bijoy layout transliteration.
 */
export function convertToBijoy(englishText: string): string {
  if (!englishText) return "";

  let result = "";
  let idx = 0;
  const len = englishText.length;

  while (idx < len) {
    const char = englishText[idx];

    // Process space, newline, or non-Bijoy key character directly
    if (/\s/.test(char) || !/[a-zA-Z`:\\$.,!@#%^&*()_+=/-]/.test(char)) {
      result += char;
      idx++;
      continue;
    }

    // Group text into words/tokens of standard keystrokes
    let word = "";
    while (idx < len && /[a-zA-Z`:\\$.,!@#%^&*()_+=/-]/.test(englishText[idx])) {
      word += englishText[idx];
      idx++;
    }

    result += parseBijoyWord(word);
  }

  return normalizeBengali(result);
}

function getConsonantCluster(chars: string[], startIdx: number): string[] {
  const clusterChars: string[] = [];
  let k = startIdx;
  const charsLen = chars.length;

  if (k < charsLen && isConsonant(chars[k])) {
    clusterChars.push(chars[k]);
    k++;

    // Engulf Hasanta + Consonant pairs
    while (k < charsLen) {
      if (chars[k] === "্" && k + 1 < charsLen && isConsonant(chars[k + 1])) {
        clusterChars.push("্", chars[k + 1]);
        k += 2;
      } else {
        break;
      }
    }

    // Engulf optional phala
    if (k < charsLen && (chars[k] === "্র" || chars[k] === "্য" || chars[k] === "্ব")) {
      clusterChars.push(chars[k]);
      k++;
    }
  }

  return clusterChars;
}

function parseBijoyWord(word: string): string {
  const chars: string[] = [];
  let i = 0;
  const len = word.length;

  while (i < len) {
    // 1. Identify independent vowels typed as g (hasanta) + kar
    if (word[i] === "g" && i + 1 < len && INDEPENDENT_VOWELS[word[i + 1]] !== undefined) {
      chars.push(INDEPENDENT_VOWELS[word[i + 1]]);
      i += 2;
      continue;
    }

    // 2. Map standard key
    const rawKey = word[i];
    let mapped = BIJOY_KEYS[rawKey] || rawKey;

    chars.push(mapped);
    i++;
  }

  // 3. Process the raw sequence of characters according to Bijoy grammar:
  // - Reorder precursors (ে, ি, ৈ) which are typed BEFORE their consonant cluster
  // - Convert (ে + consonant_cluster + া) into (consonant_cluster + ো)
  // - Convert (ে + consonant_cluster + ৌ) into (consonant_cluster + ৌ)
  // - Position Reph (র্) before the matching consonant cluster
  const processed: string[] = [];
  let j = 0;
  const charsLen = chars.length;

  while (j < charsLen) {
    const current = chars[j];

    // Check if it is a precursor kar
    if (PRECURSOR_KARS.has(current)) {
      // Find the following consonant cluster to slide this kar after
      const clusterChars = getConsonantCluster(chars, j + 1);
      let clusterEnd = j + 1 + clusterChars.length;

      if (clusterChars.length > 0) {
        // We found a consonant cluster!
        // Check if there is an ending modifier like 'া' (akar) or 'ৗ' (oukar modifier)
        // following the cluster, which combined with precursor 'ে' (ekar) makes 'ো' or 'ৌ'
        let hasEndingAkar = false;
        let hasEndingOucarModifier = false;

        if (clusterEnd < charsLen) {
          const endingChar = chars[clusterEnd];
          if (endingChar === "া" && current === "ে") {
            hasEndingAkar = true;
            clusterEnd++; // consume the 'া' modifier
          } else if (endingChar === "ৌ" && current === "ে") {
            hasEndingOucarModifier = true;
            clusterEnd++; // consume the 'ৌ' modifier
          }
        }

        // Output current consonant cluster
        processed.push(...clusterChars);

        // Output correct vowel sign
        if (hasEndingAkar) {
          processed.push("ো");
        } else if (hasEndingOucarModifier) {
          processed.push("ৌ");
        } else {
          processed.push(current);
        }

        j = clusterEnd;
      } else {
        // Precursor typed alone without subsequent consonant, output as is
        processed.push(current);
        j++;
      }
    } else if (isConsonant(current)) {
      // It is a starting consonant, find its cluster
      const clusterChars = getConsonantCluster(chars, j);
      let clusterEnd = j + clusterChars.length;

      // Check if a Reph (র্) immediately succeeds this consonant cluster
      let hasReph = false;
      if (clusterEnd < charsLen && chars[clusterEnd] === "র্") {
        hasReph = true;
        clusterEnd++;
      }

      if (hasReph) {
        // Prepended Reph in unicode (র + ্ + cluster)
        processed.push("র", "্", ...clusterChars);
      } else {
        processed.push(...clusterChars);
      }

      j = clusterEnd;
    } else {
      // Miscellaneous / Vowels / Symbols
      processed.push(current);
      j++;
    }
  }

  return processed.join("");
}

// Check if Bengali character is a consonant
function isConsonant(char: string): boolean {
  if (!char) return false;
  const consonants = "কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমরলশষসহড়ঢ়য়";
  return consonants.indexOf(char) >= 0;
}

// Reverse mapping for translating Bengali characters back to Bijoy physical keys
const REVERSE_BIJOY_KEYS: { [key: string]: string } = {
  // Consonants
  "ক": "j", "খ": "J", "গ": "o", "ঘ": "O", "ঙ": "q",
  "চ": "y", "ছ": "Y", "জ": "u", "ঝ": "U", "ঞ": "I",
  "ট": "t", "ঠ": "T", "ড": "e", "ঢ": "E", "ণ": "B",
  "ত": "k", "থ": "K", "দ": "l", "ধ": "L", "ন": "b",
  "প": "r", "ফ": "R", "ব": "h", "ভ": "H", "ম": "m",
  "য": "w", "র": "v", "ল": "V", "শ": "M", "ষ": "N",
  "স": "n", "হ": "i", "ড়": "p", "ঢ়": "P", "য়": "W",
  "ৎ": "\\", "ং": "Q", "ঃ": ":", "ঁ": "&", "্": "g",
  "।": "G", // Bangla full stop

  // Independent Vowels
  "অ": "F",
  "আ": "gf",
  "ই": "gd",
  "ঈ": "gD",
  "উ": "gs",
  "ঊ": "gS",
  "ঋ": "ga",
  "এ": "gc",
  "ঐ": "gC",
  "ও": "x",
  "ঔ": "gX",

  // Vowel Signs
  "া": "f",
  "ি": "d",
  "ী": "D",
  "ু": "s",
  "ূ": "S",
  "ৃ": "a",
  "ে": "c",
  "ৈ": "C",
  "ো": "cf", // ekar + akar
  "ৌ": "cX", // ekar + oukar-modifier
  
  // Phalas
  "্র": "z", // Ra-phala
  "্য": "Z", // Ya-phala
  
  // Numbers
  "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5",
  "৬": "6", "৭": "7", "৮": "8", "৯": "9", "০": "0",
};

/**
 * Returns the exact Bijoy English keystrokes sequence required to type the target Bengali text.
 */
export function getBijoyKeystrokes(bengaliText: string): string {
  if (!bengaliText) return "";
  bengaliText = normalizeBengali(bengaliText);

  let result = "";
  let i = 0;
  const len = bengaliText.length;

  const INDEPENDENT_VOWELS_SET = new Set(["অ", "আ", "ই", "ঈ", "উ", "ঊ", "ঋ", "এ", "ঐ", "ও", "ঔ"]);
  const KARS_SET = new Set(["া", "ি", "ী", "ু", "ূ", "ৃ", "ে", "ৈ", "ো", "ৌ"]);

  while (i < len) {
    const char = bengaliText[i];

    if (/\s/.test(char)) {
      result += char;
      i++;
      continue;
    }

    if (INDEPENDENT_VOWELS_SET.has(char)) {
      result += REVERSE_BIJOY_KEYS[char] || char;
      i++;
      continue;
    }

    if (isConsonant(char)) {
      let hasReph = false;
      if (char === "র" && i + 1 < len && bengaliText[i + 1] === "্" && i + 2 < len && isConsonant(bengaliText[i + 2])) {
        hasReph = true;
        i += 2;
      }

      const clusterParts: string[] = [];
      if (i < len && isConsonant(bengaliText[i])) {
        clusterParts.push(bengaliText[i]);
        i++;
      }

      while (i < len) {
        if (bengaliText[i] === "্" && i + 1 < len && isConsonant(bengaliText[i + 1])) {
          clusterParts.push("্");
          clusterParts.push(bengaliText[i + 1]);
          i += 2;
        } else {
          break;
        }
      }

      let phalaKey = "";
      if (i < len && (bengaliText[i] === "্র" || bengaliText[i] === "্য" || bengaliText[i] === "্ব")) {
        const phala = bengaliText[i];
        if (phala === "্র") phalaKey = "z";
        else if (phala === "্য") phalaKey = "Z";
        else if (phala === "্ব") phalaKey = "gh";
        i++;
      }

      let kar = "";
      if (i < len && KARS_SET.has(bengaliText[i])) {
        kar = bengaliText[i];
        i++;
      }

      const clusterKeys = clusterParts.map(c => REVERSE_BIJOY_KEYS[c] || c).join("");
      const segmentWithPhalaAndReph = clusterKeys + phalaKey + (hasReph ? "A" : "");

      if (kar === "ো") {
        result += "c" + segmentWithPhalaAndReph + "f";
      } else if (kar === "ৌ") {
        result += "c" + segmentWithPhalaAndReph + "X";
      } else if (kar === "ে") {
        result += "c" + segmentWithPhalaAndReph;
      } else if (kar === "ৈ") {
        result += "C" + segmentWithPhalaAndReph;
      } else if (kar === "ি") {
        result += "d" + segmentWithPhalaAndReph;
      } else if (kar) {
        result += segmentWithPhalaAndReph + (REVERSE_BIJOY_KEYS[kar] || "");
      } else {
        result += segmentWithPhalaAndReph;
      }
      continue;
    }

    result += REVERSE_BIJOY_KEYS[char] || char;
    i++;
  }

  return result;
}
