import { FlechaIzq, WhatsApp } from '../../iconos';
import { Titular } from '../../Titular';
import { TarjetaPlan } from '../comun/TarjetaPlan';
import { otros, PLANES, WSP_AYUDA, type Detalle } from '../planes';

/* D10 · «¿Buscabas otra cosa?»: el final de la pagina nunca es un callejon.
   Los otros tres planes con las mismas tarjetas de la lista (mismo
   material, mismo precio), mas una cuarta que vuelve a todos los planes, y
   debajo la salida para quien sigue sin saber: que le ayudemos a elegir.

   Las tarjetas llevan su view-transition-name: al tocar una, su nombre
   viaja hasta el h1 del plan nuevo. */

export function OtrosPlanes({ d }: { d: Detalle }) {
    return (
        <section className="pre-dt-sec pre-dt-otros" data-tono="oscuro" aria-labelledby="otros-t">
            <div className="m-wrap">
                <Titular id="otros-t" className="pre-dt-t" texto="¿Buscabas otra cosa?" destacar="otra" />
                <div className="pre-dt-otros-grilla">
                    {otros(d).map((o, k) => (
                        <TarjetaPlan key={o.slug} d={o} tam="cuadro" revelar retraso={k * 0.07} />
                    ))}
                    <a className="pre-dt-todos" href="/servicios#planes" data-rv style={{ '--d': '.21s' } as React.CSSProperties}>
                        <span className="pre-dt-todos-ir" aria-hidden="true">
                            <FlechaIzq />
                        </span>
                        <span className="pre-dt-todos-t">
                            <b>Todos los planes</b>
                            <small className="m-mono">{`${PLANES.length} planes`}</small>
                        </span>
                    </a>
                </div>
                <a className="pre-dt-ayuda" href={WSP_AYUDA} target="_blank" rel="noopener noreferrer" data-rv>
                    <WhatsApp />
                    {/* [CONFIRMAR copy con Harley] */}
                    <span>
                        ¿No sabes cuál? <u>Te ayudamos a elegir</u>
                    </span>
                    <span className="sr-only"> (abre WhatsApp)</span>
                </a>
            </div>
        </section>
    );
}
