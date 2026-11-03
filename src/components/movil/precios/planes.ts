import { GRUPOS, LEYENDA_TIPO, NOTA_LEGAL, PLANES as PLANES_ESCRITORIO, type Plan, type TipoServicio } from '@/app/(sitio)/servicios/datos';
import { PLANES_MOVIL } from '@/lib/vista';
import { WHATSAPP, whatsapp, type EscenaServicio } from '../datos';
import { ETAPAS, GARANTIAS } from '../nosotros/equipo';

/* Los datos de /servicios en el movil: la lista (#planes) y el detalle de cada
   plan (/servicios/[slug]).

   Los precios, plazos e "incluye" NO se copian: se importan de
   (sitio)/servicios/datos.ts, que ya es la segunda copia de la landing (ver
   su cabecera). Si suben una tarifa alla, aqui cambia sola. Este archivo solo
   agrega lo que el escritorio no tiene: slug, material, foto, escena, la
   explicacion de cada "incluye", las partes de ejemplo y los mensajes.

   Las frases de home/Preguntas.tsx van copiadas literal (FRASES): ese modulo
   es 'use client' y no exporta PREGUNTAS; importarlo desde un componente de
   servidor lo convertiria en referencia de cliente.

   FOTOS: Directorio de Fotos de WordPress, CC0 (las mismas de la home, ver
   home/negocios/escenarios.ts):
     · restaurante   — Preeti Shah        wordpress.org/photos/photo/712696f7c5/
     · turismo       — andyav             wordpress.org/photos/photo/66769cff70/
     · inmobiliaria  — Hilaludin Wahid    wordpress.org/photos/photo/32463b780f/
     · distribuidora — allureconsulting   wordpress.org/photos/photo/4496439c89/
   Son ambiente, no clientes: alt vacio y nunca un rotulo de cliente. */

export { GRUPOS, LEYENDA_TIPO, NOTA_LEGAL, ETAPAS, GARANTIAS };
export type { Plan, TipoServicio };

/* Los mismos PLANES del escritorio, con `aMedida` resuelto. El tipo Plan lo
   declara («solo el plan a medida»), pero ningun plan de datos.ts lo trae
   puesto: Software solo dice precio "A medida". Aqui se deduce del precio
   (sin rango «S/ x – y» = a medida), para que d.plan.aMedida funcione en
   toda la pagina sin tocar el escritorio. Si alla lo ponen, manda lo suyo.
   Precios, plazos e incluye siguen saliendo de alla, tal cual. */
export const PLANES: Plan[] = PLANES_ESCRITORIO.map((p) => ({ ...p, aMedida: p.aMedida ?? rango(p) === null }));

export type SlugPlan = 'tienda-online' | 'landing-page' | 'web-corporativa' | 'software-a-medida';
export type Material = 'hueso' | 'niebla' | 'grafito' | 'carbon';
export type IconoIncluye =
    | 'whatsapp'
    | 'qr'
    | 'lapiz'
    | 'pluma'
    | 'sobre'
    | 'megafono'
    | 'grafico'
    | 'blog'
    | 'arroba'
    | 'lupa'
    | 'documento'
    | 'capas'
    | 'enchufe'
    | 'salvavidas';
export type Detalle = {
    slug: SlugPlan;
    plan: Plan; // PLANES[i]
    i: number;
    corto: string; // selector y pestañas
    titulo: string; // nombre completo: SEO, mensajes, «Te conviene…»
    material: Material;
    foto: { src: string; mini: string; w: number; h: number; pos: string };
    // el fondo abstracto de su tarjeta en el bento (Unsplash, licencia libre)
    fondo: { src: string; pos: string };
    escena: EscenaServicio;
    paraTi: [string, string, string];
    mejorOtro: { texto: string; a: SlugPlan | 'whatsapp' }[];
    /* paralelo a plan.incluye: misma posicion, mismo item */
    incluye: {
        figura?: { antes?: string; valor: string; cuenta?: number; unidad?: string };
        icono?: IconoIncluye;
        explica: string; // una linea: el titulo (dato literal) ya dice que es
    }[];
    dentro: {
        titular: string;
        destacar: string;
        // solo el software: su escena es generica y la hoja dice que piezas
        // podria tener. Los otros tres planes tienen su propia maqueta, que
        // ya muestra sus partes
        modulos?: { cabecera: string; partes: { t: string; d: string }[]; nota: string };
    };
    ejes: [string, string] | null; // extremos de la barra de rango (null = a medida)
    proyecto: string; // slug de PROYECTOS (proyectos/proyectos.ts)
    proyectoLinea: string;
    extras: string[]; // nombres EXACTOS de GRUPOS
    /* como se MUESTRA un extra en este plan, si su nombre de GRUPOS confunde
       aqui (el nombre exacto sigue siendo la clave) */
    etiquetas?: Record<string, string>;
    pedido: string; // ultima palabra de «¿Empezamos tu …?»
};

