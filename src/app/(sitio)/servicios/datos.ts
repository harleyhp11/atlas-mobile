/* ─────────────────────────────────────────────────────────────────────────────
   DATOS DE /servicios

   ⚠ OJO: ESTO ES UNA SEGUNDA COPIA. La fuente original de estos mismos valores
   vive en la landing, repartida en cinco archivos:

     - src/components/ui/plan-catalogo.tsx     → plan 01
     - src/components/ui/github-showcase.tsx   → plan 02
     - src/components/ui/kaggle-showcase.tsx   → plan 03
     - src/components/ui/wakatime-showcase.tsx → plan 04
     - src/components/sections/skills/HardSkills.tsx → los 21 servicios
     - src/components/sections/AboutSection.tsx:919 → la nota legal

   Se duplicó a propósito, por decisión explícita de no tocar la landing. El
   precio que se cambie aquí NO se cambia allá y viceversa: si alguna vez suben
   una tarifa, hay que tocar LOS DOS SITIOS o el mismo plan costará distinto
   según la página por la que entre el cliente. Si esto empieza a doler, la
   salida es subir este archivo a src/data/ y hacer que los cinco de arriba
   lo lean; es un refactor sin cambio visual.

   Ningún número de esta página se escribe a mano: los conteos salen de
   array.length. Ver PLANES.length y los contadores de SERVICIOS.
   ───────────────────────────────────────────────────────────────────────────── */

export type Plan = {
    /** Numeral del tablero: "01" … "04". */
    numero: string;
    nombre: string;
    /** Segunda línea del titular, en tono apagado. */
    coda: string;
    descripcion: string;
    precio: string;
    precioNota: string;
    entrega: string;
    incluye: string[];
    cta: string;
    /** Solo el plan a medida: es la única columna sin cifra. */
    aMedida?: boolean;
};

export const PLANES: Plan[] = [
    {
        numero: "01",
        nombre: "Tiendas online",
        coda: "y menús digitales.",
        descripcion:
            "Deja de mandar fotos sueltas y listas de precios por chat. Tus clientes ven todo en un enlace y te escriben con el pedido ya armado.",
        precio: "S/ 400 – 1,200",
        precioNota: "Depende del número de productos.",
        // TODO: falta el plazo real de entrega de este plan. Mismo TODO que ya
        // existe en plan-catalogo.tsx. Hasta que Harley dé el número, la fila
        // de entrega del tablero arranca coja: es el único hueco de los cuatro.
        entrega: "A coordinar",
        incluye: [
            "Hasta 40 productos con foto, precio y descripción",
            "Botón de pedido directo a tu WhatsApp",
            "Código QR listo para mesas, vitrina o empaques",
            "Capacitación para que edites precios tú mismo",
        ],
        cta: "Empezar mi catálogo",
    },
    {
        numero: "02",
        nombre: "Landing page",
        coda: "que convierte.",
        descripcion:
            "Un solo mensaje, sin distracciones ni menús que desvíen. El visitante llega, entiende tu oferta y da el siguiente paso.",
        precio: "S/ 600 – 1,500",
        precioNota: "Depende del largo y del nivel de animación.",
        entrega: "7 – 10 días",
        incluye: [
            "Diseño y redacción de la página completa",
            "Formulario de contacto conectado a tu correo",
            "Optimizada para anuncios de Meta y Google",
            "Panel de visitas y clics para medir resultados",
        ],
        cta: "Empezar mi landing",
    },
    {
        numero: "03",
        nombre: "Web corporativa",
        coda: "completa.",
        descripcion:
            "El sitio que un cliente revisa antes de decidir si confía en ti. Te encuentran en Google y encuentran respuestas sin tener que preguntarte.",
        precio: "S/ 900 – 2,500",
        precioNota: "Depende del número de páginas.",
        entrega: "2 – 3 semanas",
        incluye: [
            "Entre 5 y 7 páginas internas",
            "Blog que puedes actualizar sin programar",
            "Correo corporativo con tu dominio",
            "Google Analytics y Search Console configurados",
        ],
        cta: "Empezar mi web",
    },
    {
        numero: "04",
        nombre: "Software",
        coda: "hecho para ti.",
        descripcion:
            "Cuando ninguna plantilla se adapta a cómo trabajas. Partimos de tu proceso real y construimos la herramienta alrededor de él.",
        precio: "A medida",
        precioNota: "Propuesta cerrada tras la primera llamada.",
        entrega: "Desde 4 semanas",
        incluye: [
            "Diagnóstico inicial y alcance por escrito",
            "Entregas por etapas, con avances revisables",
            "Conexión con las herramientas que ya usas",
            "Acompañamiento durante el primer mes",
        ],
        cta: "Empezar mi proyecto",
    },
];

