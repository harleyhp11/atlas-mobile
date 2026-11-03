'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { ETAPAS } from '../planes';
import { FolderFloat } from './FolderFloat';

/* Las cinco etapas de Atlas como la carpeta flotante (pedido de Harley: en
   vez de la linea de tiempo, algo mas resumido). Se abre sola al verse y
   suelta los cinco pasos; el ultimo, el lanzamiento, va en rojo como antes
   el punto final. Tocar un paso dice debajo de que se trata (el «sub» de
   cada etapa), asi el resumen no pierde el detalle. */

const NOTAS = ETAPAS.map((e, k) => ({ label: e.nombre, value: e.nombre, n: String(k + 1), acento: k === ETAPAS.length - 1 }));

export function CarpetaEtapas() {
    const [sel, setSel] = useState(-1);
    const [spread, setSpread] = useState(150);
    const caja = useRef<HTMLDivElement>(null);
    const e = ETAPAS[sel];
    // las notas (y su deriva, que llega hasta spread + 8) no pasan del texto
    // de la pagina: a 360 px el «Descubrimiento» tocaba el borde
    useLayoutEffect(() => {
        const w = caja.current?.clientWidth ?? 0;
        if (w) setSpread(Math.min(158, Math.floor(w / 2) - 12));
    }, []);
    return (
        <div ref={caja} className="pre-dt-carpeta">
            <FolderFloat
                items={NOTAS}
                label="Cómo trabajamos"
                sublabel={`${ETAPAS.length} pasos`}
                abrirAlVer
                onSelect={(_, i) => setSel(i)}
                folderColor="#26262a"
                frontColor="#0b0b0c"
                paperColor="#ffffff"
                itemColor="#0b0b0c"
                itemTextColor="#f4f1ea"
                labelColor="#f4f1ea"
                width={196}
                height={132}
                spread={spread}
                lift={22}
                tilt={6}
            />
            {/* [CONFIRMAR copy con Harley] la pista antes de tocar */}
            <p className="pre-dt-carpeta-nota" aria-live="polite">
                {e ? (
                    <>
                        <b>
                            {sel + 1}. {e.nombre}
                        </b>{' '}
                        · {e.sub}
                    </>
                ) : (
                    'Toca un paso para ver de qué se trata.'
                )}
            </p>
        </div>
    );
}
