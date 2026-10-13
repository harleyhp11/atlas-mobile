"use client";

/* ESCENAS DEL ACORDEON DE PREGUNTAS — la mini-interfaz animada que ocupa la
   mitad izquierda de cada panel abierto.

   Cada escena es una pelicula corta en bucle que se dibuja entera a partir
   de un solo tiempo t (useReloj): que fila esta marcada, cuanto lleva el
   cronograma, que mensaje ya llego... todo se deriva de t. Con el panel
   cerrado, la seccion fuera de pantalla o movimiento reducido, t se queda en
   el instante `quieto`, que es el fotograma donde la escena se lee completa.

   Las cifras que aparecen aqui dentro son de MAQUETA (como el "4.8% CTR" de
   la referencia): pedidos de un restaurante inventado, reservas de un hotel
   inventado. Lo que si es de Atlas —rangos de precio, plazos, 30 dias de
   soporte, carga en menos de 2 s— sale tal cual de los planes y del resto
   del sitio, para que el FAQ no contradiga a nadie. */

import { useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
    BedDouble, Dumbbell, GraduationCap, Hospital, PawPrint, Scissors, Sparkles, Stethoscope, UtensilsCrossed,
    type LucideIcon,
} from "lucide-react";
import { clamp01, easeInOut, easeOut, tramo, useIso, useReloj } from "./hooks";

type Escena = { run: boolean };
type Punto = { x: number; y: number };

/* ================================================================ piezas */

const DIGITOS = "0123456789".split("");

/* Contador de rodillo: cada cifra es una tira 0-9 que se desliza. Al cambiar
   el valor, rueda solo la cifra que cambia, con un pequeño desfase entre
   columnas, como un cuentakilometros. */
function Odo({ value, digits }: { value: number; digits: number }) {
    const s = String(Math.max(0, Math.round(value))).padStart(digits, "0").slice(-digits);
    return (
        <span className="afq-odo">
            {s.split("").map((d, i) => (
                <span className="afq-odo-c" key={i}>
                    <span
                        className="afq-odo-s"
                        style={{ transform: `translateY(${-Number(d) * 10}%)`, transitionDelay: `${(digits - 1 - i) * 70}ms` }}
                    >
                        {DIGITOS.map((n) => (
                            <span key={n}>{n}</span>
                        ))}
                    </span>
                </span>
            ))}
        </span>
    );
}

/* Notificacion flotante: pildora blanca, icono de "grabando" y el punto rojo
   en la esquina, que hace el papel del punto rosa de la referencia. */
function Toast({ on, children, style }: { on: boolean; children: ReactNode; style?: CSSProperties }) {
    return (
        <p className={`afq-toast${on ? " is-on" : ""}`} style={style}>
            <i />
            {children}
        </p>
    );
}

/* Coordenadas de un elemento relativas al lienzo de la escena. Se mide al
   cambiar `clave`, no en cada fotograma. Sin objetivo devuelve la esquina
   inferior derecha, por fuera: de ahi entra el cursor la primera vez. */
function useApunte(
    cont: RefObject<HTMLElement | null>,
    objetivo: () => HTMLElement | null | undefined,
    clave: string,
    fx = 0.7,
    fy = 0.62
): Punto {
    const [p, set] = useState<Punto>({ x: 0, y: 0 });
    useIso(() => {
        const c = cont.current;
        if (!c) return;
        const a = c.getBoundingClientRect();
        const el = objetivo();
        if (!el) {
            if (clave === "") set((q) => (q.x || q.y ? q : { x: a.width * 0.92, y: a.height * 1.04 }));
            return;
        }
        const b = el.getBoundingClientRect();
        set({ x: b.left - a.left + b.width * fx, y: b.top - a.top + b.height * fy });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clave]);
    return p;
}

