"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lightbulb, UserCheck, Rocket, ShieldCheck } from "lucide-react";

const HomePage = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen mt-12 bg-background text-foreground font-saria">
            {/* Hero Section */}
            <section className="flex flex-col mb-12 justify-center min-h-[80vh] md:min-h-[90vh] text-center px-6 md:px-24 py-4">
                <h1 className="text-left">
                    <span className="text-outline font-saria font-extrabold text-5xl md:text-6xl lg:text-8xl mb-1 block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                        Intro <br/>
                        AI Interview Coach.
                    </span>
                    <br />
                    <span className="font-extrabold text-2xl md:text-4xl lg:text-5xl bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
                        Practice. Improve. Succeed.
                    </span>
                </h1>
                <p className="text-left font-normal text-xl mt-2">
                    Get instant feedback, real interview questions, and actionable tips—powered by AI.
                </p>
                <div className="flex flex-wrap gap-4 mt-6">
                    <button
                        className="bg-tertiary text-white px-6 py-3 rounded font-bold text-lg shadow hover:bg-tertiary/90 transition"
                        onClick={() => router.replace("/dashboard")}
                    >
                        Start Practicing
                    </button>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="flex flex-col md:flex-row justify-center items-center gap-10 px-6 py-12 bg-secondary/50">
                <div className="flex flex-col gap-6 max-w-2xl">
                    <div className="flex items-center gap-3">
                        <Lightbulb className="text-tertiary" size={32} />
                        <span className="font-semibold text-lg">AI-Powered Feedback</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <UserCheck className="text-tertiary" size={32} />
                        <span className="font-semibold text-lg">Realistic Mock Interviews</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Rocket className="text-tertiary" size={32} />
                        <span className="font-semibold text-lg">Instant Improvement Tips</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-tertiary" size={32} />
                        <span className="font-semibold text-lg">Private & Secure</span>
                    </div>
                </div>
                <Image
                    src="/images/ai.jpg"
                    alt="AI Interview"
                    width={400}
                    height={400}
                    className="object-cover rounded-lg shadow-lg"
                />
            </section>

            {/* Quick Steps Section */}
            <section className="px-6 py-12 text-center">
                <h2 className="text-2xl font-bold mb-6">How It Works</h2>
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                    <div className="bg-secondary rounded-lg p-6 w-full max-w-xs shadow">
                        <span className="text-3xl font-bold text-tertiary">1</span>
                        <p className="mt-2 font-semibold">Choose your job role</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-6 w-full max-w-xs shadow">
                        <span className="text-3xl font-bold text-tertiary">2</span>
                        <p className="mt-2 font-semibold">Practice with AI-driven questions</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-6 w-full max-w-xs shadow">
                        <span className="text-3xl font-bold text-tertiary">3</span>
                        <p className="mt-2 font-semibold">Get instant feedback & improve</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="text-center py-10">
                <h3 className="text-xl font-semibold mb-4">Ready to ace your next interview?</h3>
                <button
                    className="bg-tertiary text-white px-8 py-3 rounded font-bold text-lg shadow hover:bg-tertiary/90 transition"
                    onClick={() => router.replace("/dashboard")}
                >
                    Try Now—It's Free
                </button>
            </section>
        </div>
    );
};

export default HomePage;