import { Boton } from '../Boton';
import { WHATSAPP } from '../datos';
import { Flecha, FlechaAbajo } from '../iconos';

/* El pie de las paginas de proyectos: mas corto que el de la home y sin la
   escultura (Harley lo pidio asi). Una isla grafito —ni negra ni clara—
   con el cierre a WhatsApp, los enlaces en una fila y la linea legal. */

const ENLACES = [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/#servicios' },
    { label: 'Proyectos', href: '/projects' },
    { label: 'Precios', href: '/servicios' },
    { label: 'Contacto', href: '/contact' },
];

export function PieCompacto() {
    return (
        <footer className="pry-pie" data-tono="oscuro">
            <div className="m-wrap">
                <div className="pry-pie-cta">
                    <p className="pry-pie-ceja m-mono">
                        <i aria-hidden="true" />
                        ¿El siguiente es el tuyo?
                    </p>
                    <h2 className="pry-pie-t">Hablemos de lo que quieres construir.</h2>
                    <Boton href={WHATSAPP} externo>
                        Escríbenos por WhatsApp
                    </Boton>
                </div>

                <nav className="pry-pie-nav" aria-label="Pie de página">
                    <ul>
                        {ENLACES.map((e) => (
                            <li key={e.href}>
                                <a href={e.href}>{e.label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="pry-pie-base">
                    <a href="/" className="pry-pie-logo" aria-label="Atlas, inicio">
                        <img src="/brand/atlas-logo-movil.webp" width={97} height={22} alt="" loading="lazy" decoding="async" />
                    </a>
                    <a href="#m-contenido" className="pry-pie-arriba m-mono">
                        Arriba
                        <FlechaAbajo />
                    </a>
                </div>
                <p className="pry-pie-legal">
                    <span>© {new Date().getFullYear()} Atlas · Lima, Perú</span>
                    <a href="/contact">
                        Cotiza en 1 minuto
                        <Flecha />
                    </a>
                </p>
            </div>
        </footer>
    );
}
