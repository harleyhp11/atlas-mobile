/* Atlas es un estudio de Lima y el sitio va solo en español.

   Se deja 'es' como UNICO idioma a proposito. Si en algun momento hace falta
   ingles, se añade a esta lista y se crea messages/en.json traduciendo
   messages/es.json. Los en.json e id.json de la plantilla se borraron: traian
   los textos y datos personales del autor original. */
export const locales = ['es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';
