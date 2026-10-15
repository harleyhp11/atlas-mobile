import type { ReactNode } from 'react';

/* Etiqueta mono sobre cada titular. Dos sistemas, uno por direccion:
     · 'pildoras': las cinco mini-pildoras rojas de Atlas;
     · 'num': pildora "(01) Servicios" con el punto rojo que hace ping. */

type Props = {
    n?: string;
    children: ReactNode;
    sistema?: 'pildoras' | 'num';
    className?: string;
};

export function Ceja({ n, children, sistema = 'num', className = '' }: Props) {
    if (sistema === 'pildoras') {
        return (
            <p className={`m-ceja m-mono ${className}`} data-rv>
                <span className="m-ceja-pills" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                </span>
                {n && <span>{n}</span>}
                <span>{children}</span>
            </p>
        );
    }
    return (
        <p className={`m-ceja m-ceja--num m-mono ${className}`} data-rv>
            <i className="m-ping" aria-hidden="true" />
            {n && <span>({n})</span>}
            <b>{children}</b>
        </p>
    );
}
