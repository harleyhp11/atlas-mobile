import type { CSSProperties } from 'react';
import { WhatsApp } from '../iconos';
import './escenas-base.css';
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
   Un pedido sin sistema, de principio a fin: llega por WhatsApp, se anota a
   mano entre decenas de chats iguales, nadie lo ve en cocina y el cliente
   reclama. Arriba el reloj del pedido sube de 2 a 47 min y la barra pasa la
   marca de lo prometido (20 min) y se pone roja; al final, el sello. */
export function UiPedido() {
    const pasos = [
        { t: 'Llega por WhatsApp', s: '2 pollos · delivery', ico: 'ok' },
        { t: 'Lo anotas a mano', s: 'entre 30 chats que preguntan lo mismo', ico: 'lapiz' },
        { t: 'En cocina no lo ven', s: 'sin aviso, sin orden de llegada', ico: 'mal' },
        { t: '«¿Y mi pedido?»', s: 'el cliente sigue esperando', ico: 'mal' },
    ] as const;
    return (
        <div className="mx-ui px-ped" data-loop aria-hidden="true">
            <div className="px-ped-top">
                <span>
                    <b>Pedido #048</b>
                    <small>María · delivery</small>
                </span>
                <span className="px-ped-reloj">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <circle cx="8" cy="8" r="6" />
                        <path d="M8 4.8V8l2.2 1.4" />
                    </svg>
                    <span className="px-ped-min">
                        {['02', '09', '21', '47'].map((m) => (
                            <span key={m}>{m} min</span>
                        ))}
                    </span>
                </span>
            </div>

            <div className="px-ped-barra">
                <i />
                <span className="px-ped-meta">
                    <small>Prometido: 20 min</small>
                </span>
            </div>

            <ul className="px-ped-pasos">
                {pasos.map((p, k) => (
                    <li key={p.t} className={`px-ped-paso px-ped-paso--${p.ico}`} style={{ '--k': k } as CSSProperties}>
                        <i>
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {p.ico === 'ok' && <path d="m4 8.5 2.6 2.5L12 5.5" />}
                                {p.ico === 'lapiz' && <path d="M10.5 3.5 12.5 5.5 6 12H4v-2z" />}
                                {p.ico === 'mal' && <path d="m5 5 6 6M11 5l-6 6" />}
                            </svg>
                        </i>
                        <span>
                            <b>{p.t}</b>
                            <small>{p.s}</small>
                        </span>
                    </li>
                ))}
            </ul>

            <span className="px-ped-sello">
                Retrasado
                <small>47 min · cliente perdido</small>
            </span>
        </div>
    );
}

export const UI_PERDIDA = {
    clientes: UiBusqueda,
    plata: UiNoche,
    tiempo: UiPedido,
};
