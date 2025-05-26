"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateCurrentInterviewDetail } from "@/redux/features/currentInterviewDetailSlice";
import { useToast } from "@/hooks/use-toast";

function AddNewInt() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPos, setJobPos] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();

  const submitForm = async (e) => {
    if(!isSignedIn) {
      toast({
        variant: "info",
        title: "You need to login first.",
      })
      return;
    }
    e.preventDefault();
    setLoading(true);

    dispatch(
      updateCurrentInterviewDetail({
        jobPosition: jobPos,
        jobDesc: jobDesc,
        experience: experience,
      })
    );

    router.push("/dashboard/startInterview");
    // setLoading(false);
  };

  return (
    <div className="p-3 min-w-72 mx-2">
      <div
        className="p-10 border hover:border-tertiary hover:text-tertiary rounded-lg bg-secondary hover:shadow-secondary hover:shadow-lg hover:scale-105 cursor-pointer transition-all"
        onClick={() => {
          if (!isSignedIn)
            return toast({
              variant: "info",
              title: "Please log in to create interview",
            });
          setOpenDialog(true);
        }}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog
        open={openDialog}
        onOpenChange={setOpenDialog}
      >
        <DialogContent
          onInteractOutside={e => e.preventDefault()}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
          className="bg-secondary text-secondary-foreground sm:max-w-lg p-4 sm:p-6"
        >
          <DialogHeader>
            <DialogTitle className="text-tertiary text-xl">
              Tell us more about the job
            </DialogTitle>
            <DialogDescription className="text-secondary-foreground"></DialogDescription>
          </DialogHeader>
          <form onSubmit={submitForm} className="w-full">
            <div className="flex flex-col gap-3 mt-2 font-bold">
              <div>
                <label>Job role/Job position</label>
                <Input
                  className="mt-1 bg-primary-foreground"
                  placeholder="Ex. Backend Developer"
                  required
                  onChange={(event) => setJobPos(event.target.value.toLowerCase())}
                />
              </div>
              <div>
                <label>Job description/Tech Stack</label>
                <Textarea
                  className="mt-1 bg-primary-foreground"
                  rows="4"
                  placeholder="Ex. React, AWS, Node."
                  required
                  onChange={(event) => setJobDesc(event.target.value.toLowerCase())}
                />
              </div>
              <div>
                <label>Years of experience</label>
                <Input
                  type="number"
                  className="mt-1 bg-primary-foreground"
                  max="50"
                  placeholder="Ex. 2"
                  required
                  onChange={(event) => setExperience(event.target.value.toLowerCase())}
                />
              </div>
            </div>
            
            <div className="flex gap-5 justify-end mt-3 ">
              <Button
                className="font-bold"
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="font-bold"
                type="submit"
                disabled={loading}
                variant="default"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="mr-1 animate-spin" /> Preparing
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInt;