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
   Una carrera que se entiende sin leer: el mismo pedido hecho a mano y
   con sistema. El de sistema llega en un tiron; el de a mano avanza a
   tirones (cuaderno, papel en cocina, cuenta a mano), se pone rojo y al
   final queda la diferencia en grande. Minutos de MAQUETA. */
export function UiPedido() {
    const mano = ['Lo anotan en un cuaderno', 'El papel espera en cocina', 'Sacan la cuenta a mano'];
    return (
        <div className="mx-ui px-ped" data-loop aria-hidden="true">
            <p className="px-ped-etq">El mismo pedido</p>

            <div className="px-ped-carril px-ped-carril--mano">
                <div className="px-ped-cab">
                    <b>A mano</b>
                    <span className="px-ped-min">
                        {['02', '15', '31', '47'].map((m) => (
                            <span key={m}>{m} min</span>
                        ))}
                    </span>
                </div>
                <div className="px-ped-barra">
                    <i />
                </div>
                <span className="px-ped-estado">
                    {mano.map((t) => (
                        <small key={t}>{t}…</small>
                    ))}
                </span>
            </div>

            <div className="px-ped-carril px-ped-carril--sis">
                <div className="px-ped-cab">
                    <b>Con sistema</b>
                    <span className="px-ped-listo">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3.5 8.5 3 3 6-7" />
                        </svg>
                        5 min
                    </span>
                </div>
                <div className="px-ped-barra">
                    <i />
                </div>
                <span className="px-ped-estado">
                    <small>Llega solo a cocina y a la cuenta</small>
                </span>
            </div>

            <p className="px-ped-dif">
                <b>+42 min</b>
                <small>de espera para tu cliente</small>
            </p>
        </div>
    );
}

export const UI_PERDIDA = {
    clientes: UiBusqueda,
    plata: UiNoche,
    tiempo: UiPedido,
};
