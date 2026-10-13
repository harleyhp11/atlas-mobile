import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { usePerformance } from '@/hooks/usePerformance';

interface TechItem {
    name: string;
    icon: string;
    category?: string;
}

interface KineticTechGridProps {
    items: TechItem[];
    className?: string;
}

// Map tech names to descriptions that mimic the professional tone of Image 1
/* Una linea por tecnologia, en el mismo orden que STACK_ATLAS.

   El fallback de antes componia la frase solo: `Builds cutting-edge ${nombre}
   architectures.` Sonaba a relleno generado y cuatro tecnologias vivian de el
   —Matplotlib, Mistral AI, FastAPI y Flask—, que es como acabaron con
   descripciones a medio escribir. Ahora el fallback es una cadena vacia: si
   falta una descripcion se nota y se arregla, en vez de taparse. */
const techDescriptions: Record<string, string> = {
    'Next.js': 'Framework de React para sitios rápidos y listos para SEO.',
    'React': 'Interfaces por componentes, reutilizables y mantenibles.',
    'TypeScript': 'Código tipado: menos errores llegando a producción.',
    'JavaScript': 'La base de toda la interactividad en el navegador.',
    'Tailwind CSS': 'Estilos consistentes sobre un sistema de diseño ordenado.',
    'Astro': 'Sitios de contenido ultraligeros cuando no hace falta más.',
    'Node.js': 'Servidores y APIs para la lógica de tu negocio.',
    'PostgreSQL': 'Base de datos relacional para información crítica.',
    'Supabase': 'Autenticación, base de datos y archivos en un solo servicio.',
    'Prisma': 'Acceso a datos tipado y seguro.',
    'WordPress': 'Gestor de contenido para que edites sin depender de nosotros.',
    'Shopify': 'Comercio electrónico con pagos e inventario resueltos.',
    'Stripe': 'Cobros en línea con tarjeta, seguros y trazables.',
    'Framer Motion': 'Animaciones de interfaz fluidas y con propósito.',
    'GSAP': 'Animación avanzada y efectos ligados al scroll.',
    'Three.js': 'Gráficos 3D y experiencias inmersivas en el navegador.',
    'Figma': 'Diseño y prototipado antes de programar.',
    'Vercel': 'Despliegue global con HTTPS y previsualizaciones por rama.',
    'Cloudflare': 'Dominio, DNS, caché y protección ante picos de tráfico.',
    'Google Analytics': 'Medición del comportamiento real de tus visitantes.',
};


export const KineticTechGrid = ({ items, className }: KineticTechGridProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isLowPowerMode } = usePerformance();

    return (
        <div ref={containerRef} className={className}>
            {/* Grid uses 1 column mobile, 2 tablet, 3 desktop (like Image 1) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
                {items.map((tech, idx) => (
                    <TechCard
                        key={`${tech.name}-${idx}`}
                        tech={tech}
                        idx={idx}
                        isLowPowerMode={isLowPowerMode}
                    />
                ))}
            </div>
        </div>
    );
};

const TechCard = ({ tech, idx, isLowPowerMode }: { tech: TechItem, idx: number, isLowPowerMode?: boolean }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const description = techDescriptions[tech.name] || '';

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
            whileHover={{ 
                scale: 1.02, 
                zIndex: 10,
                transition: { type: 'spring', stiffness: 400, damping: 30 }
            }}
            className="group relative rounded-[20px] bg-white dark:bg-card border border-gray-100 dark:border-border/50 flex flex-row items-center gap-4 p-3 transition-all hover:border-gray-200 dark:hover:border-primary/50 hover:shadow-lg dark:hover:bg-muted/50 shadow-sm"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[20px]" />

            {/* Left Icon Container equivalent to the medical icons in image 1 */}
            <div className="w-[60px] h-[60px] rounded-[14px] flex-shrink-0 flex items-center justify-center bg-gray-50 dark:bg-background relative overflow-hidden transition-all group-hover:bg-white dark:group-hover:bg-background/80 shadow-inner group-hover:shadow-md">
                <div className="w-8 h-8 relative">
                    <Image
                        src={tech.icon}
                        alt={tech.name}
                        fill
                        className="object-contain grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300 unoptimized"
                        unoptimized
                        loading="lazy"
                    />
                </div>
            </div>

            {/* Right Text Content Container */}
            <div className="flex flex-col flex-grow text-left justify-center pr-2 relative z-10 overflow-hidden">
                <span className="text-[13px] sm:text-sm font-bold text-gray-900 dark:text-foreground group-hover:text-primary transition-colors truncate">
                    {tech.name}
                </span>
                <span className="text-[11px] sm:text-xs text-gray-500 dark:text-muted-foreground mt-[2px] leading-snug line-clamp-2">
                    {description}
                </span>
            </div>
        </motion.div>
    );
};
