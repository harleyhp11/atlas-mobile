'use client';

import { useRef, type CSSProperties } from 'react';
import { CHISPA, Cursor, GIROS, Gauge, Odo, RUBROS, Toast, useApunte } from '@/components/sections/faq/escenas';
import { easeOut, tramo, useReloj } from '@/components/sections/faq/hooks';
import './reales.css';

/* Las dos escenas del FAQ del escritorio (Navegador y Panel), rehechas para
   el celular con contenido de verdad en lugar de bloques grises (pedido de
   Harley: "que se vean mas realistas"). Usan las mismas piezas y clases del
   FAQ —el escritorio no cambia— y la misma marca: tinta, hueso y un rojo.

   Todo es de MAQUETA: "Brasa & Mar" es un restaurante inventado y el hotel
   del panel tambien; las fotos son CC0 del Directorio de Fotos de WordPress
   (public/assets/movil/escenas). */

const F = '/assets/movil/escenas';

/* =============================================================== WEB
   Se escribe la direccion, carga y aparece la web de un restaurante: su
   foto, los platos con precio y las reseñas. Baja, vuelve, y el cursor la
   pasa a vista de celular. Mismos tiempos que la del escritorio. */

const URL_WEB = 'brasaymar.pe';
const CMD = 'next build';
const WEB_CICLO = 11400;
const PLATOS = [
    { n: 'Ceviche clásico', p: 'S/ 32', f: 'ceviche' },
    { n: 'Lomo a la parrilla', p: 'S/ 38', f: 'lomo' },
    { n: 'Nikkei del día', p: 'S/ 45', f: 'nikkei' },
];

export function UiWebMovil({ run }: { run: boolean }) {
    const t = useReloj(run, WEB_CICLO, 2900);
    const escrito = Math.min(URL_WEB.length, Math.max(0, Math.floor((t - 300) / 70)));
    const carga = tramo(t, 1250, 700);
    const cargando = t >= 1250 && t < 2050;
    const pintado = t >= 1950;
    const veloz = t >= 2250;
    const abajo = t >= 3000 && t < 5200;
    const movil = t >= 7000 && t < 9200;
    const apunta = !run ? '' : t >= 6300 && t < 7500 ? 'a' : t >= 8500 && t < 9700 ? 'b' : '';
    const clicks = t >= 9200 ? 2 : t >= 7000 ? 1 : 0;
    const tc = Math.min(CMD.length, Math.max(0, Math.floor((t - 150) / 55)));
    const reset = t > WEB_CICLO - 450;

    const cont = useRef<HTMLDivElement>(null);
    const dev = useRef<HTMLSpanElement>(null);
    const p = useApunte(cont, () => (apunta ? dev.current : null), apunta, 0.5, 0.55);

    return (
        <div ref={cont} className={`afq-ui afq-web mx-web${reset ? ' is-reset' : ''}`}>
            <div className={`afq-br${movil ? ' is-movil' : ''}`}>
                <div className="afq-br-bar">
                    <span className="afq-br-dots">
                        <i />
                        <i />
                        <i />
                    </span>
                    <span className="afq-br-url">
                        <svg viewBox="0 0 12 12">
                            <rect x="2.5" y="5.2" width="7" height="5.3" rx="1.2" />
                            <path d="M4 5.2 V3.9 a2 2 0 0 1 4 0 V5.2" />
                        </svg>
                        <span>{URL_WEB.slice(0, escrito)}</span>
                        {run && escrito < URL_WEB.length && <i className="afq-caret" />}
                    </span>
                    <span ref={dev} className={`afq-br-dev${movil ? ' is-on' : ''}`}>
                        <svg viewBox="0 0 12 12">
                            <rect x="3.2" y="1" width="5.6" height="10" rx="1.4" />
                            <path d="M5.3 9.1 H6.7" />
                        </svg>
                    </span>
                    <span className="afq-br-load" style={{ transform: `scaleX(${carga})`, opacity: cargando ? 1 : 0 }} />
                </div>
                <div className="afq-br-vp">
                    <div className={`afq-pg mx-w${pintado ? ' is-on' : ''}${abajo ? ' is-abajo' : ''}`}>
                        <span className="mx-w-nav">
                            <b>Brasa &amp; Mar</b>
                            <i>Carta</i>
                            <i>Locales</i>
                            <em>Reservar</em>
                        </span>
                        <span className="mx-w-hero" style={{ backgroundImage: `url(${F}/local.webp)` }}>
                            <small>Barranco · Lima</small>
                            <strong>Cocina peruana a la brasa</strong>
                            <em>Reservar mesa</em>
                        </span>
                        <span className="mx-w-sec">
                            <b>Lo más pedido</b>
                            <small>Ver carta →</small>
                        </span>
                        <span className="mx-w-platos">
                            {PLATOS.map((d) => (
                                <span key={d.n} className="mx-w-plato">
                                    <i style={{ backgroundImage: `url(${F}/${d.f}.webp)` }} />
                                    <b>{d.n}</b>
                                    <small>{d.p}</small>
                                </span>
                            ))}
                        </span>
                        <span className="mx-w-resena">
                            <b>★★★★★</b>
                            <span>4,8 · 320 reseñas en Google</span>
                        </span>
                        <span className="mx-w-pie">
                            <i />
                            Abierto hoy · 12:00 – 23:00
                        </span>
                    </div>
                </div>
            </div>

            <div className={`afq-term${t >= 120 ? ' is-on' : ''}`}>
                <span>$</span>
                {CMD.slice(0, tc)}
                {tc < CMD.length && <i className="afq-caret" />}
                {t >= 1500 && <b>✓ listo</b>}
            </div>

            <div className={`afq-speed${veloz ? ' is-on' : ''}`}>
                <svg viewBox="0 0 24 24">
                    <circle className="afq-speed-0" cx="12" cy="12" r="9.5" />
                    <circle className="afq-speed-1" cx="12" cy="12" r="9.5" pathLength={1} />
                </svg>
                <span>
                    <b>&lt; 2 s</b>
                    <small>carga</small>
                </span>
            </div>

            <Cursor p={p} vis={!!apunta} clicks={clicks} />
        </div>
    );
}

