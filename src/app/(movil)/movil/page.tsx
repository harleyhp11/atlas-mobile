import type { Metadata } from 'next';
import { Cabecera } from '@/components/movil/Cabecera';
import { Ceja } from '@/components/movil/Ceja';
import { Cintas } from '@/components/movil/Cintas';
import { WHATSAPP } from '@/components/movil/datos';
import { Revelador } from '@/components/movil/Revelador';
import { Servicios } from '@/components/movil/Servicios';
import { Titular } from '@/components/movil/Titular';
import { Herramientas } from '@/components/movil/home/Herramientas';
import { HeroInicio } from '@/components/movil/home/HeroInicio';
import { Negocios } from '@/components/movil/home/Negocios';
import { Pie } from '@/components/movil/home/Pie';
import { Preguntas } from '@/components/movil/home/Preguntas';
import { Problema } from '@/components/movil/home/Problema';
import { Testimonios } from '@/components/movil/home/Testimonios';
import { Trabajos } from '@/components/movil/home/Trabajos';
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
     · cintas cruzando hacia (03) los servicios de "Cine", en isla clara;
     · (04) Con que trabajamos, en la misma isla: la tarjeta del stack del
       escritorio y la cita del fundador;
     · (05) Trabajos sobre negro: muro de piezas en dos columnas en bucle,
       con el titular al centro y parallax con el scroll;
     · (06) Testimonios: cinta continua y ligeramente oblicua;
     · (07) Tu negocio: comparador antes/despues por rubro, con Motion
       (cargado con import() al acercarse) y fotos reales CC0;
     · (08) Preguntas: riel que se llena con el scroll y acordeon;
     · (09) el pie en isla clara: la escultura liquida de Atlas (el simbolo
       en metal, siempre en movimiento) y el cierre con WhatsApp.
     · Precios: por ahora un espacio en negro, despues de la isla clara.
   Falta Proceso. */

export const metadata: Metadata = {
    alternates: { canonical: '/' },
};

// Nosotros lleva a la cita del fundador; Precios, a su seccion (por ahora
// vacia, en negro); Contacto abre WhatsApp.
const MENU_HOME = [
    { n: '01', label: 'Nosotros', href: '#nosotros' },
    { n: '02', label: 'Servicios', href: '#servicios' },
    { n: '03', label: 'Precios', href: '#precios' },
    { n: '04', label: 'Proyectos', href: '/projects' },
    { n: '05', label: 'Por qué Atlas', href: '#ventajas' },
    { n: '06', label: 'Contacto', href: WHATSAPP, externo: true },
];

export default function HomeMovil() {
    return (
        <>
            <a className="m-salto" href="#m-contenido">
                Saltar al contenido
            </a>
            <Cabecera enlaces={MENU_HOME} />
            <main id="m-contenido" className="home-movil">
                <HeroInicio trabajos="#trabajos" />
                <Problema />
                <Ventajas />

                <Cintas className="home-cintas" />

                <div className="home-isla m-claro" data-tono="claro">
                    <section id="servicios" aria-labelledby="servicios-t">
                        <div className="m-wrap">
                            <Ceja n="03">Servicios</Ceja>
                            <Titular id="servicios-t" className="m-h2 home-h2" texto="Lo que construimos." destacar="construimos." />
                            <p className="m-p home-intro" data-rv>
                                Toca un servicio para verlo funcionar.
                            </p>
                            <Servicios variante="filas" tema="oscuro" />
                        </div>
                    </section>

                    <Herramientas />
                </div>

                {/* Precios: seccion por construir. Por ahora es solo el
                    espacio en negro al que lleva el menu. */}
                <section id="precios" className="home-precios" data-tono="oscuro" aria-label="Precios" />

                <Trabajos />
                <Testimonios />
                <Negocios />
                <Preguntas />
            </main>
            <Pie />
            <Revelador />
        </>
    );
}
