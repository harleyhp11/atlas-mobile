'use client';

import { animate, AnimatePresence, motion, useMotionValue, type Transition } from 'motion/react';
import { Fragment, useEffect, useRef, useState, type RefObject } from 'react';
import { Estrella, WhatsApp } from '../../iconos';
import { foto, type Escenario } from './escenarios';

/* Las escenas de cada rubro: un "antes" y un "despues" propios, hechos en
   codigo (mini-UIs, como pide el brief) encima de la foto. Antes eran
   todas un chat y un aviso; Harley pidio que cada negocio tenga la suya:

     restaurante   · la carta en fotos sueltas  → carta digital con pedido
     turismo       · cerrado a las 3 a. m.      → calendario que se llena
     gimnasio      · lista de papel             → app con cupos
     inmobiliaria  · mensajes sin leer          → la IA responde y agenda
     distribuidora · un Excel con #¡REF!        → panel en vivo

   El antes vive en gris (papel, tinta, blanco); el despues, a color. Cada
   escena se monta al activarse el rubro y corre su propia coreografia
   desde `base` (segundos). Con movimiento reducido, todo aparece ya en su
   estado final. */

const EASE = [0.2, 0.85, 0.15, 1] as const;
const POP = [0.16, 1, 0.3, 1] as const;

type Props = { e: Escenario; base: number; reducido: boolean };

function paso(base: number, reducido: boolean) {
    return {
        ini: <T extends object>(v: T): T | false => (reducido ? false : v),
        tr: (t: number, extra: Transition = {}): Transition => (reducido ? { duration: 0 } : { delay: base + t, duration: 0.5, ease: POP, ...extra }),
    };
}

/* true desde el segundo `t` (o de una, sin movimiento). */
function useMomento(t: number, reducido: boolean) {
    const [ya, setYa] = useState(reducido);
    useEffect(() => {
        if (reducido) return;
        const id = window.setTimeout(() => setYa(true), t * 1000);
        return () => window.clearTimeout(id);
    }, [t, reducido]);
    return ya;
}

/* Una cifra que cuenta, escrita directo en el DOM. */
function useCuenta(ref: RefObject<HTMLElement | null>, de: number, a: number, t: number, dura: number, reducido: boolean, formato: (n: number) => string = (n) => String(Math.round(n))) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (reducido) {
            el.textContent = formato(a);
            return;
        }
        el.textContent = formato(de);
        const c = animate(de, a, {
            delay: t,
            duration: dura,
            ease: EASE,
            onUpdate: (v) => {
                el.textContent = formato(v);
            },
        });
        return () => c.stop();
        // una sola vez por montaje: la escena se vuelve a montar en cada rubro
    }, []);
}

export function EscenaAntes(p: Props) {
    switch (p.e.id) {
        case 'restaurante':
            return <AntesRestaurante {...p} />;
        case 'turismo':
            return <AntesTurismo {...p} />;
        case 'gimnasio':
            return <AntesGimnasio {...p} />;
        case 'inmobiliaria':
            return <AntesInmobiliaria {...p} />;
        default:
            return <AntesDistribuidora {...p} />;
    }
}

export function EscenaDespues(p: Props) {
    switch (p.e.id) {
        case 'restaurante':
            return <DespuesRestaurante {...p} />;
        case 'turismo':
            return <DespuesTurismo {...p} />;
        case 'gimnasio':
            return <DespuesGimnasio {...p} />;
        case 'inmobiliaria':
            return <DespuesInmobiliaria {...p} />;
        default:
            return <DespuesDistribuidora {...p} />;
    }
}

/* =================================================================== ANTES */

/* La carta, en fotos sueltas que caen una sobre otra. */
const POLAROIDS = [
    { x: 0, y: 8, r: -9, pos: '16% 90%' },
    { x: 46, y: 0, r: 5, pos: '60% 84%' },
    { x: 92, y: 10, r: -4, pos: '44% 56%' },
    { x: 138, y: 2, r: 8, pos: '80% 66%' },
];

