"use client";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Mic, WebcamIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { chatSession } from "@/utils/geminiModel";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import moment from "moment";
import { UserAnswer } from "@/utils/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component

function RecordAnswer({ interviewData, interviewQuestions, activeQuestionIndex, setActiveQuestionIndex }) {
  if (!interviewQuestions || !Array.isArray(interviewQuestions) || interviewQuestions.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-6">
        <Skeleton className="h-72 w-[65%] rounded-lg" />
        <div className="flex justify-evenly flex-wrap w-full gap-4">
          <Skeleton className="h-12 w-40 rounded-lg" />
          <Skeleton className="h-12 w-40 rounded-lg" />
          <Skeleton className="h-12 w-40 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-1/2 rounded-lg" />
      </div>
    );
  }

  const [userAnswer, setUserAnswer] = useState("");
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalAnswer, setOriginalAnswer] = useState(""); // Store original answer for canceling edits

  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

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
      toast({
        variant: "info",
        title: "Edit Answer",
        description: "You can now edit your recorded answer.",
      });
    }
  }, [isRecording, userAnswer]);

  const updateAnswerInDb = async () => {
    console.log("userAnswer: ", userAnswer);
    const feedbackPrompt =
      "Question: " +
      interviewQuestions[activeQuestionIndex]?.question +
      ", user Answer: " +
      userAnswer +
      "give the rating for the answer and feedback on how to improve it in 3 to 4 lines." +
      " In JSON format with rating and feedback field";

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const feedbackResponse = (result.response.text()).replaceAll("```json", "").replaceAll("```", "");
      const jsonFeedbackResponse = JSON.parse(feedbackResponse);

      console.log("feedbackResponse: ", feedbackResponse);

      const insertData = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: interviewQuestions[activeQuestionIndex]?.question,
        correctAnswer: interviewQuestions[activeQuestionIndex]?.answer,
        userAnswer: userAnswer,
        feedback: jsonFeedbackResponse?.feedback,
        rating: jsonFeedbackResponse?.rating,
        userEmail: user?.primaryEmailAddress.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });

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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save answer. Please try again.",
      });
    }
  };

  const handleEndInterview = () => {
    setIsDialogOpen(true);
  };

  const confirmEndInterview = () => {
    setIsDialogOpen(false);
    router.push(`/dashboard/interview/${interviewData?.mockId}/feedback/?showCongrats=true`);
  };

  const handleEditAnswer = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleSaveEditedAnswer = async () => {
    if (userAnswer.length >= 5) {
      try {
        await updateAnswerInDb();
        setIsEditing(false);
        // Clear the results after saving
        resetResults();
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
    setUserAnswer(originalAnswer);
    setIsEditing(false);
    toast({
      variant: "default",
      title: "Edit Canceled",
      description: "Changes discarded. Original answer restored.",
    });
  };

  // Add this function to handle question navigation
  const handleQuestionChange = (newIndex) => {
    setActiveQuestionIndex(newIndex);
    setUserAnswer("");
    setOriginalAnswer("");
    setIsEditing(false);
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
      <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
        <h2 className="text-lg font-semibold">Your Answer:</h2>
        {isEditing ? (
          <div className="mt-2">
            <Textarea
              value={userAnswer}
              onChange={handleEditAnswer}
              className="w-full text-sm text-gray-700 whitespace-normal"
              rows={4}
              placeholder="Edit your answer here..."
            />
            <div className="flex gap-2 mt-2">
              <Button onClick={handleSaveEditedAnswer} disabled={userAnswer.length < 5}>
                Save Answer
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm mt-2 text-gray-700 whitespace-normal">
            {userAnswer || "Start recording to see your answer here"}
          </p>
        )}
        {interimResult && (
          <p className="text-sm text-gray-500 mt-2">
            <strong>Current Speech:</strong> {interimResult}
          </p>
        )}
      </div>
      <div className="flex justify-center flex-wrap w-full gap-6 mt-6">
        <Button
          className="font-bold"
          disabled={activeQuestionIndex <= 0 || isEditing} // Disable navigation while editing
          onClick={() => handleQuestionChange(activeQuestionIndex - 1)}
        >
          Previous Question
        </Button>
        {activeQuestionIndex < interviewQuestions.length - 1 && (
          <Button
            className="font-bold"
            disabled={isEditing} // Disable navigation while editing
            onClick={() => handleQuestionChange(activeQuestionIndex + 1)}
          >
            Next Question
          </Button>
        )}
        {activeQuestionIndex === interviewQuestions.length - 1 && (
          <Button
            className="bg-tertiary text-white font-semibold hover:bg-gray-600"
            disabled={isEditing} // Disable while editing
            onClick={handleEndInterview}
          >
            End Interview
          </Button>
        )}
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
  );
}

export default RecordAnswer;