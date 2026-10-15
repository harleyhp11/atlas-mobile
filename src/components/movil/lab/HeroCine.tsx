'use client';

import { useRef } from 'react';
import { Boton } from '../Boton';
import { Firma } from '../Firma';
import { CHIPS_CONFIANZA, H1_ESTABLE, ROTATIVAS, SUBTITULO, WHATSAPP } from '../datos';
import { useRotacion } from '../useRotacion';

/* DIRECCION C · "Cine" — hero.

   Pantalla completa en blanco y negro: el loop del tunel de luz del hero de
   escritorio, recortado en vertical (614 KB, con poster de 12 KB que se pinta
   primero como imagen). El texto vive abajo, en la zona del pulgar: "hacemos
   / webs" con la firma roja encima, y al cerrar el ciclo "somos / atlas®". */

export function HeroCine() {
    const raiz = useRef<HTMLElement>(null);
    const i = useRotacion(ROTATIVAS.length, 2800, raiz);
    const actual = ROTATIVAS[i];
    const esMarca = actual.palabra === 'atlas®';

    return (
        <section className="c-hero" data-tono="oscuro" ref={raiz} aria-labelledby="h1">
            <h1 id="h1" className="sr-only">
                {H1_ESTABLE}
            </h1>
            <div className="c-hero-media" aria-hidden="true">
                <img src="/assets/movil/hero-cine.webp" width={540} height={960} alt="" fetchPriority="high" />
                <video data-src="/assets/movil/hero-cine.mp4" poster="/assets/movil/hero-cine.webp" muted playsInline loop preload="none" />
                <i className="c-hero-velo" />
            </div>

            <div className="m-wrap c-hero-in">
                <p className="c-badge">
                    <i className="m-ping m-ping--siempre" data-loop aria-hidden="true" />
                    Disponibles para proyectos · Lima, Perú
                </p>

                <div className="c-titulo" aria-hidden="true">
                    <span className="c-pre">
                        <span className={esMarca ? '' : 'is-on'}>hacemos</span>
                        <span className={esMarca ? 'is-on' : ''}>somos</span>
                    </span>
                    <span className="c-palabras">
                        {ROTATIVAS.map((r, k) => (
                            <span key={r.palabra} className={k === i ? 'is-on' : ''}>
                                {r.palabra}
                            </span>
                        ))}
                    </span>
                    <span className="c-firma">
                        <Firma key={i} texto={actual.firma} ancho={70} />
                    </span>
                </div>

                <p className="c-sub m-p">{SUBTITULO}</p>

                <div className="c-ctas">
                    <Boton href={WHATSAPP} externo>
                        Empezar un proyecto
                    </Boton>
                    <Boton href="/projects" variante="fantasma" abajo>
                        Ver trabajos
                    </Boton>
                </div>

                <ul className="m-chips c-chips" aria-label="Por qué escribirnos">
                    {CHIPS_CONFIANZA.map((c) => (
                        <li key={c} className="m-chip">
                            {c}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
