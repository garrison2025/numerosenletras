import { useState, useEffect, useRef, MouseEvent } from "react";
import { 
  convertNumberToLetters, 
  ConvertOptions 
} from "../utils/numberToLetters";
import { 
  Copy, 
  Check, 
  Volume2, 
  Trash2, 
  History, 
  Sparkles,
  Info,
  Calendar,
  Share2,
  ListRestart,
  Coins,
  ArrowRightLeft,
  Dice5,
  Landmark,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Star,
  HelpCircle
} from "lucide-react";

interface HistoryItem {
  id: string;
  number: string;
  text: string;
  timestamp: string;
  isFavorite?: boolean;
}

interface CurrencyPreset {
  code: string;
  name: string;
  plural: string;
  centName: string;
  centPlural: string;
  symbol: string;
  suffix: string;
}

const CURRENCY_PRESETS: Record<string, CurrencyPreset> = {
  MXN: { code: "MXN", name: "Peso Mexicano", plural: "pesos", centName: "centavo", centPlural: "centavos", symbol: "$", suffix: "M.N." },
  USD: { code: "USD", name: "Dólar Americano", plural: "dólares", centName: "centavo", centPlural: "centavos", symbol: "$", suffix: "USD" },
  EUR: { code: "EUR", name: "Euro", plural: "euros", centName: "céntimo", centPlural: "céntimos", symbol: "€", suffix: "" },
  COP: { code: "COP", name: "Peso Colombiano", plural: "pesos", centName: "centavo", centPlural: "centavos", symbol: "$", suffix: "M/CTE" },
  PEN: { code: "PEN", name: "Sol Peruano", plural: "soles", centName: "céntimo", centPlural: "céntimos", symbol: "S/", suffix: "y CTS." },
  ARS: { code: "ARS", name: "Peso Argentino", plural: "pesos", centName: "centavo", centPlural: "centavos", symbol: "$", suffix: "ARS" },
  CLP: { code: "CLP", name: "Peso Chileno", plural: "pesos", centName: "centavo", centPlural: "centavos", symbol: "$", suffix: "CLP" },
  VES: { code: "VES", name: "Bolívar Venezolano", plural: "bolívares", centName: "céntimo", centPlural: "céntimos", symbol: "Bs.S", suffix: "V.S." },
  BOB: { code: "BOB", name: "Boliviano", plural: "bolivianos", centName: "centavo", centPlural: "centavos", symbol: "Bs", suffix: "BOB" },
  GTQ: { code: "GTQ", name: "Quetzal Guatemalteco", plural: "quetzales", centName: "centavo", centPlural: "centavos", symbol: "Q", suffix: "GTQ" },
  CRC: { code: "CRC", name: "Colón Costarricense", plural: "colones", centName: "céntimo", centPlural: "céntimos", symbol: "₡", suffix: "CRC" },
  HNL: { code: "HNL", name: "Lempira Hondureño", plural: "lempiras", centName: "centavo", centPlural: "centavos", symbol: "L", suffix: "HNL" },
  NIO: { code: "NIO", name: "Córdoba Nicaragüense", plural: "córdobas", centName: "centavo", centPlural: "centavos", symbol: "C$", suffix: "NIO" },
  PYG: { code: "PYG", name: "Guaraní Paraguayo", plural: "guaraníes", centName: "centavo", centPlural: "centavos", symbol: "₲", suffix: "PYG" },
  UYU: { code: "UYU", name: "Peso Uruguayo", plural: "pesos", centName: "centésimo", centPlural: "centésimos", symbol: "$U", suffix: "UYU" },
  DOP: { code: "DOP", name: "Peso Dominicano", plural: "pesos", centName: "centavo", centPlural: "centavos", symbol: "RD$", suffix: "DOP" }
};

const CURRENCY_INFO: Record<string, { flag: string, country: string }> = {
  MXN: { flag: "🇲🇽", country: "México" },
  USD: { flag: "🇺🇸", country: "EE.UU." },
  EUR: { flag: "🇪🇺", country: "Europa" },
  COP: { flag: "🇨🇴", country: "Colombia" },
  PEN: { flag: "🇵🇪", country: "Perú" },
  ARS: { flag: "🇦🇷", country: "Argentina" },
  CLP: { flag: "🇨🇱", country: "Chile" },
  VES: { flag: "🇻🇪", country: "Venezuela" },
  BOB: { flag: "🇧🇴", country: "Bolivia" },
  GTQ: { flag: "🇬🇹", country: "Guatemala" },
  CRC: { flag: "🇨🇷", country: "Costa Rica" },
  HNL: { flag: "🇭🇳", country: "Honduras" },
  NIO: { flag: "🇳🇮", country: "Nicaragua" },
  PYG: { flag: "🇵🇾", country: "Paraguay" },
  UYU: { flag: "🇺🇾", country: "Uruguay" },
  DOP: { flag: "🇩🇴", country: "R. Dom." }
};

const getCurrencyGroup = (code: string) => {
  if (["MXN", "USD", "GTQ", "CRC", "HNL", "NIO", "DOP"].includes(code)) return "north-central";
  if (["COP", "PEN", "ARS", "CLP", "VES", "BOB", "PYG", "UYU"].includes(code)) return "south";
  if (code === "EUR") return "europe";
  return "all";
};

