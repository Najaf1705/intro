import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInt from './_components/AddNewInt'

function Dashboard() {
  return (
    <div className='bg-background'>
      <h2 className='mt-5 font-bold text-2xl'>Dashboard</h2>
      <h2 className='text-gray-400'>Create and start your AI mockup Interview</h2>
      {/* <UserButton/> */}
      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddNewInt/>
        <AddNewInt/>
        <AddNewInt/>
        <AddNewInt/>
      </div>
    </div>
  )
}

export default Dashboard