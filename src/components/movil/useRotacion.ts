'use client';

import { useEffect, useState, type RefObject } from 'react';

/* Indice de la palabra rotativa del hero. Avanza cada `ms` solo mientras el
   hero se ve y la pestaña esta al frente; con movimiento reducido no rota:
   se queda la primera palabra, quieta y legible. */
export function useRotacion(total: number, ms: number, ref: RefObject<Element | null>) {
    const [i, setI] = useState(0);
    useEffect(() => {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let visible = true;
        const el = ref.current;
        const io = el
            ? new IntersectionObserver(([e]) => {
                  visible = e.isIntersecting;
              })
            : null;
        if (el && io) io.observe(el);
        const id = window.setInterval(() => {
            if (visible && !document.hidden) setI((v) => (v + 1) % total);
        }, ms);
        return () => {
            window.clearInterval(id);
            io?.disconnect();
        };
    }, [total, ms, ref]);
    return i;
}
