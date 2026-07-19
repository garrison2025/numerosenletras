/**
 * Spanish number to words converter.
 * Converts numbers into proper Spanish text with precise grammar rules.
 */

const UNITS = ["", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const UNITS_MASCULINE = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const UNITS_FEMININE = ["", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];

const TENS_10_19 = [
  "diez", "once", "doce", "trece", "catorce", "quince", 
  "dieciséis", "diecisiete", "diecho", "diecinueve"
];

// Correct orthography for 10-19
const TENS_10_19_CORRECT = [
  "diez", "once", "doce", "trece", "catorce", "quince", 
  "dieciséis", "diecisiete", "dieciocho", "diecinueve"
];

const TENS_20_29 = [
  "veinte", "veintiún", "veintidós", "veintitrés", "veinticuatro", 
  "veinticinco", "veintiséis", "veintidos", "veintiocho", "veintinueve"
];

const TENS_20_29_MASCULINE = [
  "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", 
  "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"
];

const TENS_20_29_FEMININE = [
  "veinte", "veintiuna", "veintidós", "veintitrés", "veinticuatro", 
  "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"
];

const TENS_30_90 = [
  "", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"
];

const HUNDREDS = [
  "", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos", 
  "seiscientos", "setecientos", "ochocientos", "novecientos"
];

const HUNDREDS_FEMININE = [
  "", "cien", "doscentas", "trescientas", "cuatrocientas", "quinientas", 
  "seiscientas", "setecientas", "ochocientas", "novecientas"
];

// Correct feminine spelling for hundreds
const HUNDREDS_FEMININE_CORRECT = [
  "", "cien", "doscientas", "trescientas", "cuatrocientas", "quinientas", 
  "seiscientas", "setecientas", "ochocientas", "novecientas"
];

/**
 * Helper to convert a three-digit group (0-999) to words.
 */
function convertGroupOfThree(num: number, gender: 'M' | 'F' | 'N'): string {
  if (num === 0) return "";

  let words = "";
  const h = Math.floor(num / 100);
  const t = Math.floor((num % 100) / 10);
  const u = num % 10;

  // Hundreds
  if (h > 0) {
    if (h === 1 && (t > 0 || u > 0)) {
      words += "ciento ";
    } else {
      if (gender === 'F') {
        words += HUNDREDS_FEMININE_CORRECT[h] + " ";
      } else {
        words += HUNDREDS[h] + " ";
      }
    }
  }

  // Tens and Units
  const remainder = num % 100;
  if (remainder > 0) {
    if (remainder < 10) {
      if (gender === 'M') {
        words += UNITS_MASCULINE[remainder];
      } else if (gender === 'F') {
        words += UNITS_FEMININE[remainder];
      } else { // Neutral/Adjective (e.g. before "mil" or in standard counting)
        words += UNITS[remainder];
      }
    } else if (remainder >= 10 && remainder < 20) {
      words += TENS_10_19_CORRECT[remainder - 10];
    } else if (remainder >= 20 && remainder < 30) {
      if (remainder === 21) {
        if (gender === 'M') words += TENS_20_29_MASCULINE[1];
        else if (gender === 'F') words += TENS_20_29_FEMININE[1];
        else words += "veintiún";
      } else {
        words += TENS_20_29_MASCULINE[remainder - 20];
      }
    } else { // 30-99
      words += TENS_30_90[t];
      if (u > 0) {
        let unitStr = "";
        if (gender === 'M') unitStr = UNITS_MASCULINE[u];
        else if (gender === 'F') unitStr = UNITS_FEMININE[u];
        else unitStr = UNITS[u];
        words += " y " + unitStr;
      }
    }
  }

  return words.trim();
}

export interface ConvertOptions {
  gender?: 'M' | 'F' | 'N'; // M: masculine (uno), F: feminine (una), N: neutral (un) - default M
  isCurrency?: boolean;     // If true, applies financial currency suffix formats
  currencyName?: string;    // e.g. "pesos", "euros", "dólares"
  currencyCentName?: string; // e.g. "centavos", "céntimos"
  formatFinancial?: boolean; // If true, formats as "pesos 50/100 M.N." or similar standard
}

export function convertNumberToLetters(
  value: number | string,
  options: ConvertOptions = {}
): string {
  const {
    gender = 'M',
    isCurrency = false,
    currencyName = "pesos",
    currencyCentName = "centavos",
    formatFinancial = false
  } = options;

  // Parse input
  const numString = typeof value === 'number' ? value.toFixed(2) : String(value);
  const cleanStr = numString.replace(/,/g, '').trim();
  const parts = cleanStr.split('.');
  
  const integerPart = parseInt(parts[0], 10);
  const decimalPartString = parts[1] ? parts[1].substring(0, 2).padEnd(2, '0') : '00';
  const decimalPart = parseInt(decimalPartString, 10);

  if (isNaN(integerPart)) {
    return "Cero";
  }

  if (integerPart === 0 && decimalPart === 0) {
    if (isCurrency) {
      if (formatFinancial) {
        return `Cero ${currencyName} 00/100 M.N.`.trim();
      }
      return `Cero ${currencyName}`.trim();
    }
    return "Cero";
  }

  let words = "";

  if (integerPart === 0) {
    words = "cero";
  } else {
    let tempNum = integerPart;
    const groups: number[] = [];

    while (tempNum > 0) {
      groups.push(tempNum % 1000);
      tempNum = Math.floor(tempNum / 1000);
    }

    // groups[0]: units, tens, hundreds
    // groups[1]: thousands (mil)
    // groups[2]: millions (millón)
    // groups[3]: thousands of millions (mil millones)
    // groups[4]: billions (billón)

    for (let i = groups.length - 1; i >= 0; i--) {
      const g = groups[i];
      if (g === 0) continue;

      let groupWords = "";
      
      // Determine gender for unit group
      let groupGender: 'M' | 'F' | 'N' = 'N';
      if (i === 0) {
        groupGender = gender; // Use target gender for the final group
      }

      groupWords = convertGroupOfThree(g, groupGender);

      if (i === 1) { // Thousands (mil)
        if (g === 1) {
          words += "mil ";
        } else {
          words += groupWords + " mil ";
        }
      } else if (i === 2) { // Millions (millón/millones)
        if (g === 1) {
          words += "un millón ";
        } else {
          words += groupWords + " millones ";
        }
      } else if (i === 3) { // Billions of units (mil millones)
        if (g === 1) {
          words += "mil millones ";
        } else {
          words += groupWords + " mil millones ";
        }
      } else if (i === 4) { // Trillions (billón/billones)
        if (g === 1) {
          words += "un billón ";
        } else {
          words += groupWords + " billones ";
        }
      } else { // Units
        words += groupWords + " ";
      }
    }
  }

  words = words.trim();

  // If currency formatting is requested
  if (isCurrency) {
    // Standard rule: if the number is exactly millions (e.g. 1,000,000), it's followed by "de" before the currency
    // e.g. "Un millón de pesos", "Dos millones de dólares"
    // But NOT "Un millón quinientos mil pesos". Check if ends with "millón" or "millones"
    let currencyConnector = " ";
    if (integerPart > 0 && integerPart % 1000000 === 0) {
      currencyConnector = " de ";
    }

    if (formatFinancial) {
      // e.g., "Mil quinientos cuarenta pesos 50/100 M.N."
      words = `${words}${currencyConnector}${currencyName} ${decimalPartString}/100 M.N.`;
    } else {
      // e.g., "Mil quinientos cuarenta pesos con cincuenta centavos"
      const decimalWords = decimalPart > 0 ? convertGroupOfThree(decimalPart, gender) : "";
      if (decimalPart > 0) {
        words = `${words}${currencyConnector}${currencyName} con ${decimalWords} ${currencyCentName}`;
      } else {
        words = `${words}${currencyConnector}${currencyName}`;
      }
    }
  } else {
    // Normal non-currency decimal spelling
    if (decimalPart > 0) {
      const decimalWords = convertGroupOfThree(decimalPart, gender);
      words = `${words} con ${decimalWords}`;
    }
  }

  // Capitalize first letter
  words = words.trim();
  if (words.length > 0) {
    words = words.charAt(0).toUpperCase() + words.slice(1);
  }

  return words;
}
