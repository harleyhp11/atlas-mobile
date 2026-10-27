import type { CSSProperties } from 'react';
import { FIGMA, FRAMER } from '../logos';
import { Reel } from './Reel';

/* Despues de los cinco proyectos, sobre negro: los diseños de la galeria
   de Atlas en el reel curvo, con el titulo "Nuestros diseños en Figma ×
   Framer" y los logos reales de las dos herramientas, que se arman al
   entrar (Revelador pone .is-in): las cinco piezas de Figma caen una por
   una y las tres de Framer llegan desde distintos lados. */

export function Disenos() {
    return (
        <section className="pry-reel" data-tono="oscuro" aria-labelledby="pry-reel-t">
            <div className="m-wrap pry-reel-barra m-mono" aria-hidden="true">
                <span>
                    <i />
                    Reel Atlas ®
                </span>
                <b>+</b>
                <span>
                    Archivo — Nº 09
                    <i />
                </span>
            </div>

            <h2 id="pry-reel-t" className="m-wrap pry-reel-t" data-in>
                <span className="pry-reel-l1">Nuestros diseños en</span>
                <span className="pry-reel-l2">
                    <span className="pry-reel-marca">
                        <svg className="pry-logo pry-logo--figma" viewBox="0 0 38 57" aria-hidden="true">
                            {FIGMA.map((p, i) => (
                                <path key={i} d={p.d} fill={p.c} style={{ '--i': i } as CSSProperties} />
                            ))}
                        </svg>
                        Figma
                    </span>
                    <span className="pry-reel-x" aria-label="y">
                        ×
                    </span>
                    <span className="pry-reel-marca">
                        <svg className="pry-logo pry-logo--framer" viewBox="0 0 24 24" aria-hidden="true">
                            {FRAMER.map((d, i) => (
                                <path key={i} d={d} style={{ '--i': i } as CSSProperties} />
                            ))}
                        </svg>
                        Framer
                    </span>
                </span>
            </h2>

            <Reel />

            <p className="m-wrap pry-reel-pie m-mono">
                <span>Piezas de la galería de Atlas</span>
                <span>Desliza ↔</span>
            </p>
        </section>
    );
}
