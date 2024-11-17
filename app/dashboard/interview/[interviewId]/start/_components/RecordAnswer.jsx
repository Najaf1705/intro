"use client"
import { Button } from '@/components/ui/button';
import { Mic, WebcamIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';


function RecordAnswer() {
    const [userAnswer,setUserAnswer]=useState('');
    const [webcamEnabled,setWebcamEnabled]=useState(false);

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(() => {
        results.map((result)=>{
            setUserAnswer(prevAnswer=>prevAnswer+result?.transcript);
        })
      }, [results])
      
      
  return (
    <div className='flex flex-col justify-center'>
        <div className='mt-8 flex flex-col items-center'>
            {webcamEnabled?(
                <Webcam
                    onUserMedia={() => setWebcamEnabled(true)}
                    onUserMediaError={() => setWebcamEnabled(false)}
                    mirrored={true}
                    className=' h-72 border rounded-lg'
                />
            ):(
                <WebcamIcon width={'65%'} height={300} className='p-20 bg-secondary rounded-lg border' />
            )}
        </div>
        <div className='p-2 flex justify-evenly'>
            <Button variant="outline" className='my-2 font-bold'
                onClick={isRecording?stopSpeechToText:startSpeechToText}>
                  {isRecording ? (
                      <div className="flex items-center gap-2 text-green-500">
                          <Mic />
                          <span>Recording...</span>
                      </div>
                  ) : (
                      'Record Response'
                  )}
            </Button>
            <Button onClick={()=>console.log(userAnswer)}>show answer</Button>
            <Button onClick={() => setWebcamEnabled(!webcamEnabled)} className='my-2 font-bold'>{webcamEnabled?"Turn off webcam":"Turn on webcam"}</Button>

        </div>
    </div>
  )
}

export default RecordAnswer