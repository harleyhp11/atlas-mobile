import React, { useRef, useEffect, useCallback } from 'react';

/* Chispas al hacer clic en cualquier parte del sitio.

   El canvas es FIJO y del tamaño de la PANTALLA, no de la página. Antes iba
   absolute sobre el contenedor de todo el sitio y medía lo que la página
   entera: en la home, ~1000 × 28.000 px (29 megapíxeles, 110 MB). Cada clic
   borraba y repintaba ese lienzo en cada fotograma de la animación y la
   tarjeta gráfica tenía que mover esa capa gigante encima de todo: la página
   se congelaba uno o dos segundos. Ahora mide la ventana (≈1,5 MP), y fuera
   de la animación queda oculto, así que tampoco cuesta nada en reposo. */

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  extraScale?: number;
  children?: React.ReactNode;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const isAnimatingRef = useRef(false);
  const animationIdRef = useRef<number | null>(null);

  // Ajusta el canvas a la ventana (con la densidad de pantalla, hasta 2x).
  const ajustar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.round(window.innerWidth * dpr);
    const h = Math.round(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const alRedimensionar = () => {
      clearTimeout(t);
      t = setTimeout(ajustar, 100);
    };
    window.addEventListener('resize', alRedimensionar);
    return () => {
      window.removeEventListener('resize', alRedimensionar);
      clearTimeout(t);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [ajustar]);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    sparksRef.current = sparksRef.current.filter((spark: Spark) => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= duration) return false;

      const progress = elapsed / duration;
      const eased = easeFunc(progress);

      const distance = eased * sparkRadius * extraScale;
      const lineLength = sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      ctx.strokeStyle = sparkColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      return true;
    });

    if (sparksRef.current.length > 0) {
      animationIdRef.current = requestAnimationFrame(draw);
    } else {
      // Sin chispas, el canvas se oculta: ni se compone ni ocupa la GPU.
      isAnimatingRef.current = false;
      animationIdRef.current = null;
      canvas.style.visibility = 'hidden';
    }
  }, [duration, easeFunc, extraScale, sparkColor, sparkRadius, sparkSize]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const now = performance.now();
    const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
      x: e.clientX,
      y: e.clientY,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now
    }));

    sparksRef.current.push(...newSparks);

    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      ajustar();
      canvas.style.visibility = 'visible';
      animationIdRef.current = requestAnimationFrame(draw);
    }
  };

  return (
    <div className="relative w-full h-full" onClick={handleClick}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999] h-screen w-screen"
        style={{ visibility: 'hidden' }}
      />
      {children}
    </div>
  );
};

export default ClickSpark;
