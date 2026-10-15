'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PERDIDAS } from '../datos';
import { UI_PERDIDA } from '../escenas/Perdidas';
import { Flecha } from '../iconos';
import './carrusel.css';

/* "Lo que pierdes sin web" como carrusel de producto: tres tarjetas con su
   mini-interfaz, la siguiente asomando por la derecha y el indicador
   "01 / 03". Scroll nativo con snap; las flechas solo ayudan.

   `textos={false}` deja cada tarjeta en etiqueta + titulo: la animacion ya
   cuenta la historia (asi lo pidio Harley para la home). */

const dos = (n: number) => String(n).padStart(2, '0');

export function CarruselPerdidas({ textos = true }: { textos?: boolean }) {
    const pista = useRef<HTMLDivElement>(null);
    const [i, setI] = useState(0);

    useEffect(() => {
        const el = pista.current;
        if (!el) return;
        let pedido = false;
        const leer = () => {
            pedido = false;
            const carta = el.firstElementChild as HTMLElement | null;
            if (!carta) return;
            const paso = carta.offsetWidth + 12;
            setI(Math.max(0, Math.min(PERDIDAS.length - 1, Math.round(el.scrollLeft / paso))));
        };
        const alScroll = () => {
            if (!pedido) {
                pedido = true;
                requestAnimationFrame(leer);
            }
        };
        el.addEventListener('scroll', alScroll, { passive: true });
        return () => el.removeEventListener('scroll', alScroll);
    }, []);

    const ir = (k: number) => {
        const el = pista.current;
        const carta = el?.firstElementChild as HTMLElement | null;
        if (!el || !carta) return;
        const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollTo({ left: k * (carta.offsetWidth + 12), behavior: reducido ? 'auto' : 'smooth' });
    };

    return (
        <div className={`b-carrusel${textos ? '' : ' b-carrusel--titulos'}`} role="region" aria-roledescription="carrusel" aria-label="Lo que pierdes sin web">
            <div ref={pista} className="b-carrusel-pista">
                {PERDIDAS.map((p, k) => {
                    const Ui = UI_PERDIDA[p.clave];
                    return (
                        <div
                            key={p.clave}
                            className="b-carta"
                            role="group"
                            aria-roledescription="diapositiva"
                            aria-label={`${k + 1} de ${PERDIDAS.length}: ${p.label}`}
                        >
                            <div className="b-carta-ui">
                                <Ui />
                            </div>
                            <div className="b-carta-txt">
                                <span className="m-mono b-carta-lbl">
                                    <i className="m-ping" aria-hidden="true" />
                                    {p.label}
                                </span>
                                <h3 className="b-carta-t">{p.titulo}</h3>
                                {textos && <p>{p.texto}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="b-carrusel-pie">
                <span className="m-mono b-carrusel-n" aria-live="polite">
                    {dos(i + 1)} / {dos(PERDIDAS.length)}
                </span>
                <span className="b-carrusel-barra" aria-hidden="true">
                    <i style={{ '--k': i, '--n': PERDIDAS.length } as CSSProperties} />
                </span>
                <span className="b-carrusel-flechas">
                    <button type="button" aria-label="Anterior" onClick={() => ir(Math.max(0, i - 1))} disabled={i === 0}>
                        <Flecha />
                    </button>
                    <button type="button" aria-label="Siguiente" onClick={() => ir(Math.min(PERDIDAS.length - 1, i + 1))} disabled={i === PERDIDAS.length - 1}>
                        <Flecha />
                    </button>
                </span>
            </div>
        </div>
    );
}
