'use client';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePerformance } from '@/hooks/usePerformance';
import dynamic from 'next/dynamic';
// react-pdf (pdf.js) touches browser-only globals like DOMMatrix, so it must not be evaluated during SSR.
const PdfViewer = dynamic(
    () => import('@/components/ui/pdf-viewer').then((m) => m.PdfViewer),
    { ssr: false }
);

export default function ResumePage() {
    const { isLowPowerMode } = usePerformance();
    // CV de Harley, servido desde /public. Antes el boton de "abrir" apuntaba
    // a un archivo en el Google Drive del autor de la plantilla. El nombre del
    // archivo es el que recibe quien lo descarga.
    const resumeUrl = "/CV_Harley_Huaman_Pena.pdf";

    return (
        <div className="h-screen bg-background relative flex flex-col pt-24 pb-4 overflow-hidden">

            {/* Header / Controls */}
            <motion.div
                initial={isLowPowerMode ? { opacity: 0 } : { opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container-creative px-6 mb-4 flex-none flex flex-col md:flex-row justify-between items-center gap-4"
            >
                <Link
                    href="/"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Volver al inicio</span>
                </Link>

                <div className="flex items-center gap-4">
                    <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all active:scale-95 shadow-sm"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>Abrir en otra pestaña</span>
                    </a>
                </div>
            </motion.div>

            {/* Visor del CV */}
            <motion.div
                initial={isLowPowerMode ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-6 min-h-0 pb-4 relative"
            >
                <div className="w-full h-full bg-muted/30 rounded-2xl border border-border/50 overflow-hidden relative group">
                    <PdfViewer url={resumeUrl} />
                </div>
            </motion.div>
        </div>
    );
}
