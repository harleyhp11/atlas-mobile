import type { CSSProperties } from 'react';
import './maqueta-web.css';

/* «Por dentro» de la Web corporativa: una web completa de verdad, en un
   navegador, recorrida de punta a punta (pedido de Harley: que se aprecie la
   web entera, con un diseño claro y llamativo, y no la escena generica).
   Bucle de 16 s, contado en el orden en que la vive un cliente:

     1. alguien busca en Google «inmobiliaria en surco» y la web sale primera,
        con sus enlaces internos; el cursor la abre;
     2. Inicio: el hero a todo lo ancho y, al bajar, los servicios;
     3. Proyectos (clic en el menu): la grilla con su filtro;
     4. Blog: se abre el panel, se escribe un articulo y «Publicar»; aparece
        arriba de la lista, marcado «Nuevo» (el blog que editas tu);
     5. Contacto: el correo con el dominio del negocio, el formulario y el
        mapa;
     6. al final, lo que ves tu: visitas de la semana y como te encontraron.

   Debajo, la guia marca en que pagina va. La direccion de la barra cambia
   con cada pagina. Todo es una MAQUETA: el negocio (Altura, inmobiliaria),
   los proyectos y las cifras son de ejemplo, y la pildora lo dice. Solo
   CSS con un reloj comun (--ciclo); `run` lo pausa. Con movimiento reducido
   queda el Inicio. */

const GUIA = ['Google', 'Inicio', 'Proyectos', 'Blog', 'Contacto', 'Visitas'];
const MENU = ['Inicio', 'Nosotros', 'Proyectos', 'Blog', 'Contacto'];
const PROYECTOS = [
    { n: 'Residencial Olivos', e: 'En venta', pos: '30% 40%' },
    { n: 'Torre Prado', e: 'Entregado', pos: '75% 20%' },
    { n: 'Casa Huerta', e: 'En venta', pos: '50% 80%' },
    { n: 'Mirador 21', e: 'Preventa', pos: '10% 60%' },
];

function Menu({ activo }: { activo: number }) {
    return (
        <nav className="pre-mw-nav">
            <b>
                <i />
                ALTURA
            </b>
            {MENU.map((m, k) => (
                <span key={m} data-on={k === activo ? '' : undefined}>
                    {m}
                </span>
            ))}
        </nav>
    );
}

