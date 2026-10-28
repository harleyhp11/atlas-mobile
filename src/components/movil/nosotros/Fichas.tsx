import { Fragment, type CSSProperties } from 'react';
import { Boton } from '../Boton';
import { Firma } from '../Firma';
import { LinkedIn, Mas } from '../iconos';
import { FIGMA, FRAMER } from '../logos';
import { TintaAnodizada } from '../TintaAnodizada';
import { Titular } from '../Titular';
import { PROYECTOS } from '../proyectos/proyectos';
import { Carrusel, type ItemCarrusel } from './Carrusel';
import { CARRUSEL_HARLEY, EQUIPO, type Persona } from './equipo';
import { Sistema } from './Sistema';

/* Las dos fichas sobre negro: la foto 4:5 con su cargo y el autografo rojo,
   y encima una hoja de vidrio con el nombre, lo que hace (tres verbos, sin
   cifras), sus habilidades, su pieza propia —los proyectos de Harley, el
   diagrama de Benjamin— y las acciones (CV y redes). Entre las dos, el «+». */

// los proyectos del carrusel, resueltos aqui en el servidor
const ITEMS: ItemCarrusel[] = CARRUSEL_HARLEY.flatMap((slug) => {
    const p = PROYECTOS.find((x) => x.slug === slug);
    return p && p.rol ? [{ slug, titulo: p.titulo, rol: p.rol }] : [];
});

function LogoChip({ logo }: { logo: 'figma' | 'framer' }) {
    if (logo === 'figma') {
        return (
            <svg className="nos-chip-figma" viewBox="0 0 38 57" aria-hidden="true">
                {FIGMA.map((p) => (
                    <path key={p.d} d={p.d} fill={p.c} />
                ))}
            </svg>
        );
    }
    return (
        <svg className="nos-chip-framer" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            {FRAMER.map((d) => (
                <path key={d} d={d} />
            ))}
        </svg>
    );
}

function Github() {
    return (
        <svg width={18} height={18} fill="currentColor" aria-hidden="true">
            <use href="/assets/movil/stack.svg#github" />
        </svg>
    );
}

function Ficha({ p }: { p: Persona }) {
    const h = p.id === 'harley';
    const nVerbos = p.verbos.length;
    return (
        <article id={p.id} className={`nos-ficha ${h ? 'is-h' : 'is-b'}`} data-in aria-labelledby={`${p.id}-t`}>
            <figure className="nos-ficha-foto" data-rv="img">
                <img
                    src={p.ficha.src}
                    width={p.ficha.w}
                    height={p.ficha.h}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: p.ficha.pos }}
                />
                <span className="nos-pildora">
                    <i className="m-ping" aria-hidden="true" />
                    <span className="m-mono">{p.pildora}</span>
                </span>
                <span className="nos-ficha-firma" aria-hidden="true">
                    <Firma texto={p.nombre} />
                </span>
            </figure>

            <div className="nos-vidrio">
                <Titular as="h3" id={`${p.id}-t`} className="nos-nombre" texto={p.nombreCompleto} retraso={0.35} />
                <p className="nos-bio">{p.bio}</p>

                <ul className="nos-verbos">
                    {p.verbos.map(([v, c], i) => (
                        <li key={v} style={{ '--i': i } as CSSProperties}>
                            <b>{v}</b>
                            <span>{c}</span>
                        </li>
                    ))}
                </ul>

                <ul className="m-chips nos-chips" aria-label={`Habilidades de ${p.nombre}`}>
                    {p.chips.map((c, i) => (
                        <li key={c.t} className="m-chip" style={{ '--i': nVerbos + i } as CSSProperties}>
                            {c.logo && <LogoChip logo={c.logo} />}
                            {c.t}
                        </li>
                    ))}
                </ul>

                {/* herramientas concretas: solo si estan confirmadas (equipo.ts) */}
                {p.herramientas.length > 0 && (
                    <ul className="m-chips nos-chips nos-herramientas" aria-label={`Herramientas de ${p.nombre}`}>
                        {p.herramientas.map((t) => (
                            <li key={t} className="m-chip">
                                {t}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="nos-pieza">{h ? <Carrusel items={ITEMS} /> : <Sistema />}</div>

                <div className="nos-acciones">
                    {p.cv ? (
                        <Boton variante="claro" chico href={p.cv} externo aviso=" (PDF, abre en otra pestaña)" className="nos-cv">
                            Ver CV<span className="sr-only"> de {p.nombreCompleto}</span>
                        </Boton>
                    ) : (
                        <Boton variante="claro" chico pendiente className="nos-cv">
                            Ver CV<span className="sr-only"> de {p.nombreCompleto}</span>
                        </Boton>
                    )}
                    {p.linkedin ? (
                        <a
                            className="nos-red"
                            href={p.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`LinkedIn de ${p.nombreCompleto} (abre en otra pestaña)`}
                        >
                            <LinkedIn />
                        </a>
                    ) : (
                        <span className="nos-red" role="link" aria-disabled="true" data-pendiente="" aria-label={`LinkedIn de ${p.nombreCompleto} (pronto)`}>
                            <LinkedIn />
                        </span>
                    )}
                    {p.github && (
                        <a
                            className="nos-red"
                            href={p.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`GitHub de ${p.nombreCompleto} (abre en otra pestaña)`}
                        >
                            <Github />
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}

export function Fichas() {
    return (
        <section className="nos-fichas" data-tono="oscuro" aria-labelledby="fichas-t">
            <h2 id="fichas-t" className="sr-only">
                Quiénes somos
            </h2>
            <div className="nos-fichas-in">
                {EQUIPO.map((p, i) => (
                    <Fragment key={p.id}>
                        {i > 0 && (
                            <div className="nos-union" data-rv aria-hidden="true">
                                {/* el mismo fondo que el boton de WhatsApp */}
                                <TintaAnodizada escala={1.8} />
                                <Mas />
                            </div>
                        )}
                        <Ficha p={p} />
                    </Fragment>
                ))}
            </div>
        </section>
    );
}
