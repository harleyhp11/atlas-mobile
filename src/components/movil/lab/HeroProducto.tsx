'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Boton } from '../Boton';
import { Firma } from '../Firma';
import { CHIPS_CONFIANZA, H1_ESTABLE, ROTATIVAS, SUBTITULO, WHATSAPP } from '../datos';
import { Estrella, Flecha } from '../iconos';
import { useRotacion } from '../useRotacion';

/* DIRECCION B · "Producto" — hero.

   Atlas como estudio de producto: la palabra rotativa vive dentro de un
   selector de interfaz (pildora blanca con su flecha) que rueda como un
   rodillo y cambia de ancho a la palabra nueva. Debajo, un bento con piezas
   de verdad: la foto del monolito, el precio desde S/ 400, la entrega en
   semanas y la respuesta en 24 h, con el resplandor rojo subiendo desde
   abajo. */

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function HeroProducto() {
    const raiz = useRef<HTMLElement>(null);
    const medidor = useRef<HTMLSpanElement>(null);
    const i = useRotacion(ROTATIVAS.length, 2600, raiz);
    const [anchos, setAnchos] = useState<number[] | null>(null);

    useIso(() => {
        const m = medidor.current;
        if (!m) return;
        const medir = () => {
            setAnchos(
                ROTATIVAS.map((r) => {
                    m.textContent = r.palabra;
                    return Math.ceil(m.getBoundingClientRect().width);
                })
            );
        };
        medir();
        document.fonts?.ready.then(medir);
        window.addEventListener('resize', medir);
        return () => window.removeEventListener('resize', medir);
    }, []);

    const actual = ROTATIVAS[i];

    return (
        <section className="b-hero" data-tono="oscuro" ref={raiz} aria-labelledby="h1">
            <h1 id="h1" className="sr-only">
                {H1_ESTABLE}
            </h1>
            <div className="m-wrap b-hero-in">
                <a className="b-badge" href="/servicios">
                    <span className="b-badge-punto" aria-hidden="true">
                        <i className="m-ping m-ping--siempre" data-loop />
                    </span>
                    Precio cerrado por escrito
                    <Flecha />
                </a>

                <div className="b-titulo" aria-hidden="true">
                    <span ref={medidor} className="b-medidor" />
                    <span className="b-selector" style={anchos ? { width: `${anchos[i] + 88}px` } : undefined}>
                        <span className="b-selector-ventana">
                            <span className="b-selector-pista" style={{ translate: `0 ${-i * 1.1}em` }}>
                                {ROTATIVAS.map((r) => (
                                    <span key={r.palabra}>{r.palabra}</span>
                                ))}
                            </span>
                        </span>
                        <span className="b-selector-flecha">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m4 6 4 4 4-4" />
                            </svg>
                        </span>
                    </span>
                    <span className="b-firma">
                        <Firma key={i} texto={actual.firma} ancho={86} />
                    </span>
                </div>

                <p className="b-sub m-p">{SUBTITULO}</p>

                <div className="b-ctas">
                    <Boton href={WHATSAPP} externo>
                        Empezar un proyecto
                    </Boton>
                    <Boton href="/projects" variante="fantasma" abajo>
                        Ver trabajos
                    </Boton>
                </div>

                <ul className="m-chips b-chips" aria-label="Por qué escribirnos">
                    {CHIPS_CONFIANZA.map((c) => (
                        <li key={c} className="m-chip">
                            {c}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="m-wrap b-bento">
                <figure className="b-bt b-bt--foto" data-rv="img" style={{ '--r': '26px' } as React.CSSProperties}>
                    <img src="/assets/movil/monolito-alto.webp" width={600} height={800} alt="Teléfono con la marca Atlas sobre una roca, bajo focos de luz" loading="lazy" decoding="async" />
                    <figcaption className="b-bt-chip">
                        <i className="m-ping" aria-hidden="true" />
                        Estudio digital · Lima
                    </figcaption>
                </figure>

                <div className="b-bt b-bt--blanca" data-rv style={{ '--d': '0.1s' } as React.CSSProperties}>
                    <span className="b-bt-lbl">Desde</span>
                    <strong>
                        S/ <span data-cuenta="400">400</span>
                    </strong>
                    <span className="b-bt-txt">Precio cerrado por escrito antes de empezar.</span>
                </div>

                <div className="b-bt b-bt--barras" data-rv style={{ '--d': '0.18s' } as React.CSSProperties}>
                    <span className="b-bt-lbl">Entrega</span>
                    <strong>2–4 sem.</strong>
                    <span className="b-barras" aria-hidden="true">
                        {[34, 52, 70, 100].map((h, k) => (
                            <i key={k} style={{ '--h': `${h}%`, '--k': k } as React.CSSProperties} />
                        ))}
                    </span>
                    <span className="b-barras-pie" aria-hidden="true">
                        <span>Brief</span>
                        <span>Web en vivo</span>
                    </span>
                </div>

                <div className="b-bt b-bt--insignia" data-rv style={{ '--d': '0.24s' } as React.CSSProperties}>
                    <span className="b-insignia" aria-hidden="true">
                        <Estrella />
                    </span>
                    <span>
                        <strong>Respuesta en menos de 24 h</strong>
                        <span className="b-bt-txt">Hablas directo con quien diseña y programa.</span>
                    </span>
                </div>
            </div>
        </section>
    );
}
