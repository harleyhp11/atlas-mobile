import type { CSSProperties } from 'react';
import { FlechaAbajo } from '../iconos';
import { miniatura, numero, PROYECTOS } from './proyectos';

/* El indice del hero: los cinco de un vistazo, como una tabla de contenidos.
   Cada fila baja a la tarjeta de su proyecto. */

export function Indice() {
    return (
        <nav className="pry-indice" aria-label="Índice de proyectos">
            <ol>
                {PROYECTOS.map((p, i) => (
                    <li key={p.slug} data-rv style={{ '--d': `${0.15 + i * 0.07}s` } as CSSProperties}>
                        <a href={`#p-${p.slug}`}>
                            <img src={miniatura(p)} width={44} height={44} alt="" loading="lazy" decoding="async" />
                            <span className="pry-indice-n m-mono">{numero(p)}</span>
                            <span className="pry-indice-t">
                                <b>{p.titulo}</b>
                                <small className="m-mono">{p.rubro}</small>
                            </span>
                            <FlechaAbajo className="pry-indice-f" />
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
