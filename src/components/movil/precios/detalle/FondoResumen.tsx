'use client';

import { useEffect, useRef } from 'react';
import { GradientASCII, type GradientASCIIRef } from './GradientASCII';

/* El fondo de la tarjeta «Inversión»: el degradado ASCII de Harley en los
   rojos de Atlas (de vino a coral, sin hueso: con hueso los caracteres de
   arriba quedaban casi blancos detras del precio), con la forma
   «horizon»: un cielo de caracteres arriba y un arco oscuro abajo, donde
   van los datos y el boton. Probadas tambien «rise» (casi no se veia) y
   «eclipse» (un anillo que cruzaba el texto).

   Una sola costura con la animacion de CSS de la tarjeta: cuando la
   perilla llega al final (34 % del ciclo de 8 s, ver resumen.css), el
   campo lanza su onda desde la perilla, a la vez que el destello y la
   sacudida de la tarjeta.

   La hora sale de la propia animacion de la perilla (getAnimations): si la
   tarjeta se pausa fuera de pantalla, la onda tambien espera. Sin
   animacion (movimiento reducido) no hay onda. */

const CICLO = 8000;
const LLEGA = 0.34 * CICLO;

export function FondoResumen() {
    const campo = useRef<GradientASCIIRef>(null);
    const caja = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const tarjeta = caja.current?.closest('.pre-dt-res');
        const perilla = tarjeta?.querySelector<HTMLElement>('.pre-dt-ds-perilla');
        const mover = perilla?.parentElement;
        if (!tarjeta || !perilla || !mover) return undefined;
        let antes = -1;
        // una mirada cada 120 ms: barato y sin perder el cruce del 34 %
        const id = window.setInterval(() => {
            const a = mover.getAnimations()[0];
            if (!a || a.playState !== 'running' || typeof a.currentTime !== 'number') return;
            const t = a.currentTime % CICLO;
            if (antes >= 0 && antes < LLEGA && t >= LLEGA) {
                const r = perilla.getBoundingClientRect();
                campo.current?.onda(r.left + r.width / 2, r.top + r.height / 2);
            }
            antes = t;
        }, 120);
        return () => window.clearInterval(id);
    }, []);

    return (
        <span ref={caja} className="pre-dt-res-fondo" aria-hidden="true">
            <GradientASCII
                ref={campo}
                className="pre-dt-res-ascii"
                colors={['#1a0306', '#6b0c1c', '#c8142f', '#ff4d63']}
                shape="horizon"
                cellSize={14}
                density={0.85}
                glyphOpacity={0.7}
                glow={0.35}
                flicker={0.25}
                softness={0.7}
                flow={0.7}
                speed={0.8}
                gradientOpacity={0.85}
                grain={0.06}
                scrambleRadius={0.12}
            />
            <i />
        </span>
    );
}
