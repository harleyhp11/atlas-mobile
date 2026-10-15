'use client';

import { useEffect, useRef } from 'react';

/* La escultura del pie: el simbolo de Atlas (rampa + cuadrado) en metal
   grafito cepillado, rehecho con decenas de miles de particulas en la GPU.
   Siempre esta en movimiento: una mano invisible la recorre y la vuelve
   liquida; con el dedo la remueves tu, y al soltar se vuelve a armar.

   Lo pesado (el motor WebGL2) se pide con import() recien cuando el pie se
   acerca a la pantalla. Hasta entonces, y si no hay WebGL2 o el celular
   esta en ahorro de datos, se ve la imagen fija: la misma pieza, quieta. */

const SRC = '/assets/movil/pie-escultura.webp';

export function EsculturaAtlas() {
    const escena = useRef<HTMLDivElement>(null);
    const escenario = useRef<HTMLDivElement>(null);
    const forma = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const el = escena.current;
        const capa = escenario.current;
        const img = forma.current;
        if (!el || !capa || !img) return;
        const red = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
        if (red?.saveData || typeof WebGL2RenderingContext === 'undefined') return;

        let vivo = true;
        let desmontar: (() => void) | undefined;
        const io = new IntersectionObserver(
            (entradas) => {
                if (!entradas.some((e) => e.isIntersecting)) return;
                io.disconnect();
                import('./motor-liquido')
                    .then(({ montarEscultura }) => {
                        if (vivo) desmontar = montarEscultura({ escena: el, escenario: capa, forma: img, src: SRC });
                    })
                    .catch(() => {
                        el.dataset.gl = 'off';
                    });
            },
            { rootMargin: '0px 0px 60% 0px' }
        );
        io.observe(el);
        return () => {
            vivo = false;
            io.disconnect();
            desmontar?.();
        };
    }, []);

    return (
        <div ref={escena} className="h-pie-escena">
            <p className="h-pie-fondo" aria-hidden="true">
                atlas
            </p>
            <div ref={escenario} className="h-pie-escenario">
                <img ref={forma} className="h-pie-forma" src={SRC} width={1040} height={768} alt="" loading="lazy" decoding="async" draggable={false} />
            </div>
            <p className="h-pie-pista m-mono" aria-hidden="true">
                Toca la forma
            </p>
        </div>
    );
}
