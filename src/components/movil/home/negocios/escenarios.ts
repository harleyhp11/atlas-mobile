import { SERVICIOS, whatsapp } from '../../datos';

/* (07) Tu negocio — los cinco escenarios del comparador antes/despues.

   OJO, son EJEMPLOS: muestran el cambio que hace cada servicio en un rubro
   tipico, no son clientes ni resultados medidos (el brief prohibe inventar
   cifras). Por eso la pildora de la tarjeta dice "ejemplo" y las cifras
   salen de lo que construimos, no de un caso:
     · 40 platos   → el plan de menus digitales incluye hasta 40 productos;
     · 24 h        → una web vende a toda hora; el local, en su horario;
     · 100 %       → con la app, las reservas no pasan por tu chat;
     · 5 s         → lo que tarda un asistente con IA en contestar;
     · 30 reportes → un panel que manda el reporte cada dia (antes, uno
                     por semana armado a mano en Excel).
   Los precios son los de SERVICIOS: si cambian alla, cambian aqui.

   Rubros variados a proposito: Atlas no es agencia de hoteles ni de
   restaurantes (brief), y cada escenario usa uno de los cinco servicios.

   Fotos: Directorio de Fotos de WordPress, licencia CC0 (uso comercial
   libre, sin atribucion obligatoria). Recortadas a 4:5 y en webp.
     · restaurante   — Preeti Shah        wordpress.org/photos/photo/712696f7c5/
     · turismo       — andyav             wordpress.org/photos/photo/66769cff70/
     · gimnasio      — Rashed Hossain     wordpress.org/photos/photo/7396a27d86/
     · inmobiliaria  — Hilaludin Wahid    wordpress.org/photos/photo/32463b780f/
     · distribuidora — allureconsulting   wordpress.org/photos/photo/4496439c89/ */

export type Cifra = { n: number; u?: string };

export type Escenario = {
    id: string;
    rubro: string;
    /** Lo que dice la pildora de la tarjeta: "Tu restaurante". */
    tuyo: string;
    servicio: string;
    precio: string;
    metrica: {
        antes: Cifra;
        despues: Cifra;
        /** Que se mide, en minusculas: va debajo de la cifra. */
        que: string;
        /** El resumen de la pildora: "0 → 40 platos". */
        chip: string;
    };
    /** El antes de este rubro. Cada uno tiene su propia escena animada
        (negocios/escenas.tsx); aqui va lo que dice la pildora de estado y
        el resumen para el lector de pantalla. */
    antes: { estado: string; resumen: string };
    /** El despues: su escena tambien es propia; aqui, solo el resumen. */
    despues: { resumen: string };
    titular: string;
    texto: string;
    incluye: string[];
    whatsapp: string;
    /** Linea del grafico de despues, en el viewBox 0 0 100 56: sube de
        izquierda a derecha y sale por el borde, por detras de la cifra. */
    linea: string;
};

const precio = (slug: string) => SERVICIOS.find((s) => s.slug === slug)?.precio ?? 'Se cotiza';

/* Curva suave (Catmull-Rom → Bezier) por siete alturas, de izquierda a
   derecha; en el viewBox, y chica = arriba. */
function curva(alturas: number[]) {
    const n = alturas.length;
    const p = alturas.map((y, i) => [(i / (n - 1)) * 102 - 1, y] as const);
    const f = (v: number) => v.toFixed(2);
    let d = `M${f(p[0][0])},${f(p[0][1])}`;
    for (let i = 0; i < n - 1; i++) {
        const p0 = p[i - 1] ?? p[i];
        const p1 = p[i];
        const p2 = p[i + 1];
        const p3 = p[i + 2] ?? p2;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(p2[0])},${f(p2[1])}`;
    }
    return d;
}

export const ESCENARIOS: Escenario[] = [
    {
        id: 'restaurante',
        rubro: 'Restaurante',
        tuyo: 'Tu restaurante',
        servicio: 'Menú digital',
        precio: precio('ecommerce'),
        metrica: { antes: { n: 0 }, despues: { n: 40 }, que: 'platos con foto y precio', chip: '0 → 40 platos' },
        antes: { estado: 'Tu carta: 12 fotos por chat', resumen: 'La carta va por chat, en 12 fotos sueltas.' },
        despues: { resumen: 'Carta digital por QR: el cliente arma su pedido y llega listo a tu WhatsApp.' },
        titular: 'Tu carta entera, a un toque de cada mesa.',
        texto: 'Carta digital con fotos y precios, código QR en las mesas y pedidos que llegan armados a tu WhatsApp.',
        incluye: ['Carta digital', 'QR en mesas', 'Pedidos a WhatsApp'],
        whatsapp: whatsapp('Hola Atlas 👋 Tengo un restaurante y quiero una carta digital con pedidos.'),
        linea: curva([48, 46, 40, 42, 30, 24, 12]),
    },
    {
        id: 'turismo',
        rubro: 'Turismo',
        tuyo: 'Tu agencia de turismo',
        servicio: 'Web con reservas',
        precio: precio('webs'),
        metrica: { antes: { n: 10, u: 'h' }, despues: { n: 24, u: 'h' }, que: 'al día vendiendo tours', chip: '10 h → 24 h' },
        antes: { estado: 'Te escribieron de Madrid · sin respuesta', resumen: 'Son las 3:12 a. m. en Lima: la agencia está cerrada mientras en Madrid y Tokio es de día.' },
        despues: { resumen: 'La web toma reservas en español e inglés a cualquier hora: Machu Picchu, 2 personas, confirmada a las 3:12 a. m.' },
        titular: 'Vende tus tours mientras duermes.',
        texto: 'Una web rápida, en español e inglés, con tus tours, fechas y precios. El turista reserva a la hora que sea, desde cualquier país.',
        incluye: ['Reservas en línea', 'Español e inglés', 'Lista para Google'],
        whatsapp: whatsapp('Hola Atlas 👋 Tengo una agencia de turismo y quiero una web con reservas.'),
        linea: curva([47, 44, 45, 34, 31, 20, 10]),
    },
    {
        id: 'gimnasio',
        rubro: 'Gimnasio',
        tuyo: 'Tu gimnasio',
        servicio: 'App para socios',
        precio: precio('apps'),
        metrica: { antes: { n: 0, u: '%' }, despues: { n: 100, u: '%' }, que: 'de reservas sin pasar por tu chat', chip: '0 % → 100 %' },
        antes: { estado: '3 pagos pendientes', resumen: 'Las reservas se anotan en una lista de papel y no se sabe quién pagó.' },
        despues: { resumen: 'En la app cada socio reserva su cupo y paga: la clase de spinning se llena sola.' },
        titular: 'Tus socios reservan, pagan y entrenan desde la app.',
        texto: 'Reservas de clases, pago de la membresía y asistencia en una app con tu marca. Tú lo ves todo en un panel, sin perseguir a nadie por chat.',
        incluye: ['Reservas', 'Pagos', 'Panel'],
        whatsapp: whatsapp('Hola Atlas 👋 Tengo un gimnasio y quiero una app para mis socios.'),
        linea: curva([49, 43, 44, 36, 26, 22, 11]),
    },
    {
        id: 'inmobiliaria',
        rubro: 'Inmobiliaria',
        tuyo: 'Tu inmobiliaria',
        servicio: 'Asistente con IA',
        precio: precio('ia'),
        metrica: { antes: { n: 3, u: 'h' }, despues: { n: 5, u: 's' }, que: 'para responder cada consulta', chip: '3 h → 5 s' },
        antes: { estado: 'Los respondes en 3 h', resumen: 'Se acumulan 27 mensajes sin leer de interesados en un departamento.' },
        despues: { resumen: 'El asistente con IA responde en segundos si tiene cochera y agenda la visita del sábado.' },
        titular: 'Cada consulta respondida, aunque estés en una visita.',
        texto: 'Un asistente con IA que responde precios, fotos y disponibilidad en segundos, agenda visitas y te pasa solo a los interesados de verdad.',
        incluye: ['Atiende 24/7', 'Agenda visitas', 'Filtra interesados'],
        whatsapp: whatsapp('Hola Atlas 👋 Tengo una inmobiliaria y quiero un asistente con IA.'),
        linea: curva([48, 47, 38, 40, 28, 18, 9]),
    },
    {
        id: 'distribuidora',
        rubro: 'Distribuidora',
        tuyo: 'Tu distribuidora',
        servicio: 'Sistema a medida',
        precio: precio('software'),
        metrica: { antes: { n: 4 }, despues: { n: 30 }, que: 'reportes al mes', chip: '4 → 30 reportes' },
        antes: { estado: 'Buscando el stock en el Excel…', resumen: 'El stock está en un Excel con errores: stock_final_v3.' },
        despues: { resumen: 'Un panel en vivo con ventas, pedidos y una alerta de stock bajo antes de que se acabe.' },
        titular: 'Tu negocio en un panel, en tiempo real.',
        texto: 'Pedidos, stock y cobranzas en un solo sistema hecho a tu medida. Los reportes se arman solos y las alertas llegan antes del problema.',
        incluye: ['Stock en vivo', 'Reportes automáticos', 'Alertas'],
        whatsapp: whatsapp('Hola Atlas 👋 Tengo una distribuidora y quiero un sistema a medida.'),
        linea: curva([46, 45, 41, 33, 34, 21, 12]),
    },
];

export const foto = (e: Escenario) => `/assets/movil/negocios/${e.id}.webp`;
export const miniatura = (e: Escenario) => `/assets/movil/negocios/${e.id}-mini.webp`;

/** "40", "24 h", "100 %": la cifra tal como se lee. */
export const cifra = (c: Cifra, n = c.n) => `${Math.round(n)}${c.u ? ` ${c.u}` : ''}`;

/** Se cuenta de una a otra cuando miden lo mismo; si no (3 h → 5 s), rueda. */
export const cuenta = (e: Escenario) => e.metrica.antes.u === e.metrica.despues.u;
