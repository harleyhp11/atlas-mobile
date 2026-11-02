'use client';

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Boton } from '../Boton';
import { CHIPS_CONFIANZA } from '../datos';
import { Llave, Reloj, Salvavidas, WhatsApp } from '../iconos';
import { BENJAMIN, HARLEY } from '../nosotros/equipo';
import { Titular } from '../Titular';
import { ListaCheck } from './comun/ListaCheck';
import { PrecioPlan } from './comun/PrecioPlan';
import { TarjetaPlan } from './comun/TarjetaPlan';
import {
    DETALLES,
    EN_TODOS,
    entregaLeida,
    ETAPAS,
    FRASES,
    GARANTIAS,
    NECESIDADES,
    NOTA_LEGAL,
    PASOS,
    PLANES,
    WSP_AYUDA,
    wspPlan,
    type Detalle,
    type SlugPlan,
} from './planes';
import { FondoOndas } from './FondoOndas';
import './planes.css';

/* #planes: lo que hay debajo de la entrada «Nuestros / Precios». Cuatro
   bloques, cada uno con UN titular (sin cejas ni numeros de seccion):

     1. «¿Qué necesita tu negocio?» (refs 30 y 33): chips en primera persona
        y el bento con los 4 planes, enteros en una pantalla al llegar con la
        flecha de la intro. Un chip marca su plan («Para ti») y apaga los
        otros EN SU SITIO: nunca filtra ni reordena, para que nadie pierda
        de vista las opciones. Cada tarjeta lleva a /servicios/[slug].
     2. «Lo que incluye, punto por punto.» (ref 31): pestañas, la palabra
        gigante del plan detras de una tarjeta de vidrio que la desenfoca,
        precio, plazo y los checks que se van marcando. Se cambia tocando la
        pestaña, con las flechas o deslizando sobre la tarjeta.
     3. «¿Y si les escribo hoy?» (ref 32): la hoja clara con el «< 24 h» (y
        un reloj que se completa) y los cuatro pasos hasta el precio
        cerrado, y lo que va en todos.
     4. «Te ayudamos a elegir.» (ref 35): la salida para quien sigue sin
        saber: foto a sangre, los dos que responden y WhatsApp.

   Un solo estado compartido: el chip elegido y la pestaña del comparador
   (un chip de plan mueve la pestaña, sin hacer scroll).

   Gotcha de Revelador (ver Servicios.tsx): ningun className de aqui se
   deriva del estado. Lo que cambia viaja en aria-pressed, aria-selected,
   data-estado, data-pos o data-activo; si React reescribiera la clase de
   algo con data-rv/data-in le borraria el .is-in y volveria a esconderse.

   Ninguna cifra va escrita a mano: precios, plazos, conteos y garantias
   salen de planes.ts (que importa los datos del escritorio).

   El archivo se llama ListaPlanes y no Planes: en un disco que no distingue
   mayusculas (el de la Mac), '…/precios/Planes' resolveria a planes.ts. */

type Eleccion = SlugPlan | 'todos' | 'ayuda';

const ICONO_GARANTIA: Record<string, (p: { className?: string }) => ReactNode> = {
    salvavidas: Salvavidas,
    llave: Llave,
    reloj: Reloj,
};

// «7 – 10 días» no se parte alrededor del guion
const sinCorte = (s: string) => s.replace(/ – /g, '\u00a0–\u00a0');

export function Planes() {
    const [elegido, setElegido] = useState<Eleccion>('todos');
    const [pestana, setPestana] = useState(0);

    const elegir = (id: Eleccion) => {
        // un chip ya marcado se desmarca: vuelve a «Ver todos»
        const sig = id === elegido && id !== 'todos' ? 'todos' : id;
        setElegido(sig);
        const d = DETALLES.find((x) => x.slug === sig);
        if (d) setPestana(d.i);
    };

    return (
        <section id="planes" className="pre-pl" aria-labelledby="planes-t">
            <Elegir elegido={elegido} elegir={elegir} />
            <Comparador pestana={pestana} setPestana={setPestana} />
            <Hoy />
            <Ayuda />
        </section>
    );
}

/* ================================================== 1 · chips + bento */

