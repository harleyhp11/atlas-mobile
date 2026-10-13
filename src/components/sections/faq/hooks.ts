"use client";

/* Ganchos de animacion de la seccion de preguntas.

   Salen del componente original de Reachwise (RwServices), pasados a
   TypeScript. Dos cambios de fondo:
     · el reloj compartido se apaga solo cuando nadie lo escucha; el original
       dejaba un requestAnimationFrame corriendo para siempre, incluso despues
       de salir de la pagina;
     · useReloj es nuevo: cada escena del acordeon es una pequeña pelicula en
       bucle, y se dibuja entera a partir de un unico tiempo t. Asi no hay
       decenas de setTimeout sueltos que se desincronizan entre si. */

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";

export const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const easeOut = (p: number) => 1 - (1 - p) ** 3;
export const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

/* Avance 0→1 entre dos instantes de la escena. */
export const tramo = (t: number, desde: number, dura: number) => clamp01((t - desde) / dura);

/* ---------------- reloj compartido (lecturas antes que escrituras) ---------------- */

type Fn = (t: number) => void;
const reloj = { subs: new Set<Fn>(), reads: new Set<Fn>(), id: 0 };

function bucle(t: number) {
    reloj.reads.forEach((f) => f(t));
    reloj.subs.forEach((f) => f(t));
    reloj.id = reloj.subs.size ? requestAnimationFrame(bucle) : 0;
}

export function tick(write: Fn, read?: Fn) {
    reloj.subs.add(write);
    if (read) reloj.reads.add(read);
    if (!reloj.id) reloj.id = requestAnimationFrame(bucle);
    return () => {
        reloj.subs.delete(write);
        if (read) reloj.reads.delete(read);
    };
}

/* ---------------- tiempo de escena ----------------
   Devuelve los milisegundos transcurridos dentro del ciclo, en bucle. Parado
   (panel cerrado, seccion fuera de pantalla o movimiento reducido) devuelve
   `quieto`: el instante en que la escena se ve completa, que es lo que queda
   de fondo cuando no se anima. */
export function useReloj(run: boolean, ciclo: number, quieto: number) {
    const [t, setT] = useState(run ? 0 : quieto);
    useEffect(() => {
        if (!run) {
            setT(quieto);
            return;
        }
        let t0 = -1;
        setT(0);
        return tick((ahora) => {
            if (t0 < 0) t0 = ahora;
            setT((ahora - t0) % ciclo);
        });
    }, [run, ciclo, quieto]);
    return t;
}

/* ---------------- entrada ---------------- */

export function useReducedMotion() {
    const [r, set] = useState(false);
    useIso(() => {
        set(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }, []);
    return r;
}

/* "is-on": se activa UNA vez, cuando la seccion entra en pantalla. */
export function useInView(ref: RefObject<HTMLElement | null>, reduced: boolean) {
    const [on, set] = useState(false);
    useEffect(() => {
        if (reduced) {
            set(true);
            return;
        }
        const el = ref.current;
        if (!el) return;
        const th = Math.min(0.16, Math.max(0.005, (innerHeight * 0.3) / Math.max(1, el.offsetHeight)));
        const io = new IntersectionObserver(
            (es) => {
                for (const e of es)
                    if (e.isIntersecting) {
                        io.disconnect();
                        set(true);
                    }
            },
            { threshold: th, rootMargin: "0px 0px -6% 0px" }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [ref, reduced]);
    return on;
}

/* Si la seccion esta en pantalla AHORA. Las escenas solo corren mientras se
   ven: fuera de pantalla se quedan quietas y no gastan ni un fotograma. */
export function useVisible(ref: RefObject<HTMLElement | null>) {
    const [vis, set] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => set(e.isIntersecting));
        io.observe(el);
        return () => io.disconnect();
    }, [ref]);
    return vis;
}

/* Ancho del CONTENEDOR (no de la ventana): decide el modo del acordeon. */
export function useWidth(ref: RefObject<HTMLElement | null>) {
    const [w, set] = useState(1440);
    useIso(() => {
        const el = ref.current;
        if (!el) return;
        const ro = new ResizeObserver(([e]) => {
            const n = Math.round(e.borderBoxSize?.[0]?.inlineSize || el.offsetWidth);
            if (n > 0) set(n);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [ref]);
    return w;
}

/* Botones magneticos: hasta 8px hacia el cursor dentro de un radio de 150px. */
export function useMagnet(ref: RefObject<HTMLElement | null>) {
    useEffect(() => {
        const root = ref.current;
        if (!root || !matchMedia("(hover:hover) and (pointer:fine)").matches) return;
        const els = () => Array.from(root.querySelectorAll<HTMLElement>("[data-mag]"));
        const move = (e: PointerEvent) => {
            for (const b of els()) {
                const r = b.getBoundingClientRect();
                const dx = e.clientX - (r.left + r.width / 2);
                const dy = e.clientY - (r.top + r.height / 2);
                const d = Math.hypot(dx, dy);
                const k = d < 150 ? (1 - d / 150) * 8 : 0;
                b.style.setProperty("--mx", `${(dx / (d || 1)) * k}px`);
                b.style.setProperty("--my", `${(dy / (d || 1)) * k}px`);
            }
        };
        const leave = () =>
            els().forEach((b) => {
                b.style.setProperty("--mx", "0px");
                b.style.setProperty("--my", "0px");
            });
        root.addEventListener("pointermove", move);
        root.addEventListener("pointerleave", leave);
        return () => {
            root.removeEventListener("pointermove", move);
            root.removeEventListener("pointerleave", leave);
        };
    }, [ref]);
}
