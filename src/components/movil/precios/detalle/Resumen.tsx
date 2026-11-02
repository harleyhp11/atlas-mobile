import type { CSSProperties } from 'react';
import { Boton } from '../../Boton';
import { FlechaAbajo } from '../../iconos';
import { PrecioPlan } from '../comun/PrecioPlan';
import { FRASES, GARANTIAS, wspPlan, type Detalle } from '../planes';

/* D2 · El resumen (refs 34, 31 y 32): una hoja hueso que se monta sobre el
   final del hero, con lo que la persona vino a buscar en una sola mirada:
   cuanto cuesta, de que depende, cuando esta y en cuanto le respondemos.
   Abajo, el CTA principal (el primero de los dos `tinta` de la pagina) y la
   promesa del monto por escrito.

   El rango NO se cuenta (los rangos no se animan: un «S/ 0 – 1,500» que
   sube no significa nada). La pildora dice lo que es: un precio
   referencial, o una propuesta a medida.

   Debajo de la hoja, sobre negro, el indice «en esta pagina»: cinco chips
   que bajan a cada bloque. Para que nadie se pierda en una pagina larga. */

const RESPUESTA = GARANTIAS[1]; // «< 24 h · Para responderte»

export function Resumen({ d }: { d: Detalle }) {
    const { plan } = d;
    // [CONFIRMAR copy con Harley] pildora e indice
    const indice = [
        { t: 'Qué incluye', href: '#incluye' },
        { t: 'Por dentro', href: '#por-dentro' },
        { t: plan.aMedida ? 'Cómo se cotiza' : 'Precio', href: '#precio' },
        { t: 'Plazo', href: '#plazo' },
        { t: 'Empezar', href: '#empezar' },
    ];
    return (
        <>
            <section className="pre-dt-res m-claro" data-tono="claro" aria-label="Resumen del plan" data-rv style={{ '--d': '.25s' } as CSSProperties}>
                <span className="pre-dt-res-tirador" aria-hidden="true" />
                <span className="pre-dt-res-pildora">{plan.aMedida ? 'Propuesta a medida' : 'Precio referencial'}</span>

                <p className="m-mono pre-dt-res-etq">Inversión</p>
                <PrecioPlan plan={plan} tam="m" className="pre-dt-res-precio" />
                <p className="pre-dt-res-nota">{plan.precioNota}</p>

                <dl className="pre-dt-res-datos">
                    <div>
                        <dt className="m-mono">Entrega</dt>
                        <dd>{plan.entrega}</dd>
                    </div>
                    <div>
                        <dt className="m-mono">Respuesta</dt>
                        <dd>
                            <span aria-hidden="true">{RESPUESTA.b}</span>
                            <span className="sr-only">{RESPUESTA.sr}</span>
                        </dd>
                    </div>
                </dl>

                <Boton href={wspPlan(d)} externo tinta className="pre-dt-res-btn">
                    {plan.cta}
                </Boton>
                <p className="pre-dt-res-promesa">{FRASES.montoFinal}</p>
            </section>

            {/* data-in en la lista y no en cada chip: los que quedan fuera a
                la derecha del riel nunca "entrarian" en pantalla */}
            <nav className="pre-dt-ind" aria-label="En esta página">
                <ul data-in>
                    {indice.map((x, k) => (
                        <li key={x.href} style={{ '--i': k } as CSSProperties}>
                            <a href={x.href}>
                                {x.t}
                                <FlechaAbajo />
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}
