import type { CSSProperties, ReactNode } from 'react';
import { WhatsApp } from '../iconos';
import './escenas-base.css';
import './perdidas.css';

/* Mini-interfaces de "Lo que pierdes hoy": tres escenas, solo CSS, que se
   pausan fuera de pantalla (data-loop + .is-off).

   Las tres cuentan lo mismo en dos tiempos, con un interruptor arriba que
   pasa de "Sin …" a "Con …" a mitad del ciclo (pedido de Harley: que al
   primer vistazo se entienda que hace falta una web, un chatbot y un
   sistema):
     · Clientes — sin web, tu ficha sale ultima y gris y el cliente toca a la
       competencia; con web, gana foto y estrellas, sube al primer lugar y se
       abre tu pagina.
     · Plata — domingo 23:47: sin chatbot nadie contesta y la venta se va;
       con chatbot el asistente responde al toque y la venta se cierra.
     · Tiempo — sin sistema, el cuaderno con tachones y el pedido atrasado;
       con sistema, el tablero mueve el pedido de "Nuevo" a "Listo" solo.

   Todas las animaciones van con fill `both` y terminan en el estado "Con":
   con movimiento reducido (duracion ~0) la escena queda quieta en la
   solucion. Nombres, horas y montos son de MAQUETA; las fotos son CC0. */

const F = '/assets/movil/escenas';

function Interruptor({ sin, con }: { sin: string; con: string }) {
    return (
        <div className="px-sw">
            <i />
            <span>{sin}</span>
            <span>{con}</span>
        </div>
    );
}

function Estrellas() {
    return <b className="px-est">★</b>;
}

/* ---------------------------------------------------------- CLIENTES */
const RIVALES = [
    { n: 'Cevichería Brisa', d: '4,7 (318) · Abierto', f: 'nikkei' },
    { n: 'Mar de Fondo', d: '4,6 (205) · Abierto', f: 'local' },
];

function Fila({ clase, children }: { clase: string; children: ReactNode }) {
    return <li className={`px-fila ${clase}`}>{children}</li>;
}

