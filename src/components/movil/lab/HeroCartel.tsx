'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Boton } from '../Boton';
import { Firma } from '../Firma';
import { CHIPS_CONFIANZA, H1_ESTABLE, ROTATIVAS, SUBTITULO, WHATSAPP } from '../datos';
import { useRotacion } from '../useRotacion';

/* DIRECCION A · "Manifiesto" — hero.

   La palabra ES la imagen: cada palabra rotativa se ajusta al ancho de la
   pantalla, dentro del recuadro de seleccion de Figma, y la etiqueta roja
   mide en vivo lo que ocupa ("webs 350 × 141"). Al cambiar de palabra el
   recuadro se estira o encoge hasta la nueva, y la firma roja se escribe
   otra vez debajo.

   Sin JS (o antes de medir) se ve "webs" a un tamaño aproximado por CSS y el
   recuadro no aparece: nada salta, solo falta el adorno. */

const MAX = 168; // px: tope para palabras cortas como "IA"
const LH = 0.9;

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function HeroCartel() {
    const raiz = useRef<HTMLDivElement>(null);
    const caja = useRef<HTMLDivElement>(null);
    const medidor = useRef<HTMLSpanElement>(null);
    const i = useRotacion(ROTATIVAS.length, 2900, raiz);
    const [tam, setTam] = useState<{ fs: number[]; w: number[]; alto: number } | null>(null);
    const [mostrado, setMostrado] = useState<[number, number]>([0, 0]);
    const mostradoRef = useRef<[number, number]>([0, 0]);

    // Ajuste al ancho: se mide cada palabra a 100 px y se escala.
    useIso(() => {
        const c = caja.current;
        const m = medidor.current;
        if (!c || !m) return;
        const medir = () => {
            const ancho = c.clientWidth;
            if (!ancho) return;
            const fs: number[] = [];
            const w: number[] = [];
            ROTATIVAS.forEach((r) => {
                m.textContent = r.palabra;
                const w100 = m.getBoundingClientRect().width || 1;
                const f = Math.min(MAX, ((ancho * 0.985) / w100) * 100);
                fs.push(f);
                w.push((w100 * f) / 100);
            });
            setTam({ fs, w, alto: Math.max(...fs) * LH });
        };
        medir();
        const ro = new ResizeObserver(medir);
        ro.observe(c);
        document.fonts?.ready.then(medir);
        return () => ro.disconnect();
    }, []);

    // La etiqueta cuenta hasta la medida de la palabra activa.
    useEffect(() => {
        if (!tam) return;
        const hasta: [number, number] = [Math.round(tam.w[i]), Math.round(tam.fs[i] * LH)];
        const desde = mostradoRef.current;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
            mostradoRef.current = hasta;
            setMostrado(hasta);
            return;
        }
        let raf = 0;
        const t0 = performance.now();
        const paso = (t: number) => {
            const p = Math.min(1, (t - t0) / 800);
            const e = 1 - (1 - p) ** 3;
            const v: [number, number] = [
                Math.round(desde[0] + (hasta[0] - desde[0]) * e),
                Math.round(desde[1] + (hasta[1] - desde[1]) * e),
            ];
            mostradoRef.current = v;
            setMostrado(v);
            if (p < 1) raf = requestAnimationFrame(paso);
        };
        raf = requestAnimationFrame(paso);
        return () => cancelAnimationFrame(raf);
    }, [i, tam]);

    const actual = ROTATIVAS[i];

    return (
        <section className="a-hero" data-tono="oscuro" ref={raiz} aria-labelledby="h1">
            <h1 id="h1" className="sr-only">
                {H1_ESTABLE}
            </h1>

            <div className="m-wrap a-hero-in">
                <p className="a-badge m-mono">
                    <i className="m-ping m-ping--siempre" data-loop aria-hidden="true" />
                    Disponibles para proyectos · Lima, Perú
                </p>

                <div className="a-regla" aria-hidden="true">
                    {['0', '100', '200', '300'].map((n) => (
                        <span key={n}>{n}</span>
                    ))}
                </div>

                <div
                    ref={caja}
                    className={`a-palabra${tam ? ' is-medida' : ''}`}
                    style={tam ? { height: `${tam.alto}px` } : undefined}
                    aria-hidden="true"
                >
                    <span ref={medidor} className="a-medidor" />
                    {ROTATIVAS.map((r, k) => (
                        <span
                            key={r.palabra}
                            className={`a-palabra-txt${k === i ? ' is-on' : ''}`}
                            style={tam ? { fontSize: `${tam.fs[k]}px` } : undefined}
                        >
                            {r.palabra}
                        </span>
                    ))}
                    {tam && (
                        <span
                            className="a-marco"
                            style={{ width: `${tam.w[i]}px`, height: `${tam.fs[i] * LH}px` }}
                        >
                            <i />
                            <i />
                            <i />
                            <i />
                            <i />
                            <em className="a-marco-etq">
                                <span>{actual.palabra.replace('®', '')}</span>
                                <b>
                                    {mostrado[0]} × {mostrado[1]}
                                </b>
                            </em>
                        </span>
                    )}
                </div>

                <p className="a-firma-linea" aria-hidden="true">
                    <Firma key={i} texto={actual.firma} ancho={88} />
                </p>

                <p className="a-sub m-p">{SUBTITULO}</p>

                <div className="a-ctas">
                    <Boton href={WHATSAPP} externo>
                        Empezar un proyecto
                    </Boton>
                    <Boton href="/projects" variante="fantasma" abajo>
                        Ver trabajos
                    </Boton>
                </div>

                <ul className="m-chips a-chips" aria-label="Por qué escribirnos">
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
