/* Los proyectos de Atlas en la version movil (/projects y /projects/[slug]).

   Solo los de Harley (seis, con La Leña): la pagina del escritorio tambien lista los del
   autor de la plantilla (Browser Automation Agent, Swarm AI...) y esos no
   son trabajo de Atlas.

   Los textos salen de las fichas de src/data/portfolio.ts, que a su vez se
   armaron desde los repos reales (ver la nota de esas fichas). Van copiados
   aqui y no importados porque esas fichas completas todavia no estan
   commiteadas: asi la version movil no depende de trabajo en curso.

   Lo que NO se sabe no se pone:
     · WorkUP y Fluxa son prototipos de frontend (datos de muestra, IA
       simulada): se dicen prototipos;
     · REGO tiene la produccion caida: sin "Ver en vivo";
     · Perú Travel no tiene codigo a la vista: sin rol, equipo, retos ni
       stack (eran supuestos), y sin etiqueta de cliente [CONFIRMAR];
     · La Leña esta en curso y su repo es privado: sin "Ver en vivo" ni
       codigo, y no se dice de quien es la pollería (pedido de Harley). */

export type Servicio = 'webs' | 'apps' | 'software' | 'ia';

export const SERVICIOS_FILTRO: { id: Servicio; label: string }[] = [
    { id: 'webs', label: 'Webs' },
    { id: 'apps', label: 'Apps' },
    { id: 'software', label: 'Software' },
    { id: 'ia', label: 'IA' },
];

export type Proyecto = {
    slug: string;
    titulo: string;
    rubro: string;
    tiempo: string;
    etiqueta?: 'Cliente' | 'Producto propio';
    /** En linea = se puede abrir hoy. */
    estado?: { texto: string; vivo?: boolean };
    servicios: Servicio[];
    linea: string;
    resumen: string;
    rol?: string;
    equipo?: string;
    /** Lo que muestra la barra del navegador del marco. */
    direccion: string;
    url?: string;
    codigo?: string;
    destacados: string[];
    construimos: { titulo: string; items: { t: string; d: string }[] }[];
    retos?: { problema: string; solucion: string }[];
    stack?: { base: string[]; herramientas: string[] };
};

