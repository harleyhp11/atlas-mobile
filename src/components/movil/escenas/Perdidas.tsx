import type { CSSProperties } from 'react';
import { WhatsApp } from '../iconos';
import './escenas.css';
import './perdidas.css';

/* Mini-interfaces de "Lo que pierdes sin web": tres escenas cortas, solo
   CSS, que se pausan fuera de pantalla (data-loop + .is-off). Los nombres y
   mensajes son de MAQUETA: nadie real, ningun negocio real. */

/* ---------------------------------------------------------- CLIENTES
   Alguien busca, salen tres negocios que no son el tuyo y, al final, tu
   fila fantasma con "0 resultados". */
export function UiBusqueda() {
    return (
        <div className="mx-ui px-busca" data-loop aria-hidden="true">
            <div className="px-busca-barra">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="7" cy="7" r="4.5" />
                    <path d="m10.5 10.5 3 3" />
                </svg>
                <span className="px-busca-q">cevichería cerca de mí</span>
                <i className="px-busca-cursor" />
            </div>
            <ul className="px-busca-lista">
                {['Tu competencia', 'Otro local', 'Otra opción'].map((n, k) => (
                    <li key={n} className="px-busca-fila" style={{ '--k': k } as CSSProperties}>
                        <i />
                        <span>
                            <b>{n}</b>
                            <small>Abierto ahora · Ver carta</small>
                        </span>
                        <em>Llamar</em>
                    </li>
                ))}
                <li className="px-busca-fila px-busca-fila--tuya">
                    <i />
                    <span>
                        <b>Tu negocio</b>
                        <small>Sin web, sin ficha</small>
                    </span>
                    <em className="px-busca-cero">0 resultados</em>
                </li>
            </ul>
        </div>
    );
}

/* -------------------------------------------------------------- PLATA
   Domingo, casi medianoche: llegan las preguntas, nadie contesta y la
   ultima ya avisa que compro en otro lado. */
export function UiNoche() {
    const avisos = [
        { t: '¿Todavía atienden? 🙏', h: '23:41' },
        { t: '¿Hacen delivery hoy?', h: '23:44' },
        { t: 'Ya pedí en otro lado, gracias.', h: '23:47' },
    ];
    return (
        <div className="mx-ui px-noche" data-loop aria-hidden="true">
            <div className="px-noche-hora">
                <small>Domingo</small>
                <b>23:47</b>
            </div>
            <ul className="px-noche-avisos">
                {avisos.map((a, k) => (
                    <li key={a.t} className={`px-noche-aviso px-noche-aviso--${k}`}>
                        <span className="px-noche-app">
                            <WhatsApp />
                        </span>
                        <span>
                            <small>Cliente nuevo · {a.h}</small>
                            <b>{a.t}</b>
                        </span>
                    </li>
                ))}
            </ul>
            <span className="px-noche-perdida">
                <i />
                Venta perdida
            </span>
        </div>
    );
}

/* ------------------------------------------------------------- TIEMPO
   La bandeja se llena con la misma pregunta escrita de cuatro maneras, y el
   contador de sin leer no para de subir. */
export function UiChats() {
    const chats = [
        { n: 'María', m: '¿Precio?', c: 3 },
        { n: 'Jorge', m: '¿Cuánto cuesta?', c: 1 },
        { n: 'Lucía', m: '¿Tienen catálogo?', c: 2 },
        { n: 'Carlos', m: '¿Hasta qué hora atienden?', c: 1 },
    ];
    return (
        <div className="mx-ui px-chats" data-loop aria-hidden="true">
            <div className="px-chats-top">
                <b>Chats</b>
                <span className="px-chats-cont">
                    {[3, 5, 7, 8].map((n) => (
                        <span key={n}>{n} sin leer</span>
                    ))}
                </span>
            </div>
            <ul className="px-chats-lista">
                {chats.map((c, k) => (
                    <li key={c.n} className="px-chats-fila" style={{ '--k': k } as CSSProperties}>
                        <i>{c.n[0]}</i>
                        <span>
                            <b>{c.n}</b>
                            <small>{c.m}</small>
                        </span>
                        <em>{c.c}</em>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export const UI_PERDIDA = {
    clientes: UiBusqueda,
    plata: UiNoche,
    tiempo: UiChats,
};
