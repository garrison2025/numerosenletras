import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomeConverter from "./components/HomeConverter";
import QuantityWithLetter from "./components/QuantityWithLetter";
import AestheticLetters from "./components/AestheticLetters";
import BubbleLetters from "./components/BubbleLetters";
import HowToEscribe from "./components/HowToEscribe";
import { AboutUs, PrivacyPolicy, TermsOfService, ContactPage } from "./components/LegalPages";
import CookieBanner from "./components/CookieBanner";
import Blog, { BLOG_POSTS } from "./components/Blog";
import InterlinkingMatrix from "./components/InterlinkingMatrix";

const blogNumerosLetras = "/assets/images/blog_numeros_letras.webp";
const blogLetrasBurbuja = "/assets/images/blog_letras_burbuja.webp";
const blogLetrasAesthetic = "/assets/images/blog_letras_aesthetic.webp";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  ExternalLink,
  ArrowUp
} from "lucide-react";

export default function App() {
  const [currentPath, setCurrentPath] = useState("/");
  const [selectedNumber, setSelectedNumber] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top automatically when currentPath changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

  // Monitor scroll height to show/hide "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sync state with path or hash on mount and when hash/popstate changes
  useEffect(() => {
    const handleRouteSync = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      let path = "/";
      let searchParams = new URLSearchParams(window.location.search);

      if (hash.startsWith("#/")) {
        const urlPart = hash.substring(1); // e.g. "/?n=125" or "/cantidad-con-letra?amount=24"
        const questionIdx = urlPart.indexOf("?");
        if (questionIdx !== -1) {
          path = urlPart.substring(0, questionIdx);
          const hashParams = new URLSearchParams(urlPart.substring(questionIdx));
          hashParams.forEach((value, key) => {
            searchParams.set(key, value);
          });
        } else {
          path = urlPart;
        }
      } else if (pathname && pathname !== "/") {
        // Direct landing via SEO clean path URL
        path = pathname;
      }

      // Check for query parameters 'n' or 'amount' to set as initial number
      const numParam = searchParams.get("n") || searchParams.get("amount");
      if (numParam) {
        setSelectedNumber(numParam);
      }

      // Check for query parameters 'text' or 'q' to set as initial creative text
      const textParam = searchParams.get("text") || searchParams.get("q");
      if (textParam) {
        setSelectedText(textParam);
      }

      setCurrentPath(path);
    };

    // Initialize
    handleRouteSync();

    window.addEventListener("hashchange", handleRouteSync);
    window.addEventListener("popstate", handleRouteSync);
    return () => {
      window.removeEventListener("hashchange", handleRouteSync);
      window.removeEventListener("popstate", handleRouteSync);
    };
  }, []);

  // Dynamic SEO metadata updater for page independence
  useEffect(() => {
    // Read hash-based query params directly for maximum indexing accuracy
    const hash = window.location.hash;
    let searchParams = new URLSearchParams();
    if (hash.includes("?")) {
      searchParams = new URLSearchParams(hash.substring(hash.indexOf("?")));
    }
    const n = searchParams.get("n") || searchParams.get("amount") || selectedNumber;
    const text = searchParams.get("text") || searchParams.get("q") || selectedText;

    let title = "Conversor de Números a Letras | Escribir Números en Palabras";
    let description = "Herramienta online para convertir números a letras en español de forma instantánea. Ideal para cheques, contratos, facturas y aprender cómo se escribe cualquier cantidad.";
    let keywords = "como se escribe con letra, cómo se escribe con letra, conversor de numeros a letras, números a letras, letras burbuja, letras burbuja copiar y pegar, generador de letras burbuja, letras aesthetic";
    let resolvedImage = blogNumerosLetras;
    let schemaData: any = null;

    if (currentPath.startsWith("/blog")) {
      if (currentPath === "/blog") {
        title = "Blog Oficial de numerosenletras.org | Ortografía, Finanzas y Tipografía Creativa";
        description = "Explora nuestras guías gratuitas sobre cómo escribir números en letras según la RAE, cómo rellenar un cheque sin errores y cómo personalizar tus redes sociales con letras burbuja y aesthetic.";
        keywords = "blog oficial, guias ortograficas, finanzas, tipografia creativa, como escribir numeros, letras burbuja, letras aesthetic";
        resolvedImage = blogNumerosLetras;
        schemaData = {
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Blog Oficial de numerosenletras.org",
          "url": "https://numerosenletras.org/blog",
          "description": "Explora nuestras guías gratuitas sobre cómo escribir números en letras según la RAE, cómo rellenar un cheque sin errores y cómo personalizar tus redes sociales con letras burbuja y aesthetic."
        };
      } else {
        const slug = currentPath.substring(6); // e.g. "/blog/guia-convertir..." -> "guia-convertir..."
        const post = BLOG_POSTS.find(p => p.slug === slug);
        if (post) {
          title = `${post.title} | Blog numerosenletras.org`;
          description = post.excerpt;
          keywords = post.keywords.join(", ");
          resolvedImage = post.image;
          const postUrl = `https://numerosenletras.org/blog/${post.slug}`;
          const postImgUrl = post.image.startsWith("http") ? post.image : `https://numerosenletras.org${post.image}`;
          schemaData = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": [postImgUrl],
            "datePublished": "2026-07-17",
            "dateModified": "2026-07-19",
            "author": {
              "@type": "Person",
              "name": post.author,
              "url": "https://numerosenletras.org/sobre-nosotros"
            },
            "publisher": {
              "@type": "Organization",
              "name": "numerosenletras.org",
              "logo": {
                "@type": "ImageObject",
                "url": "https://numerosenletras.org/assets/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": postUrl
            },
            "url": postUrl
          };
        }
      }
    } else {
      switch (currentPath) {
        case "/":
          if (n && !isNaN(Number(n.replace(/[^0-9.-]/g, '')))) {
            title = `¿Cómo se escribe ${n} en letras? | Conversor de Números`;
            description = `Aprende cómo se escribe el número ${n} con letras en español de forma instantánea y gratuita. Revisa las normas de ortografía oficiales de la RAE para ${n}.`;
          } else {
            title = "Conversor de Números a Letras | Escribir Números en Palabras";
            description = "Herramienta online para convertir números a letras en español de forma instantánea. Ideal para cheques, contratos, facturas y aprender cómo se escribe cualquier cantidad.";
          }
          keywords = "como se escribe con letra, cómo se escribe con letra, conversor de numeros a letras, números a letras, letras burbuja, letras burbuja copiar y pegar, generador de letras burbuja, letras aesthetic";
          resolvedImage = blogNumerosLetras;
          schemaData = {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "name": "Conversor de Números a Letras",
                "url": "https://numerosenletras.org/",
                "description": "Herramienta online para convertir números a letras en español de forma instantánea. Ideal para cheques, contratos, facturas y aprender cómo se escribe cualquier cantidad.",
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "All",
                "browserRequirements": "Requires HTML5, CSS3, JavaScript"
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "¿Hasta qué cantidad puede convertir este conversor de números a letras?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Nuestra herramienta gratuita de conversión es capaz de traducir números de hasta 12 dígitos (rango de los billones) a letras en español con absoluta precisión gramatical y ortográfica según la RAE."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "¿La conversión de números a letras es segura y privada?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Sí, el 100% del procesamiento de tus cifras se ejecuta de forma local en tu navegador web a través de JavaScript. No guardamos ni enviamos tus datos, cantidades o montos a ningún servidor externo."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "¿Cómo se deben escribir los números con decimales en letras?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "La RAE aconseja escribir la parte entera en palabras, añadir la conjunción 'con' y expresar seguidamente la parte decimal. Por ejemplo, el número '45.12' se escribe correctamente como 'cuarenta y cinco con doce centésimas' o simplemente 'cuarenta y cinco con doce'."
                    }
                  }
                ]
              }
            ]
          };
          break;
        case "/cantidad-con-letra":
          if (n && !isNaN(Number(n.replace(/[^0-9.-]/g, '')))) {
            title = `Cantidad con Letra: ${n} | Conversor para Cheques y Facturas`;
            description = `Aprende cómo escribir la cantidad de ${n} con letras en español para cheques, recibos y facturas oficiales. Compatible con pesos, dólares y euros.`;
          } else {
            title = "Convertir Cantidades a Letras | Generador para Cheques y Facturas";
            description = "Escribe cualquier cantidad de dinero en letras de forma correcta. Compatible con pesos, dólares, euros y más. Genera el formato formal para rellenar cheques y recibos.";
          }
          keywords = "cantidad con letra, números a letras, cheques en letras, facturas con letra, escribir cantidades, convertidor de dinero";
          resolvedImage = blogNumerosLetras;
          schemaData = {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "name": "Cantidad con Letra - Conversor Financiero",
                "url": "https://numerosenletras.org/cantidad-con-letra",
                "description": "Escribe cualquier cantidad de dinero en letras de forma correcta. Compatible con pesos, dólares, euros y más. Genera el formato formal para rellenar cheques y recibos.",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All"
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "¿Cuál es el formato formal en letras para rellenar un cheque?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Para cheques oficiales se emplea el formato estándar: la cantidad completa en palabras seguida del nombre de la divisa y de la fracción centenaria de centavos sobre cien (por ejemplo: 'Dos mil quinientos pesos 50/100 M.N.' o 'Mil dólares 00/100 USD')."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "¿Por qué es obligatorio el uso de letras en la cantidad de un cheque o pagaré?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "En el derecho mercantil, si existe una discrepancia o contradicción entre la cantidad escrita en números (dígitos) y la cantidad expresada en letras, prevalecerá y se considerará jurídicamente válida la cantidad redactada en letras."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "¿Qué divisas latinoamericanas y europeas admite este conversor?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Es compatible con una gran variedad de monedas de la región, como el Peso Mexicano (MXN), Dólar (USD), Euro (EUR), Peso Colombiano (COP), Sol Peruano (PEN), Peso Chileno (CLP), Peso Argentino (ARS) y más, adaptando los sufijos correspondientes como 'M.N.', 'USD', o 'y CTS.'"
                    }
                  }
                ]
              }
            ]
          };
          break;
        case "/letras-aesthetic":
          if (text) {
            title = `Letras Aesthetic para "${text}" | Conversor de Fuentes Lindas`;
            description = `Genera fuentes personalizadas, letras aesthetic, cursivas and símbolos decorativos para "${text}" al instante. Copia y pega en tu biografía de redes sociales.`;
          } else {
            title = "Letras Aesthetic | Conversor de Fuentes Lindas y Bonitas online";
            description = "Transforma tus textos normales en letras aesthetic, fuentes cursivas, negritas and símbolos mágicos para copiar y pegar en tu biografía de Instagram, TikTok y más.";
          }
          keywords = "letras aesthetic, tipografias bonitas, fuentes lindas, fuentes cursivas para copiar, letras para instagram";
          resolvedImage = blogLetrasAesthetic;
          schemaData = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Letras Aesthetic - Generador de Fuentes",
            "url": "https://numerosenletras.org/letras-aesthetic",
            "description": "Transforma tus textos normales en letras aesthetic, fuentes cursivas, negritas and símbolos mágicos para copiar y pegar en tu biografía de Instagram, TikTok y más.",
            "applicationCategory": "DesignApplication",
            "operatingSystem": "All"
          };
          break;
        case "/letras-burbuja":
          if (text) {
            title = `Letras Burbuja para "${text}" Ⓑⓤⓡⓑⓤⓙⓐ | Copiar y Pegar`;
            description = `Convierte "${text}" en letras de burbuja circulares de forma automática. Fuentes tipográficas con círculos negros y blancos listas para copiar y pegar.`;
          } else {
            title = "Letras Burbuja Ⓑⓤⓡⓑⓤⓙⓐ | Fuentes Circulares para Copiar y Pegar";
            description = "Generador de fuentes de burbuja y letras con círculos. Convierte tu texto ordinario en elegantes tipografías esféricas al instante de forma gratuita.";
          }
          keywords = "letras burbuja, letras burbuja copiar y pegar, fuentes circulares, letras con circulos, generador de letras burbuja";
          resolvedImage = blogLetrasBurbuja;
          schemaData = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Letras Burbuja - Generador de Fuentes Circulares",
            "url": "https://numerosenletras.org/letras-burbuja",
            "description": "Generador de fuentes de burbuja y letras con círculos. Convierte tu texto ordinario en elegantes tipografías esféricas al instante de forma gratuita.",
            "applicationCategory": "DesignApplication",
            "operatingSystem": "All"
          };
          break;
        case "/como-se-escribe":
          title = "¿Cómo se escribe...? | Ortografía de Números en Español";
          description = "Guía ortográfica y diccionario de números en letras. Aprende las reglas de acentuación, concordancia y ortografía correcta de los números complejos.";
          keywords = "como se escribe, ortografia de numeros, numeros en letras rae, cien o ciento, veintiuno o veintiun";
          resolvedImage = blogNumerosLetras;
          schemaData = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Cómo se escribe con letra el número 100?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Saber cómo se escribe con letra el 100 es una de las dudas más comunes. Se escribe estrictamente como 'cien' cuando expresa la cantidad exacta de 100 (ej: cien personas, cien euros). Sin embargo, se transforma en 'ciento' cuando va seguido de otros números menores."
                }
              },
              {
                "@type": "Question",
                "name": "Al buscar cómo se escribe con letra el 21, ¿se usa 'veintiuno' o 'veintiún'?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Para entender cómo se escribe con letra el número 21, es importante notar que ambas formas son correctas pero dependen del contexto gramatical: se usa 'veintiún' cuando acompaña directamente a un sustantivo masculino, y se utiliza 'veintiuno' cuando se menciona el número de forma aislada."
                }
              },
              {
                "@type": "Question",
                "name": "Para transacciones financieras, ¿cómo se escribe con letra el 1000?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Si te preguntas cómo se escribe con letra la cifra de 1000, la RAE aconseja el uso exclusivo de 'mil' cuando nos referimos de forma directa y única. El uso de 'un mil' se considera redundante en el habla común, aunque es aceptado y muy frecuente en documentos financieros."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cómo se escribe con letra la palabra millón?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Cuando estudiamos cómo se escribe con letra una cifra de millones, vemos que 'millón' lleva tilde en la 'o' por ser una palabra aguda terminada en 'n'. Su plural es 'millones', el cual pierde la tilde por convertirse en una palabra llana terminada en 's'."
                }
              }
            ]
          };
          break;
        case "/sobre-nosotros":
          title = "Quiénes Somos | numerosenletras.org";
          description = "Conoce más sobre la misión, valores y el compromiso de numerosenletras.org para ofrecer las mejores herramientas gratuitas en español.";
          keywords = "quienes somos, numerosenletras.org, herramientas linguisticas, conversion local";
          resolvedImage = blogNumerosLetras;
          schemaData = {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "Quiénes Somos - numerosenletras.org",
            "url": "https://numerosenletras.org/sobre-nosotros",
            "description": "Conoce la misión, los valores y el compromiso de numerosenletras.org para ofrecer las mejores herramientas lingüísticas y financieras gratuitas en español."
          };
          break;
        case "/privacidad":
          title = "Política de Privacidad | numerosenletras.org";
          description = "Lee nuestra Política de Privacidad. Protegemos tus datos garantizando un procesamiento 100% local sin almacenar información personal ni financiera.";
          keywords = "politica de privacidad, cookies google adsense, privacidad de datos";
          resolvedImage = blogNumerosLetras;
          schemaData = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Política de Privacidad - numerosenletras.org",
            "url": "https://numerosenletras.org/privacidad",
            "description": "Lee nuestra Política de Privacidad. Protegemos tus datos garantizando un procesamiento 100% local sin almacenar información personal ni financiera."
          };
          break;
        case "/terminos":
          title = "Términos de Servicio | numerosenletras.org";
          description = "Consulta los Términos de Servicio oficiales de numerosenletras.org para el uso seguro y libre de nuestras herramientas y convertidores en español.";
          keywords = "terminos de servicio, licencia de uso gratuito, condiciones de servicio";
          resolvedImage = blogNumerosLetras;
          schemaData = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Términos de Servicio - numerosenletras.org",
            "url": "https://numerosenletras.org/terminos",
            "description": "Consulta los Términos de Servicio oficiales de numerosenletras.org para el uso seguro y libre de nuestras herramientas y convertidores en español."
          };
          break;
        case "/contacto":
          title = "Contacto | numerosenletras.org";
          description = "¿Tienes dudas, sugerencias o comentarios? Ponte en contacto con numerosenletras.org a través de nuestros canales oficiales.";
          keywords = "contacto numerosenletras, soporte, sugerencias";
          resolvedImage = blogNumerosLetras;
          schemaData = {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contacto - numerosenletras.org",
            "url": "https://numerosenletras.org/contacto",
            "description": "¿Tienes dudas, sugerencias o comentarios? Ponte en contacto con numerosenletras.org a través de nuestros canales oficiales."
          };
          break;
      }
    }

    // Update title
    document.title = title;

    // Helper to update/create meta tags
    const updateMetaTag = (selector: string, attrName: string, attrValue: string, contentStr: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentStr);
    };

    // Update basic descriptions & keywords
    updateMetaTag('meta[name="description"]', 'name', 'description', description);
    updateMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);

    // Dynamic Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    const hrefUrl = currentPath === "/" ? "https://numerosenletras.org/" : `https://numerosenletras.org${currentPath}`;
    canonical.setAttribute("href", hrefUrl);

    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', hrefUrl);
    updateMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'es_MX');
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'numerosenletras.org');
    
    // Absolute path of image
    const imageUrl = resolvedImage.startsWith("http") ? resolvedImage : `${window.location.origin}${resolvedImage}`;
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl);

    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);

    // Dynamic JSON-LD Structured Data
    let schemaScript = document.getElementById("dynamic-schema");
    if (schemaScript) {
      schemaScript.remove();
    }
    if (schemaData) {
      schemaScript = document.createElement("script");
      schemaScript.setAttribute("type", "application/ld+json");
      schemaScript.setAttribute("id", "dynamic-schema");
      schemaScript.textContent = JSON.stringify(schemaData);
      document.head.appendChild(schemaScript);
    }

    // Dynamic JSON-LD BreadcrumbList
    const breadcrumbs: any[] = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://numerosenletras.org/"
      }
    ];

    if (currentPath !== "/") {
      if (currentPath === "/cantidad-con-letra") {
        breadcrumbs.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Cantidad con Letras",
          "item": "https://numerosenletras.org/cantidad-con-letra"
        });
      } else if (currentPath === "/letras-aesthetic") {
        breadcrumbs.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Letras Aesthetic",
          "item": "https://numerosenletras.org/letras-aesthetic"
        });
      } else if (currentPath === "/letras-burbuja") {
        breadcrumbs.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Letras Burbuja",
          "item": "https://numerosenletras.org/letras-burbuja"
        });
      } else if (currentPath === "/como-se-escribe") {
        breadcrumbs.push({
          "@type": "ListItem",
          "position": 2,
          "name": "¿Cómo se escribe?",
          "item": "https://numerosenletras.org/como-se-escribe"
        });
      } else if (currentPath === "/blog") {
        breadcrumbs.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Blog de Ortografía",
          "item": "https://numerosenletras.org/blog"
        });
      } else if (currentPath.startsWith("/blog/")) {
        breadcrumbs.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Blog de Ortografía",
          "item": "https://numerosenletras.org/blog"
        });
        const slug = currentPath.substring(6);
        const post = BLOG_POSTS.find(p => p.slug === slug);
        if (post) {
          breadcrumbs.push({
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": `https://numerosenletras.org/blog/${post.slug}`
          });
        }
      } else if (currentPath === "/sobre-nosotros") {
        breadcrumbs.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Quiénes Somos",
          "item": "https://numerosenletras.org/sobre-nosotros"
        });
      } else if (currentPath === "/privacidad") {
        breadcrumbs.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Política de Privacidad",
          "item": "https://numerosenletras.org/privacidad"
        });
      } else if (currentPath === "/terminos") {
        breadcrumbs.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Términos de Servicio",
          "item": "https://numerosenletras.org/terminos"
        });
      } else if (currentPath === "/contacto") {
        breadcrumbs.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Contacto",
          "item": "https://numerosenletras.org/contacto"
        });
      }
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs
    };

    let breadcrumbScript = document.getElementById("dynamic-breadcrumbs");
    if (breadcrumbScript) {
      breadcrumbScript.remove();
    }
    breadcrumbScript = document.createElement("script");
    breadcrumbScript.setAttribute("type", "application/ld+json");
    breadcrumbScript.setAttribute("id", "dynamic-breadcrumbs");
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);
  }, [currentPath, selectedNumber, selectedText]);

  // Custom navigation handler that updates the path or hash depending on environment
  const navigateTo = (path: string) => {
    try {
      window.history.pushState(null, "", path);
    } catch (e) {
      // Fallback for sandboxed or restricted iframe environments
      if (path === "/") {
        window.location.hash = "";
      } else {
        window.location.hash = "#" + path;
      }
    }
    setCurrentPath(path);
  };

  // Callback from HowToEscribe to load a number into the homepage converter
  const handleSelectNumber = (numStr: string) => {
    setSelectedNumber(numStr);
    navigateTo("/"); // Redirect to Home
  };

  // Clear selected number once loaded in converter pages
  useEffect(() => {
    if (currentPath === "/" || currentPath === "/cantidad-con-letra") {
      // Keep selectedNumber active during transition, then clear after timeout
      const timer = setTimeout(() => {
        setSelectedNumber("");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPath]);

  // Clear selected text once loaded in creative letter pages
  useEffect(() => {
    if (currentPath === "/letras-aesthetic" || currentPath === "/letras-burbuja") {
      const timer = setTimeout(() => {
        setSelectedText("");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPath]);

  // Render visible breadcrumbs for inner pages
  const renderBreadcrumbs = () => {
    if (currentPath === "/") return null;

    const items = [
      { name: "Inicio", path: "/" }
    ];

    if (currentPath === "/cantidad-con-letra") {
      items.push({ name: "Conversor de Cantidad con Letra", path: "/cantidad-con-letra" });
    } else if (currentPath === "/letras-aesthetic") {
      items.push({ name: "Letras Aesthetic", path: "/letras-aesthetic" });
    } else if (currentPath === "/letras-burbuja") {
      items.push({ name: "Letras Burbuja", path: "/letras-burbuja" });
    } else if (currentPath === "/como-se-escribe") {
      items.push({ name: "Ortografía RAE de Números", path: "/como-se-escribe" });
    } else if (currentPath === "/blog") {
      items.push({ name: "Blog de Ortografía", path: "/blog" });
    } else if (currentPath.startsWith("/blog/")) {
      items.push({ name: "Blog de Ortografía", path: "/blog" });
      const slug = currentPath.substring(6);
      const post = BLOG_POSTS.find(p => p.slug === slug);
      if (post) {
        items.push({ name: post.title, path: currentPath });
      } else {
        items.push({ name: "Artículo", path: currentPath });
      }
    } else if (currentPath === "/sobre-nosotros") {
      items.push({ name: "Quiénes Somos", path: "/sobre-nosotros" });
    } else if (currentPath === "/privacidad") {
      items.push({ name: "Política de Privacidad", path: "/privacidad" });
    } else if (currentPath === "/terminos") {
      items.push({ name: "Términos de Servicio", path: "/terminos" });
    } else if (currentPath === "/contacto") {
      items.push({ name: "Contacto", path: "/contacto" });
    } else {
      return null;
    }

    return (
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 mt-6 mb-2">
        <ol className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 font-sans font-medium">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && <span className="text-gray-300 font-normal">/</span>}
                {isLast ? (
                  <span className="text-gray-900 font-bold max-w-[200px] sm:max-w-[400px] truncate" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <a
                    href={`#${item.path}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(item.path);
                    }}
                    className="text-gray-500 hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                  >
                    {item.name}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  };

  // Render active page
  const renderPage = () => {
    if (currentPath.startsWith("/blog")) {
      return <Blog onNavigate={navigateTo} />;
    }

    switch (currentPath) {
      case "/":
        return <HomeConverter initialNumber={selectedNumber} onNavigate={navigateTo} />;
      case "/cantidad-con-letra":
        return <QuantityWithLetter initialAmount={selectedNumber} />;
      case "/letras-aesthetic":
        return <AestheticLetters initialText={selectedText} />;
      case "/letras-burbuja":
        return <BubbleLetters initialText={selectedText} />;
      case "/como-se-escribe":
        return <HowToEscribe onSelectNumber={handleSelectNumber} />;
      case "/sobre-nosotros":
        return <AboutUs onNavigate={navigateTo} />;
      case "/privacidad":
        return <PrivacyPolicy />;
      case "/terminos":
        return <TermsOfService />;
      case "/contacto":
        return <ContactPage />;
      default:
        return <HomeConverter initialNumber={selectedNumber} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-gray-50 text-gray-900">
      {/* Navbar */}
      <Navbar currentPath={currentPath} onNavigate={navigateTo} />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {renderBreadcrumbs()}
        {renderPage()}
        
        {/* Dynamic Interlinking Matrix for Site-Wide SEO Strength */}
        <div className="max-w-4xl mx-auto px-4 mt-8 sm:mt-12">
          <InterlinkingMatrix currentPath={currentPath} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 sm:py-12 px-4 bg-white border-gray-100 text-gray-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
          {/* Column 1: Info and description */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-sm">
                NL
              </div>
              <span className="font-sans font-bold text-base tracking-tight text-gray-900">
                numerosen<span className="text-blue-600">letras</span>.org
              </span>
            </div>
            <p className="font-sans text-xs leading-relaxed max-w-sm">
              Tu portal de utilidades de conversión de números y tipografías artísticas en español. 
              Herramientas 100% estáticas que se ejecutan directamente en tu navegador, garantizando máxima velocidad y seguridad de datos.
            </p>
          </div>

          {/* Column 2: Corporativo */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-900">
              Sobre el Proyecto
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-sans">
              <a 
                href="/sobre-nosotros" 
                onClick={(e) => { e.preventDefault(); navigateTo("/sobre-nosotros"); }} 
                className="hover:text-blue-500 hover:underline cursor-pointer"
              >
                • Quiénes Somos
              </a>
              <a 
                href="/contacto" 
                onClick={(e) => { e.preventDefault(); navigateTo("/contacto"); }} 
                className="hover:text-blue-500 hover:underline cursor-pointer"
              >
                • Formulario de Contacto
              </a>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                <span>Email: contacto@numerosenletras.org</span>
              </div>
            </div>
          </div>

          {/* Column 3: Legal & Privacidad */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-900">
              Legal y Privacidad
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-sans">
              <a 
                href="/privacidad" 
                onClick={(e) => { e.preventDefault(); navigateTo("/privacidad"); }} 
                className="hover:text-blue-500 hover:underline cursor-pointer"
              >
                • Política de Privacidad
              </a>
              <a 
                href="/terminos" 
                onClick={(e) => { e.preventDefault(); navigateTo("/terminos"); }} 
                className="hover:text-blue-500 hover:underline cursor-pointer"
              >
                • Términos de Servicio
              </a>
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  window.dispatchEvent(new Event("open-cookie-settings")); 
                }} 
                className="hover:text-blue-500 hover:underline cursor-pointer text-left focus:outline-hidden"
              >
                • Preferencias de Cookies
              </button>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Procesamiento 100% Local</span>
              </div>
            </div>
          </div>

          {/* Column 4: Navigation Sitemap */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-900">
              Herramientas
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-sans">
              <a 
                href="/" 
                onClick={(e) => { e.preventDefault(); navigateTo("/"); }} 
                className="hover:text-blue-500 hover:underline cursor-pointer"
              >
                • Conversor General
              </a>
              <a 
                href="/cantidad-con-letra" 
                onClick={(e) => { e.preventDefault(); navigateTo("/cantidad-con-letra"); }} 
                className="hover:text-blue-500 hover:underline cursor-pointer"
              >
                • Cantidad con Letra
              </a>
              <a 
                href="/como-se-escribe" 
                onClick={(e) => { e.preventDefault(); navigateTo("/como-se-escribe"); }} 
                className="hover:text-blue-500 hover:underline cursor-pointer"
              >
                • ¿Cómo se Escribe con Letra?
              </a>
              <a 
                href="/letras-aesthetic" 
                onClick={(e) => { e.preventDefault(); navigateTo("/letras-aesthetic"); }} 
                className="hover:text-blue-500 hover:underline cursor-pointer"
              >
                • Letras Aesthetic
              </a>
              <a 
                href="/letras-burbuja" 
                onClick={(e) => { e.preventDefault(); navigateTo("/letras-burbuja"); }} 
                className="hover:text-blue-500 hover:underline cursor-pointer"
              >
                • Letras Burbuja
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
          <p>© 2026 numerosenletras.org. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Creado con <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> para creadores de contenido y profesionales de habla hispana.
          </p>
        </div>
      </footer>
      <CookieBanner />

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-colors cursor-pointer flex items-center justify-center border border-blue-500/10 focus:outline-hidden group"
            title="Volver arriba"
            aria-label="Volver arriba"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
