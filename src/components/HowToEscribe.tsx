import { useState } from "react";
import { convertNumberToLetters } from "../utils/numberToLetters";
import { 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Sparkles,
  Award,
  HelpCircle,
  FileText,
  Copy,
  Check,
  CheckCircle,
  Hash,
  ListOrdered,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  q: string;
  a: string;
  keyword: string;
}

interface CommonNumLink {
  num: number;
  label: string;
  text: string;
}

// Helper to convert integer (1-3999) to Roman Numerals
function toRoman(num: number): string {
  if (num < 1 || num > 3999) return "Solo disponible para rango 1 a 3,999";
  const romanMap: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
  ];
  let result = "";
  let remaining = num;
  for (const [val, char] of romanMap) {
    while (remaining >= val) {
      result += char;
      remaining -= val;
    }
  }
  return result;
}

// Helper to convert integer (1-100) to Spanish Ordinal words
function toOrdinal(num: number): string {
  if (num < 1 || num > 100) return "Solo disponible para rango 1 a 100";
  const ordinals1_9 = ["", "primero", "segundo", "tercero", "cuarto", "quinto", "sexto", "séptimo", "octavo", "noveno"];
  const ordinals10_90 = ["", "décimo", "vigésimo", "trigésimo", "cuadragésimo", "quincuagésimo", "sexagésimo", "septuagésimo", "octogésimo", "nonagésimo"];
  
  if (num === 100) return "centésimo";
  
  const t = Math.floor(num / 10);
  const u = num % 10;
  
  let result = "";
  if (t > 0) result += ordinals10_90[t];
  if (u > 0) result += (result ? " " : "") + ordinals1_9[u];
  
  return result;
}

// RAE Golden Rules Generator
function getSpellingRule(num: number): string {
  if (num === 0) {
    return "Se escribe como 'cero'. Gramaticalmente es un sustantivo masculino cuyo plural es 'ceros'. No tiene valor cardinal de cantidad sino de ausencia.";
  }
  if (num >= 1 && num <= 15) {
    return "Los números del 1 al 15 se escriben siempre con una sola palabra propia y única heredada del latín ('uno', 'once', 'quince'...).";
  }
  if (num >= 16 && num <= 19) {
    return "Se escriben refundidos en una sola palabra: fusión de la decena 'diez' con la unidad mediante la letra 'i' ('dieciséis', 'dieciocho'). Lleva tilde obligatoria en la última vocal si es palabra aguda terminada en s o vocal (como 'dieciséis').";
  }
  if (num === 20) {
    return "Se escribe como 'veinte'. Al formar combinaciones decimales, pierde su última vocal 'e' y se une como el prefijo 'veinti-' (ej. 'veintitrés').";
  }
  if (num >= 21 && num <= 29) {
    return "¡Regla especial! Los números del 21 al 29 se escriben SIEMPRE unidos en una sola palabra (ej: 'veintidós', 'veintiocho'). Además, recuerda acentuar ortográficamente 'veintidós', 'veintitrés' y 'veintiséis' por ser palabras agudas.";
  }
  if (num === 30) {
    return "Se escribe como 'treinta' de forma individual.";
  }
  if (num >= 31 && num <= 99) {
    const u = num % 10;
    if (u === 0) {
      return "Las decenas puras (30, 40, 50, 60, 70, 80, 90) se escriben con una sola palabra de forma compacta (ej: 'cuarenta', 'ochenta').";
    }
    return "¡Aviso de separación! A partir del 31, todas las decenas unidas a unidades se deben escribir por separado utilizando la conjunción 'y' (ej: 'treinta y uno', 'ochenta y siete'). No intentes unirlos en una sola palabra.";
  }
  if (num === 100) {
    return "Se escribe exactamente como 'cien' cuando es exacto. Cambia a 'ciento' si va seguido de cualquier cifra menor (ej. 'ciento uno', 'ciento cincuenta').";
  }
  if (num > 100 && num < 1000) {
    return "En los centenares (101-999) hay concordancia de género con el sustantivo que acompañan (ej: 'trescientos libros' masculino / 'trescientas libretas' femenino). Nota: 'quinientos', 'setecientos' y 'novecientos' tienen raíces irregulares.";
  }
  if (num === 1000) {
    return "Se escribe como 'mil'. La RAE aconseja no anteponer el determinante 'un' ('un mil' se considera redundante en el habla ordinaria, aunque se acepta en cheques financieros para evitar fraudes).";
  }
  if (num > 1000 && num < 1000000) {
    return "El millar funciona como un modificador invariable. Se escribe el número de millares seguido de la palabra 'mil' por separado (ej: 'cinco mil', 'veintiún mil').";
  }
  if (num >= 1000000) {
    return "¡Millones son sustantivos! La palabra 'millón' es un sustantivo masculino. Lleva tilde en singular ('un millón') pero pierde la tilde en plural ('dos millones'). Recuerda insertar la preposición 'de' si acompaña a un sustantivo sin más cifras menores (ej: 'un millón de euros').";
  }
  return "Consulte las reglas generales de concordancia de género y números según la Real Academia Española (RAE).";
}

