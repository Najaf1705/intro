"use client"
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, LoaderCircle, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'

function Interview({ params }) {
    const [interviewData, setInterviewData] = useState(null); // Data state
    const [webcamEnabled, setWebcamEnabled] = useState(false); // Webcam state
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        getInterviewDetails();
    }, []);

    const getInterviewDetails = async () => {
        try {
            setLoading(true); // Start loading
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));

            setInterviewData(result[0]);
        } catch (error) {
            console.error("Error fetching interview data:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    if (loading) {
        return (
            <div className="mx-10 my-20">
                <h2 className="text-2xl font-bold mb-5">
                    <Skeleton className="h-8 w-48" />
                </h2>
                <div className="w-full grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="flex flex-col">
                        <div className="bg-secondary gap-5 p-5 border rounded-md">
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                        <div className="my-5 p-5 text-tertiary rounded-md">
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <Skeleton className="h-72 w-72 rounded-lg" />
                        <Skeleton className="h-10 w-48 mt-2 rounded-md" />
                    </div>
                </div>
                <div className="mt-5 flex flex-col items-center">
                    <Skeleton className="h-12 w-48 rounded-md" />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-10 my-20">
            <h2 className="text-2xl font-bold mb-5">Let's get started</h2>
            <div className="w-full grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="flex flex-col">
                    <div className="bg-secondary gap-5 p-5 border rounded-md">
                        <h2 className="text-lg"><strong>Job Role/Job Position:</strong> {interviewData?.jobPosition}</h2>
                        <h2 className="text-lg"><strong>Job Description:</strong> {interviewData?.jobDesc}</h2>
                        <h2 className="text-lg"><strong>Job Experience:</strong> {interviewData?.jobExperience}</h2>
                    </div>
                    <div className="my-5 p-5 text-tertiary bg-yellow-100 border border-yellow-500 rounded-md">
                        <h2 className="flex gap-2"><Lightbulb /><strong>Information</strong></h2>
                        <h2 className="flex gap-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae autem voluptatum impedit eligendi? Minima iste illo nobis optio sequi, officia, corrupti beatae, magni omnis reiciendis ut vero velit quibusdam accusamus?</h2>
                    </div>
                </div>
                {webcamEnabled ? (
                    <div className="flex flex-col items-center">
                        <Webcam
                            onUserMedia={() => setWebcamEnabled(true)}
                            onUserMediaError={() => setWebcamEnabled(false)}
                            mirrored={true}
                            className="h-72 border rounded-lg"
                        />
                        <Button
                            variant="outline"
                            onClick={() => setWebcamEnabled(false)}
                            className="my-2 font-bold"
                        >
                            Turn off webcam and mic
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <WebcamIcon className="w-72 h-72 p-20 bg-secondary rounded-lg border" />
                        <Button
                            variant="outline"
                            onClick={() => setWebcamEnabled(true)}
                            className="my-2 font-bold"
                        >
                            Turn on webcam and mic
                        </Button>
                    </div>
                )}
            </div>
            <div className="mt-5 flex flex-col items-center">
                <Link href={`/dashboard/interview/${interviewData?.mockId}/start/`}>
                    <Button variant="tertiary" className="font-bold text-lg">
                        Start Interview
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default Interview;
