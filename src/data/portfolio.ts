import { PortfolioData } from '@/types';

export const portfolioData: PortfolioData = {
    personal: {
        name: 'Atlas',
        title: 'Estudio digital',
        subtitle: 'Estudio digital en Lima: webs, apps y software a medida',
        bio: 'Somos un estudio digital en Lima. Diseñamos y construimos sitios, apps y software a medida para negocios que quieren crecer, con estrategia, diseño y desarrollo en un solo equipo.',
        avatar: '/about/atlas-hero.webp',
        location: 'Lima, Perú',
        // MARCADOR, como los de las redes de abajo: hay que poner el correo
        // real de Atlas antes de publicar.
        email: '{{ATLAS_EMAIL}}',
        phone: '+51 985 149 671', // WhatsApp de Atlas
        resumeUrl: '/resume',
        website: '',
        languages: [{ name: 'Español', level: 'Native' }],
        socialLinks: [
            /* Perfiles de Atlas. GitHub no va a proposito: una agencia no
               enseña su codigo fuente al cliente.

               Las URL son MARCADORES. Hay que sustituirlas por las reales
               antes de publicar o los enlaces no llevan a ninguna parte. */
            {
                platform: 'Instagram',
                url: '{{ATLAS_INSTAGRAM}}',
                icon: 'instagram',
                username: 'Atlas',
            },
            {
                platform: 'LinkedIn',
                url: '{{ATLAS_LINKEDIN}}',
                icon: 'linkedin',
                username: 'Atlas',
            },
            {
                platform: 'WhatsApp',
                url: 'https://wa.me/51985149671',
                icon: 'whatsapp',
                username: 'Atlas',
            },
        ],
    },
    projects: [
        /* ── Proyectos de Harley / Atlas ──────────────────────────────────
           Fichas completas, con la misma estructura que las del dueño anterior
           (encargo, características, bitácora técnica, instalación, accesos).
           Los datos salen de los repos reales (oct 2026):
             · WorkUP     → github.com/harleyhp11/WorkUP (+ workmatch-ai-hub, privado)
             · REGO       → ~/Landing-HotelRegoPremium (fork harleyhp11)
             · Utopp      → Utopp-Landing-page, app del equipo y utopp-backend
             · Fluxa      → ~/friend-hug-engine (privado)
             · Perú Travel→ SIN código a la vista: todo sale de la captura y
                            está deducido; revisar con Harley.
             · La Leña    → ~/polleria-landing (privado). Las cifras de
                            rendimiento son las medidas en _perf/. No se dice
                            de quién es la pollería, a pedido de Harley.
           WorkUP y Fluxa son prototipos de frontend (datos de muestra, IA
           simulada) y así se cuentan: nada de métricas inventadas. */
        {
            id: 'project-workup',
            slug: 'workup',
            title: 'WorkUP',
            description: 'Prácticas profesionales con un agente de IA que empareja vacantes con tu perfil.',
            longDescription: 'WorkUP es una plataforma de prácticas profesionales que conecta a estudiantes con empresas. Su centro es WorkIA, un asistente que toma las habilidades y las industrias que le interesan al estudiante, le propone vacantes con su porcentaje de coincidencia y deja la postulación lista en un solo paso. Lo acompañan un constructor de CV, un simulador de entrevistas y un portal para empresas. Hoy es un prototipo navegable de frontend, con datos de muestra y la búsqueda simulada, listo para conectarle un backend.',
            image: '/project/workup1.webp',
            techStack: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Motion', 'Three.js'],
            tools: ['React Router', 'TanStack Query', 'React Hook Form', 'Zod', 'Recharts', 'Lovable', 'Vercel'],
            status: 'ongoing',
            repoUrl: 'https://github.com/harleyhp11/WorkUP',
            demoUrl: 'https://workup-platform.vercel.app',
            startDate: '2025-09-08',
            role: 'Producto, diseño y frontend',
            customTimeline: 'Sep 2025 – Jun 2026',
            category: 'IA & Empleo',
            highlights: ['Asistente WorkIA', 'Constructor de CV', 'Portal para empresas'],
            features: [
                {
                    title: 'WorkIA, el asistente de búsqueda',
                    items: [
                        '**Búsqueda guiada en 3 pasos**: el estudiante elige habilidades e industrias, revisa las vacantes propuestas y confirma sus postulaciones.',
                        '**Porcentaje de coincidencia**: cada vacante muestra qué tanto encaja con el perfil antes de postular.',
                        '**Seguimiento del envío**: una barra de progreso acompaña las postulaciones hasta completarlas.',
                    ],
                },
                {
                    title: 'Preparación del estudiante',
                    items: [
                        '**Constructor de CV**: el currículum se arma en 4 secciones, con vista previa.',
                        '**Simulador de entrevistas**: para practicar respuestas en una interfaz tipo videollamada.',
                        '**Revisión del perfil de LinkedIn**: evalúa el perfil por apartados y sugiere qué mejorar.',
                    ],
                },
                {
                    title: 'Ofertas y portal para empresas',
                    items: [
                        '**Explorador de ofertas**: buscador con filtros y la coincidencia de cada vacante a la vista.',
                        '**Portal de empresas**: panel, listado de estudiantes y directorio, organizados en pestañas.',
                    ],
                },
                {
                    title: 'Experiencia y rendimiento',
                    items: [
                        '**Portada con fondo WebGL**: colinas generadas con un shader propio en Three.js, más una capa de partículas.',
                        '**Registro de prueba**: permite recorrer toda la plataforma sin crear una cuenta real.',
                        '**Tarjetas que siguen al puntero**: el movimiento se agrupa por fotograma para que la página no se trabe.',
                    ],
                },
            ],
            challengesAndSolutions: [
                {
                    problem: 'El primer despliegue falló por dependencias incompatibles',
                    solution: 'En Vercel, dos paquetes pedían versiones distintas de React y la instalación se detenía. Se fijó la resolución con legacy-peer-deps en un .npmrc y el siguiente despliegue salió limpio.',
                },
                {
                    problem: 'Animaciones que reaccionan al puntero sin trabar la página',
                    solution: 'Las tarjetas con efecto al pasar el mouse agrupan los movimientos con requestAnimationFrame y se memorizan con memo y useCallback, así un movimiento rápido no dispara decenas de renders.',
                },
                {
                    problem: 'Fugas de memoria en la escena WebGL',
                    solution: 'Al desmontar el fondo de colinas se cancela el bucle de animación, se quita el listener de resize y se liberan el renderer, la geometría y el material.',
                },
            ],
            installation: [
                {
                    title: 'Clonar el repositorio',
                    code: 'git clone https://github.com/harleyhp11/WorkUP.git\ncd WorkUP',
                    type: 'code',
                },
                {
                    title: 'Instalar dependencias',
                    code: 'npm install',
                    type: 'code',
                },
                {
                    title: 'Levantar en desarrollo',
                    code: 'npm run dev\n# http://localhost:8080',
                    type: 'code',
                },
            ],
        },
        {
            id: 'project-rego-premium',
            slug: 'rego-premium',
            title: 'REGO Premium Apart Hotel',
            description: 'Apart-hotel premium en Bagua Grande, para estadías cortas y largas.',
            longDescription: 'Landing del REGO Premium Apart Hotel, un apart-hotel en Bagua Grande (Amazonas). El encargo era presentar el hotel con el nivel de una marca premium y llevar a la reserva: la página recorre los espacios, las habitaciones, los servicios, las opiniones y la ubicación, y cierra en una reserva directa por WhatsApp. Está hecha en HTML, CSS y JavaScript sin framework, con animaciones de GSAP y escenas WebGL, y la construimos en un equipo de tres.',
            image: '/project/rego-premium1.webp',
            techStack: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Three.js', 'WebGL'],
            tools: ['ScrollTrigger', 'Flip', 'Google Maps', 'Docker', 'Nginx', 'Vercel'],
            status: 'completed',
            repoUrl: 'https://github.com/harleyhp11/Landing-HotelRegoPremium',
            // El despliegue de producción está caído y los de esta cuenta son
            // versiones viejas: "Ver en vivo" queda desactivado hasta tener la URL buena.
            demoUrl: '#',
            startDate: '2026-08-18',
            endDate: '2026-09-17',
            role: 'Diseño visual y animación',
            customTimeline: 'Ago – Sep 2026',
            team: 'Equipo de 3',
            category: 'Hotelería',
            highlights: ['Intro animada con GSAP', 'Habitaciones con shaders', 'Reserva por WhatsApp'],
            features: [
                {
                    title: 'Intro y recorrido',
                    items: [
                        '**Intro animada**: una grilla de columnas se abre con GSAP y da paso al hero, con palabras que rotan.',
                        '**"Los espacios" en horizontal**: un recorrido que se fija en pantalla y avanza de lado con el scroll.',
                        '**Cinta diagonal**: un marquee en movimiento que hace de corte entre secciones.',
                    ],
                },
                {
                    title: 'Habitaciones y servicios',
                    items: [
                        '**Catálogo de habitaciones**: cada tarjeta lleva un shader en Three.js y abre su detalle con una transición Flip.',
                        '**Servicios con video de fondo**: las amenidades se presentan sobre video sin cortar la lectura.',
                        '**Valores del hotel**: bloques que aparecen con animaciones ligadas al scroll, en CSS puro.',
                    ],
                },
                {
                    title: 'Confianza',
                    items: [
                        '**Opiniones de huéspedes**: sobre una banda animada con shader.',
                        '**Ubicación**: mapa de Google Maps embebido.',
                        '**Preguntas frecuentes**: acordeón con las dudas típicas antes de reservar.',
                    ],
                },
                {
                    title: 'Conversión',
                    items: [
                        '**Reserva directa por WhatsApp**: botón con el mensaje ya escrito, sobre video de fondo.',
                        '**Menú curvo**: navegación a pantalla completa con forma curva.',
                        '**Footer con aura WebGL**: la banda final que invita a reservar.',
                    ],
                },
            ],
            challengesAndSolutions: [
                {
                    problem: 'El navegador mostraba una versión vieja de la página',
                    solution: 'Durante el desarrollo, index.html quedaba en caché y los archivos nuevos nunca se pedían. Escribimos un servidor de desarrollo propio sin caché (devserver.py) y, en producción, Nginx sirve el HTML con no-cache.',
                },
                {
                    problem: 'Laptops que se detectaban como celular',
                    solution: 'Con el escalado de pantalla al 150% o en laptops táctiles, el sitio cargaba la versión móvil. Centralizamos en un solo archivo qué cuenta como escritorio, según el tipo de puntero y un ancho mínimo, y en teléfonos se apagan dos escenas WebGL.',
                },
                {
                    problem: 'Animaciones lentas en Safari',
                    solution: 'Las animaciones de scroll pasaron al compositor (transform en vez de top), se limitó la densidad de píxeles de los shaders y las escenas se pausan cuando salen de pantalla.',
                },
            ],
            installation: [
                {
                    title: 'Clonar el repositorio',
                    code: 'git clone https://github.com/harleyhp11/Landing-HotelRegoPremium.git\ncd Landing-HotelRegoPremium',
                    type: 'code',
                },
                {
                    title: 'Servidor de desarrollo sin caché',
                    code: 'python3 devserver.py\n# http://localhost:5270',
                    type: 'code',
                },
                {
                    title: 'O con Docker',
                    code: 'docker compose up -d --build\n# http://localhost:8081',
                    type: 'code',
                },
            ],
        },
        {
            id: 'project-utopp',
            slug: 'utopp',
            title: 'Utopp',
            description: 'Eventos, organizaciones y proyectos de la universidad en un solo lugar.',
            longDescription: 'Utopp reúne en un solo lugar la vida universitaria de UTEC: eventos, organizaciones estudiantiles, proyectos y a las personas con quienes se construyen. Cada estudiante ve un feed ordenado según sus intereses, sigue a las organizaciones que le importan y se inscribe a eventos; las organizaciones publican y gestionan su comunidad. El proyecto abarca la landing, la aplicación web y una API en Spring Boot, hecha en equipo para el curso de Desarrollo Basado en Plataformas.',
            image: '/project/utopp1.webp',
            techStack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Spring Boot', 'Java 21', 'PostgreSQL'],
            tools: ['Framer Motion', 'GSAP', 'Lenis', 'FullCalendar', 'Recharts', 'JWT', 'Google OAuth', 'Docker', 'GitHub Actions', 'Render'],
            status: 'ongoing',
            repoUrl: 'https://github.com/harleyhp11/utopp-backend',
            demoUrl: 'https://www.utopp.app',
            startDate: '2025-10-30',
            role: 'Diseño de producto y frontend',
            customTimeline: '2025 – 2026',
            team: 'Equipo universitario (UTEC)',
            category: 'Comunidad universitaria',
            highlights: ['Feed por intereses', 'Eventos con ticket QR', 'Login con Google UTEC'],
            features: [
                {
                    title: 'Para estudiantes',
                    items: [
                        '**Feed personalizado**: las oportunidades se ordenan según los intereses elegidos al registrarse, con una explicación de por qué aparece cada una.',
                        '**Eventos con calendario**: vista de calendario y rieles por categoría y por fecha (hoy, mañana).',
                        '**Guardados y reacciones**: el estudiante marca lo que le interesa y vuelve a ello después.',
                    ],
                },
                {
                    title: 'Para organizaciones',
                    items: [
                        '**Perfil y muro propios**: cada organización tiene su página pública y su feed.',
                        '**Publicación en 5 pasos**: un asistente guía la creación de cada evento o convocatoria.',
                        '**Seguidores y membresías**: los estudiantes siguen organizaciones y se unen como miembros.',
                    ],
                },
                {
                    title: 'API y plataforma',
                    items: [
                        '**Acceso seguro**: JWT con renovación en la API e inicio de sesión con Google restringido al correo de UTEC.',
                        '**Eventos con aforo y ticket QR**: inscripción con cupos y check-in escaneando el código.',
                        '**Correos automáticos**: confirmaciones en HTML enviadas en segundo plano.',
                    ],
                },
                {
                    title: 'Administración',
                    items: [
                        '**Panel de actividad**: un resumen del uso de la plataforma.',
                        '**Gestión centralizada**: alumnos, organizaciones, roles y términos de uso en un solo lugar.',
                    ],
                },
            ],
            challengesAndSolutions: [
                {
                    problem: 'Iniciar sesión con Google entre dominios distintos',
                    solution: 'El frontend y la API viven en dominios distintos y la cookie de sesión no viajaba. Se configuró la cookie con SameSite=None y Secure, se agregó la cabecera COOP en Vite, PKCE en el flujo de Google y un intercambio de token de un solo uso.',
                },
                {
                    problem: 'Dos inscripciones al último cupo al mismo tiempo',
                    solution: 'La API bloquea el evento al leerlo (bloqueo pesimista) mientras confirma la inscripción, y usa control de versión para que dos ediciones simultáneas no se pisen.',
                },
                {
                    problem: 'Scroll suave dentro de un panel con scroll propio',
                    solution: 'El dashboard se desplaza dentro de un contenedor y no en la ventana, así que Lenis y ScrollTrigger no detectaban el avance. Se resolvió buscando el contenedor que scrollea y registrándolo como scroller.',
                },
            ],
            installation: [
                {
                    title: 'Clonar la API',
                    code: 'git clone https://github.com/harleyhp11/utopp-backend.git\ncd utopp-backend',
                    type: 'code',
                },
                {
                    title: 'Levantar la base de datos',
                    code: 'docker compose up -d db\n# Define DB_URL, DB_USERNAME, DB_PASSWORD y JWT_SECRET',
                    type: 'code',
                },
                {
                    title: 'Ejecutar la API',
                    code: './mvnw spring-boot:run\n# http://localhost:8080/swagger-ui.html',
                    type: 'code',
                },
                {
                    title: 'Correr las pruebas',
                    code: './mvnw verify',
                    type: 'code',
                },
            ],
        },
        {
            id: 'project-fluxa',
            slug: 'fluxa',
            title: 'Fluxa',
            description: 'Centro de operaciones financieras con IA: conciliación, cobros, pagos y caja.',
            longDescription: 'Fluxa es un centro de operaciones financieras pensado para pymes peruanas: reúne conciliación bancaria, cuentas por cobrar y por pagar, y proyección de caja en un solo panel, en soles. Un equipo de agentes con nombre propio propone planes de cobro y de pago, y una barra de comandos permite pedirlos en lenguaje natural, revisarlos antes de ejecutarlos y deshacerlos. Hoy es un prototipo de producto navegable: los datos son de muestra y las respuestas de la IA están guionizadas.',
            image: '/project/fluxa1.webp',
            techStack: ['React 19', 'TanStack Start', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Zustand'],
            tools: ['Recharts', 'Framer Motion', 'Three.js', 'GSAP', 'cmdk', 'Sonner', 'Bun', 'Lovable'],
            status: 'ongoing',
            // Repositorio privado y sin despliegue público todavía.
            demoUrl: '#',
            startDate: '2026-06-08',
            role: 'Diseño de producto y frontend',
            customTimeline: 'Jun – Jul 2026',
            team: 'Proyecto propio',
            category: 'Fintech',
            highlights: ['Agentes con identidad', 'Barra de comandos ⌘K', 'Centro de auditoría'],
            features: [
                {
                    title: 'Panorama',
                    items: [
                        '**Dashboard con proyección de caja**: saldo, entradas y salidas previstas de un vistazo.',
                        '**Reportes con hallazgos**: lecturas sobre el estado financiero, listas para revisar.',
                    ],
                },
                {
                    title: 'Cobrar y pagar',
                    items: [
                        '**Cobranza multicanal**: gestión, conversaciones con clientes, perfiles de cobro y portal de pago.',
                        '**Pagos programados**: tablero, calendario, carga de facturas e historial.',
                        '**Reglas de auto-aprobación**: del tipo "si… entonces…" para aprobar pagos sin intervención.',
                    ],
                },
                {
                    title: 'Conciliación',
                    items: [
                        '**Conciliación bancaria**: vista general y por método de pago.',
                        '**Carga de comprobantes**: para cruzar movimientos con sus documentos.',
                        '**Nivel de confianza**: cada coincidencia propuesta indica qué tan segura es.',
                    ],
                },
                {
                    title: 'Agentes de IA',
                    items: [
                        '**Equipo de agentes con identidad**: Lucía, Mateo, Valeria y Tomás, cada uno a cargo de un área.',
                        '**Barra de comandos ⌘K**: pides una acción en lenguaje natural, revisas el plan, lo ejecutas y puedes deshacerlo.',
                        '**Centro de auditoría**: registro de cada acción, con exportación de evidencias en CSV.',
                    ],
                },
            ],
            challengesAndSolutions: [
                {
                    problem: 'Acciones de la IA que se puedan revisar y deshacer',
                    solution: 'La barra de comandos convierte el pedido en un plan, lo ejecuta paso a paso y registra cada acción en un store de auditoría, desde donde se puede revertir.',
                },
                {
                    problem: 'Exportar evidencias que Excel abra bien en español',
                    solution: 'El CSV se genera con BOM UTF-8 y punto y coma como separador, y se limpian los punto y coma del texto, para que Excel con configuración regional de Perú lo abra sin romper columnas ni tildes.',
                },
                {
                    problem: 'Un fondo WebGL que no castigue el rendimiento',
                    solution: 'La escena del chat limita la densidad de píxeles según el dispositivo, se redimensiona con ResizeObserver, se pausa cuando la pestaña no está visible y libera geometrías y materiales al desmontarse.',
                },
            ],
            installation: [
                {
                    title: 'Repositorio privado',
                    code: 'El código de Fluxa vive en un repositorio privado. Una vez clonado, se levanta con Bun en dos comandos.',
                    type: 'text',
                },
                {
                    title: 'Instalar dependencias',
                    code: 'bun install',
                    type: 'code',
                },
                {
                    title: 'Levantar en desarrollo',
                    code: 'bun run dev\n# http://localhost:8080',
                    type: 'code',
                },
            ],
        },
        /* Perú Travel: no hay repositorio a la vista. Todo lo de abajo se
           dedujo de la captura del proyecto (portada con carrusel de destinos,
           guardar, buscador, saludo al usuario): stack, características y
           bitácora son SUPOSICIONES razonables, no hechos. Sin "Instalación"
           ni "Código fuente" hasta tener el repo. Rol y equipo quedan en los
           valores por defecto (Diseño y desarrollo · Atlas). */
        {
            id: 'project-peru-travel',
            slug: 'peru-travel',
            title: 'Perú Travel',
            description: 'Guía de destinos del Perú, con noticias, blog y buscador.',
            longDescription: 'Perú Travel es una guía de viajes para descubrir el Perú destino por destino. La portada funciona como un carrusel: cada destino ocupa la pantalla con su foto, su nombre y una descripción breve, y a un lado esperan los siguientes —el cañón del Colca, las Islas Ballestas, Machu Picchu, la Montaña de Colores—, listos para guardarse. La completan secciones de noticias, blog y contacto, y un buscador.',
            image: '/project/peru-travel1.webp',
            techStack: ['HTML5', 'CSS3', 'JavaScript'],
            tools: ['Figma', 'Google Fonts'],
            status: 'completed',
            demoUrl: '#',
            startDate: '2026-01-01',
            customTimeline: '2026',
            category: 'Turismo',
            highlights: ['Portada en carrusel', 'Destinos guardables', 'Noticias y blog'],
            features: [
                {
                    title: 'Portada inmersiva',
                    items: [
                        '**Destino a pantalla completa**: foto de fondo, nombre en grande y una descripción breve con llamada a explorar.',
                        '**Carrusel de destinos**: las tarjetas siguientes esperan al costado y avanzan con flechas.',
                        '**Indicador de avance**: un contador y una línea de tiempo vertical marcan en qué destino vas.',
                    ],
                },
                {
                    title: 'Explorar y guardar',
                    items: [
                        '**Guardar destinos**: cada tarjeta trae su botón para marcarla.',
                        '**Buscador**: acceso directo desde la barra superior.',
                        '**Saludo personalizado**: la cabecera reconoce al usuario que inició sesión.',
                    ],
                },
                {
                    title: 'Contenido',
                    items: [
                        '**Fichas de destino**: cada lugar con su descripción y lo que no hay que perderse.',
                        '**Noticias y blog**: secciones para novedades y relatos de viaje.',
                        '**Contacto**: un canal directo para consultas.',
                    ],
                },
            ],
            challengesAndSolutions: [
                {
                    problem: 'Sincronizar el fondo con el carrusel',
                    solution: 'Al avanzar cambian juntos la foto de fondo, el título, la descripción y las tarjetas: el destino activo vive en un solo lugar y todo lo demás se actualiza desde ahí.',
                },
                {
                    problem: 'Fotos grandes sin una carga lenta',
                    solution: 'Las imágenes de los destinos se optimizan y se cargan a medida que se necesitan, para que la portada aparezca rápido.',
                },
                {
                    problem: 'Recordar los destinos guardados',
                    solution: 'Los marcadores se guardan en el navegador, así siguen ahí cuando el usuario vuelve.',
                },
            ],
        },
        {
            id: 'project-polleria-la-lena',
            slug: 'polleria-la-lena',
            title: 'Pollería La Leña',
            description: 'Pollería líder de Abancay: dos locales y más de 20 años de sabor a la leña.',
            longDescription: 'Landing de Pollería La Leña, la pollería líder de Abancay (Apurímac), con dos locales y más de veinte años en el mercado. El encargo no era una página más de comida: queríamos llevar a lo digital la experiencia de ir a La Leña, con su fuego, su madera y su historia, en vez del diseño de siempre. El reto fue sostener todo eso (intro animada, scroll suave, galerías, secciones que se fijan) y que la página fuera fluida en cualquier equipo, desde una laptop sin tarjeta gráfica hasta un celular de gama media. Además del inicio, el sitio tiene la historia de la pollería y una página por cada local.',
            image: '/project/polleria-la-lena1.webp',
            techStack: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Lenis', 'esbuild'],
            tools: ['ScrollTrigger', 'SplitText', 'CustomEase', 'Filtros SVG', 'AVIF / WebP', 'Vercel'],
            status: 'ongoing',
            demoUrl: '#',
            startDate: '2026-10-19',
            role: 'Diseño, desarrollo y rendimiento',
            customTimeline: 'Oct 2026 – en curso',
            category: 'Gastronomía',
            highlights: ['Diseño con fuego y madera', 'Carta con pedido por WhatsApp', 'Fluida en cualquier equipo'],
            features: [
                {
                    title: 'Una experiencia, no una plantilla',
                    items: [
                        '**Intro de carga con fuego**: el nombre de la pollería se abre en una ventana con destellos de brasas y la foto del pollo a la leña crece hasta llenar la pantalla.',
                        '**Madera y fuego hechos en el navegador**: tablas de madera roja con bordes astillados (filtros SVG), pizarras y una cinta que cruza entre secciones.',
                        '**Tipografía con carácter**: letras gastadas, una firma a mano y versalitas que se mezclan como en un afiche.',
                        '**La cita de los dueños se enciende palabra por palabra** con el scroll.',
                    ],
                },
                {
                    title: 'Carta y pedidos',
                    items: [
                        '**La carta real del local**, por categorías, con una barra de pestañas que acompaña el scroll.',
                        '**Pedido en un toque**: cada plato se agrega a un pedido que se envía armado por WhatsApp o se resuelve con una llamada.',
                        '**Tamaños y precios por plato**: de 1/8 a pollo entero, con el total a la vista.',
                    ],
                },
                {
                    title: 'Locales, horarios e historia',
                    items: [
                        '**Horarios en vivo**: cada local dice si está abierto ahora o a qué hora abre, y se explica el descanso de los martes por turnos.',
                        '**Una página por local**: galería, cómo llegar con mapa y delivery, con la misma página para los dos locales.',
                        '**Nuestra historia**: una línea del tiempo tipo álbum familiar, desde una casa con un horno simple hasta los dos locales de hoy.',
                    ],
                },
                {
                    title: 'Rendimiento',
                    items: [
                        '**Scroll suave sin trabas**: medido con la CPU ralentizada 6 veces y sin tarjeta gráfica, los fotogramas lentos al bajar pasaron de 27 a 9.',
                        '**Primera pintura más rápida**: de 580 a 384 ms, y la intro arranca casi 400 ms antes.',
                        '**Imágenes en AVIF**: el inicio en celular pasó de 2,9 MB a 1,9 MB sin cambios visibles.',
                    ],
                },
            ],
            challengesAndSolutions: [
                {
                    problem: 'Animaciones pesadas que tenían que ir fluidas en cualquier equipo',
                    solution: 'Medimos antes de tocar nada, con la CPU ralentizada y sin GPU, y comparamos capturas píxel por píxel para no cambiar el diseño. El hallazgo fue que la madera astillada y las sombras se volvían a dibujar en cada fotograma: las pasamos a capas propias del compositor, quitamos sombras que no se veían y pausamos todo lo que queda fuera de pantalla.',
                },
                {
                    problem: 'Un solo archivo de JavaScript hacía más lenta la carga',
                    solution: 'Al juntar todo en un bundle, la primera pintura empeoraba en equipos lentos porque el navegador ejecutaba una sola tarea larga. Escribimos un build propio con esbuild que minifica y versiona cada script por separado, alojamos las fuentes, GSAP y Lenis en el propio sitio y dejamos en caché de un año todo lo que no cambia.',
                },
                {
                    problem: 'Safari en Mac no daba la talla con las animaciones',
                    solution: 'En Safari de escritorio el sitio detecta el navegador al cargar y entra en un modo sin animaciones: sin intro, sin scroll suave y con los enlaces saltando directo. El contenido y el diseño son los mismos; solo se apaga el movimiento.',
                },
            ],
            installation: [
                {
                    title: 'Repositorio privado',
                    code: 'El código vive en un repositorio privado. Es HTML, CSS y JavaScript sin framework: para verlo basta un servidor estático.',
                    type: 'text',
                },
                {
                    title: 'Levantar en desarrollo',
                    code: 'python3 -m http.server 5360\n# http://localhost:5360',
                    type: 'code',
                },
                {
                    title: 'Compilar para producción',
                    code: 'npm install\nnpm run build\n# genera dist/, que se publica en Vercel',
                    type: 'code',
                },
            ],
        },
    ],
    experiences: [],
    education: [],
    achievements: [],
    techStack: [
        { name: 'Python', icon: 'https://cdn.simpleicons.org/python', category: 'language' },
        { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript', category: 'language' },
        { name: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript', category: 'language' },
        { name: 'Solidity', icon: 'https://cdn.simpleicons.org/solidity', category: 'language' },
        { name: 'React', icon: 'https://cdn.simpleicons.org/react', category: 'framework' },
        { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs', category: 'framework' },
        { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs', category: 'framework' },
        { name: 'TensorFlow', icon: 'https://cdn.simpleicons.org/tensorflow', category: 'library' },
        { name: 'Scikit-learn', icon: 'https://cdn.simpleicons.org/scikitlearn', category: 'library' },
        { name: 'Pandas', icon: 'https://cdn.simpleicons.org/pandas', category: 'library' },
        { name: 'NumPy', icon: 'https://cdn.simpleicons.org/numpy', category: 'library' },
        { name: 'Matplotlib', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg', category: 'library' }, // Matplotlib not on simpleicons sometimes or generic
        { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss', category: 'library' },
        { name: 'Redis', icon: 'https://cdn.simpleicons.org/redis', category: 'database' },
        { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql', category: 'database' },
        { name: 'Kubernetes', icon: 'https://cdn.simpleicons.org/kubernetes', category: 'tool' },
        { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker', category: 'tool' },
        { name: 'Terraform', icon: 'https://cdn.simpleicons.org/terraform', category: 'tool' },
        { name: 'LangChain', icon: 'https://cdn.simpleicons.org/langchain', category: 'library' },
        { name: 'Mistral AI', icon: 'https://cdn.simpleicons.org/mistralai', category: 'library' },
        { name: 'PyTorch', icon: 'https://cdn.simpleicons.org/pytorch', category: 'library' },
        { name: 'OpenCV', icon: 'https://cdn.simpleicons.org/opencv', category: 'library' },
        { name: 'FastAPI', icon: 'https://cdn.simpleicons.org/fastapi', category: 'framework' },
        { name: 'Flask', icon: 'https://cdn.simpleicons.org/flask', category: 'framework' },
    ],
    hardSkills: [
        { name: 'System Architecture', level: 'intermediate', category: 'software', description: 'Designing robust, scalable, and high-performance system architectures for complex applications.' },

        { name: 'AI Agents & Autonomy', level: 'beginner', category: 'ai', description: 'Designing autonomous systems with recursive reasoning and decision-making capabilities.' },
        { name: 'Large Language Models (LLM)', level: 'intermediate', category: 'ai', description: 'Expertise in fine tuning open source models, RAG architectures, and prompt engineering.' },
        { name: 'Data Science', level: 'expert', category: 'ai', description: 'Advanced statistical analysis and predictive modeling to extract insights from big data.' },
        { name: 'Deep Learning (CV/NLP)', level: 'advanced', category: 'ai', description: 'Architecting deep neural networks for complex computer vision and natural language tasks.' },
        { name: 'Computer Vision', level: 'intermediate', category: 'ai', description: 'Developing real-time object detection, pattern recognition, and spatial analysis systems.' },
        { name: 'Machine Learning Ops', level: 'advanced', category: 'ai', description: 'Implementing robust pipelines for model training, deployment, and performance monitoring.' },
        { name: 'DevOps', level: 'advanced', category: 'devops', description: 'Streamlining development workflows and infrastructure management through automation.' },
        { name: 'Full Stack Development', level: 'expert', category: 'software', description: 'Engineering scalable web architectures from pixel-perfect frontends to robust databases.' },
        { name: 'System Analysis', level: 'advanced', category: 'software', description: 'Translating complex stakeholder requirements into efficient and scalable technical blueprints.' },
        { name: 'SDLC', level: 'intermediate', category: 'software', description: 'Governing the entire life cycle of software development with a focus on quality and agility.' },
        { name: 'Software Design', level: 'advanced', category: 'software', description: 'Applying architectural patterns and principles to build maintainable and modular systems.' },
        { name: 'Requirement Specifications', level: 'advanced', category: 'software', description: 'Defining clear, precise, and actionable technical documentation for engineering teams.' },
        { name: 'Data Analytics', level: 'advanced', category: 'data', description: 'Transforming raw data into meaningful visualizations and strategic intelligence.' },
        { name: 'Data Visualization', level: 'expert', category: 'data', description: 'Crafting intuitive and interactive dashboards to communicate complex data findings.' },
        { name: 'SQL & DBMS', level: 'expert', category: 'data', description: 'Architecting and optimizing relational database schemas for high-performance applications.' },
        { name: 'Docker & Kubernetes', level: 'intermediate', category: 'devops', description: 'Containerizing applications for consistent deployment and orchestrating cloud resources.' },

        // Other Technical Skills
        { name: 'Wazuh', level: 'beginner', category: 'other', description: 'Exploring open-source security monitoring for threat detection and compliance.' },
        { name: 'Network Traffic Analysis', level: 'beginner', category: 'other', description: 'Analyzing packet captures to identify anomalies and optimize network performance.' },
        { name: 'Socket Programming', level: 'expert', category: 'other', description: 'Implementing low-level network communication protocols for real-time data transfer.' },
        { name: 'Google Cloud Platform', level: 'beginner', category: 'other', description: 'Utilizing cloud infrastructure and services for scalable application hosting.' },
        { name: 'Solidity', level: 'beginner', category: 'other', description: 'Writing secure smart contracts for decentralized applications on Ethereum.' },
        { name: 'Decentralized Applications (DApps)', level: 'beginner', category: 'other', description: 'Developing web applications that interact with blockchain smart contracts.' },
        { name: 'Blockchain Architecture', level: 'beginner', category: 'other', description: 'Understanding the fundamental principles of distributed ledger technologies.' },
    ],
    softSkills: [
        { name: 'Problem Solving', description: 'Innovative debugging and algorithmic optimization' },
        { name: 'Systemic Thinking', description: 'Designing robust, scalable end-to-end architectures' },
        { name: 'Critical Thinking', description: 'Analytical approach to solving complex engineering challenges' },
        { name: 'Continuous Learning', description: 'Staying updated with state-of-the-art AI research' },
        { name: 'Analytical Thinking', description: 'Breaking down complex data into actionable insights' },
        { name: 'Adaptability', description: 'Quickly mastering new frameworks and AI models' },
        { name: 'Leadership', description: 'Leading engineering teams and managing complex projects' },
        { name: 'Communication', description: 'Translating complex AI concepts for stakeholders' },
        { name: 'Teamwork', description: 'Collaborative development in cross-functional agile teams' },
        { name: 'Research Skills', description: 'In-depth literature review and academic contribution' },
    ],
    tools: [
        { name: 'VS Code', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg', category: 'ide' },
        { name: 'Jupyter', icon: 'https://cdn.simpleicons.org/jupyter', category: 'ide' },
        { name: 'Google Colab', icon: 'https://cdn.simpleicons.org/googlecolab', category: 'ide' },
        { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma', category: 'design' },
        { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github', category: 'devops' }, // Default black, handled by dark:invert in component
        { name: 'Git', icon: 'https://cdn.simpleicons.org/git', category: 'devops' },
        { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker', category: 'devops' },
        { name: 'Conda', icon: 'https://cdn.simpleicons.org/anaconda', category: 'devops' },
        { name: 'Linux', icon: 'https://cdn.simpleicons.org/linux', category: 'devops' },
        { name: 'Postman', icon: 'https://cdn.simpleicons.org/postman', category: 'devops' },
    ],
    faqs: [],
    blogs: [
        {
            id: 'blog-1',
            slug: 'future-of-ai-agents',
            title: 'El futuro de los agentes de IA en la empresa',
            excerpt: 'Cómo los agentes autónomos están redefiniendo la arquitectura de software y la toma de decisiones.',
            content: 'Un recorrido por los agentes de IA…',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-03-20',
            category: 'applied-ai',
            tags: ['IA', 'Agentes', 'Empresa'],
            author: { name: 'Atlas', avatar: '/brand/atlas-circle.png' },
            readTime: '5'
        },
        {
            id: 'blog-2',
            slug: 'web3-ux-challenges',
            title: 'Los retos de experiencia en Web3',
            excerpt: 'Cómo construir aplicaciones descentralizadas que se sientan tan fluidas como las de siempre.',
            content: 'La experiencia de uso en Web3 es decisiva…',
            image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-03-15',
            category: 'more',
            tags: ['Web3', 'Blockchain', 'Experiencia'],
            author: { name: 'Atlas', avatar: '/brand/atlas-circle.png' },
            readTime: '4'
        },
        {
            id: 'blog-3',
            slug: 'mastering-nextjs-performance',
            title: 'Rendimiento en Next.js, a fondo',
            excerpt: 'Técnicas avanzadas para optimizar los Core Web Vitals en aplicaciones React modernas.',
            content: 'Optimización de rendimiento…',
            image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-03-05',
            category: 'software-development',
            tags: ['Next.js', 'React', 'Rendimiento'],
            author: { name: 'Atlas', avatar: '/brand/atlas-circle.png' },
            readTime: '6'
        },
        {
            id: 'blog-4',
            slug: 'ai-driven-security',
            title: 'Ciberseguridad con inteligencia artificial',
            excerpt: 'Aprendizaje profundo para detectar y frenar intrusiones de red.',
            content: 'Ciberseguridad con IA…',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-02-28',
            category: 'applied-ai',
            tags: ['IA', 'Seguridad', 'Aprendizaje profundo'],
            author: { name: 'Atlas', avatar: '/brand/atlas-circle.png' },
            readTime: '7'
        },
        {
            id: 'blog-5',
            slug: 'llm-fine-tuning',
            title: 'Ajustar modelos de lenguaje en local',
            excerpt: 'Guía para optimizar modelos de código abierto con Ollama y técnicas LoRA.',
            content: 'Ajuste fino de modelos en local…',
            image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-02-15',
            category: 'applied-ai',
            tags: ['LLM', 'Python', 'Ollama'],
            author: { name: 'Atlas', avatar: '/brand/atlas-circle.png' },
            readTime: '8'
        },
        {
            id: 'blog-6',
            slug: 'smart-contract-security',
            title: 'Patrones de auditoría en contratos inteligentes',
            excerpt: 'Vulnerabilidades frecuentes en Solidity y cómo evitarlas.',
            content: 'Patrones de auditoría…',
            image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-02-01',
            category: 'more',
            tags: ['Solidity', 'Ethereum', 'Seguridad'],
            author: { name: 'Atlas', avatar: '/brand/atlas-circle.png' },
            readTime: '5'
        },
        {
            id: 'blog-7',
            slug: 'modern-state-management',
            title: 'Gestión de estado moderna en React',
            excerpt: 'Zustand, Redux Toolkit y React Context comparados en aplicaciones grandes.',
            content: 'Gestión de estado…',
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-01-25',
            category: 'software-development',
            tags: ['React', 'Zustand', 'Arquitectura'],
            author: { name: 'Atlas', avatar: '/brand/atlas-circle.png' },
            readTime: '4'
        },
        {
            id: 'blog-8',
            slug: 'iot-edge-computing',
            title: 'Cómputo en el borde con ESP32',
            excerpt: 'Procesamiento de datos en tiempo real en el borde, para IoT industrial.',
            content: 'Cómputo en el borde…',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-01-10',
            category: 'software-development',
            tags: ['IoT', 'ESP32', 'Borde'],
            author: { name: 'Atlas', avatar: '/brand/atlas-circle.png' },
            readTime: '6'
        },
        {
            id: 'blog-9',
            slug: 'ai-in-healthcare',
            title: 'Inteligencia artificial en salud',
            excerpt: 'Cómo la visión por computadora apoya el diagnóstico médico y el análisis de datos.',
            content: 'IA aplicada a la salud…',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-01-05',
            category: 'applied-ai',
            tags: ['Salud', 'IA', 'Ética'],
            author: { name: 'Atlas', avatar: '/brand/atlas-circle.png' },
            readTime: '7'
        },
        {
            id: 'blog-10',
            slug: 'the-architects-manifesto',
            title: 'Jardín digital: el manifiesto del estudio',
            excerpt: 'Cómo entendemos el oficio y la filosofía detrás de los sistemas que construimos.',
            content: 'Nuestro camino en la tecnología no ha sido solo código…',
            image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-03-31',
            category: 'about-me',
            tags: ['Filosofía', 'Ingeniería', 'El estudio'],
            author: { name: 'Atlas', avatar: '/brand/atlas-circle.png' },
            readTime: '5'
        }
    ],
    gallery: [
        {
            id: 'gal-1',
            title: 'Pieza 01',
            description: 'Imagen de respaldo de la galería.',
            date: '2025-01-20',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop&fm=webp',
            category: 'research'
        },
        {
            id: 'gal-2',
            title: 'Pieza 02',
            description: 'Imagen de respaldo de la galería.',
            date: '2024-12-15',
            type: 'video',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder video
            thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop&fm=webp',
            category: 'event'
        },
        {
            id: 'gal-3',
            title: 'Pieza 03',
            description: 'Imagen de respaldo de la galería.',
            date: '2024-11-30',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2000&auto=format&fit=crop&fm=webp',
            category: 'technical'
        },
        {
            id: 'gal-4',
            title: 'Pieza 04',
            description: 'Imagen de respaldo de la galería.',
            date: '2024-10-25',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=2000&auto=format&fit=crop&fm=webp',
            category: 'event'
        },
        {
            id: 'gal-5',
            title: 'Pieza 05',
            description: 'Imagen de respaldo de la galería.',
            date: '2024-09-15',
            type: 'video',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop&fm=webp',
            category: 'technical'
        }
    ],
};
