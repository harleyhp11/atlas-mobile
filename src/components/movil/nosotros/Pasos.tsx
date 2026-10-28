import type { CSSProperties } from 'react';
import { Titular } from '../Titular';
import { ETAPAS, PERSONA, PLAZOS, REPARTO_CONFIRMADO } from './equipo';

/* «Cinco pasos. Ninguno sin ti.» sobre negro: las cinco etapas reales como
   un mazo de tarjetas que se apilan con el scroll (solo position: sticky,
   sin JS). Cada una se «estampa» con tu visto bueno y, cuando Harley lo
   confirme (REPARTO_CONFIRMADO), dice quien la lleva.
   Debajo, los plazos reales. Ojo: ni esta seccion ni sus ancestros pueden
   llevar overflow, o el sticky deja de funcionar. */

export function Pasos() {
    return (
        <section id="proceso" className="nos-pasos" data-tono="oscuro" aria-labelledby="pasos-t">
            <div className="m-wrap">
                <Titular id="pasos-t" className="nos-pasos-t" texto="Cinco pasos. Ninguno sin ti." destacar="ti." />
                <p className="m-p nos-pasos-bajada" data-rv>
                    Avanzamos con tu visto bueno en cada paso. Nada se publica sin que lo veas.
                </p>

                <ol className="nos-mazo">
                    {ETAPAS.map((e, i) => {
                        const final = i === ETAPAS.length - 1;
                        const quien = e.quien.length > 1 ? 'Los dos' : PERSONA[e.quien[0]].nombre;
                        return (
                            <li key={e.nombre} className={`nos-paso${final ? ' is-final' : ''}`} data-rv style={{ '--i': i } as CSSProperties}>
                                <div className="nos-paso-cab">
                                    <span className="m-mono nos-paso-n">
                                        Paso {i + 1} de {ETAPAS.length}
                                    </span>
                                    {REPARTO_CONFIRMADO && (
                                        <span className="nos-quien">
                                            <span className="sr-only">A cargo: </span>
                                            <span className="nos-quien-caras" aria-hidden="true">
                                                {e.quien.map((id) => (
                                                    <img key={id} src={PERSONA[id].mini} width={240} height={240} alt="" loading="lazy" decoding="async" />
                                                ))}
                                            </span>
                                            <span className="m-mono">{quien}</span>
                                        </span>
                                    )}
                                </div>
                                <h3 className="nos-paso-t">{e.nombre}</h3>
                                <div className="nos-paso-pie">
                                    <div>
                                        <p className="nos-paso-sub">{e.sub}</p>
                                        {e.extra && <p className="m-mono nos-paso-extra">{e.extra}</p>}
                                    </div>
                                    <span className="nos-visto">
                                        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                            <path pathLength={1} d="m3.5 8.5 3 3 6-7" />
                                        </svg>
                                        <span className="sr-only">Avanza con tu visto bueno</span>
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ol>

                <div className="nos-plazos">
                    <h3>¿Cuánto tarda?</h3>
                    <ul>
                        {PLAZOS.map(([t, d], i) => (
                            <li key={t} data-rv style={{ '--d': `${i * 0.08}s` } as CSSProperties}>
                                <span>{t}</span>
                                <span className="m-mono">{d}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
