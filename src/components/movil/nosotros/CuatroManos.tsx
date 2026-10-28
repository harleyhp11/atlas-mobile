import type { CSSProperties } from 'react';
import { Firma } from '../Firma';
import { Documento, Llave, Mas, Reloj, Salvavidas, SimboloAtlas } from '../iconos';
import { Titular } from '../Titular';
import { BENJAMIN, CITA, GARANTIAS, HARLEY } from './equipo';

/* «A cuatro manos.» en isla clara: como trabajan juntos.
     · el Venn: Harley es lo que se ve, Benjamin lo que no se ve, y tu
       proyecto queda en la lente roja donde se cruzan;
     · las cuatro garantias reales, en una cruz;
     · la cita real del fundador, en tarjeta blanca con sello y firma. */

const ICONOS = { documento: Documento, reloj: Reloj, salvavidas: Salvavidas, llave: Llave };

export function CuatroManos() {
    const palabras = CITA.split(' ');
    return (
        <section id="juntos" className="nos-manos" data-tono="claro" aria-labelledby="manos-t">
            <div className="m-wrap">
                <Titular id="manos-t" className="nos-manos-t" texto="A cuatro manos." destacar="manos." />
                <p className="m-p nos-manos-bajada" data-rv>
                    Diseño y código, juntos desde el primer día.
                </p>

                <figure className="nos-venn" data-in data-loop>
                    <svg viewBox="0 0 335 214" aria-hidden="true">
                        <defs>
                            <clipPath id="nos-venn-b">
                                <circle cx="228" cy="107" r="106" />
                            </clipPath>
                        </defs>
                        <g className="nos-venn-c is-h">
                            <circle cx="107" cy="107" r="106" />
                        </g>
                        <g className="nos-venn-c is-b">
                            <circle cx="228" cy="107" r="106" />
                        </g>
                        <circle className="nos-lente" cx="107" cy="107" r="106" fill="#E11D3A" clipPath="url(#nos-venn-b)" />
                    </svg>
                    <div className="nos-venn-etq" aria-hidden="true">
                        {/* los satelites rojos: HTML que gira en el compositor */}
                        <i className="nos-orb is-h" />
                        <i className="nos-orb is-b" />
                        <span className="nos-venn-lado nos-venn-h">
                            <img src={HARLEY.mini} width={240} height={240} alt="" loading="lazy" decoding="async" />
                            <b>
                                Lo que
                                <br />
                                se ve
                            </b>
                            <small>{HARLEY.nombre}</small>
                        </span>
                        <span className="nos-venn-lado nos-venn-b">
                            <img src={BENJAMIN.mini} width={240} height={240} alt="" loading="lazy" decoding="async" />
                            <b>
                                Lo que
                                <br />
                                no se ve
                            </b>
                            <small>{BENJAMIN.nombre}</small>
                        </span>
                        <span className="nos-venn-lente-t">Tu proyecto</span>
                    </div>
                    <figcaption className="sr-only">
                        Harley lleva lo que se ve: dirección, diseño e interfaz. Benjamín, lo que no se ve: backend, datos e infraestructura. Tu proyecto está
                        donde se cruzan.
                    </figcaption>
                </figure>

                <div className="nos-promesas" data-in>
                    <ul>
                        {GARANTIAS.map((g, i) => {
                            const Ico = ICONOS[g.icono];
                            return (
                                <li key={g.b} style={{ '--i': i } as CSSProperties}>
                                    <Ico className="nos-promesa-ico" />
                                    {g.sr ? (
                                        <>
                                            <b aria-hidden="true">{g.b}</b>
                                            <span className="sr-only">{g.sr}</span>
                                        </>
                                    ) : (
                                        <b>{g.b}</b>
                                    )}
                                    <span className="m-mono">{g.s}</span>
                                </li>
                            );
                        })}
                    </ul>
                    <span className="nos-cruz" aria-hidden="true">
                        <Mas />
                    </span>
                </div>

                <figure className="nos-cita" data-in>
                    <span className="nos-cita-sello" aria-hidden="true">
                        <SimboloAtlas />
                    </span>
                    <blockquote className="nos-cita-txt">
                        <p>
                            {palabras.map((w, i) => (
                                <span key={i}>
                                    <span style={{ '--i': i } as CSSProperties}>
                                        {i === 0 ? '“' : ''}
                                        {w}
                                        {i === palabras.length - 1 ? '”' : ''}
                                    </span>{' '}
                                </span>
                            ))}
                        </p>
                    </blockquote>
                    <figcaption className="nos-cita-pie">
                        <img src={HARLEY.mini} width={240} height={240} alt="" loading="lazy" decoding="async" />
                        <span className="nos-cita-quien">
                            <b>{HARLEY.nombre}</b>
                            <span className="m-mono">CEO y fundador de Atlas</span>
                        </span>
                    </figcaption>
                    {/* la firma cierra la cita, abajo a la derecha */}
                    <span className="nos-cita-firma" aria-hidden="true">
                        <Firma texto="Harley" ancho={30} max={40} />
                    </span>
                </figure>
            </div>
        </section>
    );
}
