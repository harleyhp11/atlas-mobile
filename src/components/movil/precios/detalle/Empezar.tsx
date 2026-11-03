'use client';

import { useRef, type CSSProperties } from 'react';
import { Boton } from '../../Boton';
import { Mas } from '../../iconos';
import { Titular } from '../../Titular';
import { LEYENDA_TIPO, mensajePlan, nombreExtra, tipoDe, wspPlan, type Detalle } from '../planes';
import { useExtras } from './Pedido';

/* D9 · «¿Empezamos tu …?» (refs 33 y 34): el armador del mensaje.

   Arriba, los extras que tienen sentido con este plan (nombres EXACTOS de
   los 21 servicios de datos.ts, mostrados con nombreExtra() por si en este
   plan se leen mal) como interruptores. Solo los que se cotizan aparte
   llevan leyenda: «se suma si lo necesitas» se repetia en casi todas las
   filas y ya lo dice el interruptor. Abajo, la tarjeta «Tu pedido» de la
   ref 34: el plan, lo que sumaste (chips con × para quitar; si no sumaste
   nada, no aparece) y el mensaje EXACTO que va a llegar por WhatsApp, en
   una burbuja de chat. Sin rango, entrega ni nota legal: ya estan en el
   resumen de arriba (Harley: contenido repetido). Lo que ves es lo que se manda: nada de
   formularios ni de datos personales; la persona termina de escribir en su
   WhatsApp («Mi negocio es: …», con el cursor parpadeando).

   El estado vive en Pedido (contexto): el dock manda el mismo mensaje con
   los mismos extras. El estado de cada interruptor va en aria-checked y el
   CSS lee eso: ningun className cambia con el estado. */

const extrasLeidos = (n: number) => (n === 1 ? '1 extra marcado' : `${n} extras marcados`);

// solo para mostrarlo: que «S/ 600 – 1,500» no se parta en la burbuja (el
// mensaje que se manda sigue siendo el exacto)
const sinCorte = (s: string) => s.replace(/S\/ /g, 'S/\u00a0').replace(/ – /g, '\u00a0–\u00a0');

export function Empezar({ d }: { d: Detalle }) {
    const { plan } = d;
    const { extras, alternar, quitar } = useExtras();
    const sumaste = useRef<HTMLDivElement>(null);
    const mensaje = mensajePlan(d, extras);

    // al quitar un chip con su ×, el foco pasa al chip vecino (o, si no queda
    // ninguno y «Sumaste» se esconde, a «Tu mensaje»), no se pierde en el <body>
    const quitarChip = (n: string) => {
        const k = extras.indexOf(n);
        quitar(n);
        requestAnimationFrame(() => {
            const caja = sumaste.current;
            if (!caja) return;
            const botones = caja.querySelectorAll<HTMLButtonElement>('.pre-dt-chip button');
            (botones[k] ?? botones[k - 1] ?? caja.parentElement?.querySelector<HTMLElement>('.pre-dt-ped-msg .pre-dt-ped-etq'))?.focus({ preventScroll: true });
        });
    };

    return (
        <section id="empezar" className="pre-dt-sec pre-dt-emp" data-tono="oscuro" aria-labelledby="empezar-t">
            <div className="m-wrap">
                <Titular id="empezar-t" className="pre-dt-t" texto={`¿Empezamos tu ${d.pedido}?`} destacar={`${d.pedido}?`} />
                {/* [CONFIRMAR copy con Harley] */}
                <p className="pre-dt-bajada" data-rv>
                    Opcional: marca lo que también te interesa.
                </p>

                <ul className="pre-dt-ext" aria-label="Extras opcionales">
                    {d.extras.map((n, k) => {
                        const on = extras.includes(n);
                        const aparte = tipoDe(n) === 'medida';
                        return (
                            <li key={n} data-rv style={{ '--d': `${k * 0.05}s` } as CSSProperties}>
                                <button type="button" role="switch" aria-checked={on} className="pre-dt-sw" onClick={() => alternar(n)}>
                                    <span className="pre-dt-sw-t">
                                        <b>{nombreExtra(d, n)}</b>
                                        {aparte && <small className="m-mono">{LEYENDA_TIPO.medida}</small>}
                                    </span>
                                    <span className="pre-dt-sw-pista" aria-hidden="true">
                                        <span className="pre-dt-sw-no">No</span>
                                        <span className="pre-dt-sw-si">Sí</span>
                                        <i />
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>

                <div className="pre-dt-ped m-claro" data-tono="claro" data-rv>
                    <div className="pre-dt-ped-top">
                        <img src={d.foto.src} width={d.foto.w} height={d.foto.h} alt="" loading="lazy" decoding="async" style={{ objectPosition: d.foto.pos }} />
                        <span className="pre-dt-ped-plan">
                            {/* [CONFIRMAR copy con Harley] */}
                            <span className="pre-dt-ped-estado">
                                <i aria-hidden="true" />
                                Por cotizar
                            </span>
                            <b>{plan.nombre}</b>
                            <small>{plan.coda}</small>
                        </span>
                    </div>

                    <div ref={sumaste} className="pre-dt-ped-sum" hidden={extras.length === 0}>
                        <p className="m-mono pre-dt-ped-etq">Sumaste</p>
                        <ul className="pre-dt-chips">
                            {extras.map((n) => (
                                <li key={n} className="pre-dt-chip">
                                    <span>{nombreExtra(d, n)}</span>
                                    <button type="button" aria-label={`Quitar ${nombreExtra(d, n)}`} onClick={() => quitarChip(n)}>
                                        <Mas />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="sr-only" aria-live="polite">
                        {extrasLeidos(extras.length)}
                    </p>

                    <div className="pre-dt-ped-msg" data-loop>
                        <p className="m-mono pre-dt-ped-etq" tabIndex={-1}>
                            Tu mensaje
                        </p>
                        <p className="pre-dt-burbuja" key={mensaje}>
                            {sinCorte(mensaje.trimEnd())}
                            <i className="pre-dt-cursor" aria-hidden="true" />
                        </p>
                    </div>

                    <Boton href={wspPlan(d, extras)} externo tinta className="pre-dt-ped-btn">
                        Enviar por WhatsApp
                    </Boton>
                </div>
            </div>
        </section>
    );
}
