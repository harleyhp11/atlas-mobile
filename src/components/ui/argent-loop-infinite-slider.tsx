import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import MagneticEffect from "@/components/ui/MagneticEffect";

interface ProjectData {
  title: string;
  image: string;
  category: string;
  year: string;
  description: string;
  slug: string;
}

const PROJECT_DATA: ProjectData[] = [
  // Primer proyecto propio del carrusel. Los otros cuatro siguen siendo los
  // del autor de la plantilla. Los campos salen de lo que se ve en la propia
  // captura: el titular ("Tu práctica profesional, impulsada por IA") y el
  // panel de WorkIA emparejando vacantes con el perfil. Nada inventado.
  {
    title: "WorkUP",
    image: "/project/workup1.webp",
    category: "IA & Empleo",
    year: "2026",
    description: "Prácticas profesionales con un agente de IA que empareja vacantes con tu perfil.",
    slug: "workup"
  },
  // Segundo propio. Igual que WorkUP: los campos salen de la captura —el
  // rótulo "BAGUA GRANDE — AMAZONAS" y la bajada del propio hero—, no de
  // suposiciones.
  {
    title: "REGO Premium Apart Hotel",
    image: "/project/rego-premium1.webp",
    category: "Hotelería",
    year: "2026",
    description: "Apart-hotel premium en Bagua Grande, para estadías cortas y largas.",
    slug: "rego-premium"
  },
  // Tercero propio. El año no es suposición mía: la propia captura lleva la
  // píldora "Disponible en UTEC · 2026-I".
  {
    title: "Utopp",
    image: "/project/utopp1.webp",
    category: "Comunidad universitaria",
    year: "2026",
    description: "Eventos, organizaciones y proyectos de la universidad en un solo lugar.",
    slug: "utopp"
  },
  // Cuarto propio. OJO: aquí el año SÍ es suposición. La captura de Utopp
  // traía su "2026-I" escrito; esta solo dice "jueves 8 de junio", sin año.
  {
    title: "Fluxa",
    image: "/project/fluxa1.webp",
    category: "Fintech",
    year: "2026",
    description: "Centro de operaciones financieras con IA: conciliación, cobros, pagos y caja.",
    slug: "fluxa"
  },
  // Quinto y último. Con este el carrusel queda entero de Atlas: ya no queda
  // ningún proyecto del autor de la plantilla. El año, como en Fluxa, es
  // suposición: la captura no lleva fecha por ningún lado.
  {
    title: "Perú Travel",
    image: "/project/peru-travel1.webp",
    category: "Turismo",
    year: "2026",
    description: "Guía de destinos del Perú, con noticias, blog y buscador.",
    slug: "peru-travel"
  },
];

