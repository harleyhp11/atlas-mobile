import type { CSSProperties } from 'react';
import { Flecha, WhatsApp } from '../../iconos';
import { Titular } from '../../Titular';
import { ListaCheck } from '../comun/ListaCheck';
import { detalle, precioLeido, WSP_MAS40, type Detalle } from '../planes';

/* D3 · «¿Es para ti?»: antes de leer lo que incluye, la persona confirma que
   esta en el plan correcto. Tres señales de que si (checks que se van
   marcando) y, justo debajo, las dos dudas tipicas que la llevarian a otro
   plan, cada una como enlace directo a ese plan. Asi nadie llega al final
   de la pagina para descubrir que buscaba otra cosa.

   La mini-etiqueta de cada enlace sale del plan de destino (nombre corto y
   precio, de datos.ts). «Más de 40 productos» no tiene plan: va a WhatsApp
   con su propio mensaje (WSP_MAS40). */

export function ParaTi({ d }: { d: Detalle }) {
    return (
        <section className="pre-dt-sec pre-dt-para" data-tono="oscuro" aria-labelledby="para-t">
            <div className="m-wrap">
                <Titular id="para-t" className="pre-dt-t" texto="¿Es para ti?" destacar="ti?" />

                {/* [CONFIRMAR copy con Harley] subtitulos */}
                <h3 className="pre-dt-h3" data-rv>
                    Te sirve si…
                </h3>
                <ListaCheck items={d.paraTi} dibujar className="pre-dt-para-si" />

                <h3 className="pre-dt-h3 pre-dt-para-no-t" data-rv>
                    Mejor mira otro plan si…
                </h3>
                <ul className="pre-dt-otro">
                    {d.mejorOtro.map((m, k) => {
                        const estilo = { '--d': `${k * 0.07}s` } as CSSProperties;
                        if (m.a === 'whatsapp') {
                            return (
                                <li key={m.texto} data-rv style={estilo}>
                                    <a href={WSP_MAS40} target="_blank" rel="noopener noreferrer">
                                        <span className="pre-dt-otro-t">
                                            <span className="pre-dt-otro-q">{m.texto}</span>
                                            <small className="m-mono">
                                                <WhatsApp />
                                                Escríbenos por WhatsApp
                                            </small>
                                        </span>
                                        <span className="pre-dt-otro-ir" aria-hidden="true">
                                            <Flecha />
                                        </span>
                                        <span className="sr-only"> (abre WhatsApp)</span>
                                    </a>
                                </li>
                            );
                        }
                        const o = detalle(m.a)!;
                        return (
                            <li key={m.texto} data-rv style={estilo}>
                                <a href={`/servicios/${o.slug}`}>
                                    <span className="pre-dt-otro-t">
                                        <span className="pre-dt-otro-q">{m.texto}</span>
                                        <small className="m-mono" aria-hidden="true">
                                            <i data-mat={o.material} />
                                            {o.corto} · {o.plan.precio}
                                        </small>
                                    </span>
                                    <span className="pre-dt-otro-ir" aria-hidden="true">
                                        <Flecha />
                                    </span>
                                    <span className="sr-only">{` Ver ${o.titulo}: ${precioLeido(o.plan).toLowerCase()}.`}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
