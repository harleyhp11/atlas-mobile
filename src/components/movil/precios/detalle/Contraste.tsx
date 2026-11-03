import './contraste.css';

/* «Hoy → con Atlas»: lo que el cliente hace hoy y le da problemas, contra lo
   que cambia. Dos cuadros con una flecha: arriba el de hoy (rojo, sello ✕,
   palabra tachada), abajo el nuevo (claro, sello ✓). Icono + dos palabras:
   se entiende sin leer (pedido de Harley). Lo usan las maquetas de la
   tienda y de la landing, que lo ubican y lo animan cada una a su tiempo
   (por className). Decorativo: va dentro de una maqueta aria-hidden. */

export type Icono =
    | 'papel'
    | 'impresora'
    | 'pdf'
    | 'drive'
    | 'qr'
    | 'lapiz'
    | 'enlace'
    | 'carrito'
    | 'bio'
    | 'pagina'
    | 'chat'
    | 'claro'
    | 'dudas'
    | 'excel'
    | 'correo';

export type Par = { antes: string; ia: Icono; ahora: string; ib: Icono };

export function Contraste({ antes, ia, ahora, ib, className = '' }: Par & { className?: string }) {
    return (
        <div className={`pre-vs ${className}`}>
            <span className="pre-vs-lado is-no">
                <span className="pre-vs-ic">
                    <Ico i={ia} />
                    <i>✕</i>
                </span>
                <s>{antes}</s>
            </span>
            <span className="pre-vs-flecha">↓</span>
            <span className="pre-vs-lado is-si">
                <span className="pre-vs-ic">
                    <Ico i={ib} />
                    <i>✓</i>
                </span>
                <b>{ahora}</b>
            </span>
        </div>
    );
}

export function Ico({ i }: { i: Icono }) {
    const t = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
    switch (i) {
        case 'papel':
            // una hoja arrugada, con su mancha
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M6 3h9l3 3v15l-3-1.5L12 21l-3-1.5L6 21z" />
                    <path d="M9 8h6M9 11h6M9 14h3" />
                    <circle cx="15" cy="16" r="1.6" fill="currentColor" stroke="none" />
                </svg>
            );
        case 'impresora':
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M7 9V3h10v6M7 17H4v-7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v7h-3" />
                    <path d="M7 14h10v7H7z" />
                </svg>
            );
        case 'pdf':
            return (
                <svg viewBox="0 0 24 24">
                    <path d="M6 2h9l4 4v16H6z" fill="#f4f1ea" />
                    <path d="M15 2v4h4" fill="#d8d5cd" />
                    <rect x="3" y="11" width="13" height="7" rx="1.5" fill="#e11d3a" />
                    <text x="9.5" y="16.6" textAnchor="middle" fontSize="5.2" fontWeight="800" fill="#fff" fontFamily="system-ui, sans-serif">
                        PDF
                    </text>
                </svg>
            );
        case 'drive':
            // el triangulo de tres colores de una carpeta en la nube
            return (
                <svg viewBox="0 0 24 24">
                    <path d="M8.5 3h7l7 12h-7z" fill="#f5c451" />
                    <path d="M8.5 3 1.5 15l3.5 6 7-12z" fill="#2fa86b" />
                    <path d="M5 21h14l3.5-6h-14z" fill="#3b7bf0" />
                </svg>
            );
        case 'qr':
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
                    <path d="M14 14h2v2h-2zM18 14h2M14 18h2v2M18 18h2v2" />
                </svg>
            );
        case 'lapiz':
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M15 4l5 5L9 20H4v-5z" />
                    <path d="M13 6l5 5" />
                </svg>
            );
        case 'enlace':
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
                    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
                </svg>
            );
        case 'bio':
            // un perfil de red social: foto redonda y la cuadricula de posts
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
                </svg>
            );
        case 'pagina':
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M3 8h18M7 12h10M7 15h6" />
                    <path d="M14 15.5h3v2h-3z" fill="currentColor" stroke="none" />
                </svg>
            );
        case 'chat':
            // muchos mensajes que se apilan
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M4 5h11a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H9l-3 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
                    <path d="M16 9h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1v3l-3-3h-4a1 1 0 0 1-1-1v-1" />
                </svg>
            );
        case 'claro':
            // un mensaje que se entiende: el titulo, una linea y el boton
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M5 5h14M5 9h9" />
                    <rect x="5" y="14" width="9" height="5" rx="2.5" />
                    <path d="M17 16.5l1.5 1.5 2.5-3" />
                </svg>
            );
        case 'dudas':
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7" />
                    <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
                </svg>
            );
        case 'excel':
            // la hoja de calculo verde, con su X
            return (
                <svg viewBox="0 0 24 24">
                    <rect x="7" y="3" width="14" height="18" rx="2" fill="#f4f1ea" />
                    <path d="M11 7h7M11 11h7M11 15h7M11 19h7" stroke="#bfbcb4" strokeWidth="1.2" />
                    <rect x="2" y="7" width="11" height="11" rx="2" fill="#1f7a4a" />
                    <path d="M5 10l5 5M10 10l-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            );
        case 'correo':
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3.5 6.5 12 13l8.5-6.5" />
                </svg>
            );
        case 'carrito':
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M3 4h2l2.5 11h10L20 7H7" />
                    <circle cx="9" cy="19" r="1.4" />
                    <circle cx="17" cy="19" r="1.4" />
                </svg>
            );
    }
}
