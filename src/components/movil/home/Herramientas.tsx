import { Space_Mono } from 'next/font/google';
import { Ceja } from '../Ceja';
import './herramientas.css';

/* (04) Herramientas — la tarjeta del stack del escritorio
   (IdentitySequence), pasada al celular tal cual: la palabra fantasma
   "Herramientas" que se disuelve hacia abajo, la foto del pasillo rojo, el
   vidrio liquido con "Lo que dominamos" en Space Mono y, al pie, las dos
   cintas de logos en blanco corriendo en sentidos opuestos. Mismos logos y
   mismo orden que alla (Simple Icons; VS Code, de Wikimedia), juntos en un
   solo sprite en blanco: /assets/movil/stack.svg. Con un <img> diferido por
   logo, los que estaban fuera de la cinta no bajaban hasta asomar y
   aparecian de golpe.

   Space Mono es una quinta familia (el brief del movil pide cuatro): va
   porque Harley pidio la tarjeta "tal cual". No se precarga, y la seccion
   usa content-visibility, asi que la fuente se pide recien al acercarse. */

const spaceMono = Space_Mono({ weight: '700', subsets: ['latin'], display: 'swap', preload: false, variable: '--font-space-mono' });

type Logo = [nombre: string, archivo: string];

const FILA_STACK: Logo[] = [
    ['TensorFlow', 'tensorflow'],
    ['Scikit-learn', 'scikitlearn'],
    ['LangChain', 'langchain'],
    ['PyTorch', 'pytorch'],
    ['OpenCV', 'opencv'],
    ['Python', 'python'],
    ['TypeScript', 'typescript'],
    ['React', 'react'],
    ['Next.js', 'nextdotjs'],
    ['Node.js', 'nodedotjs'],
];

const FILA_HERRAMIENTAS: Logo[] = [
    ['VS Code', 'vscode'],
    ['Jupyter', 'jupyter'],
    ['Google Colab', 'googlecolab'],
    ['Figma', 'figma'],
    ['GitHub', 'github'],
    ['Git', 'git'],
    ['Docker', 'docker'],
    ['Conda', 'anaconda'],
    ['Linux', 'linux'],
    ['Postman', 'postman'],
];

/* Dos copias de la fila para que el bucle cierre sin costura; la segunda
   va oculta para el lector de pantalla. */
function Cinta({ logos, sentido, etiqueta }: { logos: Logo[]; sentido: 'der' | 'izq'; etiqueta: string }) {
    return (
        <div className={`h-tools-cinta h-tools-cinta--${sentido}`}>
            <div className="h-tools-pista">
                {[0, 1].map((copia) => (
                    <ul key={copia} className="h-tools-grupo" aria-label={copia === 0 ? etiqueta : undefined} aria-hidden={copia === 1 || undefined}>
                        {logos.map(([nombre, archivo]) => (
                            <li key={archivo} className="h-tools-item">
                                <svg className="h-tools-ico" width={18} height={18} aria-hidden="true">
                                    <use href={`/assets/movil/stack.svg#${archivo}`} />
                                </svg>
                                {nombre}
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </div>
    );
}

export function Herramientas() {
    return (
        <section id="herramientas" className={`h-tools ${spaceMono.variable}`} aria-labelledby="herramientas-t">
            <div className="m-wrap">
                <Ceja n="04">Tecnología</Ceja>
                <p className="h-tools-fantasma" aria-hidden="true">
                    Herramientas
                </p>

                <div className="h-tools-tarjeta" data-rv>
                    <img src="/assets/movil/stack-rojo.webp" width={720} height={900} alt="" loading="lazy" decoding="async" />
                    <i className="h-tools-velo" aria-hidden="true" />

                    <div className="h-tools-centro">
                        <div className="h-tools-vidrio">
                            <h2 id="herramientas-t">
                                Lo que
                                <br />
                                dominamos
                            </h2>
                        </div>
                    </div>

                    <div className="h-tools-cintas" data-loop>
                        <Cinta logos={FILA_STACK} sentido="der" etiqueta="Lenguajes, frameworks e IA" />
                        <Cinta logos={FILA_HERRAMIENTAS} sentido="izq" etiqueta="Herramientas de trabajo" />
                    </div>
                </div>
            </div>
        </section>
    );
}
