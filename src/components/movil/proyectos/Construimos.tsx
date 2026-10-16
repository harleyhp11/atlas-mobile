'use client';

import { useState } from 'react';
import { anclar } from '../anclar';
import type { Proyecto } from './proyectos';

/* "Lo que construimos" de cada caso: los grupos de funciones en un
   acordeon de uno abierto, como servicios y preguntas. El primero arranca
   abierto para que se vea que hay contenido adentro. */

const dos = (n: number) => String(n).padStart(2, '0');
const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export function Construimos({ grupos }: { grupos: Proyecto['construimos'] }) {
    const [abierto, setAbierto] = useState<number | null>(0);
    return (
        <div className="caso-grupos">
            {grupos.map((g, i) => {
                const on = abierto === i;
                return (
                    <div key={g.titulo} className={`caso-grupo${on ? ' is-open' : ''}`}>
                        <h3 className="caso-grupo-h">
                            <button
                                type="button"
                                id={`cg-b-${i}`}
                                className="caso-grupo-btn"
                                aria-expanded={on}
                                aria-controls={`cg-p-${i}`}
                                onClick={(e) => {
                                    anclar(e.currentTarget);
                                    setAbierto((a) => (a === i ? null : i));
                                }}
                            >
                                <span className="caso-grupo-n m-mono">{dos(i + 1)}</span>
                                <span className="caso-grupo-t">{g.titulo}</span>
                                <span className="caso-grupo-mas" aria-hidden="true">
                                    <i />
                                    <i />
                                </span>
                            </button>
                        </h3>
                        <div id={`cg-p-${i}`} role="region" aria-labelledby={`cg-b-${i}`} className="caso-grupo-panel" inert={!on}>
                            <div className="caso-grupo-in">
                                <ul>
                                    {g.items.map((it) => (
                                        <li key={it.t}>
                                            <b>{it.t}</b>
                                            <span>{mayuscula(it.d)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