const SALUDO = 'Hola Atlas 👋';

/* Literales de home/Preguntas.tsx (y dos de otros archivos, anotados) */
export const FRASES = {
    nadaSinVerlo: 'Nada se publica sin que lo veas.', // PREGUNTAS[2]
    despues: '30 días de soporte incluidos, atención directa por WhatsApp y capacitación para que administres tu web.', // PREGUNTAS[3]
    sistemas: 'Sistemas, apps y automatizaciones con IA', // de PREGUNTAS[4] [CONFIRMAR copy con Harley]
    directo: 'Hablas directo con quien diseña y programa.', // home/Ventajas.tsx
    tuIdea: 'Cuéntanos tu idea por WhatsApp.', // de nosotros/Cierre.tsx [CONFIRMAR copy con Harley]
};

export const DETALLES: Detalle[] = [
    {
        slug: 'tienda-online',
        plan: PLANES[0],
        i: 0,
        corto: 'Tienda',
        titulo: 'Tiendas online y menús digitales',
        material: 'hueso',
        fondo: { src: '/assets/movil/precios/fondos/tienda.webp', pos: '50% 40%' },
        foto: { src: '/assets/movil/negocios/restaurante.webp', mini: '/assets/movil/negocios/restaurante-mini.webp', w: 800, h: 1000, pos: '50% 62%' },
        escena: 'catalogo',
        // [CONFIRMAR copy con Harley] (paraTi, mejorOtro, incluye.explica, dentro, ejes, proyectoLinea, extras)
        paraTi: [
            'Vendes por chat y mandas fotos y precios uno por uno.',
            'Tu carta o tu catálogo tiene hasta 40 productos.',
            'Quieres un QR para tus mesas, tu vitrina o tus empaques.',
        ],
        mejorOtro: [
            { texto: '¿Tienes más de 40 productos?', a: 'whatsapp' },
            { texto: '¿Quieres varias páginas y un blog?', a: 'web-corporativa' },
        ],
        incluye: [
            { figura: { antes: 'Hasta', valor: '40', cuenta: 40 }, explica: 'Tu cliente ve todo sin preguntarte por chat.' },
            { icono: 'whatsapp', explica: 'El pedido te llega ya escrito. Tú solo confirmas.' },
            { icono: 'qr', explica: 'Lo escanean con la cámara y ven tu carta.' },
            { icono: 'lapiz', explica: 'Cambias tus precios cuando quieras, sin esperar a nadie.' },
        ],
        dentro: {
            titular: 'Del QR a tu WhatsApp.',
            destacar: 'WhatsApp.',
        },
        ejes: ['Menos productos', 'Más productos'],
        proyecto: 'polleria-la-lena',
        proyectoLinea: 'Tiene la carta con pedido por WhatsApp, una página por local y la historia de la pollería.', // literal del resumen
        extras: ['E-commerce', 'Identidad visual', 'Hosting y dominio', 'Contenido y actualizaciones', 'Mantenimiento mensual'],
        // en la pagina de «Tiendas online», «E-commerce» se lee como «la
        // tienda misma» y parece que no la incluye: se dice lo que suma de
        // verdad (cobrar en la web, no por WhatsApp) [CONFIRMAR copy con Harley]
        etiquetas: { 'E-commerce': 'Carrito y pago en línea' },
        pedido: 'catálogo',
    },
    {
        slug: 'landing-page',
        plan: PLANES[1],
        i: 1,
        corto: 'Landing',
        titulo: 'Landing page',
        material: 'niebla',
        fondo: { src: '/assets/movil/precios/fondos/landing.webp', pos: '68% 50%' },
        // un estudio con «www.» y un boton START con su cursor en la pared: la
        // landing es eso, un llamado a dar el paso. Foto CC0 de Rashed Hossain,
        // WordPress Photo Directory (pedido de Harley: en vez de Machu Picchu)
        foto: { src: '/assets/movil/precios/landing.webp', mini: '/assets/movil/precios/landing-mini.webp', w: 800, h: 1000, pos: '70% 45%' },
        escena: 'navegador',
        // [CONFIRMAR copy con Harley] (paraTi, mejorOtro, incluye.explica, dentro, ejes, extras)
        paraTi: [
            'Vas a hacer anuncios en Meta o Google y necesitas a dónde llevarlos.',
            'Tienes una oferta, un servicio o un lanzamiento que contar.',
            'Quieres saber cuántos entran y cuántos hacen clic.',
        ],
        mejorOtro: [
            { texto: '¿Necesitas varias páginas y un blog?', a: 'web-corporativa' },
            { texto: '¿Quieres mostrar productos y recibir pedidos?', a: 'tienda-online' },
        ],
        incluye: [
            { icono: 'pluma', explica: 'No necesitas llegar con los textos: los escribimos.' },
            { icono: 'sobre', explica: 'Cada contacto te llega directo al correo.' },
            { icono: 'megafono', explica: 'Un solo mensaje y un solo paso, sin menús que distraigan.' },
            { icono: 'grafico', explica: 'Sabes si tus anuncios están funcionando.' },
        ],
        dentro: {
            titular: 'Una página, un objetivo.',
            destacar: 'objetivo.',
        },
        ejes: ['Más corta y simple', 'Más larga y animada'],
        proyecto: 'rego-premium',
        proyectoLinea: 'La página recorre los espacios, las habitaciones, los servicios, las opiniones y la ubicación, y cierra en una reserva directa por WhatsApp.', // literal del resumen
        extras: ['Identidad visual', 'Optimización de conversión', 'Integraciones', 'Hosting y dominio', 'Mantenimiento mensual'],
        pedido: 'landing',
    },
    {
        slug: 'web-corporativa',
        plan: PLANES[2],
        i: 2,
        corto: 'Web',
        titulo: 'Web corporativa',
        material: 'grafito',
        fondo: { src: '/assets/movil/precios/fondos/web.webp', pos: '35% 50%' },
        foto: { src: '/assets/movil/negocios/inmobiliaria.webp', mini: '/assets/movil/negocios/inmobiliaria-mini.webp', w: 800, h: 1000, pos: '50% 30%' },
        escena: 'navegador',
        // [CONFIRMAR copy con Harley] (paraTi, mejorOtro, incluye.explica, dentro, ejes, proyectoLinea, extras)
        paraTi: [
            'Quieres que te encuentren en Google.',
            'Tus clientes te revisan antes de decidir si confían en ti.',
            'Necesitas varias páginas: quiénes son, qué hacen y cómo contactarlos.',
        ],
        mejorOtro: [
            { texto: '¿Es una sola oferta o una campaña con anuncios?', a: 'landing-page' },
            { texto: '¿Necesitas reservas, pedidos o un panel interno?', a: 'software-a-medida' },
        ],
        incluye: [
            { figura: { valor: '5–7', unidad: 'páginas' }, explica: 'Cada tema de tu negocio en su propia página.' },
            { icono: 'blog', explica: 'Publicas novedades tú mismo, sin tocar código.' },
            { icono: 'arroba', explica: 'Escribes desde hola@tunegocio.pe, no desde una cuenta gratuita.' },
            { icono: 'lupa', explica: 'Sabes cuánta gente te visita y cómo te encuentra.' },
        ],
        dentro: {
            titular: 'Tu web, página por página.',
            destacar: 'página.',
        },
        ejes: ['Menos páginas', 'Más páginas'],
        proyecto: 'peru-travel',
        proyectoLinea: 'Una guía de destinos del Perú, con noticias, blog, contacto y un buscador.', // del resumen
        extras: ['Identidad visual', 'Copy y jerarquía', 'Migraciones', 'Hosting y dominio', 'Mantenimiento mensual'],
        pedido: 'web',
    },
    {
        slug: 'software-a-medida',
        plan: PLANES[3],
        i: 3,
        corto: 'Software',
        titulo: 'Software a medida',
        material: 'carbon',
        fondo: { src: '/assets/movil/precios/fondos/software.webp', pos: '50% 45%' },
        foto: { src: '/assets/movil/negocios/distribuidora.webp', mini: '/assets/movil/negocios/distribuidora-mini.webp', w: 800, h: 1000, pos: '50% 55%' },
        escena: 'panel',
        // [CONFIRMAR copy con Harley] (paraTi, mejorOtro, incluye.explica, dentro, proyectoLinea, extras)
        paraTi: [
            'Ninguna plantilla se adapta a cómo trabajas.',
            'Llevas pedidos, reservas o stock en un cuaderno o de memoria.',
            'Quieres conectar las herramientas que ya usas.',
        ],
        mejorOtro: [
            { texto: '¿Solo quieres mostrar tus productos y recibir pedidos por WhatsApp?', a: 'tienda-online' },
            { texto: '¿Solo necesitas que te encuentren en Google?', a: 'web-corporativa' },
        ],
        incluye: [
            { icono: 'documento', explica: 'Antes de programar, dejamos por escrito qué se construye.' },
            { icono: 'capas', explica: 'Pruebas cada avance y das tu visto bueno antes de seguir.' },
            { icono: 'enchufe', explica: 'Lo nuevo se conecta con lo que ya te funciona.' },
            { icono: 'salvavidas', explica: 'Seguimos contigo mientras tu equipo lo empieza a usar.' },
        ],
        dentro: {
            titular: 'Se arma alrededor de tu proceso.',
            destacar: 'proceso.',
            modulos: {
                cabecera: 'Lo que podría tener',
                partes: [
                    { t: 'Paneles', d: 'Los números de tu negocio en una sola pantalla.' },
                    { t: 'Reservas', d: 'Citas, mesas o cupos, sin cruces.' },
                    { t: 'Pedidos', d: 'Del pedido a la entrega, sin cuaderno.' },
                    { t: 'Clientes', d: 'Tu cartera en orden, con su historial.' },
                    { t: 'Integraciones', d: 'Que tus herramientas se hablen entre sí.' },
                ],
                // [CONFIRMAR] que apps e IA se cotizan por esta via
                nota: 'Lo definimos juntos en el diagnóstico inicial. ¿Una app o una automatización con IA? También se cotiza a medida.',
            },
        },
        ejes: null,
        proyecto: 'fluxa',
        proyectoLinea: 'Un centro de operaciones financieras con IA para pymes. Hoy es un prototipo navegable.', // del resumen
        extras: ['Aplicaciones web', 'Automatizaciones', 'Migraciones', 'Capacitación', 'Mantenimiento mensual'],
        pedido: 'proyecto',
    },
];

