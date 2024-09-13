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



function AddNewInt() {
    const router=useRouter();
    const [openDialog,setOpenDialog]=useState(false);
    const [jobPos,setJobPos]=useState();
    const [jobDesc,setJobDesc]=useState();
    const [experience,setExperience]=useState();
    const [loading,setLoading]=useState(false);
    const [interviewQues,setInterviewQues]=useState();

    const {user}=useUser();

    const submitForm=async(e)=>{
        e.preventDefault();
        setLoading(true);
        // console.log(jobPos,jobDesc,experience);

        const inputPrompt=`Job Position: ${jobPos} Tech Stack: ${jobDesc} Experience Level: ${experience} Instructions: Please generate mock interview questions along with answers based on the provided job position, tech stack, and experience. The questions should cover: Core technical skills related to the tech stack. Problem-solving and coding challenges relevant to the role. System design and architecture for [backend/frontend, etc.]. Best practices for coding and performance optimization. Behavioral questions suitable for a candidate with [X] years of experience. give questions and answers as only fields in json only 10 questions` 
        const result=await chatSession.sendMessage(inputPrompt);
        // console.log(result.response.text());
        const response=result.response.text().replaceAll('```json','').replaceAll('```','');
        console.log(JSON.parse(response));
        setInterviewQues(response);

        if(response){
            const dbResponse=await db.insert(MockInterview)
            .values({
                mockId:uuidv4(),
                jsonMockResponse:response,
                jobPosition:jobPos,
                jobDesc:jobDesc,
                jobExperience:experience,
                createdBy:user.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-yyyy')
            }).returning({mockId:MockInterview.mockId})
            console.log("Data Inserted",dbResponse);
            if(dbResponse){
                setOpenDialog(false);
                router.push('../../dashboard/interview/'+dbResponse[0]?.mockId)
            }
        }else{
            console.log("Error");
        }


        setLoading(false);
    }

  return (
    <div className='p-3'>
        <div className='p-10 border hover:border-tertiary hover:text-tertiary rounded-lg bg-secondary hover:shadow-secondary hover:shadow-lg hover:scale-105 cursor-pointer transition-all'
            onClick={()=>setOpenDialog(true)}
        >
            <h2 className='text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDialog}>
            <DialogContent className="bg-secondary text-secondary-foreground">
                <DialogHeader>
                <DialogTitle>Tell us more about the job</DialogTitle>
                <DialogDescription className="text-secondary-foreground">
                    <form onSubmit={submitForm}>
                        <div className='flex flex-col gap-3 mt-5'>
                            <div>
                                <label className=''>Job role/Job position</label>
                                <Input className="mt-1 bg-primary-foreground" placeholder="Ex. Backend Developer"
                                    required
                                    onChange={(event)=>setJobPos(event.target.value)}
                                />
                            </div>
                            <div>
                                <label className=''>Job description/Tech Stack</label>
                                <Textarea className="mt-1 bg-primary-foreground" rows="4" placeholder="Ex. React, AWS, Node."
                                    required
                                    onChange={(event)=>setJobDesc(event.target.value)}
                                />
                            </div>
                            <div>
                                <label className=''>Years of experience</label>
                                <Input type="number" className="mt-1 bg-primary-foreground" max="50" placeholder="Ex. 2"
                                    required
                                    onChange={(event)=>setExperience(event.target.value)}
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