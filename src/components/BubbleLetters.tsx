import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AESTHETIC_FONTS } from "../utils/fontGenerators";
import { 
  CircleDot, 
  Copy, 
  Check, 
  HelpCircle, 
  Smile, 
  Sparkles,
  Dices,
  Trash2,
  ChevronDown,
  ChevronUp,
  Instagram,
  Gamepad2,
  Quote,
  Flame,
  CheckSquare
} from "lucide-react";

// Symbol injector categories specifically matching the bubble vibe
const SYMBOL_CATEGORIES = [
  {
    id: "stars",
    label: "★ Estrellas",
    symbols: ["★", "☆", "✦", "✧", "☾", "☽", "✩", "✪", "✫", "✬", "✭", "✮", "✯", "☄", "🪐", "🌙", "☀", "⚡"]
  },
  {
    id: "hearts",
    label: "♥ Amor",
    symbols: ["♥", "♡", "𓆩♡𓆪", "𐙚", "❦", "❧", "❣", "💕", "💞", "🖤", "💜", "💙", "💚", "💛", "💌", "💋"]
  },
  {
    id: "nature",
    label: "🌸 Flores",
    symbols: ["✿", "❀", "❁", "💮", "🌺", "🌻", "🌼", "🌷", "🌱", "🌿", "🍀", "🍁", "🍒", "🍓", "🍉", "🍇"]
  },
  {
    id: "kaomoji",
    label: "٩(^‿^)۶ Kaomoji",
    symbols: [
      "(｡♥‿♥｡)", "(◡‿◡✿)", "(っ◔◡◔)っ", "≧◡≦", "(^_<)～☆", "(*^‿^*)", "o(≧▽≦)o", "(◕‿◕✿)", 
      "ʕ•ᴥ•ʔ", "(=^·^=)", "ଘ(੭*ˊᵕˋ)੭*", "(´• ω •`)"
    ]
  }
];

// Bubble Adjectives & Nouns for Random Nickname Generation
const RANDOM_BUBBLE_ADJECTIVES = [
  "Burbuja", "Redondo", "Esfera", "Globo", "Cosmic", "Dreamy", "Shadow", "Sweet", "Cherry", "Cyber",
  "Golden", "Midnight", "Mystic", "Vintage", "Pastel", "Soft", "Dark", "Angel", "Devil", "Fairy"
];

const RANDOM_BUBBLE_NOUNS = [
  "Nube", "Luna", "Estrella", "Gamer", "Sniper", "Lover", "Vibras", "Reina", "Rey", "Amigo",
  "Panda", "Ninja", "Soul", "Vibe", "Aura", "Cat", "Pez", "Mundo", "Babe", "Princess"
];

// Custom bubble text decoration frames
const BUBBLE_DECORATOR_TEMPLATES = [
  { id: "bdec1", template: (text: string) => `𓆩♡𓆪 ${text} 𓆩♡𓆪`, label: "Esferas de Amor" },
  { id: "bdec2", template: (text: string) => `★彡 ${text} 彡★`, label: "Estrellas de Burbuja" },
  { id: "bdec3", template: (text: string) => `✧*̥˚ ${text} *̥˚✧`, label: "Destello Redondo" },
  { id: "bdec4", template: (text: string) => "•´¯\`•. " + text + " .•´¯\`•.", label: "Onda Circular" },
  { id: "bdec5", template: (text: string) => `╰┈➤ ❝ ${text} ❞`, label: "Flecha de Burbuja" },
  { id: "bdec6", template: (text: string) => `°•. ✿ .•° ${text} °•. ✿ .•°`, label: "Borde de Pétalos" },
  { id: "bdec7", template: (text: string) => `🍒 ─── ${text} ─── 🍒`, label: "Cerezas Redondas" },
  { id: "bdec8", template: (text: string) => `░▒▓█ ${text} █▓▒░`, label: "Contenedor Pixel" }
];

