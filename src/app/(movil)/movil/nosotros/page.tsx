import type { Metadata } from 'next';
import { Cabecera } from '@/components/movil/Cabecera';
import { Revelador } from '@/components/movil/Revelador';
import { Cierre } from '@/components/movil/nosotros/Cierre';
import { CuatroManos } from '@/components/movil/nosotros/CuatroManos';
import { FOTOS_PROVISIONALES, MENU_NOSOTROS } from '@/components/movil/nosotros/equipo';
import { Fichas } from '@/components/movil/nosotros/Fichas';
import { HeroDupla } from '@/components/movil/nosotros/HeroDupla';
import { Pasos } from '@/components/movil/nosotros/Pasos';
import { PieCompacto } from '@/components/movil/proyectos/PieCompacto';
// estilos .pry-pie/.pry-bill del PieCompacto (igual que /projects)
import '@/components/movil/proyectos/proyectos.css';
import '@/components/movil/nosotros/nosotros.css';

/* /nosotros en celular y tablet (el proxy reescribe hasta aqui por debajo
   de 1024 px; en el escritorio no hay pagina y, con la cookie, redirige a /).

   Las dos personas detras de Atlas, con un hilo: «lo que se ve / lo que no
   se ve». Harley es lo que se ve (direccion y diseño UI/UX), Benjamin lo que
   no se ve (backend e infraestructura) y tu proyecto queda donde se cruzan.
     · hero en isla clara: «Somos dos.», las dos fotos en arco y un anillo
       3D de habilidades y proyectos (solo CSS);
     · sobre negro, las dos fichas: foto, autografo, hoja de vidrio con lo
       que hace cada uno, sus proyectos o su diagrama, CV y redes;
     · «A cuatro manos.» en isla clara: el Venn, las garantias y la cita;
     · «Cinco pasos.» sobre negro: el mazo de etapas y los plazos;
     · el cierre en isla roja con WhatsApp, y el pie de las paginas internas
       en su variante soloNav (sin la billetera: el cierre ya es la isla roja).
   Los datos (y los [CONFIRMAR]) estan todos en nosotros/equipo.ts. */

export const metadata: Metadata = {
    title: 'Nosotros',
    description: 'Harley y Benjamín, las dos personas detrás de Atlas: quién dirige y diseña, quién lleva la parte técnica y cómo trabajan contigo.',
    alternates: { canonical: '/nosotros' },
    // fotos de otras personas con nuestros nombres: no indexar hasta cambiarlas
    ...(FOTOS_PROVISIONALES ? { robots: { index: false, follow: false } } : {}),
};

export default function NosotrosMovil() {
    return (
        <>
            <a className="m-salto" href="#m-contenido">
                Saltar al contenido
            </a>
            {/* fija: el hero es claro, y en el estado "arriba" (transparente) el
                logo blanco desapareceria sobre el papel */}
            <Cabecera enlaces={MENU_NOSOTROS} inicio="fija" />
            <main id="m-contenido" className="nos">
                <HeroDupla />
                <Fichas />
                <CuatroManos />
                <Pasos />
                <Cierre />
            </main>
            <PieCompacto soloNav />
            <Revelador />
        </>
    );
}
