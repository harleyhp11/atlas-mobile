import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rutaMovil } from '@/lib/vista';

/* La home y los proyectos tienen dos arboles en la misma URL:
     · (sitio)/... — el escritorio de siempre, desde 1024 px;
     · (movil)/movil/... — la version de celular y tablet, por debajo:
       "/" → /movil, "/projects" → /movil/proyectos, la ficha de cada
       proyecto de Atlas → /movil/proyectos/[slug], "/servicios" (los
       precios) → /movil/precios y "/nosotros" → /movil/nosotros.

   /nosotros es la unica que no tiene version de escritorio: con la cookie
   `atlas-vista=escritorio` se REDIRIGE (307) a la home "/" (sin #about: en
   el escritorio About se monta tarde, despues del preloader, y el ancla no
   existe al cargar); sin esto daria 404. Sin cookie NO se redirige: se sirve
   la version movil y, si era un escritorio, el script del <head> escribe la
   cookie y recarga una vez (/nosotros esta en RUTAS_DOBLES), y recien ahi
   llega el 307. Asi un iPad que se anuncia como Mac no pierde la pagina.

   Aqui se decide cual responde sin que el navegador vea otra URL (es un
   rewrite, no un redirect). Manda la cookie `atlas-vista`, que escribe el
   script del <head> de los dos layouts con el ancho REAL de la ventana. En
   la primera visita no hay cookie y se adivina por Client Hints y
   user-agent; si la apuesta falla —un iPad que se anuncia como Mac, una
   ventana de escritorio estrecha—, ese script corrige la cookie y recarga
   una sola vez (ver src/lib/vista.ts).

   Antes este archivo mandaba a TODO visitante de celular, en cualquier ruta,
   a un sitio externo que venia con la plantilla. */

const UA_MOVIL = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

export function proxy(request: NextRequest) {
    const destino = rutaMovil(request.nextUrl.pathname);
    if (!destino) return NextResponse.next();

    const vista = request.cookies.get('atlas-vista')?.value;
    const esMovil = vista
        ? vista === 'movil'
        : request.headers.get('sec-ch-ua-mobile') === '?1' ||
          UA_MOVIL.test(request.headers.get('user-agent') || '');

    if (!esMovil && request.nextUrl.pathname === '/nosotros' && vista === 'escritorio') {
        return NextResponse.redirect(new URL('/', request.url), 307);
    }

    // /nosotros sin cookie tambien va al arbol movil (ver arriba)
    if (esMovil || request.nextUrl.pathname === '/nosotros') {
        const url = request.nextUrl.clone();
        url.pathname = destino;
        return NextResponse.rewrite(url);
    }
    return NextResponse.next();
}

// Solo estas rutas tienen dos versiones (ver rutaMovil); el resto ni pasa por
// aqui. Tiene que ser una lista literal: Next la lee al compilar.
export const config = {
    matcher: ['/', '/projects', '/projects/:slug', '/servicios', '/nosotros'],
};