/* ---------------------------------------------------------------- helpers */
const SERVICIOS_PLANOS = GRUPOS.flatMap((g) => g.servicios);
export const tipoDe = (nombre: string): TipoServicio | undefined => SERVICIOS_PLANOS.find((s) => s.nombre === nombre)?.tipo;
export const detalle = (slug: string) => DETALLES.find((d) => d.slug === slug);
export const otros = (d: Detalle) => DETALLES.filter((x) => x !== d);
export const nombreExtra = (d: Detalle, n: string) => d.etiquetas?.[n] ?? n;
export const miles = (n: number) => n.toLocaleString('en-US'); // 1200 → "1,200", como el dato
export const soles = (n: number) => `S/ ${miles(n)}`;

export function rango(plan: Plan) {
    const m = /S\/\s*([\d,]+)\s*–\s*([\d,]+)/.exec(plan.precio);
    return m ? { desde: Number(m[1].replace(/,/g, '')), hasta: Number(m[2].replace(/,/g, '')) } : null;
}
export function plazo(plan: Plan) {
    const m = /^(Desde\s+)?(\d+(?:\s*–\s*\d+)?)\s+(\S.*)$/.exec(plan.entrega);
    return m ? { antes: m[1]?.trim(), cifra: m[2], unidad: m[3] } : null; // "A coordinar" → null
}
export const precioLeido = (plan: Plan) => {
    const r = rango(plan);
    return r ? `De ${miles(r.desde)} a ${miles(r.hasta)} soles` : 'Precio a medida';
};
export function entregaLeida(plan: Plan) {
    const e = plan.entrega.replace(' – ', ' a ');
    return /^\d/.test(e) ? `Entrega en ${e}` : `Entrega ${e.charAt(0).toLowerCase()}${e.slice(1)}`;
}
const minuscula = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/* ---------------------------------------------------------------- mensajes */
export function mensajePlan(d: Detalle, extras: string[] = []) {
    const precio = d.plan.aMedida ? '' : ` (${d.plan.precio})`;
    const lineas = [`${SALUDO} Vi el plan ${d.titulo}${precio} y quiero ${minuscula(d.plan.cta)}.`];
    if (extras.length) lineas.push('También me interesa:', ...extras.map((e) => `· ${nombreExtra(d, e)}`));
    lineas.push(d.plan.aMedida ? 'Hoy trabajamos así: ' : 'Mi negocio es: ');
    return lineas.join('\n');
}
export const wspPlan = (d: Detalle, extras: string[] = []) => whatsapp(mensajePlan(d, extras));
export const MSJ_AYUDA = `${SALUDO} Vi sus precios y no sé qué plan me conviene. Mi negocio es: `;
export const MSJ_MAS40 = `${SALUDO} Quiero una tienda online con más de 40 productos. Mi negocio es: `;
export const WSP_AYUDA = whatsapp(MSJ_AYUDA);
export const WSP_MAS40 = whatsapp(MSJ_MAS40);

