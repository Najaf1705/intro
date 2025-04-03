import React from 'react'
import Header from './Header'

function DashboardLayout({children}) {
  return (
    <>
      <Header/>
      <div className='mx-5 md:mx-10 lg:mx-20'>
        {children}
      </div>
    </>
  )
}

export default DashboardLayout