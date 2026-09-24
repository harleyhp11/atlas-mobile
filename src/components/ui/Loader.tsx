'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  AppWindow, MousePointer2, Search, QrCode, ShoppingCart, Zap,
  LayoutGrid, BarChart3, Contact, Cog, Share2, Calendar,
  Smartphone, Workflow, TabletSmartphone, SmartphoneNfc, Layers, Bell
} from 'lucide-react';

type LoaderType = 'ai' | 'software' | 'softskill' | 'default';

interface LoaderProps {
  type?: LoaderType;
}

/* Mismos iconos y etiquetas que antes. Los colores planos por cara
   desaparecen: el cubo es monocromo y el unico acento es el rojo de una cara. */
const config = {
  ai: [
    { icon: AppWindow, label: "WEB" },
    { icon: MousePointer2, label: "UI" },
    { icon: Search, label: "SEO" },
    { icon: QrCode, label: "MENÚ" },
    { icon: ShoppingCart, label: "SHOP" },
    { icon: Zap, label: "MOTION" }
  ],
  software: [
    { icon: LayoutGrid, label: "PANEL" },
    { icon: BarChart3, label: "DATA" },
    { icon: Contact, label: "CRM" },
    { icon: Cog, label: "AUTO" },
    { icon: Share2, label: "API" },
    { icon: Calendar, label: "CITAS" }
  ],
  softskill: [
    { icon: Smartphone, label: "APP" },
    { icon: Workflow, label: "UX" },
    { icon: TabletSmartphone, label: "iOS" },
    { icon: SmartphoneNfc, label: "DROID" },
    { icon: Layers, label: "PROTO" },
    { icon: Bell, label: "PUSH" }
  ],
  default: [
    { icon: Zap, label: "START" },
    { icon: Zap, label: "ACTION" },
    { icon: Zap, label: "ZOOM" },
    { icon: Zap, label: "WAIT" },
    { icon: Zap, label: "BOOM" },
    { icon: Zap, label: "LOAD" }
  ]
};

const LADO = 110;          // arista del cubo en px
const MITAD = LADO / 2;    // translateZ de cada cara

/* Colocacion de las seis caras. */
const CARAS = [
  { transform: `rotateY(0deg) translateZ(${MITAD}px)` },   // frente
  { transform: `rotateY(180deg) translateZ(${MITAD}px)` },  // espalda
  { transform: `rotateY(90deg) translateZ(${MITAD}px)` },   // derecha
  { transform: `rotateY(-90deg) translateZ(${MITAD}px)` },  // izquierda
  { transform: `rotateX(90deg) translateZ(${MITAD}px)` },  // techo
  { transform: `rotateX(-90deg) translateZ(${MITAD}px)` },   // suelo
];

/* El acento rojo vive en una cara fija (la 0) en vez de perseguir a la que
   mira a camara. Con el volteo cada 2s las caras barren la camara sin parar:
   medido, cualquier regla de "acento = cara frontal" cambiaba ~1.8 veces por
   segundo y dejaba el acento apagado un tercio del tiempo. Eso era el parpadeo.
   Con una cara fija el rojo aparece y desaparece por geometria, que es lo que
   hace un objeto al girar, y no hay nada que conmutar. */
const CARA_ACENTO = 0;

