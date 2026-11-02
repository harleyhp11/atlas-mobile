'use client';

import { useEffect, useRef } from 'react';

/* La cinta «PLANES / Y PRECIOS» que abre #planes: dos lineas de letra
   enorme que entran cada una desde un lado de la pantalla y se cruzan con
   el scroll, como el titular de la entrada (pedido de Harley).

   Se mueve con el avance de la cinta por la pantalla (--p): 0 cuando asoma
   por abajo, ~0,9 cuando llega arriba (ahi quedan centradas, que es donde
   la deja la flecha de la intro) y sigue un poco al salir. Un rAF por
   scroll y solo mientras esta en pantalla. Decorativa: el titular de la
   seccion es el h2 de abajo. Con movimiento reducido queda quieta. */

export function CintaPlanes() {
    const cinta = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = cinta.current;
        if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let raf = 0;
        let visible = false;
        const pintar = () => {
            raf = 0;
            const r = el.getBoundingClientRect();
            const p = Math.min(1.25, Math.max(0, 1 - r.top / innerHeight));
            el.style.setProperty('--p', p.toFixed(4));
        };
        const pedir = () => {
            if (visible && !raf) raf = requestAnimationFrame(pintar);
        };
        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            pedir();
        });
        io.observe(el);
        pintar();
        addEventListener('scroll', pedir, { passive: true });
        addEventListener('resize', pedir);
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            removeEventListener('scroll', pedir);
            removeEventListener('resize', pedir);
        };
    }, []);

    return (
        <div ref={cinta} className="pre-pl-cinta" aria-hidden="true">
            <span className="pre-pl-cinta-l1">Planes</span>
            <span className="pre-pl-cinta-l2">
                <em>y</em> precios
            </span>
        </div>
    );
}
