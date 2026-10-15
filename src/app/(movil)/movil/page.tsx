import type { Metadata } from 'next';
import { Cabecera } from '@/components/movil/Cabecera';
import { Ceja } from '@/components/movil/Ceja';
import { Cintas } from '@/components/movil/Cintas';
import { Revelador } from '@/components/movil/Revelador';
import { Servicios } from '@/components/movil/Servicios';
import { Titular } from '@/components/movil/Titular';
import { HeroInicio } from '@/components/movil/home/HeroInicio';
import { Problema } from '@/components/movil/home/Problema';
import { Ventajas } from '@/components/movil/home/Ventajas';
import './home.css';

/* La home de celular y tablet. El proxy reescribe "/" hasta aqui cuando la
   ventana mide menos de 1024 px (ver src/proxy.ts).

   Combinacion que eligio Harley del laboratorio:
     · hero de "Cine" (video B/N, texto en la zona del pulgar);
     · (01) el problema de "Cine" —foto del telon y "Te buscan, no
       apareces."— con el carrusel de "Producto", solo titulos;
     · (02) el bento de "Producto": monolito, desde S/ 400, entrega y
       respuesta en 24 h;
     · cintas cruzando hacia (03) los servicios de "Cine", en isla clara.
   Faltan Trabajos, nota del fundador, Proceso, Precios, Testimonio +
   Preguntas y el CTA final con el pie. */

export const metadata: Metadata = {
    alternates: { canonical: '/' },
};

// Mientras no existan esas secciones, el menu apunta a las paginas que si.
const MENU_HOME = [
    { n: '01', label: 'Servicios', href: '#servicios' },
    { n: '02', label: 'Por qué Atlas', href: '#ventajas' },
    { n: '03', label: 'Trabajos', href: '/projects' },
    { n: '04', label: 'Precios', href: '/servicios' },
    { n: '05', label: 'Contacto', href: '/contact' },
];

export default function HomeMovil() {
    return (
        <>
            <a className="m-salto" href="#m-contenido">
                Saltar al contenido
            </a>
            <Cabecera enlaces={MENU_HOME} />
            <main id="m-contenido" className="home-movil">
                <HeroInicio />
                <Problema />
                <Ventajas />

                <Cintas className="home-cintas" />

                <section id="servicios" className="home-isla m-claro" data-tono="claro" aria-labelledby="servicios-t">
                    <div className="m-wrap">
                        <Ceja n="03">Servicios</Ceja>
                        <Titular id="servicios-t" className="m-h2 home-h2" texto="Lo que construimos." destacar="construimos." />
                        <p className="m-p home-intro" data-rv>
                            Toca un servicio para verlo funcionar.
                        </p>
                        <Servicios variante="filas" tema="oscuro" />
                    </div>
                </section>
            </main>
            <Revelador />
        </>
    );
}
