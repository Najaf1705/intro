"use client";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, WebcamIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { chatSession } from "@/utils/geminiModel";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import moment from "moment";
import { UserAnswer } from "@/utils/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import { eq } from "drizzle-orm";

function RecordAnswer({
  interviewData,
  interviewQuestions,
  activeQuestionIndex,
  setActiveQuestionIndex,
  isEditing,
  setIsEditing,
  setUserAnswer,
  userAnswer,
  interimResult,
  isRecording,
  results,
  startSpeechToText,
  stopSpeechToText,
  webcamEnabled,
  setWebcamEnabled,
  setResults,
  originalAnswer,
  setOriginalAnswer,
  isSaving,
  setIsSaving,
  isProcessing,
  setIsProcessing,
}) {
  // Initial loading state
  if (!interviewQuestions || !Array.isArray(interviewQuestions)) {
    return (
      <div className="flex flex-col justify-center items-center gap-6">
        <Skeleton className="h-72 w-[65%] rounded-lg animate-pulse" />
        <div className="flex justify-evenly flex-wrap w-full gap-4">
          <Skeleton className="h-12 w-40 rounded-lg animate-pulse" />
          <Skeleton className="h-12 w-40 rounded-lg animate-pulse" />
        </div>
        <Skeleton className="w-full mt-4 p-4 h-24 rounded-md bg-secondary text-secondary-foreground"></Skeleton>
      </div>
    );
  }

  const { user } = useUser();
  const { toast } = useToast();

  // Combine transcripts in real-time
  useEffect(() => {
    const combineTranscripts = results
      .filter((result) => typeof result !== "string")
      .map((result) => result.transcript)
      .join(" ");
    setUserAnswer(combineTranscripts);
    if (combineTranscripts) {
      setOriginalAnswer(combineTranscripts); // Store original answer when recording updates
    }
  }, [results]);

  // Toggle edit mode after recording stops
  useEffect(() => {
    if (!isRecording && userAnswer.length > 0 && !isEditing) {
      setIsEditing(true);
      // toast({
      //   variant: "info",
      //   title: "Edit Answer",
      //   description: "You can now edit your recorded answer.",
      // });
    }
  }, [isRecording, userAnswer]);

  const updateAnswerInDb = async () => {
    setIsProcessing(true);
    setIsSaving(true);
    try {
      console.log("userAnswer: ", userAnswer);
      const feedbackPrompt =
        "Question: " +
        interviewQuestions[activeQuestionIndex]?.question +
        ", user Answer: " +
        userAnswer +
        "give the rating for the answer and feedback on how to improve it in 3 to 4 lines." +
        " In JSON format with rating and feedback field";

      const result = await chatSession.sendMessage(feedbackPrompt);
      const feedbackResponse = (result.response.text())
        .replaceAll("```json", "")
        .replaceAll("```", "");
      const jsonFeedbackResponse = JSON.parse(feedbackResponse);

      console.log("feedbackResponse: ", feedbackResponse);

      const existingAnswer = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewData?.mockId))
        .where(eq(UserAnswer.questionId, activeQuestionIndex));

      let insertData;

      if (existingAnswer.length > 0) {
        insertData = await db
          .update(UserAnswer)
          .set({
            userAnswer: userAnswer,
            feedback: jsonFeedbackResponse?.feedback,
            rating: jsonFeedbackResponse?.rating,
            createdAt: moment().format("DD-MM-yyyy"),
          })
          .where(eq(UserAnswer.mockIdRef, interviewData?.mockId))
          .where(eq(UserAnswer.questionId, activeQuestionIndex));
      } else {
        insertData = await db.insert(UserAnswer).values({
          mockIdRef: interviewData?.mockId,
          questionId: activeQuestionIndex,
          question: interviewQuestions[activeQuestionIndex]?.question,
          correctAnswer: interviewQuestions[activeQuestionIndex]?.answer,
          userAnswer: userAnswer,
          feedback: jsonFeedbackResponse?.feedback,
          rating: jsonFeedbackResponse?.rating,
          userEmail: user?.primaryEmailAddress.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        });
      }

      if (insertData) {
        toast({
          variant: "success",
          title: "Answer saved successfully!",
        });
        setUserAnswer("");
        setOriginalAnswer("");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving answer:", error);
    } finally {
      setIsProcessing(false);
      setIsSaving(false);
    }
  };

  const handleEditAnswer = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleSaveEditedAnswer = async () => {
    console.log(results)
    if (userAnswer.length >= 5) {
      try {
        await updateAnswerInDb();
        setIsEditing(false);
        // Clear the results after saving
        setResults([]);
        setUserAnswer("");
        setOriginalAnswer("");
        toast({
          variant: "success",
          title: "Answer Updated",
          description: "Your answer has been saved.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save answer. Please try again.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Answer must be at least 5 characters long.",
      });
    }
  };

  const handleCancelEdit = () => {
    setResults([]); // Clear the results
    startSpeechToText(); // Restart speech-to-text recording
    setIsEditing(false);
    // toast({
    //   variant: "info",
    //   title: "Edit Canceled",
    //   description: "Changes discarded. Original answer restored.",
    // });
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="mt-8 flex flex-col items-center">
        {webcamEnabled ? (
          <Webcam
            onUserMedia={() => setWebcamEnabled(true)}
            onUserMediaError={() => setWebcamEnabled(false)}
            mirrored={true}
            className="h-72 border rounded-lg"
          />
        ) : (
          <WebcamIcon width="65%" height={300} className="p-20 bg-secondary rounded-lg border" />
        )}
      </div>
      <div className="p-2 flex justify-center flex-wrap gap-6">
        <Button
          variant="outline"
          className="my-2 font-bold"
          onClick={isRecording ? stopSpeechToText : startSpeechToText}
          disabled={isEditing} // Disable recording while editing
        >
          {isRecording ? (
            <div className="flex items-center gap-2 text-green-500">
              <Mic />
              <span>Recording...</span>
            </div>
          ) : (
            "Record Response"
          )}
        </Button>
        <Button
          onClick={() => setWebcamEnabled(!webcamEnabled)}
          className="my-2 font-bold"
        >
          {webcamEnabled ? "Turn off webcam" : "Turn on webcam"}
        </Button>
      </div>
      {/* Answer Display Section */}
      <div className="w-full mt-4 p-4 border rounded-md bg-secondary text-secondary-foreground">
        <h2 className="text-lg font-semibold">{isEditing ? "Edit" : "Your Answer:"}</h2>
        {isEditing ? (
          <div className="mt-2">
            <Textarea
              disabled={isSaving}
              value={userAnswer}
              onChange={handleEditAnswer}
              className="w-full text-sm whitespace-normal"
              rows={4}
              placeholder="Edit your answer here..."
            />
            <div className="flex gap-2 mt-2">
              <Button 
                onClick={handleSaveEditedAnswer} 
                disabled={userAnswer.length < 5 || isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Answer"
                )}
              </Button>
              <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                Record Again
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {isProcessing ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 animate-pulse" />
                <Skeleton className="h-4 w-1/2 animate-pulse" />
              </div>
            ) : (
              <p className="text-sm mt-2 whitespace-normal">
                {userAnswer || "Start recording to see your answer here"}
              </p>
            )}
          </div>
        )}
        {interimResult && (
          <p className="text-sm mt-2">
            <strong>Current Speech:</strong> {interimResult}
          </p>
        )}
      </div>
    </div>
  );
}

export default RecordAnswer;