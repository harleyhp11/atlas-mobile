import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Capacidades',
    description: 'Atlas es un estudio digital en Lima. Diseñamos y desarrollamos sitios web, tiendas en línea, software a medida y aplicaciones. Estas son las capacidades y las tecnologías con las que trabajamos.',
};

export default function SkillsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