/* ---------------------------------------------------------------- lista */
// [CONFIRMAR copy con Harley] etiquetas de los chips
export const NECESIDADES: { id: SlugPlan | 'todos' | 'ayuda'; label: string }[] = [
    { id: 'todos', label: 'Ver todos' },
    { id: 'tienda-online', label: 'Vendo por WhatsApp' }, // descripcion 01
    { id: 'landing-page', label: 'Voy a hacer anuncios' }, // incluye[2] de 02
    { id: 'web-corporativa', label: 'Quiero aparecer en Google' }, // descripcion 03
    { id: 'software-a-medida', label: 'Necesito un sistema' }, // descripcion 04
    { id: 'ayuda', label: 'No sé cuál' },
];

// las bajadas 2 y 3 dicen algo que el titulo no dice (antes repetian su
// propio titulo) [CONFIRMAR copy con Harley]
export const PASOS: { t: string; d: string; etapas?: boolean }[] = [
    { t: 'Nos escribes.', d: FRASES.tuIdea },
    { t: 'Primera reunión.', d: 'Ahí fijamos la fecha de entrega.' },
    { t: 'Precio cerrado, por escrito.', d: 'Lo tienes antes de empezar, con todo lo que vamos a hacer.' },
    { t: 'Cinco etapas, con tu visto bueno.', d: FRASES.nadaSinVerlo, etapas: true },
];

