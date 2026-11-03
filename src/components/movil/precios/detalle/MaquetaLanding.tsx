import type { CSSProperties } from 'react';
import { Contraste, type Par } from './Contraste';
import './maqueta-landing.css';

/* «Por dentro» de la Landing page: una landing de verdad, entera, en un
   celular (pedido de Harley: que el cliente la vea y diga «algo asi quiero»).
   En vez de la escena generica del navegador, cuenta el recorrido completo
   en un bucle de 15 s:

     1. el anuncio en Instagram; el dedo toca «Más información»;
     2. se abre la landing: la oferta con su boton;
     3. la pagina baja sola por sus partes: beneficios, la prueba (una
        opinion y fotos), las dudas (una se abre) y el formulario;
     4. se llenan nombre y WhatsApp, el dedo toca «Quiero mi semana»;
     5. «¡Listo, Ana!» en el celular y, afuera, el aviso que te llega a ti:
        un contacto nuevo, desde tu landing.

   A la derecha, la guia marca en que parte va y, debajo, lo que el cliente
   hace hoy (el link en bio, el Excel) contra lo que cambia. La guia marca (las mismas partes de la hoja
   de abajo). Todo es una MAQUETA: el negocio (Kora, un gimnasio), las personas
   y la opinion son de ejemplo, y la pildora «Maqueta de ejemplo» lo dice.
   Solo CSS (un reloj comun, --ciclo); `run` pausa todo fuera de pantalla o
   con la pausa del reproductor. Con movimiento reducido queda la oferta. */

// lo que el cliente hace hoy, contra lo que cambia con una landing: una
// tarjeta por tramo, debajo de la guia (pedido de Harley, como en la
// tienda). [CONFIRMAR copy con Harley]
const ANTES: Par[] = [
    { antes: 'Link en bio', ia: 'bio', ahora: 'Una página', ib: 'pagina' },
    { antes: 'Mil mensajes', ia: 'chat', ahora: 'Todo claro', ib: 'claro' },
    { antes: 'Mismas dudas', ia: 'dudas', ahora: 'Ya resueltas', ib: 'claro' },
    { antes: 'Hoja de Excel', ia: 'excel', ahora: 'A tu correo', ib: 'correo' },
];

const GUIA = ['La oferta', 'Beneficios', 'La prueba', 'Las dudas', 'Formulario', 'Te llega'];