// Tabbed bio presets specifically using circular and bubble styles
const DETAILED_BUBBLE_BIO_PRESETS = {
  social: [
    {
      name: "Bio Círculos",
      preview: "✨ Ⓦⓔⓛⓒⓞⓜⓔ ⓣⓞ ⓜⓨ ⓟⓔⓡⓕⓘⓛ ✨\n🌙 🅜🅘🅓🅝🅘🅖🅗🅣 • 🅥🅘🅑🅔🅢\n🌿 🅢🅞🅕🅣 ⓁⒾⒻⒺ\n💌 DM para negocios",
      raw: "✨ Ⓦⓔⓛⓒⓞⓜⓔ ⓣⓞ ⓜⓨ ⓟⓔⓡⓕⓘⓛ ✨\n🌙 🅜🅘🅓🅝🅘🅖🅗🅣 • 🅥🅘🅑🅔🅢\n🌿 🅢🅞🅕🅣 ⓁⒾⒻⒺ\n💌 DM para negocios"
    },
    {
      name: "Aura Redonda",
      preview: "🧸 ⓜⓨ ⓛⓘⓕⓔ, ⓜⓨ ⓡⓤⓛⓔⓢ 🌸\n🍡 🅚🅐🅦🅐🅘🅘_🅖🅘🅡🅛\n🏹 ⓈⒾⓂⓅⓁⒺ ⓈⓄⓊⓁ\n✨ Fluyendo con el viento",
      raw: "🧸 ⓜⓨ ⓛⓘⓕⓔ, ⓜⓨ ⓡⓤⓛⓔⓢ 🌸\n🍡 🅚🅐🅦🅐🅘🅘_🅖🅘🅡🅛\n🏹 ⓈⒾⓂⓅⓁⒺ ⓈⓄⓊⓁ\n✨ Fluyendo con el viento"
    },
    {
      name: "Estilo Relleno",
      preview: "⚡︎ 🅚🅔🅔🅟 🅘🅣 🅢🅘🅜🅟🅛🅔.\n🖤 ⓑⓤⓡⓑⓤⓙⓐ ⓐⓒⓣⓘⓥⓐ\n☕︎ Cafeína y código\n✈︎ ⓉⓇⒶⓋⒺⓁⒺⓇ",
      raw: "⚡︎ 🅚🅔🅔🅟 🅘🅣 🅢🅘🅜🅟🅛🅔.\n🖤 ⓑⓤⓡⓑⓤⓙⓐ ⓐⓒⓣⓘⓥⓐ\n☕︎ Cafeína y código\n✈︎ ⓉⓇⒶⓋⒺⓁⒺⓇ"
    }
  ],
  gaming: [
    {
      name: "Clan Redondo",
      preview: "⚔️ 𓆩 🅢🅝🅘🅟🅔🅡 𓆪 ⚔️\n🔥 [ ⓀⒾⓁⓁⒺⓇ ]\n🏆 🅡🅐🅝🅚: 🅗🅔🅡🅞🅘🅒\n🎮 No pain, no gain",
      raw: "⚔️ 𓆩 🅢🅝🅘🅟🅔🅡 𓆪 ⚔️\n🔥 [ ⓀⒾⓁⓁⒺⓇ ]\n🏆 🅡🅐🅝🅚: 🅗🅔🅡🅞🅘🅒\n🎮 No pain, no gain"
    },
    {
      name: "Burbuja Gamer",
      preview: "✿ 🅖🅐🅜🅔🅡_🅠🅤🅔🅔🅝 ✿\n🔫 🅗🅔🅐🅓🅢🅗🅞🅣\n👑 Clan Leader\n✨ ⓃⒺⓋⒺⓇ ⒼⒾⓋⒺ ⓊⓅ!",
      raw: "✿ 🅖🅐🅜🅔🅡_🅠🅤🅔🅔🅝 ✿\n🔫 🅗🅔🅐🅓🅢🅗🅞🅣\n👑 Clan Leader\n✨ ⓃⒺⓋⒺⓇ ⒼⒾⓋⒺ ⓊⓅ!"
    },
    {
      name: "Pro Roblox",
      preview: "⚡️ ⓉⓄⓍⒾⒸ_ⒷⓄⓎ ⚡️\n🔥 🅛🅔🅥🅔🅛 🅜🅐🅧\n🎮 Roblox & FF\n💀 Nos vemos en el lobby",
      raw: "⚡️ ⓉⓄⓍⒾⒸ_ⒷⓄⓎ ⚡️\n🔥 🅛🅔🅥🅔🅛 🅜🅐🅧\n🎮 Roblox & FF\n💀 Nos vemos en el lobby"
    }
  ],
  quotes: [
    {
      name: "Sueños Esféricos",
      preview: "☾ ⓢⓤⓔñⓞⓢ ⓢⓘⓝ ⓕⓘⓝ ✩\n✨ La luna brilla en círculos.\n🪐 Polvo de estrellas\n💫 🅛🅘🅥🅔 🅣🅗🅔 🅜🅞🅜🅔🅝🅣",
      raw: "☾ ⓢⓤⓔñⓞⓢ ⓢⓘⓝ ⓕⓘⓝ ✩\n✨ La luna brilla en círculos.\n🪐 Polvo de estrellas\n💫 🅛🅘🅥🅔 🅣🅗🅔 🅜🅞🅜🅔🅝🅣"
    },
    {
      name: "Frases de Burbuja",
      preview: "☕︎ 🅟🅔🅝🅢🅐🅜🅘🅔🅝🅣🅞🅢 🍃\n❀ Menos es más.\n⌛︎ El tiempo cura todo.\n🌸 ⓈⒺ ⓉⓊ ⓅⓇⓄⓅⒾⓄ ⓈⓄⓁ",
      raw: "☕︎ 🅟🅔🅝🅢🅐🅜🅘🅔🅝🅣🅞🅢 🍃\n❀ Menos es más.\n⌛︎ El tiempo cura todo.\n🌸 ⓈⒺ ⓉⓊ ⓅⓇⓄⓅⒾⓄ ⓈⓄⓁ"
    },
    {
      name: "Energía Redonda",
      preview: "🦋 Ⓥⓘⓑⓡⓐⓢ ⓟⓞⓢⓘⓣⓘⓥⓐⓢ 🦋\n🌈 Sonríe hoy.\n🧸 Todo pasa por algo.\n✨ 🅟🅐🅩 🅨 🅐🅜🅞🅡",
      raw: "🦋 Ⓥⓘⓑⓡⓐⓢ ⓟⓞⓢⓘⓣⓘⓥⓐⓢ 🦋\n🌈 Sonríe hoy.\n🧸 Todo pasa por algo.\n✨ 🅟🅐🅩 🅨 🅐🅜🅞🅡"
    }
  ]
};

