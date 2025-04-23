"use client";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

import { chatSession } from '@/utils/geminiModel';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { useUser } from '@clerk/nextjs';

import { useSelector, useDispatch } from 'react-redux';
import { updateCurrentInterviewDetail } from '@/redux/features/currentInterviewDetailSlice';
import { fetchUserPreviousInterviews } from '@/redux/features/userPreviousIntsSlice';


function Interview() {
  const [interviewData, setInterviewData] = useState(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);

  const router = useRouter();
  const { user } = useUser();
  const dispatch = useDispatch();
  const { toast } = useToast()

  const currentInterviewDetail = useSelector(
    (state) => state.currentInterviewDetail.data
  );


  useEffect(() => {
    if (currentInterviewDetail) {
      setLoading(false); 
    }
  }, [currentInterviewDetail]);

  const handleCancel = () => {
    router.replace('/dashboard');
  };

  const handleStart = async () => {
    try {
      setLoading(true);

      // Retrieve questions from the Redux store
      const questions = currentInterviewDetail?.questions;
      console.log('Questions:', questions);

      if (questions && questions.length > 0) {
        const dbResponse = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResponse: questions, // Use questions from Redux
            jobPosition: currentInterviewDetail.jobPosition,
            jobDesc: currentInterviewDetail.jobDesc,
            jobExperience: currentInterviewDetail.experience,
            createdBy: user.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy'),
          })
          .returning({ mockId: MockInterview.mockId });

        if (dbResponse) {
          setInterviewData(dbResponse[0]);

          // Dispatch updated interview details to Redux store
          dispatch(
            updateCurrentInterviewDetail({
              ...currentInterviewDetail,
              mockId: dbResponse[0]?.mockId,
            })
          );

          // Update user's previous interviews in Redux
          dispatch(fetchUserPreviousInterviews(user));

          toast({
            variant: 'success',
            title: 'Interview Started.',
          });

          router.replace(
            `/dashboard/interview/${dbResponse[0]?.mockId}/interviewScreen/`
          );
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'No questions available. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error during handleStart:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred, please try again.',
      });
    } finally {
      setLoading(false);
      setShowStartDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-10 my-20 md:my-32">
        <h2 className="text-2xl font-bold mb-5">
          <Skeleton className="h-8 w-48" />
        </h2>
        <div className="w-full grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex flex-col">
            <div className="bg-secondary gap-5 p-5 border rounded-md">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="my-5 p-5 text-tertiary rounded-md">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-72 w-72 rounded-lg" />
            <Skeleton className="h-10 w-48 mt-2 rounded-md" />
          </div>
        </div>
        <div className="mt-5 flex flex-row justify-center gap-4">
          <Skeleton className="h-12 w-48 rounded-md" />
          <Skeleton className="h-12 w-48 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-10 my-20 md:my-44">
      <h2 className="text-2xl font-bold mb-5">Let's get started</h2>
      <div className="w-full grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col">
          <div className="bg-secondary gap-5 p-5 border rounded-md overflow-hidden">
            <h2 className="text-lg overflow-hidden">
              <strong>Job Role/Job Position:</strong> {currentInterviewDetail?.jobPosition}
            </h2>
            <h2 className="text-lg overflow-hidden">
              <strong>Job Description:</strong> {currentInterviewDetail?.jobDesc}
            </h2>
            <h2 className="text-lg overflow-hidden">
              <strong>Job Experience:</strong> {currentInterviewDetail?.experience}
            </h2>
          </div>
          <div className="my-5 p-5 text-tertiary bg-yellow-100 border border-yellow-500 rounded-md">
            <h2 className="flex gap-2">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="flex gap-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae
              autem voluptatum impedit eligendi? Minima iste illo nobis optio
              sequi, officia, corrupti beatae, magni omnis reiciendis ut vero
              velit quibusdam accusamus?
            </h2>
          </div>
        </div>
        {webcamEnabled ? (
          <div className="flex flex-col items-center">
            <Webcam
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              mirrored={true}
              className="h-72 border rounded-lg"
            />
            <Button
              variant="outline"
              onClick={() => setWebcamEnabled(false)}
              className="my-2 font-bold"
            >
              Turn off webcam and mic
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <WebcamIcon className="w-72 h-72 p-20 bg-secondary rounded-lg border" />
            <Button
              variant="outline"
              onClick={() => setWebcamEnabled(true)}
              className="my-2 font-bold"
            >
              Turn on webcam and mic
            </Button>
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-row justify-center gap-4">
        <Button
          onClick={() => setShowCancelDialog(true)}
          variant="destructive"
          className="font-bold"
        >
          Cancel Interview
        </Button>
        <Button
          onClick={() => setShowStartDialog(true)}
          variant="tertiary"
          className="font-bold text-lg"
        >
          Start Interview
        </Button>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-secondary text-secondary-foreground">
          <DialogHeader>
            <DialogTitle>Cancel Interview</DialogTitle>
            <DialogDescription className="text-base font-medium">
              Are you sure you want to cancel the interview? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="ghost"
              onClick={() => setShowCancelDialog(false)}
            >
              No, Go Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
            >
              Yes, Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Start Confirmation Dialog */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent className="bg-secondary text-secondary-foreground">
          <DialogHeader>
            <DialogTitle>Start Interview</DialogTitle>
            <DialogDescription className="text-base font-medium">
              Are you ready to start the interview? Make sure your webcam and
              microphone are set up properly.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="ghost"
              onClick={() => setShowStartDialog(false)}
            >
              No, Go Back
            </Button>
            <Button
              variant="tertiary"
              onClick={handleStart}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="animate-spin" /> Preparing
                </span>
              ) : (
                'Yes, Start'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Interview;