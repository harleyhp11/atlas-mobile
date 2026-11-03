import { Check } from '../../iconos';
import { Titular } from '../../Titular';
import { FRASES, plazo, type Detalle } from '../planes';
import { CarpetaEtapas } from './CarpetaEtapas';

/* D7 · «¿Cuándo está listo?» (ref 32): una isla hueso con el plazo en una
   cifra enorme, y debajo las cinco etapas reales de Atlas en la carpeta
   flotante (CarpetaEtapas): se abre sola y suelta los cinco pasos; el
   lanzamiento es el unico rojo, es el destino.

   El plazo sale de plan.entrega con plazo(): «7 – 10» + «días», «Desde» +
   «4» + «semanas». La tienda no tiene plazo confirmado todavia (dice «A
   coordinar»): sin inventar un numero, y sin darle la cifra gigante a un
   dato que falta. Ahi va «A coordinar» tal cual, con la letra del titular.
   La frase «la fecha queda fijada desde la primera reunion» se quito (pedido
   de Harley).

   NO se reparten dias por etapa: no hay dato. Lo que si es seguro va al
   cierre de la hoja: nada se publica sin que lo veas y lo que pasa despues
   del lanzamiento. */

export function Plazo({ d }: { d: Detalle }) {
    const { plan } = d;
    const p = plazo(plan);
    // [CONFIRMAR copy con Harley] en software sale de incluye[3]
    const despues = plan.aMedida ? 'acompañamiento durante el primer mes.' : FRASES.despues;
    return (
        <section id="plazo" className="pre-dt-plazo m-claro" data-tono="claro" aria-labelledby="plazo-t">
            <div className="m-wrap">
                <Titular id="plazo-t" className="pre-dt-t pre-c-t-gris" texto="¿Cuándo está listo?" />

                <div className="pre-dt-plazo-cifra" data-rv>
                    <p className="pre-dt-plazo-v" data-coordinar={p ? undefined : ''}>
                        {p ? (
                            <>
                                {p.antes && <small className="m-mono">{p.antes}</small>}
                                <span className="pre-dt-plazo-num">
                                    <b>{p.cifra.replace(/ – /g, '–')}</b>
                                    <span>{p.unidad}</span>
                                </span>
                            </>
                        ) : (
                            <>
                                <small className="m-mono">Entrega</small>
                                <b>{plan.entrega}</b>
                            </>
                        )}
                    </p>
                    {/* la linea de la ref 32: sube hasta el punto del lanzamiento.
                        Se estira poco (la caja no pasa de 360 px), asi el trazo
                        no se deforma; el punto va aparte, redondo siempre */}
                    <div className="pre-dt-linea-caja" aria-hidden="true" data-in>
                        <svg className="pre-dt-linea" viewBox="0 0 300 44" preserveAspectRatio="none" fill="none">
                            <path pathLength={1} d="M2 40C46 40 62 27 104 27S160 35 204 31 262 9 296 7" />
                        </svg>
                        <i className="pre-dt-linea-punto" />
                    </div>
                </div>

                <CarpetaEtapas />

                <div className="pre-dt-plazo-pie" data-rv>
                    <p>
                        <span className="pre-dt-plazo-check" aria-hidden="true">
                            <Check />
                        </span>
                        {FRASES.nadaSinVerlo}
                    </p>
                    <p>
                        <b>Y después:</b> {despues}
                    </p>
                </div>
            </div>
        </section>
    );
}