function AntesRestaurante({ e, base, reducido }: Props) {
    const { ini, tr } = paso(base, reducido);
    return (
        <div className="h-esc-fotos">
            {POLAROIDS.map((f, i) => (
                <motion.figure
                    key={i}
                    className="h-esc-polaroid"
                    style={{ left: f.x, top: f.y }}
                    initial={ini({ opacity: 0, y: 30, rotate: f.r - 16 })}
                    animate={{ opacity: 1, y: 0, rotate: f.r }}
                    transition={tr(i * 0.16, { duration: 0.6 })}
                >
                    <span style={{ backgroundImage: `url(${foto(e)})`, backgroundPosition: f.pos }} />
                    <figcaption>IMG_{2041 + i}</figcaption>
                </motion.figure>
            ))}
            <motion.span className="h-esc-mas8" initial={ini({ opacity: 0, scale: 0.6 })} animate={{ opacity: 1, scale: 1 }} transition={tr(0.8)}>
                +8
            </motion.span>
        </div>
    );
}

/* 3:12 a. m. en Lima: la agencia cerrada, el mundo despierto. */
const RELOJES = [
    { c: 'Lima', h: '3:12', noche: true },
    { c: 'Madrid', h: '10:12', noche: false },
    { c: 'Tokio', h: '17:12', noche: false },
];

function AntesTurismo({ base, reducido }: Props) {
    const { ini, tr } = paso(base, reducido);
    return (
        <div className="h-esc-cerrado">
            <motion.div
                className="h-esc-letrero"
                style={{ transformOrigin: '50% -20px' }}
                initial={ini({ opacity: 0, y: -14, rotate: -10 })}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={tr(0, { duration: 1.2, ease: EASE })}
            >
                <svg className="h-esc-hilo" viewBox="0 0 80 22" aria-hidden="true">
                    <path d="M8 22 L40 3 L72 22" />
                    <circle cx="40" cy="3" r="2.6" />
                </svg>
                <b>Cerrado</b>
                <small>Abrimos 9:00 a. m.</small>
            </motion.div>
            <ul className="h-esc-relojes">
                {RELOJES.map((r, i) => (
                    <motion.li
                        key={r.c}
                        className={r.noche ? 'is-noche' : undefined}
                        initial={ini({ opacity: 0, y: 8 })}
                        animate={{ opacity: 1, y: 0 }}
                        transition={tr(0.6 + i * 0.14)}
                    >
                        {r.noche ? <Luna /> : <Sol />}
                        <span>{r.c}</span>
                        <b>{r.h}</b>
                    </motion.li>
                ))}
            </ul>
        </div>
    );
}

/* La lista en papel: nombres a mano, uno tachado y el post-it de siempre. */
const NOMBRES = ['Ana', 'Luis', 'Carla', 'Pedro', '¿Rosa?'];

function AntesGimnasio({ base, reducido }: Props) {
    const { ini, tr } = paso(base, reducido);
    return (
        <motion.div className="h-esc-papel" initial={ini({ opacity: 0, y: 18, rotate: -8 })} animate={{ opacity: 1, y: 0, rotate: -3 }} transition={tr(0, { duration: 0.6 })}>
            <span className="h-esc-papel-pinza" aria-hidden="true" />
            <p className="h-esc-papel-t">Spinning 7:00 · cupos 20</p>
            <ol>
                {NOMBRES.map((n, i) => (
                    <li key={n}>
                        <motion.span
                            className="h-esc-mano"
                            initial={ini({ clipPath: 'inset(0 100% 0 0)' })}
                            animate={{ clipPath: 'inset(0 0% 0 0)' }}
                            transition={tr(0.3 + i * 0.19, { duration: 0.42, ease: 'linear' })}
                        >
                            {n}
                        </motion.span>
                        {i === 2 && (
                            <motion.i className="h-esc-tachon" initial={ini({ scaleX: 0 })} animate={{ scaleX: 1 }} transition={tr(1.4, { duration: 0.3, ease: 'linear' })} />
                        )}
                    </li>
                ))}
            </ol>
            <motion.span
                className="h-esc-postit"
                initial={ini({ opacity: 0, scale: 0.7, rotate: 16 })}
                animate={{ opacity: 1, scale: 1, rotate: 7 }}
                transition={tr(1.15, { duration: 0.55 })}
            >
                ¿Quién pagó?
            </motion.span>
        </motion.div>
    );
}

