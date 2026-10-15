'use client';

import {
    animate,
    AnimatePresence,
    motion,
    useInView,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useTransform,
    useVelocity,
} from 'motion/react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ESCENARIOS, cifra, cuenta, foto, type Cifra, type Escenario } from './escenarios';
import { EscenaAntes, EscenaDespues } from './escenas';
import { ChipContenido, dos, FlechasAsa, Info, MetricaAntes, MetricaDespues, Pildora } from './partes';

/* El comparador antes/despues, con Motion (motion/react). Llega con
   import() cuando la seccion se acerca: Motion no pesa en la carga de la
   home. Como en la referencia (Reachwise, "Case studies"):

     · cada rubro arranca con la linea casi a la derecha —se ve el "antes",
       con su escena propia (escenas.tsx): la carta en fotos sueltas, la
       agencia cerrada, la lista de papel...— y la linea barre hacia la
       izquierda destapando el "despues" mientras la cifra cuenta, la
       grafica se dibuja y corre la escena de lo que construimos;
     · los rubros pasan solos (barra roja en la pildora activa) mientras la
       tarjeta esta en pantalla; al tocar algo, mandas tu y ya no pasan;
     · la linea se arrastra con el dedo (un toque la lleva hasta ahi), o con
       las flechas del teclado: es un slider.

   El dedo que se mueve en vertical sigue haciendo scroll: la tarjeta tiene
   touch-action: pan-y y el arrastre solo empieza si el gesto es horizontal.
   Sin rebotes: las curvas son las de la marca (--ease, --ease-io, --pop). */

const SEG = 8; // segundos por rubro cuando pasan solos
const ARRANQUE = 0.86; // la linea arranca aqui: casi todo es "antes"
const FINAL = 0.14; // y termina aqui: casi todo es "despues"
const EASE = [0.2, 0.85, 0.15, 1] as const;
const EASE_IO = [0.7, 0, 0.2, 1] as const;
const POP = [0.16, 1, 0.3, 1] as const;
// la coreografia de cada rubro, en segundos desde que se activa: la escena
// del antes corre primero, luego la linea barre y destapa la del despues
const T = { antes: 0.3, barrido: 2.0, dura: 1.6, cifra: 2.15, linea: 2.1, despues: 2.2 };

const limitar = (v: number) => Math.min(1, Math.max(0, v));

type Controles = ReturnType<typeof animate>;

export function Comparador() {
    const reducido = useReducedMotion() ?? false;
    const [activo, setActivo] = useState(0);
    const [vuelta, setVuelta] = useState(0);
    const [auto, setAuto] = useState(true);
    const [tocado, setTocado] = useState(false);
    const [visto, setVisto] = useState(false);
    const [arrastrando, setArrastrando] = useState(false);

    const raiz = useRef<HTMLDivElement>(null);
    const lista = useRef<HTMLDivElement>(null);
    const carta = useRef<HTMLDivElement>(null);
    const asa = useRef<HTMLDivElement>(null);
    const numero = useRef<HTMLSpanElement>(null);
    const coreo = useRef<Controles | null>(null);
    const gesto = useRef<{ id: number; x0: number; y0: number; arrastre: boolean } | null>(null);
    // a donde va la linea con el teclado: dos flechas seguidas suman
    const destino = useRef<number | null>(null);

    const e = ESCENARIOS[activo];
    const contable = cuenta(e);

    // La tarjeta manda: se revela cuando se ve casi entera, y los rubros
    // solo pasan solos mientras sigue a la vista.
    const enVista = useInView(carta, { amount: 0.55 });
    useEffect(() => {
        if (enVista) setVisto(true);
    }, [enVista]);

    const pos = useMotionValue(reducido ? 0.5 : ARRANQUE);
    const conteo = useMotionValue(e.metrica.antes.n);
    const trazo = useMotionValue(reducido ? 1 : 0);
    const progreso = useMotionValue(0);
    const recorte = useTransform(pos, (p) => `inset(0 ${(100 - p * 100).toFixed(3)}% 0 0)`);
    const izquierda = useTransform(pos, (p) => `${(p * 100).toFixed(3)}%`);
    const velocidad = useVelocity(pos);
    const estela = useTransform(velocidad, (v) => Math.min(1, Math.abs(v) * 1.4));
    const lineaVisible = useTransform(trazo, [0, 0.02], [0, 1]);

    // El numero que cuenta va directo al DOM: nada de re-render por cuadro.
    const escribir = useCallback(() => {
        if (numero.current) numero.current.textContent = String(Math.round(conteo.get()));
    }, [conteo]);
    useMotionValueEvent(conteo, 'change', escribir);

    // El valor del slider para el lector de pantalla, igual: sin re-render.
    const anunciar = useCallback((p: number) => {
        const a = Math.round(p * 100);
        asa.current?.setAttribute('aria-valuenow', String(a));
        asa.current?.setAttribute('aria-valuetext', `Antes ${a} %, después ${100 - a} %`);
    }, []);
    useMotionValueEvent(pos, 'change', anunciar);

    // La coreografia de un rubro.
    const revelar = useCallback(
        (x: Escenario) => {
            coreo.current?.stop();
            if (reducido) {
                pos.set(0.5);
                conteo.set(x.metrica.despues.n);
                trazo.set(1);
                return;
            }
            conteo.set(cuenta(x) ? x.metrica.antes.n : x.metrica.despues.n);
            trazo.set(0);
            coreo.current = animate([
                [pos, ARRANQUE, { duration: 0.55, ease: EASE_IO }],
                [pos, FINAL, { duration: T.dura, ease: EASE_IO, at: T.barrido }],
                [conteo, x.metrica.despues.n, { duration: 1.45, ease: EASE, at: T.cifra }],
                [trazo, 1, { duration: 1.5, ease: EASE, at: T.linea }],
            ]);
        },
        [reducido, pos, conteo, trazo]
    );

    useLayoutEffect(() => {
        const x = ESCENARIOS[activo];
        if (visto) revelar(x);
        else if (!reducido) {
            conteo.set(cuenta(x) ? x.metrica.antes.n : x.metrica.despues.n);
            trazo.set(0);
        }
        escribir();
        anunciar(pos.get());
        // vuelta: tocar la pildora activa repite la coreografia
    }, [activo, vuelta, visto, reducido, revelar, escribir, anunciar, conteo, trazo, pos]);

    useEffect(() => () => coreo.current?.stop(), []);

    // Los rubros pasan solos: un reloj propio que solo corre con la tarjeta
    // a la vista, y se detiene para siempre en cuanto tocas algo.
    useEffect(() => {
        if (!auto || !enVista || reducido) return;
        let raf = 0;
        let antes = performance.now();
        const paso = (t: number) => {
            const v = progreso.get() + (t - antes) / 1000 / SEG;
            antes = t;
            if (v >= 1) {
                progreso.set(0);
                setActivo((a) => (a + 1) % ESCENARIOS.length);
                setVuelta((n) => n + 1);
            } else progreso.set(v);
            raf = requestAnimationFrame(paso);
        };
        raf = requestAnimationFrame(paso);
        return () => cancelAnimationFrame(raf);
    }, [auto, enVista, reducido, progreso]);

    // La pildora activa siempre a la vista, centrada en su fila (la fila se
    // desplaza; la pagina no).
    useEffect(() => {
        const fila = lista.current;
        const chip = fila?.children[activo] as HTMLElement | undefined;
        if (!fila || !chip) return;
        fila.scrollTo({ left: Math.max(0, chip.offsetLeft - (fila.clientWidth - chip.offsetWidth) / 2), behavior: reducido ? 'auto' : 'smooth' });
        // y la foto del siguiente, ya en cache
        const sig = new Image();
        sig.src = foto(ESCENARIOS[(activo + 1) % ESCENARIOS.length]);
    }, [activo, reducido]);

    /* --------------------------------------------------------- control */

    // Tocar cualquier cosa del comparador: se acaban los pases solos, y si
    // la coreografia iba a medias, las cifras quedan completas.
    const tomarControl = useCallback(() => {
        coreo.current?.stop();
        setAuto(false);
        setTocado(true);
        progreso.set(0);
        conteo.set(ESCENARIOS[activo].metrica.despues.n);
        trazo.set(1);
    }, [activo, progreso, conteo, trazo]);

    const elegir = (i: number) => {
        setAuto(false);
        progreso.set(0);
        setActivo(i);
        setVuelta((n) => n + 1);
    };

    const xEnCarta = (clientX: number) => {
        const r = carta.current?.getBoundingClientRect();
        return r ? limitar((clientX - r.left) / r.width) : 0.5;
    };

    const alBajar = (ev: PointerEvent<HTMLDivElement>) => {
        if (ev.pointerType === 'mouse' && ev.button !== 0) return;
        gesto.current = { id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, arrastre: false };
    };
    const alMover = (ev: PointerEvent<HTMLDivElement>) => {
        const g = gesto.current;
        if (!g || g.id !== ev.pointerId) return;
        if (!g.arrastre) {
            const dx = Math.abs(ev.clientX - g.x0);
            const dy = Math.abs(ev.clientY - g.y0);
            // vertical: es scroll, el navegador se lo lleva
            if (dy > 8 && dy > dx) {
                gesto.current = null;
                return;
            }
            if (dx < 6) return;
            g.arrastre = true;
            tomarControl();
            setArrastrando(true);
            ev.currentTarget.setPointerCapture?.(ev.pointerId);
        }
        pos.set(xEnCarta(ev.clientX));
    };
    const alSoltar = (ev: PointerEvent<HTMLDivElement>) => {
        const g = gesto.current;
        gesto.current = null;
        setArrastrando(false);
        if (!g || g.id !== ev.pointerId || g.arrastre || ev.type === 'pointercancel') return;
        // un toque: la linea viaja hasta el dedo
        tomarControl();
        animate(pos, xEnCarta(ev.clientX), { duration: 0.5, ease: POP });
    };

    const alTeclaAsa = (ev: KeyboardEvent<HTMLDivElement>) => {
        const paso = ev.shiftKey ? 0.2 : 0.05;
        let v = destino.current ?? pos.get();
        if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') v -= paso;
        else if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') v += paso;
        else if (ev.key === 'Home') v = 0;
        else if (ev.key === 'End') v = 1;
        else return;
        ev.preventDefault();
        tomarControl();
        const objetivo = limitar(v);
        destino.current = objetivo;
        animate(pos, objetivo, { duration: 0.35, ease: POP }).then(() => {
            if (destino.current === objetivo) destino.current = null;
        });
    };

    // Pestañas: flechas para moverse entre rubros (activacion automatica).
    const alTeclaLista = (ev: KeyboardEvent<HTMLDivElement>) => {
        const n = ESCENARIOS.length;
        let i = activo;
        if (ev.key === 'ArrowRight') i = (activo + 1) % n;
        else if (ev.key === 'ArrowLeft') i = (activo - 1 + n) % n;
        else if (ev.key === 'Home') i = 0;
        else if (ev.key === 'End') i = n - 1;
        else return;
        ev.preventDefault();
        elegir(i);
        (lista.current?.children[i] as HTMLElement | undefined)?.focus();
    };

    return (
        <div ref={raiz} className="h-neg-comp">
            {/* ------------------------------------------------ los rubros */}
            <div ref={lista} className="h-neg-chips" role="tablist" aria-label="Elige un rubro" onKeyDown={alTeclaLista}>
                {ESCENARIOS.map((x, i) => {
                    const on = i === activo;
                    return (
                        <button
                            key={x.id}
                            type="button"
                            role="tab"
                            id={`neg-tab-${x.id}`}
                            aria-selected={on}
                            aria-controls="neg-panel"
                            tabIndex={on ? 0 : -1}
                            className={`h-neg-chip${on ? ' is-activo' : ''}`}
                            onClick={() => elegir(i)}
                        >
                            <span className="h-neg-chip-fondo" aria-hidden="true" />
                            <ChipContenido e={x} />
                            {on && auto && !reducido && <motion.span className="h-neg-chip-barra" style={{ scaleX: progreso }} aria-hidden="true" />}
                        </button>
                    );
                })}
            </div>

            <div className="m-wrap">
                <div id="neg-panel" role="tabpanel" aria-labelledby={`neg-tab-${e.id}`}>
                    <div className="h-neg-pista">
                        <AnimatePresence initial={false}>
                            {!tocado && (
                                <motion.span key="pista" className="h-neg-pista-txt m-mono" exit={{ opacity: 0, x: -8, transition: { duration: 0.3 } }}>
                                    <FlechasAsa />
                                    Desliza para comparar
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <span className="h-neg-indice m-mono" aria-hidden="true">
                            <span className="h-neg-indice-ventana">
                                <AnimatePresence initial={false} mode="popLayout">
                                    <motion.b
                                        key={activo}
                                        initial={{ y: '100%' }}
                                        animate={{ y: '0%' }}
                                        exit={{ y: '-100%' }}
                                        transition={{ duration: reducido ? 0 : 0.5, ease: EASE }}
                                    >
                                        {dos(activo + 1)}
                                    </motion.b>
                                </AnimatePresence>
                            </span>
                            / {dos(ESCENARIOS.length)}
                        </span>
                    </div>

                    {/* ---------------------------------------------- la tarjeta */}
                    <div
                        ref={carta}
                        className="h-neg-carta"
                        data-loop
                        data-arrastre={arrastrando ? '1' : undefined}
                        onPointerDown={alBajar}
                        onPointerMove={alMover}
                        onPointerUp={alSoltar}
                        onPointerCancel={alSoltar}
                    >
                        {/* despues: a color, con la grafica y el aviso */}
                        <div className="h-neg-capa h-neg-capa--despues">
                            <span className="h-neg-lienzo">
                                <AnimatePresence initial={false}>
                                    <motion.img
                                        key={e.id}
                                        className="h-neg-foto"
                                        src={foto(e)}
                                        alt=""
                                        width={800}
                                        height={1000}
                                        decoding="async"
                                        draggable={false}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: reducido ? 0 : 0.9, ease: EASE }}
                                    />
                                </AnimatePresence>
                            </span>
                            <span className="h-neg-velo" />
                            <svg className="h-neg-graf" viewBox="0 0 100 56" aria-hidden="true">
                                <defs>
                                    <linearGradient id="neg-area" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0" stopColor="#e11d3a" stopOpacity="0.42" />
                                        <stop offset="1" stopColor="#e11d3a" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <motion.path d={`${e.linea} L101,57 L-1,57 Z`} fill="url(#neg-area)" style={{ opacity: trazo }} />
                                <motion.path className="h-neg-graf-linea" d={e.linea} style={{ pathLength: trazo, opacity: lineaVisible }} />
                            </svg>
                            <motion.div
                                key={`d-${e.id}`}
                                className="h-neg-met h-neg-met--despues"
                                initial={reducido ? false : { opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
                            >
                                <MetricaDespues
                                    e={e}
                                    numero={contable ? numero : undefined}
                                    valor={
                                        contable ? undefined : <Rodar key={`${vuelta}-${visto}`} c={e.metrica.despues} retraso={visto ? T.cifra : 0} reducido={reducido} />
                                    }
                                />
                            </motion.div>
                            <AnimatePresence>
                                {visto && (
                                    <motion.div key={`${e.id}-${vuelta}`} className="h-neg-esc h-neg-esc--despues" exit={{ opacity: 0, transition: { duration: 0.25 } }}>
                                        <EscenaDespues e={e} base={reducido ? 0 : T.despues} reducido={reducido} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* antes: la misma foto en gris, y el chat sin contestar */}
                        <motion.div className="h-neg-capa h-neg-capa--antes" style={{ clipPath: recorte }}>
                            <span className="h-neg-lienzo">
                                <AnimatePresence initial={false}>
                                    <motion.img
                                        key={e.id}
                                        className="h-neg-foto"
                                        src={foto(e)}
                                        alt=""
                                        width={800}
                                        height={1000}
                                        decoding="async"
                                        draggable={false}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: reducido ? 0 : 0.9, ease: EASE }}
                                    />
                                </AnimatePresence>
                            </span>
                            <span className="h-neg-velo h-neg-velo--antes" />
                            <svg className="h-neg-graf" viewBox="0 0 100 56" aria-hidden="true">
                                <path className="h-neg-graf-plana" d="M-1,50 C18,49 30,51 48,50 S80,49 101,50" />
                            </svg>
                            {/* la cifra y la escena, en una columna: nunca se pisan */}
                            <div className="h-neg-col-antes">
                                <motion.div
                                    key={`a-${e.id}`}
                                    className="h-neg-met h-neg-met--antes"
                                    initial={reducido ? false : { opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
                                >
                                    <MetricaAntes e={e} />
                                </motion.div>
                                {visto && (
                                    <div key={`${e.id}-${vuelta}`} className="h-neg-esc h-neg-esc--antes">
                                        <EscenaAntes e={e} base={reducido ? 0 : T.antes} reducido={reducido} />
                                        <motion.p
                                            className="h-neg-estado"
                                            initial={reducido ? false : { opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: reducido ? 0 : T.antes + 1.3, duration: 0.45, ease: POP }}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                                                <circle cx="12" cy="12" r="8.5" />
                                                <path d="M12 7.5V12l3 2" />
                                            </svg>
                                            {e.antes.estado}
                                        </motion.p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* el filo rojo que deja la linea al moverse */}
                        <motion.span className="h-neg-estela" style={{ left: izquierda, opacity: estela }} aria-hidden="true" />

                        <motion.div
                            ref={asa}
                            className="h-neg-asa"
                            style={{ left: izquierda }}
                            role="slider"
                            tabIndex={0}
                            aria-label="Comparar antes y después"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            onKeyDown={alTeclaAsa}
                        >
                            <span className="h-neg-asa-linea" aria-hidden="true" />
                            <span className="h-neg-asa-circ" aria-hidden="true">
                                <FlechasAsa />
                            </span>
                        </motion.div>

                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={e.id}
                                className="h-neg-pildora"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: reducido ? 0 : 0.35, ease: EASE }}
                            >
                                <Pildora e={e} />
                            </motion.span>
                        </AnimatePresence>

                        <p className="sr-only">
                            Antes: {e.antes.resumen} {cifra(e.metrica.antes)} {e.metrica.que}. Después: {e.despues.resumen} {cifra(e.metrica.despues)} {e.metrica.que}.
                        </p>
                    </div>

                    <Info activo={activo} />
                </div>
            </div>
        </div>
    );
}

/* La cifra que no se puede contar (3 h → 5 s): cada digito rueda como un
   tragamonedas hasta caer en su numero. */
function Rodar({ c, retraso, reducido }: { c: Cifra; retraso: number; reducido: boolean }) {
    const digitos = String(c.n).split('');
    return (
        <span className="h-neg-rodar" aria-label={String(c.n)}>
            {digitos.map((d, i) => {
                const tira = Array.from({ length: 9 }, (_, k) => String((Number(d) + 3 + k * 7) % 10)).concat(d);
                return (
                    <span key={i} className="h-neg-rodar-col" aria-hidden="true">
                        <motion.span
                            className="h-neg-rodar-tira"
                            initial={reducido ? false : { y: '0%' }}
                            animate={{ y: `-${((tira.length - 1) / tira.length) * 100}%` }}
                            transition={{ delay: retraso + i * 0.08, duration: 1.3, ease: EASE }}
                        >
                            {tira.map((t, k) => (
                                <span key={k}>{t}</span>
                            ))}
                        </motion.span>
                    </span>
                );
            })}
        </span>
    );
}
