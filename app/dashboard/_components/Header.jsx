"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { useTheme } from '@/app/context/ThemeContext'
import { MoonIcon, SunDimIcon } from 'lucide-react'

function Header() {
    const { theme, toggleTheme } = useTheme();

    const path = usePathname(); // Get the current route to apply active styles
    const router=useRouter();

    return (
        <div className='flex p-4 items-center justify-between bg-secondary text-secondary-foreground shadow-primary shadow-sm'>
            {/* Logo */}
            <Image src={'/logo.svg'} width={30} height={30} alt="Intro" /> 
            
            {/* Navigation Menu */}
            <ul className='hidden md:flex gap-12 mx-2 items-center'>
                <li className={`font-bold hover:text-tertiary hover:scale-105 cursor-pointer transition-all
                    ${path === '/dashboard' ? 'font-bold text-tertiary' : ''}`}
                    onClick={()=>router.push('/dashboard')}    
                >
                    Dashboard
                </li>
                <li className={`font-bold hover:text-tertiary hover:scale-105 cursor-pointer transition-all
                    ${path === '/questions' ? 'font-bold text-tertiary' : ''}`}>
                    Questions
                </li>
                <li className={`font-bold hover:text-tertiary hover:scale-105 cursor-pointer transition-all
                    ${path === '/upgrade' ? 'font-bold text-tertiary' : ''}`}>
                    Upgrade
                </li>
                <li className={`font-bold hover:text-tertiary hover:scale-105 cursor-pointer transition-all
                    ${path === '/working' ? 'font-bold text-tertiary' : ''}`}>
                    How it works?
                </li>
            </ul>

            <div className='flex justify-center items-center'>
                <button onClick={toggleTheme} className='mr-2'>
                    {theme === "dark" ? <SunDimIcon className='text-white'/> : <MoonIcon className='text-black'/>}
                </button>

                <UserButton />
            </div>
        </div>
    )
}

export default Header;
