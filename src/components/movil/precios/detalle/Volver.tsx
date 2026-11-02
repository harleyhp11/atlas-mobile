'use client';

import type { MouseEvent } from 'react';
import { FlechaIzq } from '../../iconos';

/* «‹» del hero y del dock: vuelve a la lista de planes.

   Es un enlace de verdad a /servicios#planes (sin JS, o llegando de fuera,
   lleva a la lista). Pero si la persona vino desde la lista, mejor
   history.back(): el navegador devuelve el scroll exacto donde estaba, en
   vez de saltar al inicio de #planes. Solo se hace si el referrer es de
   este mismo sitio y su ruta es /servicios; cualquier duda (referrer
   bloqueado, historial de una sola entrada), se sigue el enlace. */

type Props = { className?: string };

export function Volver({ className = '' }: Props) {
    const alTocar = (e: MouseEvent<HTMLAnchorElement>) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        try {
            if (!document.referrer || history.length < 2) return;
            const r = new URL(document.referrer);
            if (r.origin !== location.origin || r.pathname !== '/servicios') return;
            e.preventDefault();
            history.back();
        } catch {
            /* se sigue el enlace */
        }
    };
    return (
        <a className={`pre-dt-volver ${className}`.trim()} href="/servicios#planes" aria-label="Volver a todos los planes" onClick={alTocar}>
            <FlechaIzq />
        </a>
    );
}