/* Los mensajes se apilan y el contador no para. */
const MENSAJES = [
    { q: 'Lucía', t: '¿Precio del depa de Miraflores?', h: '9:41' },
    { q: 'Marco', t: '¿Tiene cochera?', h: '9:43' },
    { q: 'Rosa', t: '¿Puedo verlo hoy?', h: '9:44' },
];

function AntesInmobiliaria({ base, reducido }: Props) {
    const { ini, tr } = paso(base, reducido);
    const [n, setN] = useState(reducido ? MENSAJES.length : 0);
    const contador = useRef<HTMLSpanElement>(null);
    useCuenta(contador, 1, 27, base + 0.2, 1.4, reducido);
    useEffect(() => {
        if (reducido) return;
        const ids = MENSAJES.map((_, i) => window.setTimeout(() => setN(i + 1), (base + 0.15 + i * 0.4) * 1000));
        return () => ids.forEach((id) => window.clearTimeout(id));
    }, [base, reducido]);
    return (
        <div className="h-esc-notis">
            <motion.p className="h-esc-notis-cab" initial={ini({ opacity: 0 })} animate={{ opacity: 1 }} transition={tr(0.05)}>
                <WhatsApp />
                WhatsApp ·{' '}
                <b>
                    <span ref={contador}>27</span> sin leer
                </b>
            </motion.p>
            <ul>
                <AnimatePresence initial={false}>
                    {MENSAJES.slice(0, n)
                        .reverse()
                        .map((m) => (
                            <motion.li
                                key={m.q}
                                layout
                                initial={ini({ opacity: 0, y: -16, scale: 0.96 })}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: reducido ? 0 : 0.45, ease: POP, layout: { duration: reducido ? 0 : 0.4, ease: POP } }}
                            >
                                <span className="h-esc-noti-av" aria-hidden="true">
                                    {m.q[0]}
                                </span>
                                <span className="h-esc-noti-tx">
                                    <b>{m.q}</b>
                                    {m.t}
                                </span>
                                <time>{m.h}</time>
                            </motion.li>
                        ))}
                </AnimatePresence>
            </ul>
        </div>
    );
}

/* Un Excel: la seleccion busca el stock y cae en el #¡REF!. */
const HOJA = [
    ['Producto', 'Stock', 'Precio'],
    ['Arroz 5 kg', '120', '18.50'],
    ['Azúcar 1 kg', '#¡REF!', '4.20'],
    ['Aceite 1 L', '86', '9.90'],
    ['Fideos', '54', '3.10'],
];

function AntesDistribuidora({ base, reducido }: Props) {
    const { ini, tr } = paso(base, reducido);
    const error = useMomento(base + 1.85, reducido);
    return (
        <motion.div className="h-esc-excel" initial={ini({ opacity: 0, y: 14 })} animate={{ opacity: 1, y: 0 }} transition={tr(0)}>
            <p className="h-esc-excel-tab">
                <i aria-hidden="true" />
                stock_final_v3.xlsx
            </p>
            <div className="h-esc-excel-grid">
                <span className="h-esc-excel-h" />
                {['A', 'B', 'C'].map((c) => (
                    <span key={c} className="h-esc-excel-h">
                        {c}
                    </span>
                ))}
                {HOJA.map((fila, i) => (
                    <Fragment key={i}>
                        <span className="h-esc-excel-h">{i + 1}</span>
                        {fila.map((v, j) => (
                            <span key={j} className={`h-esc-excel-c${i === 0 ? ' is-cab' : ''}${v.startsWith('#') ? ' is-error' : ''}${v.startsWith('#') && error ? ' is-alerta' : ''}`}>
                                {v}
                            </span>
                        ))}
                    </Fragment>
                ))}
                {/* la seleccion: A2 → B2 → B4 → B3 (el error) */}
                <motion.span
                    className="h-esc-excel-sel"
                    initial={reducido ? false : { x: 16, y: 36, width: 72 }}
                    animate={reducido ? { x: 88, y: 54, width: 46 } : { x: [16, 88, 88, 88], y: [36, 36, 72, 54], width: [72, 46, 46, 46] }}
                    transition={reducido ? { duration: 0 } : { delay: base + 0.55, duration: 1.3, times: [0, 0.3, 0.65, 1], ease: 'easeInOut' }}
                />
            </div>
        </motion.div>
    );
}

