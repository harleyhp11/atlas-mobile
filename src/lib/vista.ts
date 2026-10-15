/* Script de la cookie `atlas-vista` — va inline en el <head> de los dos
   layouts raiz, antes de que pinte nada.

   Escribe en la cookie que arbol le toca a esta ventana segun su ancho real
   (por debajo de 1024 px, el movil), y el proxy la lee en la siguiente
   peticion a "/". Si estamos en la home y el servidor mando el arbol que no
   toca —primera visita sin cookie y user-agent engañoso—, recarga una vez.

   No hay riesgo de bucle: solo recarga si la cookie quedo escrita, y con la
   cookie escrita el proxy ya responde el arbol correcto. */

export type Vista = 'movil' | 'escritorio';

export const CORTE_MOVIL = 1024;

export function scriptVista(servida: Vista) {
    return `(function(){try{var v=matchMedia('(max-width:${CORTE_MOVIL - 0.02}px)').matches?'movil':'escritorio';document.cookie='atlas-vista='+v+';path=/;max-age=31536000;samesite=lax';if(location.pathname==='/'&&v!=='${servida}'&&document.cookie.indexOf('atlas-vista='+v)>-1)location.replace(location.href)}catch(e){}})();`;
}
