import type { Metadata } from 'next';
import { Boton } from '@/components/movil/Boton';
import { Cabecera } from '@/components/movil/Cabecera';
import { Ceja } from '@/components/movil/Ceja';
import { Cintas } from '@/components/movil/Cintas';
import { PERDIDAS, PROBLEMA, PROMESAS, whatsapp } from '@/components/movil/datos';
import { Revelador } from '@/components/movil/Revelador';
import { Servicios } from '@/components/movil/Servicios';
import { Titular } from '@/components/movil/Titular';
import { HeroCine } from '@/components/movil/lab/HeroCine';
import { Cifra, LabPie } from '@/components/movil/lab/LabPie';
import { ENLACES_LAB } from '../enlaces';
import './c.css';

/* DIRECCION C · "Cine"
   Pagina oscura con islas claras redondeadas (Arounda). Arriba, video B/N a
   pantalla completa con el texto en la zona del pulgar; las cintas cruzan el
   borde de la primera isla; dentro, cifras gigantes con chips flotantes y la
   foto del monolito. Los servicios, en filas de colores alternos. */

export const metadata: Metadata = {
    title: 'Laboratorio móvil · C — Cine',
    robots: { index: false, follow: false },
};

const CHIP = ['web completa', 'optimizada para Google', 'soporte incluido', 'código y dominio'];

export default function LabC() {
    return (
        <>
            <a className="m-salto" href="#m-contenido">
                Saltar al contenido
            </a>
            <Cabecera enlaces={ENLACES_LAB} />
            <main id="m-contenido" className="lab-c">
                <HeroCine />

                {/* Lo que pierdes sin web: la foto del telon del escritorio con el
                    titular encima y el "0 resultados" flotando, y debajo las
                    tres perdidas en vidrio. */}
                <section id="problema" className="c-problema" data-tono="oscuro" aria-labelledby="problema-t">
                    <div className="m-wrap">
                        <Ceja n="01">{PROBLEMA.ceja}</Ceja>
                        <div className="c-problema-escena">
                            <figure className="c-problema-foto" data-rv="img">
                                <img src="/assets/movil/problema-telon.webp" width={720} height={900} alt="" loading="lazy" decoding="async" />
                            </figure>
                            <span className="c-problema-chip" aria-hidden="true">
                                <i />0 resultados
                            </span>
                            <Titular id="problema-t" className="m-h2 c-problema-h2" texto={PROBLEMA.titular} destacar={PROBLEMA.destacar} />
                        </div>
                        <p className="c-problema-frase" data-rv>
                            {PROBLEMA.frase}
                        </p>
                        <ul className="c-perdidas">
                            {PERDIDAS.map((p, k) => (
                                <li key={p.clave} className={`c-perdida c-perdida--${p.clave}`} data-rv style={{ '--d': `${k * 0.08}s` } as React.CSSProperties}>
                                    <span className="c-perdida-lbl m-mono">{p.label}</span>
                                    <h3 className="c-perdida-t">{p.titulo}</h3>
                                    <p className="c-perdida-txt">{p.texto}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="c-problema-cta" data-rv>
                            <Boton href={whatsapp(PROBLEMA.whatsapp)} externo>
                                {PROBLEMA.cta}
                            </Boton>
                        </div>
                    </div>
                </section>

                <Cintas className="c-cintas" />

                <section id="promesa" className="c-isla m-claro" data-tono="claro" aria-labelledby="promesa-t">
                    <div className="m-wrap">
                        <Ceja n="02">Por qué Atlas</Ceja>
                        <Titular id="promesa-t" className="m-h2 c-h2" texto="Rápido. Impecable. Puntual." destacar="Puntual." modo="marco" />

                        <figure className="c-foto" data-rv="img" style={{ '--r': '22px' } as React.CSSProperties}>
                            <img src="/assets/movil/monolito-ancho.webp" width={900} height={600} alt="Teléfono con la marca Atlas sobre una roca, bajo focos de luz" loading="lazy" decoding="async" />
                            <figcaption>Hablas directo con quien diseña y programa.</figcaption>
                        </figure>

                        <ul className="c-metricas">
                            {PROMESAS.map((p, k) => (
                                <li key={p.unidad} className={`c-metrica${k === 3 ? ' is-roja' : ''}`} data-rv>
                                    <span className="c-metrica-cifra">
                                        <Cifra antes={p.antes} cuenta={p.cuenta} despues={p.despues} />
                                    </span>
                                    <span className={`c-metrica-chip c-metrica-chip--${k % 2 ? 'b' : 'a'}`}>
                                        {p.unidad} · {CHIP[k]}
                                    </span>
                                    <span className="c-metrica-txt">{p.texto}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section id="servicios" className="c-isla c-isla--srv m-claro" data-tono="claro" aria-labelledby="servicios-t">
                    <div className="m-wrap">
                        <Ceja n="03">Servicios</Ceja>
                        <Titular id="servicios-t" className="m-h2 c-h2" texto="Lo que construimos." destacar="construimos." />
                        <p className="m-p c-intro" data-rv>
                            Toca un servicio para verlo funcionar.
                        </p>
                        <Servicios variante="filas" tema="oscuro" />
                    </div>
                </section>

                <LabPie actual="c" />
            </main>
            <Revelador />
        </>
    );
}
