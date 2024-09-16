"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionsSec from './_components/QuestionsSec';

function StartInterview({params}) {

    const [interviewData,setInterviewData]=useState();
    const [interviewQuestions,setInterviewQuestions]=useState();
    const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);

    useEffect(() => {
      console.log(params);
      getInterviewDetails();
    }, []);

    const getInterviewDetails=async()=>{
      const details=await db.select().from(MockInterview)
      .where(eq(params.interviewId,MockInterview.mockId))
      // console.log(details);
      setInterviewData(details[0]);
      setInterviewQuestions(JSON.parse(details[0]?.jsonMockResponse));
      console.log(JSON.parse(details[0]?.jsonMockResponse));
    }
    
  return (
    <div>
      <div className='grid mt-10 grid-cols-1 md:grid-cols-2'>
        <QuestionsSec 
          interviewQuestions={interviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />
      </div>
    </div>
  )
}

export default StartInterview