// [CONFIRMAR] que las dos aplican a los cuatro planes
export const EN_TODOS = [GARANTIAS[2], GARANTIAS[3]]; // 30 dias de soporte · Todo tuyo

export const MENU_PRECIOS = [
    { n: '01', label: 'Inicio', href: '/' },
    { n: '02', label: 'Nosotros', href: '/nosotros' },
    { n: '03', label: 'Servicios', href: '/servicios#planes' },
    { n: '04', label: 'Proyectos', href: '/projects' },
    { n: '05', label: 'Por qué Atlas', href: '/#ventajas' },
    { n: '06', label: 'Contacto', href: WHATSAPP, externo: true },
];

/* ------------------------------------------- guardas (solo en desarrollo) */
if (process.env.NODE_ENV !== 'production') {
    DETALLES.forEach((d, i) => {
        if (PLANES_MOVIL[i] !== d.slug || PLANES[i] !== d.plan) throw new Error(`planes.ts: orden roto en ${d.slug}`);
        if (d.incluye.length !== d.plan.incluye.length) throw new Error(`planes.ts: incluye desparejo en ${d.slug}`);
        d.extras.forEach((e) => {
            if (!tipoDe(e)) throw new Error(`planes.ts: "${e}" no esta en GRUPOS`);
        });
    });
}