export function ArgentLoopInfiniteSlider() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 30, mass: 1 });

  const projectArea = 0.85;
  const projectStep = projectArea / PROJECT_DATA.length; 
  const transWindow = 0.05; 

  const scrollMap = [0];
  const yMap = ["0vh"];
  const internalYMap = ["0px"];

  PROJECT_DATA.forEach((_, i) => {
    if (i === 0) return;
    const boundary = i * projectStep;
    scrollMap.push(boundary - transWindow / 2, boundary + transWindow / 2);
    yMap.push(`-${(i-1)*100}vh`, `-${i*100}vh`);
    internalYMap.push(`-${(i-1)*250}px`, `-${i*250}px`);
  });

  scrollMap.push(projectArea, 1);
  yMap.push(`-${(PROJECT_DATA.length-1)*100}vh`, `-${(PROJECT_DATA.length-1)*100}vh`);
  internalYMap.push(`-${(PROJECT_DATA.length-1)*250}px`, `-${(PROJECT_DATA.length-1)*250}px`);

  const currentY = useTransform(smoothProgress, scrollMap, yMap);
  const contentInternalY = useTransform(smoothProgress, scrollMap, internalYMap);

  const bgOpacity = useTransform(smoothProgress, [0, 0.05, projectArea, 1], [0, 1, 1, 0]);
  const mainUIOpacity = useTransform(smoothProgress, [0, 0.05, projectArea, 1], [0, 1, 1, 0]);
  const buttonOpacity = useTransform(smoothProgress, [projectArea, projectArea + 0.05], [0, 1]);
  const finalContainerY = useTransform(smoothProgress, [projectArea, projectArea + 0.05], ["0px", "-250px"]);
  const imageY = useTransform(smoothProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div ref={containerRef} className="relative h-[500vh]">
      <style>{`
        .argent-slider-wrapper {
            position: sticky;
            top: 0;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            background: hsl(var(--background));
            z-index: 20;
        }
        .project-list {
            position: absolute;
            width: 100%;
            height: 100%;
            will-change: transform;
        }
        .project {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        .project img {
            width: 100%;
            height: 124%;
            object-fit: cover;
            filter: brightness(0.3) blur(10px);
            transform: scale(1.05);
            will-change: transform;
        }
        .mist-overlay {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at center, transparent 20%, hsl(var(--background) / 0.8) 100%);
            z-index: 5;
            pointer-events: none;
        }
        .minimap-bar-outer {
            width: 85vw;
            height: 250px;
            background: white !important;
            box-shadow: 0 50px 120px -30px rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            overflow: hidden;
        }
        .minimap-content-viewport {
            position: relative;
            width: 100%;
            height: 100%;
        }
        .minimap-img-preview {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 440px;
            height: 100%;
            overflow: hidden;
            z-index: 10;
        }
        .minimap-img-item {
            position: absolute;
            width: 100%;
            height: 100%;
            padding: 0.8rem 0;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .minimap-img-item img {
            display: block;
            margin: 0;
            will-change: transform;
        }
        .minimap-info-list {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 5;
        }
        .minimap-item-info {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 2.25rem 3.5%;
            font-family: 'Inter', sans-serif;
            color: black !important;
            text-transform: uppercase;
        }
        .minimap-item-info-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            width: 100%;
        }
        .minimap-item-info-row p {
            margin: 0;
            font-size: 10px;
            letter-spacing: 0.2em;
            font-weight: 800;
        }
        .minimap-item-info-row:nth-child(2) p { color: #666; font-weight: 700; }
        .minimap-item-info-row:nth-child(3) p { color: #999; font-weight: 500; font-size: 9.5px; text-transform: lowercase; }
        
        /* DEFAULT (Light Mode) Base State */
        .custom-btn {
            background: black;
            color: white;
            border-radius: 9999px;
            padding: 1.25rem 3rem;
            font-weight: 800;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            display: flex;
            align-items: center;
            gap: 0.6rem;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .custom-btn-arrow,
        .custom-btn-github {
            background: black;
            color: white;
            width: 58px;
            height: 58px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* DARK MODE Base State */
        .dark .custom-btn,
        .dark .custom-btn-arrow,
        .dark .custom-btn-github {
            background: white;
            color: black;
        }

        /* Independent GitHub hover */
        .custom-btn-github:hover {
            background: #c1e44a !important;
            color: black !important;
        }

        /* Synchronized View More + Arrow hover */
        .group-projects:hover .custom-btn,
        .group-projects:hover .custom-btn-arrow {
            background: #c1e44a !important;
            color: black !important;
        }

        .slide-overlay {
            position: absolute;
            bottom: 3rem;
            left: 5%;
            z-index: 110;
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
        .slide-line {
            width: 140px;
            height: 1px;
            position: relative;
        }
        .slide-progress {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            will-change: width;
        }
      `}</style>
      
      <div className="argent-slider-wrapper">
        <motion.div style={{ opacity: bgOpacity }}>
          <div className="mist-overlay" />
          <motion.div className="project-list" style={{ y: currentY }}>
            {PROJECT_DATA.map((data, i) => (
              <div key={i} className="project" style={{ top: `${i * 100}vh` }}>
                <motion.img src={data.image} alt={data.title} style={{ y: imageY }} />
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <motion.div 
            style={{ y: finalContainerY, willChange: "transform" }}
            className="flex flex-col items-center"
          >
            <motion.div style={{ opacity: mainUIOpacity }} className="minimap-bar-outer">
              <div className="minimap-content-viewport">
                <div className="minimap-img-preview">
                  <motion.div style={{ y: contentInternalY }} className="w-full h-full relative">
                    {PROJECT_DATA.map((data, i) => (
                      <div key={i} className="minimap-img-item" style={{ top: `${i * 250}px` }}>
                        <img src={data.image} alt={data.title} className="block w-full h-full object-cover" />
                      </div>
                    ))}
                  </motion.div>
                </div>
                <div className="minimap-info-list">
                  <motion.div style={{ y: contentInternalY }} className="w-full h-full relative">
                    {PROJECT_DATA.map((data, i) => {
                      const num = (i + 1).toString().padStart(2, "0");
                      return (
                        <div key={i} className="minimap-item-info" style={{ top: `${i * 250}px` }}>
                          <div className="minimap-item-info-row">
                            <p className="font-medium opacity-100">{num}</p>
                            <h4 className="text-xl md:text-2xl font-medium tracking-tight uppercase text-right max-w-[45%] leading-tight">
                              {data.title}
                            </h4>
                          </div>
                          <div className="minimap-item-info-row">
                            <p className="text-neutral-600 font-medium">{data.category}</p>
                            <p className="font-medium tabular-nums text-neutral-600">{data.year}</p>
                          </div>
                          <div className="minimap-item-info-row">
                            <p className="lowercase opacity-80 font-medium leading-relaxed max-w-[35%] text-[10px]">
                              {data.description}
                            </p>
                            <Link 
                                href={`/projects/${data.slug}`} 
                                className="pointer-events-auto font-medium text-[10px] opacity-60 hover:opacity-100 hover:text-black transition-all duration-300 text-right group/link"
                            >
                              <span className="border-b border-black/10 group-hover/link:border-black pb-1">Ver más</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <div className="h-[200px] w-full flex items-center justify-center pt-10">
              <motion.div 
                style={{ 
                  opacity: buttonOpacity,
                  pointerEvents: useTransform(smoothProgress, (v) => v > projectArea ? "auto" : "none")
                }}
              >
                <div className="flex items-center gap-4 pointer-events-auto">
                  <MagneticEffect>
                    <div className="group-projects flex items-center gap-2">
                      <Link href="/projects" className="custom-btn group-hover:scale-105 active:scale-95 group-hover:shadow-[0_0_30px_rgba(193,228,74,0.3)]">
                        Ver más
                      </Link>
                      <Link href="/projects" className="custom-btn-arrow group-hover:scale-110 active:scale-95 transition-transform shadow-xl">
                        <ArrowUpRight className="w-6 h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </MagneticEffect>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          style={{ opacity: useTransform(smoothProgress, [0, 0.05, projectArea, projectArea + 0.05], [0, 1, 1, 0]) }}
          className="slide-overlay"
        >
           <span className="text-foreground/40 font-mono text-[10px] tracking-[0.5em] uppercase">Page</span>
           <div className="slide-line bg-foreground/10">
              <motion.div 
                className="slide-progress bg-foreground" 
                style={{ width: useTransform(smoothProgress, [0, projectArea], ["0%", "100%"]) }} 
              />
           </div>
           <motion.span className="text-foreground font-mono text-[11px] tabular-nums font-bold">
              {useTransform(smoothProgress, (v) => {
               const idx = Math.min(Math.floor(v / projectStep), PROJECT_DATA.length - 1);
               return `${idx + 1} / ${PROJECT_DATA.length}`;
             })}
           </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