/* ============================================================= PANEL
   El panel de reservas de un hotel, en corto: suben las cifras, entra una
   reserva (aviso arriba y fila nueva en "Llegadas") y enseguida,
   a los 3,6 s, se abre el abanico de rubros: el mismo sistema para
   cualquier negocio con agenda. En el escritorio los rubros salen a los
   8 s; aqui Harley los pidio "rapidamente despues de mostrar el panel". */

const PANEL_CICLO = 8800;
const LLEGADAS = [
    { h: '15:00', n: 'Lucía M.', d: 'Hab. 112' },
    { h: '16:30', n: 'Diego R.', d: 'Hab. 305' },
    { h: '18:00', n: 'Paola V.', d: 'Hab. 118' },
];

export function UiPanelMovil({ run }: { run: boolean }) {
    const t = useReloj(run, PANEL_CICLO, 2900);
    const nueva = t >= 1500;
    const reservas = t < 300 ? 0 : nueva ? 25 : 24;
    const occ = 40 + 46 * easeOut(tramo(t, 300, 1500)) + (nueva ? 2 : 0);
    const reset = t > PANEL_CICLO - 450;
    const rubros = t >= 3600 && t < 8000;
    const marcado = rubros ? Math.floor((t - 4300) / 300) : -1;

    return (
        <div className={`afq-ui afq-pan mx-pan${reset ? ' is-reset' : ''}${rubros ? ' is-rubros' : ''}`}>
            <div className="afq-pan-top">
                <div className="afq-row">
                    <span className="afq-lbl">Panel · reservas</span>
                    <span className="afq-vivo">
                        <i />
                        En vivo
                    </span>
                </div>
                <div className="afq-pan-num">
                    <Odo value={reservas} digits={2} />
                    <small>
                        reservas
                        <br />
                        hoy
                    </small>
                </div>
                <svg className="afq-chispa" viewBox="0 0 150 44" preserveAspectRatio="none">
                    <path d={CHISPA} pathLength={1} />
                </svg>
                <i className="afq-chispa-p" />
            </div>

            <div className="mx-pan-fila">
                <Gauge v={occ} max={100} label="Ocupación" text={`${Math.round(occ)}%`} />
                <div className="afq-card mx-pan-lista">
                    <span className="afq-lbl">Llegadas</span>
                    <ul>
                        <li className={`mx-pan-nueva${nueva ? ' is-on' : ''}`}>
                            <b>Ahora</b>
                            <span>
                                Ana P.
                                <small>Hab. 204</small>
                            </span>
                            <em>Nueva</em>
                        </li>
                        {LLEGADAS.map((l) => (
                            <li key={l.n}>
                                <b>{l.h}</b>
                                <span>
                                    {l.n}
                                    <small>{l.d}</small>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="afq-rub" aria-hidden={!rubros}>
                <div className="afq-rub-h">
                    <span className="afq-lbl">Reservas para</span>
                    <b>Cualquier negocio con agenda</b>
                </div>
                <div className="afq-rub-g">
                    {RUBROS.map(([n, Icono], i) => (
                        <span
                            key={n}
                            className={`afq-rub-c${marcado >= 0 && marcado % RUBROS.length === i ? ' is-me' : ''}`}
                            style={
                                {
                                    '--i': i,
                                    '--fx': `${(1 - (i % 3)) * 105}%`,
                                    '--fy': `${(1 - Math.floor(i / 3)) * 110}%`,
                                    '--r': `${GIROS[i]}deg`,
                                } as CSSProperties
                            }
                        >
                            <i>
                                <Icono strokeWidth={1.6} />
                            </i>
                            {n}
                        </span>
                    ))}
                </div>
            </div>

            <Toast on={t >= 1500 && t < 3300} style={{ right: 12, top: 12 }}>
                Nueva reserva · Hab. 204
            </Toast>
        </div>
    );
}