export default function HomeConverter({ initialNumber, onNavigate }: { initialNumber?: string, onNavigate?: (path: string) => void }) {
  const [inputVal, setInputVal] = useState(initialNumber || "");
  const [gender, setGender] = useState<'M' | 'F' | 'N'>('M');
  const [letterCase, setLetterCase] = useState<'title' | 'upper' | 'lower'>('title');
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<any>(null);
  const isFirstMount = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // New core optimization parameters
  const [isCurrencyMode, setIsCurrencyMode] = useState(false);
  const [currencyPreset, setCurrencyPreset] = useState(() => {
    try {
      return localStorage.getItem("saved_currency_code") || "MXN";
    } catch {
      return "MXN";
    }
  });
  const [isFinancialFormat, setIsFinancialFormat] = useState(true);
  const [numberFormatStyle, setNumberFormatStyle] = useState<'LA' | 'ES'>('LA');
  const [showCurrencyPanel, setShowCurrencyPanel] = useState(false);
  const [currencyRegion, setCurrencyRegion] = useState<"all" | "north-central" | "south" | "europe">("all");
  const [openHomeFaq, setOpenHomeFaq] = useState<number | null>(null);

  // Interactive Cheque mockup and History search states
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");
  const [chequePayee, setChequePayee] = useState("Juan Pérez López");
  const [chequeDate, setChequeDate] = useState(() => {
    return new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  });

  // Clipboard paste handler
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        // Extract digits, dots, commas, negative sign
        const cleaned = text.replace(/[^0-9.,-]/g, "").trim();
        if (cleaned) {
          setInputVal(cleaned);
          showToast("Cantidad pegada y filtrada desde portapapeles");
        } else {
          showToast("El portapapeles no contiene números válidos");
        }
      } else {
        showToast("Pegado directo no soportado. Escriba en la casilla.");
      }
    } catch (err) {
      showToast("Por favor, otorgue permisos de portapapeles o escriba.");
    }
  };

  const toggleFavorite = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const isFavNow = !item.isFavorite;
          showToast(isFavNow ? "Guardado en favoritos" : "Quitado de favoritos");
          return { ...item, isFavorite: isFavNow };
        }
        return item;
      });
      localStorage.setItem("conversion_history", JSON.stringify(updated));
      return updated;
    });
  };

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Load history from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("conversion_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Sync initialNumber when it changes
  useEffect(() => {
    if (initialNumber) {
      setInputVal(initialNumber);
    }
  }, [initialNumber]);

  // Sync inputVal with browser URL parameters in real time (debounced)
  useEffect(() => {
    const rawVal = inputVal.trim();
    const timer = setTimeout(() => {
      try {
        const url = new URL(window.location.href);
        if (rawVal && rawVal !== "-") {
          url.searchParams.set("n", rawVal);
        } else {
          url.searchParams.delete("n");
        }
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      } catch (e) {
        // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [inputVal]);

  // Compute conversion in real time with advanced options
  useEffect(() => {
    const rawVal = inputVal.trim();
    if (!rawVal) {
      setResult("");
      return;
    }

    // Smart cleaning: support spaces, currency symbols, and convert commas to standard decimals
    let cleanInput = rawVal.replace(/[^0-9.,-]/g, ""); // strip symbols, spaces
    
    // Auto-detect ES / EU format: dots for thousands, comma for decimal (e.g. 1.234,56)
    const isEsFormat = numberFormatStyle === 'ES' || 
      (cleanInput.includes(",") && !cleanInput.includes(".") && cleanInput.indexOf(",") === cleanInput.length - 3) ||
      (cleanInput.includes(",") && cleanInput.includes(".") && cleanInput.indexOf(",") > cleanInput.indexOf("."));

    if (isEsFormat) {
      cleanInput = cleanInput.replace(/\./g, "").replace(/,/g, ".");
    } else {
      cleanInput = cleanInput.replace(/,/g, "");
    }

    // Verify it is a valid numerical input (optionally negative, and with decimals)
    if (isNaN(Number(cleanInput)) && cleanInput !== "-") {
      setResult("Entrada no válida (solo números y un punto decimal)");
      return;
    }

    try {
      const isNegative = cleanInput.startsWith("-");
      const positiveVal = isNegative ? cleanInput.substring(1) : cleanInput;
      
      let convertedText = "";
      if (isCurrencyMode) {
        const preset = CURRENCY_PRESETS[currencyPreset] || CURRENCY_PRESETS.MXN;
        convertedText = convertNumberToLetters(positiveVal, {
          gender: 'N', // neutral "un pesos" / "un mil" is standard for currency
          isCurrency: true,
          currencyName: preset.plural,
          currencyCentName: preset.centPlural,
          formatFinancial: isFinancialFormat
        });
        
        // Append additional suffix if needed
        if (isFinancialFormat && preset.suffix) {
          if (!convertedText.endsWith(preset.suffix)) {
            // Find if M.N. exists to replace, or append
            if (convertedText.includes("M.N.")) {
              convertedText = convertedText.replace("M.N.", preset.suffix);
            } else {
              convertedText = `${convertedText} ${preset.suffix}`;
            }
          }
        }
      } else {
        convertedText = convertNumberToLetters(positiveVal, { gender });
      }
      
      if (isNegative && convertedText.toLowerCase() !== "cero") {
        convertedText = "menos " + convertedText.toLowerCase();
        // Recapitalize
        convertedText = convertedText.charAt(0).toUpperCase() + convertedText.slice(1);
      }

      // Apply casing
      if (letterCase === 'upper') {
        convertedText = convertedText.toUpperCase();
      } else if (letterCase === 'lower') {
        convertedText = convertedText.toLowerCase();
      } else {
        // Title: Capitalize first, lowercase rest
        convertedText = convertedText.charAt(0).toUpperCase() + convertedText.slice(1);
      }

      setResult(convertedText);

      // Save to history debounced or on valid complete conversions
      if (!isFirstMount.current) {
        const timeout = setTimeout(() => {
          saveToHistory(cleanInput, convertedText);
        }, 1000);
        return () => clearTimeout(timeout);
      } else {
        isFirstMount.current = false;
      }
    } catch (err) {
      setResult("Error en la conversión");
    }
  }, [inputVal, gender, letterCase, isCurrencyMode, currencyPreset, isFinancialFormat, numberFormatStyle]);

  const saveToHistory = (num: string, textStr: string) => {
    if (!num || num === "-" || isNaN(Number(num)) || textStr.startsWith("Entrada no")) return;
    
    setHistory((prev) => {
      // Avoid duplicate consecutive entries
      if (prev.length > 0 && prev[0].number === num && prev[0].text === textStr) {
        return prev;
      }
      
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        number: num,
        text: textStr,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updated = [newItem, ...prev].slice(0, 15); // Keep up to 15 items
      localStorage.setItem("conversion_history", JSON.stringify(updated));
      return updated;
    });
  };

  const handleCopy = () => {
    if (!result || result.startsWith("Entrada no") || result.startsWith("Error")) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const rawVal = inputVal.trim();
    if (!rawVal || isNaN(Number(rawVal.replace(/[^0-9.-]/g, "")))) return;
    
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${window.location.origin}/?n=${encodeURIComponent(rawVal)}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Conversión de Número a Letras",
        text: `La cantidad de ${rawVal} expresada en letras es: "${result}"`,
        url: shareUrl
      }).catch(() => {
        navigator.clipboard.writeText(shareUrl);
        showToast("Enlace de conversión copiado al portapapeles");
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast("Enlace de conversión copiado al portapapeles");
    }
  };

  const handleSpeak = () => {
    if (!result || result.startsWith("Entrada no") || result.startsWith("Error") || speaking) return;
    
    if ('speechSynthesis' in window) {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(result);
      utterance.lang = 'es-ES';
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      showToast("La síntesis de voz no está soportada en su navegador.");
    }
  };

  const handleClearHistory = () => {
    const hasFavorites = history.some(item => item.isFavorite);
    if (hasFavorites) {
      setHistory((prev) => {
        const filtered = prev.filter(item => item.isFavorite);
        localStorage.setItem("conversion_history", JSON.stringify(filtered));
        showToast("Historial borrado, conservando tus favoritos ★");
        return filtered;
      });
    } else {
      setHistory([]);
      localStorage.removeItem("conversion_history");
      showToast("Historial borrado");
    }
  };

  const handleRemoveHistoryItem = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem("conversion_history", JSON.stringify(updated));
      return updated;
    });
  };

  // Advanced helper functions for interactive math controls
  const handleRandomNumber = () => {
    const scales = [100, 1000, 25000, 500000, 2000000];
    const chosenScale = scales[Math.floor(Math.random() * scales.length)];
    const randomVal = (Math.random() * chosenScale).toFixed(Math.random() > 0.4 ? 2 : 0);
    setInputVal(randomVal);
    showToast(`Número aleatorio generado: ${randomVal}`);
  };

  const handleMultiply = (factor: number) => {
    const parsed = parseFloat(inputVal);
    if (!isNaN(parsed)) {
      // Keep up to 2 decimal places to avoid float precision issues
      const multiplied = (Math.round((parsed * factor) * 100) / 100).toString();
      setInputVal(multiplied);
      showToast(`Multiplicado ×${factor}`);
    } else {
      showToast("Ingresa un número válido primero");
    }
  };

  const handleRound = () => {
    const parsed = parseFloat(inputVal);
    if (!isNaN(parsed)) {
      const rounded = Math.round(parsed).toString();
      setInputVal(rounded);
      showToast("Cantidad redondeada al entero más cercano");
    } else {
      showToast("Ingresa un número válido primero");
    }
  };

  const handleIncrement = (amount: number) => {
    const parsed = parseFloat(inputVal) || 0;
    const incremented = (Math.round((parsed + amount) * 100) / 100).toString();
    setInputVal(incremented);
    showToast(`Modificado: ${amount > 0 ? '+' : ''}${amount}`);
  };

  const getFormattedNumber = (val: string, formatType: 'LA' | 'ES') => {
    const clean = val.trim();
    if (!clean || clean === "-" || isNaN(Number(clean))) return "";
    
    try {
      const parsed = parseFloat(clean);
      const parts = clean.split('.');
      const hasDecimal = parts.length > 1;
      const decimalPlaces = hasDecimal ? parts[1].length : 0;
      
      const locale = formatType === 'ES' ? 'de-DE' : 'en-US';
      
      const formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: hasDecimal ? Math.min(decimalPlaces, 10) : 0,
        maximumFractionDigits: 10
      });
      
      return formatter.format(parsed);
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8 sm:py-14 animate-fade-in">
      
      {/* Decorative Blur Orbs for Premium Style */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 -right-4 w-72 h-72 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Header */}
      <div className="text-center mb-12 relative">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border border-blue-100 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
          <span className="font-display tracking-wide uppercase text-[10px]">Herramienta Profesional .org</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-blue-950 to-indigo-950 bg-clip-text">
          Convertidor de Números a Letras
        </h1>
        <p className="font-sans text-gray-600 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
          Escribe cualquier número o cantidad decimal y transfórmalo a letras en español de forma instantánea. 
          Cumple rigurosamente con las reglas ortográficas oficiales de la RAE.
        </p>
      </div>

      {/* Main Interactive Converter Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 sm:p-9 mb-10 relative">
        {/* Subtle accent border top */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-3xl" />

        <div className="space-y-6">
          
          {/* Input field */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="num-input" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Ingresa el número o cantidad decimal
              </label>
              
              <div className="flex items-center space-x-1.5 bg-gray-100/80 p-0.5 rounded-lg border border-gray-200/50">
                <button
                  type="button"
                  onClick={() => {
                    setNumberFormatStyle('LA');
                    showToast("Formato decimal: 1,234.56 (América)");
                  }}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md transition-all ${
                    numberFormatStyle === 'LA' 
                      ? "bg-white text-blue-600 shadow-xs" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Formato miles con comas y decimales con punto (América / MX / US)"
                >
                  1,234.56
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNumberFormatStyle('ES');
                    showToast("Formato decimal: 1.234,56 (España / UE)");
                  }}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md transition-all ${
                    numberFormatStyle === 'ES' 
                      ? "bg-white text-blue-600 shadow-xs" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Formato miles con puntos y decimales con coma (España / Europa / Cono Sur)"
                >
                  1.234,56
                </button>
              </div>
            </div>

            <div className="relative group">
              <input
                id="num-input"
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value.replace(/[^0-9.,$€\s-]/g, ''))}
                placeholder="Ej. 125,420.50 o $ 1,500,000"
                className="w-full bg-gray-50/50 border border-gray-200/80 focus:border-blue-500 focus:bg-white text-gray-950 placeholder-gray-400 font-sans font-bold text-lg sm:text-2xl rounded-2xl pl-5 pr-28 py-4.5 outline-hidden transition-all duration-300 shadow-sm focus:shadow-md focus:ring-4 focus:ring-blue-500/5"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <button
                  onClick={handlePaste}
                  type="button"
                  className="text-[11px] text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border border-blue-100/50"
                  title="Pegar del portapapeles"
                >
                  Pegar
                </button>
                {inputVal && (
                  <button
                    onClick={() => setInputVal("")}
                    type="button"
                    className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200 cursor-pointer"
                    title="Limpiar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Live visual display layout */}
            {inputVal && !isNaN(Number(inputVal)) && (
              <div className="flex items-center justify-between text-xs mt-2.5 px-1 animate-fade-in">
                <div className="flex items-center space-x-1.5 text-gray-500">
                  <span className="font-sans font-medium">Lectura visual:</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50/70 border border-blue-100/40 px-2.5 py-0.5 rounded-lg">
                    {isCurrencyMode ? CURRENCY_PRESETS[currencyPreset].symbol + " " : ""}
                    {getFormattedNumber(inputVal, numberFormatStyle)}
                    {isCurrencyMode && CURRENCY_PRESETS[currencyPreset].suffix ? " " + CURRENCY_PRESETS[currencyPreset].suffix : ""}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 italic">Pre-visualización</span>
              </div>
            )}

            {/* Quick Math Utilities Section */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3.5 border-t border-b border-gray-100/80 py-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-gray-400 font-sans font-medium mr-1">Ajustar:</span>
                <button
                  onClick={handleRandomNumber}
                  className="inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-150/50 hover:border-indigo-200 transition-all cursor-pointer shadow-2xs"
                  title="Generar número aleatorio con decimales"
                >
                  <Dice5 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Aleatorio</span>
                </button>
                <button
                  onClick={() => handleMultiply(10)}
                  disabled={!inputVal || isNaN(Number(inputVal))}
                  className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-150/50 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Multiplicar por 10"
                >
                  ×10
                </button>
                <button
                  onClick={() => handleMultiply(0.1)}
                  disabled={!inputVal || isNaN(Number(inputVal))}
                  className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-150/50 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Dividir por 10"
                >
                  ÷10
                </button>
                <button
                  onClick={handleRound}
                  disabled={!inputVal || isNaN(Number(inputVal))}
                  className="inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-amber-50 hover:text-amber-700 border border-gray-150/50 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Redondear decimales"
                >
                  <RotateCcw className="w-3 h-3 text-amber-500 rotate-180" />
                  <span>Redondear</span>
                </button>
                <button
                  onClick={() => handleIncrement(1)}
                  disabled={isNaN(Number(inputVal))}
                  className="text-xs font-semibold px-2 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-150/50 transition-all cursor-pointer"
                  title="Sumar 1"
                >
                  +1
                </button>
                <button
                  onClick={() => handleIncrement(-1)}
                  disabled={isNaN(Number(inputVal))}
                  className="text-xs font-semibold px-2 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-150/50 transition-all cursor-pointer"
                  title="Restar 1"
                >
                  -1
                </button>
              </div>

              {/* Quick Examples Selection */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 font-sans">Presets:</span>
                {[
                  { label: "1.5M", val: "1500000" },
                  { label: "18.25", val: "18.25" },
                  { label: "101", val: "101" }
                ].map((ex) => (
                  <button
                    key={ex.val}
                    onClick={() => {
                      setInputVal(ex.val);
                      showToast(`Preset cargado: ${ex.label}`);
                    }}
                    className="text-xs font-mono px-2 py-0.5 rounded-md bg-gray-50/80 text-gray-500 hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-100 transition-all cursor-pointer"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Integrated Collapsible Currency Mode Switch */}
          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border border-blue-100/50 rounded-2xl p-4 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl transition-all ${isCurrencyMode ? "bg-blue-600 text-white" : "bg-white text-gray-400 border border-gray-150"}`}>
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 tracking-tight flex items-center space-x-1.5">
                    <span>Modo Moneda y Facturación</span>
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-1.5 py-0.5 rounded-full uppercase scale-90">Cheques</span>
                  </h4>
                  <p className="text-[10px] text-gray-500 font-sans">Agrega nombres de divisas y formatos financieros de forma automática</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isCurrencyMode}
                  aria-label="Alternar modo de conversión de moneda"
                  onClick={() => {
                    const nextVal = !isCurrencyMode;
                    setIsCurrencyMode(nextVal);
                    if (nextVal) {
                      setShowCurrencyPanel(true);
                      showToast("Modo Moneda activado");
                    } else {
                      showToast("Modo Moneda desactivado (conteo normal)");
                    }
                  }}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-hidden ${
                    isCurrencyMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
                      isCurrencyMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setShowCurrencyPanel(!showCurrencyPanel)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-150/40 transition-colors cursor-pointer"
                  title="Configurar opciones de divisa"
                >
                  {showCurrencyPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Currency Customizer Panel (Collapsible) */}
            {showCurrencyPanel && (
              <div className="mt-4 pt-4 border-t border-gray-200/50 space-y-4 animate-scale-up">
                {/* Popular LATAM Quick Switcher */}
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Accesos Rápidos LATAM & Popular</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { code: "MXN", name: "México" },
                      { code: "USD", name: "EE.UU. (USD)" },
                      { code: "COP", name: "Colombia" },
                      { code: "PEN", name: "Perú" },
                      { code: "CLP", name: "Chile" },
                      { code: "ARS", name: "Argentina" }
                    ].map((item) => {
                      const preset = CURRENCY_PRESETS[item.code];
                      const info = CURRENCY_INFO[item.code];
                      const isSelected = currencyPreset === item.code && isCurrencyMode;
                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            setCurrencyPreset(item.code);
                            setIsCurrencyMode(true);
                            try {
                              localStorage.setItem("saved_currency_code", item.code);
                            } catch (e) {}
                            showToast(`Divisa: ${preset.name} (${info.flag})`);
                          }}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-600 border-blue-700 text-white shadow-xs"
                              : "bg-white border-gray-250/60 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                          }`}
                        >
                          <span>{info.flag}</span>
                          <span>{item.code}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Region Selector Tabs */}
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-sans">Filtrar por Región</span>
                  <div className="flex flex-wrap gap-1 border-b border-gray-150/60 pb-2">
                    {[
                      { id: "all", label: "Todas 🌎" },
                      { id: "north-central", label: "Norte/Centroamérica 🇲🇽" },
                      { id: "south", label: "Sudamérica 🇨🇴" },
                      { id: "europe", label: "Europa 🇪🇺" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setCurrencyRegion(tab.id as any)}
                        className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                          currencyRegion === tab.id
                            ? "bg-slate-900 text-white shadow-xs"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency Presets Grid */}
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Selecciona la Divisa Oficial</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                    {Object.values(CURRENCY_PRESETS)
                      .filter((preset) => currencyRegion === "all" || getCurrencyGroup(preset.code) === currencyRegion)
                      .map((preset) => {
                        const info = CURRENCY_INFO[preset.code] || { flag: "🏳️", country: "Otro" };
                        return (
                          <button
                            key={preset.code}
                            type="button"
                            onClick={() => {
                              setCurrencyPreset(preset.code);
                              setIsCurrencyMode(true);
                              try {
                                localStorage.setItem("saved_currency_code", preset.code);
                              } catch (e) {}
                              showToast(`Divisa configurada: ${preset.name}`);
                            }}
                            className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all cursor-pointer ${
                              currencyPreset === preset.code && isCurrencyMode
                                ? "bg-blue-50 border-blue-500 text-blue-900 shadow-xs font-semibold"
                                : "bg-white/60 border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="min-w-0 flex items-center gap-1.5">
                              <span className="text-sm shrink-0">{info.flag}</span>
                              <div className="min-w-0">
                                <span className="block text-xs truncate font-sans">{preset.name}</span>
                                <span className="block text-[9px] font-mono text-gray-400">{preset.plural}</span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md font-mono shrink-0 ml-1">
                              {preset.symbol}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/60 p-3 rounded-xl border border-gray-200/50">
                  <div className="flex items-start space-x-2.5">
                    <input
                      id="financial-format"
                      type="checkbox"
                      checked={isFinancialFormat}
                      onChange={(e) => {
                        setIsFinancialFormat(e.target.checked);
                        setIsCurrencyMode(true);
                        showToast(e.target.checked ? "Formato financiero activado (/100)" : "Formato hablado activado");
                      }}
                      className="mt-0.5 h-4.5 w-4.5 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="financial-format" className="block text-xs font-sans text-gray-700 cursor-pointer selection:bg-transparent">
                      <span className="font-semibold block text-gray-900">Formato Financiero (Fracción decimal /100)</span>
                      Recomendado para cheques e impuestos (ej. <em className="text-blue-600">"50/100 M.N."</em> en lugar de <em className="text-blue-600 font-mono">"con cincuenta centavos"</em>)
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            {/* Gender setting */}
            <div className={`rounded-2xl p-5 border transition-all ${
              isCurrencyMode 
                ? "bg-gray-100/40 border-gray-200 text-gray-400 opacity-60" 
                : "bg-gray-50/40 border-gray-100/80 hover:bg-gray-50/60 text-gray-900 hover:border-gray-200"
            }`}>
              <div className="flex items-center justify-between mb-3.5">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Género Gramatical
                </span>
                <span className="text-[10px] text-gray-400 font-mono">Concordancia</span>
              </div>
              <div className="flex gap-2">
                {[
                  { key: 'M', label: 'Masculino', desc: '(uno)' },
                  { key: 'F', label: 'Femenino', desc: '(una)' },
                  { key: 'N', label: 'Neutro', desc: '(un)' }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    disabled={isCurrencyMode}
                    onClick={() => setGender(opt.key as 'M' | 'F' | 'N')}
                    className={`flex-1 py-2.5 px-1.5 text-center rounded-xl transition-all duration-300 border ${
                      isCurrencyMode 
                        ? "bg-transparent border-gray-150 text-gray-400 cursor-not-allowed"
                        : gender === opt.key 
                          ? "bg-gradient-to-b from-blue-600 to-indigo-600 border-indigo-700 text-white font-semibold shadow-md shadow-blue-500/15 cursor-pointer" 
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    <span className="block text-xs leading-tight">{opt.label}</span>
                    <span className={`text-[9.5px] block mt-0.5 opacity-80 ${gender === opt.key && !isCurrencyMode ? "text-blue-100" : "text-gray-400 font-mono"}`}>
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
              {isCurrencyMode && (
                <p className="text-[10px] text-indigo-600 font-sans mt-2 leading-snug">
                  * Bloqueado: Las divisas utilizan concordancia de género neutra de forma estricta (ej. "un millón de pesos").
                </p>
              )}
            </div>

            {/* Casing setting */}
            <div className="bg-gray-50/40 rounded-2xl p-5 border border-gray-100/80 hover:bg-gray-50/60 transition-colors">
              <div className="flex items-center justify-between mb-3.5">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Formato de Letras
                </span>
                <span className="text-[10px] text-gray-400 font-mono">Estilo</span>
              </div>
              <div className="flex gap-2">
                {[
                  { key: 'title', label: 'Tipo Título', desc: 'Mil uno' },
                  { key: 'upper', label: 'MAYÚSCULAS', desc: 'MIL UNO' },
                  { key: 'lower', label: 'minúsculas', desc: 'mil uno' }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setLetterCase(opt.key as 'title' | 'upper' | 'lower')}
                    className={`flex-1 py-2.5 px-1.5 text-center rounded-xl transition-all duration-300 border cursor-pointer ${
                      letterCase === opt.key 
                        ? "bg-gradient-to-b from-blue-600 to-indigo-600 border-indigo-700 text-white font-semibold shadow-md shadow-blue-500/15" 
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="block text-xs leading-tight">{opt.label}</span>
                    <span className={`text-[9.5px] block mt-0.5 opacity-80 ${letterCase === opt.key ? "text-blue-100" : "text-gray-400 font-mono"}`}>
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Block */}
          {result && (
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Resultado Oficial de Conversión
                  </span>
                  
                  {/* Results metadata */}
                  {!result.startsWith("Entrada no") && !result.startsWith("Error") && (
                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                        {result.split(/\s+/).filter(Boolean).length} {result.split(/\s+/).filter(Boolean).length === 1 ? 'palabra' : 'palabras'}
                      </span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                        {result.length} caracteres
                      </span>
                    </div>
                  )}
                </div>
                
                <div 
                  onDoubleClick={handleCopy}
                  className="bg-gradient-to-br from-blue-50/60 to-indigo-50/35 border border-blue-150/70 rounded-2xl p-5 sm:p-7 relative group transition-all duration-300 hover:shadow-xs shadow-inner shadow-white/80 cursor-pointer"
                  title="Haz doble clic para copiar el resultado rápidamente"
                >
                  <p className="font-display font-extrabold text-slate-900 text-xl sm:text-2xl leading-relaxed pr-16 break-words tracking-tight selection:bg-blue-100">
                    {result}
                  </p>
                  
                  <span className="hidden sm:inline-block absolute bottom-3 left-5 font-sans text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    🖮 Haz doble clic para copiar rápidamente
                  </span>

                  {/* Speech synthesis equalizer animation */}
                  {speaking && (
                    <div className="flex items-center space-x-1.5 mt-4 bg-indigo-50/80 border border-indigo-100 rounded-lg px-3 py-1.5 w-fit animate-pulse">
                      <div className="flex items-end space-x-0.5 h-3">
                        <div className="w-1 bg-indigo-600 rounded-xs h-2 animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 bg-indigo-600 rounded-xs h-3 animate-bounce" style={{ animationDelay: '0.3s' }} />
                        <div className="w-1 bg-indigo-600 rounded-xs h-1 animate-bounce" style={{ animationDelay: '0.5s' }} />
                        <div className="w-1 bg-indigo-600 rounded-xs h-2 animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-[10px] text-indigo-700 font-mono font-semibold uppercase tracking-wider">Reproduciendo audio RAE...</span>
                    </div>
                  )}

                  {/* Micro Action Buttons */}
                  <div className="absolute right-4 top-4 flex flex-col sm:flex-row gap-2">
                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      disabled={result.startsWith("Entrada no") || result.startsWith("Error")}
                      className="p-3 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer border bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-gray-200 shadow-xs hover:scale-105 active:scale-95"
                      title="Compartir esta conversión"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* Speak button */}
                    <button
                      onClick={handleSpeak}
                      disabled={result.startsWith("Entrada no")}
                      className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                        speaking 
                          ? "bg-indigo-600 border-indigo-700 text-white animate-pulse scale-95 shadow-md shadow-indigo-500/15" 
                          : "bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-gray-200 shadow-xs hover:scale-105 active:scale-95"
                      }`}
                      title="Escuchar pronunciación oficial en español"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={handleCopy}
                      disabled={result.startsWith("Entrada no")}
                      className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                        copied 
                          ? "bg-emerald-600 border-emerald-700 text-white shadow-md shadow-emerald-500/15" 
                          : "bg-white text-blue-600 hover:text-blue-800 hover:bg-blue-50/50 border-blue-200/70 shadow-xs hover:scale-105 active:scale-95"
                      }`}
                      title="Copiar resultado"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {copied && (
                    <span className="absolute bottom-3 right-4 font-mono text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-lg animate-scale-up">
                      ✓ Copiado con éxito
                    </span>
                  )}
                </div>
              </div>

              {/* Physical Cheque / Voucher Interactive Mockup (Optimization 3) */}
              {isCurrencyMode && inputVal && !isNaN(Number(inputVal.replace(/[^0-9.-]/g, ""))) && (
                <div className="mt-8 pt-4 border-t border-gray-150 animate-scale-up">
                  <span className="block text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">
                    Vista Previa de Llenado de Cheque Bancario (Formativo)
                  </span>

                  {/* Physical Cheque Container */}
                  <div className="bg-radial from-slate-50 to-emerald-50/40 border-2 border-emerald-600/30 rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden text-left font-serif text-slate-800 select-none">
                    
                    {/* Decorative security wavy watermark background */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />

                    {/* Security microtext borders */}
                    <div className="absolute inset-2 border border-emerald-600/10 rounded-xl pointer-events-none" />

                    {/* Top row: Bank name and Cheque metadata */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-3 relative z-10">
                      <div>
                        <span className="font-bold tracking-tight text-xs sm:text-sm text-emerald-800 uppercase flex items-center gap-1.5">
                          <Landmark className="w-4 h-4 text-emerald-600 shrink-0" />
                          BANCO INTERNACIONAL DE MÉXICO
                        </span>
                        <span className="block text-[8px] uppercase tracking-widest text-slate-400 mt-0.5">Sucursal Centro • Documento de Prueba</span>
                      </div>
                      
                      {/* Date details */}
                      <div className="flex items-center space-x-2 text-right">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">Fecha:</span>
                        <input
                          type="text"
                          value={chequeDate}
                          onChange={(e) => setChequeDate(e.target.value)}
                          className="w-24 bg-white/60 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-md px-2 py-0.5 text-center text-xs font-bold font-sans outline-hidden transition-all"
                          placeholder="DD/MM/AAAA"
                        />
                      </div>
                    </div>

                    {/* Middle elements: Payee row and Amount block */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 relative z-10 items-center">
                      <div className="md:col-span-3 space-y-3">
                        {/* Beneficiary */}
                        <div className="flex items-center gap-2">
                          <span className="text-[9.5px] font-sans font-bold text-slate-400 uppercase shrink-0">Páguese a la orden de:</span>
                          <input
                            type="text"
                            value={chequePayee}
                            onChange={(e) => setChequePayee(e.target.value)}
                            className="bg-transparent border-b border-dashed border-slate-300 focus:border-emerald-600 focus:outline-hidden px-1 py-0.5 flex-1 text-xs font-bold font-sans text-slate-800"
                            placeholder="Ej. Juan Pérez López"
                          />
                        </div>

                        {/* Amount in Words */}
                        <div className="flex items-start gap-2">
                          <span className="text-[9.5px] font-sans font-bold text-slate-400 uppercase shrink-0 mt-1.5">La cantidad de:</span>
                          <div className="border-b border-dashed border-slate-300 flex-1 py-0.5 text-xs sm:text-sm font-bold text-slate-900 leading-relaxed pr-2">
                            {result} <span className="font-sans text-slate-300">***********************</span>
                          </div>
                        </div>
                      </div>

                      {/* Rightmost numerical amount frame */}
                      <div className="md:col-span-1 bg-white border-2 border-emerald-600/30 rounded-xl p-3 text-center relative shadow-xs">
                        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[8px] font-sans font-bold tracking-widest text-slate-400 uppercase">
                          Suma M.N.
                        </span>
                        <span className="font-mono font-extrabold text-base sm:text-lg text-emerald-800 tracking-tight">
                          {CURRENCY_PRESETS[currencyPreset].symbol}
                          {" "}
                          {getFormattedNumber(inputVal.replace(/[^0-9.-]/g, ""), numberFormatStyle)}
                        </span>
                      </div>
                    </div>

                    {/* Footer Row: Legal notice and Signature section */}
                    <div className="flex items-end justify-between pt-4 border-t border-slate-200/60 mt-2 relative z-10 gap-4">
                      <div className="max-w-[60%] space-y-1">
                        <span className="text-[8px] text-slate-400 uppercase font-sans leading-relaxed block">
                          No negociable • Válido únicamente como modelo de llenado de cheques o facturas con {currencyPreset}.
                        </span>
                        <div className="inline-flex items-center space-x-1 bg-emerald-100/50 text-emerald-800 border border-emerald-200/30 px-2 py-0.5 rounded-md text-[8.5px] font-sans font-semibold">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                          <span>DOCUMENTO PROTEGIDO LOCALMENTE</span>
                        </div>
                      </div>

                      {/* Signature block */}
                      <div className="text-center w-36 shrink-0 space-y-1">
                        <div className="h-6 flex items-center justify-center relative">
                          <span className="font-sans text-[10px] text-slate-300 select-none">Firma Autorizada</span>
                          <div className="absolute font-sans text-slate-400/40 select-none font-bold italic rotate-12 text-sm">Draft</div>
                        </div>
                        <div className="border-t border-slate-300 w-full" />
                        <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-sans block">Firma del Emisor</span>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* History Grid Panel & Informational Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        
        {/* History Column */}
        <div className="md:col-span-1 bg-gray-50/40 rounded-2xl border border-gray-100 p-5 flex flex-col max-h-[480px]">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2.5">
            <div className="flex items-center space-x-2 text-gray-800">
              <History className="w-4 h-4 text-gray-400" />
              <h3 className="font-sans font-semibold text-sm tracking-tight">Historial RAE</h3>
            </div>
            {history.length > 0 && (
              <button 
                onClick={handleClearHistory}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-sans cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Limpiar
              </button>
            )}
          </div>

          {history.length > 0 && (
            <div className="mb-3">
              <input
                type="text"
                value={searchHistoryQuery}
                onChange={(e) => setSearchHistoryQuery(e.target.value)}
                placeholder="Filtrar cifra o conversión..."
                className="w-full bg-white border border-gray-200/80 focus:border-blue-500 focus:bg-white rounded-xl px-3 py-1.5 text-xs outline-hidden transition-all duration-200 placeholder:text-gray-400 font-sans focus:ring-4 focus:ring-blue-500/5 shadow-xs"
              />
            </div>
          )}

          {history.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <ListRestart className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-xs text-gray-400 font-sans max-w-[160px]">
                Las conversiones que realices se guardarán aquí temporalmente.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {[...history]
                .sort((a, b) => {
                  if (a.isFavorite && !b.isFavorite) return -1;
                  if (!a.isFavorite && b.isFavorite) return 1;
                  return 0;
                })
                .filter((item) => {
                  if (!searchHistoryQuery) return true;
                  const query = searchHistoryQuery.toLowerCase();
                  return item.number.toLowerCase().includes(query) || item.text.toLowerCase().includes(query);
                })
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setInputVal(item.number)}
                    className={`group border rounded-xl p-3 cursor-pointer text-left transition-all flex items-start justify-between shadow-xs ${
                      item.isFavorite
                        ? "bg-amber-50/20 border-amber-200/60 hover:bg-amber-50/40"
                        : "bg-white hover:bg-blue-50/30 border-gray-200/50 hover:border-blue-100"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-blue-600 break-words block">
                          {item.number}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">{item.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-sans truncate mt-0.5">
                        {item.text}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-0.5 shrink-0">
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`p-1 rounded-md transition-colors ${
                          item.isFavorite 
                            ? "text-amber-500 hover:bg-amber-100/50" 
                            : "text-gray-300 hover:text-amber-500 hover:bg-gray-100"
                        }`}
                        title={item.isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
                      >
                        <Star className={`w-3.5 h-3.5 ${item.isFavorite ? "fill-amber-400" : ""}`} />
                      </button>
                      <button
                        onClick={(e) => handleRemoveHistoryItem(item.id, e)}
                        className="p-1 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Eliminar del historial"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Guides Column (Spans 2 columns on medium screens) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 shadow-xs rounded-2xl p-6 text-left">
            <h3 className="font-sans font-bold text-gray-900 text-sm mb-4 flex items-center space-x-2">
              <span className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Info className="w-4 h-4" /></span>
              <span>Reglas clave de ortografía RAE</span>
            </h3>
            
            <div className="space-y-4">
              <div className="p-3.5 bg-gray-50/50 rounded-xl border border-gray-100/80 hover:bg-blue-50/10 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs text-gray-600 font-sans leading-relaxed">
                    <p className="font-semibold text-gray-900 mb-1">1. Escribir en una sola palabra (0 al 30):</p>
                    Los números del <strong>0 al 30</strong> se escriben estrictamente en una sola palabra (ej: <em>veintiuno</em>, <em>veintidós</em>). A partir del 31 se escriben por separado usando la conjunción "y" (ej: <em>treinta y uno</em>).
                  </div>
                  <button 
                    onClick={() => { setInputVal("24"); showToast("Ejemplo de regla 1 cargado: 24"); }}
                    className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer shrink-0"
                  >
                    Probar 24
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50/50 rounded-xl border border-gray-100/80 hover:bg-blue-50/10 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs text-gray-600 font-sans leading-relaxed">
                    <p className="font-semibold text-gray-900 mb-1">2. Cientos y Millones:</p>
                    "Cien" se convierte en "ciento" a partir del 101. "Millón" es singular y "millones" plural. Si una cifra es exacta en millones, se une a la moneda con "de" (ej: <em>Un millón de pesos</em>).
                  </div>
                  <button 
                    onClick={() => { setInputVal("105"); showToast("Ejemplo de regla 2 cargado: 105"); }}
                    className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer shrink-0"
                  >
                    Probar 105
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50/50 rounded-xl border border-gray-100/80 hover:bg-blue-50/10 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs text-gray-600 font-sans leading-relaxed">
                    <p className="font-semibold text-gray-900 mb-1">3. Uso de "un mil" vs "mil":</p>
                    Se desaconseja el uso de "un mil" para la cifra 1000 de forma aislada, prefiriéndose simplemente <strong>"mil"</strong>. Sin embargo, para millones se usa siempre el artículo singular: <strong>"un millón"</strong>.
                  </div>
                  <button 
                    onClick={() => { setInputVal("1000"); showToast("Ejemplo de regla 3 cargado: 1000"); }}
                    className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer shrink-0"
                  >
                    Probar 1000
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-5 text-left shadow-md shadow-blue-500/10 flex items-center justify-between">
            <div className="space-y-1.5 max-w-[80%]">
              <h3 className="font-sans font-bold text-sm">¿Necesitas llenar un cheque o factura?</h3>
              <p className="text-xs text-blue-100 font-sans leading-relaxed">
                Utiliza nuestra herramienta especializada de cantidad con letra para formatos oficiales y bancarios.
              </p>
            </div>
            {onNavigate && (
              <button 
                onClick={() => onNavigate("/cantidad-con-letra")}
                className="bg-white text-blue-600 hover:bg-blue-50 p-3 rounded-xl transition-all font-sans font-semibold text-xs shadow-md cursor-pointer flex items-center justify-center shrink-0"
              >
                Ir al Conversor
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Quick Equivalency Reference Table Section */}
      <div className="mt-12 bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 p-6 sm:p-8 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center space-x-2.5 mb-6">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-gray-900 text-base leading-snug">Tabla de Referencia de Escritura RAE</h3>
            <p className="text-xs text-gray-500 font-sans">Consulta rápida de las formas escritas oficiales más comunes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {[
            { num: "0", word: "Cero" },
            { num: "1", word: "Uno / Un" },
            { num: "11", word: "Once" },
            { num: "16", word: "Dieciséis" },
            { num: "20", word: "Veinte" },
            { num: "22", word: "Veintidós" },
            { num: "30", word: "Treinta" },
            { num: "31", word: "Treinta y uno" },
            { num: "100", word: "Cien" },
            { num: "101", word: "Ciento uno" },
            { num: "500", word: "Quinientos" },
            { num: "1000", word: "Mil" },
            { num: "1000000", word: "Un millón" },
            { num: "1000000000", word: "Mil millones" },
            { num: "1.50", word: "Uno con cincuenta" }
          ].map((item) => (
            <a 
              key={item.num} 
              href={`#/?n=${item.num}`}
              onClick={(e) => {
                e.preventDefault();
                setInputVal(item.num);
                showToast(`Cargado: ${item.num} (${item.word})`);
                // Update URL parameter
                try {
                  const url = new URL(window.location.href);
                  url.searchParams.set("n", item.num);
                  window.history.replaceState(null, "", url.pathname + url.search + url.hash);
                } catch (err) {}
              }}
              className="bg-gray-50/50 hover:bg-blue-50/40 border border-gray-150/60 hover:border-blue-200/60 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all group block"
            >
              <div>
                <span className="font-mono text-[11px] font-bold text-gray-400 block leading-none mb-1 group-hover:text-blue-500 transition-colors">{item.num}</span>
                <span className="font-sans font-semibold text-xs text-gray-750 group-hover:text-gray-950">{item.word}</span>
              </div>
              <span className="text-[10px] text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all font-medium font-mono">
                Cargar →
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Guía SEO y Preguntas Frecuentes - Optimización de Densidad de Palabra Clave: Números en Letras */}
      <div className="mt-16 text-left space-y-8 animate-fade-in">
        {/* Header Block */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-800">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-1.5 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 border border-blue-400/20">
                <Sparkles className="w-3 h-3 animate-pulse text-blue-400" />
                <span>Manual de Referencia Oficial</span>
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight">
                Guía Profesional de Conversión: <span className="text-blue-400">Números en Letras</span>
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                Aprende cómo transcribir cualquier cifra en <strong className="text-white">números en letras</strong> de manera correcta según la normativa RAE. Ponemos a tu disposición este convertidor interactivo de <strong className="text-white">números en letras</strong> para fines contables, financieros y administrativos.
              </p>
            </div>
            <div className="shrink-0 flex items-center">
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
                <span className="block text-xl font-bold font-mono text-blue-400">100%</span>
                <span className="block text-[9px] font-medium text-slate-300 uppercase tracking-widest mt-0.5">Precisión RAE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Normativa RAE */}
          <div className="bg-white hover:bg-slate-50/50 transition-all duration-300 rounded-3xl border border-gray-150 p-6 shadow-sm border-l-4 border-l-blue-600 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Info className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Reglas Gramaticales para escribir <span className="text-blue-600">Números en Letras</span>
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                La Real Academia Española (RAE) regula estrictamente la redacción de <strong className="text-slate-800">números en letras</strong> en el idioma español. Las cuatro reglas esenciales para no cometer fallos ortográficos son:
              </p>
              
              <div className="space-y-3.5">
                {[
                  { index: "01", title: "Del 0 al 30", desc: "Se escriben unificados en un solo vocablo en números en letras (ej. dieciséis, veintiuno, veintinueve)." },
                  { index: "02", title: "Conjunción 'y'", desc: "A partir del 31 se separan los números en letras utilizando la copulativa 'y' (ej. treinta y uno, noventa y nueve)." },
                  { index: "03", title: "Género Gramatical", desc: "Adaptación del género en números en letras según el sustantivo (ej. un millón de pesos / una unidad)." },
                  { index: "04", title: "El sufijo 'mil'", desc: "Se evita escribir el redundante 'un mil' en números en letras aislado; se prefiere utilizar simplemente 'mil'." }
                ].map((item) => (
                  <div key={item.index} className="flex items-start space-x-3 text-xs">
                    <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50/70 w-6 h-6 rounded-lg flex items-center justify-center shrink-0">
                      {item.index}
                    </span>
                    <div>
                      <strong className="text-slate-800 block font-semibold mb-0.5">{item.title}</strong>
                      <span className="text-slate-500 block leading-relaxed">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Legal & Cheques */}
          <div className="bg-white hover:bg-slate-50/50 transition-all duration-300 rounded-3xl border border-gray-150 p-6 shadow-sm border-l-4 border-l-amber-500 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                  <Landmark className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Prioridad de <span className="text-amber-600">Números en Letras</span> en el Ámbito Legal
                </h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  En transacciones bancarias, contratos de arrendamiento y emisión de cheques oficiales, la expresión de cantidades en <strong className="text-slate-800">números en letras</strong> tiene prioridad jerárquica sobre los símbolos o números digitales.
                </p>
                <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3.5 text-[11px] text-amber-900 leading-relaxed">
                  <span className="font-bold block mb-1">💡 Regla de Oro Financiera:</span>
                  Si la cantidad expresada en dígitos no coincide con la expresada en <strong className="text-amber-950 font-bold">números en letras</strong>, las entidades financieras y tribunales considerarán siempre como válida la cantidad redactada en letras.
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Por ello, contar con un generador automático que minimice errores de ortografía o contradicciones al redactar de números a letras es de vital importancia para auditores y administradores.
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>Norma de Redacción Comercial</span>
              <span>Prioridad Legal</span>
            </div>
          </div>

          {/* Card 3: Uso Contable */}
          <div className="bg-white hover:bg-slate-50/50 transition-all duration-300 rounded-3xl border border-gray-150 p-6 shadow-sm border-l-4 border-l-emerald-500 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                  <Coins className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Uso Contable de <span className="text-emerald-600">Números en Letras</span>
                </h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  En contabilidad fiscal y facturación electrónica, el uso contable de <strong className="text-slate-800">números en letras</strong> requiere un rigor específico. Los centavos no suelen expresarse de manera literal hablada, sino en formato fraccionario.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Nuestra plataforma automatiza el formato financiero de <strong className="text-slate-800">números en letras</strong> (ej. <em>"pesos 50/100 M.N."</em> o <em>"USD 25/100"</em>). Este conversor automatizado de <strong className="text-slate-800">números en letras</strong> es compatible con divisas clave como el Peso Mexicano, Dólar, Euro, Peso Colombiano, Sol Peruano y Peso Argentino.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 text-[10px] text-emerald-700 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100/40 font-mono flex items-center justify-between mt-4">
              <span>Modo Cheques & Facturas</span>
              <span className="font-bold">Fracción /100 Activa</span>
            </div>
          </div>

          {/* Card 4: FAQ */}
          <div className="bg-white hover:bg-slate-50/50 transition-all duration-300 rounded-3xl border border-gray-150 p-6 shadow-sm border-l-4 border-l-indigo-500 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Consultas Frecuentes sobre <span className="text-indigo-600">Números en Letras</span>
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <h4 className="text-xs font-semibold text-slate-800 flex items-center space-x-1">
                    <span className="text-blue-500 font-bold font-mono">Q.</span>
                    <span>¿Cómo transcribir grandes cantidades de números en letras?</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1 pl-4">
                    Nuestra calculadora oficial de <strong className="text-slate-700 font-medium">números en letras</strong> permite procesar de manera instantánea cifras que alcanzan billones de unidades con decimales complejos.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-800 flex items-center space-x-1">
                    <span className="text-blue-500 font-bold font-mono">Q.</span>
                    <span>¿Cómo evitar errores ortográficos en números en letras?</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1 pl-4">
                    Escribir cantidades complejas manualmente puede llevar a fallos. Este transcriptor de <strong className="text-slate-700 font-medium">números en letras</strong> garantiza apego absoluto a la RAE para evitar errores en tus <strong className="text-slate-700 font-medium">números en letras</strong> redactados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section (Pilar B - JSON-LD & FAQ Accordion) */}
      <div className="mt-12 bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 text-left space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="font-sans font-bold text-gray-900 text-lg flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 rounded-xl text-blue-600"><HelpCircle className="w-5 h-5" /></span>
            <span>Preguntas Frecuentes sobre Números en Letras</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Respuestas rápidas a las dudas ortográficas y financieras más comunes sobre la transcripción de números a palabras.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "¿Cómo se escriben los centavos o céntimos con letras?",
              a: "Según la Real Academia Española (RAE) y la normativa bancaria general, para cantidades de dinero es preferible expresar los decimales en forma de fracción (ej. '50/100 M.N.') o como céntimos en palabras (ej. 'cincuenta céntimos'). Nuestra herramienta te permite alternar ambos formatos."
            },
            {
              q: "¿Cuál es la diferencia entre 'ciento' y 'cien' al escribir números?",
              a: "Se emplea 'cien' exclusivamente para referirse de forma exacta a la cifra 100. En cambio, cuando el número va seguido de decenas o unidades menores, se transforma en 'ciento' (ej. 'ciento cinco', 'ciento ochenta y siete')."
            },
            {
              q: "¿A partir de qué número se separan las cifras con la conjunción 'y'?",
              a: "Los números del 1 al 30 se escriben siempre en una sola palabra refundida (ej. 'dieciséis', 'veintinueve'). A partir del número 31 en adelante, las decenas y las unidades deben separarse de forma obligatoria mediante la conjunción copulativa 'y' (ej. 'treinta y uno', 'cuarenta y cinco')."
            },
            {
              q: "¿Por qué la cantidad en letras de un cheque tiene prioridad sobre el número?",
              a: "En el derecho comercial y bancario de la mayoría de los países de habla hispana, si existe cualquier discrepancia o contradicción entre el monto en dígitos y el monto escrito en letras, se considerará legalmente válida la cantidad escrita en letras, como medida de seguridad contra falsificaciones."
            },
            {
              q: "¿Este conversor funciona sin conexión o de forma segura?",
              a: "Sí, el convertidor está desarrollado en React para ejecutarse de forma 100% local en tu propio navegador. Ninguno de los números, montos, cantidades o textos introducidos se envía a servidores externos, garantizando absoluta seguridad y confidencialidad."
            }
          ].map((faq, index) => {
            const isOpen = openHomeFaq === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen ? "border-blue-200 bg-blue-50/10 shadow-xs" : "border-gray-150 hover:bg-gray-50/50"
                }`}
              >
                <button
                  onClick={() => setOpenHomeFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left font-sans font-semibold text-xs sm:text-sm text-gray-800 hover:text-gray-950 gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className={`shrink-0 p-1 rounded-lg transition-colors ${isOpen ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed font-sans border-t border-dashed border-gray-100 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-full shadow-xl flex items-center space-x-2 animate-scale-up border border-gray-800">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
