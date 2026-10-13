import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Servicios',
    description:
        'Los cuatro planes de Atlas con lo que incluye cada uno, cuánto cuesta y en cuánto tiempo lo entregamos. Diseño y desarrollo web desde Lima.',
};

export default function ServiciosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
