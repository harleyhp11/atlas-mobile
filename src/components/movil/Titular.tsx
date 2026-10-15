import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { MarcoFigma } from './MarcoFigma';

/* Titular que entra palabra a palabra, cada una desde detras de su mascara
   (~1 s, 60 ms entre palabras). La palabra destacada lleva:
     · 'caja': una caja roja que barre detras, con el texto en blanco;
     · 'marco': el recuadro de seleccion de Figma con sus medidas.
   El texto completo queda en el DOM tal cual: el lector de pantalla lo lee
   de corrido. */

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
    const palabras = texto.split(' ');
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
                        {i < palabras.length - 1 ? ' ' : null}
                    </Fragment>
                );
            })}
        </Tag>
    );
}
