import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Cabecera } from '@/components/movil/Cabecera';
import { Revelador } from '@/components/movil/Revelador';
import { Dock } from '@/components/movil/precios/detalle/Dock';
import { Empezar } from '@/components/movil/precios/detalle/Empezar';
import { HeroPlan } from '@/components/movil/precios/detalle/HeroPlan';
import { Incluye } from '@/components/movil/precios/detalle/Incluye';
import { OtrosPlanes } from '@/components/movil/precios/detalle/OtrosPlanes';
import { ParaTi } from '@/components/movil/precios/detalle/ParaTi';
import { Parecido } from '@/components/movil/precios/detalle/Parecido';
import { Pedido } from '@/components/movil/precios/detalle/Pedido';
import { Plazo } from '@/components/movil/precios/detalle/Plazo';
import { PorDentro } from '@/components/movil/precios/detalle/PorDentro';
import { Precio } from '@/components/movil/precios/detalle/Precio';
import { Resumen } from '@/components/movil/precios/detalle/Resumen';
import { Transicion } from '@/components/movil/precios/detalle/Transicion';
import { detalle, DETALLES, MENU_PRECIOS, rango, wspPlan, type Detalle } from '@/components/movil/precios/planes';
import { PieCompacto } from '@/components/movil/proyectos/PieCompacto';
import { DOMINIO, IMAGEN_OG } from '@/lib/metadatos';
// tokens, materiales y la transicion entre documentos (.pre, @view-transition)
import '@/components/movil/precios/precios.css';
// el pie compacto (.pry-pie) y el marco del proyecto parecido (.pry-marco)
import '@/components/movil/proyectos/proyectos.css';
import '@/components/movil/precios/detalle/detalle.css';

/* El detalle de cada plan en celular y tablet (/servicios/[slug], por el
   proxy; en el escritorio no existe y el proxy lo manda a /servicios).

   Una sola plantilla para los cuatro planes, pensada para que nadie se
   pierda en una pagina larga: arriba siempre se sabe donde estas (selector
   de planes) y que hay mas abajo (indice), y el dock deja cotizar desde
   cualquier punto. De arriba abajo:
     · el hero con la foto del rubro y el nombre del plan (D1);
     · el resumen: precio, entrega, respuesta y el boton (D2);
     · ¿es para ti? y, si no, a que plan ir (D3);
     · todo lo que incluye, punto por punto (D4);
     · por dentro: la maqueta y las partes de ejemplo (D5);
     · lo que mueve el precio, o como se cotiza (D6);
     · cuando esta listo: el plazo y las cinco etapas (D7);
     · algo parecido que hicimos (D8);
     · el armador del mensaje de WhatsApp (D9);
     · los otros planes (D10) y el dock.
   Los precios, plazos e «incluye» salen de (sitio)/servicios/datos.ts via
   planes.ts: aqui no se escribe ni un numero a mano.

   Las cuatro paginas se generan al compilar (dynamicParams = false): un slug
   que no esta en DETALLES es un 404. */

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
    return DETALLES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const d = detalle((await params).slug);
    if (!d) return {};
    const title = d.plan.aMedida ? `${d.titulo}: cómo se cotiza y qué incluye` : `${d.titulo}: precio y qué incluye`;
    const description = `${d.plan.aMedida ? 'Precio a medida' : d.plan.precio}. ${d.plan.descripcion}`;
    const url = `/servicios/${d.slug}`;
    return {
        title,
        description,
        alternates: { canonical: url },
        // el openGraph de la pagina REEMPLAZA al del layout: se repite todo
        openGraph: { type: 'website', locale: 'es_PE', siteName: 'Atlas', url, title, description, images: [IMAGEN_OG] },
    };
}

/* Service (con su rango como AggregateOffer, si lo tiene) + migas */
function datosEstructurados(d: Detalle) {
    const r = rango(d.plan);
    const url = `${DOMINIO}/servicios/${d.slug}`;
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Service',
                '@id': `${url}#servicio`,
                name: d.titulo,
                description: d.plan.descripcion,
                url,
                provider: { '@type': 'Organization', name: 'Atlas', url: DOMINIO },
                areaServed: 'PE',
                ...(r ? { offers: { '@type': 'AggregateOffer', priceCurrency: 'PEN', lowPrice: r.desde, highPrice: r.hasta } } : {}),
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${DOMINIO}/` },
                    { '@type': 'ListItem', position: 2, name: 'Servicios', item: `${DOMINIO}/servicios` },
                    { '@type': 'ListItem', position: 3, name: d.titulo, item: url },
                ],
            },
        ],
    };
}

export default async function PlanMovil({ params }: Props) {
    const d = detalle((await params).slug);
    if (!d) notFound();
    return (
        <>
            <Transicion />
            <a className="m-salto" href="#m-contenido">
                Saltar al contenido
            </a>
            <Cabecera enlaces={MENU_PRECIOS} cotizar={wspPlan(d)} />
            <main id="m-contenido" className="pre pre-dt">
                <Pedido d={d}>
                    <HeroPlan d={d} />
                    <Resumen d={d} />
                    <ParaTi d={d} />
                    <Incluye d={d} />
                    <PorDentro d={d} />
                    <Precio d={d} />
                    <Plazo d={d} />
                    <Parecido d={d} />
                    <Empezar d={d} />
                    <OtrosPlanes d={d} />
                    <Dock d={d} />
                </Pedido>
            </main>
            <PieCompacto soloNav />
            <Revelador />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados(d)).replace(/</g, '\\u003c') }} />
        </>
    );
}
