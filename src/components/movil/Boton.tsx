import type { ReactNode } from 'react';
import { Flecha, FlechaAbajo } from './iconos';
import { TintaAnodizada } from './TintaAnodizada';

/* Pildora con chip circular y flecha. La animacion del toque (relleno
   circular, flecha que sale y entra otra) es CSS; Revelador solo pone y quita
   .is-tap al tocar. `tinta` le pone de fondo la tinta anodizada (shader):
   solo los CTA principales de WhatsApp. */

type Variante = 'rojo' | 'claro' | 'tinta' | 'fantasma' | 'fantasma-tinta';

type Props = {
    href?: string;
    children: ReactNode;
    variante?: Variante;
    chico?: boolean;
    abajo?: boolean;
    externo?: boolean;
    tinta?: boolean;
    className?: string;
    /* Lo que oye el lector de pantalla tras el texto de un enlace externo.
       Por defecto, " (abre WhatsApp)": casi todos los externos lo son. */
    aviso?: string;
    /* Enlace que todavia no existe (un CV por subir): mismo aspecto, sin
       href, anunciado como enlace deshabilitado y con " (pronto)". */
    pendiente?: boolean;
};

export function Boton({
    href,
    children,
    variante = 'rojo',
    chico,
    abajo,
    externo,
    tinta,
    className = '',
    aviso = ' (abre WhatsApp)',
    pendiente,
}: Props) {
    const Icono = abajo ? FlechaAbajo : Flecha;
    const clases = `m-btn m-btn--${variante}${chico ? ' m-btn--chico' : ''}${tinta ? ' m-btn--tinta' : ''} ${className}`;
    const interior = (
        <>
            {tinta && <TintaAnodizada />}
            <span>
                {children}
                {pendiente ? <span className="sr-only"> (pronto)</span> : externo && <span className="sr-only">{aviso}</span>}
            </span>
            <span className="m-btn-chip" aria-hidden="true">
                <Icono />
                <Icono />
            </span>
        </>
    );
    if (pendiente || !href) {
        return (
            <span role="link" aria-disabled="true" data-pendiente="" className={clases}>
                {interior}
            </span>
        );
    }
    return (
        <a href={href} className={clases} {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {interior}
        </a>
    );
}