/* ================================================================ DESPUES */

/* Carta digital: se arma el pedido y sale a WhatsApp. 2 × 30 + 8 = 68. */
const PLATOS = [
    { n: 'Ceviche clásico', p: 30, pos: '18% 90%', cant: 2 },
    { n: 'Lomo saltado', p: 34, pos: '62% 86%', cant: 0 },
    { n: 'Chicha morada', p: 8, pos: '46% 52%', cant: 1 },
];

function DespuesRestaurante({ e, base, reducido }: Props) {
    const { ini, tr } = paso(base, reducido);
    const sumado = useMomento(base + 1.15, reducido);
    const enviado = useMomento(base + 2.05, reducido);
    return (
        <motion.div className="h-esc-card h-esc-carta" initial={ini({ opacity: 0, y: -12, scale: 0.96 })} animate={{ opacity: 1, y: 0, scale: 1 }} transition={tr(0, { duration: 0.6 })}>
            <header>
                <b>Carta</b>
                <span>
                    <Qr />
                    Mesa 6
                </span>
            </header>
            <ul>
                {PLATOS.map((p, i) => {
                    const lleva = sumado && p.cant > 0;
                    return (
                        <motion.li key={p.n} initial={ini({ opacity: 0, x: 14 })} animate={{ opacity: 1, x: 0 }} transition={tr(0.2 + i * 0.12)}>
                            <span className="h-esc-plato-img" style={{ backgroundImage: `url(${foto(e)})`, backgroundPosition: p.pos }} />
                            <span className="h-esc-plato-n">{p.n}</span>
                            <b>S/ {p.p}</b>
                            <span className={`h-esc-suma${lleva ? ' is-on' : ''}`}>{lleva ? p.cant : '+'}</span>
                        </motion.li>
                    );
                })}
            </ul>
            <motion.footer className="h-esc-enviar" initial={ini({ opacity: 0, y: 10 })} animate={{ opacity: 1, y: 0 }} transition={tr(1.4)}>
                <AnimatePresence mode="wait" initial={false}>
                    {enviado ? (
                        <motion.span key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <Check />
                            Pedido en tu WhatsApp
                        </motion.span>
                    ) : (
                        <motion.span key="total" exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}>
                            3 platos · S/ 68 · Enviar
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.footer>
        </motion.div>
    );
}

/* El calendario se llena solo, en español o en ingles. */
const RESERVAS = [2, 4, 5, 8, 11, 12, 15, 18, 19, 22, 25, 26];
const SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function DespuesTurismo({ base, reducido }: Props) {
    const { ini, tr } = paso(base, reducido);
    const ingles = useMomento(base + 1.0, reducido);
    return (
        <motion.div className="h-esc-card h-esc-cal" initial={ini({ opacity: 0, y: -12, scale: 0.96 })} animate={{ opacity: 1, y: 0, scale: 1 }} transition={tr(0, { duration: 0.6 })}>
            <header>
                <b>Reservas · octubre</b>
                <span className="h-esc-idioma" data-en={ingles ? '' : undefined}>
                    <em aria-hidden="true" />
                    <i>ES</i>
                    <i>EN</i>
                </span>
            </header>
            <div className="h-esc-cal-grid">
                {SEMANA.map((d, i) => (
                    <span key={`s${i}`} className="h-esc-cal-sem">
                        {d}
                    </span>
                ))}
                {Array.from({ length: 28 }, (_, k) => k + 1).map((d) => {
                    const r = RESERVAS.indexOf(d);
                    return (
                        <span key={d} className="h-esc-dia">
                            {d}
                            {r >= 0 && <motion.i initial={ini({ scale: 0 })} animate={{ scale: 1 }} transition={tr(0.35 + r * 0.07, { duration: 0.35 })} />}
                        </span>
                    );
                })}
            </div>
            <motion.p className="h-esc-confirma" initial={ini({ opacity: 0, y: 8 })} animate={{ opacity: 1, y: 0 }} transition={tr(1.4)}>
                <Check />
                <span>
                    Machu Picchu<span className="h-esc-confirma-mas"> · 2 personas</span>
                </span>
                <time>3:12 a. m.</time>
            </motion.p>
        </motion.div>
    );
}

/* La app: los cupos se llenan solos y nadie persigue pagos. */
const SOCIOS = ['A', 'L', 'C', 'P', 'R', 'M'];

function DespuesGimnasio({ base, reducido }: Props) {
    const { ini, tr } = paso(base, reducido);
    const cupos = useRef<HTMLSpanElement>(null);
    const relleno = useMotionValue(reducido ? 1 : 0.6);
    const lleno = useMomento(base + 1.95, reducido);
    useCuenta(cupos, 12, 20, base + 0.6, 1.3, reducido);
    useEffect(() => {
        if (reducido) return;
        const c = animate(relleno, 1, { delay: base + 0.6, duration: 1.3, ease: EASE });
        return () => c.stop();
    }, [base, reducido, relleno]);
    return (
        <motion.div className="h-esc-card h-esc-oscura h-esc-app" initial={ini({ opacity: 0, y: -12, scale: 0.96 })} animate={{ opacity: 1, y: 0, scale: 1 }} transition={tr(0, { duration: 0.6 })}>
            <header>
                <span className="h-esc-app-ico" aria-hidden="true">
                    <Bici />
                </span>
                <span className="h-esc-app-t">
                    <b>Spinning</b>
                    <small>Mañana · 7:00 · Sala 2</small>
                </span>
                <em className={lleno ? 'is-lleno' : undefined}>{lleno ? 'Lleno' : 'Abierta'}</em>
            </header>
            <p className="h-esc-cupos">
                <span>Cupos</span>
                <b>
                    <span ref={cupos}>20</span>/20
                </b>
            </p>
            <span className="h-esc-barra">
                <motion.i style={{ scaleX: relleno }} />
            </span>
            <div className="h-esc-pie">
                <span className="h-esc-socios">
                    {SOCIOS.map((l, i) => (
                        <motion.span key={i} initial={ini({ opacity: 0, scale: 0.5 })} animate={{ opacity: 1, scale: 1 }} transition={tr(0.5 + i * 0.09, { duration: 0.35 })}>
                            {l}
                        </motion.span>
                    ))}
                    <small>+14</small>
                </span>
                <motion.span className="h-esc-pagado" initial={ini({ opacity: 0, x: 8 })} animate={{ opacity: 1, x: 0 }} transition={tr(1.55)}>
                    <Check />
                    Pagado
                </motion.span>
            </div>
        </motion.div>
    );
}

/* La IA contesta en segundos y deja la visita agendada. Cada mensaje tiene
   su sitio desde el principio y solo se enciende: la tarjeta no cambia de
   alto mientras la conversacion avanza. */
function DespuesInmobiliaria({ base, reducido }: Props) {
    const { ini, tr } = paso(base, reducido);
    const escribiendo = useMomento(base + 0.55, reducido);
    const respondio = useMomento(base + 1.2, reducido);
    const agendado = useMomento(base + 1.85, reducido);
    const suave: Transition = { duration: reducido ? 0 : 0.4, ease: POP };
    return (
        <motion.div className="h-esc-card h-esc-ia" initial={ini({ opacity: 0, y: -12, scale: 0.96 })} animate={{ opacity: 1, y: 0, scale: 1 }} transition={tr(0, { duration: 0.6 })}>
            <header>
                <span className="h-esc-ia-ico" aria-hidden="true">
                    <Estrella />
                </span>
                <b>Asistente IA</b>
                <small>
                    <i aria-hidden="true" />
                    en línea
                </small>
            </header>
            <div className="h-esc-conversa">
                <motion.p className="h-esc-msg is-cliente" initial={ini({ opacity: 0, y: 8 })} animate={{ opacity: 1, y: 0 }} transition={tr(0.15)}>
                    ¿El depa tiene cochera?
                </motion.p>
                <div className="h-esc-ia-resp">
                    <motion.p
                        className="h-esc-msg is-ia is-escribe"
                        aria-hidden="true"
                        initial={false}
                        animate={{ opacity: escribiendo && !respondio ? 1 : 0 }}
                        transition={{ duration: reducido ? 0 : 0.2 }}
                    >
                        <i />
                        <i />
                        <i />
                    </motion.p>
                    <motion.p className="h-esc-msg is-ia" initial={false} animate={{ opacity: respondio ? 1 : 0, y: respondio ? 0 : 8 }} transition={suave}>
                        Sí, 1 cochera techada. ¿Agendo tu visita?
                    </motion.p>
                </div>
            </div>
            <motion.p className="h-esc-agendado" initial={false} animate={{ opacity: agendado ? 1 : 0, y: agendado ? 0 : 8 }} transition={suave}>
                <Check />
                Visita agendada · sáb 10:00
            </motion.p>
        </motion.div>
    );
}

/* El panel: ventas que cuentan, barras que crecen y la alerta a tiempo. */
const BARRAS = [38, 52, 44, 66, 58, 74, 92];

function DespuesDistribuidora({ base, reducido }: Props) {
    const { ini, tr } = paso(base, reducido);
    const ventas = useRef<HTMLElement>(null);
    const alerta = useMomento(base + 1.6, reducido);
    useCuenta(ventas, 0, 12480, base + 0.3, 1.4, reducido, (n) => `S/ ${Math.round(n).toLocaleString('es-PE')}`);
    return (
        <motion.div className="h-esc-card h-esc-oscura h-esc-panel" initial={ini({ opacity: 0, y: -12, scale: 0.96 })} animate={{ opacity: 1, y: 0, scale: 1 }} transition={tr(0, { duration: 0.6 })}>
            <header>
                <b>Panel · hoy</b>
                <span className="h-esc-vivo">
                    <i aria-hidden="true" />
                    En vivo
                </span>
            </header>
            <div className="h-esc-kpis">
                <p>
                    <small>Ventas</small>
                    <b ref={ventas}>S/ 12,480</b>
                </p>
                <p>
                    <small>Pedidos</small>
                    <b>86</b>
                </p>
            </div>
            <div className="h-esc-barras" aria-hidden="true">
                {BARRAS.map((h, i) => (
                    <motion.i
                        key={i}
                        className={i === BARRAS.length - 1 ? 'is-hoy' : undefined}
                        style={{ height: `${h}%` }}
                        initial={ini({ scaleY: 0 })}
                        animate={{ scaleY: 1 }}
                        transition={tr(0.35 + i * 0.08, { duration: 0.6, ease: EASE })}
                    />
                ))}
            </div>
            <motion.p className="h-esc-alerta" initial={false} animate={{ opacity: alerta ? 1 : 0, y: alerta ? 0 : 8 }} transition={{ duration: reducido ? 0 : 0.45, ease: POP }}>
                <Alerta />
                Stock bajo · Arroz 5 kg
            </motion.p>
        </motion.div>
    );
}

/* ================================================================= iconos */

const Trazo = ({ d, className }: { d: string; className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
    </svg>
);
const Luna = () => <Trazo d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />;
const Sol = () => <Trazo d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-4v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1 1M17.4 17.4l1 1M5.6 18.4l1-1M17.4 6.6l1-1" />;
const Check = () => <Trazo d="m5 12.5 4.2 4.2L19 7" />;
const Qr = () => <Trazo d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM18 14h2M14 18v2" />;
const Bici = () => <Trazo d="M5.5 17.5a3.5 3.5 0 1 0 0-.01M18.5 17.5a3.5 3.5 0 1 0 0-.01M5.5 17.5 9 10h6l3.5 7.5M9 10l3 7.5h1M15 10l-1.5-3H11" />;
const Alerta = () => <Trazo d="M12 4 2.8 19.5h18.4L12 4Zm0 6v4.5m0 2.5v.01" />;
