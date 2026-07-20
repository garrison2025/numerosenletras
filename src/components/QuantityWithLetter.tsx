import React, { useState, useEffect, useRef } from "react";
import { convertNumberToLetters } from "../utils/numberToLetters";
import { 
  Copy, 
  Check, 
  Receipt, 
  Calendar, 
  User, 
  DollarSign, 
  HelpCircle,
  FileSpreadsheet,
  Signature,
  Volume2,
  Trash2,
  Star,
  Sparkles,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  Landmark,
  ListRestart,
  Share2
} from "lucide-react";

interface CurrencyConfig {
  code: string;
  name: string;
  plural: string;
  centName: string;
  centPlural: string;
  symbol: string;
  suffix: string;
}

interface QuantityHistoryItem {
  id: string;
  amount: string;
  result: string;
  currencyCode: string;
  timestamp: string;
  isFavorite?: boolean;
}

const CURRENCIES: CurrencyConfig[] = [
  { code: "MXN", name: "Peso Mexicano", plural: "pesos", centName: "centavo", centPlural: "centavos", symbol: "$", suffix: "M.N." },
  { code: "USD", name: "Dólar Americano", plural: "dólares", centName: "centavo", centPlural: "centavos", symbol: "$", suffix: "USD" },
  { code: "EUR", name: "Euro", plural: "euros", centName: "céntimo", centPlural: "céntimos", symbol: "€", suffix: "" },
  { code: "COP", name: "Peso Colombiano", plural: "pesos", centName: "centavo", centPlural: "centavos", symbol: "$", suffix: "M/CTE" },
  { code: "PEN", name: "Sol Peruano", plural: "soles", centName: "céntimo", centPlural: "céntimos", symbol: "S/", suffix: "y CTS." },
  { code: "ARS", name: "Peso Argentino", plural: "pesos", centName: "centavo", centPlural: "centavos", symbol: "$", suffix: "ARS" },
  { code: "CLP", name: "Peso Chileno", plural: "pesos", centName: "centavo", centPlural: "centavos", symbol: "$", suffix: "CLP" },
  { code: "VES", name: "Bolívar Venezolano", plural: "bolívares", centName: "céntimo", centPlural: "céntimos", symbol: "Bs.S", suffix: "V.S." },
  { code: "BOB", name: "Boliviano", plural: "bolivianos", centName: "centavo", centPlural: "centavos", symbol: "Bs", suffix: "BOB" },
  { code: "GTQ", name: "Quetzal Guatemalteco", plural: "quetzales", centName: "centavo", centPlural: "centavos", symbol: "Q", suffix: "GTQ" },
  { code: "CRC", name: "Colón Costarricense", plural: "colones", centName: "céntimo", centPlural: "céntimos", symbol: "₡", suffix: "CRC" },
  { code: "HNL", name: "Lempira Hondureño", plural: "lempiras", centName: "centavo", centPlural: "centavos", symbol: "L", suffix: "HNL" },
  { code: "NIO", name: "Córdoba Nicaragüense", plural: "córdobas", centName: "centavo", centPlural: "centavos", symbol: "C$", suffix: "NIO" },
  { code: "PYG", name: "Guaraní Paraguayo", plural: "guaraníes", centName: "centavo", centPlural: "centavos", symbol: "₲", suffix: "PYG" },
  { code: "UYU", name: "Peso Uruguayo", plural: "pesos", centName: "centésimo", centPlural: "centésimos", symbol: "$U", suffix: "UYU" },
  { code: "DOP", name: "Peso Dominicano", plural: "pesos", centName: "centavo", centPlural: "centavos", symbol: "RD$", suffix: "DOP" }
];

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

export default function QuantityWithLetter({ initialAmount }: { initialAmount?: string }) {
  const [amount, setAmount] = useState(initialAmount || "1540.50");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyConfig>(() => {
    try {
      const savedCode = localStorage.getItem("saved_currency_code");
      if (savedCode) {
        const found = CURRENCIES.find(c => c.code === savedCode);
        if (found) return found;
      }
    } catch (e) {}
    return CURRENCIES[0];
  });

  // Sync with incoming prop for deep links or query parameters on mount
  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
    } else {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const n = urlParams.get("n") || urlParams.get("amount");
        if (n) {
          setAmount(n);
        }
      } catch (e) {
        // Ignore fallback
      }
    }
  }, [initialAmount]);

  // Sync amount state with browser URL search parameters and document.title in real time (debounced)
  useEffect(() => {
    const rawVal = amount.trim();
    if (typeof document !== "undefined") {
      if (rawVal && !isNaN(Number(rawVal.replace(/[^0-9.-]/g, '')))) {
        document.title = `¿Cómo se escribe ${rawVal} en letras? | Cantidad con Letra`;
      } else {
        document.title = "Conversor de Cantidad con Letra | Escribir Números en Palabras";
      }
    }

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
  }, [amount]);
  const [isFinancialFormat, setIsFinancialFormat] = useState(true);
  const [recipient, setRecipient] = useState("Juan Pérez Maldonado");
  const [city, setCity] = useState("Ciudad de México");
  const [chequeNumber, setChequeNumber] = useState("10024921");
  const [signatureStyle, setSignatureStyle] = useState<'elegant' | 'modern' | 'none'>('elegant');
  
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  
  // Advanced controls
  const [numberFormatStyle, setNumberFormatStyle] = useState<'LA' | 'ES'>('LA');
  const [currencyRegion, setCurrencyRegion] = useState<"all" | "north-central" | "south" | "europe">("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load local quantity history
  const [history, setHistory] = useState<QuantityHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("quantity_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Set current date in Spanish format on mount
  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('es-ES', options));
    
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("quantity_history", JSON.stringify(history));
  }, [history]);

  // Toast Notification handler
  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    setToastVisible(true);
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  };

  // Clipboard direct paste capability
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        // Extract digits, dots, commas, negative sign
        const cleaned = text.replace(/[^0-9.,-]/g, "").trim();
        if (cleaned) {
          setAmount(cleaned);
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

  // Compute conversion with advanced input cleanser
  useEffect(() => {
    const rawVal = amount.trim();
    if (!rawVal) {
      setResult("");
      return;
    }

    // Smart cleaning: support spaces, currency symbols, and convert commas to standard decimals
    let cleanAmount = rawVal.replace(/[^0-9.,-]/g, ""); // strip symbols, spaces
    
    // Auto-detect ES / EU format: dots for thousands, comma for decimal (e.g. 1.234,56)
    const isEsFormat = numberFormatStyle === 'ES' || 
      (cleanAmount.includes(",") && !cleanAmount.includes(".") && cleanAmount.indexOf(",") === cleanAmount.length - 3) ||
      (cleanAmount.includes(",") && cleanAmount.includes(".") && cleanAmount.indexOf(",") > cleanAmount.indexOf("."));

    if (isEsFormat) {
      cleanAmount = cleanAmount.replace(/\./g, "").replace(/,/g, ".");
    } else {
      cleanAmount = cleanAmount.replace(/,/g, "");
    }

    if (isNaN(Number(cleanAmount)) && cleanAmount !== "-") {
      setResult("Importe no válido");
      return;
    }

    try {
      const formatted = convertNumberToLetters(cleanAmount, {
        gender: 'N', // neutral "un mil" / "un peso" is standard for finance
        isCurrency: true,
        currencyName: selectedCurrency.plural,
        currencyCentName: selectedCurrency.centPlural,
        formatFinancial: isFinancialFormat
      });

      let finalResult = formatted;
      if (isFinancialFormat && selectedCurrency.suffix) {
        if (!formatted.endsWith(selectedCurrency.suffix)) {
          finalResult = formatted.replace("M.N.", selectedCurrency.suffix);
        }
      }

      setResult(finalResult);
    } catch (e) {
      setResult("Error en la conversión de importe");
    }
  }, [amount, selectedCurrency, isFinancialFormat, numberFormatStyle]);

  // Audio Pronunciation TTS
  const handleSpeak = () => {
    if (!result || result.startsWith("Importe") || result.startsWith("Error")) return;
    
    if (!synthRef.current) {
      showToast("La síntesis de voz no está disponible en este navegador");
      return;
    }

    if (speaking) {
      synthRef.current.cancel();
      setSpeaking(false);
      return;
    }

    // Prepare speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(result);
    utteranceRef.current = utterance;
    
    // Attempt to set a Spanish voice
    const voices = synthRef.current.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith("es-") || v.lang.startsWith("es_"));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    utterance.lang = "es-ES";
    utterance.rate = 0.95; // slightly slower for professional reading of numbers

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
    };

    setSpeaking(true);
    synthRef.current.speak(utterance);
  };

  const handleCopy = () => {
    if (!result || result.startsWith("Importe") || result.startsWith("Error")) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    showToast("✓ Copiado al portapapeles correctamente");
    
    // Save to history automatically on copy to preserve user work
    saveToHistory(amount, result);
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const rawVal = amount.trim();
    if (!rawVal || isNaN(Number(rawVal.replace(/[^0-9.-]/g, "")))) return;
    
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${window.location.origin}/cantidad-con-letra?amount=${encodeURIComponent(rawVal)}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Cantidad con Letra",
        text: `La cantidad de ${selectedCurrency.symbol}${rawVal} expresada en letras es: "${result}"`,
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

  const saveToHistory = (amt: string, textStr: string) => {
    if (!amt || amt === "-" || isNaN(Number(amt.replace(/[^0-9.-]/g, ""))) || textStr.startsWith("Importe") || textStr.startsWith("Error")) return;
    
    setHistory((prev) => {
      // Avoid duplicate consecutive additions
      if (prev.length > 0 && prev[0].amount === amt && prev[0].currencyCode === selectedCurrency.code) {
        return prev;
      }
      const newItem: QuantityHistoryItem = {
        id: Date.now().toString(),
        amount: amt,
        result: textStr,
        currencyCode: selectedCurrency.code,
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
      };
      const updated = [newItem, ...prev].slice(0, 30); // Keep last 30
      localStorage.setItem("quantity_history", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const isFavNow = !item.isFavorite;
          showToast(isFavNow ? "Guardado en favoritos ★" : "Quitado de favoritos");
          return { ...item, isFavorite: isFavNow };
        }
        return item;
      });
      localStorage.setItem("quantity_history", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    const hasFavorites = history.some(item => item.isFavorite);
    if (hasFavorites) {
      setHistory((prev) => {
        const filtered = prev.filter(item => item.isFavorite);
        localStorage.setItem("quantity_history", JSON.stringify(filtered));
        showToast("Historial borrado, conservando tus favoritos ★");
        return filtered;
      });
    } else {
      setHistory([]);
      localStorage.removeItem("quantity_history");
      showToast("Historial borrado");
    }
  };

  const handleRemoveHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      const filtered = prev.filter(item => item.id !== id);
      localStorage.setItem("quantity_history", JSON.stringify(filtered));
      showToast("Elemento eliminado del historial");
      return filtered;
    });
  };

  // Helper to format currency values with commas/dots
  const getFormattedNumber = (valStr: string, style: 'LA' | 'ES') => {
    if (!valStr || isNaN(Number(valStr))) return "0.00";
    const num = Number(valStr);
    
    if (style === 'ES') {
      // European system: dots for thousands, comma for decimal
      return num.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      // American system: commas for thousands, dot for decimal
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-14 animate-fade-in text-left">
      
      {/* Toast Notification HUD */}
      {toastVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 border border-slate-800 animate-scale-up">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Decorative Emerald Blur Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 -right-4 w-72 h-72 bg-teal-300/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-12 relative">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border border-emerald-100 shadow-xs">
          <Receipt className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-display tracking-wide uppercase text-[10px]">Formato Oficial de Cantidad con Letra</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-emerald-950 to-teal-950 bg-clip-text">
          Conversor de Cantidad con Letra
        </h1>
        <p className="font-sans text-gray-600 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
          Escribe importes numéricos y genera su transcripción oficial de <strong>cantidad con letra</strong>. Ideal para llenar cheques con su respectiva <strong>cantidad con letra</strong>, redactar pagarés, redactar contratos y emitir facturas sin cometer errores ortográficos en la <strong>cantidad con letra</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        
        {/* Left Side: Input Configuration Panel (Col-span 4) */}
        <div className="lg:col-span-4 bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-xl shadow-gray-100/30 p-6 space-y-6 relative">
          <h3 className="font-sans font-bold text-gray-900 text-sm border-b border-gray-100 pb-4 flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><FileSpreadsheet className="w-4 h-4" /></span>
            Ajustes de Cantidad con Letra
          </h3>

          {/* Amount input */}
          <div>
            <label htmlFor="amount-input" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Importe de la Cantidad con Letra
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-lg font-bold">
                {selectedCurrency.symbol}
              </span>
              <input
                id="amount-input"
                ref={inputRef}
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,\s-]/g, ''))}
                placeholder="1540.50"
                className="w-full bg-gray-50/50 border border-gray-200 focus:border-emerald-500 focus:bg-white text-gray-950 font-mono font-bold text-lg rounded-2xl pl-10 pr-20 py-3 outline-hidden transition-all duration-300 shadow-xs focus:ring-4 focus:ring-emerald-500/5"
                title="Escribe un importe numérico para generar la cantidad con letra correspondiente"
              />
              <button
                onClick={handlePaste}
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border border-emerald-100/50"
                title="Pegar desde el portapapeles"
              >
                Pegar
              </button>
            </div>

            {/* Quick Amount Selector */}
            <p className="text-[10px] text-gray-400 mt-2.5 mb-1.5 font-sans">Elige un ejemplo para ver su <strong>cantidad con letra</strong>:</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "$500", val: "500" },
                { label: "$2,500.25", val: "2500.25" },
                { label: "$10,000", val: "10000" },
                { label: "$1.5M", val: "1500000" }
              ].map((val) => (
                <button
                  key={val.val}
                  onClick={() => {
                    setAmount(val.val);
                    showToast(`Cantidad fijada: ${selectedCurrency.symbol}${val.val}`);
                  }}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 transition-all cursor-pointer border border-gray-100"
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          {/* Currency select */}
          <div>
            <label htmlFor="currency-select" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Divisa / Moneda de América y Europa
            </label>
            
            {/* Quick Popular LATAM Switcher */}
            <div className="mb-3">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Accesos Rápidos LATAM</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { code: "MXN", name: "México" },
                  { code: "USD", name: "EE.UU. (USD)" },
                  { code: "COP", name: "Colombia" },
                  { code: "PEN", name: "Perú" },
                  { code: "CLP", name: "Chile" },
                  { code: "ARS", name: "Argentina" }
                ].map((item) => {
                  const preset = CURRENCIES.find(c => c.code === item.code);
                  const info = CURRENCY_INFO[item.code];
                  if (!preset) return null;
                  const isSelected = selectedCurrency.code === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setSelectedCurrency(preset);
                        try {
                          localStorage.setItem("saved_currency_code", item.code);
                        } catch (e) {}
                        showToast(`Moneda cambiada a: ${preset.name} (${info.flag})`);
                      }}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-600 border-emerald-700 text-white shadow-xs"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      <span>{info?.flag}</span>
                      <span>{item.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Region Selector Tabs */}
            <div className="mb-3">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Categorías de Divisas</span>
              <div className="flex flex-wrap gap-1 border-b border-gray-100 pb-2">
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
                    className={`text-[10px] px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
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

            <select
              id="currency-select"
              value={selectedCurrency.code}
              onChange={(e) => {
                const found = CURRENCIES.find(c => c.code === e.target.value);
                if (found) {
                  setSelectedCurrency(found);
                  try {
                    localStorage.setItem("saved_currency_code", found.code);
                  } catch (err) {}
                  showToast(`Moneda cambiada a: ${found.name}`);
                }
              }}
              className="w-full bg-gray-50/50 border border-gray-200 focus:border-emerald-500 focus:bg-white text-gray-950 font-sans font-medium text-sm rounded-2xl px-4 py-3 outline-hidden transition-all cursor-pointer shadow-xs focus:ring-4 focus:ring-emerald-500/5"
            >
              {CURRENCIES.filter((c) => currencyRegion === "all" || getCurrencyGroup(c.code) === currencyRegion).map((c) => {
                const info = CURRENCY_INFO[c.code] || { flag: "🏳️" };
                return (
                  <option key={c.code} value={c.code}>
                    {info.flag} {c.name} ({c.code})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Decimal/Thousands separator system */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Separadores para la Cantidad con Letra
            </label>
            <p className="text-[10px] text-gray-400 mb-2 font-sans">
              Define los separadores que estructuran la cifra antes de traducirla a <strong>cantidad con letra</strong> final:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setNumberFormatStyle('LA');
                  showToast("Formato fijado: 1,234.56 (LA/USA)");
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  numberFormatStyle === 'LA'
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                    : "bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                1,234.56 (Punto)
              </button>
              <button
                onClick={() => {
                  setNumberFormatStyle('ES');
                  showToast("Formato fijado: 1.234,56 (España/EU)");
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  numberFormatStyle === 'ES'
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                    : "bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                1.234,56 (Coma)
              </button>
            </div>
          </div>

          {/* Format style toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Estilo de la Cantidad con Letra
            </label>
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setIsFinancialFormat(true);
                  showToast("Estilo fijado: Formato Bancario");
                }}
                className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                  isFinancialFormat 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 shadow-xs" 
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div>
                  <span className="block text-xs font-bold">Formato Bancario (Cantidad con Letra RAE)</span>
                  <span className="block text-[10px] opacity-80 mt-0.5">Ej: ... pesos 50/100 M.N. en <strong>cantidad con letra</strong></span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isFinancialFormat ? "border-emerald-500 bg-emerald-600" : "border-gray-300"}`}>
                  {isFinancialFormat && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              <button
                onClick={() => {
                  setIsFinancialFormat(false);
                  showToast("Estilo fijado: Formato Completo Escrito");
                }}
                className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                  !isFinancialFormat 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 shadow-xs" 
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div>
                  <span className="block text-xs font-bold">Escrito Completo (Cantidad con Letra Desglosada)</span>
                  <span className="block text-[10px] opacity-80 mt-0.5">Ej: ... con cincuenta centavos en su <strong>cantidad con letra</strong></span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${!isFinancialFormat ? "border-emerald-500 bg-emerald-600" : "border-gray-300"}`}>
                  {!isFinancialFormat && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Output Panel, Interactive Cheque, and History Columns (Col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main output card */}
          <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-xl shadow-gray-100/30 p-6 sm:p-7 relative">
            <div className="flex items-center justify-between mb-3.5">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Resultado Oficial de su Cantidad con Letra
              </span>
              
              {result && !result.startsWith("Importe") && !result.startsWith("Error") && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                    {result.split(/\s+/).filter(Boolean).length} palabras de <strong>cantidad con letra</strong>
                  </span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                    {result.length} caracteres
                  </span>
                </div>
              )}
            </div>

            <div 
              onDoubleClick={handleCopy}
              className="bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border border-emerald-100/70 rounded-2xl p-5 relative group transition-all duration-300 shadow-inner cursor-pointer"
              title="Haz doble clic para copiar el resultado rápidamente"
            >
              <p className="font-display font-extrabold text-emerald-950 text-xl sm:text-2xl leading-relaxed pr-24 break-words text-left">
                {result || "Ingresa un importe para ver la cantidad con letra..."}
              </p>
              
              <span className="hidden sm:inline-block absolute bottom-3 left-5 font-sans text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                🖮 Haz doble clic para copiar rápidamente
              </span>

              {/* Text-To-Speech Equalizer Animation */}
              {speaking && (
                <div className="flex items-center space-x-1.5 mt-3.5 bg-emerald-100/60 border border-emerald-200/50 rounded-lg px-3 py-1.5 w-fit">
                  <div className="flex items-end space-x-0.5 h-3">
                    <div className="w-1 bg-emerald-600 rounded-xs h-2 animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 bg-emerald-600 rounded-xs h-3 animate-bounce" style={{ animationDelay: '0.3s' }} />
                    <div className="w-1 bg-emerald-600 rounded-xs h-1 animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <div className="w-1 bg-emerald-600 rounded-xs h-2 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-[10px] text-emerald-800 font-mono font-semibold uppercase tracking-wider">Leyendo en voz alta...</span>
                </div>
              )}

              {result && !result.startsWith("Importe") && !result.startsWith("Error") && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1.5">
                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer border bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-gray-200 shadow-xs hover:scale-105 active:scale-95"
                    title="Compartir esta conversión"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* TTS Voice button */}
                  <button
                    onClick={handleSpeak}
                    className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                      speaking 
                        ? "bg-emerald-600 border-emerald-700 text-white shadow-md animate-pulse scale-95" 
                        : "bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-gray-200 shadow-xs hover:scale-105 active:scale-95"
                    }`}
                    title="Escuchar la pronunciación de la cantidad con letra"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                      copied 
                        ? "bg-emerald-600 border-emerald-700 text-white shadow-md shadow-emerald-500/15" 
                        : "bg-white text-emerald-600 hover:text-emerald-800 hover:bg-gray-50 border-gray-200 shadow-xs hover:scale-105 active:scale-95"
                    }`}
                    title="Copiar la cantidad con letra al portapapeles"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Check Mockup Card */}
          <div className="bg-amber-50/15 border border-amber-100/40 rounded-3xl p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h4 className="font-sans font-bold text-gray-600 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span>Simulador de Llenado de Cheques con Cantidad con Letra</span>
                <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-mono font-bold">Contabilidad</span>
              </h4>

              {/* Signature Style Picker */}
              <div className="flex items-center space-x-1 bg-white border border-gray-200 p-1 rounded-xl text-[10px] font-sans">
                <span className="text-gray-400 px-2 font-medium">Firma:</span>
                <button
                  onClick={() => setSignatureStyle('elegant')}
                  className={`px-2 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                    signatureStyle === 'elegant' ? "bg-amber-100 text-amber-900" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Cursiva
                </button>
                <button
                  onClick={() => setSignatureStyle('modern')}
                  className={`px-2 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                    signatureStyle === 'modern' ? "bg-slate-900 text-white" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Digital
                </button>
                <button
                  onClick={() => setSignatureStyle('none')}
                  className={`px-2 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                    signatureStyle === 'none' ? "bg-red-50 text-red-700" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Sin firma
                </button>
              </div>
            </div>

            {/* Check Paper Container */}
            <div className="bg-radial from-slate-50 to-emerald-50/30 border-2 border-emerald-600/20 rounded-3xl p-5 sm:p-6 shadow-lg shadow-emerald-900/5 text-left font-mono relative overflow-hidden max-w-full">
              {/* Subtle background security patterns */}
              <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex flex-wrap text-[7px] text-slate-900 leading-none">
                {Array(60).fill("CANTIDAD CON LETRA VALIDADA DE PRUEBA ").map((t, idx) => (
                  <span key={idx} className="mr-4 mb-4">{t}</span>
                ))}
              </div>

              {/* Decorative Watermark Seals */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-600/5 rounded-full blur-2xl pointer-events-none" />

              {/* Check Header */}
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-dashed border-gray-300 pb-3 mb-4">
                <div>
                  <h5 className="font-sans font-black text-emerald-800 text-sm tracking-wide flex items-center gap-1.5 uppercase">
                    <Landmark className="w-4 h-4 text-emerald-600" />
                    BANCO DE LA ORTOGRAFÍA S.A.
                  </h5>
                  <p className="text-[9px] text-gray-400 font-sans mt-0.5">Sucursal Digital 001 - {city}</p>
                </div>
                
                {/* Cheque number input */}
                <div className="text-right bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-gray-200 shadow-xs flex items-center space-x-1">
                  <span className="text-[10px] text-gray-400 font-sans">No.</span>
                  <input 
                    type="text"
                    value={chequeNumber}
                    onChange={(e) => setChequeNumber(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-16 bg-transparent border-none font-sans font-bold text-xs p-0 text-right text-gray-800 outline-hidden focus:ring-0 focus:outline-hidden focus:border-none"
                    placeholder="10024921"
                    title="Editar número de cheque"
                  />
                </div>
              </div>

              {/* Check Rows */}
              <div className="relative z-10 space-y-3.5 text-xs text-gray-700">
                {/* City and Date / Amount Row */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                  <div className="flex-1 flex items-center gap-1.5 border-b border-gray-300/80 pb-1">
                    <span className="text-[9px] text-gray-400 font-sans shrink-0 uppercase">Lugar y Fecha:</span>
                    <input 
                      type="text" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      className="bg-transparent border-0 font-sans text-xs focus:ring-0 focus:outline-hidden p-0 m-0 w-28 text-gray-800 font-bold shrink-0 border-b border-dashed border-gray-200 focus:border-emerald-600" 
                      title="Haz clic para editar la ciudad"
                    />
                    <span className="text-gray-800 font-sans font-medium text-xs truncate">
                      {currentDate ? `, ${currentDate}` : ""}
                    </span>
                  </div>

                  <div className="w-full sm:w-48 flex items-center gap-1.5 bg-white border border-emerald-600/20 px-3 py-1.5 rounded-xl shadow-xs">
                    <span className="font-bold text-emerald-700 font-sans">{selectedCurrency.symbol}</span>
                    <span className="font-bold text-gray-800 text-sm truncate flex-1 text-right font-mono">
                      {getFormattedNumber(amount.replace(/[^0-9.-]/g, ""), numberFormatStyle)}
                    </span>
                    {selectedCurrency.code && (
                      <span className="text-[9px] font-bold text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-md bg-gray-50 font-sans">
                        {selectedCurrency.code}
                      </span>
                    )}
                  </div>
                </div>

                {/* Recipient Row */}
                <div className="flex items-center gap-2 border-b border-gray-300/80 pb-1">
                  <span className="text-[9px] text-gray-400 font-sans shrink-0 uppercase flex items-center gap-0.5">
                    <User className="w-3 h-3 text-gray-300" /> Páguese a la orden de:
                  </span>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Nombre del beneficiario"
                    className="flex-1 bg-transparent border-none font-sans text-xs focus:ring-0 focus:outline-hidden p-0 font-bold text-gray-800 placeholder-gray-300"
                    title="Haz clic para editar el beneficiario"
                  />
                </div>

                {/* Amount in letters Row */}
                <div className="flex items-start gap-2 border-b border-gray-300/80 pb-1 min-h-[30px]">
                  <span className="text-[9px] text-gray-400 font-sans shrink-0 uppercase mt-0.5">Cantidad con Letra:</span>
                  <p className="flex-1 font-sans text-xs font-bold text-emerald-800 leading-normal pl-2 border-l-2 border-emerald-500/20 break-words text-left">
                    {result || "--------------------------------------------------------"}
                  </p>
                </div>

                {/* Signature Row */}
                <div className="flex justify-between items-end pt-4">
                  {/* MICR Bank Codes */}
                  <div className="font-mono text-[9px] sm:text-xs text-gray-400 tracking-wider font-medium select-none">
                    ⑆ 012345678 ⑇ 9876543210 ⑈ {chequeNumber || "1001"} | CANTIDAD CON LETRA COHERENTE
                  </div>

                  {/* Signature field */}
                  <div className="text-center w-36 sm:w-44 border-t border-gray-300 pt-1.5 relative">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 select-none h-6 flex items-center justify-center">
                      {signatureStyle === 'elegant' && (
                        <span className="font-serif tracking-widest text-emerald-700 font-black text-base italic rotate-[-4deg]" style={{ fontFamily: 'Georgia, serif' }}>
                          NL.Letras
                        </span>
                      )}
                      {signatureStyle === 'modern' && (
                        <span className="font-mono text-[10px] text-slate-800 font-bold bg-slate-150 border border-slate-300/60 rounded px-1.5 py-0.5 uppercase tracking-tighter">
                          SECURE_ID_{chequeNumber || "1001"}
                        </span>
                      )}
                      {signatureStyle === 'none' && (
                        <span className="text-[9px] text-red-400 font-normal font-sans">Sin firma</span>
                      )}
                    </div>
                    <span className="text-[8px] text-gray-400 font-sans uppercase tracking-widest block">Firma del Emisor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Conversion History */}
          <div className="bg-gray-50/40 rounded-3xl border border-gray-100 p-6 flex flex-col max-h-[480px]">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2 text-gray-800">
                <RefreshCw className="w-4 h-4 text-emerald-500" />
                <h3 className="font-sans font-bold text-sm tracking-tight text-gray-900">Historial de Cantidad con Letra</h3>
              </div>
              {history.length > 0 && (
                <button 
                  onClick={handleClearHistory}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer flex items-center gap-1 bg-red-50 hover:bg-red-100/80 px-2 py-1 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Borrar Todo
                </button>
              )}
            </div>

            {history.length > 0 && (
              <div className="mb-3 relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchHistoryQuery}
                  onChange={(e) => setSearchHistoryQuery(e.target.value)}
                  placeholder="Buscar cantidad con letra o cifra..."
                  className="w-full bg-white border border-gray-200/80 focus:border-emerald-500 focus:bg-white rounded-xl pl-9 pr-4 py-1.5 text-xs outline-hidden transition-all duration-200 placeholder:text-gray-400 font-sans focus:ring-4 focus:ring-emerald-500/5 shadow-xs"
                />
              </div>
            )}

            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <ListRestart className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-xs text-gray-400 font-sans">No hay ninguna cantidad con letra guardada aún</p>
                <p className="text-[10px] text-gray-400/80 font-sans max-w-[200px] mt-1">Usa el botón de copiar para guardar automáticamente tu cantidad con letra.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[300px] text-left">
                {[...history]
                  .sort((a, b) => {
                    if (a.isFavorite && !b.isFavorite) return -1;
                    if (!a.isFavorite && b.isFavorite) return 1;
                    return 0;
                  })
                  .filter((item) => {
                    if (!searchHistoryQuery) return true;
                    const query = searchHistoryQuery.toLowerCase();
                    return item.amount.toLowerCase().includes(query) || item.result.toLowerCase().includes(query);
                  })
                  .map((item) => {
                    const matchedCurrency = CURRENCIES.find(c => c.code === item.currencyCode) || CURRENCIES[0];
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setAmount(item.amount);
                          setSelectedCurrency(matchedCurrency);
                          showToast(`Restaurado: ${matchedCurrency.symbol}${item.amount}`);
                        }}
                        className={`group border rounded-xl p-3 cursor-pointer text-left transition-all flex items-start justify-between shadow-xs ${
                          item.isFavorite
                            ? "bg-amber-50/20 border-amber-200/50 hover:bg-amber-50/40"
                            : "bg-white hover:bg-emerald-50/10 border-gray-200/50 hover:border-emerald-100"
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-emerald-700 break-words block">
                              {matchedCurrency.symbol} {getFormattedNumber(item.amount, numberFormatStyle)}
                              <span className="ml-1 text-[9px] font-sans font-normal text-gray-400">({item.currencyCode})</span>
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono">{item.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 font-sans truncate mt-0.5">
                            {item.result}
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
                    );
                  })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Usage guide details */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 text-left space-y-6">
        <h3 className="font-sans font-bold text-gray-900 text-lg flex items-center gap-2">
          <span className="p-1.5 bg-emerald-50 rounded-xl text-emerald-600"><HelpCircle className="w-5 h-5" /></span>
          <span>¿Cómo escribir una cantidad con letra correctamente?</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 font-sans">
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800">1. Formato de centavos en la cantidad con letra</h4>
            <p className="leading-relaxed text-xs">
              En el ámbito mercantil y bancario, al redactar una <strong>cantidad con letra</strong> para cheques o pagarés (especialmente en México, Colombia, etc.), los centavos se escriben como una fracción sobre 100. Así, la <strong>cantidad con letra</strong> de <strong>$1,540.50</strong> se estructura de esta forma:
            </p>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200/60 font-mono text-xs text-gray-700">
              ... pesos 50/100 M.N.
            </div>
            <p className="leading-relaxed text-xs text-gray-400">
              La abreviatura "M.N." en su <strong>cantidad con letra</strong> significa <em>Moneda Nacional</em>. Para transcribir la <strong>cantidad con letra</strong> en dólares americanos, se suele complementar con "USD", y para euros simplemente con la palabra "Euros".
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-gray-800">2. Conector "de" para millones en cantidad con letra</h4>
            <p className="leading-relaxed text-xs">
              Si la cifra es un número redondo de millones (como <strong>$2,000,000.00</strong>), las normas gramaticales de la RAE exigen que la <strong>cantidad con letra</strong> use la preposición <strong>"de"</strong> entre la palabra millones y el nombre de la divisa:
            </p>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200/60 font-mono text-xs text-gray-700">
              Dos millones <strong>de</strong> pesos 00/100 M.N.
            </div>
            <p className="leading-relaxed text-xs text-gray-400">
              Si la <strong>cantidad con letra</strong> incluye aunque sea un centavo (como <strong>$2,000,000.50</strong>), deja de considerarse una cifra redonda en unidades de millón y se escribe: <em>Dos millones de pesos con cincuenta centavos</em> como su <strong>cantidad con letra</strong> completa.
            </p>
          </div>
        </div>

        {/* Custom Section 3 to ensure extremely high content-matching SEO and keyword density for 'cantidad con letra' */}
        <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 font-sans">
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800">3. Validez legal y jurídica de la cantidad con letra</h4>
            <p className="leading-relaxed text-xs">
              En cualquier contrato legal, pagaré o cheque de banco, si existe alguna discrepancia o diferencia entre la cifra en números y la <strong>cantidad con letra</strong> escrita, la ley de títulos y operaciones de crédito dictamina que el valor que prevalece es siempre la <strong>cantidad con letra</strong>. Esto otorga a la <strong>cantidad con letra</strong> una jerarquía legal superior, ya que escribir una <strong>cantidad con letra</strong> reduce drásticamente las posibilidades de falsificación, manipulación maliciosa o malentendidos tipográficos.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-gray-800">4. Mayúsculas y ortografía en la cantidad con letra</h4>
            <p className="leading-relaxed text-xs">
              Se recomienda por seguridad bancaria que la <strong>cantidad con letra</strong> en cheques inicie con letra mayúscula y se selle al final con una línea horizontal para evitar adiciones. Por ejemplo: <em>"Un mil quinientos pesos..."</em>. Nuestro conversor optimiza automáticamente la ortografía de cada <strong>cantidad con letra</strong> generada según las directrices vigentes de la Real Academia Española (RAE) para que nunca tengas dudas al redactar tu <strong>cantidad con letra</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section for Cantidad con Letra */}
      <div className="mt-12 bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 text-left space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="font-sans font-bold text-gray-900 text-lg flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 rounded-xl text-emerald-600"><HelpCircle className="w-5 h-5" /></span>
            <span>Preguntas Frecuentes sobre Cantidad con Letra</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Respuestas prácticas y jurídicas sobre cómo redactar correctamente cantidades de dinero con letra para fines bancarios y comerciales.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "¿Qué significa la abreviatura 'M.N.' en una cantidad con letra?",
              a: "Significa 'Moneda Nacional' y se escribe principalmente en México para estipular que el cobro o transacción se liquidará en pesos mexicanos (moneda del curso legal en el territorio), evitando confusiones con monedas extranjeras."
            },
            {
              q: "¿Cómo se escribe una cantidad con letra para un cheque en dólares?",
              a: "Para transacciones oficiales en dólares estadounidenses, se utiliza la cantidad en letras, seguida de la porción centenaria sobre cien y la sigla 'USD' o 'L.C.' (Moneda Legal). Por ejemplo: 'Un mil quinientos dólares 50/100 USD'."
            },
            {
              q: "¿Es obligatorio poner 'un mil' o se puede escribir simplemente 'mil'?",
              a: "Ortográficamente, escribir 'mil' es correcto y preferido por la RAE en el lenguaje ordinario. No obstante, en la emisión de cheques y documentos mercantiles, la práctica bancaria recomienda anteponer 'un mil' para evitar alteraciones fraudulentas (ej. que alguien agregue 'diez' o 'veinte' delante de la palabra 'mil')."
            },
            {
              q: "¿Cómo se expresan los centavos en facturas y cheques?",
              a: "En facturas y cheques de la mayoría de países latinoamericanos se utiliza el formato formal fraccionario 'XX/100' (por ejemplo: 'Dos mil pesos 50/100 M.N.'), lo que indica que hay cincuenta centésimos o cincuenta centavos."
            },
            {
              q: "¿Qué valor prevalece si la cifra en número y la cantidad con letra no coinciden?",
              a: "De acuerdo con el derecho cambiario internacional y los reglamentos de títulos de crédito de prácticamente todos los países, en caso de cualquier discrepancia entre el número digital y la expresión en letras, el valor que prevalece legalmente es siempre el redactado en letras."
            }
          ].map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen ? "border-emerald-200 bg-emerald-50/10 shadow-xs" : "border-gray-100 hover:bg-gray-50/30"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left font-sans font-semibold text-xs sm:text-sm text-gray-800 hover:text-gray-950 gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className={`shrink-0 p-1 rounded-lg transition-colors ${isOpen ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
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
    </div>
  );
}