export default function BubbleLetters({ initialText }: { initialText?: string }) {
  const [inputText, setInputText] = useState(initialText || "Mensaje Secreto");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSymbolTab, setSelectedSymbolTab] = useState("stars");
  const [activeBioTab, setActiveBioTab] = useState<'social' | 'gaming' | 'quotes'>('social');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  
  // Custom functional optimizations for letters bubble conversion
  const [normalizeAccents, setNormalizeAccents] = useState(true);
  const [spaceToDot, setSpaceToDot] = useState(false);
  const [textCase, setTextCase] = useState<"original" | "upper" | "lower">("original");
  const [fontSize, setFontSize] = useState<number>(24);

  // Sync with incoming prop for deep links or query parameters on mount
  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
    } else {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("text") || urlParams.get("q");
        if (q) {
          setInputText(q);
        }
      } catch (e) {
        // Ignore fallback
      }
    }
  }, [initialText]);

  // Sync inputText state with browser URL search parameters in real time (debounced)
  useEffect(() => {
    const rawVal = inputText.trim();
    const timer = setTimeout(() => {
      try {
        const url = new URL(window.location.href);
        if (rawVal) {
          url.searchParams.set("text", rawVal);
        } else {
          url.searchParams.delete("text");
        }
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      } catch (e) {
        // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [inputText]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Retrieve specifically bubble white and bubble black from the fonts mapping
  const bubbleWhiteFont = AESTHETIC_FONTS.find(f => f.id === "bubble_white");
  const bubbleBlackFont = AESTHETIC_FONTS.find(f => f.id === "bubble_black");

  // Helper to pre-process and optimize input text for maximum bubble conversion compatibility
  const getTransformedText = (text: string) => {
    let result = text;
    
    // 1. Text Case Conversion
    if (textCase === "upper") {
      result = result.toUpperCase();
    } else if (textCase === "lower") {
      result = result.toLowerCase();
    }
    
    // 2. Normalizing Accents (essential for full bubble coverage since diacritics are unsupported in Unicode bubble blocks)
    if (normalizeAccents) {
      result = result
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Normalizes á -> a, é -> e, etc.
        .replace(/ñ/g, "n")              // Maps ñ to n for clean bubble conversion
        .replace(/Ñ/g, "N");
    }
    
    // 3. Replacing Spaces with Aesthetic Bubble Dots
    if (spaceToDot) {
      result = result.replace(/\s+/g, " • "); // Adds a lovely aesthetic dot bubble-separator
    }
    
    return result;
  };

  const processedText = getTransformedText(inputText);

  const generatedWhite = bubbleWhiteFont ? bubbleWhiteFont.generate(processedText) : "";
  const generatedBlack = bubbleBlackFont ? bubbleBlackFont.generate(processedText) : "";

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInjectSymbol = (symbol: string) => {
    if (inputText.length + symbol.length > 80) return;
    
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart ?? inputText.length;
      const end = input.selectionEnd ?? inputText.length;
      const newText = inputText.substring(0, start) + symbol + inputText.substring(end);
      setInputText(newText);
      
      // Keep input focused and reset cursor position
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + symbol.length, start + symbol.length);
      }, 50);
    } else {
      setInputText(prev => prev + symbol);
    }
  };

  const handleGenerateRandomNick = () => {
    const adj = RANDOM_BUBBLE_ADJECTIVES[Math.floor(Math.random() * RANDOM_BUBBLE_ADJECTIVES.length)];
    const noun = RANDOM_BUBBLE_NOUNS[Math.floor(Math.random() * RANDOM_BUBBLE_NOUNS.length)];
    const formats = [
      `${adj}${noun}`,
      `${adj} ${noun}`,
      `${adj}_${noun}`,
      `${adj}-${noun}`
    ];
    const baseName = formats[Math.floor(Math.random() * formats.length)];
    setInputText(baseName);
  };

  const handleClear = () => {
    setInputText("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIdx(prev => prev === index ? null : index);
  };

  // Pre-made bubble presets for copy-pasting
  const POPULAR_BUBBLES = [
    { label: "Nombres", text: "ⓐⓛⓔⓧⓘⓢ" },
    { label: "Números", text: "①②③④⑤" },
    { label: "Black", text: "🅙🅤🅐🅝" },
    { label: "Llamada a la Acción", text: "🅢🅘🅖🅤🅢" }
  ];

  const faqs = [
    {
      q: "¿Cómo usar el generador de letras burbuja para obtener letras burbuja copiar y pegar gratis?",
      a: "Utilizar nuestro generador de letras burbuja y obtener letras burbuja copiar y pegar es sumamente sencillo. Escribe el texto en el cuadro superior de este generador de letras burbuja. De inmediato verás tus palabras convertidas en letras burbuja blancas o letras burbuja negras. Haz clic en 'Copiar' para llevar tus letras burbuja a Instagram, TikTok o Facebook. ¡Estas letras burbuja se pegan al instante!"
    },
    {
      q: "¿Por qué se llaman letras burbuja o letras en círculos?",
      a: "Se les conoce popularmente como letras burbuja debido a la forma circular u ovalada que rodea a cada carácter, simulando una burbuja esférica flotante. Estas letras burbuja son ideales para personalizar mensajes. Con las letras burbuja de nuestro portal, puedes generar tantas letras burbuja como desees, siendo las letras burbuja compatibles con todas las plataformas populares de redes sociales."
    },
    {
      q: "¿Son las letras burbuja copiar y pegar compatibles con Free Fire, Roblox y nicks con letras burbuja?",
      a: "¡Por supuesto! Las letras burbuja y las letras en círculos de nuestro generador de letras burbuja son 100% compatibles con nombres de usuario (nicks) de videojuegos modernos como Free Fire, PUBG, Roblox, Fortnite y Minecraft. Estas letras burbuja te permiten lucir un alias sumamente creativo de letras burbuja y destacar del resto de los jugadores con letras burbuja llamativas."
    },
    {
      q: "¿Qué diferencia hay entre las letras burbuja blancas y las letras burbuja negras en el generador de letras burbuja?",
      a: "Las letras burbuja blancas (como ⒶⒷⒸ) emplean círculos transparentes, ideales para unas letras burbuja de aspecto limpio y minimalista. Por otro lado, las letras burbuja negras (como 🅐🅑🅒) utilizan círculos completamente negros, logrando letras burbuja de alto contraste. Ambas versiones de letras burbuja las puedes conseguir gratis aquí en el generador de letras burbuja."
    },
    {
      q: "¿Es necesario instalar alguna aplicación para usar las letras burbuja y las letras burbuja copiar y pegar?",
      a: "No, en absoluto. Nuestro generador de letras burbuja es una herramienta web completamente gratuita y en línea. No requiere instalar fuentes .ttf de letras burbuja ni programas externos de letras burbuja. El texto de letras burbuja que generas se basa en el estándar universal Unicode, por lo que puedes copiar y pegar tus letras burbuja en cualquier dispositivo móvil o de escritorio de forma instantánea gracias a este generador de letras burbuja."
    }
  ];

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8 sm:py-14 animate-fade-in text-left">
      
      {/* Decorative Blur Orbs for Premium Style */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-20 -right-4 w-72 h-72 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-12 relative">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border border-blue-100 shadow-xs">
          <CircleDot className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-display tracking-wide uppercase text-[10px]">Generador de letras burbuja copiar y pegar y letras en círculos</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-blue-950 to-indigo-950 bg-clip-text">
          Generador de Letras Burbuja
        </h1>
        <p className="font-sans text-gray-600 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
          El mejor <strong className="text-blue-600 font-bold">generador de letras burbuja</strong> online de internet. Transforma tus textos ordinarios en elegantes <strong className="text-blue-600 font-bold">letras burbuja copiar y pegar</strong> de estilo circular, blanco o negro, totalmente gratis. Decora tu biografía y tus nombres con <strong className="text-blue-600 font-bold">letras en círculos</strong> personalizadas al instante.
        </p>
      </div>

      {/* Main Converter Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 sm:p-9 mb-10 relative overflow-hidden">
        {/* Subtle accent border top */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-3xl" />
        
        {/* Decorative circle patterns */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-50/50 rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-indigo-50/50 rounded-full opacity-60 pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Input text box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="bubble-input" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Escribe tu texto para tus letras burbuja copiar y pegar o letras en círculos:
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleGenerateRandomNick}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-100 hover:border-blue-300 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  title="Generar apodo o nick aleatorio con letras burbuja"
                >
                  <Dices className="w-3 h-3" />
                  <span>Nick Aleatorio</span>
                </button>
                {inputText && (
                  <button
                    onClick={handleClear}
                    className="text-[11px] font-bold text-gray-500 hover:text-rose-600 bg-gray-50 border border-gray-200 hover:border-rose-300 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>
            </div>
            <div className="relative group">
              <input
                id="bubble-input"
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={80}
                placeholder="Ej. letras burbuja copiar y pegar"
                className="w-full bg-gray-50/50 border border-gray-200/80 focus:border-blue-500 focus:bg-white text-gray-950 placeholder-gray-400 font-sans font-semibold text-xl sm:text-2xl rounded-2xl px-5 py-4.5 outline-hidden transition-all duration-300 shadow-sm focus:shadow-md focus:ring-4 focus:ring-blue-500/5"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-mono text-xs text-gray-400 font-bold bg-gray-100 px-2.5 py-1 rounded-lg">
                {inputText.length}/80
              </span>
            </div>
          </div>

          {/* Optimized Customizer Toolbar for Letras Burbuja */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-blue-50/30 border border-blue-100/50 rounded-2xl p-4.5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Fijar Formato:
                </span>
                <div className="flex bg-white p-0.5 rounded-xl border border-gray-200/50 shadow-xs">
                  {(["original", "upper", "lower"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setTextCase(mode)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        textCase === mode
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/60"
                      }`}
                    >
                      {mode === "original" ? "Aa" : mode === "upper" ? "🅜🅐🅨🅤🅢" : "ⓜⓘⓝⓤⓢ"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={normalizeAccents}
                    onChange={(e) => setNormalizeAccents(e.target.checked)}
                    className="w-4 h-4 rounded-md border-gray-200 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <span className="text-[11px] text-gray-600">Autocorregir acentos (á→a, ñ→n)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={spaceToDot}
                    onChange={(e) => setSpaceToDot(e.target.checked)}
                    className="w-4 h-4 rounded-md border-gray-200 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <span className="text-[11px] text-gray-600">Puntos estéticos (•)</span>
                </label>
              </div>
            </div>

            {/* Preview Font Size slider */}
            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-200/80">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0">Pre-visualización:</span>
              <input
                type="range"
                min="16"
                max="36"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-24 sm:w-28 accent-blue-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-blue-700 shrink-0 min-w-[32px] text-right">{fontSize}px</span>
            </div>
          </div>

          {/* Quick Symbols Inserter */}
          <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-blue-500" />
                Decorar tus letras burbuja copiar y pegar y letras en círculos con símbolos:
              </span>
            </div>
            
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-gray-200/60 pb-2.5 mb-3">
              {SYMBOL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSymbolTab(cat.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedSymbolTab === cat.id
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Symbols grid */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {SYMBOL_CATEGORIES.find(c => c.id === selectedSymbolTab)?.symbols.map((sym, i) => (
                <button
                  key={i}
                  onClick={() => handleInjectSymbol(sym)}
                  className="h-9 rounded-lg bg-white hover:bg-gray-50 border border-gray-200/60 hover:border-blue-400/50 flex items-center justify-center text-sm font-semibold text-gray-700 hover:text-gray-950 transition-all cursor-pointer hover:scale-105 active:scale-90"
                  title={`Insertar ${sym}`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div className="space-y-5 pt-4">
            
            {/* White Bubble Card */}
            <div className="bg-gradient-to-br from-blue-50/30 to-indigo-50/10 border border-blue-100/50 rounded-2xl p-5 sm:p-6 relative group transition-all duration-300 hover:shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Letras Burbuja Blancas (Contorno) - ⓐⓛⓔⓧ / ①②③
                </span>
                <span className="text-[10px] bg-blue-50 border border-blue-100/50 text-blue-700 px-2.5 py-0.5 rounded-md font-sans font-semibold">
                  Estilo Limpio Circular
                </span>
              </div>
              
              <p 
                className="font-sans font-extrabold text-blue-950 py-2 select-all break-all pr-16 min-h-[44px]"
                style={{ fontSize: `${fontSize}px`, lineHeight: "1.3" }}
              >
                {generatedWhite || "①②③  ⒶⒷⒸ"}
              </p>

              {generatedWhite && (
                <button
                  onClick={() => handleCopy("white", generatedWhite)}
                  className={`absolute right-5 top-1/2 -translate-y-1/2 p-3 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                    copiedId === "white" 
                      ? "bg-emerald-600 border-emerald-700 text-white shadow-md shadow-emerald-500/15" 
                      : "bg-white text-blue-600 hover:text-blue-800 hover:bg-gray-50 border-gray-250 shadow-xs hover:scale-105 active:scale-95"
                  }`}
                  title="Copiar letras burbuja contorno"
                >
                  {copiedId === "white" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Black Bubble Card */}
            <div className="bg-gradient-to-br from-indigo-50/30 to-slate-50/10 border border-indigo-100/50 rounded-2xl p-5 sm:p-6 relative group transition-all duration-300 hover:shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Letras Burbuja Negras (Rellenas) - 🅐🅛🅔🅧 / ❶❷❸
                </span>
                <span className="text-[10px] bg-indigo-50 border border-indigo-100/50 text-indigo-700 px-2.5 py-0.5 rounded-md font-sans font-semibold">
                  Diseño de Alto Contraste
                </span>
              </div>
              
              <p 
                className="font-sans font-extrabold text-indigo-950 py-2 select-all break-all pr-16 min-h-[44px]"
                style={{ fontSize: `${fontSize}px`, lineHeight: "1.3" }}
              >
                {generatedBlack || "❶❷❸  🅐🅑🅒"}
              </p>

              {generatedBlack && (
                <button
                  onClick={() => handleCopy("black", generatedBlack)}
                  className={`absolute right-5 top-1/2 -translate-y-1/2 p-3 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                    copiedId === "black" 
                      ? "bg-emerald-600 border-emerald-700 text-white shadow-md shadow-emerald-500/15" 
                      : "bg-white text-indigo-600 hover:text-indigo-800 hover:bg-gray-50 border-gray-255 shadow-xs hover:scale-105 active:scale-95"
                  }`}
                  title="Copiar letras burbuja rellenas"
                >
                  {copiedId === "black" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Decorative Templates Row */}
      {inputText.trim() && (
        <div className="mb-10 text-left">
          <h3 className="font-mono text-xs text-gray-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Adornos y bordes listos para tus letras burbuja copiar y pegar
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BUBBLE_DECORATOR_TEMPLATES.map((item) => {
              const decoratedVal = item.template(generatedWhite || inputText);
              const isCopied = copiedId === item.id;
              
              return (
                <div 
                  key={item.id}
                  className="bg-white hover:bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-xs transition-all duration-200"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] text-gray-400 font-sans font-bold uppercase tracking-wider mb-1">
                      {item.label}
                    </span>
                    <p className="text-gray-900 text-base font-semibold truncate select-all font-sans">
                      {decoratedVal}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleCopy(item.id, decoratedVal)}
                    className={`ml-3 shrink-0 p-2.5 rounded-xl transition-all cursor-pointer border ${
                      isCopied
                        ? "bg-emerald-600 border-emerald-700 text-white shadow-md shadow-emerald-500/10"
                        : "bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-950 border-gray-200"
                    }`}
                    title="Copiar diseño decorado"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabbed Bio Presets using Bubble/Circles */}
      <div className="mb-10 bg-white/80 border border-gray-100 rounded-3xl p-6 sm:p-7 shadow-lg shadow-gray-100/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-4">
          <h3 className="font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 text-lg flex items-center gap-2">
            <Instagram className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span>Plantillas con Letras en Círculos y Letras Burbuja</span>
          </h3>
          
          {/* Tabs */}
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 w-full sm:w-auto">
            {[
              { key: 'social', label: 'Social Bios', icon: Instagram },
              { key: 'gaming', label: 'Gaming & Clan', icon: Gamepad2 },
              { key: 'quotes', label: 'Frases Lindas', icon: Quote }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveBioTab(tab.key as any)}
                  className={`flex-1 sm:flex-none text-center px-3 py-1.5 rounded-lg text-[10px] font-bold font-sans transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeBioTab === tab.key 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DETAILED_BUBBLE_BIO_PRESETS[activeBioTab].map((preset, idx) => {
            const isCopied = copiedId === preset.name;
            return (
              <div key={idx} className="bg-gray-50/50 rounded-2xl p-4.5 border border-gray-100 hover:border-gray-200 flex flex-col justify-between transition-all duration-300">
                <pre className="text-xs text-gray-700 font-sans whitespace-pre-line leading-relaxed min-h-[90px] text-left">
                  {preset.preview}
                </pre>
                <button
                  onClick={() => handleCopy(preset.name, preset.raw)}
                  className={`w-full py-2.5 mt-4 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 active:scale-95 border ${
                    isCopied 
                      ? "bg-emerald-600 border-emerald-700 text-white" 
                      : "bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 border-gray-200"
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? "¡Copiado!" : "Copiar plantilla"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini Presets Grid & Circle text info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Popular circles preset */}
        <div className="md:col-span-1 bg-gray-50/40 border border-gray-100/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-gray-800 text-sm mb-1.5 flex items-center gap-1.5">
              <Smile className="w-4.5 h-4.5 text-amber-500" />
              <span>Ejemplos de Letras Burbuja</span>
            </h3>
            <p className="text-xs text-gray-500 font-sans leading-relaxed mb-4">
              Copia directamente algunas combinaciones de letras en círculos de uso común.
            </p>
          </div>

          <div className="space-y-2">
            {POPULAR_BUBBLES.map((pb, idx) => {
              const isCopied = copiedId === `pb-${idx}`;
              return (
                <div key={idx} className="bg-white/90 backdrop-blur-xs rounded-xl p-3 border border-gray-100 flex items-center justify-between hover:shadow-xs transition-all duration-200">
                  <div>
                    <span className="text-[9px] text-gray-400 font-mono font-bold block mb-0.5">{pb.label}</span>
                    <span className="font-sans font-bold text-gray-800 text-xs">{pb.text}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(`pb-${idx}`, pb.text)}
                    className={`p-2 rounded-lg transition-all cursor-pointer border ${
                      isCopied ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "hover:bg-gray-100 text-gray-400 hover:text-gray-600 border-transparent"
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explainers cards */}
        <div className="md:col-span-2 bg-white/90 border border-gray-100/80 rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
            <HelpCircle className="w-4.5 h-4.5 text-blue-500" />
            <span>¿Por qué utilizar letras burbuja?</span>
          </h3>

          <div className="text-xs text-gray-650 font-sans space-y-3.5 leading-relaxed">
            <p>
              Las <strong className="text-blue-600 font-bold">letras burbuja</strong> (también conocidas como fuentes en círculo o letras redondas) son extremadamente efectivas para crear títulos y encabezados visuales en redes sociales y chats donde no hay herramientas nativas para poner negrita o cambiar la tipografía estándar.
            </p>
            <p>
              - <strong>Biografías de Instagram y TikTok:</strong> Al usar <strong className="text-blue-600 font-semibold">letras burbuja copiar y pegar</strong>, que son símbolos gráficos de alta visibilidad, guías la mirada de los usuarios directamente a tus enlaces o datos de contacto importantes.
            </p>
            <p>
              - <strong>Nombres de perfil en videojuegos (nicks):</strong> Juegos como Free Fire, PUBG, Roblox o Minecraft permiten el uso de símbolos unicode para destacar tus nombres en las tablas de clasificación de forma espectacular.
            </p>
            <p>
              - <strong>Notas y listas de tareas:</strong> Puedes usar las <strong className="text-blue-600 font-semibold">letras en círculos</strong> numéricos (①, ②, ③) para ordenar listas numeradas estilizadas en tu bloc de notas favorito o en Notion.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="mb-10 bg-white/90 rounded-3xl p-6 sm:p-8 border border-gray-100">
        <h3 className="font-sans font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
          <span className="p-1.5 bg-blue-500/10 rounded-xl text-blue-600"><HelpCircle className="w-5 h-5" /></span>
          <span>Preguntas Frecuentes sobre Letras Burbuja Copiar y Pegar</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div 
                key={idx}
                className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 bg-gray-50/20 text-left"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left font-sans font-bold text-sm text-gray-800 hover:text-gray-950 hover:bg-gray-100/40 transition-all cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-4 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep SEO Article to boost keyword density for "letras burbuja", "generador de letras burbuja", "letras burbuja copiar y pegar" */}
      <div className="bg-white/90 p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6 mb-10">
        <h3 className="font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <span>Guía Definitiva de Letras Burbuja y Letras en Círculos para tus Redes</span>
        </h3>
        
        <div className="text-xs text-gray-500 space-y-4 leading-relaxed">
          <p>
            En la búsqueda constante de originalidad y estilo, el uso de <strong className="text-blue-600 font-semibold">letras burbuja</strong> se ha consolidado como una de las tendencias de personalización más fuertes en la web de habla hispana. Si necesitas un método eficaz para que tus publicaciones resalten en las redes, nuestro <strong className="text-blue-600 font-semibold">generador de letras burbuja</strong> es la herramienta definitiva que estabas buscando. Al convertir palabras comunes en hermosas <strong className="text-blue-600 font-semibold">letras burbuja copiar y pegar</strong>, estás adaptando un formato visual de <strong className="text-blue-600 font-semibold">letras burbuja</strong> que agrada al ojo y jerarquiza la lectura con <strong className="text-blue-600 font-semibold">letras burbuja</strong> en dispositivos móviles. Generar tus <strong className="text-blue-600 font-semibold">letras burbuja</strong> favoritas nunca había sido tan sencillo gracias a este convertidor especializado de <strong className="text-blue-600 font-semibold">letras burbuja</strong>.
          </p>

          <div>
            <h4 className="font-bold text-gray-800 mb-1.5">¿Qué son exactamente las letras burbuja copiar y pegar?</h4>
            <p>
              El concepto de <strong className="text-blue-600 font-semibold">letras burbuja copiar y pegar</strong> hace referencia al alfabeto del estándar Unicode que encierra letras del abecedario ordinario dentro de formas esféricas. Al emplear un <strong className="text-blue-600 font-semibold">generador de letras burbuja</strong> como el nuestro, accedes instantáneamente a caracteres preconfigurados de <strong className="text-blue-600 font-semibold">letras burbuja</strong> que actúan como <strong className="text-blue-600 font-semibold">letras en círculos</strong>, listos para integrarse en perfiles de Instagram o nicknames con <strong className="text-blue-600 font-semibold">letras burbuja</strong> para videojuegos. Además, no dependes de ninguna descarga de fuentes de <strong className="text-blue-600 font-semibold">letras burbuja</strong>, pues las <strong className="text-blue-600 font-semibold">letras burbuja copiar y pegar</strong> se comportan exactamente como texto plano convencional para cualquier servidor o buscador que lee estas <strong className="text-blue-600 font-semibold">letras burbuja</strong>.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-1.5">Ventajas de emplear nuestro generador de letras burbuja</h4>
            <p>
              Utilizar un <strong className="text-blue-600 font-semibold">generador de letras burbuja</strong> rentable tiene enormes beneficios. Nuestra plataforma en línea de <strong className="text-blue-600 font-semibold">letras burbuja</strong> no solo te ofrece la tradicional tipografía de <strong className="text-blue-600 font-semibold">letras burbuja</strong> blancas con contorno, sino también las llamativas esferas negras rellenas de <strong className="text-blue-600 font-semibold">letras burbuja</strong> con tipografía en negativo. El <strong className="text-blue-600 font-semibold">generador de letras burbuja</strong> efectúa una traducción en tiempo real de tus palabras a <strong className="text-blue-600 font-semibold">letras burbuja</strong>, de manera que solo debes escribir y copiar tu combinación favorita de <strong className="text-blue-600 font-semibold">letras burbuja</strong>. Además, puedes añadir emojis decorativos a tus <strong className="text-blue-600 font-semibold">letras burbuja</strong> para dar mayor espectacularidad a tus proyectos creados con <strong className="text-blue-600 font-semibold">letras burbuja</strong>.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-1.5">Cómo integrar letras en círculos en Free Fire, Roblox y nicks gamer</h4>
            <p>
              La comunidad de jugadores es una de las que más se beneficia de las <strong className="text-blue-600 font-semibold">letras burbuja</strong>. En plataformas como Free Fire, PUBG, Fortnite o Roblox, mostrar un nombre exclusivo con <strong className="text-blue-600 font-semibold">letras burbuja</strong> determina tu identidad digital en la sala. Con nuestras <strong className="text-blue-600 font-semibold">letras en círculos</strong> y el especializado <strong className="text-blue-600 font-semibold">generador de letras burbuja</strong>, puedes crear nicks estilizados con <strong className="text-blue-600 font-semibold">letras burbuja</strong> que asombren a tus compañeros de clan. Simplemente diseña tu apodo de combate y copia las <strong className="text-blue-600 font-semibold">letras burbuja</strong> resultantes de nuestro sistema. La portabilidad de estas <strong className="text-blue-600 font-semibold">letras burbuja</strong> es asombrosa, viéndose sin problemas en pantallas de celulares con soporte para <strong className="text-blue-600 font-semibold">letras burbuja</strong>.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-1.5">Estrategias de formato con letras burbuja copiar y pegar:</h4>
            <ul className="list-disc list-inside space-y-1.5 text-gray-500">
              <li>Destaca palabras clave de tu negocio o biografía convirtiéndolas en <strong className="text-blue-600 font-semibold">letras burbuja copiar y pegar</strong> rellenas de color negro para un contraste brutal con tus <strong className="text-blue-600 font-semibold">letras burbuja</strong>.</li>
              <li>Ordena listas en tus documentos o guías usando las <strong className="text-blue-600 font-semibold">letras burbuja</strong> para los números del ① al ⑩ en formato de <strong className="text-blue-600 font-semibold">letras burbuja</strong> limpias.</li>
              <li>Mezcla bloques de texto ordinario con adornos en los bordes y remates utilizando <strong className="text-blue-600 font-semibold">letras burbuja copiar y pegar</strong> estéticas y elegantes para crear tus propias <strong className="text-blue-600 font-semibold">letras burbuja</strong>.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-1.5">Seguridad y compatibilidad de las letras burbuja copiar y pegar</h4>
            <p>
              Tanto las <strong className="text-blue-600 font-semibold">letras en círculos</strong> como las <strong className="text-blue-600 font-semibold">letras burbuja</strong> que generas en nuestra web respetan estrictamente los protocolos oficiales de codificación Unicode. Esto garantiza que las <strong className="text-blue-600 font-semibold">letras burbuja copiar y pegar</strong> se rendericen óptimamente en la inmensa mayoría de dispositivos móviles. Disfruta de un portal seguro para crear <strong className="text-blue-600 font-semibold">letras burbuja</strong>, rápido, libre de virus y sumamente ágil para dar vida a tus apodos y textos con increíbles <strong className="text-blue-600 font-semibold">letras burbuja copiar y pegar</strong> y diseños de <strong className="text-blue-600 font-semibold">letras burbuja</strong> personalizados.
            </p>
          </div>
        </div>
      </div>

      {/* Core SEO explanatory block */}
      <div className="bg-gray-50/80 p-5 sm:p-6 rounded-2xl border border-gray-150">
        <h4 className="font-sans font-bold text-gray-800 text-sm mb-3 flex items-center gap-1.5">
          <CheckSquare className="w-4 h-4 text-blue-500" />
          ¿Cómo funciona el convertidor de letras en círculos y letras burbuja?
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          Nuestra herramienta web no requiere instalar archivos de fuentes tipográficas para conseguir tus <strong className="text-blue-600 font-semibold">letras burbuja</strong>. Al introducir tu texto normal, el algoritmo del <strong className="text-blue-600 font-semibold">generador de letras burbuja</strong> traduce dinámicamente cada carácter ordinario a su respectivo símbolo para <strong className="text-blue-600 font-semibold">letras burbuja</strong> y <strong className="text-blue-600 font-semibold">letras burbuja copiar y pegar</strong>. Al tratarse de un estándar global, puedes usar tus <strong className="text-blue-600 font-semibold">letras burbuja</strong> libremente en cualquier rincón de internet con compatibilidad total de <strong className="text-blue-600 font-semibold">letras burbuja</strong>.
        </p>
      </div>

    </div>
  );
}
