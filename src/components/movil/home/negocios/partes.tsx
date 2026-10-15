import type { CSSProperties, ReactNode, Ref } from 'react';
import { Flecha } from '../../iconos';
import { ESCENARIOS, cifra, miniatura, type Escenario } from './escenarios';

/* Piezas sin Motion, compartidas por el comparador animado y por su
   version quieta (la que se ve mientras Motion no ha bajado). Las dos
   tienen que medir lo mismo para que el cambio de una a otra no mueva la
   pagina. */

export const dos = (n: number) => String(n).padStart(2, '0');

export function ChipContenido({ e }: { e: Escenario }) {
    return (
        <>
            <img className="h-neg-chip-img" src={miniatura(e)} width={56} height={56} alt="" loading="lazy" decoding="async" draggable={false} />
            <span className="h-neg-chip-txt">
                <b>{e.rubro}</b>
                <small>{e.metrica.chip}</small>
            </span>
        </>
    );
}

export function Pildora({ e }: { e: Escenario }) {
    return (
        <>
            <i aria-hidden="true" />
            {e.tuyo} · ejemplo
        </>
    );
}

/* La cifra de "antes": hueca, solo el contorno. */
export function MetricaAntes({ e }: { e: Escenario }) {
    const { antes, que } = e.metrica;
    return (
        <>
            <span className="h-neg-etq h-neg-etq--antes m-mono">Antes</span>
            <strong className="h-neg-num h-neg-num--antes">
                {antes.n}
                {antes.u && <small>{antes.u}</small>}
            </strong>
            <span className="h-neg-que m-mono">{que}</span>
        </>
    );
}

/* La cifra de "despues", en rojo. En el comparador el numero lo escribe un
   MotionValue directo en el DOM (numero), asi que React no le pone hijos;
   o llega ya armado (valor), como el que rueda. */
export function MetricaDespues({ e, numero, valor }: { e: Escenario; numero?: Ref<HTMLSpanElement>; valor?: ReactNode }) {
    const { despues, que } = e.metrica;
    return (
        <>
            <span className="h-neg-etq h-neg-etq--despues m-mono">
                <i aria-hidden="true" />
                Después
            </span>
            <strong className="h-neg-num h-neg-num--despues">
                {valor ?? (numero ? <span ref={numero} /> : despues.n)}
                {despues.u && <small>{despues.u}</small>}
            </strong>
            <span className="h-neg-que m-mono">{que}</span>
        </>
    );
}

export function FlechasAsa() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
        </svg>
    );
}

/* Los textos de los cinco, apilados en la misma celda de la grilla: el
   bloque mide lo que mide el mas largo y cambiar de rubro no mueve nada de
   lo que hay debajo. Solo el activo se ve; los otros quedan inertes. La
   entrada es CSS (opacidad, desplazamiento y desenfoque escalonados). */
export function Info({ activo }: { activo: number }) {
    return (
        <div className="h-neg-info">
            {ESCENARIOS.map((e, i) => {
                const on = i === activo;
                return (
                    <article key={e.id} className={`h-neg-art${on ? ' is-activo' : ''}`} aria-hidden={!on} inert={!on}>
                        <p className="h-neg-art-cab m-mono" style={{ '--i': 0 } as CSSProperties}>
                            <span>
                                {e.rubro} · {e.servicio}
                            </span>
                            <span className="h-neg-art-precio">{e.precio}</span>
                        </p>
                        <h3 className="h-neg-art-t" style={{ '--i': 1 } as CSSProperties}>
                            {e.titular}
                        </h3>
                        <p className="m-p h-neg-art-p" style={{ '--i': 2 } as CSSProperties}>
                            {e.texto}
                        </p>
                        <div className="h-neg-art-pie" style={{ '--i': 3 } as CSSProperties}>
                            <ul className="h-neg-tags" aria-label="Incluye">
                                {e.incluye.map((t) => (
                                    <li key={t}>{t}</li>
                                ))}
                            </ul>
                            <a className="h-neg-cta" href={e.whatsapp} target="_blank" rel="noopener noreferrer">
                                Lo quiero
                                <span className="sr-only"> para {e.tuyo.replace(/^Tu /, 'mi ')} (abre WhatsApp)</span>
                                <span className="h-neg-cta-chip" aria-hidden="true">
                                    <Flecha />
                                </span>
                            </a>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