const QUIZ_QUESTIONS = [
  { num: 16, answer: "dieciséis", tip: "Se escribe en una sola palabra con 'c' (dieci-) y lleva tilde en la última 'e' por ser palabra aguda terminada en 's'." },
  { num: 22, answer: "veintidós", tip: "Se escribe en una sola palabra y lleva tilde en la 'o' por ser palabra aguda terminada en 's'." },
  { num: 23, answer: "veintitrés", tip: "Se escribe junto y lleva tilde en la 'e' por ser palabra aguda terminada en 's'." },
  { num: 26, answer: "veintiséis", tip: "Se escribe todo junto y lleva tilde en la 'e' por ser palabra aguda." },
  { num: 31, answer: "treinta y uno", tip: "A partir de 31, todas las decenas y unidades se separan con la conjunción 'y'." },
  { num: 45, answer: "cuarenta y cinco", tip: "Se escribe separado con la conjunción 'y'. Recuerda no unirlo como 'cuarentaycinco'." },
  { num: 500, answer: "quinientos", tip: "¡Forma irregular! No se escribe 'cincocientos', sino 'quinientos'." },
  { num: 700, answer: "setecientos", tip: "Se escribe con 'e', no con 'ie' (setecientos, no 'sietecientos')." },
  { num: 900, answer: "novecientos", tip: "Se escribe con 'o', no con 'ue' (novecientos, no 'nuevecientos')." },
  { num: 1000, answer: "mil", tip: "La RAE aconseja usar solo 'mil' en el lenguaje ordinario, el prefijo 'un' es redundante." }
];

