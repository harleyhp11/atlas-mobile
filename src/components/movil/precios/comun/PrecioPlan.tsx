import type { CSSProperties } from 'react';
import { miles, precioLeido, rango, type Plan } from '../planes';
import './comun.css';

/* El precio de un plan, igual en la lista, el comparador y el detalle: un
   solo marcado para que «S/ 600 – 1,500» se lea igual en todas partes.

   El rango NUNCA se escribe a mano: sale de plan.precio con rango(). Lo
   visible va con aria-hidden y el lector de pantalla oye la frase entera
   («De 600 a 1,500 soles»), no "ese barra seiscientos guion…".

   `cuenta` anima el «desde» con el contador de Revelador (data-cuenta), y
   solo si es menor que 1000: el contador escribe el numero sin coma y con
   «1200» romperia el formato «1,200» del dato. El contador corre cuando se
   revela un ancestro con data-rv o data-in (la tarjeta del bento, por
   ejemplo); sin ese ancestro el numero se queda quieto en su valor.

   Tamaños (data-tam) y colas (data-cola) en comun.css:
     · 'chica'   — la cola chica al lado, apagada (por defecto);
     · 'abajo'   — la cola chica en la linea siguiente (tarjetas cuadradas);
     · 'fundido' — la cola al tamaño del «desde», desvaneciendose (ref 31). */

type Props = {
    plan: Plan;
    tam: 'xl' | 'l' | 'm';
    cola?: 'chica' | 'abajo' | 'fundido';
    cuenta?: boolean;
    className?: string;
};

export function PrecioPlan({ plan, tam, cola = 'chica', cuenta, className = '' }: Props) {
    const r = rango(plan);
    const clases = `pre-c-precio ${className}`.trim();

    if (!r) {
        return (
            <span className={clases} data-tam={tam} data-cola={cola} data-medida="">
                <span className="pre-c-precio-v" aria-hidden="true">
                    <b>{plan.precio}</b>
                </span>
                <span className="sr-only">{precioLeido(plan)}</span>
            </span>
        );
    }

    const anima = cuenta && r.desde < 1000;
    return (
        <span className={clases} data-tam={tam} data-cola={cola}>
            <span className="pre-c-precio-v" aria-hidden="true">
                <small className="pre-c-precio-mon">S/</small>
                {anima ? (
                    <b data-cuenta={r.desde} data-dura="1100" style={{ '--cifras': String(r.desde).length } as CSSProperties}>
                        {miles(r.desde)}
                    </b>
                ) : (
                    <b>{miles(r.desde)}</b>
                )}
                <span className="pre-c-precio-cola">– {miles(r.hasta)}</span>
            </span>
            <span className="sr-only">{precioLeido(plan)}</span>
        </span>
    );
}
