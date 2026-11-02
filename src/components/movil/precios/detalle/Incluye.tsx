import type { CSSProperties } from 'react';
import { FlechaAbajo } from '../../iconos';
import { Titular } from '../../Titular';
import type { Detalle } from '../planes';
import { IconoIncluye } from './Iconos';

/* D4 · «Todo lo que incluye.» (refs 35, 30 y 33): los cuatro puntos del plan,
   uno por fila, cada uno explicado en simple. El titulo de cada fila es el
   dato LITERAL de datos.ts (plan.incluye[i]); la explicacion es de planes.ts
   y solo aclara lo que el dato ya dice.

   Cada fila lleva a la izquierda un cuadro hueso: la cifra cuando el dato
   tiene una («Hasta 40», «5–7 páginas»; el 40 cuenta al aparecer) o un
   icono cuando no.

   El fondo es la foto del hero en miniatura (2–3 KB), desenfocada y en B/N:
   da la sensacion de vidrio de la ref 35 sin pagar un backdrop-filter en
   una lista que hace scroll. */

export function Incluye({ d }: { d: Detalle }) {
    const { plan } = d;
    return (
        <section id="incluye" className="pre-dt-sec pre-dt-inc" data-tono="oscuro" aria-labelledby="incluye-t">
            <img className="pre-dt-inc-fondo" src={d.foto.mini} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <div className="m-wrap">
                <Titular id="incluye-t" className="pre-dt-t pre-c-t-gris" texto="Todo lo que incluye." />
                <ol className="pre-dt-inc-lista">
                    {plan.incluye.map((item, k) => {
                        const x = d.incluye[k];
                        const f = x.figura;
                        return (
                            <li key={item} className="pre-dt-inc-fila" data-rv style={{ '--d': `${k * 0.08}s` } as CSSProperties}>
                                <span className="pre-dt-inc-cuadro" aria-hidden="true" data-figura={f ? '' : undefined}>
                                    {f ? (
                                        <>
                                            {f.antes && <small>{f.antes}</small>}
                                            {f.cuenta ? (
                                                <b data-cuenta={f.cuenta} data-dura="1100">
                                                    {f.valor}
                                                </b>
                                            ) : (
                                                <b>{f.valor}</b>
                                            )}
                                            {f.unidad && <small>{f.unidad}</small>}
                                        </>
                                    ) : (
                                        x.icono && <IconoIncluye nombre={x.icono} />
                                    )}
                                </span>
                                <div className="pre-dt-inc-txt">
                                    <h3>{item}</h3>
                                    <p>{x.explica}</p>
                                    {x.ancla && (
                                        <a className="pre-dt-inc-ancla" href={x.ancla.href}>
                                            {x.ancla.texto}
                                            <FlechaAbajo />
                                        </a>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
