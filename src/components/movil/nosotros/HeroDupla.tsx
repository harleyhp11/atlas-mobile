import type { CSSProperties } from 'react';
import { Firma } from '../Firma';
import { Compas, Cursor, Enchufe, Estrella, FlechaAbajo, Llaves, Servidor, SimboloAtlas } from '../iconos';
import { FIGMA } from '../logos';
import { ANILLO, BENJAMIN, HARLEY, PERSONA, type Icono, type Persona } from './equipo';

/* Hero de /nosotros: «Somos dos.» y la orbita.

   Las dos fotos en arco, una delante de la otra, y un anillo 3D de
   habilidades y proyectos que gira a la altura del pecho (las caras quedan
   libres): por detras, las tarjetas pasan detras de las cabezas, y eso lo
   resuelve preserve-3d, sin JS. Las dos tarjetas laterales son los enlaces
   reales a cada ficha.

   Todo entra con @keyframes al cargar —no espera a Revelador— y el h1 esta
   quieto desde el primer pintado: es el LCP. Los bucles (anillo y texto del
   sello) se pausan fuera de pantalla con data-loop. */

const ICONOS: Record<Exclude<Icono, 'figma'>, (p: { className?: string }) => React.ReactElement> = {
    compas: Compas,
    cursor: Cursor,
    llaves: Llaves,
    enchufe: Enchufe,
    servidor: Servidor,
};

function LogoFigma() {
    return (
        <svg className="nos-logo-figma" viewBox="0 0 38 57" aria-hidden="true">
            {FIGMA.map((p) => (
                <path key={p.d} d={p.d} fill={p.c} />
            ))}
        </svg>
    );
}

function Placa({ p }: { p: Persona }) {
    return (
        <div className={`nos-placa ${p.id === 'harley' ? 'is-h' : 'is-b'}`}>
            <img src={p.retrato.src} width={p.retrato.w} height={p.retrato.h} alt="" decoding="async" style={{ objectPosition: p.retrato.pos }} />
        </div>
    );
}

function Lado({ p }: { p: Persona }) {
    const h = p.id === 'harley';
    return (
        <a className={`nos-lado ${h ? 'is-h' : 'is-b'}`} href={`#${p.id}`}>
            <span className="m-mono nos-lado-cargo">{p.pildora}</span>
            <span className="nos-lado-nombre">{p.nombreCompleto}</span>
            <span className="nos-lado-linea">{p.lado}</span>
            <span className="sr-only">: ver su perfil</span>
            <span className="nos-lado-ir" aria-hidden="true">
                <FlechaAbajo />
            </span>
            {h ? (
                <svg className="nos-hilo" width="46" height="30" viewBox="0 0 46 30" fill="none" aria-hidden="true">
                    <path pathLength={1} d="M2 0 C2 14 18 24 42 25" />
                    <circle cx="42" cy="25" r="2.5" />
                </svg>
            ) : (
                <svg className="nos-hilo" width="30" height="64" viewBox="0 0 30 64" fill="none" aria-hidden="true">
                    <path pathLength={1} d="M26 64 C26 40 22 18 4 4" />
                    <circle cx="4" cy="4" r="2.5" />
                </svg>
            )}
        </a>
    );
}

export function HeroDupla() {
    return (
        <section className="nos-hero" data-tono="claro" data-loop aria-labelledby="nos-t">
            <div className="m-wrap">
                <div className="nos-h1-wrap">
                    <h1 id="nos-t" className="nos-h1">
                        {/* el punto solo a la vista: se lee «Somos dos y damos la cara» */}
                        <span className="nos-l">Somos</span>{' '}
                        <span className="nos-l nos-caja">
                            dos<span aria-hidden="true">.</span>
                        </span>{' '}
                        <span className="nos-h1-firma">
                            <Firma texto="y damos la cara." ancho={70} max={58} />
                        </span>
                        <span className="sr-only"> Harley y Benjamín, de Atlas.</span>
                    </h1>
                    <span className="nos-sello" aria-hidden="true">
                        <svg className="nos-sello-txt" viewBox="0 0 100 100">
                            <path id="nos-sello-c" d="M50 12a38 38 0 1 1 0 76a38 38 0 1 1 0-76" fill="none" />
                            <text>
                                <textPath href="#nos-sello-c" textLength="238.8" lengthAdjust="spacing">
                                    ESTUDIO DIGITAL · LIMA, PERÚ ·{' '}
                                </textPath>
                            </text>
                        </svg>
                        <span className="nos-sello-disco">
                            <SimboloAtlas />
                        </span>
                    </span>
                </div>
            </div>

            <div className="nos-orbita">
                <div className="nos-escena" aria-hidden="true">
                    <Placa p={HARLEY} />
                    <Placa p={BENJAMIN} />
                    <div className="nos-eje">
                        <div className="nos-anillo">
                            {ANILLO.map((it, i) => {
                                const estilo = { '--i': i } as CSSProperties;
                                if (it.tipo === 'pry') {
                                    return (
                                        <div key={it.slug} className="nos-item" style={estilo}>
                                            <span className="nos-cara nos-baldosa">
                                                <img src={`/assets/movil/proyectos/${it.slug}-mini.webp`} width={120} height={120} alt="" decoding="async" />
                                            </span>
                                            <span className="nos-dorso nos-baldosa" />
                                        </div>
                                    );
                                }
                                const Ico = it.icono === 'figma' ? null : ICONOS[it.icono];
                                return (
                                    <div key={it.t} className="nos-item" style={estilo}>
                                        <span className="nos-cara nos-hab">
                                            <span className={`nos-hab-ico ${it.quien === 'harley' ? 'is-h' : 'is-b'}`}>{Ico ? <Ico /> : <LogoFigma />}</span>
                                            <span className="nos-hab-txt">
                                                <b>{it.t}</b>
                                                <small>{PERSONA[it.quien].nombre}</small>
                                            </span>
                                        </span>
                                        <span className="nos-dorso nos-hab" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <Lado p={HARLEY} />
                <Lado p={BENJAMIN} />
                <Estrella className="nos-destello" />
            </div>

            <div className="m-wrap">
                <p className="nos-hero-nota">
                    <Estrella className="nos-nota-estrella" />
                    Sin intermediarios: tu idea va directo a quien la diseña y la programa.
                </p>
            </div>
        </section>
    );
}
