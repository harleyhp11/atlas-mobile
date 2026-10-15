'use client';

import { UiNavegador, UiPanel } from '@/components/sections/faq/escenas';
import type { EscenaServicio } from '../datos';
import { Check, Estrella, WhatsApp } from '../iconos';
import '@/components/sections/faq/AtlasFAQ.css';
import './escenas.css';

/* Mini-interfaces de los servicios: cada una es una pelicula corta en bucle,
   hecha en codigo. Navegador y Panel son las escenas del FAQ del escritorio
   (rAF propio, se paran con `run`); Catalogo, Apps y Flujo son nuevas, solo
   CSS, y se pausan con .is-off. Las cifras de dentro son de MAQUETA, como en
   el FAQ: un restaurante inventado, una app inventada. */

type Props = { tipo: EscenaServicio; run: boolean; tema?: 'claro' | 'oscuro' };

/* Las escenas del FAQ leen sus colores de las variables de .afq / .afq-p. */
function DelFaq({ children, tema }: { children: React.ReactNode; tema: 'claro' | 'oscuro' }) {
    return (
        <div className="afq m-afq">
            <div className={`afq-p m-afq-p ${tema === 'oscuro' ? 't-graphite is-dk' : 't-cloud'}`}>
                <div className="afq-stage m-afq-stage">{children}</div>
            </div>
        </div>
    );
}

export function Escena({ tipo, run, tema = 'oscuro' }: Props) {
    switch (tipo) {
        case 'navegador':
            return (
                <DelFaq tema={tema}>
                    <UiNavegador run={run} />
                </DelFaq>
            );
        case 'panel':
            return (
                <DelFaq tema={tema}>
                    <UiPanel run={run} />
                </DelFaq>
            );
        case 'catalogo':
            return <UiCatalogo run={run} tema={tema} />;
        case 'apps':
            return <UiApps run={run} tema={tema} />;
        case 'flujo':
            return <UiFlujo run={run} tema={tema} />;
    }
}

type Ui = { run: boolean; tema: 'claro' | 'oscuro' };

/* ============================================================ CATALOGO
   Carta digital en el telefono: se agregan dos platos, sube la barra del
   pedido, se toca "Pedir por WhatsApp" y al lado llega el mensaje con el
   pedido ya armado. Abajo, el QR de la mesa. */

const PLATOS = [
    { n: 'Ceviche clásico', p: 'S/ 32' },
    { n: 'Lomo saltado', p: 'S/ 38' },
    { n: 'Chicha morada', p: 'S/ 8' },
];

