import type { ReactNode } from 'react';
import { Flecha, FlechaAbajo } from './iconos';

/* Pildora con chip circular y flecha. La animacion del toque (relleno
   circular, flecha que sale y entra otra) es CSS; Revelador solo pone y quita
   .is-tap al tocar. */

type Variante = 'rojo' | 'claro' | 'tinta' | 'fantasma' | 'fantasma-tinta';

type Props = {
    href: string;
    children: ReactNode;
    variante?: Variante;
    chico?: boolean;
    abajo?: boolean;
    externo?: boolean;
    className?: string;
};

export function Boton({ href, children, variante = 'rojo', chico, abajo, externo, className = '' }: Props) {
    const Icono = abajo ? FlechaAbajo : Flecha;
    return (
        <a
            href={href}
            className={`m-btn m-btn--${variante}${chico ? ' m-btn--chico' : ''} ${className}`}
            {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
            <span>
                {children}
                {externo && <span className="sr-only"> (abre WhatsApp)</span>}
            </span>
            <span className="m-btn-chip" aria-hidden="true">
                <Icono />
                <Icono />
            </span>
        </a>
    );
}
