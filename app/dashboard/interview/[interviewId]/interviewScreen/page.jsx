"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionsSec from './QuestionsSec';
import RecordAnswer from './RecordAnswer';
import { useSelector } from 'react-redux';
import useSpeechToText from 'react-hook-speech-to-text';
import { Loader2 } from "lucide-react";

function StartInterview({ params }) {
  const currentInterviewDetail = useSelector(
    (state) => state.currentInterviewDetail.data
  );

  const [interviewData, setInterviewData] = useState();
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [originalAnswer, setOriginalAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  useEffect(() => {
    const initializeInterview = async () => {
      setIsLoading(true);
      try {
        if (currentInterviewDetail?.questions?.length > 0) {
          setInterviewQuestions(currentInterviewDetail.questions);
        }
        await getInterviewDetails();
      } catch (error) {
        console.error('Error initializing interview:', error);
      } finally {
        setIsLoading(false);
        setIsLoadingQuestions(false);
      }
    };

    initializeInterview();
  }, [currentInterviewDetail]);

  // Update getInterviewDetails to use loading state
  const getInterviewDetails = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-auto flex flex-col items-center mb-4">
      <div className="grid mt-12 grid-cols-1 md:grid-cols-2 gap-10 w-full">
        <div className="self-start">
          <QuestionsSec
            isLoading={isLoadingQuestions}
            interviewData={interviewData}
            interviewQuestions={interviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setUserAnswer={setUserAnswer}
            setOriginalAnswer={setUserAnswer} // Assuming this is the correct prop to set the original answer
          />
        </div>
        <div className="self-start">
          <RecordAnswer
            isSaving={isSaving}
            setIsSaving={setIsSaving}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            webcamEnabled={webcamEnabled}
            setWebcamEnabled={setWebcamEnabled}
            originalAnswer={originalAnswer}
            setOriginalAnswer={setOriginalAnswer}
            interimResult={interimResult}
            isRecording={isRecording}
            results={results}
            setResults={setResults}
            startSpeechToText={startSpeechToText}
            stopSpeechToText={stopSpeechToText}
            interviewData={interviewData}
            interviewQuestions={interviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
          />
        </div>
      </div>
    </div>
  );
}

export default StartInterview;