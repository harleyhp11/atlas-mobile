import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Cabecera } from '@/components/movil/Cabecera';
import { Ceja } from '@/components/movil/Ceja';
import { Flecha } from '@/components/movil/iconos';
import { Revelador } from '@/components/movil/Revelador';
import { Titular } from '@/components/movil/Titular';
import { Construimos } from '@/components/movil/proyectos/Construimos';
import { Marco } from '@/components/movil/proyectos/Marco';
import { PieCompacto } from '@/components/movil/proyectos/PieCompacto';
import { MENU_PROYECTOS, numero, PROYECTOS } from '@/components/movil/proyectos/proyectos';
import '@/components/movil/proyectos/proyectos.css';
import '@/components/movil/proyectos/caso.css';

/* La ficha de cada proyecto en celular y tablet (/projects/[slug], por el
   proxy). En el escritorio estas fichas son tecnicas —bitacora, comandos de
   instalacion— y no tienen cabecera; aqui son un caso contado para un
   cliente:
     · que es, con su captura y, si esta en linea, el boton para abrirlo;
     · la ficha (rol, tiempo, equipo, rubro);
     · el proyecto en un parrafo;
     · lo que construimos, en una isla clara;
     · los retos y como se resolvieron;
     · con que se hizo;
     · el siguiente proyecto, para seguir de uno a otro.
   Lo que no se sabe de un proyecto (Perú Travel) simplemente no aparece. */

type Props = { params: Promise<{ slug: string }> };

const dos = (n: number) => String(n).padStart(2, '0');
const buscar = (slug: string) => PROYECTOS.find((p) => p.slug === slug);

export const dynamicParams = false;

export function generateStaticParams() {
    return PROYECTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const p = buscar((await params).slug);
    if (!p) return {};
    return {
        title: p.titulo,
        description: p.linea,
        alternates: { canonical: `/projects/${p.slug}` },
    };
}

