"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState, useRef } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from 'lucide-react'
import Confetti from 'react-confetti'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter, useSearchParams } from 'next/navigation'

function Feedback({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse query parameters
  const initialShowConfetti = searchParams.get('showCongrats') === 'true';
  const showCongrats = searchParams.get('showCongrats') === 'true';
  const interviewDetails = {
    jobPosition: searchParams.get('jobPosition'),
    jobExperience: searchParams.get('jobExperience'),
    createdAt: searchParams.get('createdAt'),
  };

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(initialShowConfetti);
  const [confettiVisible, setConfettiVisible] = useState(initialShowConfetti); // controls rendering
  const [confettiOpacity, setConfettiOpacity] = useState(1);

  useEffect(() => {
    if (initialShowConfetti) {
      setConfettiVisible(true);
      setConfettiOpacity(1);
      // Start fade out after 2.5s, then hide after 3s
      const fadeTimeout = setTimeout(() => setConfettiOpacity(0), 4000);
      const hideTimeout = setTimeout(() => setConfettiVisible(false), 5000);
      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(hideTimeout);
      };
    } else {
      setConfettiVisible(false);
    }
  }, [initialShowConfetti]);
  const feedbackRefs = useRef([]); // Create refs for each feedback item

  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    setLoading(true);
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    setFeedbackList(result);
    setLoading(false);

    // Show confetti after loading is complete
    setShowConfetti(true);

    // Stop confetti after 3 seconds
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleOpenChange = (isOpen, index) => {
    setFeedbackList((prev) =>
      prev.map((item, i) => ({
        ...item,
        isOpen: i === index ? isOpen : false,
      }))
    );

    // Scroll the opened feedback into view
    if (isOpen && feedbackRefs.current[index]) {
      feedbackRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        // inline: 'nearest',
      });
    }
  };

  return (
    <div className='py-6'>
      {/* Show confetti only if confettiVisible is true */}
      {confettiVisible && (
        <Confetti
          width={window.innerWidth * 0.98}
          height={window.innerHeight}
          style={{
            opacity: confettiOpacity,
            transition: "opacity 0.5s ease-out",
            pointerEvents: "none"
          }}
        />
      )}

      {/* Show skeleton loader if loading */}
      {loading ? (
        <div className='flex flex-col gap-3'>
          {/* Skeleton for Congratulations message */}
          <Skeleton className='h-8 w-1/2 mb-4' />
          <Skeleton className='h-6 w-3/4 mb-6' />

          {/* Skeleton for feedback items */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className='w-full border-2 border-primary rounded-md p-5 bg-secondary'>
              <Skeleton className='h-6 w-1/2 mb-4' />
              <Skeleton className='h-4 w-3/4 mb-2' />
              <Skeleton className='h-4 w-full' />
            </div>
          ))}

          {/* Skeleton for buttons */}
          <div className='flex justify-end gap-6 mt-10'>
            <Skeleton className='h-10 w-32' />
            <Skeleton className='h-10 w-32' />
            <Skeleton className='h-10 w-32' />
          </div>
        </div>
      ) : (
        <div>
          {showCongrats ? (
            <h2 className='text-3xl'>
              <span className='text-tertiary font-semibold'>Congratulations!</span> You have completed your mock interview.
            </h2>
          ) : (
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-tertiary">Interview Details</h2>
              <div className="mt-2 text-lg">
                <div><span className="font-bold">Job Title:</span> {interviewDetails?.jobPosition?.charAt(0).toUpperCase() + interviewDetails?.jobPosition?.slice(1) || "N/A"}</div>
                <div><span className="font-bold">Experience:</span> {interviewDetails?.jobExperience || "N/A"}</div>
                <div>
                  <span className="font-bold">Created At:</span>{" "}
                  {interviewDetails?.createdAt
                    ? interviewDetails.createdAt
                    : "N/A"
                  }
                </div>
              </div>
            </div>
          )}
          <h2 className='text-gray-500 mt-3 font-semibold'>Find below the interview questions and feedback for improvement</h2>

          <div className='flex flex-col gap-3 mt-6'>
            {feedbackList && feedbackList.map((feedback, index) => (
              <Collapsible
                key={index}
                open={feedbackList[index].isOpen}
                onOpenChange={(isOpen) => handleOpenChange(isOpen, index)}
                className='w-full border-2 border-primary rounded-md p-5 bg-secondary'
                ref={(el) => (feedbackRefs.current[index] = el)} // Assign ref to each feedback item
              >
                <CollapsibleTrigger
                  className='flex flex-row justify-between w-full transition-all duration-300 ease-in-out'
                >
                  <h3 className='mr-5 text-left font-bold'>
                    Q{index+1}. {feedback.question}
                  </h3>
                  <div className=''>
                    {feedbackList[index].isOpen ? (
                      <ChevronUp className='text-tertiary align-middle text-center font-bold' size={24} />
                    ) : (
                      <ChevronDown className='text-tertiary align-middle text-center font-bold' size={24} />
                    )}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent
                  className={"transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down duration-300 ease-in-out overflow-hidden"}
                >
                  <div>
                    <h2 className={
                      'mt-2 ' +
                      (feedback.rating >= 4
                        ? 'text-green-500'
                        : feedback.rating >= 2
                          ? 'text-yellow-500'
                          : 'text-red-500')
                    }>
                      <strong>Rating: {feedback.rating}</strong>
                    </h2>

                    <div className='font-bold border-2 border-yellow-600 rounded-md p-5 bg-yellow-50 text-yellow-600 mt-3'>
                      <h3>
                        <strong>Your Answer: </strong>
                        {feedback.userAnswer}
                      </h3>
                    </div>

                    <div className='font-bold border-2 border-green-400 rounded-md p-5 bg-green-50 text-green-600 mt-3'>
                      <h3>
                        <strong>Correct Answer: </strong>
                        {feedback.correctAnswer}
                      </h3>
                    </div>

                    <div className='font-bold border-2 border-blue-600 rounded-md p-5 bg-blue-50 text-blue-600 mt-3'>
                      <h3>
                        <strong>Feedback: </strong>
                        {feedback.feedback}
                      </h3>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          <div className='flex flex-wrap justify-center lg:justify-end  gap-6 mt-10'>
            <button className='bg-tertiary text-white font-semibold hover:bg-slate-500 px-6 py-2 rounded-md'
              onClick={() => router.replace("/dashboard")}
            >Go to Dashboard</button>
            <button className='bg-tertiary text-white font-semibold hover:bg-slate-500 px-6 py-2 rounded-md'>Download Feedback</button>
            <button className='bg-tertiary text-white font-semibold hover:bg-slate-500 px-6 py-2 rounded-md'>Share Feedback</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feedback;