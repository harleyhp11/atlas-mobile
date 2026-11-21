import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { MarcoFigma } from './MarcoFigma';

/* Titular que entra palabra a palabra, cada una desde detras de su mascara
   (~1 s, 60 ms entre palabras). La palabra destacada lleva:
     · 'caja': una caja roja que barre detras, con el texto en blanco;
     · 'marco': el recuadro de seleccion de Figma con sus medidas.
   El texto completo queda en el DOM tal cual: el lector de pantalla lo lee
   de corrido. Un "\n" en `texto` fuerza un salto de linea ahi. */

type Props = {
    texto: string;
    destacar?: string;
    modo?: 'caja' | 'marco';
    as?: 'h1' | 'h2' | 'h3';
    id?: string;
    className?: string;
    retraso?: number;
};

export function Titular({ texto, destacar, modo = 'caja', as: Tag = 'h2', id, className = '', retraso = 0 }: Props) {
    const lineas = texto.split('\n').map((l) => l.trim().split(' '));
    const palabras = lineas.flat();
    // posicion de la ultima palabra de cada linea, para poner el salto
    const finales = new Set(lineas.slice(0, -1).map((_, k) => lineas.slice(0, k + 1).flat().length - 1));
    return (
        <Tag id={id} className={`m-tit ${className}`} data-in style={{ '--d': `${retraso}s` } as CSSProperties}>
            {palabras.map((p, i) => {
                const esDestacada = destacar === p;
                const estilo = { '--i': i } as CSSProperties;
                let contenido: ReactNode = (
                    <span className={`m-w${esDestacada && modo === 'caja' ? ' m-w--caja' : ''}`} style={estilo}>
                        <span>{p}</span>
                    </span>
                );
                if (esDestacada && modo === 'marco') {
                    contenido = (
                        <MarcoFigma etiqueta={p.replace(/[.,]$/, '')}>
                            <span className="m-w" style={estilo}>
                                <span>{p}</span>
                            </span>
                        </MarcoFigma>
                    );
                }
                return (
                    <Fragment key={i}>
                        {contenido}
                        {finales.has(i) ? <br /> : i < palabras.length - 1 ? ' ' : null}
                    </Fragment>
                );
            })}
        </Tag>
    );
}
