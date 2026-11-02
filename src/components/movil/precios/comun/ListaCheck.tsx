import type { CSSProperties } from 'react';
import { Check } from '../../iconos';
import './comun.css';

/* Lista con checks en circulo (ref 31): «lo que incluye», «te sirve si…»,
   los factores del precio. Sirve sobre negro ('oscuro') y sobre las hojas
   claras ('claro').

   Con `dibujar`, el trazo de cada check se dibuja al revelarse la lista
   (data-in → .is-in de Revelador), uno tras otro cada 70 ms: la lista se va
   marcando. Sin JS o con movimiento reducido, los checks ya estan
   dibujados.

   El tono va en data-checks y NO en data-tono: la Cabecera lee data-tono de
   todo lo que pasa por debajo para elegir su color, y una lista no es una
   seccion. */

type Item = string | { t: string; d: string };

type Props = {
    items: Item[];
    tono?: 'oscuro' | 'claro';
    dibujar?: boolean;
    className?: string;
};

export function ListaCheck({ items, tono = 'oscuro', dibujar, className = '' }: Props) {
    return (
        <ul className={`pre-c-checks ${className}`.trim()} data-checks={tono} data-dibujar={dibujar ? '' : undefined} data-in>
            {items.map((it, k) => (
                <li key={k} style={{ '--i': k } as CSSProperties}>
                    <span className="pre-c-check" aria-hidden="true">
                        <Check />
                    </span>
                    <span className="pre-c-checks-t">
                        {typeof it === 'string' ? (
                            it
                        ) : (
                            <>
                                <b>{it.t}</b> {it.d}
                            </>
                        )}
                    </span>
                </li>
            ))}
        </ul>
    );
}
