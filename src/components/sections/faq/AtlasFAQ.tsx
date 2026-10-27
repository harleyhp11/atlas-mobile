"use client";

/* =====================================================================
   ATLAS · PREGUNTAS

   Acordeon horizontal de seis paneles, replica de "(02) Services" de
   Reachwise (el code component RwServices de Framer): el 01 esta abierto de
   entrada, y el scroll abre el que toca cuando te detienes en la seccion
   (pasar de largo no cambia nada), sin fijarla. Tambien se abren con hover
   (140 ms de intencion), clic o teclado. Despues de un clic o un hover, el
   scroll no manda durante 4 s. Todo es transicion de CSS y un solo bucle de
   requestAnimationFrame compartido: ni Framer Motion ni GSAP.

   Lo que NO sigue a la referencia, a proposito:
     · la cabecera habla el idioma de las demas secciones de Atlas: etiqueta
       con las cuñas rojas y la palabra grande en la condensada con el
       degradado, como "Cómo / Trabajamos". El reveal por palabra si es el
       de la referencia;
     · la paleta es la monocroma de Atlas, con el rojo #E11D3A solo en las
       señales (puntos en vivo, avisos, el cabezal del cronograma);
     · las escenas de la izquierda son propias, una por pregunta
       (escenas.tsx), y los datos de Atlas que aparecen salen de los planes.

   Va con fondo claro FIJO, tambien en tema oscuro, igual que Testimonios:
   es la referencia, y en una pagina oscura funciona como una banda de papel.
   ===================================================================== */

import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import Link from "next/link";
import { Funnel_Display, Funnel_Sans, Geist_Mono } from "next/font/google";
import { EtiquetaSeccion } from "@/components/ui/etiqueta-seccion";
import { clamp01, tick, useInView, useIso, useMagnet, useReducedMotion, useVisible, useWidth } from "./hooks";
import { UiCotizador, UiCronograma, UiEtapas, UiNavegador, UiChat, UiPanel } from "./escenas";
import "./AtlasFAQ.css";

// Las tres familias de la referencia. Solo las usa esta seccion: el resto
// del sitio no las ve, y las variables se aplican en el <section>.
const funnelDisplay = Funnel_Display({ subsets: ["latin"], variable: "--font-funnel-display", display: "swap" });
const funnelSans = Funnel_Sans({ subsets: ["latin"], variable: "--font-funnel-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

/* ---------------- CONTENIDO ----------------
   Precios y plazos: los de las tarjetas de planes (plan-catalogo,
   github-showcase, kaggle-showcase, wakatime-showcase). Soporte, velocidad
   y respuesta en 24 h: lo que ya prometen "Cómo trabajamos" y el bloque
   "Construyamos lo que sigue". Si algo de eso cambia alla, cambia aqui. */

type Item = {
    slug: string;
    label: string;
    q: string;
    a: string;
    list: string[];
    stat: string;
    pie: [string, string];
    Ui: (p: { run: boolean }) => React.JSX.Element;
};

export const FAQ_ITEMS: Item[] = [
    {
        slug: "precios",
        label: "Precios",
        q: "¿Cuánto cuesta?",
        a: "Cada plan tiene un rango publicado, y antes de empezar te damos el monto final por escrito. Si tu proyecto no encaja en ninguno, lo cotizamos según el alcance real.",
        list: [
            "Tienda online o menú digital: S/ 400 – 1,200",
            "Landing page: S/ 600 – 1,500",
            "Web corporativa: S/ 900 – 2,500",
            "Software: propuesta tras la primera llamada",
        ],
        stat: "Precio cerrado por escrito",
        pie: ["Desde", "S/ 400"],
        Ui: UiCotizador,
    },
    {
        slug: "tiempos",
        label: "Tiempos",
        q: "¿Cuánto tarda?",
        a: "Depende del plan, pero la fecha de lanzamiento queda fijada desde la primera reunión. Las fechas que comprometemos son las que cumplimos.",
        list: ["Landing page: 7 – 10 días", "Web corporativa: 2 – 3 semanas", "Software a medida: desde 4 semanas", "Avances revisables en cada etapa"],
        stat: "Fecha de lanzamiento fija",
        pie: ["Desde", "7 días"],
        Ui: UiCronograma,
    },
    {
        slug: "proceso",
        label: "Proceso",
        q: "¿Cómo trabajamos?",
        a: "Cinco etapas, trato directo con quien diseña y programa, y tu aprobación en cada paso. Nada se publica sin que lo veas antes.",
        list: ["Descubrimiento y estrategia", "Diseño del prototipo en Figma", "Desarrollo y pruebas", "Lanzamiento y soporte"],
        stat: "5 etapas · sin intermediarios",
        pie: ["Primer paso", "Una llamada"],
        Ui: UiEtapas,
    },
    {
        slug: "tecnologia",
        label: "Tecnología",
        q: "¿Con qué lo construyen?",
        a: "Con código propio, sin plantillas recicladas ni constructores cerrados que te aten. React y Next.js para webs, y el stack que tu sistema necesite.",
        list: ["React y Next.js", "Diseño para móvil y escritorio", "SEO técnico y Search Console", "El código y el dominio son tuyos"],
        stat: "Carga en menos de 2 s",
        pie: ["Stack", "Next.js + React"],
        Ui: UiNavegador,
    },
    {
        slug: "soporte",
        label: "Soporte",
        q: "¿Y después del lanzamiento?",
        a: "No desaparecemos. Los primeros 30 días de soporte van incluidos, y te enseñamos a administrar tu web para que no dependas de nadie.",
        list: ["30 días de soporte incluidos", "Atención directa por WhatsApp", "Capacitación para editar tu web", "Analítica desde el lanzamiento"],
        stat: "Respuesta en menos de 24 h",
        pie: ["Incluido", "30 días"],
        Ui: UiChat,
    },
    {
        slug: "a-medida",
        label: "A medida",
        q: "¿Hacen sistemas y apps?",
        a: "Sí. Cuando ninguna plantilla se adapta a cómo trabajas, partimos de tu proceso real y construimos la herramienta alrededor de él.",
        list: ["Sistemas de reservas y pedidos", "Paneles y reportes", "Conexión con lo que ya usas", "Apps web y móviles"],
        stat: "Alcance cerrado por escrito",
        pie: ["Desde", "4 semanas"],
        Ui: UiPanel,
    },
];

// Ciclo de temas por indice, el del original (fog, ink, cloud, lime, pine,
// bone) con el lima cambiado por un gris perla.
const THEMES = ["fog", "ink", "cloud", "silver", "graphite", "paper"];
const DARK = new Set(["ink", "graphite"]);

const KICKER = ["Respuestas", "directas", "a", "tus"];
const INTRO = "Todo lo que nos preguntan antes de empezar: precios, tiempos, proceso y qué pasa después del lanzamiento.";
const HINT = "Haz scroll para cambiar de pregunta, o elige una";

/* ---------------- piezas ---------------- */

const reveal = (on: boolean, delay = 0, y = 22): CSSProperties => ({
    opacity: on ? 1 : 0,
    translate: on ? "0 0" : `0 ${y}px`,
    transition: `opacity .9s ease ${delay}ms, translate 1s cubic-bezier(.2,.8,.2,1) ${delay}ms`,
});

const Arrow = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 17L17 7M9 7h8v8" />
    </svg>
);

/* Boton pildora: relleno circular que nace a la derecha, etiqueta que rueda,
   flecha que sale en diagonal y entra otra, y atraccion magnetica. */
function Btn({ href, label, kind = "solid", sub }: { href: string; label: string; kind?: "solid" | "ghost"; sub?: string }) {
    return (
        <Link className={`afq-btn afq-btn--${kind}`} data-mag="" href={href} aria-label={sub ? `${label} sobre ${sub.toLowerCase()}` : undefined}>
            <span className="afq-btn-face">
                <span className="afq-btn-fill" aria-hidden="true" />
                <span className="afq-btn-lbl">
                    <span className="afq-btn-roll">
                        <span className="afq-btn-l1">{label}</span>
                        <span className="afq-btn-l2" aria-hidden="true">
                            {label}
                        </span>
                    </span>
                </span>
                <span className="afq-btn-arr" aria-hidden="true">
                    <span className="afq-btn-a1">
                        <Arrow />
                    </span>
                    <span className="afq-btn-a2">
                        <Arrow />
                    </span>
                </span>
            </span>
        </Link>
    );
}

/* ---------------- SECCION ---------------- */

export default function AtlasFAQ() {
    const items = FAQ_ITEMS;
    const N = items.length;
    const secRef = useRef<HTMLElement>(null);
    const accRef = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const W = useWidth(secRef);
    const isPh = W < 810;
    const isTab = W >= 810 && W < 1100;
    const isH = W >= 1240;
    const on = useInView(secRef, reduced);
    const vis = useVisible(secRef);
    useMagnet(secRef);

    const [open, setOpen] = useState(0);
    const openRef = useRef(0);
    const [prev, setPrev] = useState(-1);
    const go = useCallback(
        (i: number) => {
            if (i === openRef.current || i < 0 || i >= N) return;
            setPrev(openRef.current);
            openRef.current = i;
            setOpen(i);
        },
        [N]
    );
    const lockUntil = useRef(0); // mientras now < lockUntil, el scroll NO cambia el panel
    const kbMode = useRef(false); // con foco de teclado el bloqueo es indefinido

    // --ow (horizontal): ancho FIJO del contenido, para que no se reacomode
    // mientras el panel crece. --oh (vertical): alto del contenido mas alto,
    // para que la pagina no cambie de largo al abrir y cerrar.
    useIso(() => {
        const el = accRef.current;
        if (!el) return;
        const measure = () => {
            if (isH) {
                const cw = parseFloat(getComputedStyle(el).getPropertyValue("--cw")) || 92;
                el.style.setProperty("--ow", `${Math.max(320, el.clientWidth - (N - 1) * (cw + 8) - cw)}px`);
            } else {
                let h = 0;
                el.querySelectorAll<HTMLElement>(".afq-pin").forEach((p) => {
                    h = Math.max(h, p.scrollHeight);
                });
                if (h > 0) el.style.setProperty("--oh", `${Math.ceil(h)}px`);
            }
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        el.querySelectorAll(".afq-pin").forEach((p) => ro.observe(p));
        return () => ro.disconnect();
    }, [isH, N, W]);

    // SCROLL: p = (vh·0.72 − top) / (alto + vh·0.54), indice = floor(p·N).
    // A diferencia del original, el panel solo cambia cuando el scroll se
    // DETIENE con el acordeon a la vista: quien pasa de largo no dispara una
    // cadena de aperturas (cada una anima flex-grow y monta una escena), y el
    // panel abierto se queda como esta. Solo se engancha al reloj mientras el
    // acordeon esta a ±20% de la pantalla: esta home ya tiene bastante
    // (Three.js, GSAP, Lenis) como para sumarle un fotograma por nada.
    useEffect(() => {
        if (reduced || !accRef.current || N < 2) return;
        const el = accRef.current;
        const QUIETO_MS = 180; // tanto sin moverse cuenta como "me quedo aqui"
        const A_LA_VISTA = 0.45; // fraccion de la pantalla que debe ocupar
        let top = 0;
        let h = 1;
        let vh = 1;
        let topPrev = Infinity;
        let movio = 0;
        let resuelto = true; // ya se decidio el panel para esta parada
        let off: (() => void) | null = null;
        const leer = () => {
            const r = el.getBoundingClientRect();
            top = r.top;
            h = r.height;
            vh = innerHeight || 1;
        };
        const escribir = (ahora: number) => {
            if (Math.abs(top - topPrev) > 0.5) {
                topPrev = top;
                movio = ahora;
                resuelto = false;
                return;
            }
            if (resuelto || ahora - movio < QUIETO_MS) return;
            resuelto = true;
            const visible = Math.min(vh, top + h) - Math.max(0, top);
            if (visible < vh * A_LA_VISTA || performance.now() <= lockUntil.current) return;
            const p = clamp01((vh * 0.72 - top) / (h + vh * 0.54));
            go(Math.min(N - 1, Math.floor(p * N)));
        };
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) off ??= tick(escribir, leer);
                else if (off) {
                    off();
                    off = null;
                }
            },
            { rootMargin: "20% 0px 20% 0px" }
        );
        io.observe(el);
        return () => {
            off?.();
            io.disconnect();
        };
    }, [reduced, N, go]);

    const pick = (i: number, ms = 4000) => {
        lockUntil.current = kbMode.current ? Infinity : performance.now() + ms;
        go(i);
    };
    const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
        const k = e.key;
        let n = -1;
        if (k === "ArrowRight" || k === "ArrowDown") n = (i + 1) % N;
        else if (k === "ArrowLeft" || k === "ArrowUp") n = (i - 1 + N) % N;
        else if (k === "Home") n = 0;
        else if (k === "End") n = N - 1;
        if (n < 0) return;
        e.preventDefault();
        pick(n);
        accRef.current?.querySelectorAll<HTMLButtonElement>(".afq-sp")[n]?.focus();
    };

    // HOVER CON INTENCION (solo raton y modo horizontal): abre el panel tras
    // 140 ms de movimiento real encima. Salir del acordeon lo cancela.
    const finePtr = useRef(false);
    useEffect(() => {
        finePtr.current = matchMedia("(hover:hover) and (pointer:fine)").matches;
    }, []);
    const hoverT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const hoverI = useRef(-1);
    const onMove = (e: PointerEvent<HTMLDivElement>, i: number) => {
        if (!finePtr.current || !isH || (!e.movementX && !e.movementY)) return;
        kbMode.current = false;
        lockUntil.current = performance.now() + 4000;
        if (i === openRef.current) {
            hoverI.current = i;
            clearTimeout(hoverT.current);
            return;
        }
        if (hoverI.current !== i) {
            hoverI.current = i;
            clearTimeout(hoverT.current);
            hoverT.current = setTimeout(() => {
                if (hoverI.current === i) go(i);
            }, 140);
        }
    };
    const onLeave = () => {
        clearTimeout(hoverT.current);
        hoverI.current = -1;
    };

    // Paneles cerrados = inert: ni se tabulan ni los lee un lector de pantalla.
    useEffect(() => {
        accRef.current?.querySelectorAll<HTMLElement>(".afq-pc").forEach((c, i) => {
            c.inert = i !== open;
        });
    }, [open, N, isH]);

    const kickerDelay = (i: number) => 80 + i * 55;

    return (
        <section
            ref={secRef}
            id="preguntas"
            className={`afq ${funnelDisplay.variable} ${funnelSans.variable} ${geistMono.variable} ${isH ? "is-h" : "is-v"}${isPh ? " is-ph" : isTab ? " is-tab" : ""}${on ? " is-on" : ""}${reduced ? " is-fin" : ""}`}
        >
            <div className="afq-wrap">
                <header className="afq-head">
                    <div className="afq-hl">
                        <div className={`afq-eb${on ? " is-on" : ""}`}>
                            <EtiquetaSeccion codigo="Atlas® — Preguntas" texto={String(N).padStart(2, "0")} sobreClaro />
                        </div>
                        <h2 className={`afq-hd${on ? " is-on" : ""}`} aria-label="Respuestas directas a tus preguntas">
                            <span className="afq-hd-l afq-hd-k" aria-hidden="true">
                                {KICKER.map((w, i) => (
                                    <Fragment key={i}>
                                        <span className="afq-hd-w">
                                            <span className="afq-hd-i" style={{ transitionDelay: `${kickerDelay(i)}ms` }}>
                                                {w}
                                            </span>
                                        </span>{" "}
                                    </Fragment>
                                ))}
                            </span>
                            <span className="afq-hd-l" aria-hidden="true">
                                <span className="afq-hd-w">
                                    <span className="afq-hd-i afq-hd-g" style={{ transitionDelay: `${kickerDelay(KICKER.length)}ms` }}>
                                        Preguntas
                                    </span>
                                </span>
                            </span>
                        </h2>
                    </div>
                    <div className="afq-hr" style={reveal(on, 300, 14)}>
                        <p>{INTRO}</p>
                        <Btn href="/contact" label="Agenda una llamada" kind="ghost" />
                    </div>
                </header>

                <div ref={accRef} className="afq-acc" style={reveal(on, 380, 28)} onPointerLeave={onLeave}>
                    {items.map((it, i) => {
                        const isOpen = i === open;
                        const theme = THEMES[i % THEMES.length];
                        const dk = DARK.has(theme);
                        const id = `afq-${it.slug}`;
                        // Solo se monta la escena del abierto y la del que se esta cerrando.
                        const mount = isOpen || i === prev;
                        const Ui = it.Ui;
                        return (
                            <div
                                key={it.slug}
                                className={`afq-p t-${theme}${dk ? " is-dk" : ""}${isOpen ? " is-open" : ""}`}
                                onPointerMove={(e) => onMove(e, i)}
                            >
                                <button
                                    type="button"
                                    className="afq-sp"
                                    id={`${id}-b`}
                                    aria-expanded={isOpen}
                                    aria-controls={`${id}-c`}
                                    onClick={() => pick(i)}
                                    onKeyDown={(e) => onKey(e, i)}
                                    onFocus={(e) => {
                                        if (e.currentTarget.matches(":focus-visible")) {
                                            kbMode.current = true;
                                            lockUntil.current = Infinity;
                                        }
                                    }}
                                >
                                    <span className="afq-num">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="afq-vt">{isH ? it.label : it.q}</span>
                                    <span className="afq-plus" aria-hidden="true">
                                        <i />
                                        <i />
                                    </span>
                                </button>
                                <div className="afq-pc" id={`${id}-c`} role="region" aria-labelledby={`${id}-b`}>
                                    <div className="afq-pin">
                                        {/* La escena es ilustracion: lo que dice ya esta en el texto de al lado. */}
                                        <div className="afq-stage" aria-hidden="true">
                                            {mount && <Ui key={isOpen ? `o${open}` : `c${i}`} run={isOpen && on && vis && !reduced} />}
                                        </div>
                                        <div className="afq-tx">
                                            {isH && <h3 className="afq-tt">{it.q}</h3>}
                                            <p className="afq-body">{it.a}</p>
                                            <div className="afq-inc">
                                                <p className="afq-il">En corto</p>
                                                <ul>
                                                    {it.list.map((l) => (
                                                        <li key={l}>{l}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="afq-foot">
                                                <span className="afq-stat">
                                                    <i />
                                                    {it.stat}
                                                </span>
                                                <span className="afq-pr">
                                                    <small>{it.pie[0]}</small>
                                                    {it.pie[1]}
                                                </span>
                                                <Btn href="/contact" label="Hablemos" kind="solid" sub={it.label} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="afq-rail" style={reveal(on, 520, 10)} aria-hidden="true">
                    <span className="afq-seg">
                        {items.map((_, i) => (
                            <i key={i} className={i === open ? "is-on" : i < open ? "is-past" : undefined} />
                        ))}
                    </span>
                    <span className="afq-now">
                        <b>
                            {String(open + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                        </b>
                        {items[open]?.label}
                    </span>
                    <span className="afq-hint">
                        <i />
                        {HINT}
                    </span>
                </div>
            </div>
        </section>
    );
}
