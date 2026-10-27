'use client';

import { useState } from 'react';
import { Flecha } from '../iconos';
import { Marco } from './Marco';
import { numero, PROYECTOS, SERVICIOS_FILTRO, type Proyecto, type Servicio } from './proyectos';

/* Los proyectos en tarjetas, con filtro por servicio.

   Cada tarjeta es un solo enlace (el titulo, estirado sobre toda la
   tarjeta): asi el lector de pantalla no oye tres veces el mismo destino.
   Solo "Abrir" —el sitio en linea— es un enlace aparte, por encima.

   La captura va en gris y pasa a color cuando la tarjeta cruza el centro
   de la pantalla (data-activa, lo marca Revelador). Filtrar no saca las
   tarjetas del DOM: las pliega (data-oculta) y las deja inertes, para que
   el cambio se anime y nadie llegue a ellas con el teclado. */

type Filtro = Servicio | 'todos';

const FILTROS: { id: Filtro; label: string }[] = [{ id: 'todos', label: 'Todos' }, ...SERVICIOS_FILTRO];

const dos = (n: number) => String(n).padStart(2, '0');
const entra = (p: Proyecto, f: Filtro) => f === 'todos' || p.servicios.includes(f);

export function Lista() {
    const [filtro, setFiltro] = useState<Filtro>('todos');
    const visibles = PROYECTOS.filter((p) => entra(p, filtro)).length;

    return (
        <section className="pry-lista m-claro" data-tono="claro" aria-labelledby="pry-lista-t">
            <div className="m-wrap">
                <div className="pry-lista-cab">
                    <h2 id="pry-lista-t" className="pry-lista-t">
                        Todos los proyectos
                    </h2>
                    <p className="pry-cuenta m-mono" aria-live="polite">
                        <b>{dos(visibles)}</b> / {dos(PROYECTOS.length)}
                    </p>
                </div>

                <div className="pry-filtros" role="group" aria-label="Filtrar por servicio">
                    {FILTROS.map((f) => {
                        const n = PROYECTOS.filter((p) => entra(p, f.id)).length;
                        return (
                            <button key={f.id} type="button" className="pry-filtro" aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
                                {f.label}
                                <small>{n}</small>
                            </button>
                        );
                    })}
                </div>

                <ol className="pry-tarjetas">
                    {PROYECTOS.map((p) => {
                        const oculta = !entra(p, filtro);
                        return (
                            <li key={p.slug} id={`p-${p.slug}`} className="pry-item" data-oculta={oculta ? '' : undefined} inert={oculta}>
                                <div className="pry-item-in">
                                    <Tarjeta p={p} />
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}

function Tarjeta({ p }: { p: Proyecto }) {
    const caso = `/projects/${p.slug}`;
    return (
        <article className="pry-tarjeta" data-activa>
            <div className="pry-tarjeta-foto">
                <Marco p={p} />
                {p.estado && (
                    <span className={`pry-estado${p.estado.vivo ? ' is-vivo' : ''}`}>
                        <i aria-hidden="true" />
                        {p.estado.texto}
                    </span>
                )}
                {p.etiqueta && <span className="pry-etiqueta m-mono">{p.etiqueta}</span>}
            </div>
            <p className="pry-tarjeta-meta m-mono">
                <span>{p.rubro}</span>
                <span>{p.tiempo}</span>
            </p>
            <div className="pry-tarjeta-cab">
                <h3 className="pry-tarjeta-t">
                    <a className="pry-tarjeta-a" href={caso}>
                        {p.titulo}
                    </a>
                </h3>
                <span className="pry-tarjeta-n" aria-hidden="true">
                    {numero(p)}
                </span>
            </div>
            <p className="pry-tarjeta-p">{p.linea}</p>
            <ul className="pry-chips" aria-label="Lo más destacado">
                {p.destacados.map((d) => (
                    <li key={d}>{d}</li>
                ))}
            </ul>
            <div className="pry-tarjeta-pie">
                <span className="pry-ver" aria-hidden="true">
                    Ver caso
                    <span className="pry-ver-chip">
                        <Flecha />
                    </span>
                </span>
                {p.url && (
                    <a className="pry-abrir" href={p.url} target="_blank" rel="noopener noreferrer">
                        Abrir el sitio
                        <span className="sr-only"> de {p.titulo} (se abre en otra pestaña)</span>
                        <Flecha />
                    </a>
                )}
            </div>
        </article>
    );
}
