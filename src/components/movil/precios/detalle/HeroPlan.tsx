import { DETALLES, type Detalle } from '../planes';
import { Volver } from './Volver';

/* D1 · El hero del detalle (refs 34 y 35): la foto del rubro a sangre, en
   B/N, y el nombre del plan encima, abajo, donde el degradado ya es negro.

   Arriba, la orientacion: «‹» vuelve a la lista y el selector dice en cual
   de los cuatro planes estas y deja saltar a otro sin volver. El plan
   actual lleva una perilla hueso (view-transition-name: pre-perilla): al
   cambiar de plan, la perilla se desliza a su nueva posicion.

   El h1 va armado a mano y SIN la entrada palabra por palabra del Titular:
   su nombre (pre-plan-<slug>) es el que viaja desde la tarjeta de la lista,
   y la mascara de las palabras cortaria esa transicion. Entra con una
   animacion de CSS que no espera a JS (es el LCP junto con la foto).

   La foto es ambiente, no un cliente: alt vacio (ver planes.ts). */

export function HeroPlan({ d }: { d: Detalle }) {
    const { plan } = d;
    return (
        <section className="pre-dt-hero" data-tono="oscuro" aria-labelledby="plan-t">
            <div className="pre-dt-hero-foto" aria-hidden="true">
                <img src={d.foto.src} width={d.foto.w} height={d.foto.h} alt="" fetchPriority="high" decoding="async" style={{ objectPosition: d.foto.pos }} />
            </div>

            <div className="pre-dt-hero-ctl m-wrap">
                <Volver />
                <nav className="pre-dt-sel" aria-label="Planes">
                    <ul>
                        {DETALLES.map((o) => {
                            const actual = o.slug === d.slug;
                            return (
                                <li key={o.slug}>
                                    <a href={`/servicios/${o.slug}`} aria-current={actual ? 'page' : undefined}>
                                        {actual && <span className="pre-dt-sel-perilla" aria-hidden="true" style={{ viewTransitionName: 'pre-perilla' }} />}
                                        <span className="pre-dt-sel-t">{o.corto}</span>
                                        <span className="sr-only">{`: ${o.titulo}`}</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            <div className="pre-dt-hero-in m-wrap">
                <p className="pre-dt-hero-meta">
                    <b>{plan.entrega}</b>
                    <i aria-hidden="true" />
                    <span className="m-mono">Entrega</span>
                </p>
                <h1 id="plan-t" className="pre-dt-h1">
                    <span className="pre-dt-h1-nom" style={{ viewTransitionName: `pre-plan-${d.slug}` }}>
                        {plan.nombre}
                    </span>{' '}
                    <span className="pre-dt-h1-coda">{plan.coda}</span>
                </h1>
                <p className="pre-dt-hero-desc">{plan.descripcion}</p>
            </div>
        </section>
    );
}
