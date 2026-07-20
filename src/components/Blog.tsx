import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  ChevronRight, 
  ArrowLeft, 
  Search, 
  Bookmark, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Hash, 
  ArrowUpRight,
  ArrowUp
} from "lucide-react";

import { convertNumberToLetters } from "../utils/numberToLetters";
import { AESTHETIC_FONTS } from "../utils/fontGenerators";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: "Finanzas" | "Diseño" | "Ortografía";
  keywords: string[];
  content: string; // Extensive, highly structured HTML string
  image: string; // Featured image URL/path
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "guia-convertir-numeros-a-letras-rae-finanzas",
    title: "Guía Suprema: Cómo Convertir Números a Letras en Español (Normas RAE, Finanzas y Redacción de Cheques)",
    excerpt: "Aprende las reglas ortográficas oficiales de la RAE para escribir cualquier número en letras, expresar cantidades financieras y rellenar cheques de forma impecable.",
    date: "17 de Julio, 2026",
    author: "Comité Editorial Lingüístico",
    readTime: "12 min de lectura",
    category: "Finanzas",
    keywords: ["numeros en letras", "cantidad con letra", "numeros a letras", "convertir numeros a letras", "cómo se escribe con letra", "convertidor de numeros a letras"],
    image: "/assets/images/blog_numeros_letras.webp",
    content: `
      <div class="space-y-8 font-sans text-gray-800 leading-relaxed text-base">
        <!-- Introduction -->
        <p class="text-lg text-gray-600 italic border-l-4 border-blue-500 pl-4 py-1">
          La conversión de números a letras en la lengua española es uno de los pilares fundamentales tanto de la ortografía académica como de la seguridad documental y jurídica. Ya sea para la firma de un contrato mercantil de alta envergadura, el llenado formal de un cheque bancario o la redacción de actas notariales, saber redactar con exactitud lingüística y sin margen de ambigüedad las cantidades numéricas es un requisito profesional ineludible.
        </p>

        <p>
          Para resolver estas dudas de forma ágil, el sitio web <a href="https://numerosenletras.org" class="text-blue-600 hover:text-blue-800 font-bold underline">numerosenletras.org</a> provee una plataforma inteligente y gratuita para el procesamiento y traducción automatizada de cualquier cifra. En este extenso artículo, desglosaremos minuciosamente la normativa oficial de la <strong>Real Academia Española (RAE)</strong>, las excepciones prácticas del comercio diario y los estándares para transacciones financieras en todo el mundo hispanohablante.
        </p>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">1. La Regla General de la Escritura de Números en Letras</h2>
          <p class="mb-4">
            La RAE, en su tratado integral sobre la <a href="https://www.rae.es/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold">Ortografía de la lengua española <ArrowUpRight class="w-3 h-3"/></a>, establece pautas sumamente específicas acerca de la grafía de las cifras. La regla básica para la ortografía de los números cardinales en una sola palabra se resume de la siguiente forma:
          </p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Números del 0 al 30:</strong> Se escriben siempre en una sola palabra. Ejemplos directos: <em>cero, uno, once, dieciséis, veintiuno, veinticuatro, treinta</em>. Nótese que tradicionalmente las decenas intermedias solían generar confusión, pero hoy la grafía fusionada es la única válida para este rango.</li>
            <li><strong>Números del 31 al 99:</strong> Se escriben utilizando tres palabras separadas por la conjunción copulativa "y", salvo las decenas exactas (<em>cuarenta, cincuenta, sesenta...</em>). Ejemplos: <em>treinta y uno, cuarenta y cinco, noventa y nueve</em>.</li>
            <li><strong>Las Centenas:</strong> Tienen formas especiales de una sola palabra (<em>cien, ciento, doscientos, trescientos, cuatrocientos, quinientos, seiscientos, setecientos, ochocientos, novecientos</em>). Cabe prestar vital atención a las irregularidades fonéticas e históricas de "quinientos" (no cincocientos), "setecientos" (no sietecientos) y "novecientos" (no nuevecientos).</li>
            <li><strong>El número Mil:</strong> Se escribe de forma independiente. Para cifras mayores, se une a las centenas y unidades correspondientes: <em>mil doscientos, diez mil cuatrocientos treinta</em>.</li>
          </ul>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">2. El Uso del "Un" ante "Mil" y Millones: ¿Redundancia o Precisión Financiera?</h2>
          <p class="mb-4">
            Una de las búsquedas más recurrentes al intentar <a href="https://numerosenletras.org" class="text-blue-600 hover:text-blue-800 font-bold underline">convertir numeros a letras</a> gira en torno a si se debe escribir "mil pesos" o "un mil pesos". La postura académica de la RAE es transparente: en el habla común, el numeral <em>un</em> se omite ante la palabra <em>mil</em> por considerarse redundante. Decimos <em>"mil personas han asistido"</em> o <em>"la obra costó mil dólares"</em>.
          </p>
          <p class="mb-4">
            Sin embargo, en el ámbito comercial, bancario y notarial, la inserción del artículo "un" ("un mil") es una práctica extendida y plenamente aceptada. ¿La razón? <strong>Evitar el fraude y la falsificación de documentos</strong>. Si un documento financiero dejara simplemente escrito "mil pesos", un actor malintencionado podría añadir fácilmente palabras delante, alterando el documento a "veintidós mil pesos" o "ciento diez mil pesos". Escribir de forma explícita <strong>"un mil pesos"</strong> sella el inicio de la línea de texto, bloqueando cualquier intento de manipulación analógica.
          </p>
          <div class="bg-gray-50 border-l-4 border-indigo-500 p-4 rounded-r-xl my-4">
            <h4 class="font-bold text-indigo-900 mb-1">💡 Regla de oro para Cheques:</h4>
            <p class="text-sm text-gray-700">
              Para máxima protección legal al rellenar una <span class="underline decoration-indigo-300 font-semibold">cantidad con letra</span> en un cheque, escriba siempre "Un mil" en lugar de "Mil", y clausure inmediatamente el final del renglón con una línea horizontal continua para que nadie pueda insertar palabras adicionales.
            </p>
          </div>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">3. Cómo Expresar Decimales y Monedas con Letras</h2>
          <p class="mb-4">
            Cuando convertimos un importe de dinero que incluye céntimos o centavos, la estructura debe reflejar la moneda local y el sistema de centavos del país en cuestión. Existen dos esquemas principales aceptados internacionalmente:
          </p>
          
          <h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">A. El Formato Fraccionario (Estilo de Cheques)</h3>
          <p class="mb-3">
            Ampliamente utilizado en países como México, Perú, Colombia y Argentina. Consiste en escribir la parte entera en letras y la parte decimal mediante una fracción matemática sobre cien (XX/100), seguida de la designación oficial de la moneda nacional o el sufijo "M.N." (Moneda Nacional).
          </p>
          <p class="bg-blue-50/50 p-3 rounded-lg font-mono text-sm text-blue-900 border border-blue-100 mb-4">
            <strong>Ejemplo para $1,450.75:</strong><br/>
            "Un mil cuatrocientos cincuenta pesos 75/100 M.N." o "Mil cuatrocientos cincuenta dólares con setenta y cinco centavos".
          </p>

          <h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">B. El Formato Ortográfico Pleno</h3>
          <p class="mb-3">
            Consiste en verter absolutamente todos los términos a texto libre, uniendo ambas partes mediante la preposición "con" o la conjunción "y". Este formato es preferido en contratos formales de arrendamiento o escrituras públicas de compraventa de inmuebles.
          </p>
          <p class="bg-purple-50/50 p-3 rounded-lg font-mono text-sm text-purple-900 border border-purple-100 mb-4">
            <strong>Ejemplo para €945.50:</strong><br/>
            "Novecientos cuarenta y cinco euros con cincuenta céntimos".
          </p>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">4. Los Errores Ortográficos más Comunes que Debes Evitar</h2>
          <p class="mb-4">
            Al realizar la redacción manual de números en español, es habitual incurrir en vicios ortográficos heredados o malas costumbres orales. Para asegurar un texto impecable, memorice las siguientes correcciones validadas por la RAE:
          </p>
          
          <div class="overflow-x-auto my-4 border border-gray-100 rounded-xl">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="bg-gray-100 text-gray-800 font-bold border-b border-gray-200">
                  <th class="p-3">Número</th>
                  <th class="p-3">Grafía Incorrecta (Vicio Común)</th>
                  <th class="p-3">Grafía Correcta (RAE)</th>
                  <th class="p-3">Explicación Lingüística</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td class="p-3 font-bold">16</td>
                  <td class="p-3 text-red-600 line-through">dieciséis</td>
                  <td class="p-3 text-emerald-700 font-bold">dieciséis</td>
                  <td class="p-3">Lleva tilde en la 'e' por ser palabra aguda terminada en 's'.</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold">22</td>
                  <td class="p-3 text-red-600 line-through">veintidos</td>
                  <td class="p-3 text-emerald-700 font-bold">veintidós</td>
                  <td class="p-3">Aguda terminada en 's', requiere acento gráfico obligatorio.</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold">23</td>
                  <td class="p-3 text-red-600 line-through">veintitres</td>
                  <td class="p-3 text-emerald-700 font-bold">veintitrés</td>
                  <td class="p-3">Sigue la misma regla de acentuación que las anteriores.</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold">26</td>
                  <td class="p-3 text-red-600 line-through">dieciseis</td>
                  <td class="p-3 text-emerald-700 font-bold">dieciséis</td>
                  <td class="p-3">La vocal fuerte 'e' del diptongo recibe la tilde.</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold">100.000</td>
                  <td class="p-3 text-red-600 line-through">cien mil</td>
                  <td class="p-3 text-emerald-700 font-bold">cien mil</td>
                  <td class="p-3">Se escribe separado en dos vocablos diferenciados.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">5. El Convertidor de Números a Letras como Aliado de Productividad</h2>
          <p class="mb-4">
            Llevar un registro contable, emitir recibos de honorarios de forma manual, o completar actas administrativas puede ralentizar sus tareas cotidianas si tiene que dudar constantemente de la concordancia de género (por ejemplo, entre <em>"doscientos pesos"</em> y <em>"doscientas libras"</em>). 
          </p>
          <p class="mb-4">
            El sistema inteligente de <a href="https://numerosenletras.org" class="text-blue-600 hover:text-blue-800 font-bold underline">numerosenletras.org</a> ha sido diseñado bajo rigurosos parámetros algorítmicos que respetan las normas gramaticales del español moderno, asegurando una conversión libre de errores tipográficos e ideal para su uso profesional inmediato.
          </p>
          <p class="mb-4">
            Adicionalmente, puede consultar de manera interactiva <a href="https://es.wikipedia.org/wiki/Nombres_de_los_n%C3%BAmeros_en_espa%C3%B1ol" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold">Nombres de los Números en Español en Wikipedia <ArrowUpRight class="w-3 h-3"/></a> para profundizar en la historia lingüística del sistema decimal y de los vocablos del latín de los cuales descienden nuestros cardinales contemporáneos.
          </p>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">Conclusión</h2>
          <p class="mb-4">
            Dominar la escritura de las cantidades numéricas y comprender <strong class="text-gray-900">cómo se escribe con letra</strong> cualquier cifra financiera es un conocimiento indispensable que brinda un sello distintivo de pulcritud, legalidad y seguridad a todos sus documentos de valor. 
          </p>
          <p>
            Ya sea que esté gestionando las finanzas de su negocio o simplemente puliendo un ensayo académico, la precisión ortográfica es su mejor carta de presentación. Use y comparta gratis la herramienta universal de <a href="https://numerosenletras.org" class="text-blue-600 hover:text-blue-800 font-bold underline">numerosenletras.org</a> para agilizar todas sus conversiones cotidianas sin fricciones.
          </p>
        </div>
      </div>
    `
  },
  {
    id: "2",
    slug: "arte-letras-burbuja-tipografia-circular-copiar-pegar",
    title: "El Arte de las Letras Burbuja Ⓑⓤⓡⓑⓤⓙⓐ: Guía de Tipografías Circulares Unicode para Redes Sociales",
    excerpt: "Descubre cómo funciona el sistema de símbolos circulares Unicode, por qué las letras burbuja son tan populares en redes sociales y cómo usarlas para potenciar tu presencia digital.",
    date: "17 de Julio, 2026",
    author: "Especialista en Tipografía Digital",
    readTime: "10 min de lectura",
    category: "Diseño",
    keywords: ["letras burbuja", "letras aesthetic copiar y pegar", "letras pequeñas"],
    image: "/assets/images/blog_letras_burbuja.webp",
    content: `
      <div class="space-y-8 font-sans text-gray-800 leading-relaxed text-base">
        <!-- Introduction -->
        <p class="text-lg text-gray-600 italic border-l-4 border-blue-500 pl-4 py-1">
          Las redes sociales modernas como Instagram, TikTok, Twitter o Discord han democratizado la autoexpresión visual. Sin embargo, debido a que las aplicaciones móviles restringen de forma predeterminada la tipografía de usuario a una sola fuente estándar del sistema (como San Francisco en iOS o Roboto en Android), los creadores digitales recurren a ingeniosas soluciones tecnológicas para sobresalir. Una de las más populares, llamativas y legibles es, sin duda, el uso de las <strong>Letras Burbuja Ⓑⓤⓡⓑⓤⓙⓐ</strong>.
        </p>

        <p>
          Mediante convertidores tipográficos basados en estándares internacionales como <a href="https://numerosenletras.org" class="text-blue-600 hover:text-blue-800 font-bold underline">numerosenletras.org</a>, cualquier usuario puede teclear una frase convencional y verla instantáneamente transformada en un arreglo de caracteres esféricos, listos para copiar y pegar. Pero, ¿cómo funciona exactamente este fenómeno tecnológico y cómo puedes usarlo estratégicamente para tu marca personal? A continuación, te lo revelamos todo.
        </p>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">1. La Ciencia Detrás de las Letras Burbuja: El Estándar Unicode</h2>
          <p class="mb-4">
            Contrario a la creencia popular, un generador de <a href="https://numerosenletras.org/#/letras-burbuja" class="text-blue-600 hover:text-blue-800 font-semibold underline">letras burbuja</a> no altera los archivos de fuentes de tu teléfono ni requiere instalar complejos programas de terceros. Lo que realmente hace es mapear las letras normales del alfabeto latino hacia un bloque especial del estándar <a href="https://home.unicode.org/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold">Unicode Consortium <ArrowUpRight class="w-3 h-3"/></a>.
          </p>
          <p class="mb-4">
            Unicode es la especificación técnica universal de codificación que permite a computadoras de todo el planeta interpretar y mostrar texto de la misma manera, sin importar el idioma. Dentro de este mapa de miles de símbolos se encuentra un bloque llamado <strong>"Alfanuméricos Encirculados" (Enclosed Alphanumerics)</strong>.
          </p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Letras Burbuja Blancas (A-Z):</strong> Del rango Unicode U+24B6 al U+24CF para mayúsculas (Ⓐ, Ⓑ, Ⓒ...) y del U+24D0 al U+24E9 para minúsculas (ⓐ, ⓑ, ⓒ...).</li>
            <li><strong>Letras Burbuja Negras (A-Z):</strong> Conocidas como símbolos negativos encirculados (🅐, 🅑, 🅒...). Son ideales para crear contrastes profundos e imitar botones físicos o teclados retro.</li>
            <li><strong>Números Encirculados (0-9):</strong> Representados con círculos tanto transparentes (①, ②, ③...) como de fondo negro sólido (❶, ❷, ❸...).</li>
          </ul>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">2. Por qué las Redes Sociales Adoran el Texto Estético y Circular</h2>
          <p class="mb-4">
            En marketing digital existe un concepto clave denominado <strong class="text-gray-900">"patrón de escaneo visual"</strong>. Los usuarios de internet rara vez leen palabra por palabra; en su lugar, sus ojos escanean la pantalla rápidamente buscando elementos discordantes que rompan la monotonía de la fuente estándar.
          </p>
          <p class="mb-4">
            Ahí radica el superpoder de las fuentes esféricas. Al insertar términos llamativos como 🅑🅘🅞🅖🅡🅐🅕🅘🅐 o 🅕🅡🅔🅔 🅕🅘🅡🅔 en tu perfil, detienes el movimiento rápido del pulgar del usuario (conocido como <em>scroll stopping effect</em>), aumentando notablemente las probabilidades de que se detengan a leer tu contenido o hagan clic en tu enlace de afiliación.
          </p>
          
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl my-4">
            <h4 class="font-bold text-blue-900 mb-1">📢 Beneficios clave del uso de letras circulares:</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1 mt-2">
              <li><strong>Alta Legibilidad:</strong> A diferencia de fuentes góticas o cursivas ultra-decoradas que resultan difíciles de descifrar para personas con fatiga visual, los círculos preservan de forma excelente la silueta básica de la letra latina.</li>
              <li><strong>Compatibilidad Universal:</strong> Al pertenecer al estándar Unicode oficial, se muestran de forma óptima en el 99.8% de teléfonos Android, iPhones, tablets y ordenadores de escritorio.</li>
              <li><strong>Impecable para Gamers:</strong> Muy utilizado para decorar apodos o <em>nicknames</em> de clanes en plataformas competitivas donde no se admiten fuentes externas descargables.</li>
            </ul>
          </div>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">3. Cómo Utilizar el Generador Tipográfico para Redes Sociales</h2>
          <p class="mb-4">
            Para convertir un texto monótono a letras con burbujas estéticas utilizando <a href="https://numerosenletras.org" class="text-blue-600 hover:text-blue-800 font-bold underline">numerosenletras.org</a>, simplemente debes seguir estos sencillos pasos:
          </p>
          <ol class="list-decimal pl-6 space-y-2 mb-4">
            <li>Accede a la pestaña <a href="https://numerosenletras.org/#/letras-burbuja" class="text-blue-600 hover:underline font-bold">Letras Burbuja</a> en el menú de navegación principal de nuestra web.</li>
            <li>Escribe tu frase, nombre de usuario o hashtag en la caja de texto interactiva superior.</li>
            <li>Utiliza las opciones avanzadas para seleccionar si deseas forzar todo a mayúsculas o minúsculas para un acabado simétrico impecable.</li>
            <li>Habilita la casilla <strong>"Puntos estéticos (•)"</strong> para que el generador reemplace automáticamente los espacios vacíos por puntos de diseño japonés, evitando que los círculos queden excesivamente distanciados entre sí.</li>
            <li>Haz clic sobre la caja del estilo generado que más te guste; el sistema lo copiará a tu portapapeles de manera instantánea y silenciosa.</li>
            <li>Abre tu red social preferida y mantén presionado el dedo para seleccionar la opción "Pegar".</li>
          </ol>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">4. Consejos de SEO para tu Perfil de Redes Sociales</h2>
          <p class="mb-4">
            Aunque los símbolos decorativos son visualmente espectaculares, un abuso desmedido de ellos puede jugar en contra de tu SEO en redes sociales. El algoritmo de búsqueda de Instagram o TikTok indexa las palabras de tu biografía y nombre para sugerirte en las consultas de otros usuarios.
          </p>
          <p class="mb-4">
            Si escribes tu palabra clave principal de tu negocio enteramente en letras burbuja (por ejemplo: 🅜🅐🅡🅚🅔🅣🅘🅝🅖), es probable que el motor de búsqueda interno de la plataforma no logre emparejar esos caracteres especiales con las búsquedas convencionales que los usuarios hacen escribiendo en sus teclados estándar.
          </p>
          <p class="mb-4">
            <strong>¿La estrategia inteligente?</strong> Conserva tu nombre principal y palabras clave centrales de tu nicho en tipografía regular estándar de alta accesibilidad, y reserva las <a href="https://numerosenletras.org/#/letras-aesthetic" class="text-blue-600 hover:underline font-bold">letras aesthetic copiar y pegar</a> para llamados a la acción (CTA), eslóganes, secciones secundarias o para destacar enlaces importantes en tu biografía.
          </p>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">Conclusión</h2>
          <p class="mb-4">
            Las letras burbuja no son una moda pasajera, sino un recurso consolidado de diseño tipográfico digital que aporta un toque lúdico, dinámico y geométricamente ordenado a cualquier canal de comunicación interactivo. 
          </p>
          <p>
            No te limites a los estilos aburridos que imponen las plataformas por defecto. Visita hoy mismo la plataforma gratuita de <a href="https://numerosenletras.org" class="text-blue-600 hover:text-blue-800 font-bold underline">numerosenletras.org</a>, experimenta con las variantes y dale un giro refrescante a tu voz digital.
          </p>
        </div>
      </div>
    `
  },
  {
    id: "3",
    slug: "letras-aesthetic-fuentes-pequenas-instagram-tiktok",
    title: "Guía Completa de Letras Aesthetic y Fuentes Pequeñas para Redes Sociales: Personaliza tu Biografía",
    excerpt: "Aprende a transformar tus textos para crear bios de impacto en Instagram, TikTok y Twitter usando letras pequeñas, cursivas y símbolos aesthetic copiar y pegar.",
    date: "17 de Julio, 2026",
    author: "Experta en Estrategia de Contenidos",
    readTime: "11 min de lectura",
    category: "Diseño",
    keywords: ["letras pequeñas", "letras aesthetic copiar y pegar", "convertidor de numeros a letras"],
    image: "/assets/images/blog_letras_aesthetic.webp",
    content: `
      <div class="space-y-8 font-sans text-gray-800 leading-relaxed text-base">
        <!-- Introduction -->
        <p class="text-lg text-gray-600 italic border-l-4 border-purple-500 pl-4 py-1">
          En el ecosistema hiper-competitivo de internet, captar la atención de un visitante potencial toma exactamente menos de tres segundos. Al aterrizar en tu perfil de Instagram, TikTok, Twitter o tu canal de YouTube, la biografía es el primer elemento visual que los usuarios analizan antes de decidir si te siguen o si abandonan tu página. Diseñar una composición visualmente atractiva apoyándote en <strong>Letras Aesthetic</strong> y <strong>Letras Pequeñas</strong> es la forma definitiva de inyectar sofisticación instantánea a tus publicaciones cotidianas.
        </p>

        <p>
          Para facilitar el proceso de diseño y asegurar que tus textos no pierdan formato al transferirse entre distintos dispositivos, el portal <a href="https://numerosenletras.org" class="text-blue-600 hover:text-blue-800 font-bold underline">numerosenletras.org</a> ofrece un convertidor universal inteligente que optimiza tus tipografías automáticamente. En esta guía exploraremos en profundidad los tipos de fuentes estéticas disponibles, el porqué de su funcionamiento y las mejores prácticas de aplicación.
        </p>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">1. ¿Qué Son Exactamente las Letras Aesthetic?</h2>
          <p class="mb-4">
            El término "Aesthetic" hace referencia directa a un movimiento artístico digital centrado en la simetría, la belleza visual, la nostalgia vintage, y los contrastes minimalistas. Al trasladar esta tendencia a la tipografía, nos referimos a fuentes alternativas que abandonan las aburridas líneas rectas estándar en favor de trazos elegantes:
          </p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Letras Cursivas Estéticas (𝓒𝓾𝓻𝓼𝓲𝓿𝓪 / 𝒬𝓊ℯ𝓇𝒾𝒹ℴ):</strong> Fluyen de manera orgánica, imitando la caligrafía hecha a mano con pluma estilográfica tradicional. Son ideales para marcas de moda, bienestar y cuentas de poesía.</li>
            <li><strong>Letras Góticas Medievales (𝔊𝔬𝔱𝔦𝔠 / 𝕲𝖔𝖙𝖍𝖎𝖈):</strong> Aportan misterio, fuerza histórica y un look dramático. Altamente codiciadas por comunidades de música alternativa y creadores de gaming.</li>
            <li><strong>Letras de Doble Trazo (𝔻𝕠𝕓𝕝𝕖 / 𝕄𝕠𝕕𝕖𝕣𝕟𝕠):</strong> Elegantes variantes de arquitectura hueca inspiradas en los trazos de tiza de los tableros escolares antiguos. Aportan una vibra de diseño arquitectónico pulido.</li>
            <li><strong>Letras Pequeñas (ˢᵐᵃˡˡ / 𝖯𝖾𝗊𝗎𝖾𝗇̃𝖺𝗌):</strong> Caracteres en tamaño miniatura que se sitúan sobre la línea de flotación común, simulando un subíndice o superíndice de manera elegante.</li>
          </ul>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">2. El Misterio de las Letras Pequeñas (ˢᵐᵃˡˡ ᶜᵃᵖˢ)</h2>
          <p class="mb-4">
            ¿Alguna vez te has preguntado cómo algunas cuentas de Instagram logran tener subtítulos que parecen escritos en letras minúsculas pero con el formato de mayúsculas pequeñitas? El secreto radica en las llamadas <strong>"Small Caps" o Versalitas</strong>. 
          </p>
          <p class="mb-4">
            Este recurso de la tipografía editorial clásica adapta la altura de las letras de caja alta (mayúsculas) para que compartan visualmente la misma proporción de altura que las de caja baja (minúsculas). Al convertirlas mediante un generador Unicode en <a href="https://numerosenletras.org" class="text-blue-600 hover:text-blue-800 font-bold underline">numerosenletras.org</a>, logras un texto compacto, simétrico, estilizado y sumamente sofisticado que resulta un placer a la vista para cualquier lector.
          </p>
          <div class="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-xl my-4">
            <h4 class="font-bold text-purple-900 mb-1">🔍 Diferencias de visualización:</h4>
            <p class="text-sm text-gray-700">
              Texto Normal: "letras aesthetic"<br/>
              Letras Versalitas: "ʟᴇᴛʀᴀs ᴀᴇsᴛʜᴇᴛɪᴄ"<br/>
              Letras Superíndice: "ˡᵉᵗʳᵃˢ ᵃᵉˢᵗʰᵉᵗⁱᶜ"<br/>
              Letras Burbuja: "ⓛⓔⓣⓡⓐⓢ ⓐⓔⓢⓣⓗⓔⓣⓘⓒ"
            </p>
          </div>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">3. Cómo Integrar Tipografías Creativas en tus Redes Sociales Sin Perder Formato</h2>
          <p class="mb-4">
            El mayor temor al utilizar letras de fantasía es que algunos usuarios entren a tu perfil y terminen viendo rectángulos con signos de interrogación o cuadrados vacíos (popularmente conocidos como "tofus"). Para evitar este grave fallo de diseño y asegurar la accesibilidad, sigue las siguientes recomendaciones técnicas:
          </p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Normaliza los Caracteres Especiales:</strong> Las lenguas romances como el español utilizan frecuentemente acentos ortográficos (á, é, í, ó, ú) y la letra eñe (ñ). Debido a que la mayoría de sistemas de codificación de fuentes artísticas nacieron bajo especificaciones en inglés, es común que no cuenten con las versiones con tildes de estas letras. Al usar la opción de <strong>"Quitar Acentos / Ñ"</strong> en <a href="https://numerosenletras.org/#/letras-aesthetic" class="text-blue-600 hover:underline font-bold">numerosenletras.org</a>, el sistema sustituye á por a y ñ por n antes de hacer la conversión de estilo, garantizando que el diseño final no se rompa visualmente.</li>
            <li><strong>Mantén la Accesibilidad Web:</strong> Los lectores de pantalla que utilizan las personas con discapacidades visuales para navegar por internet no siempre logran interpretar con facilidad los caracteres matemáticos especiales de Unicode. Utiliza los estilos tipográficos alternativos únicamente para fines estéticos, decorativos o de énfasis comercial, y nunca para escribir textos de vital importancia sobre salud, leyes, o instrucciones críticas de tu negocio.</li>
          </ul>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">4. Pasos para Copiar y Pegar tus Fuentes Favoritas</h2>
          <p class="mb-4">
            Nuestra interfaz inteligente de conversión de fuentes te permite agilizar tu flujo creativo en solo unos instantes:
          </p>
          <ol class="list-decimal pl-6 space-y-2 mb-4">
            <li>Entra en <a href="https://numerosenletras.org/#/letras-aesthetic" class="text-blue-600 hover:underline font-bold">letras aesthetic copiar y pegar</a>.</li>
            <li>Escribe tu biografía o eslogan directamente en el área de ingreso de texto.</li>
            <li>Añade símbolos de estrellas (★, ✧, ✦) utilizando nuestra caja interactiva de inserción de símbolos en la parte inferior para complementar la composición.</li>
            <li>Observa las previsualizaciones instantáneas que se actualizan dinámicamente según ajustas el tamaño de previsualización para comprobar cómo lucirá en dispositivos más pequeños.</li>
            <li>Pulsa el botón <strong>"Copiar"</strong> en tu estilo favorito; el texto se guardará instantáneamente en el portapapeles de tu móvil o computadora para que lo pegues donde prefieras.</li>
          </ol>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">Conclusión</h2>
          <p class="mb-4">
            Tu biografía digital es el equivalente contemporáneo a tu tarjeta de presentación profesional. No te conformes con los mismos caracteres sosos que el resto del mundo utiliza de forma automática. 
          </p>
          <p>
            Al integrar estratégicamente fuentes aesthetic y elegantes composiciones con letras pequeñas en tus publicaciones o biografías, demuestras un nivel superior de detalle, modernidad y cuidado por tu marca. Deja volar tu imaginación y transforma tu perfil digital gratis hoy mismo con la ayuda indispensable de las herramientas tipográficas de <a href="https://numerosenletras.org" class="text-blue-600 hover:text-blue-800 font-bold underline">numerosenletras.org</a>.
          </p>
        </div>
      </div>
    `
  }
];

// Interactive Blog Widget for related tools inside detailed posts
function BlogWidget({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
  const [numInput, setNumInput] = useState("1250.50");
  const [numGender, setNumGender] = useState<'M' | 'F' | 'N'>('M');
  const [numCurrency, setNumCurrency] = useState(true);
  const [numWords, setNumWords] = useState("");
  const [widgetCopied, setWidgetCopied] = useState(false);

  const [bubbleText, setBubbleText] = useState("Hola Mundo");
  const [bubbleStyle, setBubbleStyle] = useState<'white' | 'black'>('white');
  const [bubbleResult, setBubbleResult] = useState("");

  const [aestheticText, setAestheticText] = useState("Aesthetic");
  const [aestheticStyle, setAestheticStyle] = useState("super");
  const [aestheticResult, setAestheticResult] = useState("");

  useEffect(() => {
    if (slug === "guia-convertir-numeros-a-letras-rae-finanzas") {
      try {
        const letters = convertNumberToLetters(numInput, {
          gender: numGender,
          isCurrency: numCurrency,
          currencyName: "pesos",
          currencyCentName: "centavos",
          formatFinancial: true
        });
        setNumWords(letters);
      } catch (e) {
        setNumWords("");
      }
    }
  }, [numInput, numGender, numCurrency, slug]);

  useEffect(() => {
    if (slug === "arte-letras-burbuja-tipografia-circular-copiar-pegar") {
      const font = AESTHETIC_FONTS.find(f => f.id === (bubbleStyle === 'white' ? 'bubble_white' : 'bubble_black'));
      if (font) {
        setBubbleResult(font.generate(bubbleText));
      }
    }
  }, [bubbleText, bubbleStyle, slug]);

  useEffect(() => {
    if (slug === "letras-aesthetic-fuentes-pequenas-instagram-tiktok") {
      const font = AESTHETIC_FONTS.find(f => f.id === aestheticStyle);
      if (font) {
        setAestheticResult(font.generate(aestheticText));
      }
    }
  }, [aestheticText, aestheticStyle, slug]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setWidgetCopied(true);
    setTimeout(() => setWidgetCopied(false), 2000);
  };

  if (slug === "guia-convertir-numeros-a-letras-rae-finanzas") {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 p-5 shadow-xs space-y-4 text-left">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          <h4 className="font-display font-bold text-sm text-blue-900 uppercase tracking-wide">Mini Conversor Financiero</h4>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Escribe un importe numérico para ver la transcripción exacta en letras al instante según la RAE.
        </p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Cifra Numérica:</label>
            <input 
              type="text" 
              value={numInput}
              onChange={(e) => setNumInput(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-mono"
              placeholder="Ej: 1500.50"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Género:</label>
              <select 
                value={numGender} 
                onChange={(e) => setNumGender(e.target.value as any)}
                className="w-full bg-white border border-gray-200 rounded-xl px-2 py-1.5 text-xs focus:outline-hidden"
              >
                <option value="M">Masculino (pesos)</option>
                <option value="F">Femenino (pesetas)</option>
                <option value="N">Neutro (dólares)</option>
              </select>
            </div>
            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-600 select-none">
                <input 
                  type="checkbox" 
                  checked={numCurrency} 
                  onChange={(e) => setNumCurrency(e.target.checked)}
                  className="rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Formato Cheque
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3.5 space-y-2">
            <span className="block text-[9px] font-mono font-bold text-gray-400 uppercase">Resultado Escrito:</span>
            <p className="text-xs font-semibold text-gray-800 leading-normal min-h-[36px]">
              {numWords || "Ingrese una cifra válida..."}
            </p>
            {numWords && (
              <button
                onClick={() => copyToClipboard(numWords)}
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1.5 text-xs font-bold transition cursor-pointer"
              >
                {widgetCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Resultado
                  </>
                )}
              </button>
            )}
          </div>
          <button 
            onClick={() => onNavigate("/")}
            className="w-full text-center text-[10px] font-bold text-blue-600 hover:underline pt-1 cursor-pointer"
          >
            Ir al conversor avanzado →
          </button>
        </div>
      </div>
    );
  }

  if (slug === "arte-letras-burbuja-tipografia-circular-copiar-pegar") {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50/50 rounded-2xl border border-indigo-100 p-5 shadow-xs space-y-4 text-left">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <h4 className="font-display font-bold text-sm text-indigo-900 uppercase tracking-wide">Probador de Letras Burbuja</h4>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Prueba al instante cómo se transforma tu apodo o frase en letras circulares para tus redes.
        </p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Tu Texto:</label>
            <input 
              type="text" 
              value={bubbleText}
              onChange={(e) => setBubbleText(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-indigo-500"
              placeholder="Escribe algo..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Estilo de Círculo:</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setBubbleStyle('white')}
                className={`flex-1 py-1 text-xs font-bold border rounded-lg transition cursor-pointer ${bubbleStyle === 'white' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                ⒶⒷⒸ Blanco
              </button>
              <button 
                onClick={() => setBubbleStyle('black')}
                className={`flex-1 py-1 text-xs font-bold border rounded-lg transition cursor-pointer ${bubbleStyle === 'black' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                🅐🅑🅒 Negro
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3.5 space-y-2">
            <span className="block text-[9px] font-mono font-bold text-gray-400 uppercase">Resultado Circular:</span>
            <p className="text-sm font-bold text-gray-800 leading-normal min-h-[36px] tracking-wide break-all">
              {bubbleResult || "Escribe algo..."}
            </p>
            {bubbleResult && (
              <button
                onClick={() => copyToClipboard(bubbleResult)}
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-1.5 text-xs font-bold transition cursor-pointer"
              >
                {widgetCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Letras Burbuja
                  </>
                )}
              </button>
            )}
          </div>
          <button 
            onClick={() => onNavigate("/letras-burbuja")}
            className="w-full text-center text-[10px] font-bold text-indigo-600 hover:underline pt-1 cursor-pointer"
          >
            Ir al conversor completo →
          </button>
        </div>
      </div>
    );
  }

  if (slug === "letras-aesthetic-fuentes-pequenas-instagram-tiktok") {
    const quickAestheticStyles = [
      { id: "super", name: "Letra Pequeña" },
      { id: "script_bold", name: "Cursiva" },
      { id: "double_struck", name: "Letra Hueca" },
      { id: "monospace", name: "Monospace" },
      { id: "stars", name: "Estrellas" }
    ];

    return (
      <div className="bg-gradient-to-br from-pink-50 to-rose-50/50 rounded-2xl border border-pink-100 p-5 shadow-xs space-y-4 text-left">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
          <h4 className="font-display font-bold text-sm text-pink-900 uppercase tracking-wide">Probador de Fuentes Aesthetic</h4>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Escribe una palabra y pruébala en múltiples fuentes elegantes para biografías de redes sociales.
        </p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Tu Texto:</label>
            <input 
              type="text" 
              value={aestheticText}
              onChange={(e) => setAestheticText(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-pink-500"
              placeholder="Escribe algo..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Estilo Tipográfico:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {quickAestheticStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setAestheticStyle(style.id)}
                  className={`py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${aestheticStyle === style.id ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3.5 space-y-2">
            <span className="block text-[9px] font-mono font-bold text-gray-400 uppercase">Resultado Especial:</span>
            <p className="text-sm font-bold text-gray-800 leading-normal min-h-[36px] tracking-wide break-all">
              {aestheticResult || "Escribe algo..."}
            </p>
            {aestheticResult && (
              <button
                onClick={() => copyToClipboard(aestheticResult)}
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg py-1.5 text-xs font-bold transition cursor-pointer"
              >
                {widgetCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Letras Aesthetic
                  </>
                )}
              </button>
            )}
          </div>
          <button 
            onClick={() => onNavigate("/letras-aesthetic")}
            className="w-full text-center text-[10px] font-bold text-pink-600 hover:underline pt-1 cursor-pointer"
          >
            Ir al conversor avanzado →
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function Blog({ onNavigate, selectedSlug }: { onNavigate?: (path: string) => void; selectedSlug?: string }) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // UX additions
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Set initial post if selectedSlug is passed
  useEffect(() => {
    if (selectedSlug) {
      const post = BLOG_POSTS.find(p => p.slug === selectedSlug);
      if (post) {
        setSelectedPost(post);
      }
    } else {
      setSelectedPost(null);
    }
  }, [selectedSlug]);

  // Extract headings from prose dynamically when selecting a post
  useEffect(() => {
    if (!selectedPost) {
      setHeadings([]);
      return;
    }
    const timer = setTimeout(() => {
      const proseElement = document.querySelector(".prose");
      if (proseElement) {
        const h2Elements = proseElement.querySelectorAll("h2");
        const list: { id: string; text: string }[] = [];
        h2Elements.forEach((h2, idx) => {
          const id = `heading-section-${idx}`;
          h2.setAttribute("id", id);
          list.push({
            id,
            text: h2.textContent || ""
          });
        });
        setHeadings(list);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [selectedPost]);

  // Handle scroll events for reading progress bar and back to top button
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
      
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Scroll to top when changing posts or query
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedPost]);

  // Sync route with slug if needed, but only if onNavigate is present (SPA mode fallback)
  useEffect(() => {
    if (!onNavigate) return;
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/blog/")) {
        const slug = hash.substring(7);
        const post = BLOG_POSTS.find(p => p.slug === slug);
        if (post) {
          setSelectedPost(post);
        } else {
          setSelectedPost(null);
        }
      } else if (hash === "#/blog") {
        setSelectedPost(null);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [onNavigate]);

  const handlePostClick = (post: BlogPost) => {
    if (onNavigate) {
      window.location.hash = `#/blog/${post.slug}`;
    } else {
      window.location.href = `/blog/${post.slug}`;
    }
    setSelectedPost(post);
  };

  const handleBackToList = () => {
    if (onNavigate) {
      window.location.hash = `#/blog`;
    } else {
      window.location.href = `/blog`;
    }
    setSelectedPost(null);
  };

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/blog/${slug}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedId(slug);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="bg-gray-50/50 py-12 sm:py-16 px-4">
      {/* Scroll Progress Bar */}
      {selectedPost && (
        <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
          <div className="h-full bg-blue-600 transition-all duration-100" style={{ width: `${scrollProgress}%` }}></div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {selectedPost && showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-50 cursor-pointer hover:scale-110 flex items-center justify-center"
          title="Volver arriba"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <div className={`${selectedPost ? "max-w-6xl" : "max-w-4xl"} mx-auto transition-all duration-300`}>
        
        {selectedPost ? (
          /* SINGLE BLOG POST VIEW WITH STICKY SIDEBAR */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
            {/* Left Column: Post Content */}
            <article className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-10 text-left">
              {/* Back Button */}
              <button
                onClick={handleBackToList}
                className="group mb-8 inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Volver al Listado de Artículos
              </button>

              {/* Post Metadata Header */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-gray-400 mb-4">
                <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md uppercase tracking-wider text-[10px]">
                  {selectedPost.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedPost.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedPost.readTime}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display font-black text-2xl sm:text-4xl text-gray-900 tracking-tight mb-6 leading-tight">
                {selectedPost.title}
              </h1>

              {/* Author details */}
              <div className="flex items-center justify-between border-y border-gray-100 py-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold font-mono">
                    {selectedPost.author.charAt(0)}
                  </div>
                  <div>
                    <span className="block font-sans font-bold text-sm text-gray-800">{selectedPost.author}</span>
                    <span className="block text-xs text-gray-400 font-mono">Redacción Profesional</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(selectedPost.slug)}
                    className="p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition cursor-pointer"
                    title="Copiar enlace del artículo"
                  >
                    {copiedId === selectedPost.slug ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Featured Image */}
              <div className="w-full aspect-video sm:aspect-[21/9] max-h-[480px] rounded-2xl overflow-hidden mb-8 shadow-xs border border-gray-100 bg-gray-100">
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title} 
                  title={selectedPost.title}
                  loading="eager"
                  width="1200"
                  height="514"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Interactive HTML Body */}
              <div 
                className="prose prose-blue max-w-none text-left font-sans text-gray-800 leading-relaxed text-base"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />

              {/* Tags footer */}
              <div className="border-t border-gray-100 pt-6 mt-12">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3 font-mono">Palabras clave:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.keywords.map((kw, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-lg font-medium">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Call to Action Bar */}
              <div className="mt-12 p-6 sm:p-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 animate-fade-in">
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-lg sm:text-xl">¿Necesitas hacer conversiones instantáneas?</h4>
                  <p className="text-xs text-blue-100 max-w-md font-sans leading-relaxed">
                    Prueba de forma gratuita nuestro convertidor inteligente. Totalmente optimizado para la normativa RAE y formatos de cheques.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate("/")}
                  className="bg-white text-blue-700 px-5 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition shadow-md whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  Ir al Convertidor Principal
                </button>
              </div>
            </article>

            {/* Right Column: Sticky Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-6 space-y-6 max-h-[calc(100vh-4rem)] lg:overflow-y-auto pr-1">
              {/* Dynamic Interactive Mini-Widget */}
              <BlogWidget slug={selectedPost.slug} onNavigate={onNavigate} />

              {/* Dynamic Table of Contents */}
              {headings.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h4 className="font-display font-bold text-xs text-gray-900 uppercase tracking-wide">Índice del Artículo</h4>
                  </div>
                  <nav className="space-y-1">
                    {headings.map((heading) => (
                      <button
                        key={heading.id}
                        onClick={() => scrollToHeading(heading.id)}
                        className="w-full text-left text-xs text-gray-500 hover:text-blue-600 hover:font-bold transition-all duration-150 pl-2.5 border-l-2 border-gray-100 hover:border-blue-500 py-1.5 cursor-pointer block truncate"
                        title={heading.text}
                      >
                        {heading.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Recommended Articles Section */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4 text-left">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h4 className="font-display font-bold text-xs text-gray-900 uppercase tracking-wide">Otros artículos interesantes</h4>
                </div>
                <div className="space-y-3">
                  {BLOG_POSTS.filter(p => p.id !== selectedPost.id).map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => handlePostClick(p)}
                      className="group cursor-pointer space-y-1.5 p-2 rounded-xl hover:bg-gray-50/50 transition duration-150"
                    >
                      <span className="block text-[9px] font-mono font-bold text-blue-600 uppercase tracking-wider">{p.category}</span>
                      <h5 className="font-sans font-bold text-xs text-gray-700 leading-snug group-hover:text-blue-600 transition line-clamp-2">
                        {p.title}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        ) : (
          /* BLOG DIRECTORY LIST VIEW */
          <div className="space-y-10">
            {/* Header section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100/50 px-3 py-1 rounded-full text-xs font-bold font-mono text-blue-700 uppercase tracking-widest">
                <BookOpen className="w-3.5 h-3.5" />
                Blog de Ortografía & Tipografía
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-gray-900 tracking-tight leading-none">
                Consejos Lingüísticos y Creativos
              </h2>
              <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
                Descubre guías ortográficas oficiales de la RAE, consejos prácticos de redacción financiera y trucos para potenciar tus biografías de redes sociales.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar artículos por palabras clave..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 transition"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200/60 self-start sm:self-auto text-xs font-bold">
                {[
                  { key: "all", label: "Todos" },
                  { key: "Finanzas", label: "Finanzas" },
                  { key: "Diseño", label: "Diseño" },
                  { key: "Ortografía", label: "Ortografía" }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedCategory === cat.key
                        ? "bg-white text-blue-700 shadow-xs"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles List */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 text-left">
                {filteredPosts.map((post) => (
                  <article 
                    key={post.id}
                    className="group bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
                  >
                    {/* Image Thumbnail Column */}
                    <div className="w-full md:w-1/3 relative aspect-video md:aspect-auto overflow-hidden bg-gray-100 border-b md:border-b-0 md:border-r border-gray-100">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        title={post.title}
                        loading="lazy"
                        width="400"
                        height="225"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 cursor-pointer"
                        onClick={() => handlePostClick(post)}
                      />
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                      <div>
                        {/* Meta */}
                        <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-gray-400 mb-3">
                          <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-md uppercase text-[9px] tracking-wider">
                            {post.category}
                          </span>
                          <span>•</span>
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>

                        {/* Title */}
                        <h3 
                          onClick={() => handlePostClick(post)}
                          className="font-display font-extrabold text-lg sm:text-xl text-gray-900 leading-snug tracking-tight hover:text-blue-600 cursor-pointer group-hover:text-blue-600 transition duration-200"
                        >
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="font-sans text-xs sm:text-sm text-gray-500 leading-relaxed mt-2.5 mb-5">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Bottom row */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                        <div className="flex flex-wrap gap-1.5 max-w-[65%]">
                          {post.keywords.slice(0, 3).map((kw, idx) => (
                            <span key={idx} className="bg-blue-50/50 text-blue-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                              #{kw.replace(/\s+/g, "-")}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => handlePostClick(post)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-800 transition cursor-pointer"
                        >
                          Leer Artículo
                          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
                <FileText className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="font-display font-bold text-lg text-gray-800">No se encontraron artículos</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Prueba ajustando tu búsqueda o seleccionando otra categoría para encontrar guías relevantes.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
