import { Flecha } from '../../iconos';
import { Titular } from '../../Titular';
import { Marco } from '../../proyectos/Marco';
import { PROYECTOS } from '../../proyectos/proyectos';
import type { Detalle } from '../planes';

/* D8 · «Algo parecido que hicimos.»: un proyecto real de Atlas del mismo
   tipo, para ver el plan hecho realidad. La tarjeta entera lleva a su caso
   (/projects/[slug]) y su captura pasa de gris a color al cruzar el centro
   de la pantalla (data-activa → .is-activa de Revelador), igual que en la
   lista de proyectos.

   NUNCA se dice con que plan ni a que precio se hizo: no es dato. Las
   etiquetas son las del proyecto (Cliente / Producto propio y su estado:
   «Terminado», «Prototipo», «En curso»); si el proyecto no las tiene,
   simplemente no aparecen. */

export function Parecido({ d }: { d: Detalle }) {
    const p = PROYECTOS.find((x) => x.slug === d.proyecto)!;
    const chips = [p.etiqueta, p.estado?.texto].filter(Boolean) as string[];
    return (
        <section className="pre-dt-sec pre-dt-par-sec" data-tono="oscuro" aria-labelledby="parecido-t">
            <div className="m-wrap">
                <Titular id="parecido-t" className="pre-dt-t" texto="Algo parecido que hicimos." destacar="hicimos." />
                <p className="pre-dt-bajada" data-rv>
                    {d.proyectoLinea}
                </p>

                <a className="pre-dt-par" href={`/projects/${p.slug}`} data-activa data-rv>
                    {/* lo visible va oculto al lector: el enlace se lee una sola
                        vez, con la frase de abajo */}
                    <div className="pre-dt-par-vista" aria-hidden="true">
                        <Marco p={p} />
                    </div>
                    <span className="pre-dt-par-pie" aria-hidden="true">
                        <span className="pre-dt-par-txt">
                            <b>{p.titulo}</b>
                            <small className="m-mono">{p.rubro}</small>
                            {chips.length > 0 && (
                                <span className="pre-dt-par-chips">
                                    {chips.map((c) => (
                                        <span key={c} className="m-chip">
                                            {c}
                                        </span>
                                    ))}
                                </span>
                            )}
                        </span>
                        <span className="pre-dt-par-ir" aria-hidden="true">
                            <Flecha />
                        </span>
                    </span>
                    <span className="sr-only">{`Ver el caso de ${p.titulo}: ${[p.rubro, ...chips].join(', ').toLowerCase()}.`}</span>
                </a>
            </div>
        </section>
    );
}
