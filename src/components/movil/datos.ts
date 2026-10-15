/* Contenido de la home movil de Atlas.

   Todo sale del sitio actual o de lo que propuso Harley en el brief de la
   version movil. Nada de cifras sin confirmar: ni reseñas, ni "80+", ni
   proyectos entregados. Si algo de aqui cambia en el escritorio (precios,
   plazos, soporte), hay que cambiarlo tambien aqui. */

export const WHATSAPP_NUMERO = '51985149671';

export const whatsapp = (texto = 'Hola Atlas 👋 Quiero hablar sobre un proyecto.') =>
    `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;

export const WHATSAPP = whatsapp();

/* Palabra gigante + frase manuscrita del hero. La ultima cierra el ciclo con
   la marca. */
export const ROTATIVAS = [
    { palabra: 'webs', firma: 'que trabajan por ti.' },
    { palabra: 'apps', firma: 'que la gente usa.' },
    { palabra: 'software', firma: 'hecho a tu medida.' },
    { palabra: 'IA', firma: 'que te ahorra horas.' },
    { palabra: 'atlas®', firma: 'construimos lo que viene.' },
] as const;

export const H1_ESTABLE = 'Atlas: webs, apps, software e IA para negocios que quieren crecer';

export const SUBTITULO =
    'Diseñamos y desarrollamos webs, apps, software a medida y automatizaciones con IA para negocios que quieren crecer.';

export const CHIPS_CONFIANZA = ['Precio cerrado por escrito', 'Respuesta en menos de 24 h', 'Desde S/ 400'];

export const CINTA_SERVICIOS = [
    'Diseño web',
    'Landing pages',
    'E-commerce',
    'Apps móviles',
    'Software a medida',
    'IA & automatizaciones',
    'Mantenimiento',
];

export const CINTA_STACK = [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'React Native',
    'PostgreSQL',
    'Supabase',
    'LangChain',
    'Figma',
];

export type Promesa = {
    cat: string;
    /* Lo grande. `cuenta` es la parte que anima el contador. */
    antes?: string;
    cuenta: number;
    despues?: string;
    unidad: string;
    texto: string;
};

export const PROMESAS: Promesa[] = [
    { cat: 'Entrega', cuenta: 2, despues: '–4', unidad: 'semanas', texto: 'Entrega de una web completa.' },
    { cat: 'Velocidad', antes: '< ', cuenta: 2, unidad: 's de carga', texto: 'Optimizada para Google y para móvil.' },
    { cat: 'Soporte', cuenta: 30, unidad: 'días', texto: 'De soporte incluido después del lanzamiento.' },
    { cat: 'Propiedad', cuenta: 100, despues: ' %', unidad: 'tuyo', texto: 'El código y el dominio son tuyos.' },
];

export type EscenaServicio = 'navegador' | 'catalogo' | 'apps' | 'panel' | 'flujo';

export type Servicio = {
    slug: string;
    nombre: string;
    corto: string;
    texto: string;
    chips: string[];
    precio: string;
    escena: EscenaServicio;
};

export const SERVICIOS: Servicio[] = [
    {
        slug: 'webs',
        nombre: 'Webs y landing pages',
        corto: 'Webs',
        texto: 'Páginas rápidas, con animaciones fluidas y una estructura pensada para que cada visita termine en contacto.',
        chips: ['Landing pages', 'Webs corporativas', 'SEO', 'Animaciones'],
        precio: 'Desde S/ 600',
        escena: 'navegador',
    },
    {
        slug: 'ecommerce',
        nombre: 'E-commerce y menús digitales',
        corto: 'E-commerce',
        texto: 'Deja de mandar fotos sueltas y listas de precios por chat. Tus clientes ven todo en un enlace y te escriben con el pedido ya armado.',
        chips: ['Catálogo', 'Pedido por WhatsApp', 'Código QR', 'Pasarela de pago'],
        precio: 'Desde S/ 400',
        escena: 'catalogo',
    },
    {
        slug: 'apps',
        nombre: 'Apps web y móviles',
        corto: 'Apps',
        texto: 'Experiencias intuitivas para iOS y Android, desde el prototipo interactivo hasta la versión lista para publicar.',
        chips: ['iOS & Android', 'Prototipo en Figma', 'Apps web'],
        precio: 'Se cotiza',
        escena: 'apps',
    },
    {
        slug: 'software',
        nombre: 'Software a medida',
        corto: 'Software',
        texto: 'Plataformas que ordenan tu operación: paneles, reservas, pedidos o gestión interna, construidos según cómo trabaja tu equipo.',
        chips: ['Dashboards', 'Reservas', 'CRM', 'Integraciones'],
        precio: 'Desde 4 semanas',
        escena: 'panel',
    },
    {
        slug: 'ia',
        nombre: 'IA y automatizaciones',
        corto: 'IA',
        // [CONFIRMAR copy con Harley]
        texto: 'Agentes y flujos que hacen el trabajo repetitivo por ti: responden consultas, procesan información y conectan tus herramientas sin intervención manual.',
        chips: ['Chatbots y agentes', 'Automatización de procesos', 'Integraciones', 'Reportes automáticos'],
        precio: 'Se cotiza',
        escena: 'flujo',
    },
];

export const MENU = [
    { n: '01', label: 'Servicios', href: '#servicios' },
    { n: '02', label: 'Trabajos', href: '#trabajos' },
    { n: '03', label: 'Proceso', href: '#proceso' },
    { n: '04', label: 'Precios', href: '#precios' },
    { n: '05', label: 'Preguntas', href: '#preguntas' },
    { n: '06', label: 'Contacto', href: '#contacto' },
];
