import { Boton } from '../Boton';
import { Ceja } from '../Ceja';
import { WHATSAPP } from '../datos';
import { Flecha, FlechaAbajo } from '../iconos';
import { Titular } from '../Titular';
import { EsculturaAtlas } from './pie/EsculturaAtlas';
import './pie.css';

/* (08) El pie — "Sculpture Hero" (guglielmogiannattasio.it, 21st.dev)
   pasado a Atlas y a la home movil, en isla clara como servicios:
     · arriba, la marca y "Volver arriba" (donde el original tenia la nav);
     · al medio, la escultura liquida: el simbolo de Atlas en metal, siempre
       en movimiento, con "atlas" gigante y tenue detras. No ocupa la
       pantalla entera como el original: es una banda de ~70 % del ancho;
     · abajo, el cierre: titular, una linea y los dos CTA;
     · y el pie de siempre: enlaces y la linea legal.
   Sin email ni redes: siguen por confirmar ([CONFIRMAR] del brief). */

type Enlace = { label: string; href: string; externo?: boolean };

const EXPLORAR: Enlace[] = [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Por qué Atlas', href: '#ventajas' },
    { label: 'Trabajos', href: '#trabajos' },
    { label: 'Preguntas', href: '#preguntas' },
];

const ESTUDIO: Enlace[] = [
    { label: 'Precios', href: '/servicios' },
    { label: 'Proyectos', href: '/projects' },
    { label: 'Contacto', href: '/contact' },
    { label: 'WhatsApp', href: WHATSAPP, externo: true },
];

function Columna({ titulo, enlaces }: { titulo: string; enlaces: Enlace[] }) {
    return (
        <div className="h-pie-col">
            <p className="h-pie-col-t m-mono">{titulo}</p>
            <ul>
                {enlaces.map((e) => (
                    <li key={e.label}>
                        <a href={e.href} {...(e.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                            {e.label}
                            {e.externo && <Flecha className="h-pie-ext" />}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function Pie() {
    return (
        <footer id="contacto" className="h-pie m-claro" data-tono="claro">
            <div className="m-wrap h-pie-barra">
                <a href="/" className="h-pie-logo" aria-label="Atlas, inicio">
                    <img src="/brand/atlas-logo-movil.webp" width={97} height={22} alt="" loading="lazy" decoding="async" />
                </a>
                <a href="#m-contenido" className="h-pie-arriba m-mono">
                    Volver arriba
                    <FlechaAbajo className="h-pie-arriba-ico" />
                </a>
            </div>

            <EsculturaAtlas />

            <div className="m-wrap h-pie-cierre">
                <Ceja n="08">Contacto</Ceja>
                <Titular id="pie-t" className="m-h2 h-pie-h2" texto="Construyamos lo que viene." destacar="viene." />
                <p className="m-p h-pie-p" data-rv>
                    Cuéntanos tu idea por WhatsApp. Te respondemos en menos de 24 horas, con el precio cerrado por escrito.
                </p>
                <div className="h-pie-ctas" data-rv>
                    <Boton href={WHATSAPP} externo>
                        Escríbenos por WhatsApp
                    </Boton>
                    <a href="/servicios" className="h-pie-txt">
                        Ver precios
                        <Flecha />
                    </a>
                </div>
            </div>

            <nav className="m-wrap h-pie-nav" aria-label="Pie de página">
                <Columna titulo="Explorar" enlaces={EXPLORAR} />
                <Columna titulo="Estudio" enlaces={ESTUDIO} />
            </nav>

            <div className="m-wrap">
                <div className="h-pie-base">
                    <p>© {new Date().getFullYear()} Atlas</p>
                    <p>Lima, Perú · UTC-5</p>
                </div>
            </div>
        </footer>
    );
}
