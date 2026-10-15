import type { Metadata } from 'next';
import { Cabecera } from '@/components/movil/Cabecera';
import { Ceja } from '@/components/movil/Ceja';
import { Cintas } from '@/components/movil/Cintas';
import { PROMESAS } from '@/components/movil/datos';
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

                <Cintas className="c-cintas" />

                <section id="promesa" className="c-isla m-claro" data-tono="claro" aria-labelledby="promesa-t">
                    <div className="m-wrap">
                        <Ceja n="01">Por qué Atlas</Ceja>
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
                        <Ceja n="02">Servicios</Ceja>
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