/* ── Los 21 servicios ─────────────────────────────────────────────────────────
   Solo los nombres y el tipo. Las descripciones de una línea NO se copian: son
   el contenido de HardSkills en /skills, y tenerlas en dos rutas es el mismo
   texto mantenido dos veces. Esta página es el índice; /skills es el detalle. */

export type TipoServicio = "core" | "medida" | "complementario";

export type Servicio = { nombre: string; tipo: TipoServicio };

export const GRUPOS: { titulo: string; servicios: Servicio[] }[] = [
    {
        titulo: "Diseño",
        servicios: [
            { nombre: "Diseño UI/UX", tipo: "core" },
            { nombre: "Landing pages", tipo: "core" },
            { nombre: "Prototipado en Figma", tipo: "core" },
            { nombre: "Identidad visual", tipo: "complementario" },
            { nombre: "Diseño responsive", tipo: "core" },
            { nombre: "Copy y jerarquía", tipo: "complementario" },
        ],
    },
    {
        titulo: "Desarrollo",
        servicios: [
            { nombre: "Webs corporativas", tipo: "core" },
            { nombre: "E-commerce", tipo: "medida" },
            { nombre: "Software a medida", tipo: "medida" },
            { nombre: "Aplicaciones web", tipo: "medida" },
            { nombre: "Integraciones", tipo: "complementario" },
            { nombre: "Performance y SEO técnico", tipo: "core" },
        ],
    },
    {
        titulo: "Soporte",
        servicios: [
            { nombre: "Analítica y medición", tipo: "complementario" },
            { nombre: "Optimización de conversión", tipo: "complementario" },
            { nombre: "Mantenimiento mensual", tipo: "complementario" },
            { nombre: "Hosting y dominio", tipo: "complementario" },
            { nombre: "Migraciones", tipo: "medida" },
            { nombre: "Capacitación", tipo: "complementario" },
            { nombre: "Automatizaciones", tipo: "medida" },
            { nombre: "Correo corporativo", tipo: "complementario" },
            { nombre: "Contenido y actualizaciones", tipo: "complementario" },
        ],
    },
];

/* La misma escala que ya usan las tarjetas de /skills (COLOR_TIPO en
   HardSkills.tsx). Se repite aquí a propósito y NO se cambia: si /servicios
   codificara estos tres tipos con otros colores, el mismo dato tendría dos
   lenguajes según la ruta. Rojo → blanco → gris se lee de más a menos sin
   necesidad de leyenda. */
export const COLOR_TIPO: Record<TipoServicio, string> = {
    core: "var(--hero-accent, #E11D3A)",
    medida: "rgba(255,255,255,0.85)",
    complementario: "rgba(255,255,255,0.28)",
};

/* La leyenda va en palabras del cliente, no en la jerga interna. "Servicio
   core" es como lo llamamos nosotros; "lo que hacemos en casi todo proyecto"
   es lo que entiende quien va a pagar. */
export const LEYENDA_TIPO: Record<TipoServicio, string> = {
    core: "en casi todo proyecto",
    medida: "se cotiza aparte",
    complementario: "se suma si lo necesitas",
};

/** Literal de AboutSection.tsx:919. Se dice dos veces en la página: como cinta
 *  arriba (en mayúsculas, recortada) y completa y legible en el cierre. */
export const NOTA_LEGAL =
    "Precios referenciales en soles. El monto final depende del alcance, las integraciones y el contenido de cada proyecto.";

export const TOTAL_SERVICIOS = GRUPOS.reduce((n, g) => n + g.servicios.length, 0);
