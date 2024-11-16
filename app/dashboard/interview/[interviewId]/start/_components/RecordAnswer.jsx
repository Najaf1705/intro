import { Button } from '@/components/ui/button';
import { WebcamIcon } from 'lucide-react';
import React, { useState } from 'react'
import Webcam from 'react-webcam'

function RecordAnswer() {
  return (
    <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col items-center'>
            <WebcamIcon width={200} height={200} className='h-72 w-72 bg-secondary rounded-lg border absolute' />
            <Webcam
                mirrored={true}
                style={{
                    height:300,
                    width:'100%',
                    zIndex:10,
                    borderRadius:10
                }}
            />
        </div>
        <div className='p-2'>
            <Button variant="outline" className='my-2 font-bold'>Record Response</Button>
        </div>
    </div>
  )
}

export default RecordAnswer