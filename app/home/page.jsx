"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HomePage = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen mt-24 bg-background text-foreground font-saria">
            {/* Hero Section */}
            <section className="text-center px-6 md:px-24 py-4 ">
                <h2 className="text-left">
                    <span className="text-outline font-saria font-extrabold text-5xl md:text-6xl lg:text-8xl mb-1 block">
                        {"AI Superpower"}
                    </span>
                    <br />
                    <span className="text-muted-foreground font-extrabold text-2xl md:text-4xl lg:text-5xl">
                        A better way to improve your interview chances and skills
                    </span>
                </h2>
                <p className="text-left font-normal text-xl">
                    Boost your interview skills and increase your success with AI-driven insights. Discover a smarter way to
                    prepare, practice, and stand out.
                </p>
                {/* <div className="flex flex-col items-end space-x-8">
                    <div>250k+ Offers Received</div>
                    <div>1.2M+ Interview Access</div>
                </div> */}
            </section>

            {/* Additional Info Section */}
            <section className="flex justify-center px-6 py-16">
                <div className="max-w-4xl flex items-center">

                    <div>
                        <p className="text-muted-foreground mb-4">
                            Unleash your potential with personalized AI insights and targeted interview practice.
                        </p>
                        <p className="text-muted-foreground mb-4">
                            Transform the way you prepare, gain confidence, and boost your chances of landing your dream job. Let AI
                            be your edge in today's competitive job market.
                        </p>
                        <button className="bg-tertiary text-white px-4 py-2 rounded"
                            onClick={() => router.replace("/dashboard")}
                        >
                            Practice
                        </button>
                    </div>

                    <Image
                        src="/images/ai.jpg"
                        alt="Office Setup"
                        width={500}
                        height={500}
                        className="object-cover rounded-lg mr-8"
                    />

                </div>
            </section>

            {/* Main Image Section */}
            {/* <section className="relative px-6 py-8">
                <Image
                    src="/images/homeHero.jpg"
                    alt="AI Interview Practice"
                    width={1200}
                    height={400}
                    className="w-full h-64 object-top rounded-lg"
                />
            </section> */}

            {/* Partners Section */}
            {/* <section className="relative overflow-hidden py-16">
                <div className="marquee">
                    <div className="marquee-content">
                        {[
                            { src: "/images/firebase.png", alt: "Firebase" },
                            { src: "/images/microsoft.png", alt: "Microsoft" },
                            { src: "/images/meet.png", alt: "Google Meet" },
                            { src: "/images/tailwindcss.png", alt: "Tailwind CSS" },
                            { src: "/images/zoom.png", alt: "Zoom" },
                        ].map((partner, index) => (
                            <Image
                                key={index}
                                src={partner.src}
                                alt={partner.alt}
                                width={150}
                                height={150}
                                className="w-36 h-36 xl:w-44 xl:h-44 object-contain transition-all duration-300 mx-6"
                            />
                        ))} */}
                        {/* Duplicate content for seamless scrolling */}
                        {/* {[
                            { src: "/images/firebase.png", alt: "Firebase" },
                            { src: "/images/microsoft.png", alt: "Microsoft" },
                            { src: "/images/meet.png", alt: "Google Meet" },
                            { src: "/images/tailwindcss.png", alt: "Tailwind CSS" },
                            { src: "/images/zoom.png", alt: "Zoom" },
                        ].map((partner, index) => (
                            <Image
                                key={`duplicate-${index}`}
                                src={partner.src}
                                alt={partner.alt}
                                width={150}
                                height={150}
                                className="w-36 h-36 xl:w-44 xl:h-44 object-contain transition-all duration-300 mx-6"
                            />
                        ))}
                    </div>
                </div>
            </section> */}

            {/* Additional Info Section
            <section className="flex justify-center px-6 py-16">
                <div className="max-w-4xl flex items-center">
                    <Image
                        src="/images/ai.jpg"
                        alt="Office Setup"
                        width={500}
                        height={500}
                        className="object-cover rounded-lg mr-8"
                    />

                    <div>
                        <p className="text-muted-foreground mb-4">
                            Unleash your potential with personalized AI insights and targeted interview practice.
                        </p>
                        <p className="text-muted-foreground mb-4">
                            Transform the way you prepare, gain confidence, and boost your chances of landing your dream job. Let AI
                            be your edge in today's competitive job market.
                        </p>
                        <button className="bg-tertiary text-white px-4 py-2 rounded">
                            Generate
                        </button>
                    </div>
                </div>
            </section> */}
        </div>
    );
};

export default HomePage;