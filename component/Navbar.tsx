'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundUp } from 'react-icons/io'
import { TbMenu } from 'react-icons/tb'

type navBarOpen = true | false;

export default function Navbar() {

  const [active, setActive] = useState('articles')
  const [navBarOpen, setNavbarOpen] = useState<navBarOpen>(false)

  useEffect(() => {
    const sections = document.querySelectorAll('section')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActive(entry.target.id)
        })
      },
      {
        threshold: 0.4,
        rootMargin: "-120px 0px 0px 0px",
      }
    )

    sections.forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <nav className='h-[120px] fixed z-50 bg-white w-full px-4 sm:px-[3vw] py-[max(8px,3vw)] flex justify-between items-center'>
      <Link href={"/"} className='flex items-center gap-1.5'>
        <div className='relative sm:w-[5vw] sm:h-[5vw] w-[17vw] h-[17vw]'>
          <Image src={'/Logo1.png'} alt='Frinaze logo' fill className=' object-contain' />
        </div>
        <div className='flex flex-col'>
          <h1 className='text-[6vw] sm:text-[3.5vw] portrait:lg:text-[3vw] lg:text-[2vw] leading-7 lg:leading-[2vw] font-extrabold text-[#121739]'>FRINAZE</h1>
          <p className='text-[3.5vw]
           sm:text-[1.35vw] portrait:lg:text-[1.45vw] lg:text-[.95vw]  font-medium text-[#12173988]'>Tools</p>
        </div>
      </Link>
      <ul className='hidden portrait:lg:hidden lg:flex items-center gap-[1vw] h-[4vw] rounded-[1vw] *:text-[2vw] *:lg:text-[1.1vw] xl:text-[.95vw]'>
        <li className="h-full relative">
          <Link
            href="/#"
            className={`h-full flex items-center px-2 relative
            before:content-[''] before:absolute before:h-[.15vw]
            before:bg-[#197ADB] before:w-full before:bottom-1.5
            before:left-0 before:origin-left before:transition-transform before:duration-300
            ${active === 'home'
                ? 'before:scale-x-100 text-[#197ADB] font-bold'
                : 'before:scale-x-0 text-[#1F3F6E] hover:before:scale-x-100 hover:text-[#197ADB]'
              }`}
          >
            Home
          </Link>
        </li>

        <li className="h-full relative">
          <Link
            href="/#tools"
            className={`h-full flex items-center px-2 relative
            before:content-[''] before:absolute before:h-[.15vw]
            before:bg-[#197ADB] before:w-full before:bottom-1.5
            before:left-0 before:origin-left before:transition-transform before:duration-300
            ${active === 'service'
                ? 'before:scale-x-100 text-[#197ADB] font-bold'
                : 'before:scale-x-0 text-[#1F3F6E] hover:before:scale-x-100 hover:text-[#197ADB]'
              }`}
          >
            Tools
          </Link>
        </li>

        <li className="h-full relative">
          <Link
            href="/#about"
            className={`h-full flex items-center px-2 relative
            before:content-[''] before:absolute before:h-[.15vw]
            before:bg-[#197ADB] before:w-full before:bottom-1.5
            before:left-0 before:origin-left before:transition-transform before:duration-300
            ${active === 'portfolio'
                ? 'before:scale-x-100 text-[#197ADB] font-bold'
                : 'before:scale-x-0 text-[#1F3F6E] hover:before:scale-x-100 hover:text-[#197ADB]'
              }`}
          >
            About
          </Link>
        </li>

        {/* <li className="h-full relative">
          <Link
            href="/#contact"
            className={`h-full flex items-center px-2 relative
            before:content-[''] before:absolute before:h-[.15vw]
            before:bg-[#197ADB] before:w-full before:bottom-1.5
            before:left-0 before:origin-left before:transition-transform before:duration-300
            ${active === 'contact'
                ? 'before:scale-x-100 text-[#197ADB] font-bold'
                : 'before:scale-x-0 text-[#1F3F6E] hover:before:scale-x-100 hover:text-[#197ADB]'
              }`}
          >
            Contact
          </Link>
        </li> */}
        <li className="h-full relative">
          <Link
            rel='noopener noreferrer'
            target='_blank'
            href="https://frinaze.site"
            className={`h-full flex items-center px-2 relative
            before:content-[''] before:absolute before:h-[.15vw]
            before:bg-[#197ADB] before:w-full before:bottom-1.5
            before:left-0 before:origin-left before:transition-transform before:duration-300 before:scale-x-0 text-[#1F3F6E] hover:text-[#197ADB] hover:before:scale-x-100`}
          >
            Make a website
          </Link>
        </li>

      </ul>
      <div className={`h-screen w-[70%] flex flex-col landscape:hidden bg-white shadow-[0_0_8px_2px_rgba(0,0,0,25%)] absolute top-0 right-0 z-99 ${navBarOpen ? "translate-x-0" : "translate-x-full"} pt-[120px] transition-all`}>
        <div className='border-t w-full h-[.5px] bg-black opacity-5' />
        <ul className='w-full h-full flex flex-col'>
          <Link href="/#home" onClick={() => setNavbarOpen(false)} className='text-[#1F3F6E] text-[3.5vw] w-full p-[4vw]'>Home</Link>
          <Link href="/#tools" onClick={() => setNavbarOpen(false)} className='text-[#1F3F6E] text-[3.5vw] w-full p-[4vw]'>Tools</Link>
          <Link href="/#about" onClick={() => setNavbarOpen(false)} className='text-[#1F3F6E] text-[3.5vw] w-full p-[4vw]'>About</Link>
          <Link href="https://frinaze.site" onClick={() => setNavbarOpen(false)} className='text-[#1F3F6E] text-[3.5vw] w-full p-[4vw]'>Make a Website</Link>
          {/* <Link href="/articles" onClick={() => setNavbarOpen(false)} className='text-[#1F3F6E] text-[3.5vw] w-full p-[4vw]'>Articles</Link> */}
        </ul>
      </div>
      {/* <a href="#contact" className='py-2.5 hidden lg:flex portrait:lg:hidden items-center justify-between border-[.15vw] border-[#197ADB] text-[#197ADB] gap-4 px-[2vw] h-[3.25vw] lg:rounded-[1.15vw] xl:rounded-[1vw]'><span className='font-medium lg:text-[1.15vw] xl:text-[1vw]'>Konsultasi</span> <IoIosArrowRoundUp className='rotate-45 text-[1.5vw]' /></a> */}
      <button className='flex lg:hidden portrait:lg:flex relative z-99' onClick={() => setNavbarOpen((prev) => !prev)}><TbMenu className={`text-[7vw] sm:text-[4vw] text-[#12173988] ${navBarOpen ? "rotate-90" : "rotate-none"} transition-all duration-100 `} /></button>
    </nav>
  )
}