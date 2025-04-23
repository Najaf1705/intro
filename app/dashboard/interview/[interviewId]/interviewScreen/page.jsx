"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import QuestionsSec from './QuestionsSec';
import RecordAnswer from './RecordAnswer';
import { useSelector } from 'react-redux';

function StartInterview({ params }) {
  const currentInterviewDetail = useSelector(
    (state) => state.currentInterviewDetail.data
  );

  const [interviewData, setInterviewData] = useState();
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    console.log('Interview ID:', params.interviewId); // Log the interviewId
    console.log('Params: ', params);

    // Set questions from Redux slice
    if (currentInterviewDetail?.questions?.length > 0) {
      setInterviewQuestions(currentInterviewDetail.questions);
    } else {
      console.warn('No questions found in currentInterviewDetail slice.');
    }

    // Fetch interview details from the database
    getInterviewDetails();
  }, [currentInterviewDetail]);

  const getInterviewDetails = async () => {
    try {
      const details = await db
        .select()
        .from(MockInterview)
        .where(eq(currentInterviewDetail.mockId, MockInterview.mockId));

      console.log('Interview Details:', details);
      setInterviewData(details[0]);

      // If questions are not already set, parse them from the database
      if (details[0]?.jsonMockResponse) {
        setInterviewQuestions(JSON.parse(details[0]?.jsonMockResponse));
      }
    } catch (error) {
      console.error('Error fetching interview details:', error);
    }
  };

  return (
    <div className="min-h-auto flex flex-col items-center mb-4">
      <div className="grid mt-12 grid-cols-1 md:grid-cols-2 gap-10 w-full">
        <div className="self-start">
          <QuestionsSec
            interviewQuestions={interviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
          />
        </div>
        <div className="self-start">
          <RecordAnswer
            interviewData={interviewData}
            interviewQuestions={interviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
          />
        </div>
      </div>
    </div>
  );
}

export default StartInterview;