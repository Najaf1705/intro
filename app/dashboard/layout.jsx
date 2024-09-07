import React from 'react'
import Header from './_components/Header'

function DashboardLayout({children}) {
  return (
    <>
      <Header/>
      <div>{children}</div>
    </>
  )
}

export default DashboardLayout