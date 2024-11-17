import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, Volume2 } from 'lucide-react';

function QuestionsSec({ interviewQuestions, activeQuestionIndex, setActiveQuestionIndex }) {

  const textToSpeech=(text)=>{
    if('speechSynthesis' in window){
      const speech=new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }else{
      console.log("Sorry Cant speak");
    }
  }

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

      <div className='cursor-pointer pt-2 flex text-tertiary'
      onClick={()=>textToSpeech(interviewQuestions[activeQuestionIndex]?.question)}>
        <Volume2/>
          <span className='ml-1'>Hear Question</span>
      </div>

      <div className='mt-10 p-3 text-tertiary bg-yellow-100 border border-yellow-500 rounded-md'>
          <h2 className='flex gap-2'><Lightbulb/><strong>Information</strong></h2>
          <h2 className='flex gap-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae autem voluptatum impedit eligendi? Minima iste illo nobis optio sequi, officia, corrupti beatae, magni omnis reiciendis ut vero velit quibusdam accusamus?</h2>
      </div>
    </div>
  )
}

export default QuestionsSec
