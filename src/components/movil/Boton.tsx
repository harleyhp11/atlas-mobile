import type { ReactNode } from 'react';
import { Flecha, FlechaAbajo } from './iconos';
import { TintaAnodizada } from './TintaAnodizada';

/* Pildora con chip circular y flecha. La animacion del toque (relleno
   circular, flecha que sale y entra otra) es CSS; Revelador solo pone y quita
   .is-tap al tocar. `tinta` le pone de fondo la tinta anodizada (shader):
   solo los CTA principales de WhatsApp. */

type Variante = 'rojo' | 'claro' | 'tinta' | 'fantasma' | 'fantasma-tinta';

type Props = {
    href: string;
    children: ReactNode;
    variante?: Variante;
    chico?: boolean;
    abajo?: boolean;
    externo?: boolean;
    tinta?: boolean;
    className?: string;
};

export function Boton({ href, children, variante = 'rojo', chico, abajo, externo, tinta, className = '' }: Props) {
    const Icono = abajo ? FlechaAbajo : Flecha;
    return (
        <a
            href={href}
            className={`m-btn m-btn--${variante}${chico ? ' m-btn--chico' : ''}${tinta ? ' m-btn--tinta' : ''} ${className}`}
            {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
            {tinta && <TintaAnodizada />}
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
