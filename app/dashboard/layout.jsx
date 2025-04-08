import React from 'react'
import Header from '@/components/Header'

function DashboardLayout({children}) {
  return (
    <div className='mx-5 mt-24 md:mx-10 lg:mx-20'>
      {children}
    </div>
  )
}

export default DashboardLayout