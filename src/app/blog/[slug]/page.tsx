'use client';

import { use, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import { Clock, Copy, BookOpen, Link as LinkIcon, ArrowLeft, Check } from 'lucide-react';
import { notFound, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const t = useTranslations('blog');
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 2) {
            router.back();
        } else {
            router.push('/blog');
        }
    };

    const implementedSlugs = [
        'future-of-ai-agents',
        'web3-ux-challenges',
        'mastering-nextjs-performance',
        'ai-driven-security',
        'llm-fine-tuning',
        'smart-contract-security',
        'modern-state-management',
        'iot-edge-computing',
        'ai-in-healthcare',
        'the-architects-manifesto'
    ];
    const isImplemented = implementedSlugs.includes(slug);

    const post = portfolioData.blogs.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pb-24 pt-32">
            {/* Header Section */}
            <div className="container max-w-7xl mx-auto px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium hover:text-primary transition-colors">
                            <button onClick={handleBack} className="flex items-center gap-2 focus:outline-none">
                                <ArrowLeft className="w-4 h-4" />
                                <span>Volver</span>
                            </button>
                        </div>
                    </div>

                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-foreground mb-6 leading-[1.1]">
                            {post.title}
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
                            {post.excerpt}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Hero Image */}
            <div className="container max-w-7xl mx-auto px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative w-full aspect-[21/9] md:aspect-[2/1] rounded-3xl overflow-hidden border border-border/40 shadow-2xl"
                >
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>
            </div>

            {/* Metadata Bar */}
            <div className="container max-w-7xl mx-auto px-6 mb-16">
                <div className="flex flex-col md:flex-row items-center justify-between border-y border-border/40 py-6 gap-6">
                    <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-start">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Escrito por</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground">{post.author.name}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Publicado el</span>
                            <span className="font-bold text-foreground">{post.date}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button
                            onClick={handleCopy}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 transition-all text-xs font-bold uppercase tracking-wider rounded-lg",
                                copied
                                    ? "bg-primary text-background"
                                    : "bg-secondary/10 hover:bg-secondary/20 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" /> <span>¡Copiado!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" /> <span className="hidden sm:inline">Copiar enlace</span>
                                </>
                            )}
                        </button>
                        {/* Aqui habia tres enlaces a los perfiles personales del
                            autor de la plantilla: su LinkedIn, su GitHub y su
                            Medium. Se eliminan, no se sustituyen: los perfiles
                            de Atlas en portfolio.ts siguen siendo marcadores,
                            y un enlace inventado es peor que ninguno. */}
                    </div>
                </div>
            </div>

            {/* Main Content & Sidebar Grid */}
            <div className="container max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Article Content */}
                    <div className={isImplemented ? "lg:col-span-8" : "lg:col-span-12"}>
                        <div className="prose prose-lg prose-invert prose-primary max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-loose prose-p:text-muted-foreground">

                            {slug === 'future-of-ai-agents' && (
                                <>
                                    <h2 id="intro" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">El auge de los agentes autónomos</h2>
                                    <p className="mb-8">
                                        El software de empresa está cambiando de raíz. Dejamos atrás la automatización rígida y los flujos guionizados para entrar en la era de los <strong>agentes de IA autónomos</strong>. No son herramientas: son entidades que perciben, razonan, actúan y aprenden para cumplir objetivos complejos con muy poca intervención humana.
                                    </p>
                                    <p className="mb-8">
                                        En el software de siempre, una persona definía cada paso del proceso. Si la condición A coincidía con la B, se ejecutaba la acción C. Hoy, los agentes que corren sobre modelos de lenguaje entienden una instrucción vaga como «analiza las ventas del tercer trimestre y propón una estrategia para el cuarto», y se las arreglan solos: consultan la base de datos, corren modelos estadísticos y redactan el informe.
                                    </p>

                                    <div className="my-12 relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 bg-secondary/5">
                                        <Image
                                            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop"
                                            alt="AI Agents Architecture"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 800px"
                                            loading="lazy"
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    <h2 id="core" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Arquitectura para la autonomía</h2>
                                    <p className="mb-8">
                                        Construir un agente que funcione obliga a repensar la arquitectura. No va del modelo, va de la <strong>arquitectura cognitiva</strong> que lo rodea.
                                    </p>
                                    <ul className="list-disc pl-6 mb-8 sapce-y-2 text-muted-foreground">
                                        <li><strong>Memoria:</strong> El agente necesita memoria corta (la ventana de contexto) para lo que tiene entre manos, y memoria larga (bases vectoriales) para recordar lo que ya pasó y lo que ya sabe.</li>
                                        <li><strong>Herramientas:</strong> Un agente vale lo que valen las herramientas que puede usar. Diseñamos interfaces (APIs) para que pueda operar sobre un CRM, un ERP o la web abierta.</li>
                                        <li><strong>Planificación:</strong> Saber partir un objetivo grande en una secuencia de acciones ejecutables es lo que separa a un agente de un chatbot.</li>
                                    </ul>

                                    <blockquote className="border-l-4 border-primary pl-6 my-12 italic text-xl font-medium text-foreground">
                                        «El futuro del software no es que las personas digan a las máquinas qué hacer, sino que las máquinas pregunten a las personas qué quieren conseguir.»
                                        <footer className="mt-4 text-sm font-bold not-italic text-primary flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden relative">
                                                <Image src={post.author.avatar} alt="Author" fill sizes="32px" loading="lazy" className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-foreground">{post.author.name}</div>
                                                <div className="text-muted-foreground text-xs font-normal">Ingeniería de IA</div>
                                            </div>
                                        </footer>
                                    </blockquote>

                                    <h2 id="impact" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Decidir de otra manera</h2>
                                    <p className="mb-8">
                                        Meter agentes en la toma de decisiones añade velocidad y criterio basado en datos. Un agente no actúa por intuición: actúa por datos. Puede cruzar millones de registros en segundos para detectar una anomalía de seguridad, ajustar una cadena de suministro en vivo o personalizar la atención a gran escala.
                                    </p>
                                    <p className="mb-8">
                                        Pero ese poder trae responsabilidad. El reto se mueve ahora hacia la <strong>alineación</strong> y la <strong>gobernanza</strong>—asegurar que estos sistemas actúen conforme a los valores de las personas y a los objetivos del negocio.
                                    </p>
                                </>
                            )}

                            {slug === 'web3-ux-challenges' && (
                                <>
                                    <h2 id="ux-gap" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">La brecha de experiencia en Web3</h2>
                                    <p className="mb-8">
                                        Se repite que «Web3 es el futuro», pero para una persona normal se siente como volver al módem. Custodiar claves privadas, entender las comisiones de gas y asumir que una transacción no se deshace son barreras enormes. Para llegar a todo el mundo, una aplicación Web3 tiene que sentirse igual que las que usamos a diario: intuitiva, rápida y capaz de perdonar un error.
                                    </p>
                                    <p className="mb-8">
                                        El problema de fondo es la fricción entre <strong>seguridad</strong> y la <strong>comodidad</strong>. En la banca de siempre, el banco custodia: si olvidas la contraseña, te la restablece. En DeFi, si pierdes tu frase semilla, tus fondos se van para siempre. Hay que cerrar esa brecha sin renunciar a la descentralización.
                                    </p>

                                    <div className="my-12 relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 bg-secondary/5">
                                        <Image
                                            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000&auto=format&fit=crop"
                                            alt="Web3 UX"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 800px"
                                            loading="lazy"
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    <h2 id="seed-phrases" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">El final de las frases semilla</h2>
                                    <p className="mb-8">
                                        La mayor barrera de entrada es la billetera. Esperar que alguien custodie doce palabras no escala. Aquí entra <strong>Account Abstraction (ERC-4337)</strong>.
                                    </p>
                                    <ul className="list-disc pl-6 mb-8 sapce-y-2 text-muted-foreground">
                                        <li><strong>Recuperación social:</strong> ¿Perdiste la clave? Recuperas la cuenta con personas de confianza o con biometría.</li>
                                        <li><strong>Transacciones patrocinadas:</strong> La aplicación paga el gas por ti, así nadie tiene que comprar ETH solo para probar un servicio.</li>
                                        <li><strong>Transacciones agrupadas:</strong> Aprobar e intercambiar en un solo clic, en vez de firmar tres ventanas que nadie entiende.</li>
                                    </ul>

                                    <blockquote className="border-l-4 border-primary pl-6 my-12 italic text-xl font-medium text-foreground">
                                        «Los próximos mil millones de usuarios no van a saber que usan blockchain. Solo van a saber que usan un internet mejor y más justo.»
                                        <footer className="mt-4 text-sm font-bold not-italic text-primary flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden relative">
                                                <Image src={post.author.avatar} alt="Author" fill sizes="32px" loading="lazy" className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-foreground">{post.author.name}</div>
                                                <div className="text-muted-foreground text-xs font-normal">Desarrollo blockchain</div>
                                            </div>
                                        </footer>
                                    </blockquote>

                                    <h2 id="latency" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Latencia y respuesta</h2>
                                    <p className="mb-8">
                                        Una blockchain es más lenta que un servidor centralizado. Nadie debería mirar un spinner quince segundos. <strong>interfaz optimista</strong> es clave: muestra el resultado al instante mientras la transacción se confirma por detrás. Si falla, se revierte con elegancia y se avisa.
                                    </p>
                                    <p className="mb-8">
                                        Además, los datos de una transacción son crípticos. En vez de «0x… envió a 0x…», hace falta una simulación legible que diga: «Estás dando permiso a OpenSea para mover tu Bored Ape». La claridad es la mejor medida de seguridad.
                                    </p>
                                </>
                            )}

                            {slug === 'mastering-nextjs-performance' && (
                                <>
                                    <h2 id="rendering" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Patrones de renderizado: SSG, SSR y PPR</h2>
                                    <p className="mb-8">
                                        El rendimiento empieza por cómo entregas el contenido. Next.js ofrece todo un abanico de estrategias. <strong>La generación estática (SSG)</strong> es el patrón de referencia en velocidad: sirve HTML ya construido desde el borde. Para contenido dinámico, en cambio, se dependía del renderizado en servidor (SSR), que mete latencia.
                                    </p>
                                    <p className="mb-8">
                                        Lo que lo cambia todo es el <strong>prerrenderizado parcial (PPR)</strong>. Permite dejar el armazón de la aplicación estático —carga instantánea— mientras las partes dinámicas, como los datos del usuario, llegan en paralelo. Ese híbrido tiene la velocidad de un sitio estático y la flexibilidad de uno servido.
                                    </p>

                                    <div className="my-12 relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 bg-secondary/5">
                                        <Image
                                            src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=2000&auto=format&fit=crop"
                                            alt="Next.js Performance"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 800px"
                                            loading="lazy"
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    <h2 id="assets" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Optimizar imágenes y tipografías</h2>
                                    <p className="mb-8">
                                        El Largest Contentful Paint suele hundirse por imágenes sin optimizar. La etiqueta <code>&lt;img&gt;</code> no basta. El componente <code>&lt;Image&gt;</code> de Next.js redimensiona, carga en diferido y sirve formatos modernos como WebP y AVIF sin que hagas nada.
                                    </p>
                                    <ul className="list-disc pl-6 mb-8 sapce-y-2 text-muted-foreground">
                                        <li><strong>Atributo de tamaño:</strong> Define siempre ancho y alto, o usa <code>fill</code> con un contenedor padre, para que no se mueva el diseño (CLS).</li>
                                        <li><strong>Prioridad:</strong> Marca la imagen del LCP —casi siempre la del hero— con <code>priority</code> para precargarla.</li>
                                        <li><strong>Next/Font:</strong> Aloja las tipografías de Google en tu propio servidor: cero saltos de diseño y cero peticiones externas.</li>
                                    </ul>

                                    <blockquote className="border-l-4 border-primary pl-6 my-12 italic text-xl font-medium text-foreground">
                                        «El rendimiento no es una métrica, es parte de la experiencia. Un sitio rápido genera confianza.»
                                        <footer className="mt-4 text-sm font-bold not-italic text-primary flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden relative">
                                                <Image src={post.author.avatar} alt="Author" fill sizes="32px" loading="lazy" className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-foreground">{post.author.name}</div>
                                                <div className="text-muted-foreground text-xs font-normal">Desarrollo full stack</div>
                                            </div>
                                        </footer>
                                    </blockquote>

                                    <h2 id="bundles" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">División de código y peso del bundle</h2>
                                    <p className="mb-8">
                                        Ejecutar JavaScript bloquea el hilo principal. Mandar un bundle enorme es la receta para un First Input Delay malo. Next.js separa el código por ruta de forma automática, pero se puede ir más lejos.
                                    </p>
                                    <p className="mb-8">
                                        Usa <code>next/dynamic</code> para cargar en diferido los componentes pesados que no hacen falta en la primera pantalla: una ventana modal, un gráfico complejo más abajo.
                                    </p>
                                    <div className="p-4 bg-secondary/10 rounded-lg border border-border/40 font-mono text-xs mb-8">
                                        <code>
                                            const HeavyChart = dynamic(() =&gt; import('./HeavyChart'), &#123; ssr: false, loading: () =&gt; &lt;p&gt;Loading...&lt;/p&gt; &#125;);
                                        </code>
                                    </div>
                                </>
                            )}

                            {slug === 'ai-driven-security' && (
                                <>
                                    <h2 id="threats" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">La velocidad de los ataques de hoy</h2>
                                    <p className="mb-8">
                                        El modelo clásico de centro de operaciones de seguridad está roto. Los analistas se ahogan en falsos positivos mientras los atacantes automatizan el escaneo, la intrusión y la extracción de datos en minutos. El tiempo de reacción humano no da.
                                    </p>
                                    <p className="mb-8">
                                        <strong>La seguridad con IA</strong> cambia la ecuación. En vez de buscar firmas estáticas —archivos ya conocidos como maliciosos—, los modelos analizan comportamiento. Aprenden cómo es el tráfico normal de tu organización y levantan la mano al instante ante una anomalía: por ejemplo, un practicante de marketing entrando a la base de producción a las tres de la mañana.
                                    </p>

                                    <div className="my-12 relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 bg-secondary/5">
                                        <Image
                                            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop"
                                            alt="Cybersecurity"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 800px"
                                            loading="lazy"
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    <h2 id="detection" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Aprendizaje profundo para detectar</h2>
                                    <p className="mb-8">
                                        Los modelos de aprendizaje profundo son buenísimos reconociendo patrones. En seguridad eso significa detectar exploits de día cero que nadie ha visto antes.
                                    </p>
                                    <ul className="list-disc pl-6 mb-8 sapce-y-2 text-muted-foreground">
                                        <li><strong>Análisis de comportamiento (UEBA):</strong> Seguir los hábitos de cada usuario para detectar credenciales robadas.</li>
                                        <li><strong>ADN del malware:</strong> Analizar la estructura real del código de un archivo, no solo su hash, para identificar malware polimórfico.</li>
                                        <li><strong>Detección de phishing:</strong> Modelos de lenguaje que leen el correo para detectar intención y urgencia, no solo palabras clave.</li>
                                    </ul>

                                    <blockquote className="border-l-4 border-primary pl-6 my-12 italic text-xl font-medium text-foreground">
                                        «Quien defiende tiene que acertar siempre. Quien ataca, una sola vez. La IA empareja un poco el terreno.»
                                        <footer className="mt-4 text-sm font-bold not-italic text-primary flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden relative">
                                                <Image src={post.author.avatar} alt="Author" fill sizes="32px" loading="lazy" className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-foreground">{post.author.name}</div>
                                                <div className="text-muted-foreground text-xs font-normal">Investigación en seguridad</div>
                                            </div>
                                        </footer>
                                    </blockquote>

                                    <h2 id="adversarial" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">IA adversaria</h2>
                                    <p className="mb-8">
                                        La carrera se acelera. Los atacantes ya usan su propia IA para generar notas de voz falsas y suplantar a un directivo, escribir código polimórfico que esquiva la detección y automatizar el escaneo de vulnerabilidades.
                                    </p>
                                    <p className="mb-8">
                                        Para contrarrestarlo usamos <strong>redes generativas adversarias (GAN)</strong> para enfrentar dos IA entre sí —una intenta crear el ataque y la otra bloquearlo— y así mejorar las defensas a base de simulación.
                                    </p>
                                </>
                            )}

                            {slug === 'llm-fine-tuning' && (
                                <>
                                    <h2 id="why-visual" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">¿Por qué ajustar en local?</h2>
                                    <p className="mb-8">
                                        Llama 3 y Mistral democratizaron el acceso a modelos potentes. Pero un modelo base es generalista. Para que destaque en algo concreto —escribir consultas SQL sobre tu propio esquema, o responder tickets con la voz de tu marca— hace falta <strong>ajuste fino</strong>.
                                    </p>
                                    <p className="mb-8">
                                        Hacerlo en local, o en una nube privada, garantiza la <strong>privacidad de los datos</strong>. Mandar contratos o historias clínicas a la API de un tercero es inviable para muchas empresas. El ajuste local mantiene los datos dentro de casa.
                                    </p>

                                    <div className="my-12 relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 bg-secondary/5">
                                        <Image
                                            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop"
                                            alt="LLM Fine-Tuning"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 800px"
                                            loading="lazy"
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    <h2 id="lora" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">LoRA y QLoRA, explicados</h2>
                                    <p className="mb-8">
                                        Un ajuste completo actualiza los más de siete mil millones de parámetros del modelo y exige una barbaridad de memoria de GPU. <strong>LoRA (Low-Rank Adaptation)</strong> congela los pesos del modelo preentrenado e inyecta matrices entrenables de rango reducido en cada capa del Transformer.
                                    </p>
                                    <p className="mb-8">
                                        <strong>QLoRA</strong> va más allá y cuantiza el modelo base a 4 bits, con lo que puedes ajustar un modelo de 70B en una sola GPU de 48GB, o uno de 7B en una RTX 4090 de escritorio.
                                    </p>

                                    <h2 id="ollama" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">El stack: Ollama y Unsloth</h2>
                                    <p className="mb-8">
                                        Para inferencia local, <strong>Ollama</strong> es la forma más sencilla de correr modelos GGUF. Para entrenar, <strong>Unsloth</strong> es hoy la biblioteca más rápida: de dos a cinco veces más veloz y con un 60% menos de memoria que la implementación estándar de HuggingFace.
                                    </p>

                                    <div className="p-4 bg-secondary/10 rounded-lg border border-border/40 font-mono text-xs mb-8 overflow-x-auto">
                                        <p className="text-muted-foreground mb-2"># Instalar Unsloth y exportar el modelo a Ollama</p>
                                        <code className="block whitespace-pre">
                                            {`from unsloth import FastLanguageModel
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/llama-3-8b-bnb-4bit",
    max_seq_length = 2048,
    load_in_4bit = True,
)

# ... Training loop ...

model.save_pretrained_gguf("model_name", tokenizer, quantization_method = "q4_k_m")`}
                                        </code>
                                    </div>

                                    <blockquote className="border-l-4 border-primary pl-6 my-12 italic text-xl font-medium text-foreground">
                                        «El ajuste fino es el puente entre un motor de razonamiento genérico y un sistema experto.»
                                        <footer className="mt-4 text-sm font-bold not-italic text-primary flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden relative">
                                                <Image src={post.author.avatar} alt="Author" fill sizes="32px" loading="lazy" className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-foreground">{post.author.name}</div>
                                                <div className="text-muted-foreground text-xs font-normal">Ingeniería de IA</div>
                                            </div>
                                        </footer>
                                    </blockquote>
                                </>
                            )}

                             {slug === 'smart-contract-security' && (
                                <>
                                    <h2 id="audits" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Por qué auditar en serio</h2>
                                    <p className="mb-8">
                                        En el mundo descentralizado, el código es la ley. Y cuando esa ley tiene un hueco, millones desaparecen en un instante. <strong>La seguridad de los contratos inteligentes</strong> dejó de ser una buena práctica: es la base de la confianza en Web3. Una sola vulnerabilidad de reentrada o un desbordamiento sin comprobar bastan para un desastre.
                                    </p>
                                    <p className="mb-8">
                                        Los patrones de auditoría pasaron de la revisión manual a la verificación formal automatizada. Hoy ya se integran herramientas de análisis estático con IA capaces de revisar miles de líneas de Solidity en segundos e identificar patrones conocidos, como los <em>ataques con préstamos flash</em> or <em>la manipulación de oráculos</em>.
                                    </p>

                                    <div className="my-12 relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 bg-secondary/5">
                                        <Image
                                            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop"
                                            alt="Smart Contract Security"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 800px"
                                            loading="lazy"
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    <h2 id="patterns" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Asegurar todas las capas</h2>
                                    <p className="mb-8">
                                        La seguridad tiene que ser integral. Empieza en el lenguaje, pero llega hasta el diseño de la arquitectura.
                                    </p>
                                    <ul className="list-disc pl-6 mb-8 sapce-y-2 text-muted-foreground">
                                        <li><strong>Control de acceso:</strong> Implementar control por roles (RBAC) para que solo quien debe pueda ejecutar las funciones críticas.</li>
                                        <li><strong>Pruebas de invariantes:</strong> Definir propiedades que deben cumplirse siempre, pase lo que pase, y usar fuzzing para intentar romperlas.</li>
                                        <li><strong>Pausa de emergencia:</strong> Meter interruptores en el contrato que permitan congelar funciones si se detecta un ataque.</li>
                                    </ul>

                                    <blockquote className="border-l-4 border-primary pl-6 my-12 italic text-xl font-medium text-foreground">
                                        «Un contrato seguro es el que asume que cada usuario es un atacante en potencia y cada llamada externa, un exploit en potencia.»
                                        <footer className="mt-4 text-sm font-bold not-italic text-primary flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden relative">
                                                <Image src={post.author.avatar} alt="Author" fill sizes="32px" loading="lazy" className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-foreground">{post.author.name}</div>
                                                <div className="text-muted-foreground text-xs font-normal">Auditoría de seguridad blockchain</div>
                                            </div>
                                        </footer>
                                    </blockquote>
                                </>
                            )}

                            {slug === 'modern-state-management' && (
                                <>
                                    <h2 id="beyond-redux" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Más allá de la complejidad de Redux</h2>
                                    <p className="mb-8">
                                        Durante años Redux reinó en la gestión de estado en React. Pero tanto código repetido terminó cansando a todo el mundo. Hoy vivimos un renacer de bibliotecas minimalistas como <strong>Zustand</strong> y la <strong>Jotai</strong>, que priorizan la experiencia de quien programa sin sacrificar rendimiento.
                                    </p>
                                    <p className="mb-8">
                                        Zustand, en particular, se ha extendido muchísimo por su API sencilla basada en hooks, que no obliga a envolver toda la aplicación en un proveedor. Permite actualizaciones atómicas y se integra fácil con middleware como Immer.
                                    </p>

                                    <div className="my-12 relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 bg-secondary/5">
                                        <Image
                                            src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2000&auto=format&fit=crop"
                                            alt="State Management"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 800px"
                                            loading="lazy"
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    <h2 id="atomic-vs-global" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Estado atómico o global</h2>
                                    <p className="mb-8">
                                        Elegir el patrón depende de la arquitectura de tu aplicación.
                                    </p>
                                    <ul className="list-disc pl-6 mb-8 sapce-y-2 text-muted-foreground">
                                        <li><strong>Estado global (Zustand):</strong> Mejor para datos compartidos, como el perfil del usuario o los ajustes generales que muchos componentes necesitan.</li>
                                        <li><strong>Estado atómico (Jotai/Recoil):</strong> Ideal para piezas independientes que deben ser muy reactivas y estar desacopladas.</li>
                                        <li><strong>Estado del servidor (React Query):</strong> Imprescindible para manejar datos de APIs, con caché y sincronización automáticas.</li>
                                    </ul>

                                    <blockquote className="border-l-4 border-primary pl-6 my-12 italic text-xl font-medium text-foreground">
                                        «La mejor gestión de estado es la que no se nota. Debería ser invisible y aparecer solo cuando hace falta.»
                                        <footer className="mt-4 text-sm font-bold not-italic text-primary flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden relative">
                                                <Image src={post.author.avatar} alt="Author" fill sizes="32px" loading="lazy" className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-foreground">{post.author.name}</div>
                                                <div className="text-muted-foreground text-xs font-normal">Ingeniería frontend</div>
                                            </div>
                                        </footer>
                                    </blockquote>
                                </>
                            )}

                            {slug === 'iot-edge-computing' && (
                                <>
                                    <h2 id="edge-vs-cloud" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Procesar en el borde</h2>
                                    <p className="mb-8">
                                        En el IoT industrial, la latencia es el enemigo. Esperar la ida y vuelta a un servidor en la nube para detener una máquina averiada cuesta segundos que no se tienen. <strong>El cómputo en el borde</strong> lleva la inteligencia al propio hardware: microcontroladores como el ESP32 o una Raspberry Pi procesando los datos ahí mismo.
                                    </p>
                                    <p className="mb-8">
                                        Filtrar y analizar en el borde baja mucho el costo de ancho de banda y hace el sistema más fiable. Aunque se caiga la red, el nodo sigue funcionando y decidiendo con lo que leen sus sensores.
                                    </p>

                                    <div className="my-12 relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 bg-secondary/5">
                                        <Image
                                            src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop"
                                            alt="Edge Computing"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 800px"
                                            loading="lazy"
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    <h2 id="hw-optimization" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Optimizar a nivel de hardware</h2>
                                    <p className="mb-8">
                                        Meter IA en el borde exige optimizar bastante para caber en una memoria muy limitada.
                                    </p>
                                    <ul className="list-disc pl-6 mb-8 sapce-y-2 text-muted-foreground">
                                        <li><strong>TinyML:</strong> Desplegar modelos cuantizados capaces de correr en microcontroladores sencillos.</li>
                                        <li><strong>Almacenamiento local:</strong> Usar SPIFFS o LittleFS para registrar datos y guardar la configuración.</li>
                                        <li><strong>Eficiencia energética:</strong> Modos de sueño profundo y procesamiento asíncrono para estirar la batería.</li>
                                    </ul>

                                    <blockquote className="border-l-4 border-primary pl-6 my-12 italic text-xl font-medium text-foreground">
                                        «La nube es para pensar; el borde es para actuar.»
                                        <footer className="mt-4 text-sm font-bold not-italic text-primary flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden relative">
                                                <Image src={post.author.avatar} alt="Author" fill sizes="32px" loading="lazy" className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-foreground">{post.author.name}</div>
                                                <div className="text-muted-foreground text-xs font-normal">Arquitectura de soluciones IoT</div>
                                            </div>
                                        </footer>
                                    </blockquote>
                                </>
                            )}

                            {slug === 'ai-in-healthcare' && (
                                <>
                                    <h2 id="diagnostics" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">La IA como herramienta de diagnóstico</h2>
                                    <p className="mb-8">
                                        La salud es una de las fronteras más prometedoras para la inteligencia artificial. Los modelos de visión por computadora ya identifican signos tempranos de enfermedad en radiografías, resonancias y tomografías con una precisión que a menudo supera la humana. Ese <strong>apoyo al diagnóstico</strong> no reemplaza al médico: lo potencia.
                                    </p>
                                    <p className="mb-8">
                                        El reto de verdad no es la precisión del modelo, es la <strong>explicabilidad</strong>. Para que un médico confíe en un diagnóstico de IA necesita entender *por qué* el modelo decidió eso. Técnicas como Grad-CAM resaltan los píxeles concretos en los que se fijó la red durante el análisis.
                                    </p>

                                    <div className="my-12 relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 bg-secondary/5">
                                        <Image
                                            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop"
                                            alt="Healthcare AI"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 800px"
                                            loading="lazy"
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    <h2 id="ethics" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Ética y privacidad de los datos</h2>
                                    <p className="mb-8">
                                        Con datos médicos, la privacidad manda.
                                    </p>
                                    <ul className="list-disc pl-6 mb-8 sapce-y-2 text-muted-foreground">
                                        <li><strong>Cumplimiento normativo:</strong> Que todo el sistema respete los estándares de confidencialidad del paciente.</li>
                                        <li><strong>Anonimización:</strong> Procesos sólidos para quitar cualquier dato personal identificable antes de entrenar.</li>
                                        <li><strong>Aprendizaje federado:</strong> Entrenar modelos sobre datos de varias instituciones sin mover nunca los datos crudos de su servidor.</li>
                                    </ul>

                                    <blockquote className="border-l-4 border-primary pl-6 my-12 italic text-xl font-medium text-foreground">
                                        «La IA en salud no va de reemplazar el trato humano, sino de aportar la lectura sobrehumana que salva vidas.»
                                        <footer className="mt-4 text-sm font-bold not-italic text-primary flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden relative">
                                                <Image src={post.author.avatar} alt="Author" fill sizes="32px" loading="lazy" className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-foreground">{post.author.name}</div>
                                                <div className="text-muted-foreground text-xs font-normal">Investigación en IA médica</div>
                                            </div>
                                        </footer>
                                    </blockquote>
                                </>
                            )}

                            {slug === 'the-architects-manifesto' && (
                                <>
                                    <h2 id="manifesto" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">La filosofía del jardín digital</h2>
                                    <p className="mb-8">
                                        Un portafolio no debería ser un cementerio de proyectos terminados. Debería ser un <strong>jardín digital</strong>—un sitio vivo donde las ideas se siembran, se cuidan y se comparten cuando maduran. Nuestro objetivo no es solo construir software, sino diseñar sistemas tan elegantes como inteligentes.
                                    </p>
                                    <p className="mb-8">
                                        Este manifiesto refleja nuestro compromiso con aprender sin parar y aportar al código abierto. En una época donde la tecnología corre como corre, el valor está en la concentración profunda, la ingeniería honesta y la búsqueda de que las cosas estén bien hechas.
                                    </p>

                                    <div className="my-12 relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 bg-secondary/5">
                                        <Image
                                            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2000&auto=format&fit=crop"
                                            alt="Manifesto"
                                            fill
                                            priority
                                            sizes="100vw"
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    <h2 id="principles" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Nuestros principios de trabajo</h2>
                                    <p className="mb-8">
                                        Estos son los valores que guían cada línea que escribimos:
                                    </p>
                                    <ul className="list-disc pl-6 mb-8 sapce-y-2 text-muted-foreground">
                                        <li><strong>Inteligencia con intención:</strong> La IA debe resolver problemas reales, no solo ofrecer interacciones vistosas.</li>
                                        <li><strong>Escalar por diseño:</strong> Arquitecturas que crecen sin perder rendimiento por el camino.</li>
                                        <li><strong>Ingeniería centrada en las personas:</strong> La tecnología está al servicio de la gente, y su fin es ampliar lo que puede hacer.</li>
                                    </ul>

                                    <blockquote className="border-l-4 border-primary pl-6 my-12 italic text-xl font-medium text-foreground">
                                        «No construimos solo herramientas; construimos el futuro. Construyámoslo con criterio y oficio.»
                                        <footer className="mt-4 text-sm font-bold not-italic text-primary flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden relative">
                                                <Image src={post.author.avatar} alt="Author" fill sizes="32px" loading="lazy" className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-foreground">{post.author.name}</div>
                                                <div className="text-muted-foreground text-xs font-normal">Dirección técnica</div>
                                            </div>
                                        </footer>
                                    </blockquote>
                                </>
                            )}

                            {!isImplemented && (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="p-4 rounded-full bg-secondary/10 text-muted-foreground mb-4">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Próximamente</h2>
                                    <p className="text-muted-foreground">Esta nota todavía se está escribiendo. Vuelve en unos días.</p>
                                </div>
                            )}

                            {isImplemented && (
                                <div className="mt-12 pt-12 border-t border-border/40">
                                    <h3 className="text-lg font-bold mb-6">Temas relacionados</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {post.tags.map(tag => (
                                            <Link key={tag} href={`/blog?q=${tag}`} className="px-4 py-2 bg-secondary/10 hover:bg-primary/10 text-muted-foreground hover:text-primary border border-transparent hover:border-primary/20 rounded-lg text-sm transition-all font-medium">
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    {isImplemented && (
                        <div className="lg:col-span-4 space-y-8">
                            <div className="sticky top-12 space-y-8">
                                {/* Table of Contents */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 pb-4 border-b border-border/40">
                                        Contenido
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        {slug === 'future-of-ai-agents' && [
                                            { id: 'intro', label: 'The Rise of Agents' },
                                            { id: 'core', label: 'Cognitive Architecture' },
                                            { id: 'impact', label: 'Decision Making' }
                                        ].map((item, index) => (
                                            <a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                className={`
                                                group flex items-center gap-3 text-sm font-medium transition-colors
                                                ${index === 0 ? 'text-primary pl-0' : 'text-muted-foreground hover:text-foreground'}
                                            `}
                                            >
                                                <span className={`h-px w-4 transition-all ${index === 0 ? 'bg-primary' : 'bg-transparent group-hover:bg-border'}`} />
                                                {item.label}
                                            </a>
                                        ))}

                                        {slug === 'web3-ux-challenges' && [
                                            { id: 'ux-gap', label: 'The UX Gap' },
                                            { id: 'seed-phrases', label: 'Account Abstraction' },
                                            { id: 'latency', label: 'Latency & Feedback' }
                                        ].map((item, index) => (
                                            <a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                className={`
                                                group flex items-center gap-3 text-sm font-medium transition-colors
                                                ${index === 0 ? 'text-primary pl-0' : 'text-muted-foreground hover:text-foreground'}
                                            `}
                                            >
                                                <span className={`h-px w-4 transition-all ${index === 0 ? 'bg-primary' : 'bg-transparent group-hover:bg-border'}`} />
                                                {item.label}
                                            </a>
                                        ))}

                                        {slug === 'mastering-nextjs-performance' && [
                                            { id: 'rendering', label: 'Rendering Patterns' },
                                            { id: 'assets', label: 'Assets Optimization' },
                                            { id: 'bundles', label: 'Bundle Size' }
                                        ].map((item, index) => (
                                            <a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                className={`
                                                group flex items-center gap-3 text-sm font-medium transition-colors
                                                ${index === 0 ? 'text-primary pl-0' : 'text-muted-foreground hover:text-foreground'}
                                            `}
                                            >
                                                <span className={`h-px w-4 transition-all ${index === 0 ? 'bg-primary' : 'bg-transparent group-hover:bg-border'}`} />
                                                {item.label}
                                            </a>
                                        ))}

                                        {slug === 'ai-driven-security' && [
                                            { id: 'threats', label: 'Modern Threats' },
                                            { id: 'detection', label: 'Deep Learning' },
                                            { id: 'adversarial', label: 'Adversarial AI' }
                                        ].map((item, index) => (
                                            <a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                className={`
                                                group flex items-center gap-3 text-sm font-medium transition-colors
                                                ${index === 0 ? 'text-primary pl-0' : 'text-muted-foreground hover:text-foreground'}
                                            `}
                                            >
                                                <span className={`h-px w-4 transition-all ${index === 0 ? 'bg-primary' : 'bg-transparent group-hover:bg-border'}`} />
                                                {item.label}
                                            </a>
                                        ))}

                                        {slug === 'llm-fine-tuning' && [
                                            { id: 'why-visual', label: 'Why Fine-Tune?' },
                                            { id: 'lora', label: 'LoRA & QLoRA' },
                                            { id: 'ollama', label: 'Ollama + Unsloth' }
                                        ].map((item, index) => (
                                            <a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                className={`
                                                group flex items-center gap-3 text-sm font-medium transition-colors
                                                ${index === 0 ? 'text-primary pl-0' : 'text-muted-foreground hover:text-foreground'}
                                            `}
                                            >
                                                <span className={`h-px w-4 transition-all ${index === 0 ? 'bg-primary' : 'bg-transparent group-hover:bg-border'}`} />
                                                {item.label}
                                            </a>
                                        ))}

                                        {slug === 'smart-contract-security' && [
                                            { id: 'audits', label: 'Rigorous Audits' },
                                            { id: 'patterns', label: 'Securing Layers' }
                                        ].map((item, index) => (
                                            <a key={item.id} href={`#${item.id}`} className="group flex items-center gap-3 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                                                <span className="h-px w-4 bg-transparent group-hover:bg-border transition-all" />
                                                {item.label}
                                            </a>
                                        ))}

                                        {slug === 'modern-state-management' && [
                                            { id: 'beyond-redux', label: 'Beyond Redux' },
                                            { id: 'atomic-vs-global', label: 'Atomic vs Global' }
                                        ].map((item, index) => (
                                            <a key={item.id} href={`#${item.id}`} className="group flex items-center gap-3 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                                                <span className="h-px w-4 bg-transparent group-hover:bg-border transition-all" />
                                                {item.label}
                                            </a>
                                        ))}

                                        {slug === 'iot-edge-computing' && [
                                            { id: 'edge-vs-cloud', label: 'Edge vs Cloud' },
                                            { id: 'hw-optimization', label: 'HW Optimization' }
                                        ].map((item, index) => (
                                            <a key={item.id} href={`#${item.id}`} className="group flex items-center gap-3 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                                                <span className="h-px w-4 bg-transparent group-hover:bg-border transition-all" />
                                                {item.label}
                                            </a>
                                        ))}

                                        {slug === 'ai-in-healthcare' && [
                                            { id: 'diagnostics', label: 'AI Diagnostics' },
                                            { id: 'ethics', label: 'Ethics & Privacy' }
                                        ].map((item, index) => (
                                            <a key={item.id} href={`#${item.id}`} className="group flex items-center gap-3 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                                                <span className="h-px w-4 bg-transparent group-hover:bg-border transition-all" />
                                                {item.label}
                                            </a>
                                        ))}

                                        {slug === 'the-architects-manifesto' && [
                                            { id: 'manifesto', label: 'The Manifesto' },
                                            { id: 'principles', label: 'Core Principles' }
                                        ].map((item, index) => (
                                            <a key={item.id} href={`#${item.id}`} className="group flex items-center gap-3 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                                                <span className="h-px w-4 bg-transparent group-hover:bg-border transition-all" />
                                                {item.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Other Resources */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 pb-4 border-b border-border/40">
                                        Recursos relacionados
                                    </h3>
                                    <ul className="space-y-6">
                                        {(slug === 'web3-ux-challenges' ? [
                                            {
                                                title: "Vitalik on Account Abstraction",
                                                time: "Article",
                                                image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2000&auto=format&fit=crop",
                                                category: "Ethereum",
                                                url: "https://ethereum-magicians.org/t/implementing-account-abstraction-as-part-of-eth1-x/4020"
                                            },
                                            {
                                                title: "Web3 UX Design Principles",
                                                time: "Guide",
                                                image: "https://images.unsplash.com/photo-1642104704074-907c0698b98d?q=80&w=2000&auto=format&fit=crop",
                                                category: "Design",
                                                url: "https://www.nngroup.com/articles/web3-user-experience/"
                                            },
                                            {
                                                title: "EIP-4337 Documentation",
                                                time: "Docs",
                                                image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000&auto=format&fit=crop",
                                                category: "Technical",
                                                url: "https://eips.ethereum.org/EIPS/eip-4337"
                                            }
                                        ] : slug === 'mastering-nextjs-performance' ? [
                                            {
                                                title: "Next.js Core Web Vitals",
                                                time: "Docs",
                                                image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2000&auto=format&fit=crop",
                                                category: "Performance",
                                                url: "https://nextjs.org/docs/app/building-your-application/optimizing"
                                            },
                                            {
                                                title: "Optimize LCP",
                                                time: "Article",
                                                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
                                                category: "Web Vitals",
                                                url: "https://web.dev/lcp/"
                                            },
                                            {
                                                title: "React Profiler Guide",
                                                time: "Guide",
                                                image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2000&auto=format&fit=crop",
                                                category: "Debugging",
                                                url: "https://react.dev/reference/react/Profiler"
                                            }
                                        ] : slug === 'ai-driven-security' ? [
                                            {
                                                title: "NIST AI Safety Institute",
                                                time: "Standard",
                                                image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=2000&auto=format&fit=crop",
                                                category: "Framework",
                                                url: "https://www.nist.gov/isi"
                                            },
                                            {
                                                title: "MITRE ATT&CK",
                                                time: "Docs",
                                                image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop",
                                                category: "Security",
                                                url: "https://attack.mitre.org/"
                                            },
                                            {
                                                title: "Darktrace AI Research",
                                                time: "Paper",
                                                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop",
                                                category: "Research",
                                                url: "https://darktrace.com/research"
                                            }
                                        ] : slug === 'llm-fine-tuning' ? [
                                            {
                                                title: "Unsloth Library",
                                                time: "Repo",
                                                image: "https://images.unsplash.com/photo-1655720357761-f18ea9e5e7e6?q=80&w=2000&auto=format&fit=crop",
                                                category: "Optimization",
                                                url: "https://github.com/unslothai/unsloth"
                                            },
                                            {
                                                title: "Ollama Documentation",
                                                time: "Docs",
                                                image: "https://images.unsplash.com/photo-1596778402284-8398c7b09521?q=80&w=2000&auto=format&fit=crop",
                                                category: "Inference",
                                                url: "https://ollama.com/"
                                            },
                                            {
                                                title: "LoRA Paper",
                                                time: "Paper",
                                                image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2000&auto=format&fit=crop",
                                                category: "Research",
                                                url: "https://arxiv.org/abs/2106.09685"
                                            }
                                        ] : slug === 'smart-contract-security' ? [
                                            {
                                                title: "ConsenSys Audit Best Practices",
                                                time: "Guide",
                                                image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000&auto=format&fit=crop",
                                                category: "Security",
                                                url: "https://consensys.net/blog/developers/blockchain-security-best-practices/"
                                            },
                                            {
                                                title: "OpenZeppelin Documentation",
                                                time: "Docs",
                                                image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2000&auto=format&fit=crop",
                                                category: "Technical",
                                                url: "https://docs.openzeppelin.com/"
                                            }
                                        ] : slug === 'modern-state-management' ? [
                                            {
                                                title: "Zustand Repo",
                                                time: "Repo",
                                                image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2000&auto=format&fit=crop",
                                                category: "Library",
                                                url: "https://github.com/pmndrs/zustand"
                                            },
                                            {
                                                title: "React State Management 2024",
                                                time: "Article",
                                                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop",
                                                category: "Strategy",
                                                url: "https://react.dev/learn/managing-state"
                                            }
                                        ] : slug === 'iot-edge-computing' ? [
                                            {
                                                title: "AWS IoT Core Documentation",
                                                time: "Docs",
                                                image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2000&auto=format&fit=crop",
                                                category: "Cloud",
                                                url: "https://docs.aws.amazon.com/iot/"
                                            },
                                            {
                                                title: "TinyML Official Guide",
                                                time: "Guide",
                                                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
                                                category: "Edge AI",
                                                url: "https://www.tinyml.org/"
                                            }
                                        ] : slug === 'ai-in-healthcare' ? [
                                            {
                                                title: "Stanford AI in Medicine",
                                                time: "Research",
                                                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop",
                                                category: "Academic",
                                                url: "https://aimi.stanford.edu/"
                                            },
                                            {
                                                title: "WHO AI Health Ethics",
                                                time: "Report",
                                                image: "https://images.unsplash.com/photo-1532187863486-abf9d39d99c5?q=80&w=2000&auto=format&fit=crop",
                                                category: "Ethics",
                                                url: "https://www.who.int/publications/i/item/9789240029200"
                                            }
                                        ] : slug === 'the-architects-manifesto' ? [
                                            {
                                                title: "The Digital Gardeners",
                                                time: "Community",
                                                image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2000&auto=format&fit=crop",
                                                category: "Philosophy",
                                                url: "https://maggieappleton.com/garden-history"
                                            }
                                        ] : [
                                            {
                                                title: "AutoGPT & BabyAGI: The Beginning",
                                                time: "Video",
                                                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop",
                                                category: "History",
                                                url: "https://www.youtube.com/results?search_query=AutoGPT+BabyAGI"
                                            },
                                            {
                                                title: "Vector Databases Explained",
                                                time: "Article",
                                                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop",
                                                category: "Technical",
                                                url: "https://www.pinecone.io/learn/vector-database/"
                                            },
                                            {
                                                title: "LLM Orchestration with LangChain",
                                                time: "Docs",
                                                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
                                                category: "Tutorial",
                                                url: "https://python.langchain.com/docs/get_started/introduction"
                                            }
                                        ]).map((resource, i) => (
                                            <li key={i} className="group">
                                                <Link href={resource.url} target="_blank" className="flex gap-4 items-start">
                                                    <div className="relative w-24 aspect-[3/2] rounded-lg overflow-hidden flex-shrink-0 bg-secondary/10 border border-border/40">
                                                        <Image
                                                            src={resource.image}
                                                            alt={resource.title}
                                                            fill
                                                            sizes="96px"
                                                            loading="lazy"
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                                                            <LinkIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5 pt-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                                                {resource.category}
                                                            </span>
                                                        </div>
                                                        <h5 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                            {resource.title}
                                                        </h5>
                                                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                                                            {resource.time === 'Video' ? <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                                            {resource.time}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Tags / Topics (New addition to fill space) */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 pb-4 border-b border-border/40">
                                        Temas en tendencia
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(slug === 'web3-ux-challenges'
                                            ? ['Web3', 'UX', 'Wallet', 'Security', 'Ethereum', 'DeFi', 'Onboarding']
                                            : slug === 'mastering-nextjs-performance'
                                                ? ['Next.js', 'React', 'Performance', 'Web Vitals', 'Edge', 'Vercel']
                                                : slug === 'ai-driven-security'
                                                    ? ['CyberSec', 'AI', 'ZeroTrust', 'ThreatIntel', 'DevSecOps', 'Malware']
                                                    : slug === 'llm-fine-tuning'
                                                        ? ['LLM', 'FineTuning', 'Ollama', 'Python', 'AI', 'OpenSource']
                                                        : slug === 'smart-contract-security'
                                                            ? ['Web3', 'Security', 'Solidity', 'Ethereum', 'Audit', 'Crypto']
                                                            : slug === 'modern-state-management'
                                                                ? ['React', 'Zustand', 'Frontend', 'JavaScript', 'State', 'Redux']
                                                                : slug === 'iot-edge-computing'
                                                                    ? ['IoT', 'Edge', 'Embedded', 'AI', 'Hardware', 'Firmware']
                                                                    : slug === 'ai-in-healthcare'
                                                                        ? ['AI', 'Health', 'Ethics', 'Privacy', 'BioTech', 'MedTech']
                                                                        : ['Agents', 'LLM', 'Automation', 'Enterprise', 'RAG', 'VectorDB', 'Python']
                                        ).map(tag => (
                                            <Link
                                                key={tag}
                                                href={`/blog?q=${tag}`}
                                                className="px-3 py-1.5 bg-secondary/5 hover:bg-primary/10 text-xs font-medium text-muted-foreground hover:text-primary border border-border/40 hover:border-primary/20 rounded-md transition-all"
                                            >
                                                {tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Latest From Blog Section */}
            <div className="container max-w-7xl mx-auto px-6 mt-16 border-t border-border/40 pt-16">
                <div className="flex items-center justify-between mb-12">
                    <h3 className="text-2xl font-black tracking-tight">De las notas</h3>
                    <Link href="/blog" className="px-6 py-2 rounded-lg bg-secondary/10 border border-border/40 text-sm font-bold hover:bg-secondary/20 transition-all">
                        Ver todas las notas
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {portfolioData.blogs.filter(b => b.slug !== slug).slice(0, 2).map((b) => (
                        <div key={b.slug} className="group">
                            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-secondary/5 border border-border/40">
                                <Image src={b.image} alt={b.title} fill sizes="(max-width: 768px) 100vw, 300px" loading="lazy" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                                        {t(`categories.${b.category}`)}
                                    </span>
                                </div>
                            </div>
                            <h4 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors flex items-center gap-2">
                                {b.title}
                            </h4>
                            <p className="text-muted-foreground line-clamp-2 mb-4">{b.excerpt}</p>
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <div className="w-6 h-6 rounded-full bg-secondary/20 relative overflow-hidden">
                                    <Image src={b.author.avatar} alt={b.author.name} loading="lazy" fill sizes="32px" className="object-cover" />
                                </div>
                                {b.author.name} · {b.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
