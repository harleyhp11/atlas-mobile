import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contacto',
    description: 'Cuéntanos tu proyecto: te respondemos en menos de 24 horas con una propuesta y un precio cerrado por escrito.',
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
