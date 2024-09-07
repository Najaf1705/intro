"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {

    const path=usePathname();
    

  return (
    <div className='flex p-4 items-center justify-between bg-background text-foreground shadow-sm'>
        <Image src={'/logo.svg'} width={30} height={0} color={'white'} alt="Intro"/> 
        <ul className='flex gap-12'>
            <li className={`hover:text-tertiary hover:font-semibold cursor-pointer transition-all
                ${path=='/dashboard' && 'font-bold text-tertiary'}`}>
                Dashboard
            </li>
            <li className={`hover:text-tertiary hover:font-semibold cursor-pointer transition-all
                ${path=='/questions' && 'font-bold text-tertiary'}`}>
                Questions
            </li>
            <li className={`hover:text-tertiary hover:font-semibold cursor-pointer transition-all
                ${path=='/upgrade' && 'font-bold text-tertiary'}`}>
                Upgrade
            </li>
            <li className={`hover:text-tertiary hover:font-semibold cursor-pointer transition-all
                ${path=='/working' && 'font-bold text-tertiary'}`}>
                How it works?
            </li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header