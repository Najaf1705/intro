import React, { useEffect, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, LoaderCircle, Volume2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function QuestionsSec({ interviewQuestions, activeQuestionIndex, setActiveQuestionIndex }) {
  const itemRefs = useRef([]); // Create refs for each CarouselItem

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      console.log("Sorry, can't speak.");
    }
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
  if (
    // true ||
    !interviewQuestions || 
    activeQuestionIndex === null || 
    activeQuestionIndex < 0 || 
    activeQuestionIndex >= interviewQuestions.length
  ) {
    return (
      <div className="backdrop-blur-sm p-5 border rounded-lg">
        <div className="w-full flex justify-center">
          {/* Carousel Skeleton */}
          <Skeleton className="h-16 w-[75%] rounded-md" />
        </div>

        {/* Question Skeleton */}
        <h2 className="mt-5">
          <Skeleton className="h-6 w-3/4 rounded-md" />
        </h2>

        {/* Hear Question Skeleton */}
        <div className="cursor-pointer pt-2 flex gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-1/3 rounded-md" />
        </div>

        {/* Information Skeleton */}
        <div className="mt-10 p-3 rounded-md">
          <Skeleton className="h-6 w-1/4 rounded-md mb-2" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      </div>
    );
  }

  return (
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
                    className={`${
                      activeQuestionIndex == index && 'bg-tertiary'
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

      <div className='mt-10 p-3 text-tertiary bg-yellow-100 border border-yellow-500 rounded-md'>
        <h2 className='flex gap-2'><Lightbulb /><strong>Information</strong></h2>
        <h2 className='flex gap-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae autem voluptatum impedit eligendi? Minima iste illo nobis optio sequi, officia, corrupti beatae, magni omnis reiciendis ut vero velit quibusdam accusamus?</h2>
      </div>
    </div>
  );
}

export default QuestionsSec;
