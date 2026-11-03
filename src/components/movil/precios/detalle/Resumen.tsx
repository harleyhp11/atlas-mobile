import type { CSSProperties } from 'react';
import { Boton } from '../../Boton';
import { PrecioPlan } from '../comun/PrecioPlan';
import { FRASES, GARANTIAS, rango, soles, wspPlan, type Detalle } from '../planes';

/* D2 · El resumen (refs 34, 31 y 32): una hoja hueso que se monta sobre el
   final del hero, con lo que la persona vino a buscar en una sola mirada:
   cuanto cuesta, de que depende, cuando esta y en cuanto le respondemos.
   Abajo, el CTA principal (el primero de los dos `tinta` de la pagina) y la
   promesa del monto por escrito.

   Es el UNICO lugar del contenido con el precio (el dock y el mensaje de
   WhatsApp aparte): antes se repetia en «Lo que mueve el precio», en «Tu
   pedido» y en las tarjetas del final (Harley: muy largo y repetitivo). De
   esa seccion queda aqui lo que no estaba: la barra del rango con lo que
   lo mueve de un extremo al otro (en lugar de plan.precioNota, que decia
   lo mismo en una frase). El plan a medida no tiene rango: va su nota
   («Propuesta cerrada tras la primera llamada»).

   El rango NO se cuenta (los rangos no se animan: un «S/ 0 – 1,500» que
   sube no significa nada). La pildora dice lo que es: un precio
   referencial, o una propuesta a medida.

   Sin el indice «en esta pagina»: con la pagina mas corta sobraba. */

const RESPUESTA = GARANTIAS[1]; // «< 24 h · Para responderte»

export function Resumen({ d }: { d: Detalle }) {
    const { plan } = d;
    const r = rango(plan);
    return (
        <section className="pre-dt-res m-claro" data-tono="claro" aria-label="Resumen del plan" data-rv style={{ '--d': '.25s' } as CSSProperties}>
            <span className="pre-dt-res-tirador" aria-hidden="true" />
            {/* [CONFIRMAR copy con Harley] */}
            <span className="pre-dt-res-pildora">{plan.aMedida ? 'Propuesta a medida' : 'Precio referencial'}</span>

            <p className="m-mono pre-dt-res-etq">Inversión</p>
            <PrecioPlan plan={plan} tam="m" className="pre-dt-res-precio" />
            {r && d.ejes ? (
                <div className="pre-dt-rango" role="img" aria-label={`De ${soles(r.desde)} a ${soles(r.hasta)}: ${plan.precioNota.toLowerCase()}`} data-in>
                    <div className="pre-dt-rango-pista">
                        <span className="pre-dt-rango-relleno" />
                        <i className="pre-dt-rango-perilla" />
                        <i className="pre-dt-rango-perilla" />
                    </div>
                    <div className="pre-dt-rango-ejes" aria-hidden="true">
                        <span>{d.ejes[0]}</span>
                        <span>{d.ejes[1]}</span>
                    </div>
                </div>
            ) : (
                <p className="pre-dt-res-nota">{plan.precioNota}</p>
            )}

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
    );
}
