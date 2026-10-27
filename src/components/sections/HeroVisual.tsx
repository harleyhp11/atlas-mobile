"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Instagram, Linkedin, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────── AJUSTES ───────────────────────────
   Todo lo que se toca a mano vive aqui arriba.                     */

const VIDEO_SRC = "/assets/hero-bg.mp4";
const VIDEO_POSTER = "/assets/hero-bg.webp";

/* Cupos del mes. El numero escrito y las barritas salen los dos de aqui:
   LIBRES se muestra como texto y OCUPADOS = TOTAL - LIBRES se pinta en
   blanco, asi no hay forma de que se contradigan. */
const CUPOS_TOTAL = 5;
const CUPOS_LIBRES = 3;

/* {{MES}} — escrito a mano y no calculado con `new Date()` a proposito: el
   servidor y el navegador pueden estar en husos distintos y Next avisaria de
   un desajuste de hidratacion justo en el primer render de la pagina. */
const MES = "Septiembre";

const SERVICIOS = [
    "Diseño & desarrollo web",
    "Software a medida",
    "Apps & e-commerce",
];

/* Grano que hierve dentro de las letras. baseFrequency sube el detalle;
   GRANO_FUERZA es cuanto oscurecen las motas (0 = sin grano). */
const GRANO_FREQ = 0.9;
const GRANO_FUERZA = 0.55;
const GRANO_CICLO_S = 1.6; // cada cuanto se recicla la semilla

/* Parpadeo del titular. Ciclo largo y saltos duros en instantes irregulares:
   con tiempos regulares se leeria como animacion, no como fallo de luz. */
const PARPADEO_S = 7;
const PARPADEO_MIN = 0.55;

/* Fallo al pasar el puntero: la palabra se parte en franjas horizontales
   que saltan a los lados con tirones secos y vuelve a su sitio. Una sola vez
   por entrada, no en bucle: es un tiron, no un estado.
   Rendimiento: las franjas estan siempre montadas pero con display:none (no
   cuestan nada); al entrar se muestran con un atributo y se animan con la
   Web Animations API solo en transform, que el navegador mueve en la GPU sin
   tocar el layout ni volver a renderizar React. */
const CORTE_MS = 320;       // lo que dura el fallo
const CORTE_PAUSA_MS = 300; // minimo entre dos fallos seguidos
const CORTE_SALTO = 0.16;   // desvio maximo de una franja, en em
/* Franjas [arriba %, abajo %] que cubren la palabra entera. Alturas
   desiguales a proposito: con franjas iguales se lee como una persiana. */
const FRANJAS: [number, number][] = [
    [0, 15], [15, 31], [31, 45], [45, 56], [56, 73], [73, 86], [86, 100],
];
/* Instantes (0–1) de los tirones; en el ultimo todo ya esta en su sitio. */
const CORTE_TRAMOS = [0, 0.18, 0.36, 0.55, 0.72];

/* Entrada: barrido de abajo hacia arriba. */
const ENTRADA_S = 0.9;

/* Las tres caras del titular. Cada palabra lleva SU firma: la manuscrita no
   es un adorno fijo, es el remate de la palabra que tiene debajo, asi que
   cambiar una sin la otra dejaria frases sin sentido ("apps que convierten"
   no dice lo mismo).
   El ® solo lo lleva "atlas": es la marca, no las otras dos.
   Arranca en atlas a proposito —es lo que pinta el servidor y lo primero que
   ve quien entra— y de ahi rota. */
const PALABRAS = [
    { palabra: "atlas", firma: "webs que convierten.", marca: true },
    { palabra: "webs", firma: "que trabajan por ti.", marca: false },
    { palabra: "apps", firma: "que la gente usa.", marca: false },
];
const ROTACION_MS = 3000;

const PARRAFO =
    "Diseñamos y desarrollamos webs, apps y software a medida para marcas que quieren crecer, estén donde estén.";

/* Intensidad del video que se cuela por dentro de las letras. 0 = letras
   blancas planas, 1 = las letras desaparecen dentro del video. */
const VIDEO_EN_LETRAS = 0.3;

/* {{RESENAS}} — PLACEHOLDER. Estos numeros NO son de Atlas: estan puestos
   para que el bloque tenga el peso visual de la referencia. Reemplazalos por
   datos reales o quita el bloque antes de publicar.

   Los circulos llevan INICIALES, como el avatar de un correo sin foto. No
   van rostros de gente real: al lado de "361 reseñas" se leerian como
   clientes, y no lo son. Cuando haya reseñas de verdad, aqui van las
   iniciales (o la foto, con permiso) de quienes las dejaron.
   Colores: grises de la paleta de Atlas y un solo rojo. */
const RESENAS = {
    nota: "4.9/5",
    detalle: "Basado en 361 reseñas",
    clientes: "80+",
    iniciales: [
        { letra: "M", fondo: "#E11D3A", tinta: "#FFFFFF" },
        { letra: "J", fondo: "#D9D9D5", tinta: "#0B0B0C" },
        { letra: "C", fondo: "#3A3A3E", tinta: "#FFFFFF" },
        { letra: "A", fondo: "#F2F2EF", tinta: "#0B0B0C" },
    ],
};

/* Cinta inferior. Son logos de TECNOLOGIA, no de clientes: Atlas si trabaja
   con estas herramientas, asi que la franja es cierta. Vienen de simpleicons
   pidiendo el color en la ruta —por eso salen blancos sin filtros— pero estan
   DESCARGADOS al proyecto: el hero no deberia depender de un CDN ajeno para
   pintar lo primero que se ve. */
const CINTA_LOGOS = [
    { slug: "nextdotjs", nombre: "Next.js" },
    { slug: "react", nombre: "React" },
    { slug: "typescript", nombre: "TypeScript" },
    { slug: "tailwindcss", nombre: "Tailwind" },
    { slug: "nodedotjs", nombre: "Node.js" },
    { slug: "figma", nombre: "Figma" },
    { slug: "vercel", nombre: "Vercel" },
    { slug: "shopify", nombre: "Shopify" },
    { slug: "wordpress", nombre: "WordPress" },
    { slug: "webflow", nombre: "Webflow" },
];
const CINTA_S = 38; // segundos por vuelta completa

const CTA_TEXTO = "Empezar un proyecto";
const CTA_HREF = "/contact";

/* ──────────────────────────── iconos ────────────────────────────
   Behance y X no existen en lucide-react, asi que van como SVG inline.
   Instagram y LinkedIn si vienen de lucide, para no duplicar trazados. */

const IconoBehance = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M8.2 10.4H4.6V7.6h3.5c.9 0 1.5.5 1.5 1.4 0 .9-.6 1.4-1.4 1.4Zm.3 2.2H4.6v3.1h3.8c1 0 1.7-.6 1.7-1.6 0-1-.7-1.5-1.6-1.5ZM2 5.5h6.7c2.3 0 3.9 1.1 3.9 3.1 0 1.2-.6 2.1-1.6 2.6 1.4.4 2.2 1.5 2.2 3 0 2.3-1.8 3.6-4.3 3.6H2V5.5Zm16.3 4.1c-2.6 0-4.4 1.9-4.4 4.5s1.7 4.5 4.5 4.5c2.1 0 3.6-1 4.1-2.7h-2.3c-.3.6-.9.9-1.7.9-1.1 0-1.9-.7-2.1-1.9H23c.3-3-1.3-5.3-4.7-5.3Zm-1.9 3.6c.2-1.1.9-1.8 1.9-1.8s1.8.7 1.9 1.8h-3.8ZM15.1 6.6h5.6v1.5h-5.6V6.6Z" />
    </svg>
);

const IconoX = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.3l-4.9-6.4L4.9 21H1.8l7.3-8.3L2.5 3h6.4l4.4 5.9L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3Z" />
    </svg>
);

const REDES = [
    // {{REDES}} — href a la espera de los perfiles reales de Atlas.
    { nombre: "Instagram", Icono: Instagram, href: "#" },
    { nombre: "LinkedIn", Icono: Linkedin, href: "#" },
    { nombre: "Behance", Icono: IconoBehance, href: "#" },
    { nombre: "X", Icono: IconoX, href: "#" },
];

/* Espejo del video en un <canvas>.
   Un <video> se compone en un plano de hardware y ahi mix-blend-mode no le
   aplica: lo comprobe con multiply sobre el h1, con el video encima y con un
   filtro para sacarlo del plano, y ninguno mezclaba. Un <div> con imagen en
   el mismo sitio si mezclaba, lo que confirmo la causa.
   Un canvas si participa en la mezcla, asi que copio en el cada frame del
   MISMO video de fondo —sin segunda descarga ni segunda decodificacion— y el
   canvas es el que se multiplica sobre las letras.
   Tamano inicial nada mas: en el primer frame el canvas toma la resolucion
   real de su rectangulo (ver pintar). Con la resolucion baja de antes la
   copia salia borrosa y fuera de las letras se veia un panel de "vidrio". */
const CANVAS_W = 960;
const CANVAS_H = 320;

/* Dibuja en el canvas el texto de `el` en el mismo sitio y tamano que en la
   pagina (coordenadas CSS; la transformacion del contexto hace el resto).
   Mide cada nodo de texto con un Range, que ya incluye los transform de la
   animacion de relevo, y escala el trazo para que encaje exacto con lo que
   pinto el navegador. */
function siluetaTexto(ctx: CanvasRenderingContext2D, el: Element) {
    const nodos = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const rango = document.createRange();
    ctx.fillStyle = "#000";
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    for (let n = nodos.nextNode(); n; n = nodos.nextNode()) {
        const padre = n.parentElement;
        const texto = n.textContent ?? "";
        if (!padre || !texto.trim()) continue;
        rango.selectNodeContents(n);
        const r = rango.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        const cs = getComputedStyle(padre);
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        ctx.letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
        const t = cs.textTransform === "lowercase" ? texto.toLowerCase() : texto;
        const m = ctx.measureText(t);
        const alto = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
        if (!m.width || !alto) continue;
        const sy = r.height / alto;
        ctx.save();
        ctx.translate(r.left, r.top + m.fontBoundingBoxAscent * sy);
        ctx.scale(r.width / m.width, sy);
        ctx.fillText(t, 0, 0);
        ctx.restore();
    }
    ctx.letterSpacing = "0px";
}

function EspejoVideo({ fuente }: { fuente: React.RefObject<HTMLVideoElement | null> }) {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const c = canvas.current;
        if (!c) return;
        const ctx = c.getContext("2d");
        if (!ctx) return;

        let raf = 0;
        let enPantalla = true;

        const pintar = () => {
            const v = fuente.current;
            if (v && v.readyState >= 2 && !document.hidden && enPantalla) {
                /* La copia va ALINEADA con el video de fondo: mismo recorte
                   object-cover sobre toda la seccion y misma posicion, solo
                   que vista a traves del rectangulo del titular. Antes se
                   recortaba a la medida del titular, quedaba a otra escala y
                   fuera de las letras se veia un rectangulo con el video
                   doble: el "panel" que enmarcaba el titulo. Alineada, fuera
                   de las letras coincide con el fondo y no se nota. */
                const V = v.getBoundingClientRect();
                const C = c.getBoundingClientRect();
                if (V.width && C.width) {
                    /* Resolucion REAL del rectangulo (hasta 2x en retina). A
                       960x320 estirado, la copia salia borrosa y se leia como
                       un panel de vidrio esmerilado sobre el fondo nitido. */
                    const dpr = Math.min(2, window.devicePixelRatio || 1);
                    const W = Math.round(C.width * dpr);
                    const H = Math.round(C.height * dpr);
                    if (c.width !== W || c.height !== H) {
                        c.width = W;
                        c.height = H;
                    }
                    const kx = W / C.width;
                    const ky = H / C.height;
                    const e = Math.max(V.width / v.videoWidth, V.height / v.videoHeight);
                    const w = v.videoWidth * e;
                    const h = v.videoHeight * e;
                    const ox = V.left + (V.width - w) / 2 - C.left;
                    const oy = V.top + (V.height - h) / 2 - C.top;
                    /* El video va SOLO dentro de las letras. Primero se
                       dibujan las letras (todas juntas, "®" incluido) y despues
                       el video en modo source-in, que solo pinta donde ya hay
                       letra. Fuera de ellas el canvas queda transparente: al
                       30% sobre todo el rectangulo se leia como un panel de
                       vidrio. Ojo con el orden: recortar letra por letra con
                       destination-in hacia que el "®" borrase la palabra
                       entera, y "atlas" salia sin teñir, blanco puro. */
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.globalCompositeOperation = "source-over";
                    ctx.clearRect(0, 0, W, H);
                    const palabra = c.parentElement?.querySelector(".hero-atlas .hero-palabra");
                    if (palabra) {
                        // Sigue la opacidad de la palabra (relevo y parpadeo):
                        // si no, la silueta teñida se adelantaria a las letras.
                        const h1 = palabra.closest(".hero-atlas");
                        // Durante el fallo la base se oculta (visibility) y las
                        // que se ven son las franjas: sin tinte, o quedaria la
                        // silueta quieta debajo de las franjas que saltan.
                        const h1Estilo = h1 ? getComputedStyle(h1) : null;
                        ctx.globalAlpha =
                            parseFloat(getComputedStyle(palabra).opacity) *
                            (h1Estilo ? parseFloat(h1Estilo.opacity) : 1) *
                            (h1Estilo?.visibility === "hidden" ? 0 : 1);
                        ctx.setTransform(kx, 0, 0, ky, -C.left * kx, -C.top * ky);
                        siluetaTexto(ctx, palabra);
                        ctx.globalAlpha = 1;

                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        ctx.globalCompositeOperation = "source-in";
                        ctx.drawImage(v, ox * kx, oy * ky, w * kx, h * ky);

                        // La misma viñeta que oscurece el fondo (ver [0] mas
                        // abajo), o las letras de los bordes saldrian mas claras.
                        ctx.globalCompositeOperation = "source-atop";
                        ctx.setTransform(
                            V.width * 1.35 * kx, 0, 0, V.height * 0.95 * ky,
                            (V.left + V.width * 0.5 - C.left) * kx,
                            (V.top + V.height * 0.42 - C.top) * ky
                        );
                        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
                        g.addColorStop(0, "rgba(0,0,0,0)");
                        g.addColorStop(0.6, "rgba(0,0,0,0.12)");
                        g.addColorStop(1, "rgba(0,0,0,0.55)");
                        ctx.fillStyle = g;
                        ctx.fillRect(-2, -2, 4, 4);
                        ctx.globalCompositeOperation = "source-over";
                    }
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
            }
            raf = requestAnimationFrame(pintar);
        };
        raf = requestAnimationFrame(pintar);

        const io = new IntersectionObserver(([e]) => { enPantalla = e.isIntersecting; });
        io.observe(c);

        return () => { cancelAnimationFrame(raf); io.disconnect(); };
    }, [fuente]);

    return (
        <canvas
            ref={canvas}
            width={CANVAS_W}
            height={CANVAS_H}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply"
            style={{ opacity: VIDEO_EN_LETRAS }}
        />
    );
}

/* Cinta de logos en bucle. Dos copias seguidas y un desplazamiento del 50%:
   al terminar, la segunda copia esta exactamente donde arrancaba la primera,
   asi que el salto no se ve. CSS puro, sin JS por frame. */
function CintaLogos() {
    const fila = (clave: string) => (
        <div className="flex shrink-0 items-center" key={clave}>
            {CINTA_LOGOS.map(({ slug, nombre }) => (
                <span
                    key={`${clave}-${slug}`}
                    className="mx-7 flex shrink-0 items-center gap-2.5 opacity-50"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`/assets/logos/${slug}.svg`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="h-[18px] w-auto shrink-0"
                    />
                    <span className="whitespace-nowrap text-[13px] font-medium tracking-[-0.01em] text-white">
                        {nombre}
                    </span>
                </span>
            ))}
        </div>
    );

    return (
        <div className="hero-cinta relative flex overflow-hidden">
            {/* Animacion y ancho en linea: por styled-jsx la duracion se
                quedaba en 0s y el w-max no aplicaba, asi que la cinta no se
                movia. Los keyframes si viven en la hoja. */}
            <div
                className="flex items-center"
                style={{
                    width: "max-content",
                    animation: `heroCinta ${CINTA_S}s linear infinite`,
                }}
            >
                {fila("a")}
                {fila("b")}
            </div>
        </div>
    );
}

/* La base y las franjas del fallo comparten este objeto: si divergen, las
   franjas no calzan con la palabra y se ve texto mal superpuesto. */
const ESTILO_TITULO: React.CSSProperties = {
    fontSize: "clamp(64px, min(39.5vw, 58vh), 660px)",
    letterSpacing: "-0.045em",
    lineHeight: 0.85,
};

/* ──────────────────────────── componente ──────────────────────────── */

export function HeroVisual({ isExiting = false }: { isExiting?: boolean }) {
    const video = useRef<HTMLVideoElement>(null);
    const ocupados = Math.max(0, CUPOS_TOTAL - CUPOS_LIBRES);

    /* El efecto solo existe si hay un puntero fino y el usuario no ha pedido
       menos movimiento. Arranca en false para que servidor y cliente pinten
       lo mismo y no haya aviso de hidratacion; se decide ya montado. */
    const [efectoActivo, setEfectoActivo] = useState(false);
    const [indice, setIndice] = useState(0);
    const pausado = useRef(false);
    const titular = useRef<HTMLDivElement>(null);
    const franjas = useRef<(HTMLSpanElement | null)[]>([]);
    const ecoCorte = useRef<HTMLSpanElement>(null);
    const ultimoCorte = useRef(0);

    useEffect(() => {
        const fino = window.matchMedia("(pointer: fine)").matches;
        const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setEfectoActivo(fino && !quieto);
    }, []);

    /* Rotacion del titular. Dos frenos:
         - Con prefers-reduced-motion no arranca siquiera. Un titular que se
           reescribe solo es contenido que cambia sin que nadie lo pida, y ahi
           es donde molesta de verdad.
         - Se para mientras el puntero esta encima. Si alguien se ha quedado
           leyendo la firma, cambiarsela debajo es lo peor que se puede hacer. */
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const id = setInterval(() => {
            if (pausado.current) return;
            setIndice((i) => (i + 1) % PALABRAS.length);
        }, ROTACION_MS);
        return () => clearInterval(id);
    }, []);

    const entrar = () => {
        /* Antes del guard a proposito: la pausa debe valer aunque el fallo
           este apagado (tactil, o movimiento reducido). */
        pausado.current = true;
        if (!efectoActivo) return;
        const ahora = performance.now();
        const t = titular.current;
        if (!t || ahora - ultimoCorte.current < CORTE_MS + CORTE_PAUSA_MS) return;
        ultimoCorte.current = ahora;

        // Paso seco entre tramos: steps(1) en cada keyframe. Algunos tramos
        // se quedan en su sitio para que no se lea como un temblor parejo.
        const seco = "steps(1, end)";
        const tramos = (salto: () => number) => [
            ...CORTE_TRAMOS.map((offset) => ({
                transform: `translate3d(${salto().toFixed(3)}em,0,0)`,
                offset,
                easing: seco,
            })),
            { transform: "translate3d(0,0,0)", offset: 0.86, easing: seco },
            { transform: "translate3d(0,0,0)", offset: 1 },
        ];
        const azar = () => (Math.random() < 0.22 ? 0 : (Math.random() * 2 - 1) * CORTE_SALTO);

        t.dataset.corte = "";
        const animaciones = franjas.current
            .filter((el): el is HTMLSpanElement => !!el)
            .map((el) => el.animate(tramos(azar), { duration: CORTE_MS, fill: "both" }));
        // La copia apagada: solo en horizontal y corta, para que no se lea
        // como profundidad.
        if (ecoCorte.current) {
            animaciones.push(
                ecoCorte.current.animate(
                    [
                        { transform: "translate3d(0.07em,0,0)", opacity: 0.22, offset: 0, easing: seco },
                        { transform: "translate3d(-0.05em,0,0)", opacity: 0.16, offset: 0.3, easing: seco },
                        { transform: "translate3d(0,0,0)", opacity: 0, offset: 0.6 },
                        { transform: "translate3d(0,0,0)", opacity: 0, offset: 1 },
                    ],
                    { duration: CORTE_MS, fill: "both" }
                )
            );
        }
        Promise.all(animaciones.map((a) => a.finished))
            .catch(() => {})
            .finally(() => {
                delete t.dataset.corte;
                animaciones.forEach((a) => a.cancel());
            });
    };

    const salir = () => {
        pausado.current = false;
    };

    useEffect(() => {
        const v = video.current;
        if (!v) return;
        /* El navegador pausa el video al ocultar la pestaña y no siempre lo
           reanuda solo. Sin esto el fondo se queda congelado al volver. */
        const reanudar = () => {
            if (!document.hidden) v.play().catch(() => {});
        };
        document.addEventListener("visibilitychange", reanudar);
        return () => document.removeEventListener("visibilitychange", reanudar);
    }, []);

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            {/* [0] VIDEO DE FONDO */}
            <video
                ref={video}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={VIDEO_POSTER}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
            >
                <source src={VIDEO_SRC} type="video/mp4" />
            </video>

            {/* Viñeta: oscurece bordes para que el texto lea. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(135% 95% at 50% 42%, transparent 0%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0.55) 100%)",
                }}
            />

            {/* Grano de pelicula sobre toda la seccion. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
                }}
            />

            {/* [1] REJILLA — retirada a pedido de Harley: las dos verticales,
                las dos horizontales que cerraban la banda del titular y las
                marcas de encuadre de los cruces formaban un marco casi
                invisible alrededor del titulo. Las columnas siguen alineadas
                a tercios; solo dejaron de dibujarse las lineas. */}

            {/* ─────────────── contenido ─────────────── */}
            {/* Sin z-index a proposito: un `z-*` aqui convertiria este div en
                contexto de apilamiento y el mix-blend del titular dejaria de
                ver el video, que quedaria fuera del contexto. El orden de
                pintado ya lo da el orden del DOM. */}
            <div className="relative flex min-h-screen flex-col px-8 lg:px-12">

                {/* [2] BARRA SUPERIOR */}
                <div className="flex items-center justify-between pt-28 text-[11px] uppercase tracking-[0.08em] text-white/45">
                    <span>2026©</span>
                    <span className="flex items-center gap-3">
                        <span>Proyectos para {MES}</span>
                        <span className="flex items-center gap-1">
                            {Array.from({ length: CUPOS_TOTAL }).map((_, i) => (
                                /* Las ocupadas en rojo de marca y no en blanco:
                                   sobre una fila donde TODO es blanco al 45%, el
                                   blanco pleno no distinguia ocupado de libre a
                                   simple vista. El color hace el trabajo que el
                                   contraste no podia. */
                                <span
                                    key={i}
                                    className="h-[10px] w-[2px]"
                                    style={
                                        i < ocupados
                                            ? { background: "var(--hero-accent, #E11D3A)" }
                                            : { background: "rgba(255,255,255,0.2)" }
                                    }
                                />
                            ))}
                        </span>
                        <span>{CUPOS_LIBRES} cupos</span>
                    </span>
                </div>

                {/* [3] SERVICIOS */}
                <div className="mt-6 grid grid-cols-3 pb-5 text-[11px] uppercase tracking-[0.08em] lg:text-[12px]">
                    {SERVICIOS.map((s, i) => (
                        <span key={s} className={i === 0 ? "" : "pl-6"}>
                            <span className="text-white/40">
                                {String(i + 1).padStart(2, "0")}.
                            </span>{" "}
                            <span className="text-white">{s}</span>
                        </span>
                    ))}
                </div>

                {/* [4] TITULAR + [5] FIRMA
                    El video se mete DENTRO de las letras: encima del texto va
                    un canvas que copia el video y se multiplica —blanco x
                    video = video, negro x video = negro—, asi los remolinos
                    cruzan las letras y el fondo no cambia. `isolate` acota la
                    mezcla a este bloque.
                    El tamaño va en vw porque la palabra tiene que llegar casi
                    de borde a borde, y 5 letras a 260px no llegan. El min()
                    con vh es el freno: en pantallas anchas y bajas el titular
                    se comia el CTA y el pie. Y el pt-28 de la barra superior
                    no es decorativo: el nav flotante ocupa los primeros 100px
                    y con menos margen se solapaban. */}
                <div
                    ref={titular}
                    onPointerEnter={entrar}
                    onPointerLeave={salir}
                    className="hero-titular relative isolate"
                >
                    {/* Base y franjas del fallo en el mismo apilado. Mientras
                        dura el fallo la base se oculta y lo que se ve son las
                        franjas, que juntas forman la palabra entera. */}
                    <div className="relative">
                        <h1
                            className="hero-atlas select-text text-center font-sans font-black lowercase"
                            style={ESTILO_TITULO}
                        >
                            {/* El key fuerza el remontaje en cada cambio, que
                                es lo que vuelve a disparar la animacion de
                                entrada. Sin el, React reusa el nodo, solo
                                cambia el texto y la palabra aparece de golpe. */}
                            <span key={indice} className="hero-palabra inline-block">
                                {PALABRAS[indice].palabra}
                                {PALABRAS[indice].marca && (
                                    <sup className="align-super text-[0.16em] font-bold tracking-normal">
                                        ®
                                    </sup>
                                )}
                            </span>
                        </h1>

                        {efectoActivo && (
                            <>
                                {/* Copia entera y apagada: el doble contorno
                                    que deja el fallo en la referencia. */}
                                <span
                                    ref={ecoCorte}
                                    aria-hidden="true"
                                    className="hero-corte pointer-events-none absolute inset-0 text-center font-sans font-black lowercase"
                                    style={ESTILO_TITULO}
                                >
                                    {PALABRAS[indice].palabra}
                                    {PALABRAS[indice].marca && (
                                        <sup className="align-super text-[0.16em] font-bold tracking-normal">®</sup>
                                    )}
                                </span>
                                {FRANJAS.map(([a, b], i) => (
                                    <span
                                        key={i}
                                        ref={(el) => {
                                            franjas.current[i] = el;
                                        }}
                                        aria-hidden="true"
                                        className="hero-corte pointer-events-none absolute inset-0 text-center font-sans font-black lowercase"
                                        style={{ ...ESTILO_TITULO, clipPath: `inset(${a}% 0 ${100 - b}% 0)` }}
                                    >
                                        {PALABRAS[indice].palabra}
                                        {PALABRAS[indice].marca && (
                                            <sup className="align-super text-[0.16em] font-bold tracking-normal">®</sup>
                                        )}
                                    </span>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Lo que tiñe las letras. */}
                    <EspejoVideo fuente={video} />

                    {/* Cruza el tercio inferior del titular, de lado a lado. */}
                    <span className="hero-firma pointer-events-none absolute bottom-[16%] left-[12%] right-[6%] z-20 text-center font-signature text-[clamp(28px,6.4vw,104px)] leading-none">
                        <span key={indice} className="hero-palabra inline-block">
                            {PALABRAS[indice].firma}
                        </span>
                    </span>
                </div>

                {/* [6] PÁRRAFO */}
                <p className="mx-auto mt-5 max-w-[46ch] text-center text-[15px] leading-relaxed text-white/85 lg:text-base">
                    {PARRAFO}
                </p>

                {/* [7] BOTÓN BARRA + reseñas a su derecha
                    El ancho es 33.333vw y no un % del contenedor: las guias
                    verticales estan a 1/3 y 2/3 del ANCHO DE SECCION, y el
                    contenedor lleva padding. Midiendo en vw y centrando, la
                    barra cae exactamente de guia a guia. */}
                <div className="relative mt-4 flex items-center">
                    <Link
                        href={CTA_HREF}
                        style={{ width: "33.333vw" }}
                        className="group mx-auto flex shrink-0 items-center justify-between border border-white/15 bg-black/85 px-7 py-5 transition-colors duration-300 hover:bg-white/[0.07]"
                    >
                        <span className="flex-1 text-center text-[12px] font-medium uppercase tracking-[0.22em] text-white lg:text-[13px]">
                            {CTA_TEXTO}
                        </span>
                        <Plus
                            className="h-4 w-4 shrink-0 text-white/70 transition-transform duration-300 group-hover:rotate-90"
                            strokeWidth={1.5}
                        />
                    </Link>

                    {/* Iniciales en circulos + estrellas. Ver RESENAS arriba:
                        los numeros son placeholder. */}
                    <div className="absolute right-0 flex items-center gap-4">
                        <div className="flex items-center">
                            {RESENAS.iniciales.map((a, i) => (
                                <span
                                    key={i}
                                    aria-hidden="true"
                                    className="-ml-3 grid h-10 w-10 shrink-0 place-items-center rounded-full text-[15px] font-semibold leading-none ring-2 ring-black first:ml-0"
                                    style={{ background: a.fondo, color: a.tinta }}
                                >
                                    {a.letra}
                                </span>
                            ))}
                            <span className="-ml-3 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#141414] text-[11px] font-semibold text-white ring-2 ring-black">
                                {RESENAS.clientes}
                            </span>
                        </div>

                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="flex items-center gap-[3px]">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className="h-[7px] w-[7px] rounded-full"
                                            style={{ background: "var(--hero-accent, #fff)" }}
                                        />
                                    ))}
                                </span>
                                <span className="text-[13px] font-semibold text-white">
                                    {RESENAS.nota}
                                </span>
                            </div>
                            <span className="mt-1 block text-[11px] uppercase tracking-[0.06em] text-white/55">
                                {RESENAS.detalle}
                            </span>
                        </div>
                    </div>
                </div>

                {/* [8] PIE DEL HERO */}
                <div className="relative mt-auto flex items-end pb-7 pt-6">
                    <div className="flex items-end gap-5">
                        <div className="flex items-center gap-3">
                            {REDES.map(({ nombre, Icono, href }) => (
                                <a
                                    key={nombre}
                                    href={href}
                                    aria-label={nombre}
                                    className="text-white/45 transition-colors duration-300 hover:text-white"
                                >
                                    <Icono className="h-[15px] w-[15px]" />
                                </a>
                            ))}
                        </div>
                        <span className="text-[11px] uppercase leading-[1.5] tracking-[0.08em] text-white/45">
                            Mantente
                            <br />
                            conectado
                        </span>
                    </div>

                    {/* Arranca en el primer tercio (donde estaba la guia
                        vertical de la rejilla): el offset se mide en vw menos
                        el gutter, para que caiga en la misma columna que el
                        boton pase lo que pase con el ancho. */}
                    <div
                        className="absolute bottom-7 right-0"
                        style={{ left: "calc(33.333vw - 3rem)" }}
                    >
                        <CintaLogos />
                    </div>
                </div>
            </div>

            {/* ─────────── filtro de grano de las letras ───────────
                La semilla se recicla con SMIL y no con JS: no cuesta un rAF
                ni un render de React por frame. */}
            <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
                <filter id="granoAtlas">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency={GRANO_FREQ}
                        numOctaves={1}
                        seed="7"
                        result="ruido"
                    >
                        <animate
                            attributeName="seed"
                            values="1;12;4;19;7;1"
                            dur={`${GRANO_CICLO_S}s`}
                            repeatCount="indefinite"
                            calcMode="discrete"
                        />
                    </feTurbulence>
                    {/* El grano va DENTRO de las letras como motas oscuras, sin
                        mover el contorno. Antes era un feDisplacementMap que
                        empujaba los pixeles del borde y dejaba las letras con
                        dientes de sierra. Ahora el borde es el del texto,
                        limpio, y el ruido solo tiñe por dentro. */}
                    <feColorMatrix
                        in="ruido"
                        type="matrix"
                        values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${-GRANO_FUERZA * 1.8} 0 0 0 ${GRANO_FUERZA}`}
                        result="motas"
                    />
                    <feComposite in="motas" in2="SourceAlpha" operator="in" result="motasDentro" />
                    <feMerge>
                        <feMergeNode in="SourceGraphic" />
                        <feMergeNode in="motasDentro" />
                    </feMerge>
                </filter>

            </svg>

            <style jsx global>{`
                /* Blanco casi opaco: deja que el video tiña levemente las
                   letras, que es lo que se ve en la referencia. El grano va
                   por filtro SVG encima. */
                .hero-atlas {
                    color: #fff;
                    filter: url(#granoAtlas);
                    animation:
                        heroEntrada ${ENTRADA_S}s cubic-bezier(0.16, 1, 0.3, 1) both,
                        heroParpadeo ${PARPADEO_S}s steps(1, end) ${ENTRADA_S}s infinite;
                }

                /* Si el filtro no resolviera, el titular sigue siendo blanco
                   solido sobre el video. Nunca texto invisible. */
                @supports not (filter: url(#x)) {
                    .hero-atlas { filter: none; color: #fff; }
                }

                /* Relevo entre palabras. Entra desenfocada y desde abajo, no
                   con un fundido a secas: el titular ya tiene su propio
                   parpadeo, y un cambio limpio parecia un fallo de carga. */
                .hero-palabra {
                    animation: heroRelevo 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                @media (prefers-reduced-motion: reduce) {
                    .hero-palabra { animation: none; }
                }
                @keyframes heroRelevo {
                    from {
                        opacity: 0;
                        transform: translateY(0.09em);
                        filter: blur(14px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                        filter: blur(0);
                    }
                }

                @keyframes heroEntrada {
                    from { clip-path: inset(100% 0 0 0); }
                    to   { clip-path: inset(0 0 0 0); }
                }

                /* Instantes irregulares y saltos duros: lee como fallo de luz. */
                @keyframes heroParpadeo {
                    0%,  90.9% { opacity: 1; }
                    91%        { opacity: ${PARPADEO_MIN}; }
                    92%        { opacity: 1; }
                    93%        { opacity: ${PARPADEO_MIN}; }
                    97%        { opacity: 1; }
                }

                /* Franjas del fallo. Ocultas (display:none, coste cero) hasta
                   que el titular lleva data-corte; mientras dura, la palabra
                   base se oculta y la forman las franjas. Mismo gris que la
                   base teñida —no blanco puro, que destellaba— y sin filtro
                   de grano: ocho capas enormes por un filtro SVG eran lo que
                   mas pesaba. El movimiento lo pone la Web Animations API. */
                .hero-corte {
                    display: none;
                    color: #bfbfbf;
                }
                .hero-titular[data-corte] .hero-corte {
                    display: block;
                    will-change: transform;
                }
                .hero-titular[data-corte] .hero-atlas {
                    visibility: hidden;
                }

                /* Se desvanece por los dos extremos para que los logos no
                   aparezcan y desaparezcan de golpe contra el borde. */
                .hero-cinta {
                    -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
                    mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
                }
                @keyframes heroCinta {
                    from { transform: translate3d(0, 0, 0); }
                    to   { transform: translate3d(-50%, 0, 0); }
                }

                .hero-firma {
                    color: var(--hero-accent, #fff);
                    transform: rotate(-2deg);
                    animation: heroFirma 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both;
                }

                @keyframes heroFirma {
                    from { opacity: 0; transform: rotate(-2deg) translateY(14px); }
                    to   { opacity: 1; transform: rotate(-2deg) translateY(0); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .hero-atlas,
                    .hero-corte,
                    .hero-cinta > * ,
                    .hero-firma { animation: none !important; }
                }
            `}</style>
        </section>
    );
}
