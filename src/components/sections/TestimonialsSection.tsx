"use client";

/* =====================================================================
   TESTIMONIOS

   Composicion de la referencia: rotulo centrado, palabra de fondo gigante
   de bajo contraste que las tarjetas tapan por la mitad, tarjeta negra de
   cifras a la izquierda y tarjeta de testimonio a la derecha.

   PROVISIONAL Y MARCADO:
     · <MetricsBackdrop/> es el hueco para el fondo abstracto de la tarjeta
       de cifras. Se sustituye entero sin tocar el resto del archivo.
     · Las cifras son valores provisionales acordados, no datos medidos.
     · Los testimonios (cita, nombre, cargo, foto) siguen pendientes.

   Reveal con useInView y no whileInView: con el scroll suave de Lenis de
   este proyecto, whileInView no llega a dispararse.
   ===================================================================== */

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SilkShader } from "@/components/ui/silk-shader";
import { EtiquetaSeccion } from "@/components/ui/etiqueta-seccion";

/* ------------------------------------------------------------- tokens */

const T = {
    bg: "#E4E4E4",
    card: "28px",
    /** Tamano de la palabra: 12.5vw en movil, clamp en el resto. Vive en las
     *  clases del <h2> porque necesita breakpoint; se anota aqui. */
    wordSize: "14.5vw / clamp(2.6rem, 13vw, 20rem)",
    /** Las tarjetas apenas rozan el pie de la palabra: el degradado y la
     *  mascara ya la disuelven antes de llegar. */
    wordOverlap: "-0.06em",
    figure: "clamp(2.9rem, 4.4vw, 5.25rem)",
    quote: "clamp(1.25rem, 1.75vw, 2.15rem)",
    label: "rgba(255,255,255,0.55)",
} as const;

/* La palabra no lleva color plano: el relleno va de un gris medio arriba
   hasta el color exacto del fondo abajo (background-clip: text) y encima
   una mascara que apaga la opacidad. Las dos capas juntas son lo que hace
   que las letras se disuelvan en la pagina en vez de quedar cortadas. */
const WORD_FILL =
    "linear-gradient(to bottom, #B6B6B6 0%, #BDBDBD 34%, #C9C9C9 58%, #DADADA 80%, #E4E4E4 100%)";
const WORD_MASK =
    "linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,0.62) 79%, transparent 97%)";

/* "Liquid glass": el desenfoque solo no basta. Lo que da la sensacion de
   vidrio es la suma de tres cosas — saturar lo que hay detras, un reflejo
   interior en el borde superior y una sombra que despega el boton. */
const GLASS: React.CSSProperties = {
    background:
        "linear-gradient(145deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.09) 48%, rgba(255,255,255,0.14) 100%)",
    border: "1px solid rgba(255,255,255,0.22)",
    backdropFilter: "blur(16px) saturate(180%)",
    WebkitBackdropFilter: "blur(16px) saturate(180%)",
    boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.10), 0 6px 20px rgba(0,0,0,0.38)",
};

const COUNT_DURATION = 2000;
const COUNT_STAGGER = 150;

/* -------------------------------------------------------------- datos */

// Valores provisionales. Cambiarlos aqui es suficiente.
const METRICS = [
    { value: 12, suffix: "+", label: "Proyectos entregados" },
    { value: 98, suffix: "%", label: "Satisfacción del cliente" },
    { value: 3, suffix: "sem.", label: "Entrega promedio" },
] as const;

// PENDIENTE: testimonios reales (cita, nombre, cargo, empresa, foto).
const TESTIMONIALS = [
    { quote: null, name: null, role: null, image: "/assets/testimonial-02.webp" },
    { quote: null, name: null, role: null, image: "/assets/testimonial-01.webp" },
    { quote: null, name: null, role: null, image: "/assets/testimonial-01.webp" },
] as const;

const PLACEHOLDER_QUOTE = "Aquí irá el testimonio de un cliente real, en sus propias palabras.";

/* ------------------------------------------------------------- conteo */

/** Cuenta de 0 a `target` con requestAnimationFrame y ease-out cubica.
 *  Una sola vez; sin animar si el sistema pide menos movimiento. */
function useCountUp(target: number, start: boolean, delay: number) {
    const reduce = useReducedMotion();
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!start) return;
        if (reduce) {
            setValue(target);
            return;
        }

        let raf = 0;
        let t0 = 0;

        const tick = (now: number) => {
            if (!t0) t0 = now;
            const elapsed = now - t0 - delay;
            if (elapsed < 0) {
                raf = requestAnimationFrame(tick);
                return;
            }
            const p = Math.min(elapsed / COUNT_DURATION, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(target * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [start, target, delay, reduce]);

    return value;
}

const Metric = ({
    value,
    suffix,
    label,
    start,
    delay,
}: {
    value: number;
    suffix: string;
    label: string;
    start: boolean;
    delay: number;
}) => {
    const shown = useCountUp(value, start, delay);
    // "sem." es una palabra, no un simbolo: se baja para que no compita.
    const isWord = suffix.length > 1;

    return (
        <div>
            <p
                className="font-bold leading-none text-white"
                style={{ fontSize: T.figure, fontVariantNumeric: "tabular-nums" }}
            >
                {shown}
                <span className={cn(isWord && "ml-[0.12em] text-[55%]")}>{suffix}</span>
            </p>
            <p className="mt-2 text-[13.5px]" style={{ color: T.label }}>
                {label}
            </p>
        </div>
    );
};

/* ------------------------------------------------- fondo de las cifras */

/** Shader "Silk" (WebGL1) como fondo de la tarjeta de cifras.
 *
 *  Sobre el desenfoque: el canvas se renderiza a resolucion completa
 *  (DPR capado a 2) y el difuminado se aplica DESPUES, por CSS. Asi el
 *  shader no pierde definicion — no se baja su resolucion ni se sube su
 *  u_blur interno, que aplanaria los pliegues. El scale(1.06) evita que
 *  el blur chupe los bordes y deje un halo claro en el borde de la card.
 *
 *  Encima va un velo oscuro en degradado, mas denso donde caen las
 *  cifras, para que el blanco del texto no compita con las zonas claras
 *  del shader. */
const MetricsBackdrop = () => (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-black">
        <SilkShader className="absolute inset-0 h-full w-full scale-[1.06] blur-[3px] will-change-transform" />

        {/* Velo de legibilidad. */}
        <div
            className="absolute inset-0"
            style={{
                background:
                    "linear-gradient(105deg, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.66) 45%, rgba(0,0,0,0.44) 100%)",
            }}
        />
        {/* Refuerzo bajo cada bloque de texto, que va pegado a la izquierda. */}
        <div
            className="absolute inset-0"
            style={{
                background:
                    "linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.16) 58%, transparent 100%)",
            }}
        />
    </div>
);

/* ------------------------------------------------------------ seccion */

export default function TestimonialsSection() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.4 });

    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const total = TESTIMONIALS.length;

    const go = (step: number) => {
        setDirection(step);
        setIndex((prev) => (prev + step + total) % total);
    };

    const active = TESTIMONIALS[index];

    return (
        <section
            ref={ref}
            className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden pb-[14vh] pt-6"
            style={{ backgroundColor: T.bg }}
        >
            {/* Un solo contenedor para rotulo, palabra y tarjetas. Ancho ~79vw
                como en la referencia: las tarjetas NO van de borde a borde. */}
            <div className="mx-auto flex w-[calc(100%-2.5rem)] flex-col md:w-[79vw] md:max-w-[1600px]">
                <div className="flex justify-center">
                    <EtiquetaSeccion codigo="Atlas® — Opiniones" sobreClaro />
                </div>

                {/* Palabra de fondo: detras de las tarjetas (z-0) y con margen
                    inferior negativo para que solo asome su mitad superior.
                    El mt sube de 2 a 4 porque entre la etiqueta y la palabra iba
                    el rotulo "(Lo que dicen de nosotros)", ya retirado: sin ese
                    aire la etiqueta quedaba pegada al hombro de la T. */}
                <h2
                    aria-hidden="true"
                    className="relative z-0 mt-4 select-none text-center font-bold text-[14.5vw] sm:text-[clamp(2.6rem,13vw,20rem)]"
                    style={{
                        letterSpacing: "-0.03em",
                        lineHeight: 0.9,
                        whiteSpace: "nowrap",
                        marginBottom: T.wordOverlap,
                        backgroundImage: WORD_FILL,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitMaskImage: WORD_MASK,
                        maskImage: WORD_MASK,
                    }}
                >
                    Testimonios
                </h2>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-[1] grid h-[52vh] min-h-[390px] grid-cols-1 gap-4 md:grid-cols-[minmax(0,0.486fr)_minmax(0,1fr)] md:gap-[1.55vw]"
                >
                    {/* ---------------------------------------------- cifras */}
                    <div
                        className="relative order-2 overflow-hidden md:order-1"
                        style={{ borderRadius: T.card }}
                    >
                        <MetricsBackdrop />
                        {/* Movil: las tres en una fila. Escritorio: en vertical. */}
                        <div className="relative z-10 grid h-full grid-cols-3 gap-4 p-6 md:flex md:flex-col md:justify-between md:px-9 md:py-8">
                            {METRICS.map((m, i) => (
                                <Metric
                                    key={m.label}
                                    value={m.value}
                                    suffix={m.suffix}
                                    label={m.label}
                                    start={inView}
                                    delay={i * COUNT_STAGGER}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ------------------------------------------ testimonio */}
                    <div
                        className="relative order-1 overflow-hidden bg-neutral-900 md:order-2"
                        style={{ borderRadius: T.card }}
                    >
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-[#1A1A1A] bg-cover bg-center"
                            style={{ backgroundImage: `url('${active.image}')` }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.35) 100%)",
                            }}
                        />

                        <div className="relative z-10 flex h-full flex-col justify-between p-6 md:px-9 md:py-8">
                            {/* Contador */}
                            <div>
                                <p className="font-medium">
                                    <span className="text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-white/45"> / {String(total).padStart(2, "0")}</span>
                                </p>
                                <div className="mt-3 h-px w-[60px] bg-white/25">
                                    <motion.div
                                        className="h-full bg-white"
                                        animate={{ width: `${((index + 1) / total) * 100}%` }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                </div>
                            </div>

                            {/* Cita y autor. Las flechas ya no van en esta fila:
                                se anclan a la esquina de la card, por eso el
                                hueco a la derecha del texto. */}
                            <div className="max-w-3xl md:pr-28">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 18 * direction }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -18 * direction }}
                                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <p
                                            className="font-bold leading-[1.18] tracking-[-0.02em] text-white"
                                            style={{ fontSize: T.quote }}
                                        >
                                            &ldquo;{active.quote ?? PLACEHOLDER_QUOTE}&rdquo;
                                        </p>

                                        <div className="mt-9">
                                            <p className="text-[14px] font-semibold text-white">
                                                {active.name ?? "Nombre pendiente"}
                                            </p>
                                            <p className="text-[13.5px]" style={{ color: T.label }}>
                                                {active.role ?? "Cargo y empresa pendientes"}
                                            </p>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Flechas pegadas a la esquina: fuera del contenedor con
                            padding, hijas directas de la card. */}
                        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2.5 md:bottom-5 md:right-5">
                            {[
                                { dir: -1, label: "Testimonio anterior", Icon: ChevronLeft },
                                { dir: 1, label: "Testimonio siguiente", Icon: ChevronRight },
                            ].map(({ dir, label, Icon }) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => go(dir)}
                                    aria-label={label}
                                    className="group/arrow grid h-10 w-10 place-items-center rounded-full text-white transition-transform duration-200 active:scale-90"
                                    style={GLASS}
                                >
                                    <Icon className="h-[17px] w-[17px] transition-transform duration-200 group-hover/arrow:scale-110" />
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