function UiCatalogo({ run, tema }: Ui) {
    return (
        <div className={`mx-ui mx-cat${run ? '' : ' is-off'}`} data-tema={tema}>
            <div className="mx-tel mx-cat-tel">
                <div className="mx-tel-isla" />
                <div className="mx-cat-top">
                    <span>Carta</span>
                    <em>Mesa 4</em>
                </div>
                <ul className="mx-cat-lista">
                    {PLATOS.map((p, i) => (
                        <li key={p.n} className={`mx-cat-item mx-cat-item--${i}`}>
                            <i className="mx-cat-foto" />
                            <span>
                                <b>{p.n}</b>
                                <small>{p.p}</small>
                            </span>
                            <span className="mx-cat-mas">
                                <span>+</span>
                                <span>1</span>
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="mx-cat-barra">
                    <span>2 · S/ 70</span>
                    <b>
                        <WhatsApp />
                        Pedir
                    </b>
                </div>
                <i className="mx-dedo" />
            </div>

            <div className="mx-cat-msg">
                <span className="mx-cat-msg-de">
                    <WhatsApp /> Pedido nuevo
                </span>
                <p>
                    Hola 👋 Quiero pedir:
                    <br />1 Ceviche clásico
                    <br />1 Lomo saltado
                </p>
                <span className="mx-cat-msg-pie">
                    Total S/ 70
                    <i>
                        <Check />
                        <Check />
                    </i>
                </span>
            </div>

            <div className="mx-cat-qr">
                <span className="mx-qr" aria-hidden="true">
                    {Array.from({ length: 25 }, (_, k) => (
                        <i key={k} style={{ opacity: [0, 2, 4, 6, 7, 9, 12, 13, 15, 17, 18, 20, 22, 24, 10, 3].includes(k) ? 1 : 0.18 }} />
                    ))}
                </span>
                <span>
                    QR
                    <br />
                    Mesa 4
                </span>
            </div>
        </div>
    );
}

/* ================================================================ APPS
   Triptico de telefonos: bienvenida, inicio con el pedido en camino y el
   detalle de un producto. Las pantallas viven solas: la pestaña activa se
   mueve, el anillo se llena, llega una notificacion. */

function UiApps({ run, tema }: Ui) {
    return (
        <div className={`mx-ui mx-apps${run ? '' : ' is-off'}`} data-tema={tema}>
            <div className="mx-tel mx-apps-tel mx-apps-tel--izq">
                <div className="mx-tel-isla" />
                <div className="mx-apps-bien">
                    <i className="mx-apps-orbe" />
                    <b>Bienvenida</b>
                    <small>Tu cuenta en un minuto</small>
                    <span className="mx-apps-pager">
                        <i />
                        <i />
                        <i />
                    </span>
                    <em>Empezar</em>
                </div>
            </div>

            <div className="mx-tel mx-apps-tel mx-apps-tel--der">
                <div className="mx-tel-isla" />
                <div className="mx-apps-det">
                    <i className="mx-apps-img" />
                    <b>Zapatillas Andes</b>
                    <span className="mx-apps-estrellas">
                        <Estrella />
                        <Estrella />
                        <Estrella />
                        <Estrella />
                        <Estrella />
                    </span>
                    <em className="mx-apps-agregar">
                        <span>Agregar</span>
                        <span>
                            <Check /> Listo
                        </span>
                    </em>
                </div>
            </div>

            <div className="mx-tel mx-apps-tel mx-apps-tel--centro">
                <div className="mx-tel-isla" />
                <div className="mx-apps-noti">
                    <i />
                    <span>
                        <b>Tu pedido llegó</b>
                        <small>Hace un momento</small>
                    </span>
                </div>
                <div className="mx-apps-inicio">
                    <small>Hola, Ana</small>
                    <b>Tu pedido</b>
                    <div className="mx-apps-anillo">
                        <svg viewBox="0 0 40 40">
                            <circle cx="20" cy="20" r="16" />
                            <circle cx="20" cy="20" r="16" pathLength={1} />
                        </svg>
                        <span>
                            <b>12 min</b>
                            <small>en camino</small>
                        </span>
                    </div>
                    <span className="mx-apps-fila" />
                    <span className="mx-apps-fila mx-apps-fila--corta" />
                </div>
                <div className="mx-apps-tabs">
                    <i />
                    <i />
                    <i />
                    <i />
                    <span className="mx-apps-tab-luz" />
                </div>
            </div>

            <span className="mx-apps-chip mx-apps-chip--a">iOS</span>
            <span className="mx-apps-chip mx-apps-chip--b">Android</span>
        </div>
    );
}

/* =============================================================== FLUJO
   Agente de IA: entra un mensaje por WhatsApp, el agente consulta la
   agenda, crea la reserva, avisa al equipo y responde solo. Las lineas se
   encienden por tramos y un punto rojo recorre el camino. */

const TRAMOS = [
    'M150 74 V104',
    'M150 158 V170 Q150 178 142 178 H84 Q76 178 76 186 V198',
    'M150 158 V170 Q150 178 158 178 H216 Q224 178 224 186 V198',
];

function UiFlujo({ run, tema }: Ui) {
    return (
        <div className={`mx-ui mx-flujo${run ? '' : ' is-off'}`} data-tema={tema}>
            <svg className="mx-flujo-lineas" viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true">
                {TRAMOS.map((d, i) => (
                    <path key={`b${i}`} className="mx-flujo-base" d={d} />
                ))}
                {TRAMOS.map((d, i) => (
                    <path key={`l${i}`} className={`mx-flujo-l mx-flujo-l--${i + 1}`} d={d} pathLength={1} />
                ))}
            </svg>

            <div className="mx-flujo-in">
                <span className="mx-flujo-tag">
                    <WhatsApp /> Cliente
                </span>
                <p>¿Tienen mesa para 4 hoy a las 8?</p>
            </div>

            <div className="mx-flujo-agente">
                <span className="mx-flujo-chispa">
                    <Estrella />
                </span>
                <span className="mx-flujo-estado">
                    <b>Agente IA</b>
                    <span className="mx-flujo-rotulos">
                        <small>Leyendo la agenda…</small>
                        <small>Mesa libre a las 8 ✓</small>
                    </span>
                </span>
            </div>

            <div className="mx-flujo-salidas">
                <span className="mx-flujo-nodo mx-flujo-nodo--a">
                    <Check /> Reserva creada
                </span>
                <span className="mx-flujo-nodo mx-flujo-nodo--b">
                    <Check /> Equipo avisado
                </span>
            </div>

            <div className="mx-flujo-resp">
                <span>¡Listo! Mesa para 4 a las 8 pm. Te esperamos.</span>
            </div>
        </div>
    );
}
