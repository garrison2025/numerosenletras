import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Settings, X, Check } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    ads: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(consent);
        setPreferences(p => ({ ...p, ...parsed }));
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  useEffect(() => {
    const handleOpenSettings = () => {
      setShowBanner(true);
      setShowCustomize(true);
    };
    window.addEventListener("open-cookie-settings", handleOpenSettings);
    return () => {
      window.removeEventListener("open-cookie-settings", handleOpenSettings);
    };
  }, []);

  const handleAcceptAll = () => {
    const consentData = { essential: true, analytics: true, ads: true };
    setPreferences(consentData);
    localStorage.setItem("cookie-consent", JSON.stringify(consentData));
    // Emit consent changed event for other components if needed
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consentData }));
    setShowBanner(false);
  };

  const handleDeclineAll = () => {
    const consentData = { essential: true, analytics: false, ads: false };
    setPreferences(consentData);
    localStorage.setItem("cookie-consent", JSON.stringify(consentData));
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consentData }));
    setShowBanner(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: preferences }));
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white border border-gray-150 rounded-2xl shadow-xl shadow-gray-200/50 p-5 z-50 font-sans text-left"
          id="cookie-consent-banner"
        >
          {!showCustomize ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    Control de Privacidad y Cookies
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Utilizamos cookies propias y de terceros para optimizar el rendimiento de la web, analizar las visitas mediante Google Analytics y ofrecer publicidad relevante adaptada a ti mediante Google AdSense.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer text-center"
                >
                  Aceptar Todo
                </button>
                <button
                  type="button"
                  onClick={handleDeclineAll}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl text-xs transition cursor-pointer text-center"
                >
                  Rechazar
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomize(true)}
                  className="px-3 py-2 border border-gray-200 hover:border-blue-300 text-gray-500 hover:text-blue-600 font-semibold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"
                  title="Personalizar cookies"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configurar</span>
                </button>
              </div>
              <div className="text-center">
                <a
                  href="/privacidad"
                  className="text-[10px] text-gray-400 hover:text-blue-500 hover:underline inline-block"
                >
                  Leer nuestra Política de Privacidad
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-blue-600" />
                  Configurar Preferencias
                </h4>
                <button
                  type="button"
                  onClick={() => setShowCustomize(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Essential cookies */}
                <div className="flex items-start justify-between gap-4 p-2.5 rounded-xl hover:bg-gray-50/50">
                  <div className="space-y-0.5 text-left">
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      Cookies Esenciales
                      <span className="text-[9px] px-1.5 py-0.2 bg-gray-100 text-gray-500 rounded font-mono font-medium">Obligatorio</span>
                    </span>
                    <p className="text-[10.5px] text-gray-500 leading-normal">
                      Necesarias para recordar tus preferencias de cookies, formato decimal y tus conversiones locales favoritas.
                    </p>
                  </div>
                  <div className="pt-0.5 shrink-0">
                    <div className="w-8 h-5 rounded-full bg-blue-100 flex items-center justify-end px-1 border border-blue-200">
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white">
                        <Check className="w-2 h-2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics cookies */}
                <div className="flex items-start justify-between gap-4 p-2.5 rounded-xl hover:bg-gray-50/50">
                  <div className="space-y-0.5 text-left">
                    <span className="text-xs font-bold text-gray-800">
                      Métricas y Estadísticas
                    </span>
                    <p className="text-[10.5px] text-gray-500 leading-normal">
                      Permite el uso de Google Analytics de forma anonimizada para entender cómo interactúan los usuarios con nuestras herramientas didácticas.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.analytics}
                    aria-label="Permitir métricas y estadísticas de Google Analytics"
                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                    className={`w-10 h-6 rounded-full transition-all flex items-center px-0.5 border cursor-pointer ${
                      preferences.analytics
                        ? "bg-blue-600 border-blue-700 justify-end"
                        : "bg-gray-200 border-gray-300 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                {/* Advertising cookies */}
                <div className="flex items-start justify-between gap-4 p-2.5 rounded-xl hover:bg-gray-50/50">
                  <div className="space-y-0.5 text-left">
                    <span className="text-xs font-bold text-gray-800">
                      Publicidad Personalizada
                    </span>
                    <p className="text-[10.5px] text-gray-500 leading-normal">
                      Permite a Google AdSense y sus socios comerciales el uso de cookies para mostrarte anuncios adaptados a tus intereses previos.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.ads}
                    aria-label="Permitir cookies de publicidad personalizada de Google AdSense"
                    onClick={() => setPreferences(p => ({ ...p, ads: !p.ads }))}
                    className={`w-10 h-6 rounded-full transition-all flex items-center px-0.5 border cursor-pointer ${
                      preferences.ads
                        ? "bg-blue-600 border-blue-700 justify-end"
                        : "bg-gray-200 border-gray-300 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer text-center"
                >
                  Guardar Selección
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomize(false)}
                  className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 font-semibold rounded-xl text-xs transition cursor-pointer text-center"
                >
                  Volver
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