export default async function CasoMovil({ params }: Props) {
    const p = buscar((await params).slug);
    if (!p) notFound();
    const siguiente = PROYECTOS[(PROYECTOS.indexOf(p) + 1) % PROYECTOS.length];
    const ficha = [
        ['Rol', p.rol],
        ['Tiempo', p.tiempo],
        ['Equipo', p.equipo],
        ['Rubro', p.rubro],
    ].filter((d): d is [string, string] => Boolean(d[1]));
    let n = 0;
    const seccion = () => dos(++n);

    return (
        <>
            <a className="m-salto" href="#m-contenido">
                Saltar al contenido
            </a>
            <Cabecera enlaces={MENU_PROYECTOS} />
            <main id="m-contenido" className="caso">
                {/* ------------------------------------------------ el hero */}
                <section className="caso-hero" data-tono="oscuro" aria-labelledby="caso-t">
                    <div className="m-wrap">
                        <a className="caso-volver" href="/projects">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M19 12H5m6-6-6 6 6 6" />
                            </svg>
                            Proyectos
                        </a>
                        <p className="caso-meta m-mono" data-rv>
                            <span>
                                {numero(p)} / {dos(PROYECTOS.length)}
                            </span>
                            <span>{p.rubro}</span>
                        </p>
                        <Titular as="h1" id="caso-t" className="m-h1 caso-t" texto={p.titulo} />
                        <p className="caso-linea" data-rv>
                            {p.linea}
                        </p>
                        <ul className="caso-chips" data-rv>
                            {p.etiqueta && <li className="is-etiqueta">{p.etiqueta}</li>}
                            {p.estado && (
                                <li className={p.estado.vivo ? 'is-vivo' : undefined}>
                                    <i aria-hidden="true" />
                                    {p.estado.texto}
                                </li>
                            )}
                            <li>{p.tiempo}</li>
                        </ul>
                    </div>
                    <div className="caso-foto">
                        <Marco p={p} prioridad />
                    </div>
                    {p.url && (
                        <div className="m-wrap caso-acciones" data-rv>
                            <a className="m-btn m-btn--claro" href={p.url} target="_blank" rel="noopener noreferrer">
                                <span>
                                    Ver {p.titulo} en vivo
                                    <span className="sr-only"> (se abre en otra pestaña)</span>
                                </span>
                                <span className="m-btn-chip" aria-hidden="true">
                                    <Flecha />
                                    <Flecha />
                                </span>
                            </a>
                        </div>
                    )}
                </section>

                {/* ------------------------------------------------ la ficha */}
                <section className="m-wrap caso-ficha" aria-label="Ficha del proyecto">
                    <dl>
                        {ficha.map(([k, v]) => (
                            <div key={k} className="caso-dato" data-rv>
                                <dt className="m-mono">{k}</dt>
                                <dd>{v}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* ---------------------------------------------- el proyecto */}
                <section className="caso-seccion" aria-labelledby="caso-resumen-t">
                    <div className="m-wrap">
                        <Ceja n={seccion()}>El proyecto</Ceja>
                        <Titular id="caso-resumen-t" className="m-h2 caso-h2" texto="De qué se trata." destacar="trata." />
                        <p className="caso-resumen" data-rv>
                            {p.resumen}
                        </p>
                    </div>
                </section>

                {/* ------------------------------------- lo que construimos */}
                <div className="caso-isla m-claro" data-tono="claro">
                    <section aria-labelledby="caso-construimos-t">
                        <div className="m-wrap">
                            <Ceja n={seccion()}>Lo que construimos</Ceja>
                            <Titular id="caso-construimos-t" className="m-h2 caso-h2" texto="Pieza por pieza." destacar="pieza." />
                            <ul className="caso-destacados" aria-label="Lo más destacado" data-rv>
                                {p.destacados.map((d) => (
                                    <li key={d}>{d}</li>
                                ))}
                            </ul>
                            <Construimos grupos={p.construimos} />
                        </div>
                    </section>
                </div>

                {/* --------------------------------------------------- retos */}
                {p.retos && (
                    <section className="caso-seccion" aria-labelledby="caso-retos-t">
                        <div className="m-wrap">
                            <Ceja n={seccion()}>Retos</Ceja>
                            <Titular id="caso-retos-t" className="m-h2 caso-h2" texto="Lo difícil, resuelto." destacar="resuelto." />
                            <ol className="caso-retos">
                                {p.retos.map((r, k) => (
                                    <li key={k} className="caso-reto" data-rv>
                                        <p className="caso-reto-n m-mono">Reto {dos(k + 1)}</p>
                                        <h3 className="caso-reto-t">{r.problema}</h3>
                                        <div className="caso-reto-sol">
                                            <p className="m-mono">
                                                <i aria-hidden="true" />
                                                Cómo lo resolvimos
                                            </p>
                                            <p>{r.solucion}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </section>
                )}

                {/* --------------------------------------------------- stack */}
                {p.stack && (
                    <section className="caso-seccion" aria-labelledby="caso-stack-t">
                        <div className="m-wrap">
                            <Ceja n={seccion()}>Stack</Ceja>
                            <Titular id="caso-stack-t" className="m-h2 caso-h2" texto="Con qué lo hicimos." destacar="hicimos." />
                            <div className="caso-stack" data-rv>
                                <p className="m-mono">Base</p>
                                <ul>
                                    {p.stack.base.map((t) => (
                                        <li key={t}>{t}</li>
                                    ))}
                                </ul>
                                <p className="m-mono">Herramientas</p>
                                <ul>
                                    {p.stack.herramientas.map((t) => (
                                        <li key={t}>{t}</li>
                                    ))}
                                </ul>
                            </div>
                            {p.codigo && (
                                <a className="caso-codigo" href={p.codigo} target="_blank" rel="noopener noreferrer">
                                    Ver el código en GitHub
                                    <span className="sr-only"> (se abre en otra pestaña)</span>
                                    <Flecha />
                                </a>
                            )}
                        </div>
                    </section>
                )}

                {/* --------------------------------------- el siguiente caso */}
                <section className="caso-seccion caso-sig" aria-labelledby="caso-sig-t">
                    <div className="m-wrap">
                        <p className="caso-sig-ceja m-mono">Siguiente proyecto</p>
                        <a className="caso-sig-a" href={`/projects/${siguiente.slug}`} data-activa>
                            <Marco p={siguiente} />
                            <span className="caso-sig-cab">
                                <span>
                                    <b id="caso-sig-t">{siguiente.titulo}</b>
                                    <small className="m-mono">{siguiente.rubro}</small>
                                </span>
                                <span className="caso-sig-chip" aria-hidden="true">
                                    <Flecha />
                                </span>
                            </span>
                        </a>
                        <a className="caso-todos" href="/projects">
                            Ver todos los proyectos
                        </a>
                    </div>
                </section>
            </main>
            <PieCompacto />
            <Revelador />
        </>
    );
}
