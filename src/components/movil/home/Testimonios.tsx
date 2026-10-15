import type { CSSProperties } from 'react';
import { Ceja } from '../Ceja';
import { Titular } from '../Titular';
import './testimonios.css';

/* (06) Testimonios — cinta continua y ligeramente oblicua de tarjetas.

   La tarjeta es la de "testimonials-3" (Efferd/21st) pasada a CSS propio
   —la home movil no carga Tailwind ni shadcn—: lineas de marco que se pasan
   de las esquinas, la cruz en la esquina, comillas de trazo fino, avatar
   con anillo, nombre y cargo. El escalonado del original (cada tarjeta mas
   abajo que la anterior) aqui es la cinta entera inclinada unos grados con
   las tarjetas enderezadas: asi el bucle cierra sin costura.

   Son las mismas cuatro citas del escritorio (TestimonialsSection). OJO: alli
   estan marcadas como BORRADORES de Atlas que cada cliente tiene que
   aprobar. Sin fotos de las personas: el avatar lleva la inicial. */

type Testimonio = { cita: string; nombre: string; cargo: string; empresa: string };

const TESTIMONIOS: Testimonio[] = [
    {
        cita: 'Atlas entendió lo que queríamos transmitir con REGO. Hoy la web es nuestra mejor carta de presentación.',
        nombre: 'José Reátegui',
        cargo: 'Dueño de hotel y bienes raíces',
        empresa: 'REGO Premium',
    },
    {
        cita: 'Atlas convirtió NEFIN en una experiencia inmersiva, con un diseño que se siente vivo.',
        nombre: 'Robert SC',
        cargo: 'CEO',
        empresa: 'NEFIN',
    },
    {
        cita: 'Una estructura rápida, clara y pensada para cada paso del usuario.',
        nombre: 'Luis P.',
        cargo: 'Co-Founder',
        empresa: 'WorkUP',
    },
    {
        cita: 'Una web clara, moderna y que se siente premium. Justo la imagen que Reachwise necesitaba.',
        nombre: 'Carlos C.',
        cargo: 'CEO',
        empresa: 'Reachwise',
    },
];

function Comillas() {
    return (
        <svg className="h-testi-comillas" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </svg>
    );
}

function Tarjeta({ t, oculta }: { t: Testimonio; oculta?: boolean }) {
    return (
        <figure className="h-testi-carta" aria-hidden={oculta || undefined}>
            <i className="h-testi-linea h-testi-linea--izq" />
            <i className="h-testi-linea h-testi-linea--der" />
            <i className="h-testi-linea h-testi-linea--arr" />
            <i className="h-testi-linea h-testi-linea--aba" />
            <svg className="h-testi-cruz" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M12 5v14" />
            </svg>

            <blockquote className="h-testi-cita">
                <Comillas />
                <p>{t.cita}</p>
            </blockquote>

            <figcaption className="h-testi-quien">
                <span className="h-testi-avatar" aria-hidden="true">
                    {t.nombre.charAt(0)}
                </span>
                <span className="h-testi-datos">
                    <cite>{t.nombre}</cite>
                    <span>
                        {t.cargo}, <b>{t.empresa}</b>
                    </span>
                </span>
            </figcaption>
        </figure>
    );
}

export function Testimonios() {
    return (
        <section id="testimonios" className="h-testi" data-tono="oscuro" aria-labelledby="testimonios-t">
            <div className="m-wrap">
                <Ceja n="06">Testimonios</Ceja>
                <Titular id="testimonios-t" className="m-h2 h-testi-h2" texto="Lo que dicen de nosotros." destacar="nosotros." />
            </div>

            <div className="h-testi-marco" data-loop>
                <div className="h-testi-inclinada">
                    <div className="h-testi-pista" style={{ '--n': TESTIMONIOS.length } as CSSProperties}>
                        {/* dos copias: la segunda solo cierra el bucle */}
                        {[0, 1].map((copia) => (
                            <div key={copia} className="h-testi-grupo" role={copia === 0 ? 'list' : undefined}>
                                {TESTIMONIOS.map((t) => (
                                    <div key={t.nombre} role={copia === 0 ? 'listitem' : undefined} className="h-testi-hueco">
                                        <Tarjeta t={t} oculta={copia === 1} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
