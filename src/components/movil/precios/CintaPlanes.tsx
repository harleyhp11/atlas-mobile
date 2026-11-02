'use client';

import { useEffect, useRef } from 'react';

/* La cinta «PLANES / Y PRECIOS» al pie de la entrada, donde antes iba la
   flecha (pedido de Harley): aparece cuando termina la animacion, cada linea
   entrando desde un lado de la pantalla, y toda ella es el enlace a #planes.

   Al bajar, las dos lineas se siguen abriendo cada una hacia su lado (--corre,
   en px, con el scroll), como el titular de la entrada. Un rAF por scroll y
   solo mientras se ve. Con movimiento reducido aparece quieta. */

export function CintaPlanes() {
    const cinta = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const el = cinta.current;
        if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let raf = 0;
        let visible = true;
        const pintar = () => {
            raf = 0;
            el.style.setProperty('--corre', `${Math.min(innerWidth, scrollY * 0.6).toFixed(1)}px`);
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
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            removeEventListener('scroll', pedir);
        };
    }, []);

    return (
        <a ref={cinta} className="pre-cinta" href="#planes" aria-label="Ver planes y precios">
            <span className="pre-cinta-l1" aria-hidden="true">
                <span>Planes</span>
            </span>
            <span className="pre-cinta-l2" aria-hidden="true">
                <span>
                    <em>y</em> precios
                </span>
            </span>
        </a>
    );
}
