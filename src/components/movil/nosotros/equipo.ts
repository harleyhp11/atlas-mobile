import { WHATSAPP, whatsapp } from '../datos';

/* Los datos de /nosotros (movil): las dos personas detras de Atlas y todo lo
   que la pagina dice de ellas. Es el UNICO archivo de datos de la pagina:
   cuando lleguen los enlaces, el CV o las fotos reales, se cambia aqui (o se
   reemplazan los .webp con el mismo nombre y medidas) sin tocar codigo.

   Nada inventado: ni años, ni clientes, ni cifras, ni testimonios. Lo que no
   se sabe va en null o vacio y con [CONFIRMAR].

   FOTOS PROVISIONALES [CONFIRMAR]: las de public/assets/movil/nosotros/ son
   de OTRAS personas (CC0, StockSnap y WordPress Photo Directory), puestas
   hasta que Harley y Benjamin manden las suyas. No publicar a produccion con
   estas caras. Autores, por si se quiere dar credito:
     · harley*.webp — Jonas Svidras (https://step.camera);
     · benjamin*.webp — Kristin Hardwick (https://www.kristinhardwick.com);
     · trabajo.webp — Blazej Zablotny (https://blazejzablotny.pl).
   Medidas a respetar al reemplazarlas: 540×720 (retratos del hero, se ven a
   ~132–210 px), 720×960 y ≤ 35 KB (fichas), 240×240 (avatares) y 1200×800
   (trabajo). Todas en B/N, en webp (cwebp -q 70 -m 6, desde el original). */

// [CONFIRMAR] pasar a false cuando esten las fotos reales: mientras sea true,
// /nosotros va con noindex (no indexar caras de otras personas con estos nombres)
export const FOTOS_PROVISIONALES = true;

// [CONFIRMAR] quien lleva cada etapa (ETAPAS.quien). Mientras sea false, el
// mazo de /nosotros no muestra el reparto.
export const REPARTO_CONFIRMADO = false;

type Foto = { src: string; w: number; h: number; pos: string };
export type Id = 'harley' | 'benjamin';

export type Persona = {
    id: Id;
    nombre: string; // tarjetas, avatares, «quien»
    nombreCompleto: string; // h3 de la ficha (solo "Harley", sin apellidos)
    pildora: string; // pildora sobre la foto de la ficha
    lado: string; // linea de la tarjeta lateral del hero
    bio: string;
    verbos: [string, string][]; // 3 × [verbo, complemento]: en lugar de "stats", SIN cifras
    chips: { t: string; logo?: 'figma' | 'framer' }[];
    herramientas: string[]; // no se muestran si estan vacias
    retrato: Foto; // arco del hero
    ficha: Foto; // foto 4:5 de la ficha
    mini: string; // avatar 240×240
    alt: string; // alt de la foto de la ficha
    cv: string | null; // null → boton "pendiente" (aria-disabled)
    linkedin: string | null;
    github: string | null;
};

export const HARLEY: Persona = {
    id: 'harley',
    nombre: 'Harley',
    nombreCompleto: 'Harley',
    pildora: 'CEO · Fundador',
    lado: 'Dirección y UI/UX',
    bio: 'La cara visible de Atlas: lo que ves y tocas.',
    verbos: [
        ['Dirige', 'Atlas'],
        ['Lidera', 'el diseño UI/UX'],
        ['Programa', 'el frontend'],
    ],
    // las que se ven en sus proyectos reales (ver proyectos.ts)
    chips: [
        { t: 'Figma', logo: 'figma' },
        { t: 'Framer', logo: 'framer' },
        { t: 'React' },
        { t: 'Next.js' },
        { t: 'TypeScript' },
        { t: 'GSAP' },
        { t: 'Three.js' },
        { t: 'Motion' },
        { t: 'Tailwind CSS' },
    ],
    herramientas: [],
    // PROVISIONAL [CONFIRMAR]: foto de otra persona
    retrato: { src: '/assets/movil/nosotros/harley.webp', w: 540, h: 720, pos: '50% 20%' },
    ficha: { src: '/assets/movil/nosotros/harley-2.webp', w: 720, h: 960, pos: '50% 30%' },
    mini: '/assets/movil/nosotros/harley-mini.webp',
    alt: 'Foto provisional de Harley', // [CONFIRMAR] con la foto real → 'Retrato de Harley'
    cv: null, // [CONFIRMAR] existe /CV_Harley_Huaman_Pena.pdf (lo usa /resume del escritorio), pero el nombre lleva apellidos: ¿usarlo, renombrarlo a /cv/harley.pdf o subir otro?
    linkedin: null, // [CONFIRMAR] URL del perfil
    github: 'https://github.com/harleyhp11', // real (enlaces de codigo de proyectos.ts)
};

