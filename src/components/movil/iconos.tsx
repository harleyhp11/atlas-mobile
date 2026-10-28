/* Iconos de la home movil, a mano y en linea: un puñado de trazos no
   justifica cargar una libreria entera de iconos en el celular. */

type P = { className?: string };

export const Flecha = ({ className }: P) => (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
);

export const FlechaAbajo = ({ className }: P) => (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
    </svg>
);

export const Check = ({ className }: P) => (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m3.5 8.5 3 3 6-7" />
    </svg>
);

export const WhatsApp = ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2.1.7 2.8.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.3-.2Z" />
    </svg>
);

export const Estrella = ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 1.5c.5 5.6 4.9 10 10.5 10.5-5.6.5-10 4.9-10.5 10.5-.5-5.6-4.9-10-10.5-10.5C7.1 11.5 11.5 7.1 12 1.5Z" />
    </svg>
);

/* El simbolo de Atlas (rampa + cuadrado), el mismo trazo del favicon. */
export const SimboloAtlas = ({ className }: P) => (
    <svg className={className} viewBox="0 0 464 328" fill="currentColor" aria-hidden="true">
        <path d="M0 328 L326 0 L326 194 L189 328 Z" />
        <rect x="328" y="194" width="136" height="134" />
    </svg>
);

/* ---- /nosotros: trazos de 24 (1,6) y flechas de 16 (1,8) ---- */

const Trazo = ({ className, children }: P & { children: React.ReactNode }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
);

export const Mas = ({ className }: P) => (
    <Trazo className={className}>
        <path d="M12 5v14M5 12h14" />
    </Trazo>
);

export const Compas = ({ className }: P) => (
    <Trazo className={className}>
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </Trazo>
);

export const Cursor = ({ className }: P) => (
    <Trazo className={className}>
        <path d="M5 3.5 18.5 10l-5.8 1.9L10.8 18z" />
    </Trazo>
);

export const Llaves = ({ className }: P) => (
    <Trazo className={className}>
        <path d="M9 4.5C7 4.5 7 6 7 8s-1.5 4-3 4c1.5 0 3 2 3 4s0 3.5 2 3.5M15 4.5c2 0 2 1.5 2 3.5s1.5 4 3 4c-1.5 0-3 2-3 4s0 3.5-2 3.5" />
    </Trazo>
);

export const Enchufe = ({ className }: P) => (
    <Trazo className={className}>
        <path d="M9 3v4M15 3v4M7 7h10v4a5 5 0 0 1-10 0zM12 16v5" />
    </Trazo>
);

export const Servidor = ({ className }: P) => (
    <Trazo className={className}>
        <rect x="4" y="4" width="16" height="7" rx="2" />
        <rect x="4" y="13" width="16" height="7" rx="2" />
        <path d="M8 7.5h.01M8 16.5h.01" />
    </Trazo>
);

export const Documento = ({ className }: P) => (
    <Trazo className={className}>
        <path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5zM14 3.5V8h4M9 14l2 2 4-4.5" />
    </Trazo>
);

export const Reloj = ({ className }: P) => (
    <Trazo className={className}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
    </Trazo>
);

export const Salvavidas = ({ className }: P) => (
    <Trazo className={className}>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="m6 6 3.5 3.5M14.5 14.5 18 18M18 6l-3.5 3.5M9.5 14.5 6 18" />
    </Trazo>
);

export const Llave = ({ className }: P) => (
    <Trazo className={className}>
        <circle cx="8" cy="15" r="4" />
        <path d="m11 12 8.5-8.5M16 7l2.5 2.5M14 9l2 2" />
    </Trazo>
);

export const FlechaIzq = ({ className }: P) => (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 8H3.5M7.5 4 3.5 8l4 4" />
    </svg>
);

export const FlechaDer = ({ className }: P) => (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 8h9.5M8.5 4l4 4-4 4" />
    </svg>
);

export const LinkedIn = ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.83v1.54h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.13V21h-4v-5.02c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.93 1.3-1.93 2.65V21h-4z" />
    </svg>
);
