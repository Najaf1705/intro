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
import { Skeleton } from '@/components/ui/skeleton' // Import Skeleton component
import { useRouter } from 'next/navigation'

function Feedback({ params }) {
  const router = useRouter();

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false); // Confetti will show only after loading
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

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
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
    <div className='py-14'>
      {/* Show confetti only after loading is complete */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth * 0.98}
          height={window.innerHeight}
          style={{
            opacity: showConfetti ? 1 : 0, // Gradually fade out
            transition: "opacity 1s ease-out", // Smooth fade-out transition
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
          <h2 className='text-3xl'>
            <span className='text-tertiary font-semibold'>Congratulations!</span> You have completed your mock interview.
          </h2>
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