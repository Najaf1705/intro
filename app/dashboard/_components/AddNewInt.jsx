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

  

function AddNewInt() {
    const [openDialog,setOpenDialog]=useState(false);
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
                    <div className='flex flex-col gap-3 mt-5'>
                        <div>
                            <label className='ml-2'>Job role/Job position</label>
                            <Input className="bg-primary-foreground" placeholder="Ex. Backend Developer" />
                        </div>
                        <div>
                            <label className='ml-2'>Job description</label>
                            <Textarea className="bg-primary-foreground" placeholder="Tell us more about the role" />
                        </div>
                    </div>
                    <div className='flex gap-5 justify-end mt-3'>
                        <Button variant="ghost"  onClick={()=>setOpenDialog(false)}>Cancel</Button>
                        <Button variant="default" >Start Interview</Button>
                    </div>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddNewInt