'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { MaskLine } from '@/components/ui/editorial-bits';
import { cn } from "@/lib/utils";
import { EtiquetaSeccion } from "@/components/ui/etiqueta-seccion";
import { ChevronDown, Play } from 'lucide-react';
import Loader from './Loader';

const pages = [
    {
        leftBgImage: null,
        rightBgImage: null,
        leftComponent: <Loader type="ai" />,
        leftContent: null,
        rightContent: {
            heading: 'Sitios &\nLanding Pages',
            description: 'Páginas rápidas, con animaciones fluidas y una estructura pensada para que cada visita termine en contacto.',
            skills: ["Menús digitales", "E-commerce", "UX/UI", "Animaciones", "SEO", "Responsive"],
            hoverColor: "bg-red-600/10"
        },
    },
    {
        leftBgImage: null,
        rightBgImage: null,
        leftComponent: null,
        rightComponent: <Loader type="software" />,
        leftContent: {
            heading: 'Software\na Medida',
            description: 'Plataformas que ordenan tu operación: paneles, reservas o gestión interna, construidos según cómo trabaja tu equipo.',
            skills: ["Dashboards", "Reservas", "CRM", "Automatización", "Integraciones"],
            hoverColor: "bg-blue-600/10"
        },
        rightContent: null,
    },
    {
        leftBgImage: null,
        rightBgImage: null,
        leftComponent: <Loader type="softskill" />,
        leftContent: null,
        rightContent: {
            heading: 'Apps\nMóviles',
            description: 'Experiencias intuitivas para iOS y Android, desde el prototipo interactivo hasta la versión lista para publicar.',
            skills: ["iOS & Android", "Prototipado", "Figma", "Apps web", "Interfaces móviles"],
            hoverColor: "bg-purple-600/10"
        },
    },
    {
        isBridge: true,
        heading: 'Proyectos que hablan por nosotros.',
        subheading: 'DESPLÁZATE PARA EXPLORAR',
    }
];

export default function ScrollAdventure() {
    const [currentPage, setCurrentPage] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        mass: 0.1,
        restDelta: 0.001
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const totalPages = pages.length;
        const step = 1 / totalPages;
        const index = Math.min(Math.floor(latest / step) + 1, totalPages);
        if (currentPage !== index) setCurrentPage(index);
    });
    const { scrollYProgress: enterProgressRaw } = useScroll({
        target: containerRef,
        offset: ["start end", "start start"]
    });

    // Spring physics wrapper for the entrance to mirror the buttery smooth exit
    const enterProgress = useSpring(enterProgressRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const enterScale = useTransform(enterProgress, [0, 1], [0.85, 1]);
    const enterOpacity = useTransform(enterProgress, [0, 1], [0, 1]);
    const enterBorderRadius = useTransform(enterProgress, [0, 1], ["40px", "0px"]);

    /* Rotulo de entrada de la seccion. Cruza la pantalla de izquierda a derecha
       y se va, durante el primer servicio.

       Va atado a smoothProgress y no a un temporizador: smoothProgress ya es un
       muelle sobre el scroll, asi que el rotulo hereda esa inercia —entra y sale
       con la misma fisica que el resto de la seccion— y ademas es reversible, se
       deshace al subir. Con un setTimeout habria ocurrido una vez y punto,
       aunque el visitante no estuviera mirando.

       El recorrido va en vw y no en %: un % se mide contra el ANCHO DEL PROPIO
       TEXTO, asi que "-100%" solo lo aparta su propia anchura y en una pantalla
       ancha seguiria a la vista. En vw se mide contra la ventana, que es lo que
       de verdad hay que cruzar.

       Tres tramos, y el del medio es una PARADA: entre 0.05 y 0.135 la x se
       queda en 0vw, asi que el rotulo se planta en el centro mientras el
       visitante sigue bajando. Un valor repetido en el rango de salida es la
       forma de hacer una pausa en algo atado al scroll.

       Ojo con lo que significa "un segundo" aqui: esto no corre con reloj, corre
       con recorrido. El contenedor mide 800vh y el scroll util son 700vh, asi
       que los tramos son 35vh de entrada, ~60vh de parada y ~53vh de salida. A
       velocidad normal de lectura la parada sale de segundo y medio, pero quien
       baje a lo bruto la vera mas corta. Fijarla en segundos de verdad obligaria
       a desengancharla del scroll, y entonces dejaria de poder deshacerse al
       subir.

       Entrada y salida no son simetricas a proposito: entra algo mas rapido de
       lo que se va. Al reves se leeria como que huye. */
    const xRotulo = useTransform(smoothProgress, [0, 0.05, 0.135, 0.21], ["-100vw", "0vw", "0vw", "105vw"]);
    const opacidadRotulo = useTransform(smoothProgress, [0, 0.012, 0.175, 0.21], [0, 1, 1, 0]);

    return (
        <div ref={containerRef} className="relative h-[800vh] w-full pointer-events-none">
            <motion.div
                style={{ scale: enterScale, opacity: enterOpacity, borderRadius: enterBorderRadius }}
                className="sticky top-0 h-screen w-full overflow-hidden bg-background dark:bg-black pointer-events-auto origin-center"
            >
                {/* Sobre las paginas y sin capturar el raton: es rotulo, no
                    interfaz. */}
                <motion.div
                    aria-hidden="true"
                    style={{ x: xRotulo, opacity: opacidadRotulo }}
                    className="pointer-events-none absolute inset-x-0 top-[7vh] z-40 flex items-center justify-center gap-[2vw] will-change-transform"
                >
                    {/* Los mismos galones de las etiquetas de seccion, de cabeza
                        del rotulo: le dan direccion al recorrido. */}
                    <svg width="clamp(40px,4vw,74px)" height="18" viewBox="0 0 52 13" className="h-[clamp(10px,1.1vw,18px)] w-auto shrink-0">
                        <path d="M0 0 L7 0 L12 6.5 L7 13 L0 13 Z" fill="var(--hero-accent, #E11D3A)" opacity="0.3" />
                        <path d="M11 0 L18 0 L23 6.5 L18 13 L11 13 Z" fill="var(--hero-accent, #E11D3A)" opacity="0.5" />
                        <path d="M22 0 L29 0 L34 6.5 L29 13 L22 13 Z" fill="var(--hero-accent, #E11D3A)" opacity="0.72" />
                        <path d="M33 0 L40 0 L45 6.5 L40 13 L33 13 Z" fill="var(--hero-accent, #E11D3A)" />
                    </svg>
                    {/* Hueco y no relleno: a este cuerpo, una mancha blanca
                        taparia media pantalla. El contorno pesa lo justo para
                        leerse como un rotulo y deja pasar el fondo, que es lo que
                        lo mantiene minimalista siendo enorme. */}
                    <span
                        className="whitespace-nowrap font-sans font-black uppercase leading-none tracking-[-0.03em] text-[clamp(2.4rem,8.2vw,10rem)]"
                        style={{
                            color: "transparent",
                            WebkitTextStroke: "1.6px rgba(255,255,255,0.55)",
                        }}
                    >
                        Servicios
                    </span>
                </motion.div>

                {pages.map((page, i) => {
                    if ('isBridge' in page) {
                        return (
                            <BridgeSlide
                                key={i}
                                page={page}
                                isActive={currentPage === i + 1}
                                scrollProgress={smoothProgress}
                                index={i}
                            />
                        );
                    }
                    return (
                        <PageSlide
                            key={i}
                            page={page}
                            isActive={currentPage === i + 1}
                            scrollProgress={smoothProgress}
                            index={i}
                        />
                    );
                })}

                {/* Global Progress Line Removed */}
            </motion.div>
        </div>
    );
}

function PageSlide({ page, isActive, scrollProgress, index }: { page: any, isActive: boolean, scrollProgress: any, index: number }) {
    const leftHasVisual = !!page.leftBgImage || !!page.leftComponent;
    const rightHasVisual = !!page.rightBgImage || !!page.rightComponent;

    const totalPages = pages.length;
    const step = 1 / totalPages;
    const base = index * step;

    let enterStart = index === 0 ? -0.1 : base - step / 4;
    let enterEnd = index === 0 ? -0.05 : base + step / 4;
    let exitStart = base + step * 0.75;
    let exitEnd = base + step * 1.25;

    if (index === 0) {
        exitStart = 0.125;
        exitEnd = 0.3125;
    } else if (index === 1) {
        enterStart = 0.125;
        enterEnd = 0.3125;
    }

    const leftY = useTransform(
        scrollProgress,
        [enterStart, enterEnd, exitStart, exitEnd],
        [leftHasVisual ? "-120%" : "120%", "0%", "0%", leftHasVisual ? "-120%" : "120%"]
    );



    const rightY = useTransform(
        scrollProgress,
        [enterStart, enterEnd, exitStart, exitEnd],
        [rightHasVisual ? "-120%" : "120%", "0%", "0%", rightHasVisual ? "-120%" : "120%"]
    );

    const zIndex = useTransform(
        scrollProgress,
        [enterStart, enterEnd, exitStart, exitEnd],
        [10, 20, 20, 10]
    );

    return (
        <motion.div style={{ zIndex }} className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 md:p-8 lg:p-12">
            {/* Unified Card Container */}
            <div className="relative w-full h-full max-w-[1600px] flex pointer-events-auto">

                {/* LEFT HALF OF THE SPLIT CARD */}
                <motion.div
                    style={{ y: leftY }}
                    className="relative w-1/2 h-full bg-background dark:bg-black z-10 rounded-l-3xl overflow-hidden"
                >
                    <div className="w-full h-full relative overflow-hidden">
                        {page.leftComponent ? (
                            <BlendedVisual component={page.leftComponent} side="left" />
                        ) : page.leftBgImage ? (
                            <BlendedVisual src={page.leftBgImage} side="left" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-start p-8 md:p-16 lg:p-24 relative group">
                                <motion.div
                                    className={cn("absolute inset-0 z-0", page.leftContent?.hoverColor || "bg-primary/5")}
                                    initial={{ height: 0 }}
                                    whileHover={{ height: '100%' }}
                                    transition={{ duration: 0.4 }}
                                />
                                {page.leftContent && <EditorialContent content={page.leftContent} index={index} />}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* RIGHT HALF OF THE SPLIT CARD */}
                <motion.div
                    style={{ y: rightY }}
                    className="relative w-1/2 h-full bg-background dark:bg-black z-10 rounded-r-3xl overflow-hidden"
                >
                    <div className="w-full h-full relative overflow-hidden">
                        {page.rightComponent ? (
                            <BlendedVisual component={page.rightComponent} side="right" />
                        ) : page.rightBgImage ? (
                            <BlendedVisual src={page.rightBgImage} side="right" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-start p-8 md:p-16 lg:p-24 relative group">
                                <motion.div
                                    className={cn("absolute inset-0 z-0", page.rightContent?.hoverColor || "bg-primary/5")}
                                    initial={{ height: 0 }}
                                    whileHover={{ height: '100%' }}
                                    transition={{ duration: 0.4 }}
                                />
                                {page.rightContent && <EditorialContent content={page.rightContent} index={index} />}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

/* ===================== PUENTE AL PORTAFOLIO =====================
   Cápsulas, burbujas de íconos y tarjeta de vídeo del titular editorial.
   Todo respeta prefers-reduced-motion: sin loops ni parallax, solo fades. */

/* Degradado de la palabra final: arranca casi blanco y se disuelve en el
   negro del fondo. Mismo tratamiento que los titulares de Precios y
   Testimonios, invertido porque aqui el fondo es oscuro. */
const NOSOTROS_FILL =
    "linear-gradient(to bottom, #F0F0F0 0%, #CFCFCF 22%, #8C8C8C 48%, #4A4A4A 74%, #141414 100%)";
const NOSOTROS_MASK =
    "linear-gradient(to bottom, #000 0%, #000 52%, rgba(0,0,0,0.55) 78%, transparent 99%)";

// Capsula de medios incrustada en el titular: forma de estadio, como la
// referencia. Toda la capsula baja a la seccion de proyectos.
function MediaCapsule({ active }: { active: boolean }) {
    const reduce = useReducedMotion();
    const video = useRef<HTMLVideoElement>(null);

    // El clip solo corre mientras la diapositiva esta al frente. Fuera de ahi
    // no hay razon para decodificar frames que nadie ve.
    useEffect(() => {
        const v = video.current;
        if (!v || reduce) return;
        if (active) v.play().catch(() => {});
        else v.pause();
    }, [active, reduce]);

    return (
        <motion.button
            type="button"
            onClick={() =>
                document
                    .getElementById("proyectos")
                    ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
            }
            aria-label="Ver los proyectos de Atlas"
            initial={{ opacity: 0, scaleX: 0.55 }}
            animate={active ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.55 }}
            transition={{ duration: 0.95, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group relative mx-[0.14em] hidden h-[0.86em] w-[2.05em] shrink-0 origin-center translate-y-[0.03em] overflow-hidden rounded-full align-middle md:inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DAFF6B]"
        >
            {reduce ? (
                <Image
                    src="/assets/capsula-portafolio.webp"
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="360px"
                    className="object-cover"
                />
            ) : (
                <video
                    ref={video}
                    aria-hidden="true"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/assets/capsula-portafolio.webp"
                    src="/assets/capsula-portafolio.mp4"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
                />
            )}
            <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15"
            />
            <span
                aria-hidden="true"
                className="absolute left-[0.22em] top-1/2 flex h-[0.42em] w-[0.42em] -translate-y-1/2 items-center justify-center rounded-full bg-black/45 backdrop-blur-[10px] transition-colors duration-300 group-hover:bg-[#DAFF6B]"
            >
                <Play className="h-[0.18em] w-[0.18em] fill-white text-white transition-colors duration-300 group-hover:fill-black group-hover:text-black" />
            </span>
        </motion.button>
    );
}

// Par de pastillas del encabezado, como el "Awards / 05" de la referencia.
/* Marcas de encuadre sobre una de las dos horizontales del puente. Las
   cuatro X son las mismas de la rejilla del hero: los bordes y los dos
   tercios. Se montan dentro de la fila cuyo borde marcan, no sueltas sobre
   la diapositiva, para que sigan al borde si la fila cambia de alto. */
function MarcasRejilla({ clase }: { clase: string }) {
    return (
        <div aria-hidden="true" className={cn("pointer-events-none absolute inset-x-0 z-20 h-0", clase)}>
            {["0%", "33.333%", "66.666%", "100%"].map((x) => (
                <span
                    key={x}
                    className="absolute h-[9px] w-[9px] border border-white/25"
                    style={{ left: x, top: 0, transform: "translate(-50%, -50%)" }}
                />
            ))}
        </div>
    );
}

function BridgeSlide({ page, isActive, scrollProgress, index }: { page: any, isActive: boolean, scrollProgress: any, index: number }) {
    const reduceMotion = useReducedMotion();
    const step = 1 / pages.length;
    const base = index * step;

    // Adjusted exit to be ZERO-GAP: text stays visible until the very end of the scroll
    const opacity = useTransform(scrollProgress, [base - step / 4, base + step / 4, 0.98, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollProgress, [base - step / 4, base + step / 4, 0.98, 1], [50, 0, 0, -50]);

    return (
        <motion.div
            style={{ opacity, zIndex: 30 }}
            className={cn(
                // Negro fijo, no bg-background: el titular, las pastillas y la
                // nota son blancos, asi que en tema claro esta diapositiva se
                // quedaba en blanco sobre blanco.
                "absolute inset-0 overflow-hidden bg-black",
                isActive ? "pointer-events-auto" : "pointer-events-none"
            )}
        >
            {/* ---- FONDO: la cumbre. Sustituye al radial lima que quedaba de
                 antes del cambio a rojo; sobre una foto azulada ese velo verde
                 se notaba, cosa que sobre negro plano no pasaba.
                 La foto es practicamente toda negro, asi que a q72 pesa 34 kB
                 a 2000px de ancho. ---- */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url(/brand/portafolio-cumbre.webp)" }}
            />

            {/* Velo. La cumbre esta iluminada por el lado derecho, justo donde
                muere la tercera linea del titular; sin cerrar ese flanco las
                aristas claras se meten entre las letras. Por la izquierda casi
                no cierra: ahi la foto ya es negra y taparla mas seria apagar
                la imagen entera para nada. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    background:
                        "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 38%, rgba(0,0,0,0.45) 72%, rgba(0,0,0,0.70) 100%)",
                }}
            />

            {/* ---- REJILLA: las dos verticales del hero, a los tercios. Las
                 horizontales no van aqui: son los bordes del encabezado y del
                 pie, asi encuadran el titular por si solas y no pueden
                 descuadrarse si esas filas cambian de alto. ---- */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
                <span className="absolute inset-y-0 left-1/3 w-px bg-white/[0.07]" />
                <span className="absolute inset-y-0 left-2/3 w-px bg-white/[0.07]" />
            </div>

            <motion.div style={{ y }} className="relative z-10 flex h-full w-full flex-col justify-center">

                {/* ---- ENCABEZADO: etiqueta a la izquierda, nota a la derecha,
                     las dos en el mismo renglon y cerradas por una regla.
                     La etiqueta estaba centrada sobre un titular alineado a la
                     izquierda y quedaba huerfana; pegada al mismo margen que el
                     titular y que el pie, las tres cosas caen en la misma
                     vertical. La regla inferior es la horizontal de arriba de
                     la rejilla. ---- */}
                <div className="absolute inset-x-0 top-[6vh] z-10 border-b border-white/[0.07] pb-[3vh]">
                    <div className="flex items-start justify-between gap-8 px-[4vw]">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <EtiquetaSeccion codigo="Portafolio" texto="2026" />
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="text-right font-sans text-[15px] leading-[1.5] tracking-[-0.01em] text-white/45"
                        >
                            / Cada pieza diseñada y<br />
                            desarrollada a medida /
                        </motion.p>
                    </div>
                    <MarcasRejilla clase="bottom-0" />
                </div>

                {/* ---- TITULAR ----
                    Sin padding a la derecha a proposito: la ultima linea va
                    sangrada y se sale del encuadre, como en la referencia. El
                    recorte lo hace el overflow-hidden de cada MaskLine. */}
                <h2 className="w-full pl-[4vw] pr-0 font-condensed uppercase leading-[0.84] tracking-[-0.005em] text-[#F5F5F0] text-[clamp(3rem,10.2vw,10rem)]">
                    <MaskLine active={isActive} delay={0}>Lo que hemos</MaskLine>

                    {/* Linea 2: la capsula de medios va incrustada en la linea */}
                    <MaskLine active={isActive} delay={0.12}>
                        <span className="inline-flex items-center whitespace-nowrap">
                            Construido
                            <MediaCapsule active={isActive} />
                            Habla
                        </span>
                    </MaskLine>

                    {/* Linea 3: sangrada, mas grande y apagada. "Nosotros."
                        lleva el degradado que se disuelve hacia abajo. */}
                    {/* El text-right vive en un span propio: junto al
                        text-[1.14em] dentro de MaskLine, tailwind-merge los
                        toma como el mismo grupo y descarta la alineacion. */}
                    <MaskLine active={isActive} delay={0.24} className="text-[1.14em]">
                      <span className="block w-full text-right">
                        <span className="inline-block translate-x-[7vw] whitespace-nowrap text-[#6E6E6E]">
                            Por{" "}
                            <span
                                style={{
                                    backgroundImage: NOSOTROS_FILL,
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    color: "transparent",
                                    WebkitMaskImage: NOSOTROS_MASK,
                                    maskImage: NOSOTROS_MASK,
                                }}
                            >
                                Nosotros.
                            </span>
                        </span>
                      </span>
                    </MaskLine>
                </h2>

                {/* ---- PIE: el indicador, alineado al titular, y la segunda
                     horizontal de la rejilla. Entre esta regla y la del
                     encabezado queda encuadrado el titular, que es lo que le da
                     el aire de sistema en vez de texto suelto sobre negro. ---- */}
                <div className="absolute inset-x-0 bottom-[6vh] z-10 border-t border-white/[0.07] pt-[3vh]">
                    <MarcasRejilla clase="top-0" />
                    <div className="flex items-center gap-4 pl-[4vw]">
                        <span className="font-mono text-[12px] uppercase tracking-[0.3em] text-white/45">
                            Desliza para descubrir
                        </span>
                        <motion.div
                            animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ChevronDown className="h-5 w-5 text-white/45" />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function BlendedVisual({ src, component, side }: { src?: string, component?: React.ReactNode, side: 'left' | 'right' }) {
    return (
        <div className="relative w-full h-full overflow-hidden bg-background dark:bg-black flex items-center justify-center">
            {src ? (
                <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform grayscale hover:grayscale-0 transition-[filter] duration-1000"
                    style={{ backgroundImage: `url(${src})` }}
                />
            ) : component ? (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="w-full h-full transform scale-[2.0]">
                        {component}
                    </div>
                </motion.div>
            ) : null}
            {/* Horizontal Blend (Masked to avoid WebKit transparent color interpolation bug) */}
            <div
                className="absolute inset-0 pointer-events-none z-10 bg-background dark:bg-black hidden dark:block"
                style={{
                    WebkitMaskImage: side === 'left'
                        ? 'linear-gradient(to right, transparent, black)'
                        : 'linear-gradient(to left, transparent, black)',
                    maskImage: side === 'left'
                        ? 'linear-gradient(to right, transparent, black)'
                        : 'linear-gradient(to left, transparent, black)'
                }}
            />
            {/* Vertical Blend (Masked to avoid WebKit transparent color interpolation bug) */}
            <div
                className="absolute inset-0 pointer-events-none z-10 bg-background dark:bg-black opacity-40 hidden dark:block"
                style={{
                    WebkitMaskImage: 'linear-gradient(to bottom, black, transparent, black)',
                    maskImage: 'linear-gradient(to bottom, black, transparent, black)'
                }}
            />
        </div>
    );
}

/* ─── Un servicio ─────────────────────────────────────────────────────────
   Antes: etiqueta, titular en versalitas, parrafo y SEIS etiquetas magneticas
   en esmeralda, azul, violeta, rosa, ambar y cian. Ese arcoiris era el motivo
   real de que la seccion no perteneciera al resto de la pagina, mas que la
   estructura.

   Ahora sigue el esquema de la referencia —numero en circulo, titular grande,
   filete, texto y una pildora— con dos decisiones propias:

   - El titular pasa a CAJA BAJA. Es lo que hace que la referencia se lea cara:
     una grotesca en caja baja con el tracking muy cerrado tiene ritmo de
     palabra, y en versalitas se convierte en un letrero.
   - Las seis etiquetas se vuelven UNA linea de metadatos en Space Mono. No se
     pierde informacion —estan las seis— y la seccion deja de tener seis focos
     de color compitiendo con el titular. Space Mono es ya la voz tecnica de
     esta pagina: la usan el titular del stack, los servicios del cierre y las
     etiquetas del formulario.

   El numero va en el circulo y NO en la etiqueta de seccion: decirlo en los
   dos sitios era el mismo error que acabamos de corregir en las fichas del
   proceso. */
/* Etiqueta de un servicio. Cuadrada, con su indice delante y el rojo entrando
   al pasar el cursor.

   El relleno no aparece: SUBE. Es un scaleY anclado abajo, asi que se compone
   en GPU y no repinta —animar background-color obligaria a repintar seis cajas
   a la vez—. Y sube en vertical a proposito: el boton de la tarjeta de contacto
   ya hace el barrido horizontal, y repetir el mismo eje habria sido el mismo
   truco dos veces en la misma pagina.

   El borde pasa a transparente en el mismo gesto: sobre el relleno rojo, un
   borde gris se veria como un halo sucio, y quitarlo en vez de recolorearlo
   mantiene el tamaño exacto de la caja. */
function EtiquetaServicio({ texto, indice }: { texto: string; indice: number }) {
    return (
        <span className="group/tag relative inline-flex cursor-default items-center gap-2.5 overflow-hidden border border-foreground/15 px-3.5 py-2 transition-[border-color,transform] duration-500 hover:-translate-y-px hover:border-transparent">
            <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/tag:scale-y-100"
                style={{ background: "var(--hero-accent, #E11D3A)" }}
            />
            <span className="relative font-space-mono text-[9.5px] tabular-nums leading-none text-foreground/30 transition-colors duration-500 group-hover/tag:text-white/60">
                {String(indice + 1).padStart(2, "0")}
            </span>
            <span className="relative font-space-mono text-[10.5px] uppercase leading-none tracking-[0.14em] text-foreground/70 transition-colors duration-500 group-hover/tag:text-white">
                {texto}
            </span>
        </span>
    );
}

function EditorialContent({ content, index }: { content: any, index: number }) {
    return (
        <div className="relative z-10 flex w-full max-w-2xl flex-col items-start text-left">
            <span className="grid h-[68px] w-[68px] place-items-center rounded-full border border-foreground/12 bg-foreground/[0.05] font-space-mono text-[19px] font-bold tabular-nums text-foreground">
                {String(index + 1).padStart(2, "0")}
            </span>

            <h2 className="mt-9 whitespace-pre-line font-sans text-5xl font-bold leading-[0.96] tracking-[-0.045em] text-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-4 md:text-6xl lg:text-7xl">
                {content.heading}
            </h2>

            <span aria-hidden="true" className="mt-10 block h-px w-full max-w-xl bg-foreground/15" />

            <p className="mt-7 max-w-lg text-lg font-medium leading-snug text-muted-foreground md:text-xl">
                {content.description}
            </p>

            {content.skills && (
                <div className="mt-8 flex max-w-xl flex-wrap gap-2.5">
                    {content.skills.map((skill: string, idx: number) => (
                        <EtiquetaServicio key={skill} texto={skill} indice={idx} />
                    ))}
                </div>
            )}
        </div>
    );
}


