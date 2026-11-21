'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PROBLEMA } from '../datos';
import { useRotacion } from '../useRotacion';

/* El titular de "Lo que pierdes hoy": una frase a la vez, cambiando sola
   (pedido de Harley). El "No" en su caja roja se queda; lo demas sale hacia
   arriba por su mascara y entra la frase siguiente palabra a palabra:
   "te encuentran." → "te compran." → "te alcanza el día.".

   El lector de pantalla lee las tres de corrido (sr-only); lo que se mueve
   va aria-hidden. Rota solo en pantalla y con la pestaña al frente; con
   movimiento reducido se queda en la primera. */

const SALIDA_MS = 360;

export function TitularPerdidas() {
    const h = useRef<HTMLHeadingElement>(null);
    const frases = PROBLEMA.frases;
    const objetivo = useRotacion(frases.length, 2600, h);
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

    return (
        <h2 ref={h} id="problema-t" className="m-tit m-h2 h-problema-h2" data-in>
            <span className="sr-only">{frases.map((f) => `No ${f}`).join(' ')}</span>
            <span aria-hidden="true">
                <span className="m-w m-w--caja" style={{ '--i': 0 } as CSSProperties}>
                    <span>No</span>
                </span>{' '}
                <span key={mostrada} className="h-prob-rot" data-fase={fase}>
                    {frases[mostrada].split(' ').map((p, i, ps) => (
                        <span key={i}>
                            <span className="h-prob-w" style={{ '--i': i + 1 } as CSSProperties}>
                                <span>{p}</span>
                            </span>
                            {i < ps.length - 1 ? ' ' : null}
                        </span>
                    ))}
                </span>
            </span>
        </h2>
    );
}