/* Cursor de maqueta. Se desliza hasta su objetivo y, en cada clic, se encoge
   un instante y suelta una onda. `clicks` es un contador: cambiarlo vuelve a
   montar la onda, y con eso se repite la animacion. */
function Cursor({ p, vis, clicks }: { p: Punto; vis: boolean; clicks: number }) {
    return (
        <span className={`afq-cur${vis ? "" : " is-off"}`} style={{ transform: `translate(${p.x - 4}px, ${p.y - 3}px)` }}>
            <svg key={clicks} className={clicks ? "is-click" : undefined} viewBox="0 0 24 24">
                <path d="M4 2.5 L4 19.5 L8.6 15.4 L11.5 21.8 L14.4 20.5 L11.6 14.2 L17.8 13.9 Z" />
            </svg>
            {clicks > 0 && <i key={`r${clicks}`} className="afq-ripple" />}
        </span>
    );
}

/* El simbolo de Atlas (rampa + cuadrado), trazado a mano a partir del logo
   para no cargar una imagen de 1024px en un avatar de 30. */
function SimboloAtlas() {
    return (
        <svg viewBox="0 0 464 328" aria-hidden="true">
            <path d="M0 328 L326 0 L326 194 L189 328 Z" />
            <rect x="328" y="194" width="136" height="134" />
        </svg>
    );
}

/* ====================================================== 01 · PRECIOS
   Cotizador. Un cursor recorre los cuatro planes; con cada clic el precio
   "desde" rueda a su cifra, el rango se desliza sobre la regla de 0 a 3k y,
   al llegar a Software, las cifras se van y entra "A medida". Los rangos son
   los de las tarjetas de planes de la home. */

const PLANES = [
    { n: "Tienda online", r: "400 – 1,200", v: 400, a: 400, b: 1200 },
    { n: "Landing page", r: "600 – 1,500", v: 600, a: 600, b: 1500 },
    { n: "Web corporativa", r: "900 – 2,500", v: 900, a: 900, b: 2500 },
    { n: "Software", r: "a medida", v: 900, a: 2500, b: 3000 },
];
const INCLUYE = ["Diseño", "Desarrollo", "Soporte 30 días"];
// cursor → fila 0, clic, → fila 1, clic, → 2, clic, → 3, clic, aviso, salida
const COT_MARCAS = [350, 950, 2250, 2850, 4150, 4750, 6050, 6650, 7200, 9800];

export function UiCotizador({ run }: Escena) {
    const t = useReloj(run, 10600, 1500);
    const k = COT_MARCAS.filter((m) => t >= m).length;
    const sel = k >= 2 ? Math.min(3, (k - 2) >> 1) : -1;
    const apunta = run && k >= 1 && k <= 9 ? Math.min(3, (k - 1) >> 1) : -1;
    const clicks = k >= 2 ? Math.min(4, k >> 1) : 0;
    const plan = sel >= 0 ? PLANES[sel] : null;
    const medida = sel === 3;

    const cont = useRef<HTMLDivElement>(null);
    const filas = useRef<(HTMLDivElement | null)[]>([]);
    const p = useApunte(cont, () => (apunta >= 0 ? filas.current[apunta] : null), apunta >= 0 ? `f${apunta}` : "");

    return (
        <div ref={cont} className="afq-ui afq-cot">
            <div className="afq-card afq-cot-q">
                <div className="afq-row">
                    <span className="afq-lbl">Tu cotización</span>
                    {plan && (
                        <span key={sel} className="afq-chip afq-pop">
                            {plan.n}
                        </span>
                    )}
                </div>
                <div className={`afq-cot-big${medida ? " is-medida" : ""}${sel < 0 ? " is-dim" : ""}`}>
                    <span className="afq-cot-num">
                        <small>S/</small>
                        <Odo value={plan ? plan.v : 0} digits={3} />
                    </span>
                    <span className="afq-cot-med">A medida</span>
                </div>
                <div
                    className={`afq-cot-rng${sel < 0 ? " is-off" : ""}${medida ? " is-medida" : ""}`}
                    style={{ "--a": (plan?.a ?? 0) / 3000, "--b": (plan?.b ?? 0) / 3000 } as CSSProperties}
                >
                    <span />
                    <i />
                    <i />
                </div>
                <div className="afq-cot-esc">
                    <span>S/ 0</span>
                    <span>1k</span>
                    <span>2k</span>
                    <span>3k+</span>
                </div>
                <div className="afq-cot-inc">
                    {INCLUYE.map((x, i) => (
                        <span key={x} className={sel >= 0 ? "is-on" : undefined} style={{ transitionDelay: `${i * 90}ms` }}>
                            {x}
                        </span>
                    ))}
                </div>
            </div>

            <div className="afq-cot-plans">
                {PLANES.map((pl, i) => (
                    <div
                        key={pl.n}
                        ref={(el) => {
                            filas.current[i] = el;
                        }}
                        className={`afq-cot-plan${i === sel ? " is-me" : ""}`}
                    >
                        <i className="afq-radio" />
                        <em>{pl.n}</em>
                        <span>{pl.r}</span>
                    </div>
                ))}
            </div>

            <Cursor p={p} vis={apunta >= 0} clicks={clicks} />
            <Toast on={k === 9} style={{ right: 16, bottom: 14 }}>
                Monto final por escrito
            </Toast>
        </div>
    );
}

