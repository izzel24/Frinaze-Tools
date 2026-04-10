'use client'

import Footer from '@/component/Footer'
import Navbar from '@/component/Navbar'
import React, { useState } from 'react'
import { HiOutlineQrcode, HiOutlineSearch } from "react-icons/hi"
import Link from "next/link"
import { FaRegImage } from 'react-icons/fa'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { IoIosImages } from 'react-icons/io'

type Tool = {
    name: string
    description: string
    href: string
    icon: React.ReactNode
    category: ('Image' | 'PDF' | 'Business')[]
}

const tools: Tool[] = [
    {
        name: 'QR Code Generator',
        description: 'Create QR codes for URLs, WiFi, WhatsApp, email and more in seconds.',
        href: '/qr-generator',
        icon: <HiOutlineQrcode className="text-3xl text-blue-600" />,
        category: ['Business', 'Image']
    },
    {
        name: 'Image Optimizer',
        description: 'Compress and optimize your images for faster websites.',
        href: '/image-optimizer',
        icon: <FaRegImage className="text-3xl text-blue-600" />,
        category: ['Image']
    },
    {
        name: 'Invoice Generator',
        description: 'Generate professional invoices for your business instantly.',
        href: '/invoice-generator',
        icon: <IoDocumentTextOutline className="text-3xl text-blue-600" />,
        category: ['Business', 'PDF']
    },
    {
        name: 'Image Splitter',
        description: 'Split an image into multiple pieces or grids for Instagram posts, design layouts, or printing.',
        href: '/image-splitter',
        icon: <IoIosImages  className="text-3xl text-blue-600" />,
        category: ['Image']
    },
]

export default function Page() {

    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')

    const categories = ['All', 'Image', 'PDF', 'Business']

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    const filteredTools = tools.filter((tool) => {
        const matchSearch = tool.name.toLowerCase().includes(search.toLowerCase())

        const matchCategory = category === 'All' || tool.category.includes(category as Tool['category'][number])

        return matchSearch && matchCategory
    })

    return (
        <>
            <Navbar />

            <section className='pt-[140px] py-20 flex flex-col items-center gap-4 justify-center'>
                <h1 className='font-medium text-6xl'>All Productivity Tools</h1>
                <h2 className='font-light text-2xl text-gray-400'>
                    Free tools to help you to work faster and smarter
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className='relative'>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type='text'
                            className='w-full lg:min-w-[550px] p-3 mt-4 rounded-lg '
                            placeholder='Search'
                        />

                        <button
                            type='submit'
                            className='absolute top-0 right-0 h-full px-3 text-gray-400 text-lg'
                        >
                            <HiOutlineSearch />
                        </button>
                    </div>
                </form>

                <div className="flex gap-1 p-1 border border-gray-200 rounded-xl bg-gray-50 mt-1">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition
                            ${category === cat
                                    ? 'bg-blue-500 text-white shadow'
                                    : 'text-gray-600 hover:bg-gray-200'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {filteredTools.map((tool, index) => (
                        <Link
                            key={index}
                            href={tool.href}
                            className="group border border-gray-200 rounded-xl p-8 flex flex-col gap-6 hover:shadow-xl hover:-translate-y-1 transition"
                        >

                            <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-blue-100">
                                {tool.icon}
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-semibold">
                                    {tool.name}
                                </h3>

                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {tool.description}
                                </p>
                            </div>

                            <span className="text-blue-600 font-medium group-hover:underline">
                                Open Tool →
                            </span>

                        </Link>
                    ))}

                </div>
            </section>

            <Footer />
        </>
    )
}