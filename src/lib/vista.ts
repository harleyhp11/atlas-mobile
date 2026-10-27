/* Script de la cookie `atlas-vista` — va inline en el <head> de los dos
   layouts raiz, antes de que pinte nada.

   Escribe en la cookie que arbol le toca a esta ventana segun su ancho real
   (por debajo de 1024 px, el movil), y el proxy la lee en la siguiente
   peticion. Si estamos en una ruta con dos versiones y el servidor mando la
   que no toca —primera visita sin cookie y user-agent engañoso—, recarga
   una vez.

   No hay riesgo de bucle: solo recarga si la cookie quedo escrita, y con la
   cookie escrita el proxy ya responde el arbol correcto. */

export type Vista = 'movil' | 'escritorio';

export const CORTE_MOVIL = 1024;

/* Las rutas con dos versiones y a donde va cada una en el arbol movil: la
   home, la lista de proyectos, la ficha de los seis proyectos de Atlas
   (los del autor de la plantilla no tienen version movil: siguen en la del
   escritorio) y los precios (/servicios, que en el escritorio es su pagina
   de precios). El proxy reescribe con esto. */
export const PROYECTOS_MOVIL = ['workup', 'rego-premium', 'utopp', 'fluxa', 'peru-travel', 'polleria-la-lena'];

export function rutaMovil(ruta: string): string | null {
    if (ruta === '/') return '/movil';
    if (ruta === '/projects') return '/movil/proyectos';
    if (ruta === '/servicios') return '/movil/precios';
    const m = /^\/projects\/([^/]+)$/.exec(ruta);
    return m && PROYECTOS_MOVIL.includes(m[1]) ? `/movil/proyectos/${m[1]}` : null;
}

// la misma lista, como expresion para el script del <head>
const RUTAS_DOBLES = `^/(projects(/(${PROYECTOS_MOVIL.join('|')}))?|servicios)?$`;

export function scriptVista(servida: Vista) {
    return `(function(){try{var v=matchMedia('(max-width:${CORTE_MOVIL - 0.02}px)').matches?'movil':'escritorio';document.cookie='atlas-vista='+v+';path=/;max-age=31536000;samesite=lax';if(new RegExp('${RUTAS_DOBLES}').test(location.pathname)&&v!=='${servida}'&&document.cookie.indexOf('atlas-vista='+v)>-1)location.replace(location.href)}catch(e){}})();`;
}
