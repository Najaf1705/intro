"use client"
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserPreviousInterviews } from '@/redux/features/userPreviousIntsSlice'
import PreviousIntCard from './PreviousIntCard'
import { Skeleton } from "@/components/ui/skeleton"

function PreviousInt() {
    const { user } = useUser();
    const dispatch = useDispatch();

    const { interviews, loading } = useSelector(state => state.userPreviousInts);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserPreviousInterviews(user));
        }
    }, [user, dispatch]);

    if (!user) {
        return (
            <div className="text-center font-bold text-xl text-gray-500 py-8">
                Log in to see your interviews.
            </div>
        );
    }

    return (
        <div>
            <h2 className='font-bold text-xl pb-4 pt-4'>Previous Mock Interviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-5 wrap">
                {loading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                        <Skeleton
                            key={idx}
                            className="w-72 h-40 rounded-lg"
                        />
                    ))
                ) : interviews && interviews.length === 0 ? (
                    <div className="col-span-full text-center font-semibold text-gray-500 py-8">
                        You have not done any interviews yet.
                    </div>
                ) : (
                    interviews.map((interview, index) => (
                        <PreviousIntCard key={index} interviewDetails={interview} />
                    ))
                )}
            </div>
        </div>
    )
}

export default PreviousInt