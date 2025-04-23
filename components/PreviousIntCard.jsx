import React from 'react'
import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'

function PreviousIntCard({interviewDetails}) {
    const path = usePathname();
    const router = useRouter();

  return (
    <div className='flex flex-col bg-secondary border rounded-sm p-4'>
        <div className='pb-3'>
            <h2 className='font-bold text-xl text-tertiary break-words whitespace-normal'>
                {interviewDetails?.jobPosition?.charAt(0).toUpperCase() + interviewDetails?.jobPosition?.slice(1)}
            </h2>
            <h2 className='font-medium text-l'>
                {interviewDetails.jobExperience} years of experience
            </h2>
            <h2 className='font-medium text-l'>
                Created at: {interviewDetails.createdAt}
            </h2>
        </div>
        <div className='flex flex-row justify-center items-center gap-4'>
          <Button className='w-1/2'
            variant='default' 
            onClick={() => {
              const params = new URLSearchParams({
                showCongrats: false,
                jobPosition: interviewDetails.jobPosition,
                jobExperience: interviewDetails.jobExperience,
                createdAt: interviewDetails.createdAt,
              }).toString();
              router.push(`/dashboard/interview/${interviewDetails?.mockId}/feedback?${params}`);
            }}
          >
            Feedback
          </Button>
          <Button className='w-1/2' variant='tertiary'>Start</Button>
        </div>
    </div>
  )
}

export default PreviousIntCard