/* ====================================================== 02 · TIEMPOS
   Cronograma de una landing (7 – 10 dias segun el plan; aqui, el caso largo).
   Un cabezal rojo "Hoy" barre los diez dias, cada fase se rellena mientras el
   cabezal la cruza y se marca al terminar, y abajo el calendario de dos
   semanas habiles se va tachando. El dia 10 lleva la bandera: al llegar, se
   enciende en rojo y la web sale. */

const FASES: [string, number, number][] = [
    ["Brief", 0, 1],
    ["Diseño", 1, 4],
    ["Desarrollo", 4, 8],
    ["Pruebas", 8, 9],
    ["Lanzamiento", 9, 10],
];
const SEMANA_HABIL = ["L", "M", "M", "J", "V"];
const CRO = { ciclo: 10200, ini: 700, dura: 5600 };

const Bandera = () => (
    <svg viewBox="0 0 12 12" aria-hidden="true">
        <path d="M3 11 V1.5" />
        <path d="M3 2 H9.5 L8 4.2 L9.5 6.4 H3" />
    </svg>
);

export function UiCronograma({ run }: Escena) {
    const t = useReloj(run, CRO.ciclo, 7000);
    const d = 10 * easeInOut(tramo(t, CRO.ini, CRO.dura));
    const dia = Math.max(1, Math.ceil(d - 1e-6));
    const fin = d >= 10;
    const reset = t > CRO.ciclo - 450;

    return (
        <div className={`afq-ui afq-cro${reset ? " is-reset" : ""}`}>
            <div className="afq-card afq-cro-h">
                <div className="afq-row">
                    <span className="afq-lbl">
                        Landing page<span className="afq-sm-hide"> · cronograma</span>
                    </span>
                    <span key={fin ? "on" : "off"} className={`afq-cro-st afq-pop${fin ? " is-live" : ""}`}>
                        <i />
                        {fin ? "En línea" : "En curso"}
                    </span>
                </div>
                <div className="afq-cro-big">
                    <span>Día</span>
                    <Odo value={dia} digits={2} />
                    <small>de 10</small>
                </div>
                <div className="afq-cro-bar">
                    <i style={{ transform: `scaleX(${d / 10})` }} />
                </div>
            </div>

            <div className="afq-card afq-cro-g" style={{ "--d": d / 10 } as CSSProperties}>
                <div className="afq-cro-reg">
                    {Array.from({ length: 10 }, (_, i) => (
                        <span key={i} className={i < dia ? "is-on" : undefined}>
                            {i + 1}
                        </span>
                    ))}
                </div>
                {FASES.map(([n, a, b]) => {
                    const f = clamp01((d - a) / (b - a));
                    return (
                        <div className="afq-cro-fila" key={n}>
                            <span className={`afq-cro-n${f >= 1 ? " is-ok" : ""}`}>
                                <b>✓</b>
                                {n}
                            </span>
                            <span className="afq-cro-pista">
                                <span style={{ left: `${a * 10}%`, width: `${(b - a) * 10}%` }}>
                                    <i style={{ transform: `scaleX(${f})` }} />
                                </span>
                            </span>
                        </div>
                    );
                })}
                <span className="afq-cro-hoy">
                    <b>Hoy</b>
                </span>
            </div>

            <div className="afq-card afq-cro-cal">
                <div className="afq-row">
                    <span className="afq-lbl">Calendario</span>
                    <span className="afq-lbl">10 días hábiles</span>
                </div>
                <div className="afq-cro-sem">
                    {SEMANA_HABIL.map((x, i) => (
                        <span key={i}>{x}</span>
                    ))}
                    {Array.from({ length: 10 }, (_, i) => {
                        const n = i + 1;
                        const est =
                            n === 10
                                ? ` is-meta${fin ? " is-fin" : dia === 10 ? " is-hoy" : ""}`
                                : n < dia || fin
                                  ? " is-ok"
                                  : n === dia
                                    ? " is-hoy"
                                    : "";
                        return (
                            <i key={n} className={est}>
                                {n === 10 ? <Bandera /> : String(n).padStart(2, "0")}
                            </i>
                        );
                    })}
                </div>
            </div>

            <Toast on={fin && !reset} style={{ left: 16, bottom: 14 }}>
                Web en línea · día 10
            </Toast>
        </div>
    );
}