export default function HowToEscribe({ 
  onSelectNumber 
}: { 
  onSelectNumber: (num: string) => void 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [selectedSeoNum, setSelectedSeoNum] = useState<CommonNumLink | null>(null);
  
  // Interactive Live Checker states
  const [liveNumber, setLiveNumber] = useState<string>("24");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeGuideTab, setActiveGuideTab] = useState<'rules' | 'ordinals' | 'romans' | 'sitemap' | 'quiz'>('rules');

  // Quiz states
  const [quizIndex, setQuizIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const faqs: FAQItem[] = [
    {
      q: "¿Cómo se escribe con letra el número 100?",
      a: "Saber **cómo se escribe con letra** el 100 es una de las dudas más comunes. Se escribe estrictamente como **'cien'** cuando expresa la cantidad exacta de 100 (ej: *cien personas*, *cien euros*). Sin embargo, se transforma en **'ciento'** cuando va seguido de otros números menores (ej: *ciento uno*, *ciento cincuenta*, *doscientos*).",
      keyword: "cómo se escribe con letra 100 cien ciento"
    },
    {
      q: "Al buscar cómo se escribe con letra el 21, ¿se usa 'veintiuno' o 'veintiún'?",
      a: "Para entender **cómo se escribe con letra** el número 21, es importante notar que ambas formas son correctas pero dependen del contexto gramatical: se usa **'veintiún'** cuando acompaña directamente a un sustantivo masculino (ej: *veintiún pesos*, *veintiún días*). Se utiliza **'veintiuno'** cuando se menciona el número de forma aislada, al final de una oración o en el conteo simple (ej: *tengo veintidós, no veintiuno*). Para femenino se usa **'veintiuna'** (ej: *veintiuna páginas*).",
      keyword: "cómo se escribe con letra 21 veintiuno veintiún veintiuna"
    },
    {
      q: "Para transacciones financieras, ¿cómo se escribe con letra el 1000?",
      a: "Si te preguntas **cómo se escribe con letra** la cifra de 1000, la Real Academia Española (RAE) aconseja el uso exclusivo de **'mil'** cuando nos referimos de forma directa y única a la cifra de 1000 (ej: *mil dólares*, *mil gracias*). El uso de 'un mil' se considera redundante en el habla común, aunque es aceptado y muy frecuente en documentos financieros, notariales o bancarios para evitar alteraciones fraudulentas de cifras.",
      keyword: "cómo se escribe con letra 1000 mil un mil"
    },
    {
      q: "¿Cómo se escribe con letra la palabra millón?",
      a: "Cuando estudiamos **cómo se escribe con letra** una cifra de millones, vemos que **'millón'** lleva tilde en la 'o' por ser una palabra aguda terminada en 'n'. Su plural es **'millones'**, el cual pierde la tilde por convertirse en una palabra llana terminada en 's'. Recuerda que para cifras redondas de millones se debe añadir la preposición 'de' antes de la moneda (ej: *cinco millones de euros*).",
      keyword: "cómo se escribe con letra 1000000 millon millones de"
    },
    {
      q: "¿Cómo se escribe con letra el rango del 21 al 29?",
      a: "Aprender **cómo se escribe con letra** este intervalo es sencillo: según la ortografía de la lengua española, los números del **21 al 29 se escriben en una sola palabra** y con tilde en los casos necesarios: *veintiuno, veintidós, veintitrés, veinticuatro, veinticinco, veintiséis, veintisiete, veintiocho y veintinueve*. A partir del 31, se escriben separados por la conjunción 'y' (ej: *treinta y uno*).",
      keyword: "cómo se escribe con letra 21 29 veintidós veintitrés veintiséis"
    },
    {
      q: "¿Cómo se escribe con letra el número 0?",
      a: "Si tienes dudas sobre **cómo se escribe con letra** el número cero, se escribe como **'cero'** con 'c'. Gramaticalmente es un sustantivo masculino y su plural es **'ceros'** (ej: *esa cantidad tiene muchos ceros*).",
      keyword: "cómo se escribe con letra 0 cero ceros"
    }
  ];

  const commonNumbers: CommonNumLink[] = [
    { num: 100, label: "cómo se escribe con letra el 100", text: "Cien" },
    { num: 125, label: "cómo se escribe con letra el 125", text: "Ciento veinticinco" },
    { num: 500, label: "cómo se escribe con letra el 500", text: "Quinientos" },
    { num: 750, label: "cómo se escribe con letra el 750", text: "Setecientos cincuenta" },
    { num: 1000, label: "cómo se escribe con letra el 1,000", text: "Mil" },
    { num: 1500, label: "cómo se escribe con letra el 1,500", text: "Mil quinientos" },
    { num: 2000, label: "cómo se escribe con letra el 2,000", text: "Dos mil" },
    { num: 5000, label: "cómo se escribe con letra el 5,000", text: "Cinco mil" },
    { num: 10000, label: "cómo se escribe con letra el 10,000", text: "Diez mil" },
    { num: 50000, label: "cómo se escribe con letra el 50,000", text: "Cincuenta mil" },
    { num: 100000, label: "cómo se escribe con letra el 100,000", text: "Cien mil" },
    { num: 500000, label: "cómo se escribe con letra el 500,000", text: "Quinientos mil" },
    { num: 1000000, label: "cómo se escribe con letra el 1,000,000", text: "Un millón" },
    { num: 5000000, label: "cómo se escribe con letra el 5,000,000", text: "Cinco millones" },
    { num: 10000000, label: "cómo se escribe con letra el 10,000,000", text: "Diez millones" }
  ];

  const handleFaqToggle = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleSeoNumClick = (item: CommonNumLink) => {
    setSelectedSeoNum(item);
  };

  const handleLoadInConverter = (numStr: string) => {
    onSelectNumber(numStr);
    setSelectedSeoNum(null);
  };

  const triggerCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return faq.q.toLowerCase().includes(query) || 
           faq.a.toLowerCase().includes(query) || 
           faq.keyword.toLowerCase().includes(query);
  });

  // Parse and calculate values for live checker
  const cleanLiveNumStr = liveNumber.replace(/[^0-9.]/g, "");
  const parsedLiveNum = parseFloat(cleanLiveNumStr);
  const isValidLiveNum = !isNaN(parsedLiveNum) && parsedLiveNum >= 0 && parsedLiveNum < 1000000000000;

  // Real-time generated values
  const liveMasc = isValidLiveNum ? convertNumberToLetters(parsedLiveNum, { gender: 'M' }) : "";
  const liveFem = isValidLiveNum ? convertNumberToLetters(parsedLiveNum, { gender: 'F' }) : "";
  const liveRoman = isValidLiveNum && Number.isInteger(parsedLiveNum) ? toRoman(parsedLiveNum) : "N/A (Requiere entero menor de 4,000)";
  const liveOrdinal = isValidLiveNum && Number.isInteger(parsedLiveNum) ? toOrdinal(parsedLiveNum) : "N/A (Requiere entero entre 1 y 100)";
  const liveFinancial = isValidLiveNum ? convertNumberToLetters(parsedLiveNum, {
    gender: 'N',
    isCurrency: true,
    currencyName: "pesos",
    formatFinancial: true
  }) : "";
  const liveRuleText = isValidLiveNum && Number.isInteger(parsedLiveNum) ? getSpellingRule(parsedLiveNum) : "Introduce un número entero para ver las reglas ortográficas específicas recomendadas por la RAE.";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 animate-fade-in text-left space-y-10">
      
      {/* Elegant Header Section */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-mono font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guía de Ortografía Española y RAE</span>
        </div>
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-gray-900 mb-4">
          ¿Cómo se Escribe con Letra?
        </h1>
        <p className="font-sans text-gray-600 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
          Aprende <strong>cómo se escribe con letra</strong> cualquier cifra y resuelve tus dudas de ortografía de números de forma instantánea. Usa nuestro analizador en vivo para descubrir <strong>cómo se escribe con letra</strong> cualquier importe de acuerdo con las reglas ortográficas de la Real Academia Española (RAE).
        </p>
      </div>

      {/* Real-time Number spelling Analyzer Card */}
      <div className="bg-gradient-to-br from-white to-blue-50/20 border border-blue-100/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              Herramienta Interactiva
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-gray-900">
              Analizador Ortográfico de Números
            </h2>
          </div>
          <div className="w-full md:w-auto flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 font-mono hidden sm:inline">NÚMERO:</span>
            <input
              type="text"
              className="w-full md:w-44 bg-white border-2 border-blue-100 focus:border-blue-500 text-gray-900 font-mono text-lg font-bold rounded-2xl px-4 py-2.5 outline-hidden shadow-xs transition-all text-center"
              placeholder="Ej: 125"
              value={liveNumber}
              onChange={(e) => setLiveNumber(e.target.value)}
            />
          </div>
        </div>

        {isValidLiveNum ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Core word conversions */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Masculine Card */}
              <div className="bg-white/80 p-4.5 rounded-2xl border border-gray-100/80 hover:border-blue-100/60 shadow-xs group transition-all flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                    Escritura Masculina (Estándar)
                  </span>
                  <p className="text-sm sm:text-base font-bold text-gray-800 break-all leading-tight">
                    {liveMasc}
                  </p>
                </div>
                <button
                  onClick={() => triggerCopy("masc", liveMasc)}
                  className="p-2.5 bg-gray-50 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all cursor-pointer flex-shrink-0"
                  title="Copiar"
                >
                  {copiedId === "masc" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Feminine Card */}
              <div className="bg-white/80 p-4.5 rounded-2xl border border-gray-100/80 hover:border-blue-100/60 shadow-xs group transition-all flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                    Escritura Femenina
                  </span>
                  <p className="text-sm sm:text-base font-bold text-gray-800 break-all leading-tight">
                    {liveFem}
                  </p>
                </div>
                <button
                  onClick={() => triggerCopy("fem", liveFem)}
                  className="p-2.5 bg-gray-50 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all cursor-pointer flex-shrink-0"
                  title="Copiar"
                >
                  {copiedId === "fem" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Financial Card */}
              <div className="bg-white/80 p-4.5 rounded-2xl border border-gray-100/80 hover:border-blue-100/60 shadow-xs group transition-all flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                    Formato Cheque y Facturas
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 italic leading-tight">
                    {liveFinancial}
                  </p>
                </div>
                <button
                  onClick={() => triggerCopy("financial", liveFinancial)}
                  className="p-2.5 bg-gray-50 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all cursor-pointer flex-shrink-0"
                  title="Copiar"
                >
                  {copiedId === "financial" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

            </div>

            {/* Right Col: Auxiliary Formats and Grammar Tip */}
            <div className="space-y-4">
              
              <div className="bg-white/80 p-4 rounded-2xl border border-gray-100/80 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-xs">
                  <span className="font-bold text-gray-500 font-mono">SÍMBOLO ROMANO:</span>
                  <button
                    onClick={() => triggerCopy("roman", liveRoman)}
                    className="text-gray-400 hover:text-blue-600 transition-all"
                    disabled={liveRoman.includes("Solo")}
                  >
                    {copiedId === "roman" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="font-mono font-black text-lg text-blue-800 text-center tracking-wider break-words py-1">
                  {liveRoman}
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-gray-100/80 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-xs">
                  <span className="font-bold text-gray-500 font-mono">NÚMERO ORDINAL:</span>
                  <button
                    onClick={() => triggerCopy("ordinal", liveOrdinal)}
                    className="text-gray-400 hover:text-blue-600 transition-all"
                    disabled={liveOrdinal.includes("Solo")}
                  >
                    {copiedId === "ordinal" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="font-sans font-bold text-xs sm:text-sm text-gray-700 text-center py-1 capitalize">
                  {liveOrdinal}
                </p>
              </div>

            </div>

            {/* Bottom Alert: Orthographic Tip & Load into main converter */}
            <div className="lg:col-span-3 bg-blue-50/60 rounded-2xl p-4.5 border border-blue-100/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-blue-800">Regla Ortográfica Aplicable (RAE):</span>
                  <p className="text-xs text-blue-700 leading-relaxed max-w-3xl">
                    {liveRuleText}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleLoadInConverter(cleanLiveNumStr)}
                className="w-full sm:w-auto whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Usar en Convertidor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-10 bg-white/50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-400">Por favor, escribe un número positivo válido para analizar.</p>
          </div>
        )}
      </div>

      {/* Structured Reference Tabs Section */}
      <div className="space-y-6">
        <div className="flex flex-wrap border-b border-gray-200 gap-1 sm:gap-2">
          <button
            onClick={() => setActiveGuideTab('rules')}
            className={`px-4 py-2.5 font-sans font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeGuideTab === 'rules'
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Reglas de Oro
          </button>
          <button
            onClick={() => setActiveGuideTab('ordinals')}
            className={`px-4 py-2.5 font-sans font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeGuideTab === 'ordinals'
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Números Ordinales
          </button>
          <button
            onClick={() => setActiveGuideTab('romans')}
            className={`px-4 py-2.5 font-sans font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeGuideTab === 'romans'
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Números Romanos
          </button>
          <button
            onClick={() => setActiveGuideTab('sitemap')}
            className={`px-4 py-2.5 font-sans font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeGuideTab === 'sitemap'
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Sitemap de Números
          </button>
          <button
            onClick={() => setActiveGuideTab('quiz')}
            className={`px-4 py-2.5 font-sans font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeGuideTab === 'quiz'
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            🎯 ¡Prueba tu Ortografía!
          </button>
        </div>

        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-xs min-h-[250px]">
          {activeGuideTab === 'rules' && (
            <div className="space-y-6">
              <h3 className="font-sans font-bold text-gray-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Normas Fundamentales de Escritura Numérica en Español</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed text-gray-600">
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800">1. La regla unificada hasta el 29</h4>
                  <p>
                    Hasta el número 29, la escritura de unidades y decenas se agrupa en una única palabra de corrido. Es un error ortográfico muy habitual escribir "veinte y tres" en lugar de <strong className="text-blue-600">veintitrés</strong>. A partir de 30 se separan con la conjunción "y" ("treinta y uno").
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800">2. Acentuación correcta de palabras unificadas</h4>
                  <p>
                    Los números de la década de los veinte que terminan en vocal o en 's' llevan tilde en la sílaba aguda: <strong className="text-blue-600">veintidós</strong>, <strong className="text-blue-600">veintitrés</strong> y <strong className="text-blue-600">veintiséis</strong>. Sin embargo, "veintiuno", "veinticuatro" y "veintiocho" se escriben sin tilde.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800">3. Concordancia de género en centenares</h4>
                  <p>
                    Las centenas deben concordar siempre en género con el sustantivo al que modifican: <strong className="text-blue-600">quinientos pesos</strong> (masculino) o <strong className="text-blue-600">quinientas personas</strong> (femenino). Las palabras "doscientas", "trescientas", "cuatrocientas", "seiscientas", "setecientas", "ochocientas" y "novecientas" varían a femenino.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800">4. El sustantivo 'millón' y el enlace 'de'</h4>
                  <p>
                    A diferencia de "mil", la palabra <strong className="text-blue-600">millón</strong> es un sustantivo y no un adjetivo. Si la cifra es exacta (ej. 3,000,000), exige obligatoriamente añadir la preposición "de" antes de la entidad: "tres millones de dólares", nunca "tres millones dólares".
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeGuideTab === 'ordinals' && (
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-gray-900 text-base flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-indigo-500" />
                <span>Estructura de Números Ordinales Básicos</span>
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                La siguiente tabla detalla cómo nombrar las posiciones o rangos de orden de forma correcta:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {[
                  { num: "1º", word: "Primero / Primer" },
                  { num: "2º", word: "Segundo" },
                  { num: "3º", word: "Tercero / Tercer" },
                  { num: "4º", word: "Cuarto" },
                  { num: "5º", word: "Quinto" },
                  { num: "10º", word: "Décimo" },
                  { num: "11º", word: "Undécimo" },
                  { num: "12º", word: "Duodécimo" },
                  { num: "20º", word: "Vigésimo" },
                  { num: "30º", word: "Trigésimo" },
                  { num: "40º", word: "Cuadragésimo" },
                  { num: "50º", word: "Quincuagésimo" },
                  { num: "60º", word: "Sexagésimo" },
                  { num: "70º", word: "Septuagésimo" },
                  { num: "100º", word: "Centésimo" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600">{item.num}</span>
                    <span className="text-xs font-semibold text-gray-700 capitalize text-right">{item.word}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeGuideTab === 'romans' && (
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-gray-900 text-base flex items-center gap-2">
                <Hash className="w-5 h-5 text-teal-500" />
                <span>Diccionario y Guía Rápida de Símbolos Romanos</span>
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Los números romanos usan letras latinas mayúsculas para indicar valores. Consulta las equivalencias básicas:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { key: "I", val: 1 },
                  { key: "IV", val: 4 },
                  { key: "V", val: 5 },
                  { key: "IX", val: 9 },
                  { key: "X", val: 10 },
                  { key: "XL", val: 40 },
                  { key: "L", val: 50 },
                  { key: "XC", val: 90 },
                  { key: "C", val: 100 },
                  { key: "CD", val: 400 },
                  { key: "D", val: 500 },
                  { key: "CM", val: 900 },
                  { key: "M", val: 1000 }
                ].map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                    <span className="font-mono font-black text-lg text-teal-700">{item.key}</span>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5">Valor: {item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeGuideTab === 'sitemap' && (
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-gray-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>Sitemap de Números Comunes</span>
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Haz clic en cualquier cifra para ver su ortografía completa, concordancia de género y formatos financieros:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                {commonNumbers.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSeoNumClick(item)}
                    className="bg-gray-50 hover:bg-blue-50/30 border border-gray-150 hover:border-blue-200 rounded-xl px-3.5 py-3 text-left transition-all group shadow-xs cursor-pointer"
                  >
                    <span className="font-mono text-xs text-blue-600 font-bold block group-hover:scale-[1.02] transition-transform">
                      {item.num.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 font-sans block mt-0.5 capitalize truncate">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeGuideTab === 'quiz' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 flex-wrap gap-2">
                <h3 className="font-sans font-bold text-gray-900 text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <span>Cuestionario de Ortografía de Números RAE</span>
                </h3>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-bold">
                  Pregunta {quizFinished ? QUIZ_QUESTIONS.length : quizIndex + 1} de {QUIZ_QUESTIONS.length}
                </span>
              </div>

              {quizFinished ? (
                <div className="text-center py-8 space-y-4">
                  <div className="inline-flex p-4 rounded-full bg-indigo-50 text-indigo-600 mb-2">
                    <Award className="w-12 h-12" />
                  </div>
                  <h4 className="font-sans font-black text-gray-900 text-2xl">¡Quiz Completado!</h4>
                  <p className="text-gray-600 text-sm max-w-md mx-auto font-sans">
                    Has obtenido una puntuación de <strong className="text-indigo-600">{quizScore} / {QUIZ_QUESTIONS.length}</strong> aciertos.
                  </p>
                  
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 max-w-md mx-auto text-xs text-gray-500 font-sans">
                    {quizScore === QUIZ_QUESTIONS.length ? (
                      <p className="text-indigo-700 font-bold">🎉 ¡Excelente! Eres un maestro absoluto de la ortografía de números según las normas de la Real Academia Española (RAE).</p>
                    ) : quizScore >= 7 ? (
                      <p className="text-emerald-700 font-bold">👍 ¡Muy bien hecho! Tienes un gran dominio ortográfico. Solo te faltaron algunos detalles menores.</p>
                    ) : (
                      <p className="text-blue-700 font-bold">💡 ¡Buen intento! Te recomendamos repasar nuestra sección de "Reglas de Oro" y volver a intentarlo para perfeccionar tu dominio.</p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setQuizIndex(0);
                      setQuizScore(0);
                      setUserAnswer("");
                      setShowQuizFeedback(false);
                      setQuizFinished(false);
                    }}
                    className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-all"
                  >
                    Reiniciar Cuestionario
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center">
                    <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-1">Escribe con letras el siguiente número:</p>
                    <h5 className="font-mono font-black text-gray-900 text-4xl py-3">
                      {QUIZ_QUESTIONS[quizIndex].num}
                    </h5>
                    <p className="text-xs text-gray-500 italic font-sans">Escribe tu respuesta en minúsculas y sin espacios innecesarios.</p>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (showQuizFeedback) return;
                      const cleanedAnswer = userAnswer.trim().toLowerCase();
                      const isCorrect = cleanedAnswer === QUIZ_QUESTIONS[quizIndex].answer;
                      if (isCorrect) {
                        setQuizScore((prev) => prev + 1);
                      }
                      setShowQuizFeedback(true);
                    }}
                    className="space-y-4"
                  >
                    <div className="text-left">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 font-sans">Tu Respuesta:</label>
                      <input
                        type="text"
                        disabled={showQuizFeedback}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Ej: veintitrés"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans focus:outline-hidden focus:border-blue-500 transition disabled:opacity-75 font-semibold text-gray-900"
                        required
                        autoFocus
                      />
                    </div>

                    {showQuizFeedback && (
                      <div className={`p-4 rounded-2xl border ${
                        userAnswer.trim().toLowerCase() === QUIZ_QUESTIONS[quizIndex].answer
                          ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                          : "bg-rose-50 border-rose-100 text-rose-800"
                      } space-y-2 text-xs sm:text-sm text-left`}>
                        <p className="font-bold">
                          {userAnswer.trim().toLowerCase() === QUIZ_QUESTIONS[quizIndex].answer
                            ? "✓ ¡Correcto!"
                            : `✗ Incorrecto. Se escribe: "${QUIZ_QUESTIONS[quizIndex].answer}"`}
                        </p>
                        <p className="opacity-90 font-sans text-xs sm:text-xs leading-relaxed">
                          <strong>Explicación:</strong> {QUIZ_QUESTIONS[quizIndex].tip}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      {!showQuizFeedback ? (
                        <button
                          type="submit"
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs font-sans"
                        >
                          Verificar Respuesta
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setShowQuizFeedback(false);
                            setUserAnswer("");
                            if (quizIndex + 1 < QUIZ_QUESTIONS.length) {
                              setQuizIndex((prev) => prev + 1);
                            } else {
                              setQuizFinished(true);
                            }
                          }}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs font-sans"
                        >
                          <span>{quizIndex + 1 < QUIZ_QUESTIONS.length ? "Siguiente Pregunta" : "Ver Resultados"}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Search FAQs Accordion (Unifying existing Q&A) */}
      <div className="bg-white border border-gray-100 shadow-xl shadow-gray-100/50 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          <h3 className="font-sans font-bold text-gray-900 text-lg flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl"><HelpCircle className="w-5 h-5" /></span>
            <span>Dudas Frecuentes sobre Escritura de Números</span>
          </h3>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar duda (ej: tilde, 100, veintiuno)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white text-gray-900 font-sans text-xs rounded-xl pl-9 pr-4 py-2.5 outline-hidden transition-all shadow-xs"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No encontramos dudas para "{searchQuery}". Intenta con palabras clave como "millón", "21" o "cien".
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <div 
                  key={index} 
                  className={`border rounded-2xl transition-all ${
                    isExpanded 
                      ? "border-indigo-200 bg-indigo-50/10 shadow-xs" 
                      : "border-gray-100 hover:border-gray-200 bg-white"
                  }`}
                >
                  <button
                    onClick={() => handleFaqToggle(index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left font-sans font-semibold text-gray-800 text-sm sm:text-base cursor-pointer"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-indigo-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 border-t border-dashed border-gray-100 leading-relaxed font-sans">
                      <p className="whitespace-pre-line">
                        {faq.a.split("**").map((part, idx) => 
                          idx % 2 === 1 ? <strong key={idx} className="text-gray-900 font-bold">{part}</strong> : part
                        )}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SEO Content Block: Guía Maestra "Cómo se escribe con letra" */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="font-sans font-bold text-gray-900 text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>Guía Maestra: ¿Cómo se escribe con letra cada número?</span>
        </h3>
        
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Para comprender a fondo <strong>cómo se escribe con letra</strong> cualquier cantidad en español, es fundamental seguir las directrices académicas de la Real Academia Española (RAE). Esta sección te ofrece un desglose estructurado sobre <strong>cómo se escribe con letra</strong> cada tipo de número, facilitando la redacción correcta de cheques, contratos y textos de contabilidad.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="space-y-3 bg-white p-5 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-gray-800">¿Cómo se escribe con letra del 1 al 10?</h4>
            <ul className="space-y-1 text-gray-500 font-mono text-xs">
              <li>• Saber <strong>cómo se escribe con letra</strong> el 1: uno</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 2: dos</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 3: tres</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 4: cuatro</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 5: cinco</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 6: seis</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 7: siete</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 8: ocho</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 9: nueve</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 10: diez</li>
            </ul>
          </div>

          <div className="space-y-3 bg-white p-5 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-gray-800">¿Cómo se escribe con letra las decenas principales?</h4>
            <ul className="space-y-1 text-gray-500 font-mono text-xs">
              <li>• Saber <strong>cómo se escribe con letra</strong> el 20: veinte</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 30: treinta</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 40: cuarenta</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 50: cincuenta</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 60: sesenta</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 70: setenta</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 80: ochenta</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 90: noventa</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 100: cien / ciento</li>
              <li>• Saber <strong>cómo se escribe con letra</strong> el 1000: mil</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed bg-white p-4.5 rounded-2xl border border-gray-100">
          Si te has preguntado alguna vez <strong>cómo se escribe con letra</strong> una cifra de manera formal, recuerda que a partir del número 31 la separación con la conjunción "y" es totalmente obligatoria (por ejemplo: "treinta y uno"). No olvides consultar este glosario interactivo para confirmar <strong>cómo se escribe con letra</strong> cualquier número entero de forma rápida y con total validez ortográfica ante la RAE.
        </p>
      </div>

      {/* Programmatic Details Modal/Overlay for Selected Number */}
      {selectedSeoNum && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 max-w-md w-full text-left space-y-6 relative animate-scale-up">
            <div>
              <div className="flex items-center space-x-2 text-indigo-600 font-mono text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enciclopedia Ortográfica</span>
              </div>
              <h4 className="font-sans font-black text-gray-900 text-2xl tracking-tight">
                Número {selectedSeoNum.num.toLocaleString()}
              </h4>
            </div>

            {/* Structured Details list */}
            <div className="space-y-4">
              {/* Masculine words */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Escritura Masculina (Estándar)
                </span>
                <p className="font-sans font-bold text-gray-800 text-sm sm:text-base">
                  {selectedSeoNum.text}
                </p>
                <span className="text-[10px] text-gray-400 font-sans block mt-1">
                  Ej: {selectedSeoNum.text.toLowerCase()} {selectedSeoNum.num === 100 ? "libros" : "libros"}
                </span>
              </div>

              {/* Feminine words */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Escritura Femenina
                </span>
                <p className="font-sans font-semibold text-gray-700 text-sm">
                  {convertNumberToLetters(selectedSeoNum.num, { gender: 'F' })}
                </p>
                <span className="text-[10px] text-gray-400 font-sans block mt-1">
                  Ej: {convertNumberToLetters(selectedSeoNum.num, { gender: 'F' }).toLowerCase()} {selectedSeoNum.num === 100 ? "personas" : "personas"}
                </span>
              </div>

              {/* Financial words (Pesos) */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-150">
                <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Formato Factura / Moneda (Pesos)
                </span>
                <p className="font-sans font-semibold text-gray-700 text-xs sm:text-sm italic">
                  {convertNumberToLetters(selectedSeoNum.num, {
                    gender: 'N',
                    isCurrency: true,
                    currencyName: "pesos",
                    formatFinancial: true
                  })}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedSeoNum(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-sans font-semibold text-xs text-center cursor-pointer transition-all"
              >
                Cerrar Guía
              </button>
              
              <button
                onClick={() => handleLoadInConverter(String(selectedSeoNum.num))}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-sans font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer transition-all"
              >
                <span>Usar en Convertidor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
