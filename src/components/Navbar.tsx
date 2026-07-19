import { useState } from "react";
import { 
  Type, 
  Receipt, 
  Sparkles, 
  CircleDot, 
  BookOpen, 
  Menu, 
  X,
  Keyboard
} from "lucide-react";

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      id: "/",
      label: "Convertidor",
      desc: "General",
      icon: Keyboard,
      badge: "Gratis"
    },
    {
      id: "/cantidad-con-letra",
      label: "Cantidad con Letra",
      desc: "Finanzas y Cheques",
      icon: Receipt,
      badge: "Finanzas"
    },
    {
      id: "/letras-aesthetic",
      label: "Letras Aesthetic",
      desc: "Fuentes & Biografías",
      icon: Sparkles,
      badge: "Social"
    },
    {
      id: "/letras-burbuja",
      label: "Letras Burbuja",
      desc: "Fuentes Circulares",
      icon: CircleDot,
      badge: "Popular"
    },
    {
      id: "/como-se-escribe",
      label: "Cómo se Escribe",
      desc: "Ortografía & FAQs",
      icon: BookOpen,
      badge: "Guía"
    },
    {
      id: "/blog",
      label: "Blog",
      desc: "Guías & Artículos",
      icon: BookOpen,
      badge: "SEO"
    }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b bg-white/85 border-gray-100/80 text-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/");
              }}
              className="flex items-center space-x-3 group cursor-pointer text-left"
            >
              {/* Premium Geometric SVG Logo */}
              <div className="relative w-10 h-10 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logoGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#4F46E5" />
                    </linearGradient>
                    <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#2563EB" floodOpacity="0.15" />
                    </filter>
                  </defs>
                  {/* Background element */}
                  <rect width="100" height="100" rx="24" fill="rgba(37,99,235,0.06)" />
                  {/* Stylized unfolding letter 'N' and 'L' ribbon paths */}
                  <path 
                    d="M30 70V30L50 54L70 30V70" 
                    stroke="url(#logoGradLight)" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  {/* Dynamic overlay dot represent digit */}
                  <circle 
                    cx="50" 
                    cy="68" 
                    r="6.5" 
                    fill="#3B82F6" 
                    className="animate-pulse" 
                  />
                </svg>
                {/* Micro outer rings */}
                <div className="absolute inset-0 border-2 rounded-2xl scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 border-blue-500/15" />
              </div>
              
              <div>
                <span className="font-display font-bold text-xl tracking-tight block leading-none">
                  <span className="text-slate-900">números</span>
                  <span className="text-blue-600">en</span>
                  <span className="text-slate-900">letras</span>
                </span>
                <span className="text-[10px] font-mono block mt-1 tracking-wider uppercase font-semibold text-blue-600/80">
                  numerosenletras.org
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1.5">
            {navItems.map((item) => {
              const isActive = currentPath === item.id || (item.id === "/blog" && currentPath.startsWith("/blog"));
              const Icon = item.icon;
              
              const buttonStyle = isActive 
                ? "bg-blue-50 text-blue-700 border border-blue-100" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-950 border border-transparent";
              const iconStyle = isActive ? "text-blue-600" : "text-gray-400";
              const badgeStyle = isActive ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500";

              return (
                <a
                  key={item.id}
                  href={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`relative px-4 py-2.5 rounded-2xl flex flex-col items-start text-left transition-all duration-300 cursor-pointer ${buttonStyle}`}
                >
                  <div className="flex items-center space-x-1.5">
                    <Icon className={`w-4 h-4 transition-colors duration-300 ${iconStyle}`} />
                    <span className="font-sans font-semibold text-sm tracking-tight">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[8.5px] px-1.5 py-0.5 rounded-md font-mono font-bold ${badgeStyle}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] mt-0.5 font-sans block pl-5.5 text-gray-400">
                    {item.desc}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg focus:outline-hidden cursor-pointer transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t px-4 pt-2 pb-4 space-y-1.5 shadow-lg animate-fade-in border-gray-100 bg-white/98 text-gray-700">
          {navItems.map((item) => {
            const isActive = currentPath === item.id || (item.id === "/blog" && currentPath.startsWith("/blog"));
            const Icon = item.icon;
            
            const itemStyle = isActive 
              ? "bg-blue-50 text-blue-700 font-semibold" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
            const badgeStyle = isActive ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500";

            return (
              <a
                key={item.id}
                href={item.id}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${itemStyle}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`} />
                  <div>
                    <span className="font-sans text-sm block tracking-tight">{item.label}</span>
                    <span className="text-[11px] font-sans block text-gray-400">{item.desc}</span>
                  </div>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${badgeStyle}`}>
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
}
