"use client"
import { Button } from '@/components/ui/button';
import { LoaderCircle, Mic, WebcamIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { chatSession } from '@/utils/geminiModel';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import moment from 'moment';
import { UserAnswer } from '@/utils/schema';
import { Skeleton } from "@/components/ui/skeleton"
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Import your dialog component
import { useRouter } from 'next/navigation';


function RecordAnswer({interviewData, interviewQuestions, activeQuestionIndex, setActiveQuestionIndex}) {
    if (
        // true || 
        !interviewQuestions || 
        !Array.isArray(interviewQuestions) || 
        interviewQuestions.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center gap-6">
                <Skeleton className="h-72 w-[65%] rounded-lg" /> {/* Webcam Skeleton */}
                <div className="flex justify-evenly flex-wrap w-full gap-4">
                    <Skeleton className="h-12 w-40 rounded-lg" /> {/* Button Skeleton 1 */}
                    <Skeleton className="h-12 w-40 rounded-lg" /> {/* Button Skeleton 2 */}
                    <Skeleton className="h-12 w-40 rounded-lg" /> {/* Button Skeleton 3 */}
                </div>
                <Skeleton className="h-6 w-1/2 rounded-lg" /> {/* Text Skeleton */}
            </div>
        );
    }
    const [userAnswer,setUserAnswer]=useState('');
    const [webcamEnabled,setWebcamEnabled]=useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
    
    const {user}=useUser();
    const { toast } = useToast();
    const router = useRouter();

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        if (results && results.length > 0) {
            const latestResult = results[results.length - 1]?.transcript || '';
            if (latestResult.trim()) {
                setUserAnswer((prevAnswer) => prevAnswer + latestResult + ' ');
            }
        }
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length >= 5) {
            updateAnswerInDb();
        } 
    }, [userAnswer]);


    const updateAnswerInDb=async()=>{
        console.log("userAnswer: ",userAnswer);
        const feedbackPrompt="Question: "+interviewQuestions[activeQuestionIndex]?.question+
            ", user Answer: "+userAnswer+"give the rating for the answer and feedback on how to improve it in 3 to 4 lines."+
            " In JSON format with rating and feedback field";

        const result=await chatSession.sendMessage(feedbackPrompt);
        const feedbackResponse=(result.response.text()).replaceAll('```json','').replaceAll('```','');
        const jsonFeedbackResponse=JSON.parse(feedbackResponse);
        
        console.log("feedbackResponse: "+feedbackResponse);

        const insertData=await db.insert(UserAnswer).values({
            mockIdRef:interviewData?.mockId,
            question:interviewQuestions[activeQuestionIndex]?.question,
            correctAnswer:interviewQuestions[activeQuestionIndex]?.answer,
            userAnswer:userAnswer,
            feedback:jsonFeedbackResponse?.feedback,
            rating:jsonFeedbackResponse?.rating,
            userEmail:user?.primaryEmailAddress.emailAddress,
            createdAt:moment().format('DD-MM-yyyy'),
        })
        if(insertData){
            toast({
                variant: 'success',
                title: 'Answer saved successfully!',
            })
            setResults([]); // Clear the results after saving to the database
            setUserAnswer(""); // Clear the user answer
        }
        setUserAnswer
    }

    const handleEndInterview = () => {
        setIsDialogOpen(true); // Open the dialog
    };

    const confirmEndInterview = () => {
        setIsDialogOpen(false); // Close the dialog
        // Redirect to feedback page
        
        router.push(`/dashboard/interview/${interviewData?.mockId}/feedback`);
    };
      
      
  return (
    <div className='flex flex-col justify-center'>
        <div className='mt-8 flex flex-col items-center'>
            {webcamEnabled?(
                <Webcam
                    onUserMedia={() => setWebcamEnabled(true)}
                    onUserMediaError={() => setWebcamEnabled(false)}
                    mirrored={true}
                    className=' h-72 border rounded-lg'
                />
            ):(
                <WebcamIcon width={'65%'} height={300} className='p-20 bg-secondary rounded-lg border' />
            )}
        </div>
        <div className='p-2 flex justify-center flex-wrap gap-6'>
            <Button variant="outline" className='my-2 font-bold'
                onClick={isRecording?stopSpeechToText:startSpeechToText}>
                  {isRecording ? (
                      <div className="flex items-center gap-2 text-green-500">
                          <Mic />
                          <span>Recording...</span>
                      </div>
                  ) : (
                      'Record Response'
                  )}
            </Button>
            {/* <Button onClick={()=>console.log(userAnswer)}>show answer</Button> */}
            <Button onClick={() => setWebcamEnabled(!webcamEnabled)} className='my-2 font-bold'>{webcamEnabled?"Turn off webcam":"Turn on webcam"}</Button>
        </div>
        <div className='flex justify-center flex-wrap w-full gap-6 mt-6'>
            <Button className="font-bold"
                disabled={activeQuestionIndex <= 0} // Disable if at the first question
                onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
            >
                Previous Question
            </Button>

            {activeQuestionIndex < interviewQuestions.length - 1 &&
                <Button className="font-bold"
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                >
                    Next Question
                </Button>
            }
            {activeQuestionIndex===interviewQuestions.length - 1 &&
                <Button
                    className='bg-tertiary text-white font-semibold hover:bg-gray-600'
                    onClick={handleEndInterview}
                >
                    End Interview
                </Button>
            }
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-secondary text-secondary-foreground">
                <DialogHeader>
                    <DialogTitle>End Interview</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to end the interview? You won't be able to return to this session.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="tertiary" onClick={confirmEndInterview}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default RecordAnswer