export const BENJAMIN: Persona = {
    id: 'benjamin',
    nombre: 'Benjamín',
    nombreCompleto: 'Benjamín Ibáñez',
    pildora: 'CTO · Cofundador',
    lado: 'Backend e infraestructura',
    bio: 'Lleva la parte técnica: lo que no se ve y sostiene todo.',
    verbos: [
        ['Construye', 'el backend'],
        ['Conecta', 'APIs y datos'],
        ['Cuida', 'los servidores'],
    ],
    // areas, no herramientas (sus tecnologias concretas no estan confirmadas),
    // y solo las que no dicen ya los verbos
    chips: [{ t: 'Bases de datos' }, { t: 'Integraciones' }, { t: 'Seguridad' }],
    herramientas: [], // [CONFIRMAR] candidatas, SIN mostrar: Node.js, Fastify, PostgreSQL, Docker, FastAPI (repos de gussephe-benjamin; no esta confirmado que sea el)
    // PROVISIONAL [CONFIRMAR]: foto de otra persona
    retrato: { src: '/assets/movil/nosotros/benjamin.webp', w: 540, h: 720, pos: '50% 16%' },
    ficha: { src: '/assets/movil/nosotros/benjamin-2.webp', w: 720, h: 960, pos: '50% 10%' },
    mini: '/assets/movil/nosotros/benjamin-mini.webp',
    alt: 'Foto provisional de Benjamín Ibáñez', // [CONFIRMAR] → 'Retrato de Benjamín Ibáñez'
    cv: null, // [CONFIRMAR]
    linkedin: null, // [CONFIRMAR]
    github: null, // [CONFIRMAR] ¿'https://github.com/gussephe-benjamin'?
};

export const EQUIPO = [HARLEY, BENJAMIN] as const;
export const PERSONA: Record<Id, Persona> = { harley: HARLEY, benjamin: BENJAMIN };

// Anillo del hero: 6 piezas cada 60° (con 8 a 45° se solapaban), alternando
// Harley, Benjamin y un proyecto (todo aria-hidden)
export type Icono = 'compas' | 'cursor' | 'figma' | 'llaves' | 'enchufe' | 'servidor';
export const ANILLO: ({ tipo: 'hab'; t: string; quien: Id; icono: Icono } | { tipo: 'pry'; slug: string })[] = [
    { tipo: 'hab', t: 'Dirección', quien: 'harley', icono: 'compas' },
    { tipo: 'hab', t: 'Backend', quien: 'benjamin', icono: 'llaves' },
    { tipo: 'pry', slug: 'rego-premium' },
    { tipo: 'hab', t: 'UI/UX', quien: 'harley', icono: 'cursor' },
    { tipo: 'hab', t: 'Servidores', quien: 'benjamin', icono: 'servidor' },
    { tipo: 'pry', slug: 'utopp' },
];

// Carrusel de Harley: slugs de PROYECTOS (proyectos.ts). Fichas.tsx los
// resuelve en el servidor a {slug, titulo, rol}. Peru Travel queda fuera
// porque no tiene rol.
export const CARRUSEL_HARLEY = ['workup', 'rego-premium', 'utopp', 'fluxa', 'polleria-la-lena'];

// Las 5 etapas reales (src/components/sections/faq/escenas.tsx). El reparto «quien» es una lectura
// de los roles → [CONFIRMAR] con Harley; no se muestra hasta REPARTO_CONFIRMADO.
export const ETAPAS: { nombre: string; sub: string; quien: Id[]; extra?: string }[] = [
    { nombre: 'Descubrimiento', sub: 'Objetivos y público', quien: ['harley', 'benjamin'] },
    { nombre: 'Estrategia', sub: 'Arquitectura y contenidos', quien: ['harley', 'benjamin'] },
    { nombre: 'Diseño', sub: 'Prototipo en Figma', quien: ['harley'] },
    { nombre: 'Desarrollo', sub: 'Código y pruebas', quien: ['harley', 'benjamin'] },
    { nombre: 'Lanzamiento', sub: 'Publicación y soporte', quien: ['benjamin'] },
];

export const PLAZOS = [
    ['Landing page', '7–10 días'],
    ['Web corporativa', '2–3 semanas'],
    ['Software a medida', 'desde 4 semanas'],
] as const;

export const GARANTIAS: { icono: 'documento' | 'reloj' | 'salvavidas' | 'llave'; b: string; sr?: string; s: string }[] = [
    { icono: 'documento', b: 'Precio cerrado', s: 'Por escrito' },
    { icono: 'reloj', b: '< 24 h', sr: 'Menos de 24 horas', s: 'Para responderte' },
    { icono: 'salvavidas', b: '30 días', s: 'De soporte incluidos' },
    { icono: 'llave', b: 'Todo tuyo', s: 'El código y el dominio' },
];

export const CITA = 'Ninguna tecnología nos limita: elegimos la adecuada para tu negocio.';
export const WSP_NOSOTROS = whatsapp('Hola Harley y Benjamín 👋 Quiero contarles mi proyecto.');

// Menu de esta pagina: las anclas propias (#harley, #benjamin, #proceso)
// mas lo de siempre. "Contacto" abre WhatsApp.
export const MENU_NOSOTROS = [
    { n: '01', label: 'Inicio', href: '/' },
    { n: '02', label: 'Harley', href: '#harley' },
    { n: '03', label: 'Benjamín', href: '#benjamin' },
    { n: '04', label: 'Proceso', href: '#proceso' },
    { n: '05', label: 'Proyectos', href: '/projects' },
    { n: '06', label: 'Contacto', href: WHATSAPP, externo: true },
];
