'use client';

import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiMail, FiMapPin, FiGithub, FiLinkedin } from "react-icons/fi";
import { SiSpotify, SiInstagram } from "react-icons/si";
import { portfolioData } from "@/data/portfolio";

export const BlogBento = () => {
    return (
        <div className="w-full py-16">
            <div className="mx-auto max-w-5xl px-4">
                {/* Main Grid */}
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    transition={{ staggerChildren: 0.05 }}
                    className="grid grid-cols-12 gap-4"
                >
                    {/* Header Block - Left Side */}
                    <Block className="col-span-12 md:col-span-4">
                        <img
                            src="https://api.dicebear.com/8.x/lorelei-neutral/svg?seed=John"
                            alt="avatar"
                            className="mb-3 size-12 rounded-full"
                        />
                        <h1 className="mb-4 text-xl font-medium leading-tight">
                            Hi, I'm Tom.{" "}
                            <span className="text-muted-foreground">
                                I build cool websites like this one.
                            </span>
                        </h1>
                        <a
                            href={`mailto:${portfolioData.personal.email}`}
                            className="flex items-center gap-1 text-red-400 hover:underline text-sm"
                        >
                            Contact me <FiArrowRight />
                        </a>
                    </Block>

                    {/* Social Blocks - SQUARE 2x2 Grid on Right */}
                    <div className="col-span-12 md:col-span-8 grid grid-cols-2 gap-4">
                        <Block
                            whileHover={{ rotate: "2.5deg", scale: 1.05 }}
                            className="aspect-square bg-gradient-to-br from-blue-500 to-blue-600"
                        >
                            <a
                                href={portfolioData.personal.socialLinks.find(s => s.platform === 'LinkedIn')?.url || "https://linkedin.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="grid h-full place-content-center text-2xl text-white"
                            >
                                <FiLinkedin />
                            </a>
                        </Block>

                        <Block
                            whileHover={{ rotate: "-2.5deg", scale: 1.05 }}
                            className="aspect-square bg-gradient-to-br from-gray-700 to-gray-900"
                        >
                            <a
                                href={portfolioData.personal.socialLinks.find(s => s.platform === 'GitHub')?.url || "https://github.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="grid h-full place-content-center text-2xl text-white"
                            >
                                <FiGithub />
                            </a>
                        </Block>

                        <Block
                            whileHover={{ rotate: "-2.5deg", scale: 1.05 }}
                            className="aspect-square bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"
                        >
                            <a
                                href={portfolioData.personal.socialLinks.find(s => s.platform === 'Instagram')?.url || "https://instagram.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="grid h-full place-content-center text-2xl text-white"
                            >
                                <SiInstagram />
                            </a>
                        </Block>

                        <Block
                            whileHover={{ rotate: "2.5deg", scale: 1.05 }}
                            className="aspect-square bg-gradient-to-br from-green-500 to-green-600"
                        >
                            <a
                                href="https://open.spotify.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="grid h-full place-content-center text-2xl text-white"
                            >
                                <SiSpotify />
                            </a>
                        </Block>
                    </div>

                    {/* About Block */}
                    <Block className="col-span-12 text-base leading-relaxed">
                        <p>
                            <span className="text-foreground font-medium">Construimos cosas que de verdad resuelven algo.</span>{" "}
                            <span className="text-muted-foreground">
                                Somos un estudio de diseño y desarrollo web en Lima. Trabajamos sitios y productos digitales a medida: ordenamos la estructura y el mensaje,
                                diseñamos pantalla por pantalla y escribimos el código. Publicamos, medimos y seguimos acompañando después del lanzamiento.
                            </span>
                        </p>
                    </Block>

                    {/* Location Block */}
                    <Block className="col-span-12 md:col-span-3 flex flex-col items-center gap-3">
                        <FiMapPin className="text-2xl" />
                        <p className="text-center text-sm text-muted-foreground">{portfolioData.personal.location}</p>
                    </Block>

                    {/* Newsletter Block */}
                    <Block className="col-span-12 md:col-span-9" id="newsletter">
                        <p className="mb-3 text-base">Suscríbete a nuestras novedades</p>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                        >
                            <input
                                type="email"
                                placeholder="Tu correo"
                                className="w-full rounded border border-border bg-card px-3 py-1.5 transition-colors focus:border-primary focus:outline-0"
                            />
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 whitespace-nowrap rounded bg-foreground px-3 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                            >
                                <FiMail /> Suscribirme
                            </button>
                        </form>
                    </Block>
                </motion.div>
            </div>
        </div>
    );
};

type BlockProps = {
    className?: string;
    children: React.ReactNode;
    whileHover?: any;
    id?: string;
};

const Block = ({ className, children, whileHover, id }: BlockProps) => {
    return (
        <motion.div
            id={id}
            variants={{
                initial: { scale: 0.5, y: 50, opacity: 0 },
                animate: { scale: 1, y: 0, opacity: 1 },
            }}
            transition={{
                type: "spring",
                mass: 3,
                stiffness: 400,
                damping: 50,
            }}
            whileHover={whileHover}
            className={`rounded-lg border border-border bg-card p-4 ${className || ""}`}
        >
            {children}
        </motion.div>
    );
};
