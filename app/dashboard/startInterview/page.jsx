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

      const inputPrompt = `Job Position: ${currentInterviewDetail?.jobPosition} Tech Stack: ${currentInterviewDetail?.jobDesc} Experience Level: ${currentInterviewDetail?.experience} Instructions: Please generate mock interview questions along with answers based on the provided job position, tech stack, and experience. The questions should cover: Core technical skills related to the tech stack. Problem-solving relevant to the role. System design and architecture. Best practices for coding and performance optimization. Behavioral questions suitable for a candidate with ${currentInterviewDetail?.experience} years of experience. Keep in mind that questions should be verbaly answerable. Give questions and answers as an array of objects each containing a question and answer only 7 questions [{},{}...] nothing else`;
      const result = await chatSession.sendMessage(inputPrompt);
      const response = await result.response.text();
      const cleanedResponse = response.replaceAll('```json', '').replaceAll('```', '');
      const parsedResponse = JSON.parse(cleanedResponse);

      // const parsedResponse=[{"question": "Describe the different types of HTTP methods and when you would use each.","answer": "The most common HTTP methods are GET, POST, PUT, PATCH, and DELETE. GET retrieves data, POST creates new data, PUT updates existing data completely, PATCH updates existing data partially, and DELETE removes data."},{"question": "Explain the difference between Promises and Async/Await in Node.js.","answer": "Promises represent the eventual result of an asynchronous operation, allowing for cleaner handling of asynchronous code than callbacks. Async/Await builds on top of Promises, providing a more synchronous-looking syntax to work with asynchronous code."},{"question": "You are building a user authentication system for a web application. How would you handle user registration, login, and password security in Node.js using a database?","answer": "I would use a combination of bcrypt or Argon2 for password hashing to protect user data, sessions or JWTs for user authentication, and a database like MongoDB or PostgreSQL to store user data securely."},{"question": "Describe a time you had to debug a complex Node.js issue in a production environment. What steps did you take to resolve the problem?","answer": "I once encountered a memory leak issue in a Node.js application. To debug, I used tools like Node.js profiler to identify memory usage patterns and isolate the leak. After identifying the issue, I re-wrote the code using a more efficient memory management strategy and resolved the problem."},{"question": "Design a RESTful API for a simple blog platform. What endpoints would you define, and how would you handle data retrieval and manipulation?","answer": "Endpoints would include '/posts' to list posts, '/posts/{id}' for a single post, '/users' for user management, and '/comments' for comment management. Each endpoint would use appropriate HTTP methods for CRUD operations, and I'd use middleware for authentication, authorization, and validation."},{"question": "Explain how you would ensure your Node.js application performs optimally and scales efficiently.","answer": "Performance optimization strategies include code profiling, caching data frequently accessed, using appropriate data structures and algorithms, and employing load balancing for scalability. Utilizing a database optimized for the workload, minimizing database queries, and proper code structure for maintainability are essential."},{"question": "Tell me about a time you worked in a team to implement a complex feature. What was your role, and how did you contribute to the success of the project?","answer": "On a previous project, I was responsible for building the backend API for a new e-commerce feature. I collaborated closely with the frontend team, participated in code reviews, and communicated effectively to ensure the API met the frontend's needs and aligned with overall project goals."}];

      if (parsedResponse) {
        const dbResponse = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResponse: parsedResponse,
            jobPosition: currentInterviewDetail.jobPosition,
            jobDesc: currentInterviewDetail.jobDesc,
            jobExperience: currentInterviewDetail.experience,
            createdBy: user.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy')
          })
          .returning({ mockId: MockInterview.mockId })

        if (dbResponse) {
          setInterviewData(dbResponse[0]);

          // Dispatch updated interview details to Redux store
          dispatch(updateCurrentInterviewDetail({
            ...currentInterviewDetail,
            mockId: dbResponse[0]?.mockId,
            questions: parsedResponse,
          }));

          toast({
            variant: "success",
            title: "Interview Started.",
          })

          router.replace(`/dashboard/interview/${dbResponse[0]?.mockId}/interviewScreen/`);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Failed to parse the response. Please try again.",
        })
      }
    } catch (error) {
      console.error('Error during handleStart:', error);
      toast({
        variant: "destructive",
        title: "An error occured, please try again.",
      })

    } finally {
      setLoading(false);
      setShowStartDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-10 my-20">
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
    <div className="mx-10 my-20">
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
            <h2 className="flex gap-2 text-base font-medium">
              <span>
                • Ensure your webcam and microphone are working.<br />
                • Answer each question clearly and concisely.<br />
                • Use real examples from your experience.<br />
                • You can edit your answer after recording.<br />
                • Click "Start Interview" when you are ready.
              </span>
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