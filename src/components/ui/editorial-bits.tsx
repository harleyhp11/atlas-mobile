"use client";

/* =====================================================================
   Piezas del lenguaje editorial de Atlas: cápsulas glass, burbujas de
   íconos y líneas con reveal enmascarado.
   Creadas para el puente al portafolio y reutilizadas por el encabezado
   del timeline "Cómo trabajamos".

   Disparo de la animación — dos modos:
     · active={bool}  -> controlado por el padre (slides con scroll propio).
     · sin `active`   -> useInView con ref, para secciones normales.

   Todo respeta prefers-reduced-motion: sin loops ni parallax, solo fades.
   ===================================================================== */

import React from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/** Tokens del lenguaje (mismos valores en ambas secciones). */
export const EDITORIAL = {
    lime: "#DAFF6B",
    limeGlow: "0 0 40px rgba(218,255,107,0.35)",
    iconGlow: "drop-shadow(0 0 12px rgba(218,255,107,0.6))",
    bubbleBg: "#1C1C1C",
} as const;

/**
 * Decide cuándo revelar.
 *  · active definido  -> lo manda el padre (slides con scroll propio).
 *  · active undefined -> useInView con ref.
 * Se usa useInView y NO whileInView: con el scroll suave de Lenis de este
 * proyecto, whileInView no llega a dispararse y el contenido se queda
 * escondido tras el overflow de la máscara.
 */
function useReveal(active?: boolean) {
    const ref = React.useRef<any>(null);
    const inView = useInView(ref, { once: true, margin: "-10%" });
    return { ref, on: active === undefined ? inView : active };
}

/* ---------------------------------------------------------------- línea */
export function MaskLine({
    children,
    delay = 0,
    active,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    active?: boolean;
    className?: string;
}) {
    const reduce = useReducedMotion();
    const { ref, on } = useReveal(active);
    const shown = reduce ? { opacity: 1 } : { y: "0%" };
    const hidden = reduce ? { opacity: 0 } : { y: "110%" };
    return (
        <span ref={ref} className={cn("block overflow-hidden py-[0.08em]", className)}>
            <motion.span
                className="block"
                initial={hidden}
                animate={on ? shown : hidden}
                transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.span>
        </span>
    );
}

/* -------------------------------------------------------------- cápsula */
export function Capsule({
    children,
    rotate = 0,
    delay = 0,
    active,
    lime = false,
    className,
}: {
    children: React.ReactNode;
    rotate?: number;
    delay?: number;
    active?: boolean;
    lime?: boolean;
    className?: string;
}) {
    const reduce = useReducedMotion();
    const { ref, on } = useReveal(active);
    const shown = { scale: 1, rotate, opacity: 1 };
    const hidden = reduce
        ? { opacity: 0, scale: 1, rotate: 0 }
        : { scale: 0.9, rotate: 0, opacity: 0 };
    return (
        <motion.span
            ref={ref}
            initial={hidden}
            animate={on ? shown : hidden}
            whileHover={reduce ? undefined : { scale: 1.03 }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                "inline-block rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-[20px]",
                "font-serif-elegant italic font-normal",
                lime ? "text-[#DAFF6B]" : "text-[#F5F5F0]",
                className ?? "px-[0.45em] py-[0.05em]"
            )}
            style={lime ? { textShadow: EDITORIAL.limeGlow } : undefined}
        >
            {children}
        </motion.span>
    );
}

/* -------------------------------------------------------------- burbuja */
export function IconBubble({
    children,
    className,
    delay = 0,
    float = 3.5,
    active,
    size = "0.9em",
    tone = "lime",
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    float?: number;
    active?: boolean;
    size?: string;
    /** El icono va en lima por defecto; "white" para secciones sin acento. */
    tone?: "lime" | "white";
}) {
    const reduce = useReducedMotion();
    const { ref, on } = useReveal(active);
    const shown = { scale: 1, opacity: 1 };
    const hidden = { scale: 0, opacity: 0 };
    // El ref va en un contenedor de tamaño FIJO, no en el elemento que anima:
    // la burbuja arranca en scale 0, y un elemento de área cero nunca
    // intersecta, así que IntersectionObserver jamás la revelaría.
    return (
        <span
            ref={ref}
            aria-hidden="true"
            style={{ width: size, height: size }}
            className={cn("absolute z-20", className)}
        >
        <motion.span
            initial={hidden}
            animate={on ? shown : hidden}
            transition={{ duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ backgroundColor: EDITORIAL.bubbleBg }}
            className="grid h-full w-full place-items-center rounded-full border border-white/[0.08]"
        >
            <motion.svg
                viewBox="0 0 24 24"
                fill="none"
                stroke={tone === "white" ? "#FFFFFF" : EDITORIAL.lime}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[47%] w-[47%]"
                style={{
                    filter:
                        tone === "white"
                            ? "drop-shadow(0 0 12px rgba(255,255,255,0.55))"
                            : EDITORIAL.iconGlow,
                }}
                animate={reduce ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: float, delay, repeat: Infinity, ease: "easeInOut" }}
            >
                {children}
            </motion.svg>
        </motion.span>
        </span>
    );
}
