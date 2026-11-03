'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Escena } from '../../escenas/Escenas';
import { Titular } from '../../Titular';
import type { Detalle } from '../planes';
import { Casa, Pausa, Reproducir } from './Iconos';
import { MaquetaLanding } from './MaquetaLanding';
import { MaquetaWeb } from './MaquetaWeb';

/* D5 · «Por dentro»: como se ve y de que partes esta hecho lo que compras.

   Arriba, la maqueta animada del servicio (las mismas mini-interfaces de la
   home). Import ESTATICO a proposito: cargar su CSS despues del primer
   pintado dispara recalculos de estilo de mas de 1 s en celulares lentos
   (gotcha del proyecto). El escenario tiene alto fijo, asi que nada salta.
   Solo corre si se ve (IntersectionObserver, 35 %), si nadie la pauso y sin
   movimiento reducido. El alto del escenario depende de la escena
   (data-escena): el panel del software necesita mas que el resto para que
   entren las barras de la semana.

   La Landing tiene su propia maqueta (MaquetaLanding): una landing real
   entera, del anuncio al contacto que te llega (pedido de Harley: la escena
   del navegador quedaba simple), y la Web tambien (MaquetaWeb): una web
   completa recorrida de Google al contacto. La pildora «$ next build» del FAQ se oculta: es jerga de
   programador y tapaba la foto. Lleva SIEMPRE la pildora «Maqueta de ejemplo»: la
   del catalogo muestra precios de mentira («S/ 32») y en una pagina de
   precios se confundirian con los de verdad.

   Debajo, la hoja blanca de «las partes» (ref 35), con una forma propia
   por plan (a Harley no le gusta la misma animacion para todo):
     · recorrido (tienda) — el camino del pedido, del QR a tu WhatsApp; un
       trazo rojo lo recorre de arriba abajo;
     · bandas (landing)   — una misma pagina vista de arriba abajo: en cada
       fila se marca la banda que toca;
     · arbol (web)        — el mapa del sitio: el inicio y sus paginas;
     · modulos (software) — piezas sueltas que se eligen segun tu proceso.
   Las partes son EJEMPLOS (lo dice la pildora y, donde hace falta, la
   nota): el alcance real se define contigo. */

export function PorDentro({ d }: { d: Detalle }) {
    const { dentro } = d;
    const escenario = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [pausa, setPausa] = useState(false);
    const [reducido, setReducido] = useState(false);

    useEffect(() => {
        const mq = matchMedia('(prefers-reduced-motion: reduce)');
        const leer = () => setReducido(mq.matches);
        leer();
        mq.addEventListener('change', leer);
        const el = escenario.current;
        let io: IntersectionObserver | null = null;
        if (el) {
            io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
            io.observe(el);
        }
        return () => {
            mq.removeEventListener('change', leer);
            io?.disconnect();
        };
    }, []);

    const run = visible && !pausa && !reducido;
    const arbol = dentro.forma === 'arbol';
    const [raiz, ...hojas] = dentro.partes;
    const Lista = dentro.forma === 'recorrido' || dentro.forma === 'bandas' ? 'ol' : 'ul';

    return (
        <section id="por-dentro" className="pre-dt-sec pre-dt-dentro" data-tono="oscuro" aria-labelledby="dentro-t">
            <div className="m-wrap">
                {/* el marco de Figma y no la caja roja: el rojo queda para
                    «¿Es para ti?» y el cierre */}
                <Titular id="dentro-t" className="pre-dt-t" texto={dentro.titular} destacar={dentro.destacar} modo="marco" />

                {/* la maqueta con su barra de reproductor debajo: la pildora
                    «Maqueta de ejemplo» y la pausa van fuera de la escena, para
                    no taparle nada */}
                <figure className="pre-dt-esc" data-rv>
                    <div ref={escenario} className="pre-dt-esc-ui" data-escena={d.escena} data-plan={d.slug} aria-hidden="true">
                        {d.slug === 'landing-page' ? (
                            <MaquetaLanding run={run} />
                        ) : d.slug === 'web-corporativa' ? (
                            <MaquetaWeb run={run} />
                        ) : (
                            <Escena tipo={d.escena} tema="oscuro" run={run} />
                        )}
                    </div>
                    <figcaption className="pre-dt-esc-pie">
                        <span className="pre-dt-esc-pildora m-mono" data-run={run ? '' : undefined}>
                            <i aria-hidden="true" />
                            Maqueta de ejemplo
                        </span>
                        {!reducido && (
                            <button type="button" className="pre-dt-esc-pausa" aria-pressed={pausa} aria-label="Pausar la maqueta" onClick={() => setPausa((p) => !p)}>
                                {pausa ? <Reproducir /> : <Pausa />}
                            </button>
                        )}
                    </figcaption>
                </figure>

                <div className="pre-dt-partes m-claro" data-tono="claro" data-forma={dentro.forma} data-rv>
                    <div className="pre-dt-partes-cab">
                        <h3>{dentro.cabecera}</h3>
                        {/* [CONFIRMAR copy con Harley] */}
                        <span className="pre-dt-pildora">Ejemplo</span>
                    </div>

                    {arbol ? (
                        <div className="pre-dt-arbol" data-in>
                            <div className="pre-dt-parte pre-dt-arbol-raiz">
                                <span className="pre-dt-parte-marca" aria-hidden="true">
                                    <Casa />
                                </span>
                                <span className="pre-dt-parte-txt">
                                    <b>{raiz.t}</b>
                                    <span>{raiz.d}</span>
                                </span>
                            </div>
                            <ul aria-label={`Páginas dentro de ${raiz.t}`}>
                                {hojas.map((p, k) => (
                                    <li key={p.t} className="pre-dt-parte" style={{ '--i': k + 1 } as CSSProperties}>
                                        <span className="pre-dt-parte-marca" aria-hidden="true">
                                            <i />
                                        </span>
                                        <span className="pre-dt-parte-txt">
                                            <b>{p.t}</b>
                                            <span>{p.d}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <Lista className="pre-dt-partes-lista" data-in>
                            {dentro.partes.map((p, k) => (
                                <li key={p.t} className="pre-dt-parte" style={{ '--i': k } as CSSProperties}>
                                    <span className="pre-dt-parte-marca" aria-hidden="true">
                                        {dentro.forma === 'bandas' ? (
                                            <span className="pre-dt-mini">
                                                {dentro.partes.map((_, b) => (
                                                    <i key={b} data-on={b === k ? '' : undefined} />
                                                ))}
                                            </span>
                                        ) : (
                                            String(k + 1)
                                        )}
                                    </span>
                                    <span className="pre-dt-parte-txt">
                                        <b>{p.t}</b>
                                        <span>{p.d}</span>
                                    </span>
                                </li>
                            ))}
                        </Lista>
                    )}

                    {dentro.nota && <p className="pre-dt-partes-nota">{dentro.nota}</p>}
                </div>
            </div>
        </section>
    );
}
