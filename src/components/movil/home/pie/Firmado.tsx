import type { CSSProperties, ReactNode } from 'react';
import { RelojLima } from '../../Cabecera';
import { Firma } from '../../Firma';
import { SimboloAtlas } from '../../iconos';
import { FIGMA, FRAMER } from '../../logos';
import { Titular } from '../../Titular';

/* La firma del pie: "ESTUDIO DIGITAL" enorme, con stickers encima de las
   letras —el sello rojo de Atlas, Framer, Figma y una manito de cursor en
   pixeles— y "tu negocio, a otro nivel" escrito a mano debajo, como la firma
   roja del hero. Arriba, una pildora con la hora real de Lima.

   Al entrar (Revelador pone .is-in) las palabras suben, los stickers caen
   con un rebote corto y la firma se escribe; despues flotan apenas y la
   manito hace clic cada tanto. Fuera de pantalla se pausa (data-loop). */

// La manito clasica, fila por fila: k = contorno, w = relleno.
const MANO = [
    '.....kk..........',
    '....kwwk.........',
    '....kwwk.........',
    '....kwwk.........',
    '....kwwkkk.......',
    '....kwwkwwkkk....',
    '....kwwkwwkwwkkk.',
    '.kk.kwwkwwkwwkwwk',
    'kwwkkwwwwwwwwwwwk',
    'kwwwkwwwwwwwwwwwk',
    '.kwwwwwwwwwwwwwwk',
    '..kwwwwwwwwwwwwwk',
    '..kwwwwwwwwwwwwwk',
    '...kwwwwwwwwwwwk.',
    '...kwwwwwwwwwwwk.',
    '....kwwwwwwwwwk..',
    '....kkkkkkkkkkk..',
];
const trazo = (letra: string) =>
    MANO.flatMap((fila, y) => [...fila].map((c, x) => (c === letra ? `M${x} ${y}h1v1h-1z` : ''))).join('');
const MANO_K = trazo('k');
const MANO_W = trazo('w');

function Sticker({ clase, n, children }: { clase: string; n: number; children: ReactNode }) {
    return (
        <span className={`h-pie-st ${clase}`} style={{ '--n': n } as CSSProperties}>
            <span className="h-pie-st-in">{children}</span>
        </span>
    );
}

export function Firmado() {
    return (
        <div className="m-wrap h-pie-firmado" data-in data-loop>
            <p className="h-pie-hora m-mono">
                <i className="m-ping m-ping--siempre" aria-hidden="true" />
                Lima, Perú · <RelojLima />
            </p>

            <div className="h-pie-marca">
                <Titular id="pie-t" className="h-pie-h2" texto="Estudio digital" />

                <span aria-hidden="true">
                    <Sticker clase="is-sello" n={0}>
                        <SimboloAtlas />
                    </Sticker>
                    <Sticker clase="is-framer" n={1}>
                        <svg viewBox="0 0 24 24">
                            {FRAMER.map((d) => (
                                <path key={d} d={d} />
                            ))}
                        </svg>
                    </Sticker>
                    <Sticker clase="is-figma" n={2}>
                        <svg viewBox="0 0 38 57">
                            {FIGMA.map((p) => (
                                <path key={p.d} d={p.d} fill={p.c} />
                            ))}
                        </svg>
                    </Sticker>
                    <Sticker clase="is-mano" n={3}>
                        <svg viewBox="0 0 17 17" shapeRendering="crispEdges">
                            <path d={MANO_W} fill="#fff" />
                            <path d={MANO_K} fill="#0b0b0c" />
                        </svg>
                    </Sticker>
                </span>
            </div>

            <Firma texto="tu negocio, a otro nivel" ancho={84} max={52} className="h-pie-firma" />
        </div>
    );
}
