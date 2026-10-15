'use client';

import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from 'react';
import { ESCENARIOS, foto } from './escenarios';
import { ChipContenido, dos, FlechasAsa, Info, MetricaAntes, MetricaDespues, Pildora } from './partes';

/* Motion pesa: el comparador animado se pide con import() recien cuando la
   seccion esta a poco mas de una pantalla. Hasta entonces (y en el HTML del
   servidor) va esta version quieta, con las mismas medidas: el primer rubro
   con la linea al medio y todos los textos. Al llegar el bueno, nada se
   mueve. */

export function ComparadorDiferido() {
    const ref = useRef<HTMLDivElement>(null);
    const [Real, setReal] = useState<ComponentType | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let vivo = true;
        const io = new IntersectionObserver(
            (entradas) => {
                if (!entradas.some((x) => x.isIntersecting)) return;
                io.disconnect();
                import('./Comparador')
                    .then((m) => {
                        if (vivo) setReal(() => m.Comparador);
                    })
                    .catch(() => {});
            },
            { rootMargin: '0px 0px 120% 0px' }
        );
        io.observe(el);
        return () => {
            vivo = false;
            io.disconnect();
        };
    }, []);

    return <div ref={ref}>{Real ? <Real /> : <Quieto />}</div>;
}

function Quieto() {
    const e = ESCENARIOS[0];
    return (
        <div className="h-neg-comp">
            <div className="h-neg-chips">
                {ESCENARIOS.map((x, i) => (
                    <span key={x.id} className={`h-neg-chip${i === 0 ? ' is-activo' : ''}`}>
                        <span className="h-neg-chip-fondo" aria-hidden="true" />
                        <ChipContenido e={x} />
                    </span>
                ))}
            </div>
            <div className="m-wrap">
                <div className="h-neg-pista">
                    <span className="h-neg-pista-txt m-mono">
                        <FlechasAsa />
                        Desliza para comparar
                    </span>
                    <span className="h-neg-indice m-mono" aria-hidden="true">
                        <span className="h-neg-indice-ventana">
                            <b>{dos(1)}</b>
                        </span>
                        / {dos(ESCENARIOS.length)}
                    </span>
                </div>
                <div className="h-neg-carta" style={{ '--pos': '50%' } as CSSProperties}>
                    <div className="h-neg-capa h-neg-capa--despues">
                        <span className="h-neg-lienzo">
                            <img className="h-neg-foto" src={foto(e)} alt="" width={800} height={1000} loading="lazy" decoding="async" />
                        </span>
                        <span className="h-neg-velo" />
                        <div className="h-neg-met h-neg-met--despues">
                            <MetricaDespues e={e} />
                        </div>
                    </div>
                    <div className="h-neg-capa h-neg-capa--antes">
                        <span className="h-neg-lienzo">
                            <img className="h-neg-foto" src={foto(e)} alt="" width={800} height={1000} loading="lazy" decoding="async" />
                        </span>
                        <span className="h-neg-velo h-neg-velo--antes" />
                        <div className="h-neg-met h-neg-met--antes">
                            <MetricaAntes e={e} />
                        </div>
                    </div>
                    <div className="h-neg-asa" aria-hidden="true">
                        <span className="h-neg-asa-linea" />
                        <span className="h-neg-asa-circ">
                            <FlechasAsa />
                        </span>
                    </div>
                    <span className="h-neg-pildora">
                        <Pildora e={e} />
                    </span>
                </div>
                <Info activo={0} />
            </div>
        </div>
    );
}