/* ====================================================== 03 · PROCESO
   Las cinco etapas del proceso de Atlas (las mismas de la seccion Proceso).
   La tarjeta activa se adelanta, llena su barra y, al terminar, se cierra con
   un check que se dibuja y un "Aprobado": nada avanza sin el visto bueno del
   cliente. El punto rojo de la izquierda marca por donde va el proyecto. */

const ETAPAS: [string, string][] = [
    ["Descubrimiento", "Objetivos y público"],
    ["Estrategia", "Arquitectura y contenidos"],
    ["Diseño", "Prototipo en Figma"],
    ["Desarrollo", "Código y pruebas"],
    ["Lanzamiento", "Publicación y soporte"],
];
const ETA = { ciclo: 10000, ini: 450, paso: 1250 };

export function UiEtapas({ run }: Escena) {
    const t = useReloj(run, ETA.ciclo, 7400);
    const x = Math.max(0, (t - ETA.ini) / ETA.paso);
    const s = Math.min(5, Math.floor(x));
    const p = s < 5 ? x - s : 1;
    const avance = s < 5 ? (s + p) / 5 : 1;
    const reset = t > ETA.ciclo - 450;

    return (
        <div className={`afq-ui afq-eta${reset ? " is-reset" : ""}`}>
            <div className="afq-row">
                <span className="afq-lbl">Tu proyecto · etapas</span>
                <span className="afq-eta-n">
                    <Odo value={Math.min(5, s + 1)} digits={1} />
                    <small>/5</small>
                </span>
            </div>

            <div className="afq-eta-list" style={{ "--av": avance } as CSSProperties}>
                <span className="afq-eta-rail">
                    <i />
                    <b />
                </span>
                {ETAPAS.map(([n, sub], i) => {
                    const est = i < s ? " is-done" : i === s ? " is-me" : "";
                    return (
                        <div className={`afq-eta-c${est}`} key={n}>
                            <span className="afq-eta-dot">
                                {i < s ? (
                                    <svg viewBox="0 0 12 12">
                                        <path d="M2.4 6.3 L5 8.8 L9.7 3.5" pathLength={1} />
                                    </svg>
                                ) : (
                                    <em>{i + 1}</em>
                                )}
                            </span>
                            <span className="afq-eta-tx">
                                <b>{n}</b>
                                <small>{sub}</small>
                                {i === s && (
                                    <span className="afq-eta-pr">
                                        <i style={{ transform: `scaleX(${p})` }} />
                                    </span>
                                )}
                            </span>
                            {i < s && <span className="afq-eta-ok">Aprobado</span>}
                            {i === s && (
                                <span className="afq-eta-tag">
                                    <i />
                                    En curso
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <Toast on={s >= 5 && !reset} style={{ right: 16, bottom: 12 }}>
                Aprobado por ti en cada paso
            </Toast>
        </div>
    );
}

/* ====================================================== 04 · TECNOLOGIA
   Un navegador de verdad, en pequeño: se escribe la direccion, carga, la
   pagina se pinta por bloques y baja. Luego el cursor pulsa el boton de
   movil y la ventana se estrecha: la rejilla de tarjetas se reacomoda sola,
   igual que al arrastrar el borde de un navegador. Abajo, el build; arriba,
   la carga en menos de 2 s, que es lo que promete el resto del sitio. */

const URL_WEB = "tunegocio.pe";
const CMD = "next build";
const WEB_CICLO = 11400;

export function UiNavegador({ run }: Escena) {
    const t = useReloj(run, WEB_CICLO, 2900);
    const escrito = Math.min(URL_WEB.length, Math.max(0, Math.floor((t - 300) / 70)));
    const carga = tramo(t, 1250, 700);
    const cargando = t >= 1250 && t < 2050;
    const pintado = t >= 1950;
    const veloz = t >= 2250;
    const abajo = t >= 3000 && t < 5200;
    const movil = t >= 7000 && t < 9200;
    const apunta = !run ? "" : t >= 6300 && t < 7500 ? "a" : t >= 8500 && t < 9700 ? "b" : "";
    const clicks = t >= 9200 ? 2 : t >= 7000 ? 1 : 0;
    const tc = Math.min(CMD.length, Math.max(0, Math.floor((t - 150) / 55)));
    const reset = t > WEB_CICLO - 450;

    const cont = useRef<HTMLDivElement>(null);
    const dev = useRef<HTMLSpanElement>(null);
    const p = useApunte(cont, () => (apunta ? dev.current : null), apunta, 0.5, 0.55);

    return (
        <div ref={cont} className={`afq-ui afq-web${reset ? " is-reset" : ""}`}>
            <div className={`afq-br${movil ? " is-movil" : ""}`}>
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
                    <span ref={dev} className={`afq-br-dev${movil ? " is-on" : ""}`}>
                        <svg viewBox="0 0 12 12">
                            <rect x="3.2" y="1" width="5.6" height="10" rx="1.4" />
                            <path d="M5.3 9.1 H6.7" />
                        </svg>
                    </span>
                    <span className="afq-br-load" style={{ transform: `scaleX(${carga})`, opacity: cargando ? 1 : 0 }} />
                </div>
                <div className="afq-br-vp">
                    <div className={`afq-pg${pintado ? " is-on" : ""}${abajo ? " is-abajo" : ""}`}>
                        <span className="afq-pg-nav">
                            <b />
                            <i />
                            <i />
                            <i />
                            <em />
                        </span>
                        <span className="afq-pg-hero">
                            <i />
                            <i />
                            <s />
                            <s />
                            <em>Reservar</em>
                        </span>
                        <span className="afq-pg-img" />
                        <span className="afq-pg-grid">
                            <i />
                            <i />
                            <i />
                        </span>
                        <span className="afq-pg-txt">
                            <i />
                            <s />
                            <s />
                        </span>
                        <span className="afq-pg-grid">
                            <i />
                            <i />
                            <i />
                        </span>
                        <span className="afq-pg-pie" />
                    </div>
                </div>
            </div>

            <div className={`afq-term${t >= 120 ? " is-on" : ""}`}>
                <span>$</span>
                {CMD.slice(0, tc)}
                {tc < CMD.length && <i className="afq-caret" />}
                {t >= 1500 && <b>✓ listo</b>}
            </div>

            <div className={`afq-speed${veloz ? " is-on" : ""}`}>
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

/* ====================================================== 05 · SOPORTE
   El telefono del cliente. Escribe y envia; el doble check se pone rojo al
   leerse; Atlas aparece "escribiendo…", responde letra a letra y manda la
   carta ya corregida, con el precio viejo tachado. El cliente reacciona,
   suben los corazones (como en la tarjeta de redes de la referencia) y
   cierra con un gracias que tambien se escribe en la caja de texto. */

const MSG_CLI = "¿Pueden cambiar los precios de la carta?";
// Por puntos de codigo, no por unidades UTF-16: si no, el emoji se parte en
// dos mitades y durante un fotograma se ve un simbolo roto.
const MSG_ATLAS = Array.from("¡Claro! Ya quedó actualizado 🙌");
const MSG_FIN = Array.from("¡Perfecto, gracias! 🙏");
const CHAT_CICLO = 12400;

export function UiChat({ run }: Escena) {
    const t = useReloj(run, CHAT_CICLO, 9000);
    const tecleo = Math.min(MSG_CLI.length, Math.max(0, Math.floor((t - 300) / 28)));
    const enviado = t >= 1650;
    const leido = t >= 2500;
    const escribe = t >= 2800 && t < 3900;
    const resp = t >= 3900 ? Math.min(MSG_ATLAS.length, Math.floor((t - 3900) / 34) + 1) : 0;
    const tarjeta = t >= 5200;
    const cambio = t >= 5900;
    const amor = t >= 6700;
    const gracias = t >= 8100;
    const tecleo2 = Math.min(MSG_FIN.length, Math.max(0, Math.floor((t - 7300) / 32)));
    // Lo que hay escrito en la caja de texto: primero la pregunta, luego el
    // agradecimiento. Al enviarse cada uno, la caja vuelve a quedar vacia.
    const borrador = !enviado ? MSG_CLI.slice(0, tecleo) : !gracias ? MSG_FIN.slice(0, tecleo2).join("") : "";
    const reset = t > CHAT_CICLO - 450;
    const tecleando = escribe || (resp > 0 && resp < MSG_ATLAS.length);

    return (
        <div className={`afq-ui afq-chat${reset ? " is-reset" : ""}`}>
            <div className="afq-tel">
                <div className="afq-tel-sb">
                    <b>10:14</b>
                    <span>
                        <i />
                        <i />
                        <i />
                        <em />
                    </span>
                </div>
                <div className="afq-tel-h">
                    <svg viewBox="0 0 12 12" className="afq-tel-back">
                        <path d="M7.5 2 L3.5 6 L7.5 10" />
                    </svg>
                    <span className="afq-av">
                        <SimboloAtlas />
                    </span>
                    <span className="afq-tel-who">
                        <b>Atlas</b>
                        <small key={tecleando ? "e" : "l"} className={tecleando ? "is-typing" : undefined}>
                            {tecleando ? "escribiendo…" : "soporte · en línea"}
                        </small>
                    </span>
                </div>

                <div className="afq-tel-body">
                    <span className="afq-tel-dia">Hoy</span>
                    {enviado && (
                        <p className="afq-msg out">
                            {MSG_CLI}
                            <span className={`afq-ticks${leido ? " is-read" : ""}`}>
                                10:12
                                <svg viewBox="0 0 16 10">
                                    <path d="M1 5.4 L3.8 8.2 L9.6 1.8" />
                                    <path d="M6.2 7.4 L7 8.2 L12.8 1.8" />
                                </svg>
                            </span>
                        </p>
                    )}
                    {escribe && (
                        <p className="afq-msg in afq-dots">
                            <i />
                            <i />
                            <i />
                        </p>
                    )}
                    {resp > 0 && (
                        <p className="afq-msg in">
                            {MSG_ATLAS.slice(0, resp).join("")}
                            {resp < MSG_ATLAS.length && <i className="afq-caret" />}
                        </p>
                    )}
                    {tarjeta && (
                        <div className="afq-msg in afq-carta">
                            <div className="afq-carta-h">
                                <span className="afq-carta-img" />
                                <span>
                                    <b>Carta digital</b>
                                    <small>tunegocio.pe/carta</small>
                                </span>
                            </div>
                            <div className="afq-carta-r">
                                <span>Ceviche clásico</span>
                                <span className={`afq-precio${cambio ? " is-cambio" : ""}`}>
                                    <s>S/ 35</s>
                                    {cambio && <b>S/ 38</b>}
                                </span>
                            </div>
                            <div className="afq-carta-r">
                                <span>Lomo saltado</span>
                                <span className="afq-precio">
                                    <b>S/ 32</b>
                                </span>
                            </div>
                            {amor && <span className="afq-reac">❤️</span>}
                            {amor && (
                                <span className="afq-hearts">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <i key={i} style={{ "--i": i } as CSSProperties} />
                                    ))}
                                </span>
                            )}
                        </div>
                    )}
                    {gracias && (
                        <p className="afq-msg out">
                            {MSG_FIN.join("")}
                            <span className={`afq-ticks${t >= 8700 ? " is-read" : ""}`}>
                                10:15
                                <svg viewBox="0 0 16 10">
                                    <path d="M1 5.4 L3.8 8.2 L9.6 1.8" />
                                    <path d="M6.2 7.4 L7 8.2 L12.8 1.8" />
                                </svg>
                            </span>
                        </p>
                    )}
                </div>

                <div className="afq-tel-in">
                    <span>
                        {borrador || <em>Mensaje</em>}
                        {run && borrador && <i className="afq-caret" />}
                    </span>
                    <b key={gracias ? "g" : enviado ? "e" : "n"} className={enviado ? "is-sent" : undefined}>
                        <svg viewBox="0 0 12 12">
                            <path d="M2 6 H10 M6.5 2.5 L10 6 L6.5 9.5" />
                        </svg>
                    </b>
                </div>
            </div>

            <Toast on={amor && !reset} style={{ left: 12, top: 12 }}>
                Soporte incluido · 30 días
            </Toast>
        </div>
    );
}

/* ====================================================== 06 · A MEDIDA
   Panel de un sistema de reservas. Arriba el contador del dia con su linea
   de tendencia, dos indicadores en arco y la semana en barras; la de hoy es
   la negra. Cada tanto entra una reserva nueva: el contador rueda, la barra
   de hoy crece y su etiqueta se actualiza. Al final el panel se apaga y de
   su centro salen en abanico nueve tarjetas de rubros con agenda
   (consultorios, barberias, clinicas...): el mismo sistema sirve a todos.
   Hotel y cifras, de maqueta. */

const SEMANA = [12, 15, 14, 18, 20, 22];
const DIAS = ["L", "M", "M", "J", "V", "S", "Hoy"];
const CHISPA = "M0 38 L21 33 L42 35 L63 25 L84 28 L105 17 L126 19 L150 6";
const PANEL_CICLO = 13400;

/* Rubros que viven de una agenda: el mismo sistema les sirve a todos. Salen
   en abanico desde el centro del panel cuando termina la ultima reserva. */
const RUBROS: [string, LucideIcon][] = [
    ["Consultorios", Stethoscope],
    ["Clínicas", Hospital],
    ["Barberías", Scissors],
    ["Spas", Sparkles],
    ["Restaurantes", UtensilsCrossed],
    ["Hoteles", BedDouble],
    ["Gimnasios", Dumbbell],
    ["Veterinarias", PawPrint],
    ["Academias", GraduationCap],
];
// Giro con el que sale cada tarjeta del mazo, para que no salgan en fila.
const GIROS = [-14, 8, -6, 12, -10, 5, -8, 14, -4];

function Gauge({ v, max, label, text }: { v: number; max: number; label: string; text: string }) {
    const p = clamp01(v / max);
    const ang = Math.PI * (1 - p);
    const x = 60 + 50 * Math.cos(ang);
    const y = 62 - 50 * Math.sin(ang);
    return (
        <span className="afq-g">
            <svg viewBox="0 0 120 70">
                <path d="M10 62a50 50 0 0 1 100 0" className="afq-g0" pathLength={1} />
                <path d="M10 62a50 50 0 0 1 100 0" className="afq-g1" pathLength={1} style={{ strokeDashoffset: 1 - p }} />
                <circle cx={x} cy={y} r="5" className="afq-g2" />
            </svg>
            <b>{text}</b>
            <small>{label}</small>
        </span>
    );
}

export function UiPanel({ run }: Escena) {
    const t = useReloj(run, PANEL_CICLO, 2900);
    const reservas = t < 400 ? 0 : t < 3400 ? 24 : t < 6000 ? 25 : 26;
    const occ = 40 + 46 * easeOut(tramo(t, 300, 1900));
    const chk = 18 * easeOut(tramo(t, 450, 2100));
    const reset = t > PANEL_CICLO - 450;
    // 8.1 s: se despliegan los rubros; 11.9 s: se recogen. Mientras estan
    // fuera, una marca recorre las tarjetas una por una.
    const rubros = t >= 8100 && t < 11900;
    const marcado = rubros ? Math.floor((t - 8900) / 320) : -1;

    return (
        <div className={`afq-ui afq-pan${reset ? " is-reset" : ""}${rubros ? " is-rubros" : ""}`}>
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

            <div className="afq-gs">
                <Gauge v={occ} max={100} label="Ocupación" text={`${Math.round(occ)}%`} />
                <Gauge v={chk} max={24} label="Check-ins" text={`${Math.round(chk)}`} />
            </div>

            <div className="afq-card afq-pan-bars">
                <div className="afq-row">
                    <span className="afq-lbl">Reservas · semana</span>
                </div>
                <div className="afq-bars">
                    {[...SEMANA, reservas].map((v, i) => (
                        <span key={i} className={i === 6 ? "is-hoy" : undefined}>
                            <span>
                                <i style={{ height: `${(v / 28) * 100}%`, animationDelay: `${0.3 + i * 0.09}s` }}>
                                    {i === 6 && reservas > 0 && (
                                        <b key={reservas} className="afq-pop">
                                            {reservas}
                                        </b>
                                    )}
                                </i>
                            </span>
                            <small>{DIAS[i]}</small>
                        </span>
                    ))}
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
                            className={`afq-rub-c${marcado >= 0 && marcado % RUBROS.length === i ? " is-me" : ""}`}
                            style={{
                                "--i": i,
                                "--fx": `${(1 - (i % 3)) * 105}%`,
                                "--fy": `${(1 - Math.floor(i / 3)) * 110}%`,
                                "--r": `${GIROS[i]}deg`,
                            } as CSSProperties}
                        >
                            <i>
                                <Icono strokeWidth={1.6} />
                            </i>
                            {n}
                        </span>
                    ))}
                </div>
            </div>

            <Toast on={t >= 3200 && t < 5300} style={{ right: 14, top: 14 }}>
                Nueva reserva · Hab. 204
            </Toast>
            <Toast on={t >= 5800 && t < 7900} style={{ right: 14, top: 14 }}>
                Nueva reserva · Hab. 310
            </Toast>
        </div>
    );
}
