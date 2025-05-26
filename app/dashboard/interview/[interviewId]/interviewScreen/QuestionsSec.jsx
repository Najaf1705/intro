import React, { useEffect, useRef, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Timer, Lightbulb, AlertCircle, Volume2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';

function QuestionsSec({ 
  interviewData, 
  interviewQuestions, 
  activeQuestionIndex, 
  setActiveQuestionIndex, 
  isEditing, 
  setIsEditing, 
  setUserAnswer, 
  setOriginalAnswer, 
  isRecording,
  isLoading 
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const itemRefs = useRef([]); // Create refs for each CarouselItem
  const router = useRouter(); // Initialize router

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      console.log("Sorry, can't speak.");
    }
  };

  // Add this function to handle question navigation
  const handleQuestionChange = (newIndex) => {
    setActiveQuestionIndex(newIndex);
    setUserAnswer("");
    setOriginalAnswer("");
    setIsEditing(false);
  };


  const handleEndInterview = () => {
    setIsDialogOpen(true);
  };

  const confirmEndInterview = () => {
    setIsDialogOpen(false);
    router.push(`/dashboard/interview/${interviewData?.mockId}/feedback/?showCongrats=true`);
  };

  // Scroll to the active question
  useEffect(() => {
    if (itemRefs.current[activeQuestionIndex]) {
      itemRefs.current[activeQuestionIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, [activeQuestionIndex]);

  // If data is not ready, show a loading screen
  if (isLoading || !interviewQuestions) {
    return (
      <div>
        <div className="backdrop-blur-sm p-5 border rounded-lg space-y-4">
          <div className="w-full flex justify-center">
            <Skeleton className="h-16 w-[75%] rounded-md animate-pulse" />
          </div>
          <Skeleton className="h-8 w-3/4 rounded-md animate-pulse" />
          <Skeleton className="h-6 w-1/3 rounded-md animate-pulse" />
          <div className="mt-10 p-3 space-y-2">
            <Skeleton className="h-6 w-1/4 rounded-md animate-pulse" />
            <Skeleton className="h-20 w-full rounded-md animate-pulse" />
          </div>
        </div>
        <div className="flex justify-center flex-wrap w-full gap-6 mt-6">
          <Skeleton className="h-12 w-40 rounded-lg animate-pulse" />
          <Skeleton className="h-12 w-40 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='backdrop-blur-sm p-5 border rounded-lg'>
        <div className='w-full flex justify-center'> {/* Centering the carousel */}
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-[75%] mx-auto" // Set carousel width to 80% of parent
          >
            <CarouselContent className="flex gap-4"> {/* Added space between items */}
              {interviewQuestions && interviewQuestions.map((ques, index) => (
                <CarouselItem
                  key={index}
                  ref={(el) => (itemRefs.current[index] = el)} // Assign ref to each item
                  className={`flex-shrink-0 sm:basis-1/3 lg:basis-1/3 p-1`}
                >
                  <div className="w-16 h-16 mx-auto"> {/* Adjusted size for better responsiveness */}
                    <Card
                      onClick={() => setActiveQuestionIndex(index)}
                      className={`${activeQuestionIndex == index && 'bg-tertiary'
                        }`}
                    >
                      <CardContent className="cursor-pointer flex items-center justify-center p-2">
                        <span className="text-lg font-semibold">Q{index + 1}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-gray-500 hover:text-black" />
            <CarouselNext className="text-gray-500 hover:text-black" />
          </Carousel>
        </div>

        <h2 className='mt-5 text-lg font-bold'>Q{activeQuestionIndex + 1}. {interviewQuestions[activeQuestionIndex]?.question}</h2>

        <div className='pt-2 flex text-tertiary'>
          <Volume2 />
          <span className='ml-1 cursor-pointer' onClick={() => textToSpeech(interviewQuestions[activeQuestionIndex]?.question)}>
            Hear Question
          </span>
        </div>

        <div className='space-y-4 mt-6'>
          {/* Essential Tips */}
          
          <div className='p-3 text-tertiary bg-yellow-50/80 border border-yellow-300 rounded-md'>
            <h3 className='flex items-center gap-2 text-yellow-800 font-semibold mb-1'>
              <Lightbulb className="h-4 w-4" />
              <span>Quick Tips</span>
            </h3>
            <p className='text-sm text-yellow-700'>
              Use STAR method • Provide examples • Be concise • Focus on achievements
            </p>
          </div>

          {/* Time Info */}
          <div className='p-3 text-blue-700 bg-blue-50/80 border border-blue-200 rounded-md'>
            <div className='flex items-center gap-2 text-sm'>
              <Timer className="h-4 w-4" />
              <span>Recommended time: 2-3 minutes</span>
            </div>
          </div>

          {/* Show only for last question */}
          {activeQuestionIndex === interviewQuestions.length - 1 && (
            <div className='p-3 text-rose-700 bg-rose-50/80 border border-rose-200 rounded-md'>
              <div className='flex items-center gap-2 text-sm'>
                <AlertCircle className="h-4 w-4" />
                <span>Final question - Review all answers before ending</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center flex-wrap w-full gap-6 mt-6">
        <Button
          className="font-bold"
          disabled={activeQuestionIndex <= 0 || isEditing || isRecording} // Disable navigation while editing
          onClick={() => handleQuestionChange(activeQuestionIndex - 1)}
        >
          Previous Question
        </Button>
        {activeQuestionIndex < interviewQuestions.length - 1 && (
          <Button
            className="font-bold"
            disabled={isEditing || isRecording} // Disable navigation while editing
            onClick={() => handleQuestionChange(activeQuestionIndex + 1)}
          >
            Next Question
          </Button>
        )}
        {activeQuestionIndex === interviewQuestions.length - 1 && (
          <Button
            className="bg-tertiary text-white font-semibold hover:bg-gray-600"
            disabled={isEditing || isRecording} // Disable while editing
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

export default QuestionsSec;