export function UiBusqueda() {
    return (
        <div className="mx-ui px-esc px-web" data-loop aria-hidden="true">
            <Interruptor sin="Sin web" con="Con web" />

            <div className="px-q">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="7" cy="7" r="4.5" />
                    <path d="m10.5 10.5 3 3" />
                </svg>
                <span className="px-q-txt">cevichería en Barranco</span>
            </div>

            <ul className="px-res">
                {RIVALES.map((r, k) => (
                    <Fila key={r.n} clase={`px-fila--${k ? 'b' : 'a'}`}>
                        <i className="px-foto" style={{ backgroundImage: `url(${F}/${r.f}.webp)` }} />
                        <span className="px-fila-t">
                            <b>{r.n}</b>
                            <small>
                                <Estrellas /> {r.d}
                            </small>
                        </span>
                        <em className="px-chip">Sitio web</em>
                    </Fila>
                ))}
                <Fila clase="px-fila--tuya">
                    <span className="px-capa px-capa--sin">
                        <i className="px-foto px-foto--vacia" />
                        <span className="px-fila-t">
                            <b>Tu negocio</b>
                            <small>Sin fotos · Sin sitio web</small>
                        </span>
                    </span>
                    <span className="px-capa px-capa--con">
                        <i className="px-foto" style={{ backgroundImage: `url(${F}/ceviche.webp)` }} />
                        <span className="px-fila-t">
                            <b>Tu negocio</b>
                            <small>
                                <Estrellas /> 4,9 (412) · Abierto
                            </small>
                        </span>
                        <em className="px-chip px-chip--rojo">Sitio web</em>
                    </span>
                </Fila>
                <i className="px-dedo px-dedo--a" />
                <i className="px-dedo px-dedo--b" />
            </ul>

            <span className="px-aviso px-aviso--mal">
                <i />
                Le escribió a tu competencia
            </span>

            <div className="px-sitio">
                <span className="px-sitio-url">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
                        <rect x="2.5" y="5.2" width="7" height="5.3" rx="1.2" />
                        <path d="M4 5.2 V3.9 a2 2 0 0 1 4 0 V5.2" />
                    </svg>
                    tunegocio.pe
                </span>
                <span className="px-sitio-hero" style={{ backgroundImage: `url(${F}/ceviche.webp)` }}>
                    <b>Ceviches del día</b>
                    <em>Reservar mesa</em>
                </span>
                <span className="px-aviso px-aviso--bien">
                    <i />
                    Nueva reserva
                </span>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------- PLATA */
function Burbuja({ de, clase, hora, children }: { de: 'cli' | 'tu'; clase: string; hora: string; children: ReactNode }) {
    return (
        <li className={`px-b px-b--${de} ${clase}`}>
            <span className="px-b-in">
                {children}
                <small>
                    {hora}
                    {de === 'tu' && <i className="px-check">✓✓</i>}
                </small>
            </span>
        </li>
    );
}

export function UiNoche() {
    return (
        <div className="mx-ui px-esc px-chat" data-loop aria-hidden="true">
            <Interruptor sin="Sin chatbot" con="Con chatbot" />

            <div className="px-chat-cab">
                <span className="px-chat-ava">C</span>
                <span className="px-chat-quien">
                    <b>Carla</b>
                    <small>cliente nueva</small>
                </span>
                <span className="px-chat-hora">
                    <WhatsApp />
                    Dom · 23:47
                </span>
            </div>

            <div className="px-chat-msgs">
                <ul className="px-chat-lista px-chat-lista--sin">
                    <Burbuja de="cli" clase="px-s1" hora="23:47">
                        ¿Todavía atienden? Quiero 2 ceviches 🙏
                    </Burbuja>
                    <li className="px-nota px-s2">Sin respuesta · 8 min</li>
                    <Burbuja de="cli" clase="px-s3" hora="23:55">
                        ¿Hola? 👀
                    </Burbuja>
                    <Burbuja de="cli" clase="px-s4" hora="00:08">
                        Ya pedí en otro lado, gracias.
                    </Burbuja>
                </ul>
                <ul className="px-chat-lista px-chat-lista--con">
                    <Burbuja de="cli" clase="px-c1" hora="23:47">
                        ¿Todavía atienden? Quiero 2 ceviches 🙏
                    </Burbuja>
                    <li className="px-escribe px-c2">
                        <span>
                            <i />
                            <i />
                            <i />
                        </span>
                    </li>
                    <Burbuja de="tu" clase="px-c3" hora="23:47">
                        <em className="px-ia">Asistente IA</em>
                        ¡Hola! Sí, atendemos 24/7 🙌 Son S/ 64. ¿Delivery?
                    </Burbuja>
                    <Burbuja de="cli" clase="px-c4" hora="23:48">
                        Sí, delivery 🙌
                    </Burbuja>
                    <Burbuja de="tu" clase="px-c5" hora="23:48">
                        Listo ✓ Pedido #219 en camino
                    </Burbuja>
                    <li className="px-cierre px-c6">
                        <i />
                        Venta cerrada · S/ 64
                    </li>
                </ul>
            </div>

            <span className="px-sello px-sello--chat">
                Venta perdida
                <small>S/ 64 · se fue a otro lado</small>
            </span>
        </div>
    );
}

/* ------------------------------------------------------------- TIEMPO */
const ESCRITO = [
    { t: '046 · Mesa 2 · 2 ceviches ✓' },
    { t: '047 · Delivery · lomo', tacha: true, extra: '×2' },
    { t: '048 · María · ¿ceviche o lomo?' },
];

export function UiPedido() {
    return (
        <div className="mx-ui px-esc px-sis" data-loop aria-hidden="true">
            <Interruptor sin="Sin sistema" con="Con sistema" />

            <div className="px-sis-area">
                <div className="px-cuaderno">
                    {ESCRITO.map((e, k) => (
                        <span key={e.t} className={`px-linea px-linea--${k}`} style={{ '--k': k } as CSSProperties}>
                            <span className="px-tinta">{e.t}</span>
                            {e.tacha && <i className="px-tacha" />}
                            {e.extra && <b className="px-extra">{e.extra}</b>}
                        </span>
                    ))}
                    <span className="px-post">¿Y el 048?</span>
                    <span className="px-reloj">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <circle cx="8" cy="8" r="6" />
                            <path d="M8 4.8V8l2.2 1.4" />
                        </svg>
                        048 · 47 min
                    </span>
                    <span className="px-falta">Se acabó el pescado</span>
                    <span className="px-sello px-sello--sis">Retrasado</span>
                </div>

                <div className="px-tablero">
                    <div className="px-tab-cab">
                        <b>Pedidos · hoy</b>
                        <span>
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                <circle cx="8" cy="8" r="6" />
                                <path d="M8 4.8V8l2.2 1.4" />
                            </svg>
                            12 min
                        </span>
                    </div>
                    <div className="px-cols">
                        {['Nuevo', 'En cocina', 'Listo'].map((c) => (
                            <span key={c} className="px-col">
                                {c}
                            </span>
                        ))}
                        <span className="px-ord px-ord--047">
                            <b>047</b>
                            <small>Lomo ×2</small>
                        </span>
                        <span className="px-ord px-ord--046">
                            <b>046</b>
                            <small>2 ceviches</small>
                        </span>
                        <span className="px-ord px-ord--048">
                            <b>048</b>
                            <small>2 ceviches</small>
                        </span>
                        <span className="px-aviso px-aviso--bien px-aviso--sis">
                            <i />
                            048 listo en 12 min
                        </span>
                    </div>
                    <div className="px-tab-pie">
                        <span className="px-stock">
                            <small>Pescado</small>
                            <i />
                        </span>
                        <span className="px-caja">
                            <small>Caja</small>
                            <b>
                                <span>S/ 1,240</span>
                                <span>S/ 1,304</span>
                            </b>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const UI_PERDIDA = {
    clientes: UiBusqueda,
    plata: UiNoche,
    tiempo: UiPedido,
};
