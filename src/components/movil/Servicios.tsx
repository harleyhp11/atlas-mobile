'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { Boton } from './Boton';
import { SERVICIOS, whatsapp } from './datos';
import { Escena } from './escenas/Escenas';
import './servicios.css';

/* Los cinco servicios. Cada uno se abre SOLO al tocarlo —nunca con el
   scroll— y al abrirse monta su mini-interfaz, que arranca de cero cada vez.

   Variantes (la forma la pone el CSS de cada direccion):
     · 'indice'  — filas finas sobre negro, numero + nombre grande;
     · 'mosaico' — baldosas de dos columnas; la abierta ocupa el ancho;
     · 'filas'   — filas de 68 px con colores alternos sobre una isla clara.

   En 'indice' y 'filas' cada fila se abre y cierra por su cuenta: asi abrir
   una no cierra otra de mas arriba y la pagina no salta. En 'mosaico' solo
   hay una abierta, y el cambio se anima con View Transitions donde existen.

   La escena solo corre si su panel esta abierto Y en pantalla. */

type Props = {
    variante: 'indice' | 'mosaico' | 'filas';
    tema?: 'claro' | 'oscuro';
    inicial?: number;
};

const dos = (n: number) => String(n).padStart(2, '0');

export function Servicios({ variante, tema = 'oscuro', inicial = 0 }: Props) {
    const unico = variante === 'mosaico';
    const [abiertos, setAbiertos] = useState<number[]>([inicial]);
    const [vueltas, setVueltas] = useState<number[]>(() => SERVICIOS.map(() => 0));
    const [visibles, setVisibles] = useState<number[]>([]);
    const [reducido, setReducido] = useState(false);
    const lista = useRef<HTMLUListElement>(null);

    useEffect(() => {
        setReducido(matchMedia('(prefers-reduced-motion: reduce)').matches);
        const ul = lista.current;
        if (!ul) return;
        const io = new IntersectionObserver((es) => {
            setVisibles((prev) => {
                const s = new Set(prev);
                for (const e of es) {
                    const i = Number((e.target as HTMLElement).dataset.i);
                    if (e.isIntersecting) s.add(i);
                    else s.delete(i);
                }
                return [...s];
            });
        });
        ul.querySelectorAll<HTMLElement>('.m-srv-escena').forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    const tocar = (i: number) => {
        const cambiar = () => {
            setAbiertos((a) => (a.includes(i) ? a.filter((x) => x !== i) : unico ? [i] : [...a, i]));
            setVueltas((v) => v.map((n, k) => (k === i ? n + 1 : n)));
        };
        const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
        if (unico && doc.startViewTransition && !reducido) {
            doc.startViewTransition(() => flushSync(cambiar));
        } else {
            cambiar();
        }
    };

    return (
        <ul ref={lista} className={`m-srv m-srv--${variante}`}>
            {SERVICIOS.map((s, i) => {
                const abierto = abiertos.includes(i);
                return (
                    <li
                        key={s.slug}
                        className={`m-srv-item m-srv-item--${i}${abierto ? ' is-open' : ''}`}
                        style={{ '--i': i, viewTransitionName: unico ? `srv-${s.slug}` : undefined } as CSSProperties}
                        data-rv
                    >
                        <h3 className="m-srv-h">
                            <button
                                type="button"
                                id={`srv-b-${s.slug}`}
                                className="m-srv-btn"
                                aria-expanded={abierto}
                                aria-controls={`srv-p-${s.slug}`}
                                onClick={() => tocar(i)}
                            >
                                <span className="m-srv-n">{dos(i + 1)}</span>
                                <span className="m-srv-corto" aria-hidden="true">
                                    {s.corto}
                                </span>
                                <span className="m-srv-nombre">{s.nombre}</span>
                                <span className="m-srv-precio-mini">{s.precio}</span>
                                <span className="m-srv-mas" aria-hidden="true">
                                    <i />
                                    <i />
                                </span>
                            </button>
                        </h3>
                        <div
                            id={`srv-p-${s.slug}`}
                            role="region"
                            aria-labelledby={`srv-b-${s.slug}`}
                            className="m-srv-panel"
                            inert={!abierto}
                        >
                            <div className="m-srv-panel-in">
                                <div className="m-srv-escena" data-i={i} aria-hidden="true">
                                    {abierto && (
                                        <Escena
                                            key={vueltas[i]}
                                            tipo={s.escena}
                                            tema={tema}
                                            run={abierto && visibles.includes(i) && !reducido}
                                        />
                                    )}
                                </div>
                                <p className="m-srv-texto">{s.texto}</p>
                                <ul className="m-chips m-srv-chips" aria-label="Incluye">
                                    {s.chips.map((c) => (
                                        <li key={c} className="m-chip">
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                                <div className="m-srv-pie">
                                    <span className="m-srv-precio">{s.precio}</span>
                                    <Boton
                                        href={whatsapp(`Hola Atlas 👋 Quiero cotizar: ${s.nombre}.`)}
                                        variante={tema === 'claro' && variante === 'filas' ? 'tinta' : 'rojo'}
                                        chico
                                        externo
                                    >
                                        Cotizar
                                    </Boton>
                                </div>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
