import { Boton } from '../Boton';
import { WHATSAPP } from '../datos';
import { Flecha, FlechaAbajo } from '../iconos';
import { Titular } from '../Titular';
import { EsculturaAtlas } from './pie/EsculturaAtlas';
import './pie.css';

/* El pie de la home, en isla clara con una pestaña arriba al centro.
   De arriba abajo, como un pie de marca deportiva:
     · la marca y "Volver arriba";
     · dos columnas centradas: las secciones de la pagina y las redes;
     · el titular de cierre;
     · la escultura liquida: el simbolo de Atlas en metal, siempre en
       movimiento, con una cinta tenue detras (atlas · sistemas · webs ·
       IA · negocios) que se difumina en los bordes;
     · el CTA de WhatsApp, centrado y mas corto;
     · la linea legal.
   Las redes, salvo WhatsApp, siguen por confirmar ([CONFIRMAR] del brief):
   van con href "#" hasta tener las cuentas. */

type Enlace = { label: string; href: string; externo?: boolean };

const EXPLORAR: Enlace[] = [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Por qué Atlas', href: '#ventajas' },
    { label: 'Trabajos', href: '#trabajos' },
    { label: 'Preguntas', href: '#preguntas' },
];

// [CONFIRMAR] las cuentas de Instagram, TikTok y LinkedIn
const REDES: Enlace[] = [
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
    { label: 'LinkedIn', href: '#' },
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

            <nav className="m-wrap h-pie-nav" aria-label="Pie de página">
                <Columna titulo="Explorar" enlaces={EXPLORAR} />
                <Columna titulo="Redes" enlaces={REDES} />
            </nav>

            <div className="m-wrap h-pie-cierre">
                <Titular id="pie-t" className="m-h2 h-pie-h2" texto="Construyamos lo que viene." destacar="viene." />
            </div>

            <EsculturaAtlas />

            <div className="m-wrap h-pie-ctas" data-rv>
                <Boton href={WHATSAPP} externo tinta className="h-pie-wsp">
                    Escríbenos por WhatsApp
                </Boton>
            </div>

            <div className="m-wrap">
                <div className="h-pie-base">
                    <p>© {new Date().getFullYear()} Atlas</p>
                    <p>Lima, Perú · UTC-5</p>
                </div>
            </div>
        </footer>
    );
}