function Elegir({ elegido, elegir }: { elegido: Eleccion; elegir: (id: Eleccion) => void }) {
    const marcado = DETALLES.find((d) => d.slug === elegido);
    const fila = useRef<HTMLDivElement>(null);

    // el chip tocado se centra en su fila: asoman sus vecinos y se nota que
    // la fila sigue (solo la fila hace scroll, nunca la pagina)
    const centrar = (chip: HTMLElement) => {
        const f = fila.current;
        if (!f || f.scrollWidth <= f.clientWidth) return;
        const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
        f.scrollTo({ left: chip.offsetLeft + chip.offsetWidth / 2 - f.clientWidth / 2, behavior: quieto ? 'auto' : 'smooth' });
    };
    return (
        <div className="pre-pl-elegir m-wrap" data-tono="oscuro">
            <Titular id="planes-t" className="m-h2 pre-pl-t" texto="¿Qué necesita tu negocio?" destacar="negocio?" />

            {/* data-in en la fila y no en cada chip: los que quedan fuera por
                la derecha no cruzan la pantalla y nunca se revelarian */}
            <div ref={fila} className="pre-pl-chips" role="group" aria-label="¿Qué necesita tu negocio?" data-in>
                {NECESIDADES.map((n, k) => (
                    <button
                        key={n.id}
                        type="button"
                        className="pre-pl-chip"
                        aria-pressed={elegido === n.id}
                        style={{ '--d': `${0.25 + k * 0.04}s` } as CSSProperties}
                        onClick={(ev) => {
                            elegir(n.id);
                            centrar(ev.currentTarget);
                        }}
                    >
                        {n.label}
                    </button>
                ))}
            </div>

            {/* la linea viva: dice que hacer en cada estado; reserva dos
                lineas para que el bento no salte */}
            <p className="pre-pl-linea" aria-live="polite">
                <span key={elegido} className="pre-pl-linea-in">
                    <Linea elegido={elegido} d={marcado} />
                </span>
            </p>

            <div className="pre-pl-bento">
                {DETALLES.map((d, k) => (
                    <TarjetaPlan
                        key={d.slug}
                        d={d}
                        tam={k === 0 || k === DETALLES.length - 1 ? 'ancho' : 'cuadro'}
                        estado={marcado ? (marcado === d ? 'para' : 'tenue') : undefined}
                        revelar
                        retraso={k * 0.07}
                        cuenta
                    />
                ))}
            </div>
        </div>
    );
}

// [CONFIRMAR copy con Harley] las tres lineas
function Linea({ elegido, d }: { elegido: Eleccion; d?: Detalle }) {
    if (elegido === 'ayuda') {
        return (
            <>
                Sin problema: cuéntanos tu negocio y te decimos cuál te conviene.{' '}
                <a className="pre-pl-linea-a" href={WSP_AYUDA} target="_blank" rel="noopener noreferrer">
                    Escribir por WhatsApp
                    <span className="sr-only"> (abre WhatsApp)</span>
                </a>
            </>
        );
    }
    if (d) {
        return (
            <>
                <b>Para ti: {d.titulo}.</b> Tócala para ver todo lo que incluye.
            </>
        );
    }
    return (
        <>
            <b>{PLANES.length} planes</b>, de menor a mayor. Toca uno para ver todo lo que incluye.
        </>
    );
}

/* ============================================ 2 · el comparador (ref 31) */

