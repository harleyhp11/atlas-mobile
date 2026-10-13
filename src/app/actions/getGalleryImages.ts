'use server';

import fs from 'fs';
import path from 'path';

export interface GalleryImage {
    src: string;
    filename: string;
}

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
    const publicDir = path.join(process.cwd(), 'public');
    const galleryDir = path.join(publicDir, 'gallery');

    try {
        if (!fs.existsSync(galleryDir)) {
            return [];
        }

        const files = fs.readdirSync(galleryDir);

        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

        const images = files
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return imageExtensions.includes(ext);
            })
            .map(file => ({
                src: `/gallery/${file}`,
                filename: file,
                mtime: fs.statSync(path.join(galleryDir, file)).mtimeMs,
            }));

        /* LO MAS NUEVO PRIMERO.

           Antes esto devolvia el orden crudo del sistema de archivos y la
           rejilla lo acababa ordenando alfabeticamente. Con eso, y como la
           rejilla solo pinta 12 piezas de entrada, cualquier archivo nuevo
           cuyo nombre cayera pasada la letra "e" no se veia hasta pulsar "ver
           mas" — que es justo lo que pasaba con la maqueta de la app de golf,
           que quedaba en la posicion 14 de 17.

           Ordenando por fecha de archivo, lo que subimos aparece arriba solo,
           sin depender de como se llame. */
        images.sort((a, b) => b.mtime - a.mtime);

        return images.map(({ src, filename }) => ({ src, filename }));
    } catch (error) {
        console.error('Error reading gallery directory:', error);
        return [];
    }
}