export const PROYECTOS: Proyecto[] = [
    {
        slug: 'workup',
        titulo: 'WorkUP',
        rubro: 'IA & Empleo',
        tiempo: 'Sep 2025 – Jun 2026',
        etiqueta: 'Producto propio',
        estado: { texto: 'Prototipo en línea', vivo: true },
        servicios: ['apps', 'ia'],
        linea: 'Prácticas profesionales con un agente de IA que empareja vacantes con tu perfil.',
        resumen:
            'WorkUP conecta a estudiantes con empresas para hacer prácticas. Su centro es WorkIA, un asistente que toma las habilidades e industrias del estudiante, le propone vacantes con su porcentaje de coincidencia y deja la postulación lista en un paso. Lo acompañan un constructor de CV, un simulador de entrevistas y un portal para empresas. Hoy es un prototipo navegable, con datos de muestra y la búsqueda simulada, listo para conectarle un backend.',
        rol: 'Producto, diseño y frontend',
        direccion: 'workup-platform.vercel.app',
        url: 'https://workup-platform.vercel.app',
        codigo: 'https://github.com/harleyhp11/WorkUP',
        destacados: ['Asistente WorkIA', 'Constructor de CV', 'Portal para empresas'],
        construimos: [
            {
                titulo: 'WorkIA, el asistente de búsqueda',
                items: [
                    { t: 'Búsqueda guiada en 3 pasos', d: 'el estudiante elige habilidades e industrias, revisa las vacantes propuestas y confirma.' },
                    { t: 'Porcentaje de coincidencia', d: 'cada vacante muestra qué tanto encaja con el perfil antes de postular.' },
                    { t: 'Seguimiento del envío', d: 'una barra de progreso acompaña las postulaciones hasta completarlas.' },
                ],
            },
            {
                titulo: 'Preparación del estudiante',
                items: [
                    { t: 'Constructor de CV', d: 'el currículum se arma en 4 secciones, con vista previa.' },
                    { t: 'Simulador de entrevistas', d: 'para practicar respuestas en una interfaz tipo videollamada.' },
                    { t: 'Revisión de LinkedIn', d: 'evalúa el perfil por apartados y sugiere qué mejorar.' },
                ],
            },
            {
                titulo: 'Ofertas y portal para empresas',
                items: [
                    { t: 'Explorador de ofertas', d: 'buscador con filtros y la coincidencia de cada vacante a la vista.' },
                    { t: 'Portal de empresas', d: 'panel, listado de estudiantes y directorio, organizados en pestañas.' },
                ],
            },
        ],
        retos: [
            {
                problema: 'El primer despliegue falló por dependencias incompatibles.',
                solucion: 'Dos paquetes pedían versiones distintas de React y Vercel detenía la instalación. Fijamos la resolución en un .npmrc y el siguiente despliegue salió limpio.',
            },
            {
                problema: 'Animaciones que siguen al puntero sin trabar la página.',
                solucion: 'Las tarjetas agrupan los movimientos por fotograma (requestAnimationFrame) y se memorizan, así un movimiento rápido no dispara decenas de renders.',
            },
            {
                problema: 'Fugas de memoria en la escena WebGL.',
                solucion: 'Al salir de la portada se cancela el bucle de animación y se liberan el renderer, la geometría y el material.',
            },
        ],
        stack: {
            base: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Motion', 'Three.js'],
            herramientas: ['React Router', 'TanStack Query', 'React Hook Form', 'Zod', 'Recharts', 'Vercel'],
        },
    },
    {
        slug: 'rego-premium',
        titulo: 'REGO Premium',
        rubro: 'Hotelería',
        tiempo: 'Ago – Sep 2026',
        etiqueta: 'Cliente',
        estado: { texto: 'Terminado' },
        servicios: ['webs'],
        linea: 'Apart-hotel premium en Bagua Grande, para estadías cortas y largas.',
        resumen:
            'La web del REGO Premium Apart Hotel, en Bagua Grande (Amazonas). El encargo era presentarlo con el nivel de una marca premium y llevar a la reserva: la página recorre los espacios, las habitaciones, los servicios, las opiniones y la ubicación, y cierra en una reserva directa por WhatsApp. Está hecha en HTML, CSS y JavaScript, con animaciones de GSAP y escenas WebGL, en un equipo de tres.',
        rol: 'Diseño visual y animación',
        equipo: 'Equipo de 3',
        direccion: 'REGO Premium Apart Hotel',
        codigo: 'https://github.com/harleyhp11/Landing-HotelRegoPremium',
        destacados: ['Intro animada', 'Habitaciones con shaders', 'Reserva por WhatsApp'],
        construimos: [
            {
                titulo: 'Intro y recorrido',
                items: [
                    { t: 'Intro animada', d: 'una grilla de columnas se abre y da paso al hero, con palabras que rotan.' },
                    { t: '"Los espacios" en horizontal', d: 'un recorrido que se fija en pantalla y avanza de lado con el scroll.' },
                ],
            },
            {
                titulo: 'Habitaciones y servicios',
                items: [
                    { t: 'Catálogo de habitaciones', d: 'cada tarjeta lleva un shader y abre su detalle con una transición.' },
                    { t: 'Servicios con video de fondo', d: 'las amenidades se presentan sobre video sin cortar la lectura.' },
                ],
            },
            {
                titulo: 'Confianza y reserva',
                items: [
                    { t: 'Opiniones y ubicación', d: 'reseñas de huéspedes y el mapa del hotel, antes de decidir.' },
                    { t: 'Preguntas frecuentes', d: 'las dudas típicas resueltas antes de reservar.' },
                    { t: 'Reserva directa por WhatsApp', d: 'con el mensaje ya escrito: sin intermediarios.' },
                ],
            },
        ],
        retos: [
            {
                problema: 'El navegador mostraba una versión vieja de la página.',
                solucion: 'El HTML quedaba en caché durante el desarrollo. Escribimos un servidor propio sin caché y, en producción, Nginx sirve el HTML con no-cache.',
            },
            {
                problema: 'Laptops que se detectaban como celular.',
                solucion: 'Con el escalado al 150 % o pantallas táctiles cargaba la versión móvil. Centralizamos qué cuenta como escritorio y en teléfonos se apagan dos escenas WebGL.',
            },
            {
                problema: 'Animaciones lentas en Safari.',
                solucion: 'El scroll pasó a animarse con transform, se limitó la densidad de píxeles de los shaders y las escenas se pausan fuera de pantalla.',
            },
        ],
        stack: {
            base: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Three.js', 'WebGL'],
            herramientas: ['ScrollTrigger', 'Flip', 'Google Maps', 'Docker', 'Nginx'],
        },
    },
    {
        slug: 'utopp',
        titulo: 'Utopp',
        rubro: 'Comunidad universitaria',
        tiempo: '2025 – 2026',
        etiqueta: 'Producto propio',
        estado: { texto: 'En línea', vivo: true },
        servicios: ['apps', 'software'],
        linea: 'Eventos, organizaciones y proyectos de la universidad en un solo lugar.',
        resumen:
            'Utopp reúne la vida universitaria de UTEC: eventos, organizaciones estudiantiles, proyectos y las personas con quienes se construyen. Cada estudiante ve un feed según sus intereses, sigue a las organizaciones que le importan y se inscribe a eventos; las organizaciones publican y gestionan su comunidad. Abarca la landing, la aplicación web y una API en Spring Boot, hecha en equipo.',
        rol: 'Diseño de producto y frontend',
        equipo: 'Equipo universitario (UTEC)',
        direccion: 'utopp.app',
        url: 'https://www.utopp.app',
        codigo: 'https://github.com/harleyhp11/utopp-backend',
        destacados: ['Feed por intereses', 'Eventos con ticket QR', 'Login con Google UTEC'],
        construimos: [
            {
                titulo: 'Para estudiantes',
                items: [
                    { t: 'Feed personalizado', d: 'las oportunidades se ordenan según los intereses, con el porqué de cada una.' },
                    { t: 'Eventos con calendario', d: 'vista de calendario y rieles por categoría y por fecha.' },
                    { t: 'Guardados y reacciones', d: 'para volver después a lo que interesa.' },
                ],
            },
            {
                titulo: 'Para organizaciones',
                items: [
                    { t: 'Perfil y muro propios', d: 'cada organización tiene su página pública y su feed.' },
                    { t: 'Publicación en 5 pasos', d: 'un asistente guía la creación de cada evento o convocatoria.' },
                ],
            },
            {
                titulo: 'API y plataforma',
                items: [
                    { t: 'Acceso seguro', d: 'JWT con renovación e inicio de sesión con Google, solo con el correo de UTEC.' },
                    { t: 'Aforo y ticket QR', d: 'inscripción con cupos y check-in escaneando el código.' },
                    { t: 'Correos automáticos', d: 'confirmaciones enviadas en segundo plano.' },
                ],
            },
        ],
        retos: [
            {
                problema: 'Iniciar sesión con Google entre dominios distintos.',
                solucion: 'La cookie de sesión no viajaba entre el frontend y la API. Se configuró SameSite=None y Secure, PKCE en el flujo de Google y un intercambio de token de un solo uso.',
            },
            {
                problema: 'Dos inscripciones al último cupo al mismo tiempo.',
                solucion: 'La API bloquea el evento mientras confirma la inscripción y usa control de versión para que dos ediciones no se pisen.',
            },
            {
                problema: 'Scroll suave dentro de un panel con scroll propio.',
                solucion: 'El dashboard se desplaza en un contenedor y no en la ventana: se registró ese contenedor como scroller para Lenis y ScrollTrigger.',
            },
        ],
        stack: {
            base: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Spring Boot', 'Java 21', 'PostgreSQL'],
            herramientas: ['GSAP', 'Lenis', 'FullCalendar', 'JWT', 'Google OAuth', 'Docker', 'GitHub Actions'],
        },
    },
    {
        slug: 'fluxa',
        titulo: 'Fluxa',
        rubro: 'Fintech',
        tiempo: 'Jun – Jul 2026',
        etiqueta: 'Producto propio',
        estado: { texto: 'Prototipo' },
        servicios: ['software', 'ia'],
        linea: 'Centro de operaciones financieras con IA: conciliación, cobros, pagos y caja.',
        resumen:
            'Fluxa es un centro de operaciones financieras pensado para pymes peruanas: reúne conciliación bancaria, cuentas por cobrar y por pagar y proyección de caja en un solo panel, en soles. Un equipo de agentes con nombre propio propone planes de cobro y de pago, y una barra de comandos permite pedirlos en lenguaje natural, revisarlos y deshacerlos. Hoy es un prototipo navegable: los datos son de muestra y las respuestas de la IA están guionizadas.',
        rol: 'Diseño de producto y frontend',
        equipo: 'Proyecto propio',
        direccion: 'Fluxa · panel',
        destacados: ['Agentes con identidad', 'Barra de comandos ⌘K', 'Centro de auditoría'],
        construimos: [
            {
                titulo: 'Panorama',
                items: [
                    { t: 'Proyección de caja', d: 'saldo, entradas y salidas previstas de un vistazo.' },
                    { t: 'Reportes con hallazgos', d: 'lecturas del estado financiero, listas para revisar.' },
                ],
            },
            {
                titulo: 'Cobrar, pagar y conciliar',
                items: [
                    { t: 'Cobranza multicanal', d: 'conversaciones con clientes, perfiles de cobro y portal de pago.' },
                    { t: 'Pagos programados', d: 'tablero, calendario y reglas de auto-aprobación.' },
                    { t: 'Conciliación bancaria', d: 'cada coincidencia propuesta indica qué tan segura es.' },
                ],
            },
            {
                titulo: 'Agentes de IA',
                items: [
                    { t: 'Equipo con identidad', d: 'Lucía, Mateo, Valeria y Tomás, cada uno a cargo de un área.' },
                    { t: 'Barra de comandos ⌘K', d: 'pides una acción, revisas el plan, lo ejecutas y puedes deshacerlo.' },
                    { t: 'Centro de auditoría', d: 'cada acción queda registrada, con exportación de evidencias.' },
                ],
            },
        ],
        retos: [
            {
                problema: 'Acciones de la IA que se puedan revisar y deshacer.',
                solucion: 'La barra de comandos convierte el pedido en un plan, lo ejecuta paso a paso y registra cada acción en un store de auditoría desde donde se revierte.',
            },
            {
                problema: 'Exportar evidencias que Excel abra bien en español.',
                solucion: 'El CSV sale con BOM UTF-8 y punto y coma, para que Excel con configuración de Perú lo abra sin romper columnas ni tildes.',
            },
            {
                problema: 'Un fondo WebGL que no castigue el rendimiento.',
                solucion: 'La escena limita la densidad de píxeles, se pausa con la pestaña oculta y libera geometrías y materiales al desmontarse.',
            },
        ],
        stack: {
            base: ['React 19', 'TanStack Start', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Zustand'],
            herramientas: ['Recharts', 'Framer Motion', 'Three.js', 'GSAP', 'cmdk', 'Bun'],
        },
    },
    {
        slug: 'peru-travel',
        titulo: 'Perú Travel',
        rubro: 'Turismo',
        tiempo: '2026',
        servicios: ['webs'],
        linea: 'Guía de destinos del Perú, con noticias, blog y buscador.',
        resumen:
            'Perú Travel es una guía para descubrir el Perú destino por destino. La portada funciona como un carrusel: cada destino ocupa la pantalla con su foto, su nombre y una descripción breve, y a un lado esperan los siguientes —el Colca, las Islas Ballestas, Machu Picchu, la Montaña de Colores—, listos para guardarse. La completan noticias, blog, contacto y un buscador.',
        direccion: 'Perú Travel',
        destacados: ['Portada en carrusel', 'Destinos guardables', 'Noticias y blog'],
        construimos: [
            {
                titulo: 'Portada inmersiva',
                items: [
                    { t: 'Destino a pantalla completa', d: 'foto de fondo, nombre en grande y una descripción breve.' },
                    { t: 'Carrusel de destinos', d: 'las tarjetas siguientes esperan al costado y avanzan con flechas.' },
                ],
            },
            {
                titulo: 'Explorar y guardar',
                items: [
                    { t: 'Guardar destinos', d: 'cada tarjeta trae su botón para marcarla.' },
                    { t: 'Buscador', d: 'a un toque desde la barra superior.' },
                ],
            },
            {
                titulo: 'Contenido',
                items: [
                    { t: 'Noticias y blog', d: 'novedades y relatos de viaje.' },
                    { t: 'Contacto', d: 'un canal directo para consultas.' },
                ],
            },
        ],
    },
    {
        slug: 'polleria-la-lena',
        titulo: 'Pollería La Leña',
        rubro: 'Gastronomía',
        tiempo: 'Oct 2026 – en curso',
        etiqueta: 'Cliente',
        estado: { texto: 'En curso' },
        servicios: ['webs'],
        linea: 'Pollería líder de Abancay: dos locales y más de 20 años de sabor a la leña.',
        resumen:
            'La landing de Pollería La Leña, la pollería líder de Abancay (Apurímac), con dos locales y más de veinte años en el mercado. El encargo no era una página más de comida: queríamos llevar a lo digital la experiencia de ir a La Leña, con su fuego, su madera y su historia. El reto fue sostener todo eso —intro animada, scroll suave, galerías, secciones que se fijan— y que la página fuera fluida en cualquier equipo, desde una laptop sin tarjeta gráfica hasta un celular de gama media. Además del inicio, tiene la historia de la pollería y una página por cada local.',
        rol: 'Diseño, desarrollo y rendimiento',
        direccion: 'Pollería La Leña',
        destacados: ['Diseño con fuego y madera', 'Carta con pedido por WhatsApp', 'Fluida en cualquier equipo'],
        construimos: [
            {
                titulo: 'Una experiencia, no una plantilla',
                items: [
                    { t: 'Intro de carga con fuego', d: 'el nombre se abre en una ventana con destellos de brasas y la foto del pollo crece hasta llenar la pantalla.' },
                    { t: 'Madera y fuego hechos en el navegador', d: 'tablas de madera roja con bordes astillados (filtros SVG), pizarras y una cinta entre secciones.' },
                    { t: 'Tipografía con carácter', d: 'letras gastadas, una firma a mano y versalitas mezcladas como en un afiche.' },
                    { t: 'La cita de los dueños', d: 'se enciende palabra por palabra con el scroll.' },
                ],
            },
            {
                titulo: 'Carta y pedidos',
                items: [
                    { t: 'La carta real del local', d: 'por categorías, con una barra de pestañas que acompaña el scroll.' },
                    { t: 'Pedido en un toque', d: 'cada plato se suma a un pedido que se envía armado por WhatsApp o se resuelve con una llamada.' },
                    { t: 'Tamaños y precios por plato', d: 'de 1/8 a pollo entero, con el total a la vista.' },
                ],
            },
            {
                titulo: 'Locales, horarios e historia',
                items: [
                    { t: 'Horarios en vivo', d: 'cada local dice si está abierto ahora o a qué hora abre, con el descanso de los martes por turnos.' },
                    { t: 'Una página por local', d: 'galería, cómo llegar con mapa y delivery.' },
                    { t: 'Nuestra historia', d: 'una línea del tiempo tipo álbum familiar, desde una casa con un horno simple hasta los dos locales de hoy.' },
                ],
            },
            {
                titulo: 'Rendimiento',
                items: [
                    { t: 'Scroll suave sin trabas', d: 'con la CPU ralentizada 6 veces y sin tarjeta gráfica, los fotogramas lentos al bajar pasaron de 27 a 9.' },
                    { t: 'Primera pintura más rápida', d: 'de 580 a 384 ms, y la intro arranca casi 400 ms antes.' },
                    { t: 'Imágenes en AVIF', d: 'el inicio en celular pasó de 2,9 MB a 1,9 MB sin cambios visibles.' },
                ],
            },
        ],
        retos: [
            {
                problema: 'Animaciones pesadas que tenían que ir fluidas en cualquier equipo.',
                solucion: 'Medimos antes de tocar nada, con la CPU ralentizada y sin GPU. La madera astillada y las sombras se volvían a dibujar en cada fotograma: las pasamos a capas propias del compositor, quitamos sombras que no se veían y pausamos lo que queda fuera de pantalla.',
            },
            {
                problema: 'Un solo archivo de JavaScript hacía más lenta la carga.',
                solucion: 'Un build propio con esbuild minifica y versiona cada script por separado; las fuentes, GSAP y Lenis van alojados en el propio sitio, con caché de un año para lo que no cambia.',
            },
            {
                problema: 'Safari en Mac no daba la talla con las animaciones.',
                solucion: 'En Safari de escritorio el sitio entra en un modo sin animaciones: sin intro ni scroll suave, con el mismo contenido y el mismo diseño.',
            },
        ],
        stack: {
            base: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Lenis', 'esbuild'],
            herramientas: ['ScrollTrigger', 'SplitText', 'CustomEase', 'Filtros SVG', 'AVIF / WebP', 'Vercel'],
        },
    },
];

export const imagen = (p: Proyecto) => `/assets/movil/proyectos/${p.slug}.webp`;
export const miniatura = (p: Proyecto) => `/assets/movil/proyectos/${p.slug}-mini.webp`;
export const numero = (p: Proyecto) => String(PROYECTOS.indexOf(p) + 1).padStart(2, '0');

/* El menu de las paginas de proyectos: lo de la home va con "/" delante. */
export const MENU_PROYECTOS = [
    { n: '01', label: 'Inicio', href: '/' },
    { n: '02', label: 'Servicios', href: '/#servicios' },
    { n: '03', label: 'Proyectos', href: '/projects' },
    { n: '04', label: 'Tu negocio', href: '/#negocios' },
    { n: '05', label: 'Preguntas', href: '/#preguntas' },
    { n: '06', label: 'Contacto', href: '/contact' },
];