function Comparador({ pestana, setPestana }: { pestana: number; setPestana: (i: number) => void }) {
    const lista = useRef<HTMLDivElement>(null);
    const toque = useRef<{ x: number; y: number; id: number } | null>(null);
    const n = DETALLES.length;

    const alTecla = (ev: KeyboardEvent<HTMLDivElement>) => {
        let i = pestana;
        if (ev.key === 'ArrowRight') i = (pestana + 1) % n;
        else if (ev.key === 'ArrowLeft') i = (pestana - 1 + n) % n;
        else if (ev.key === 'Home') i = 0;
        else if (ev.key === 'End') i = n - 1;
        else return;
        ev.preventDefault();
        setPestana(i);
        lista.current?.querySelectorAll<HTMLElement>('[role="tab"]')[i]?.focus();
    };

    // deslizar sobre la tarjeta cambia de plan (sin dar la vuelta en los
    // extremos: el gesto se siente como pasar paginas)
    const alBajar = (ev: PointerEvent<HTMLDivElement>) => {
        toque.current = { x: ev.clientX, y: ev.clientY, id: ev.pointerId };
    };
    const alSubir = (ev: PointerEvent<HTMLDivElement>) => {
        const t = toque.current;
        toque.current = null;
        if (!t || t.id !== ev.pointerId) return;
        const dx = ev.clientX - t.x;
        const dy = ev.clientY - t.y;
        if (Math.abs(dx) <= 48 || Math.abs(dy) >= Math.abs(dx)) return;
        const i = Math.min(n - 1, Math.max(0, pestana + (dx < 0 ? 1 : -1)));
        if (i !== pestana) setPestana(i);
    };

    return (
        <section className="pre-pl-cmp" data-tono="oscuro" aria-labelledby="cmp-t">
            <div className="m-wrap">
                <Titular id="cmp-t" className="m-h2 pre-pl-t pre-c-t-gris" texto="Lo que incluye, punto por punto." />
                <div
                    ref={lista}
                    className="pre-pl-tabs"
                    role="tablist"
                    aria-label="Planes"
                    onKeyDown={alTecla}
                    style={{ '--i': pestana } as CSSProperties}
                >
                    <span className="pre-pl-tabs-ind" aria-hidden="true" />
                    {DETALLES.map((d, k) => (
                        <button
                            key={d.slug}
                            type="button"
                            role="tab"
                            id={`cmp-tab-${d.slug}`}
                            className="pre-pl-tab"
                            aria-selected={k === pestana}
                            aria-controls={`cmp-panel-${d.slug}`}
                            tabIndex={k === pestana ? 0 : -1}
                            onClick={() => setPestana(k)}
                        >
                            {d.corto}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pre-pl-escena">
                {/* la palabra gigante: dice en que plan estas sin leer; el
                    vidrio la desenfoca justo donde la tapa. --n (letras)
                    achica las largas para que entren enteras en el ancho */}
                <div className="pre-pl-gigante m-wrap" aria-hidden="true">
                    {DETALLES.map((d, k) => (
                        <span
                            key={d.slug}
                            data-pos={k < pestana ? 'antes' : k === pestana ? 'activa' : 'despues'}
                            style={{ '--n': d.corto.length } as CSSProperties}
                        >
                            {d.corto}
                        </span>
                    ))}
                </div>
                <div className="m-wrap pre-pl-escena-in">
                    <div className="pre-pl-vidrio" onPointerDown={alBajar} onPointerUp={alSubir} onPointerCancel={() => (toque.current = null)}>
                        {DETALLES.map((d, k) => (
                            <Panel key={d.slug} d={d} activo={k === pestana} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Panel({ d, activo }: { d: Detalle; activo: boolean }) {
    const { plan } = d;
    return (
        <div
            role="tabpanel"
            id={`cmp-panel-${d.slug}`}
            aria-labelledby={`cmp-tab-${d.slug}`}
            className="pre-pl-panel"
            data-activo={activo}
            inert={!activo}
        >
            <p className="pre-pl-panel-n">
                <b>{plan.nombre}</b> {plan.coda}
            </p>
            <PrecioPlan plan={plan} tam="l" cola="fundido" className="pre-pl-panel-precio" />
            <p className="pre-pl-panel-nota">{plan.precioNota}</p>
            <p className="pre-pl-panel-ent">
                <Reloj />
                <span className="m-mono" aria-hidden="true">
                    {sinCorte(plan.entrega)}
                </span>
                <span className="sr-only">{entregaLeida(plan)}</span>
            </p>
            <hr className="pre-pl-panel-filete" />
            <ListaCheck items={plan.incluye} dibujar className="pre-pl-panel-checks" />
            <div className="pre-pl-panel-acc">
                <Boton href={`/servicios/${d.slug}`} variante="claro">
                    Ver el plan completo<span className="sr-only">: {d.titulo}</span>
                </Boton>
                <a className="pre-pl-panel-wsp" href={wspPlan(d)} target="_blank" rel="noopener noreferrer">
                    <WhatsApp />
                    {plan.cta}
                    <span className="sr-only"> (abre WhatsApp)</span>
                </a>
            </div>
        </div>
    );
}

/* ====================================== 3 · «¿Y si les escribo hoy?» (ref 32) */

const RESPUESTA = GARANTIAS[1]; // «< 24 h» · Menos de 24 horas

function Hoy() {
    return (
        <section className="pre-pl-hoy m-claro" data-tono="claro" aria-labelledby="hoy-t">
            <div className="m-wrap">
                <Titular id="hoy-t" className="m-h2 pre-pl-t pre-c-t-gris" texto="¿Y si les escribo hoy?" />

                {/* la cifra grande con su grafico (el «86 %» de la ref 32). Un
                    reloj que se completa y no una linea que sube: junto a un
                    tiempo de respuesta, subir se leeria «cada vez tardamos mas» */}
                <div className="pre-pl-24" data-in data-loop>
                    {/* [CONFIRMAR copy con Harley] */}
                    <p className="m-mono pre-pl-24-e">Te respondemos en</p>
                    <span className="pre-pl-24-grafico" aria-hidden="true">
                        <svg viewBox="0 0 44 44" fill="none">
                            <circle className="pre-pl-24-area" cx="22" cy="22" r="19" />
                            <circle className="pre-pl-24-linea" pathLength={1} cx="22" cy="22" r="19" transform="rotate(-90 22 22)" />
                            <path className="pre-pl-24-agujas" d="M22 22V12M22 22l6 4" />
                        </svg>
                        <i className="m-ping m-ping--siempre" />
                    </span>
                    <p className="pre-pl-24-cifra">
                        <span aria-hidden="true">{RESPUESTA.b}</span>
                        <span className="sr-only">{RESPUESTA.sr ?? RESPUESTA.b}</span>
                    </p>
                </div>

                <ol className="pre-pl-pasos" data-in>
                    {PASOS.map((p, k) => (
                        <li key={p.t} className="pre-pl-paso" data-rv style={{ '--d': `${k * 0.09}s` } as CSSProperties}>
                            <span className="pre-pl-paso-n" aria-hidden="true">
                                {k + 1}
                            </span>
                            <div className="pre-pl-paso-c">
                                <h3 className="pre-pl-paso-t">{p.t}</h3>
                                {p.etapas && (
                                    <ul className="m-chips pre-pl-etapas" aria-label="Las etapas">
                                        {ETAPAS.map((e) => (
                                            <li key={e.nombre} className="m-chip">
                                                {e.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <p className="pre-pl-paso-d">{p.d}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                {/* widgets de la ref 33: lo que va en los cuatro planes */}
                <div className="pre-pl-todos" data-rv>
                    {/* [CONFIRMAR copy con Harley] */}
                    <h3 className="pre-pl-todos-t">Y además, en todos los planes</h3>
                    <ul className="pre-pl-todos-g">
                        {EN_TODOS.map((g) => {
                            const Icono = ICONO_GARANTIA[g.icono] ?? Salvavidas;
                            return (
                                <li key={g.b} className="pre-pl-w">
                                    <span className="pre-pl-w-top" aria-hidden="true">
                                        <span className="pre-pl-w-ic">
                                            <Icono />
                                        </span>
                                        {/* [CONFIRMAR copy con Harley] */}
                                        <span className="pre-pl-w-pill">
                                            <i />
                                            Incluido
                                        </span>
                                    </span>
                                    <b className="pre-pl-w-b">{g.b}</b>
                                    <span className="pre-pl-w-s">{g.s}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
}

/* ======================================== 4 · «Te ayudamos a elegir.» (ref 35) */

function Ayuda() {
    return (
        <section className="pre-pl-ayuda" data-tono="oscuro" aria-labelledby="elegir-t">
            <div className="m-wrap">
                <div className="pre-pl-ayuda-card">
                    {/* las ondas en los colores de Atlas (pedido de Harley), en
                        lugar de la foto del monolito */}
                    <FondoOndas className="pre-pl-ondas" />
                    <div className="pre-pl-ayuda-in">
                        <p className="pre-pl-quien" data-rv style={{ '--d': '.15s' } as CSSProperties}>
                            <span className="pre-pl-caras" aria-hidden="true">
                                <img src={HARLEY.mini} width={240} height={240} alt="" loading="lazy" decoding="async" />
                                <img src={BENJAMIN.mini} width={240} height={240} alt="" loading="lazy" decoding="async" />
                            </span>
                            <span>{FRASES.directo}</span>
                        </p>
                        <Titular id="elegir-t" className="m-h2 pre-pl-t" texto="Te ayudamos a elegir." destacar="elegir." />
                        {/* [CONFIRMAR copy con Harley] */}
                        <p className="pre-pl-ayuda-p">Cuéntanos tu negocio y te decimos qué plan te conviene.</p>
                        <div className="pre-pl-ayuda-cta" data-rv style={{ '--d': '.25s' } as CSSProperties}>
                            <Boton href={WSP_AYUDA} externo tinta>
                                Ayúdame a elegir
                            </Boton>
                        </div>
                    </div>
                </div>

                <ul className="m-chips pre-pl-confianza">
                    {CHIPS_CONFIANZA.map((c) => (
                        <li key={c} className="m-chip">
                            {c}
                        </li>
                    ))}
                </ul>
                <p className="pre-pl-legal">{NOTA_LEGAL}</p>
            </div>
        </section>
    );
}
