'use client';

import { useEffect, useRef, useState } from 'react';
import { Boton } from '../Boton';
import { Firma } from '../Firma';
import { CHIPS_CONFIANZA, H1_ESTABLE, ROTATIVAS, SUBTITULO, WHATSAPP } from '../datos';
import { useRotacion } from '../useRotacion';
import './hero.css';

/* Hero de la home movil (la direccion "Cine" del laboratorio).

   Pantalla completa en blanco y negro: el loop del tunel de luz del hero de
   escritorio, recortado en vertical (614 KB) con su poster de 14 KB pintado
   primero como imagen. El texto vive abajo, en la zona del pulgar:
   "hacemos / webs" con la firma roja encima, y al cerrar el ciclo
   "somos / atlas®".

   La palabra gigante es UN solo elemento que cambia de texto: sale con
   desenfoque, cambia y vuelve a entrar. Con un elemento por palabra, cada
   palabra nueva que asomaba era para Chrome un candidato nuevo a LCP, y el
   LCP del laboratorio se iba a los 3,5 s aunque la pagina pintaba en 1,2 s.
   La firma hace lo mismo (ver Firma.tsx). */

const SALIDA_MS = 380;

export function HeroInicio({ trabajos = '/projects' }: { trabajos?: string }) {
    const raiz = useRef<HTMLElement>(null);
    const objetivo = useRotacion(ROTATIVAS.length, 2800, raiz);
    const [mostrada, setMostrada] = useState(0);
    const [fase, setFase] = useState<'in' | 'out'>('in');

    useEffect(() => {
        if (objetivo === mostrada) return;
        setFase('out');
        const t = window.setTimeout(() => {
            setMostrada(objetivo);
            setFase('in');
        }, SALIDA_MS);
        return () => window.clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objetivo]);

    const actual = ROTATIVAS[mostrada];
    const esMarca = actual.palabra === 'atlas®';

    return (
        <section className="h-hero" data-tono="oscuro" ref={raiz} aria-labelledby="h1">
            <h1 id="h1" className="sr-only">
                {H1_ESTABLE}
            </h1>
            <div className="h-hero-media" aria-hidden="true">
                <img src="/assets/movil/hero-cine.webp" width={540} height={960} alt="" fetchPriority="high" />
                <video data-src="/assets/movil/hero-cine.mp4" poster="/assets/movil/hero-cine.webp" muted playsInline loop preload="none" />
                <i className="h-hero-velo" />
            </div>

            <div className="m-wrap h-hero-in">
                <p className="h-badge">
                    <i className="m-ping m-ping--siempre" data-loop aria-hidden="true" />
                    Disponibles para proyectos<span className="h-badge-lugar"> · Lima, Perú</span>
                </p>

                <div className="h-titulo" aria-hidden="true">
                    <span className="h-pre">
                        <span className={esMarca ? '' : 'is-on'}>hacemos</span>
                        <span className={esMarca ? 'is-on' : ''}>somos</span>
                    </span>
                    <span className="h-palabras">
                        <span className="h-palabra" data-fase={fase} data-larga={actual.palabra.length > 6 ? '' : undefined}>
                            {actual.palabra}
                        </span>
                    </span>
                    <span className="h-firma" data-fase={fase}>
                        <Firma texto={actual.firma} par={mostrada} ancho={70} />
                    </span>
                </div>

                <p className="h-sub m-p">{SUBTITULO}</p>

                <div className="h-ctas">
                    <Boton href={WHATSAPP} externo tinta>
                        Empezar un proyecto
                    </Boton>
                    <Boton href={trabajos} variante="fantasma" abajo>
                        Ver trabajos
                    </Boton>
                </div>

                <ul className="m-chips h-chips" aria-label="Por qué escribirnos">
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
