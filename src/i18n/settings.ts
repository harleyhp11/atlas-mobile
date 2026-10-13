/* Atlas es un estudio de Lima y el sitio va solo en español. Antes habia
   'en' e 'id' (indonesio), que venian de la plantilla original: el conmutador
   de idioma saltaba entre ingles e indonesio, algo que no le sirve a nadie
   aqui.

   Se deja 'es' como UNICO idioma a proposito. Si en algun momento hace falta
   ingles, se añade a esta lista y se crea messages/en.json —el fichero sigue
   en el repo, no se borro. */
export const locales = ['es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';
