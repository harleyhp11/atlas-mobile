# Atlas — sitio web

Sitio de Atlas, estudio digital en Lima: webs, apps y software a medida.

## Stack

- Next.js 16 (App Router, Turbopack), React 19 y TypeScript
- Tailwind CSS, Framer Motion, GSAP y Lenis
- Three.js / React Three Fiber para las piezas 3D
- next-intl (solo español)

## Desarrollo

```bash
npm install
npx next dev -p 5310
```

Compilación de producción:

```bash
npm run build
```

## Dónde está cada cosa

- `src/data/portfolio.ts` — datos del estudio y fichas de proyectos
- `messages/es.json` — textos de la interfaz
- `public/gallery` — imágenes de la galería (las más nuevas salen primero)
- `public/project` — capturas de los proyectos (`<nombre>1.webp`, `<nombre>2.webp`…)

## Variables de entorno

Ver `.env.local.example`. El asistente usa `GROQ_API_KEY` y `GEMINI_API_KEY`, y el formulario de contacto `EMAIL_USER` y `EMAIL_APP_PASSWORD`.

## Antes de publicar

En `src/data/portfolio.ts` hay marcadores que hay que reemplazar por los datos reales: `{{ATLAS_EMAIL}}`, `{{ATLAS_INSTAGRAM}}` y `{{ATLAS_LINKEDIN}}`.
