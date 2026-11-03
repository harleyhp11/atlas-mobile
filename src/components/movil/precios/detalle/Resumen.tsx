import type { CSSProperties } from 'react';
import { Boton } from '../../Boton';
import { PrecioPlan } from '../comun/PrecioPlan';
import { FRASES, GARANTIAS, rango, soles, wspPlan, type Detalle } from '../planes';
import './resumen.css';

/* D2 · El resumen: lo que la persona vino a buscar en una sola mirada
   (cuanto cuesta, de que depende, cuando esta y en cuanto le respondemos)
   y el CTA principal. Es el UNICO lugar del contenido con el precio (el
   dock y el mensaje de WhatsApp aparte).

   Desde el 2026-11-03 es una tarjeta de vidrio oscura sobre brasas rojas
   que se mueven (pedido de Harley, con un video de referencia: un control
   «Effort» que se desliza solo y estalla al llegar al final). Aqui el
   control es el rango del plan:
     · la perilla viaja sola de un extremo al otro y deja detras el
       degradado de la marca (vino → rojo → hueso);
     · debajo, la leyenda cambia con un desenfoque de «Desde S/ 400» a
       «Hasta S/ 1,200». SOLO los extremos: no hay una tabla de «tanto por
       tanto» y no se inventan cifras intermedias;
     · al llegar, un destello con anillos y burbujas, y las brasas del fondo
       se encienden; despues vuelve sin ruido y repite.
   Todo con CSS y un reloj comun (--ciclo, en resumen.css); data-loop lo
   pausa fuera de pantalla y con movimiento reducido queda quieto al final.

   El plan a medida no tiene rango: lleva su nota («Propuesta cerrada tras
   la primera llamada») y las mismas brasas, sin el control.

   El rango NO se cuenta (un «S/ 0 – 1,500» que sube no significa nada). La
   pildora dice lo que es: un precio referencial, o una propuesta a medida. */

const RESPUESTA = GARANTIAS[1]; // «< 24 h · Para responderte»

// las burbujas del estallido: angulo (grados), distancia (px), tamaño (px)
// y retraso (% del ciclo). Fijas, para que el servidor y el cliente pinten
// lo mismo
const BURBUJAS = [
    [200, 70, 14, 0],
    [160, 86, 10, 0.4],
    [235, 58, 17, 0.2],
    [120, 64, 9, 0.6],
    [260, 92, 12, 0.3],
    [180, 112, 8, 0.8],
    [215, 120, 13, 0.5],
    [145, 120, 9, 0.9],
    [100, 44, 10, 0.1],
    [285, 50, 9, 0.7],
    [190, 40, 7, 0.2],
    [245, 136, 10, 1],
    [170, 150, 7, 0.6],
    [75, 70, 7, 0.4],
    [225, 96, 6, 0.9],
    [135, 96, 11, 0.3],
];

export function Resumen({ d }: { d: Detalle }) {
    const { plan } = d;
    const r = rango(plan);
    return (
        <section className="pre-dt-res" data-tono="oscuro" aria-label="Resumen del plan" data-rv data-loop style={{ '--d': '.25s' } as CSSProperties}>
            <span className="pre-dt-res-fondo" aria-hidden="true">
                <i />
            </span>
            <span className="pre-dt-res-tirador" aria-hidden="true" />
            {/* [CONFIRMAR copy con Harley] */}
            <span className="pre-dt-res-pildora">{plan.aMedida ? 'Propuesta a medida' : 'Precio referencial'}</span>

            <p className="m-mono pre-dt-res-etq">Inversión</p>
            <PrecioPlan plan={plan} tam="m" className="pre-dt-res-precio" />

            {r && d.ejes ? (
                <div className="pre-dt-ds" role="img" aria-label={`De ${soles(r.desde)} a ${soles(r.hasta)}: ${plan.precioNota.toLowerCase()}`}>
                    <div className="pre-dt-ds-ejes" aria-hidden="true">
                        <span>{d.ejes[0]}</span>
                        <span>{d.ejes[1]}</span>
                    </div>
                    <div className="pre-dt-ds-riel" aria-hidden="true">
                        <div className="pre-dt-ds-pista">
                            <span className="pre-dt-ds-relleno" />
                            <span className="pre-dt-ds-carril">
                                <span className="pre-dt-ds-mover">
                                    <span className="pre-dt-ds-tapa" />
                                </span>
                            </span>
                            <span className="pre-dt-ds-puntos">
                                {Array.from({ length: 6 }, (_, k) => (
                                    <i key={k} />
                                ))}
                            </span>
                        </div>
                        {/* la perilla va fuera de la pista: su sombra y su
                            brillo no se recortan con el overflow */}
                        <span className="pre-dt-ds-carril pre-dt-ds-carril--perilla">
                            <span className="pre-dt-ds-mover">
                                <i className="pre-dt-ds-perilla" />
                            </span>
                        </span>
                        <span className="pre-dt-ds-estallido">
                            <i className="pre-dt-ds-destello" />
                            <i className="pre-dt-ds-anillo" />
                            <i className="pre-dt-ds-anillo" />
                            <i className="pre-dt-ds-anillo" />
                            {BURBUJAS.map(([a, dist, s, dl], k) => (
                                <i
                                    key={k}
                                    className="pre-dt-ds-burbuja"
                                    style={
                                        {
                                            '--x': `${(Math.cos((a * Math.PI) / 180) * dist).toFixed(1)}px`,
                                            '--y': `${(Math.sin((a * Math.PI) / 180) * dist).toFixed(1)}px`,
                                            '--s': `${s}px`,
                                            '--dl': dl,
                                        } as CSSProperties
                                    }
                                />
                            ))}
                        </span>
                    </div>
                    <p className="pre-dt-ds-ley" aria-hidden="true">
                        <span>Desde {soles(r.desde)}</span>
                        <span>Hasta {soles(r.hasta)}</span>
                    </p>
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

            {/* el boton claro: sobre las brasas rojas, el de tinta se perdia */}
            <Boton href={wspPlan(d)} externo variante="claro" className="pre-dt-res-btn">
                {plan.cta}
            </Boton>
            <p className="pre-dt-res-promesa">{FRASES.montoFinal}</p>
        </section>
    );
}
