import type { CSSProperties } from 'react';
import { Boton } from '../../Boton';
import { Titular } from '../../Titular';
import { ListaCheck } from '../comun/ListaCheck';
import { PrecioPlan } from '../comun/PrecioPlan';
import { NOTA_LEGAL, rango, soles, type Detalle } from '../planes';

/* D6 · «Lo que mueve el precio.» (ref 31): por que es un rango y no un
   numero, dicho sin letra chica.

   Detras, el glifo «S/» gigante (la palabra «Pricing» de la ref); delante,
   una tarjeta de vidrio que tapa su mitad de abajo y la desenfoca. Dentro:
     · el rango, con la cola del mismo tamaño en gris;
     · la barra del rango: de un extremo al otro, con lo que lo mueve
       (ejes de planes.ts) debajo. Los extremos son marcas finas y no
       perillas: no es un control y no debe parecer que se arrastra. Se llena de izquierda a derecha al
       aparecer y NUNCA muestra cifras intermedias: no hay una tabla de
       «tanto por tanto» y no se inventa;
     · los tres factores de NOTA_LEGAL (alcance, integraciones, contenido),
       con «+» y no con check: no son algo incluido, son lo que suma;
     · el boton blanco de la ref, que baja al armador del mensaje.
   El plan a medida no tiene rango: en su lugar, como se llega al monto
   (llamada → propuesta cerrada → diagnostico). */

// [CONFIRMAR copy con Harley] las tres partes de NOTA_LEGAL, explicadas
const FACTORES = [
    { t: 'El alcance:', d: 'qué hace tu proyecto y hasta dónde llega.' },
    { t: 'Las integraciones:', d: 'con qué otras herramientas se conecta.' },
    { t: 'El contenido:', d: 'cuánto lleva y quién lo prepara.' },
];

// [CONFIRMAR copy con Harley] como se cotiza el software
const COTIZA = [
    { t: 'La primera llamada', d: 'Nos cuentas cómo trabajas hoy.' },
    { t: 'La propuesta cerrada', d: 'Con el monto final, por escrito.' },
    { t: 'El diagnóstico', d: 'Arrancamos con el diagnóstico inicial y el alcance por escrito.' },
];

export function Precio({ d }: { d: Detalle }) {
    const { plan } = d;
    const r = rango(plan);
    return (
        <section id="precio" className="pre-dt-sec pre-dt-pre" data-tono="oscuro" aria-labelledby="precio-t">
            <div className="m-wrap">
                {plan.aMedida ? (
                    <Titular id="precio-t" className="pre-dt-t pre-c-t-gris" texto="Cómo se cotiza." />
                ) : (
                    <Titular id="precio-t" className="pre-dt-t pre-c-t-gris" texto="Lo que mueve el precio." />
                )}

                <div className="pre-dt-pre-escena">
                    <span className="pre-dt-pre-glifo" aria-hidden="true">
                        S/
                    </span>
                    <div className="pre-dt-pre-card" data-rv>
                        <p className="pre-dt-pre-nom">{plan.nombre}</p>
                        <PrecioPlan plan={plan} tam="l" cola="fundido" className="pre-dt-pre-precio" />
                        <hr className="pre-dt-filete" />

                        {r && d.ejes ? (
                            <div
                                className="pre-dt-rango"
                                role="img"
                                aria-label={`Rango de ${soles(r.desde)} a ${soles(r.hasta)}. Sube con: ${d.ejes[1]}.`}
                                data-in
                            >
                                <div className="pre-dt-rango-pista">
                                    <span className="pre-dt-rango-relleno" />
                                    <i className="pre-dt-rango-perilla" />
                                    <i className="pre-dt-rango-perilla" />
                                </div>
                                <div className="pre-dt-rango-cifras m-mono">
                                    <span>{soles(r.desde)}</span>
                                    <span>{soles(r.hasta)}</span>
                                </div>
                                <div className="pre-dt-rango-ejes">
                                    <span>{d.ejes[0]}</span>
                                    <span>{d.ejes[1]}</span>
                                </div>
                            </div>
                        ) : (
                            <ol className="pre-dt-cotiza" data-in>
                                {COTIZA.map((p, k) => (
                                    <li key={p.t} style={{ '--i': k } as CSSProperties}>
                                        <span className="pre-dt-cotiza-n" aria-hidden="true">
                                            {k + 1}
                                        </span>
                                        <span>
                                            <b>{p.t}</b>
                                            <span>{p.d}</span>
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        )}

                        {r && (
                            <>
                                {/* [CONFIRMAR copy con Harley] */}
                                <p className="pre-dt-pre-ademas">Además influye:</p>
                                <ListaCheck items={FACTORES} dibujar marca="mas" />
                            </>
                        )}

                        <Boton variante="claro" abajo href="#empezar" className="pre-dt-pre-btn">
                            {/* [CONFIRMAR copy con Harley] */}
                            {plan.aMedida ? 'Pedir mi propuesta' : 'Pedir mi precio exacto'}
                        </Boton>
                    </div>
                </div>

                {/* FRASES.montoFinal va una sola vez por pagina: en el resumen,
                    debajo del boton principal */}
                <p className="pre-dt-legal" data-rv>
                    {NOTA_LEGAL}
                </p>
            </div>
        </section>
    );
}
