"use client"
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle } from 'lucide-react';
import { chatSession } from '@/utils/geminiModel';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { updateCurrentInterviewDetail } from '@/redux/features/currentInterviewDetailSlice';


function AddNewInt() {
    const router=useRouter();
    const [openDialog,setOpenDialog]=useState(false);
    const [jobPos,setJobPos]=useState();
    const [jobDesc,setJobDesc]=useState();
    const [experience,setExperience]=useState();
    const [loading,setLoading]=useState(false);

    const dispatch=useDispatch();
    const {user}=useUser();

    const submitForm=async(e)=>{
        e.preventDefault();
        setLoading(true);

        dispatch(updateCurrentInterviewDetail({
            jobPosition:jobPos,
            jobDesc:jobDesc,
            experience:experience
        }))
        
        router.push('/dashboard/startInterview');

        // console.log(jobPos,jobDesc,experience);
        // const inputPrompt=`Job Position: ${jobPos} Tech Stack: ${jobDesc} Experience Level: ${experience} Instructions: Please generate mock interview questions along with answers based on the provided job position, tech stack, and experience. The questions should cover: Core technical skills related to the tech stack. Problem-solving and coding challenges relevant to the role. System design and architecture. Best practices for coding and performance optimization. Behavioral questions suitable for a candidate with ${experience} years of experience. give questions and answers as an array of objects each containing a question and answer only 7 questions [{},{}...] nothing else` 
        // const result=await chatSession.sendMessage(inputPrompt);
        // console.log(result.response.text());
        // const response=await (result.response.text()).replaceAll('```json','').replaceAll('```','');
        // const response=[{"question": "Describe the different types of HTTP methods and when you would use each.","answer": "The most common HTTP methods are GET, POST, PUT, PATCH, and DELETE. GET retrieves data, POST creates new data, PUT updates existing data completely, PATCH updates existing data partially, and DELETE removes data."},{"question": "Explain the difference between Promises and Async/Await in Node.js.","answer": "Promises represent the eventual result of an asynchronous operation, allowing for cleaner handling of asynchronous code than callbacks. Async/Await builds on top of Promises, providing a more synchronous-looking syntax to work with asynchronous code."},{"question": "You are building a user authentication system for a web application. How would you handle user registration, login, and password security in Node.js using a database?","answer": "I would use a combination of bcrypt or Argon2 for password hashing to protect user data, sessions or JWTs for user authentication, and a database like MongoDB or PostgreSQL to store user data securely."},{"question": "Describe a time you had to debug a complex Node.js issue in a production environment. What steps did you take to resolve the problem?","answer": "I once encountered a memory leak issue in a Node.js application. To debug, I used tools like Node.js profiler to identify memory usage patterns and isolate the leak. After identifying the issue, I re-wrote the code using a more efficient memory management strategy and resolved the problem."},{"question": "Design a RESTful API for a simple blog platform. What endpoints would you define, and how would you handle data retrieval and manipulation?","answer": "Endpoints would include '/posts' to list posts, '/posts/{id}' for a single post, '/users' for user management, and '/comments' for comment management. Each endpoint would use appropriate HTTP methods for CRUD operations, and I'd use middleware for authentication, authorization, and validation."},{"question": "Explain how you would ensure your Node.js application performs optimally and scales efficiently.","answer": "Performance optimization strategies include code profiling, caching data frequently accessed, using appropriate data structures and algorithms, and employing load balancing for scalability. Utilizing a database optimized for the workload, minimizing database queries, and proper code structure for maintainability are essential."},{"question": "Tell me about a time you worked in a team to implement a complex feature. What was your role, and how did you contribute to the success of the project?","answer": "On a previous project, I was responsible for building the backend API for a new e-commerce feature. I collaborated closely with the frontend team, participated in code reviews, and communicated effectively to ensure the API met the frontend's needs and aligned with overall project goals."}];
        // console.log(JSON.parse(response));
        // setInterviewQues(response);

    //     if(response){
    //         const dbResponse=await db.insert(MockInterview)
    //         .values({
    //             mockId:uuidv4(),
    //             jsonMockResponse:response,
    //             jobPosition:jobPos,
    //             jobDesc:jobDesc,
    //             jobExperience:experience,
    //             createdBy:user.primaryEmailAddress?.emailAddress,
    //             createdAt: moment().format('DD-MM-yyyy')
    //         }).returning({mockId:MockInterview.mockId})
    //         console.log("Data Inserted",dbResponse);
    //         if(dbResponse){
    //             setOpenDialog(false);
    //             router.push('../../dashboard/interview/'+dbResponse[0]?.mockId)
    //         }
    //     }else{
    //         console.log("Error");
    //     }

    //     setLoading(false);
    }

  return (
    <div className='p-3'>
        <div className='p-10 border hover:border-tertiary hover:text-tertiary rounded-lg bg-secondary hover:shadow-secondary hover:shadow-lg hover:scale-105 cursor-pointer transition-all'
            onClick={()=>setOpenDialog(true)}
        >
            <h2 className='text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="bg-secondary text-secondary-foreground 
                   sm:max-w-lg sm:rounded-lg 
                   w-11/12 h-auto md:h-auto 
                   fixed sm:relative sm:top-auto 
                   overflow-x-auto p-4 sm:p-6">
                <DialogHeader>
                <DialogTitle>Tell us more about the job</DialogTitle>
                <DialogDescription className="text-secondary-foreground">
                    <form onSubmit={submitForm}>
                        <div className='flex flex-col gap-3 mt-5'>
                            <div>
                                <label className=''>Job role/Job position</label>
                                <Input className="mt-1 bg-primary-foreground" placeholder="Ex. Backend Developer"
                                    required
                                    onChange={(event)=>setJobPos(event.target.value.toLowerCase())}
                                />
                            </div>
                            <div>
                                <label className=''>Job description/Tech Stack</label>
                                <Textarea className="mt-1 bg-primary-foreground" rows="4" placeholder="Ex. React, AWS, Node."
                                    required
                                    onChange={(event)=>setJobDesc(event.target.value.toLowerCase())}
                                />
                            </div>
                            <div>
                                <label className=''>Years of experience</label>
                                <Input type="number" className="mt-1 bg-primary-foreground" max="50" placeholder="Ex. 2"
                                    required
                                    onChange={(event)=>setExperience(event.target.value.toLowerCase())}
                                />
                            </div>
                        </div>
                        <div className='flex gap-5 justify-end mt-3'>
                            <Button type="button" variant="ghost"  onClick={()=>setOpenDialog(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading} variant="default">
                                {loading?
                                <>
                                    <LoaderCircle className='mr-1 animate-spin'/>Generating Questions
                                </>:"Start Interview"
                                }
                            </Button>
                        </div>
                    </form>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddNewInt