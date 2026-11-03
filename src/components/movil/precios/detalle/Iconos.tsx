import { Documento, Enchufe, Salvavidas, WhatsApp } from '../../iconos';
import type { IconoIncluye as NombreIcono } from '../planes';

/* Los iconos que le faltan a iconos.tsx para el detalle de los planes, con
   el mismo trazo (24 × 24, 1,6, extremos redondos). Van aparte para no
   tocar el archivo comun de la version movil: la home no los usa.

   IconoIncluye elige el icono de cada fila de «Todo lo que incluye» por su
   nombre (planes.ts → DETALLES[i].incluye[k].icono). */

type P = { className?: string };

const Trazo = ({ className, children }: P & { children: React.ReactNode }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
);

export { Documento, Enchufe, Salvavidas, WhatsApp };

export const Qr = ({ className }: P) => (
    <Trazo className={className}>
        <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2" />
        <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2" />
        <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2" />
        <path d="M6.75 6.75h.01M17.25 6.75h.01M6.75 17.25h.01M14 14h2.5v2.5M20.5 14v.01M14 20.5h.01M17.5 20.5h3v-3M17.25 17.25h.01" />
    </Trazo>
);

export const Lapiz = ({ className }: P) => (
    <Trazo className={className}>
        <path d="M15.5 4.5 19.5 8.5 8.5 19.5 3.8 20.2l.7-4.7z" />
        <path d="m13.5 6.5 4 4" />
    </Trazo>
);

export const Pluma = ({ className }: P) => (
    <Trazo className={className}>
        <path d="M12 21v-5.5" />
        <path d="M12 3.5 6.5 9.8l2 6.2h7l2-6.2z" />
        <circle cx="12" cy="11.6" r="1.6" />
        <path d="M12 3.5V10" />
    </Trazo>
);

export const Sobre = ({ className }: P) => (
    <Trazo className={className}>
        <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
        <path d="m3.8 7 8.2 6 8.2-6" />
    </Trazo>
);

export const Megafono = ({ className }: P) => (
    <Trazo className={className}>
        <path d="M4 10v4a1 1 0 0 0 1 1h2.5L15 19V5L7.5 9H5a1 1 0 0 0-1 1z" />
        <path d="M7.5 15 9 20.5M18.5 9.5a3.5 3.5 0 0 1 0 5" />
    </Trazo>
);

export const Grafico = ({ className }: P) => (
    <Trazo className={className}>
        <path d="M4 4v15.5a.5.5 0 0 0 .5.5H20" />
        <path d="m7.5 15 3.5-4 3 2.5 5-6.5" />
        <path d="M15.5 7H19v3.5" />
    </Trazo>
);

export const Blog = ({ className }: P) => (
    <Trazo className={className}>
        <rect x="3.5" y="4" width="17" height="16" rx="2" />
        <path d="M7 8h10M7 12h5M7 16h4" />
        <rect x="14.5" y="12" width="3" height="4" rx=".6" />
    </Trazo>
);

export const Arroba = ({ className }: P) => (
    <Trazo className={className}>
        <circle cx="12" cy="12" r="3.6" />
        <path d="M15.6 8.6v4.6a2.4 2.4 0 0 0 4.8 0V12a8.4 8.4 0 1 0-3.3 6.7" />
    </Trazo>
);

export const Lupa = ({ className }: P) => (
    <Trazo className={className}>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" />
    </Trazo>
);

export const Capas = ({ className }: P) => (
    <Trazo className={className}>
        <path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8z" />
        <path d="m3.5 12 8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5" />
    </Trazo>
);

/* boton de la maqueta (WCAG 2.2.2: lo que se mueve solo se puede parar) */
export const Pausa = ({ className }: P) => (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <rect x="4" y="3" width="2.6" height="10" rx="1" />
        <rect x="9.4" y="3" width="2.6" height="10" rx="1" />
    </svg>
);

export const Reproducir = ({ className }: P) => (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M5 3.4v9.2a.7.7 0 0 0 1.05.6l7.5-4.6a.7.7 0 0 0 0-1.2l-7.5-4.6A.7.7 0 0 0 5 3.4Z" />
    </svg>
);

export function IconoIncluye({ nombre, className }: { nombre: NombreIcono; className?: string }) {
    switch (nombre) {
        case 'whatsapp':
            return <WhatsApp className={className} />;
        case 'qr':
            return <Qr className={className} />;
        case 'lapiz':
            return <Lapiz className={className} />;
        case 'pluma':
            return <Pluma className={className} />;
        case 'sobre':
            return <Sobre className={className} />;
        case 'megafono':
            return <Megafono className={className} />;
        case 'grafico':
            return <Grafico className={className} />;
        case 'blog':
            return <Blog className={className} />;
        case 'arroba':
            return <Arroba className={className} />;
        case 'lupa':
            return <Lupa className={className} />;
        case 'documento':
            return <Documento className={className} />;
        case 'capas':
            return <Capas className={className} />;
        case 'enchufe':
            return <Enchufe className={className} />;
        case 'salvavidas':
            return <Salvavidas className={className} />;
    }
}