export function MaquetaLanding({ run }: { run: boolean }) {
    return (
        <div className="pre-ml" data-run={run ? '' : undefined}>
            <div className="pre-ml-tel">
                <span className="pre-ml-isla" />
                <div className="pre-ml-pantalla">
                    {/* 2–4 · la landing, que baja sola */}
                    <div className="pre-ml-pagina">
                        <section className="pre-ml-hero">
                            <img src="/assets/movil/negocios/gimnasio.webp" alt="" loading="lazy" decoding="async" />
                            <div className="pre-ml-nav">
                                <b>KORA</b>
                                <span>Training</span>
                            </div>
                            <div className="pre-ml-hero-in">
                                <span className="pre-ml-sello">Cupos limitados</span>
                                <h4>
                                    Tu primera semana de gym, <em>gratis.</em>
                                </h4>
                                <p>Equipos nuevos y un coach que arma tu rutina contigo.</p>
                                <span className="pre-ml-cta">Reservar mi semana</span>
                                <span className="pre-ml-google">★★★★★ 4,9 en Google</span>
                            </div>
                        </section>

                        <section className="pre-ml-sec">
                            <h5>Por qué Kora</h5>
                            {[
                                ['◎', 'Un coach para ti', 'Te arma la rutina y la ajusta cada mes.'],
                                ['✦', 'Equipos nuevos', 'Pesas, máquinas y zona de cardio.'],
                                ['◷', 'De 6 a. m. a 11 p. m.', 'Entrena a la hora que te acomode.'],
                            ].map(([ic, t, d]) => (
                                <div key={t} className="pre-ml-ben">
                                    <i>{ic}</i>
                                    <span>
                                        <b>{t}</b>
                                        {d}
                                    </span>
                                </div>
                            ))}
                        </section>

                        <section className="pre-ml-sec">
                            <h5>Lo que dicen</h5>
                            <div className="pre-ml-opinion">
                                <span className="pre-ml-estrellas">★★★★★</span>
                                <p>«En un mes ya noté el cambio. El coach te sigue de verdad.»</p>
                                <small>Lucía · socia desde marzo</small>
                            </div>
                            <div className="pre-ml-fotos">
                                <img src="/assets/movil/negocios/gimnasio-mini.webp" alt="" loading="lazy" decoding="async" />
                                <img src="/assets/movil/negocios/gimnasio.webp" alt="" loading="lazy" decoding="async" />
                                <img src="/assets/movil/negocios/gimnasio-mini.webp" alt="" loading="lazy" decoding="async" />
                            </div>
                        </section>

                        <section className="pre-ml-sec">
                            <h5>Preguntas</h5>
                            <div className="pre-ml-duda is-abre">
                                <b>¿Necesito experiencia?</b>
                                <span>No: la primera semana el coach te enseña todo desde cero.</span>
                            </div>
                            <div className="pre-ml-duda">
                                <b>¿Qué tengo que llevar?</b>
                            </div>
                            <div className="pre-ml-duda">
                                <b>¿Dónde quedan?</b>
                            </div>
                        </section>

                        <section className="pre-ml-sec pre-ml-form">
                            <h5>Tu semana gratis</h5>
                            <label>
                                Nombre
                                <span className="pre-ml-campo">
                                    <span className="pre-ml-tecleo" style={{ '--n': 3 } as CSSProperties}>
                                        Ana
                                    </span>
                                </span>
                            </label>
                            <label>
                                WhatsApp
                                <span className="pre-ml-campo">
                                    <span className="pre-ml-tecleo pre-ml-tecleo--2" style={{ '--n': 11 } as CSSProperties}>
                                        999 888 777
                                    </span>
                                </span>
                            </label>
                            <span className="pre-ml-enviar">
                                <span>Quiero mi semana</span>
                                <span>Enviando…</span>
                            </span>
                            <small>Te escribimos el mismo día.</small>
                        </section>
                    </div>

                    {/* 1 · el anuncio que la trae */}
                    <div className="pre-ml-anuncio">
                        <div className="pre-ml-ig">
                            <i />
                            <span>
                                <b>kora.training</b>
                                Publicidad
                            </span>
                        </div>
                        <img src="/assets/movil/negocios/gimnasio.webp" alt="" loading="lazy" decoding="async" />
                        <span className="pre-ml-ig-cta">Más información ›</span>
                        <p>
                            <b>kora.training</b> Tu primera semana, gratis. Cupos limitados.
                        </p>
                    </div>

                    {/* 5 · listo */}
                    <div className="pre-ml-exito">
                        <span className="pre-ml-check">✓</span>
                        <b>¡Listo, Ana!</b>
                        <span>Te escribimos hoy para agendar tu primera visita.</span>
                    </div>
                </div>
                <span className="pre-ml-dedo" />
            </div>

            {/* la guia: en que parte de la landing va */}
            <ol className="pre-ml-guia">
                {GUIA.map((g, k) => (
                    <li key={g} style={{ '--k': k } as CSSProperties}>
                        <i>{String(k + 1).padStart(2, '0')}</i>
                        {g}
                    </li>
                ))}
            </ol>

            {/* el problema de hoy, tachado, y lo que cambia */}
            {ANTES.map((a, k) => (
                <Contraste key={a.antes} {...a} className={`pre-ml-antes pre-ml-antes--${k}`} />
            ))}

            {/* el aviso que te llega a ti */}
            <div className="pre-ml-aviso">
                <span className="pre-ml-aviso-ic">@</span>
                <span>
                    <b>Nuevo contacto</b>
                    Ana · 999 888 777
                    <small>desde tu landing · ahora</small>
                </span>
            </div>
        </div>
    );
}