const Loader = ({ type = 'default' }: LoaderProps) => {
  const raizRef = useRef<HTMLDivElement>(null);
  const flotaRef = useRef<HTMLDivElement>(null);
  const cuboRef = useRef<HTMLDivElement>(null);
  const sombraRef = useRef<HTMLDivElement>(null);
  const escaneoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [encima, setEncima] = useState(false);

  // Estado de movimiento fuera de React: se escribe cada frame y provocar un
  // render por frame seria absurdo. Solo el indice de cara frontal sube a
  // estado, y unicamente cuando cambia.
  // escX/escY/escala = escenario (el salto). cubY/cubZ = giro propio del cubo.
  // incX/incY = inclinacion hacia el cursor.
  const mov = useRef({
    escala: 1, escX: -20, escY: 0,
    cubY: 0, cubZ: 0,
    incX: 0, incY: 0, metaX: 0, metaY: 0,
  });

  const faces = config[type] || config.default;

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const m = mov.current;
    const tweens: gsap.core.Tween[] = [];
    let escaneo: number | undefined;

    if (!reduce) {
      // El salto del escenario, igual que antes: escala + volteo, 2s ida y
      // vuelta. Va sobre un objeto y no sobre el nodo porque el lazo de abajo
      // necesita los angulos para saber que cara mira a camara.
      tweens.push(gsap.to(m, {
        escala: 1.3, escX: 160, escY: 180,
        duration: 2, ease: 'power1.inOut', yoyo: true, repeat: -1,
      }));

      // Giro propio del cubo en Y y Z, 8s lineales.
      tweens.push(gsap.to(m, {
        cubY: 360, cubZ: 360, duration: 8, ease: 'none', repeat: -1,
      }));

      // Pulso de la sombra, sincronizado con el salto.
      gsap.set(sombraRef.current, { scale: 1, opacity: 0.5 });
      tweens.push(gsap.to(sombraRef.current, {
        scale: 0.4, opacity: 0.1,
        duration: 2, ease: 'power1.inOut', yoyo: true, repeat: -1,
      }));

      // Linea de escaneo cada 6s sobre la cara del acento.
      escaneo = window.setInterval(() => {
        const el = escaneoRefs.current[CARA_ACENTO];
        if (!el) return;
        gsap.set(el, { opacity: 1 });
        gsap.fromTo(el, { y: -1 }, {
          y: LADO + 1,
          duration: 1.2,
          ease: 'none',
          onComplete: () => gsap.set(el, { opacity: 0 }),
        });
      }, 6000);
    }

    // Un solo lazo pinta las dos transformaciones. Va por fuera de los tweens
    // para que el seguimiento del cursor siga vivo con reduced-motion, cuando
    // no hay ningun tween corriendo.
    const pintar = () => {
      m.incX += (m.metaX - m.incX) * 0.08;
      m.incY += (m.metaY - m.incY) * 0.08;

      const a = m.escX + m.incX;
      const b = m.escY + m.incY;

      if (flotaRef.current) {
        flotaRef.current.style.transform =
          `scale(${m.escala}) rotateX(${a}deg) rotateY(${b}deg)`;
      }
      if (cuboRef.current) {
        cuboRef.current.style.transform =
          `rotateY(${m.cubY}deg) rotateZ(${m.cubZ}deg)`;
      }

    };
    gsap.ticker.add(pintar);

    return () => {
      tweens.forEach((t) => t.kill());
      gsap.ticker.remove(pintar);
      if (escaneo !== undefined) window.clearInterval(escaneo);
    };
  }, []);

  // Inclinacion hacia el cursor, tope 8 grados.
  const seguirCursor = (e: React.MouseEvent<HTMLDivElement>) => {
    const caja = raizRef.current?.getBoundingClientRect();
    if (!caja) return;
    const nx = (e.clientX - caja.left) / caja.width - 0.5;
    const ny = (e.clientY - caja.top) / caja.height - 0.5;
    mov.current.metaY = nx * 16;   // ±8
    mov.current.metaX = -ny * 16;  // ±8
  };

  const soltarCursor = () => {
    mov.current.metaX = 0;
    mov.current.metaY = 0;
    setEncima(false);
  };

  return (
    <div
      ref={raizRef}
      onMouseEnter={() => setEncima(true)}
      onMouseMove={seguirCursor}
      onMouseLeave={soltarCursor}
      className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden bg-transparent"
      style={{
        perspective: 1500,
        // Las aristas leen esta variable, asi el hover es un solo cambio.
        ['--arista' as string]: encima ? 0.6 : 0.28,
      }}
    >
      {/* Halo detras del cubo: lo despega del negro sin iluminar nada mas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.022) 0%, transparent 62%)' }}
      />

      <div className="relative flex items-center justify-center">
        {/* Escenario: lleva el salto (escala + volteo). */}
        <div
          ref={flotaRef}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'scale(1) rotateX(-20deg) rotateY(0deg)',
          }}
        >
          <div
            ref={cuboRef}
            className="relative"
            style={{
              width: LADO,
              height: LADO,
              transformStyle: 'preserve-3d',
              transform: 'rotateY(0deg) rotateZ(0deg)',
            }}
          >
            {CARAS.map((cara, i) => (
              <Cara
                key={i}
                icon={faces[i].icon}
                label={faces[i].label}
                indice={`0${i + 1}/06`}
                transform={cara.transform}
                activa={i === CARA_ACENTO}
                escaneoRef={(el) => { escaneoRefs.current[i] = el; }}
              />
            ))}
          </div>
        </div>

        {/* Sombra de contacto: elipse muy difusa, no la sombra dura de antes. */}
        <div
          ref={sombraRef}
          aria-hidden="true"
          className="absolute -bottom-[86px] h-[34px] w-[150px] rounded-[100%]"
          style={{ background: 'rgba(255,255,255,0.04)', filter: 'blur(18px)' }}
        />
      </div>
    </div>
  );
};

/* Marca de encuadre en una esquina: dos trazos de 6px en L. */
function Encuadre({ clase }: { clase: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute h-[6px] w-[6px] border-[rgba(255,255,255,0.7)] ${clase}`}
    />
  );
}

function Cara({
  icon: Icon, label, indice, transform, activa, escaneoRef,
}: {
  icon: any;
  label: string;
  indice: string;
  transform: string;
  activa: boolean;
  escaneoRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      className="absolute inset-0 box-border overflow-hidden"
      style={{
        transform,
        // Sin esto se ve el reverso de las caras, que se dibuja en espejo:
        // era la causa de "MENÚ" y "UI" invertidos.
        backfaceVisibility: 'hidden',
        // Casi opaca a proposito. Con la cara translucida, en angulo rasante
        // se veia como una lamina de luz, y al solaparse dos o tres caras el
        // alfa se sumaba: la zona se aclaraba y oscurecia con el volteo, que
        // es el parpadeo que se veia. Opaca, cada cara tapa a la de atras y
        // el brillo deja de acumularse. El degradado tambien baja de 0.06 a
        // 0.035 para que el reflejo sea insinuado, no un panel blanco.
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.006) 100%), rgb(10,10,10)',
        border: '1px solid rgba(255,255,255,var(--arista))',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09)',
        transition: 'border-color 400ms ease',
      }}
    >
      {/* Reticula de puntos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* Marcas de encuadre en los cuatro vertices */}
      <Encuadre clase="left-[5px] top-[5px] border-l border-t" />
      <Encuadre clase="right-[5px] top-[5px] border-r border-t" />
      <Encuadre clase="left-[5px] bottom-[5px] border-b border-l" />
      <Encuadre clase="right-[5px] bottom-[5px] border-b border-r" />

      {/* Indice */}
      <span className="absolute left-[14px] top-[11px] font-mono text-[8px] leading-none tracking-[0.18em] text-white/30">
        {indice}
      </span>

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[9px]">
        <Icon
          width={42}
          height={42}
          strokeWidth={1.5}
          style={{
            /* El acento lee el mismo token que el hero; el rgba del halo
               va literal porque drop-shadow() no acepta una var de color
               suelta dentro de rgba(). Sube a 0.62 porque el rojo es mas
               oscuro que el lima y con 0.5 el halo casi no se leia. */
            color: activa ? 'var(--hero-accent, #E11D3A)' : 'rgba(245,245,240,0.85)',
            filter: activa ? 'drop-shadow(0 0 10px rgba(225,29,58,0.62))' : 'none',
            transition: 'color 400ms ease, filter 400ms ease',
          }}
        />
        {/* El -mr compensa el letter-spacing, que si no descentra la palabra. */}
        <span className="-mr-[0.3em] font-mono text-[10px] uppercase leading-none tracking-[0.3em] text-white/50">
          {label}
        </span>
      </div>

      {/* Linea de escaneo */}
      <div
        ref={escaneoRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-px w-full opacity-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 18%, rgba(255,255,255,0.25) 82%, transparent 100%)',
        }}
      />
    </div>
  );
}

export default Loader;