export function MaquetaWeb({ run }: { run: boolean }) {
    return (
        <div className="pre-mw" data-run={run ? '' : undefined}>
            <div className="pre-mw-nave">
                {/* la barra del navegador, con la direccion que cambia */}
                <div className="pre-mw-barra">
                    <span className="pre-mw-luces">
                        <i />
                        <i />
                        <i />
                    </span>
                    <span className="pre-mw-url">
                        <span>google.com/search</span>
                        <span>altura.pe</span>
                        <span>altura.pe/proyectos</span>
                        <span>altura.pe/blog</span>
                        <span>altura.pe/contacto</span>
                    </span>
                </div>

                <div className="pre-mw-vista">
                    {/* 1 · Google */}
                    <div className="pre-mw-pg pre-mw-google">
                        <b className="pre-mw-g-logo">Google</b>
                        <span className="pre-mw-g-caja">
                            <span className="pre-mw-g-q">inmobiliaria en surco</span>
                        </span>
                        <div className="pre-mw-g-res">
                            <small>altura.pe</small>
                            <b>Altura Inmobiliaria · Departamentos en Surco</b>
                            <span>Proyectos en venta y entregados, con visitas guiadas. Agenda la tuya.</span>
                            <span className="pre-mw-g-links">
                                <i>Proyectos</i>
                                <i>Nosotros</i>
                                <i>Contacto</i>
                            </span>
                        </div>
                        <div className="pre-mw-g-res is-otro">
                            <small>otra-inmobiliaria.com</small>
                            <b>Departamentos en Lima</b>
                        </div>
                    </div>

                    {/* 2 · Inicio */}
                    <div className="pre-mw-pg pre-mw-inicio">
                        <Menu activo={0} />
                        <div className="pre-mw-baja">
                            <section className="pre-mw-hero">
                                <img src="/assets/movil/negocios/inmobiliaria.webp" alt="" loading="lazy" decoding="async" />
                                <div>
                                    <small>Inmobiliaria en Lima</small>
                                    <h4>
                                        Departamentos que se sienten <em>hogar.</em>
                                    </h4>
                                    <span className="pre-mw-btn">Ver proyectos</span>
                                </div>
                            </section>
                            <section className="pre-mw-serv">
                                <h5>Lo que hacemos</h5>
                                <div>
                                    {[
                                        ['01', 'Venta', 'Departamentos listos y en preventa.'],
                                        ['02', 'Asesoría', 'Te acompañamos con el crédito.'],
                                        ['03', 'Postventa', 'Seguimos contigo después de la entrega.'],
                                    ].map(([n, t, d]) => (
                                        <article key={n}>
                                            <i>{n}</i>
                                            <b>{t}</b>
                                            <span>{d}</span>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* 3 · Proyectos */}
                    <div className="pre-mw-pg pre-mw-proy">
                        <Menu activo={2} />
                        <div className="pre-mw-pad">
                            <h5>Proyectos</h5>
                            <span className="pre-mw-filtro">
                                <i data-on="">Todos</i>
                                <i>En venta</i>
                                <i>Entregados</i>
                            </span>
                            <div className="pre-mw-grilla">
                                {PROYECTOS.map((p, k) => (
                                    <article key={p.n} style={{ '--k': k } as CSSProperties}>
                                        <img src="/assets/movil/negocios/inmobiliaria.webp" alt="" loading="lazy" decoding="async" style={{ objectPosition: p.pos }} />
                                        <span>
                                            <b>{p.n}</b>
                                            <i>{p.e}</i>
                                        </span>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 4 · Blog, con el panel donde publicas tu */}
                    <div className="pre-mw-pg pre-mw-blog">
                        <Menu activo={3} />
                        <div className="pre-mw-pad">
                            <h5>Blog</h5>
                            <div className="pre-mw-posts">
                                <article className="is-nuevo">
                                    <i>Nuevo</i>
                                    <b>5 claves para comprar tu primer depa</b>
                                    <small>Hoy · 4 min</small>
                                </article>
                                <article>
                                    <b>¿Preventa o entrega inmediata?</b>
                                    <small>Hace 1 semana · 3 min</small>
                                </article>
                                <article>
                                    <b>Cómo se calcula la cuota inicial</b>
                                    <small>Hace 2 semanas · 5 min</small>
                                </article>
                            </div>
                        </div>
                        <aside className="pre-mw-panel">
                            <small>Tu panel · Nuevo artículo</small>
                            <span className="pre-mw-panel-campo">
                                <span className="pre-mw-panel-q">5 claves para comprar tu primer depa</span>
                            </span>
                            <span className="pre-mw-panel-lineas">
                                <i />
                                <i />
                                <i />
                            </span>
                            <span className="pre-mw-publicar">Publicar</span>
                        </aside>
                    </div>

                    {/* 5 · Contacto */}
                    <div className="pre-mw-pg pre-mw-contacto">
                        <Menu activo={4} />
                        <div className="pre-mw-pad pre-mw-cont">
                            <div>
                                <h5>Hablemos</h5>
                                <span className="pre-mw-correo">
                                    <i>@</i>hola@altura.pe
                                </span>
                                <small>Av. Primavera 1050, Surco</small>
                                <span className="pre-mw-mapa">
                                    <i />
                                </span>
                            </div>
                            <div className="pre-mw-form">
                                <span />
                                <span />
                                <span className="is-alto" />
                                <b>Enviar</b>
                            </div>
                        </div>
                    </div>

                    {/* 6 · lo que ves tu */}
                    <div className="pre-mw-datos">
                        <small>Esta semana en altura.pe</small>
                        <div className="pre-mw-datos-fila">
                            <b>1 284</b>
                            <span>visitas</span>
                            <svg viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
                                <path d="M0 26 L14 22 L28 24 L42 16 L56 18 L70 10 L84 12 L100 4" pathLength={1} />
                            </svg>
                        </div>
                        <small>Te encontraron buscando</small>
                        <span className="pre-mw-datos-q">«inmobiliaria en surco»</span>
                    </div>
                </div>

                <span className="pre-mw-cursor" aria-hidden="true">
                    <svg viewBox="0 0 16 20">
                        <path d="M1 1v15.5l4.2-3.9 2.7 5.9 2.6-1.2-2.7-5.8H14z" />
                    </svg>
                </span>
            </div>

            <ol className="pre-mw-guia">
                {GUIA.map((g, k) => (
                    <li key={g} style={{ '--k': k } as CSSProperties}>
                        {g}
                    </li>
                ))}
            </ol>
        </div>
    );
}
