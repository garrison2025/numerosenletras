import React from "react";
import { Keyboard, Receipt, Sparkles, CircleDot, BookOpen, FileText, ArrowRight, Bookmark } from "lucide-react";

interface InterlinkingMatrixProps {
  currentPath?: string;
}

export default function InterlinkingMatrix({ currentPath }: InterlinkingMatrixProps) {
  const tools = [
    {
      id: "/",
      href: "#/",
      title: "Convertidor de Números a Letras",
      desc: "Herramienta general para transcribir cualquier cifra o número entero y decimal a palabras en español.",
      icon: Keyboard,
      color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      id: "/cantidad-con-letra",
      href: "#/cantidad-con-letra",
      title: "Conversor de Cantidad con Letra",
      desc: "Escribe cantidades de dinero en letras con el formato oficial para llenar cheques, facturas y contratos.",
      icon: Receipt,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      id: "/como-se-escribe",
      href: "#/como-se-escribe",
      title: "Guía de Ortografía RAE de Números",
      desc: "Aprende las reglas ortográficas oficiales para escribir números complejos, cien o ciento, veintiuno y más.",
      icon: BookOpen,
      color: "text-amber-600 bg-amber-50 border-amber-100"
    },
    {
      id: "/letras-aesthetic",
      href: "#/letras-aesthetic",
      title: "Letras Aesthetic Copiar y Pegar",
      desc: "Genera fuentes bonitas, cursivas, góticas y símbolos mágicos para personalizar tus redes sociales.",
      icon: Sparkles,
      color: "text-purple-600 bg-purple-50 border-purple-100"
    },
    {
      id: "/letras-burbuja",
      href: "#/letras-burbuja",
      title: "Generador de Letras Burbuja",
      desc: "Transforma tus frases en elegantes letras con círculos blancos y negros para nombres de clanes y nicks.",
      icon: CircleDot,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100"
    }
  ];

  const featuredArticles = [
    {
      href: "#/blog/guia-convertir-numeros-a-letras-rae-finanzas",
      title: "Guía Suprema: Cómo Convertir Números a Letras en Español",
      desc: "Las reglas ortográficas completas de la RAE, la redacción comercial y el uso del 'un mil' ante 'mil'."
    },
    {
      href: "#/blog/arte-letras-burbuja-tipografia-circular-copiar-pegar",
      title: "El Arte de las Letras Burbuja en Redes Sociales",
      desc: "Cómo funciona la codificación Unicode de los círculos y consejos de SEO para tus biografías."
    },
    {
      href: "#/blog/letras-aesthetic-fuentes-pequenas-instagram-tiktok",
      title: "Guía de Letras Aesthetic y Fuentes Pequeñas",
      desc: "Aprende a captar atención visual usando letras pequeñas versalitas, superíndices y símbolos en tu bio."
    }
  ];

  return (
    <section className="mt-12 bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 text-left space-y-8 shadow-sm">
      <header className="border-b border-gray-100 pb-4">
        <h3 className="font-display font-bold text-gray-950 text-base sm:text-lg flex items-center gap-2.5">
          <span className="p-1.5 bg-blue-50 rounded-xl text-blue-600"><Bookmark className="w-5 h-5" /></span>
          <span>Explora Nuestras Herramientas y Guías Gratuitas</span>
        </h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Navegación inteligente interconectada. Cambia de herramienta o lee guías profesionales redactadas para evitar errores tipográficos o mejorar tus biografías de redes sociales.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Core tools column */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 font-mono">Convertidores y Editores Libres</h4>
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isCurrent = currentPath === tool.id;
              return (
                <a
                  key={tool.id}
                  href={tool.href}
                  className={`group p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    isCurrent 
                      ? "border-blue-500 bg-blue-50/10 shadow-xs ring-2 ring-blue-500/5 cursor-default" 
                      : "border-gray-150 hover:border-gray-300 hover:bg-gray-50/50 hover:shadow-xs"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg border ${tool.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-sans font-bold text-xs sm:text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                        {tool.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">
                      {tool.desc}
                    </p>
                  </div>
                  {!isCurrent && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 mt-3 group-hover:translate-x-0.5 transition-transform">
                      <span>Usar herramienta</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                  {isCurrent && (
                    <div className="text-[9px] font-mono font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md self-start mt-3">
                      Herramienta Actual
                    </div>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Featured blog section */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 font-mono">Guías y Artículos Destacados</h4>
          <div className="space-y-4">
            {featuredArticles.map((article, index) => (
              <a
                key={index}
                href={article.href}
                className="group block p-4 rounded-2xl border border-gray-150 hover:border-gray-300 hover:bg-gray-50/50 hover:shadow-xs transition-all duration-300"
              >
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                    <FileText className="w-3 h-3" />
                    <span>Artículo RAE</span>
                  </div>
                  <h5 className="font-sans font-bold text-xs text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h5>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-sans line-clamp-2">
                    {article.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
