import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Proyectos',
    description: 'Una selección del trabajo de diseño y desarrollo web que hacemos en Atlas.',
};

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
