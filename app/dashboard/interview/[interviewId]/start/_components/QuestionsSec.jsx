import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

function QuestionsSec({ interviewQuestions, activeQuestionIndex, setActiveQuestionIndex }) {
  if (
    !interviewQuestions || 
    activeQuestionIndex === null || 
    activeQuestionIndex < 0 || 
    activeQuestionIndex >= interviewQuestions.length
  ) {
    return <div>Loading question...</div>;
  }

  return (
    <div className='p-5 border rounded-lg'>
       {/* <div className='mx-2 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-5 '>
        {interviewQuestions && interviewQuestions.map((ques, index) => (
          <div className='flex'>
            <h2 onClick={() => setActiveQuestionIndex(index)} className={`cursor-pointer p-2 bg-secondary rounded-full text-center
                        ${activeQuestionIndex == index && 'bg-tertiary'}`}>Q #{index + 1}</h2>
          </div>
        ))}
      </div> */}
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
    </div>
  )
}

export default QuestionsSec
