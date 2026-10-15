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
