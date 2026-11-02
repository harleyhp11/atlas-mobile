import type { CSSProperties } from 'react';
import { Flecha, Reloj } from '../../iconos';
import { entregaLeida, FRASES, precioLeido, type Detalle } from '../planes';
import { PrecioPlan } from './PrecioPlan';
import './comun.css';

/* La tarjeta de un plan (refs 30 y 33): los tiles del bento de #planes y los
   de «Otros planes» en el detalle. Toda la tarjeta es UN enlace a
   /servicios/[slug]; se reconoce por su material (data-mat: hueso, niebla,
   grafito, carbon), el mismo en la lista, el detalle y el dock.

   Dos tamaños:
     · 'ancho'  — a todo el ancho: nombre arriba, precio grande abajo a la
       izquierda y la entrega a la derecha;
     · 'cuadro' — media columna: nombre, precio con la cola abajo y una fila
       final con la entrega y el chip ↗.
   El plan a medida (Software) va en mayusculas y sin cifra (data-medida).

   El estado que marcan los chips de la lista viaja en data-estado ('para'
   o 'tenue'), NUNCA en className: la tarjeta lleva data-rv y si React le
   cambiara la clase le borraria el .is-in de Revelador y volveria a
   esconderse (gotcha documentado en Servicios.tsx).

   El nombre lleva view-transition-name (pre-plan-<slug>): al tocar la
   tarjeta, el nombre viaja hasta el h1 del detalle. Va en un inline-block,
   porque un nombre partido en dos cajas aborta la transicion. Donde el
   mismo nombre ya esta en la pagina (el h1 del detalle), `transicion`
   en false lo apaga.

   Lo visible del precio y la entrega va con aria-hidden: el enlace se lee
   «Landing page que convierte. De 600 a 1,500 soles. Entrega en 7 a 10
   días. Ver el plan.», una sola vez y en orden. */

// «7 – 10 días» no se parte nunca: ni alrededor del guion ni antes de la
// unidad. En el cuadro (media columna, al lado del chip ↗) va ademas sin
// espacios en el guion, «7–10 días», como la cifra de «¿Cuándo está listo?»:
// asi entra en una linea hasta en 360 px.
const sinCorte = (s: string, junto = false) =>
    s.replace(/ – /g, junto ? '–' : '\u00a0–\u00a0').replace(/ (días|semanas)/gi, '\u00a0$1');

type Props = {
    d: Detalle;
    tam: 'ancho' | 'cuadro';
    estado?: 'para' | 'tenue';
    revelar?: boolean;
    retraso?: number;
    cuenta?: boolean;
    transicion?: boolean;
    as?: 'h2' | 'h3';
};

export function TarjetaPlan({ d, tam, estado, revelar, retraso = 0, cuenta, transicion = true, as: Tag = 'h3' }: Props) {
    const { plan } = d;
    const ancho = tam === 'ancho';
    const estilo = retraso ? ({ '--d': `${retraso}s` } as CSSProperties) : undefined;
    return (
        <a
            className="pre-c-tile"
            href={`/servicios/${d.slug}`}
            data-mat={d.material}
            data-tam={tam}
            data-estado={estado}
            data-medida={plan.aMedida ? '' : undefined}
            data-rv={revelar ? '' : undefined}
            style={estilo}
        >
            <span className="pre-c-tile-para" aria-hidden="true">
                <i />
                Para ti
            </span>
            <Tag className="pre-c-tile-n">
                <span className="pre-c-tile-nom" style={transicion ? { viewTransitionName: `pre-plan-${d.slug}` } : undefined}>
                    {plan.nombre}
                </span>{' '}
                <span className="pre-c-tile-coda">{plan.coda}</span>
            </Tag>
            {plan.aMedida && ancho && <span className="pre-c-tile-extra">{FRASES.sistemas}</span>}
            <span className="pre-c-tile-precio" aria-hidden="true">
                <PrecioPlan plan={plan} tam={ancho ? 'xl' : 'l'} cola={ancho ? 'chica' : 'abajo'} cuenta={cuenta} />
            </span>
            {/* en el cuadro no cabe la palabra «Entrega»: la dice el reloj */}
            <span className="pre-c-tile-ent" aria-hidden="true">
                <small className="m-mono">Entrega</small>
                {!ancho && <Reloj className="pre-c-tile-reloj" />}
                <b>{sinCorte(plan.entrega, !ancho)}</b>
            </span>
            <span className="pre-c-tile-ir" aria-hidden="true">
                <Flecha />
            </span>
            <span className="sr-only">
                {' '}
                {precioLeido(plan)}. {entregaLeida(plan)}.{estado === 'para' ? ' Recomendado para tu caso.' : ''} Ver el plan.
            </span>
        </a>
    );
}
