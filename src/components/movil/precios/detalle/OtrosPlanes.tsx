import { FlechaIzq, WhatsApp } from '../../iconos';
import { NOTA_LEGAL, PLANES, WSP_AYUDA } from '../planes';

/* D10 · «¿Buscabas otra cosa?»: el final de la pagina nunca es un callejon,
   pero tampoco repite. Antes eran los otros tres planes en tarjetas, con
   sus precios otra vez (Harley: contenido repetido); a otro plan ya se
   salta desde el selector del hero y desde «Mejor mira otro plan si…».
   Aqui quedan dos salidas en una sola fila cada una: volver a todos los
   planes o que te ayudemos a elegir. Y la nota legal, una sola vez en
   toda la pagina. */

export function OtrosPlanes() {
    return (
        <section className="pre-dt-sec pre-dt-otros" data-tono="oscuro" aria-labelledby="otros-t">
            <div className="m-wrap">
                {/* [CONFIRMAR copy con Harley] */}
                <h2 id="otros-t" className="pre-dt-h3" data-rv>
                    ¿Buscabas otra cosa?
                </h2>
                <a className="pre-dt-todos" href="/servicios#planes" data-rv>
                    <span className="pre-dt-todos-ir" aria-hidden="true">
                        <FlechaIzq />
                    </span>
                    <span className="pre-dt-todos-t">
                        <b>Todos los planes</b>
                        <small className="m-mono">{`${PLANES.length} planes`}</small>
                    </span>
                </a>
                <a className="pre-dt-ayuda" href={WSP_AYUDA} target="_blank" rel="noopener noreferrer" data-rv>
                    <WhatsApp />
                    <span>
                        ¿No sabes cuál? <u>Te ayudamos a elegir</u>
                    </span>
                    <span className="sr-only"> (abre WhatsApp)</span>
                </a>
                <p className="pre-dt-legal pre-dt-otros-legal" data-rv>
                    {NOTA_LEGAL}
                </p>
            </div>
        </section>
    );
}
