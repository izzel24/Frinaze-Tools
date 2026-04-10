'use client'

import Footer from '@/component/Footer'
import Navbar from '@/component/Navbar'
import { splitImage } from '@/component/splitImage'
import Image from 'next/image'
import { showToast } from 'nextjs-toast-notify'
import React, {  useRef, useState } from 'react'
import { FiUpload } from 'react-icons/fi'
import { IoMdCloseCircle } from 'react-icons/io'
import { LuSquareSplitHorizontal } from 'react-icons/lu'
import { RiImageAddLine } from 'react-icons/ri'

export default function ImageSplitter() {

    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null)
    const [previews, setPreviews] = useState([])
    const [row, setRow] = useState<string>("")
    const [col, setCol] = useState<string>("")
    const [zipUrl, setZipUrl] = useState<string | null>(null)
    const [originalPreview, setOriginalPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value)

        if (value > 10) {
            showToast.error("Maximum rows is 10")
            return
        }

        setRow(e.target.value)
    }

    const handleColChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value)

        if (value > 10) {
            showToast.error("Maximum columns is 10")
            return
        }

        setCol(e.target.value)
    }

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => setIsDragging(false)
    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (!file) return
        if (file.size > 30 * 1024 * 1024) {
            showToast.error("Max file size is 30MB", {
                duration: 2000,
                position: 'top-center',
                transition: 'popUp',
                sound: true,
            })
            return
        }
        setFile(file)
        const url = URL.createObjectURL(file)
        setOriginalPreview(url)
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0]

        if (!file) return

        if (file.size > 30 * 1024 * 1024) {
            showToast.error("Max file size is 30MB", {
                duration: 2000,
                position: 'top-center',
                transition: 'popUp',
                sound: true,
            })
            return
        }
        setFile(file)
        const url = URL.createObjectURL(file)
        setOriginalPreview(url)
    }

    const handleSplit = async () => {
        if (!file) return
        setIsLoading(true)


        const { zipBlob, previews } = await splitImage(file, Number(row), Number(col))

        setPreviews(previews)
        const url = URL.createObjectURL(zipBlob)
        setZipUrl(url)
        setIsLoading(false)


    }

    const handleDownload = () => {

        const link = document.createElement("a")
        link.href = zipUrl
        link.download = "split-images.zip"
        link.click()
    }




    return (
        <>
            <Navbar />
            <section className='min-h-[750px] pt-[130px] bg-linear-to-b from-transparent to-blue-100 px-20 flex items-center'>
                <div className='flex flex-col'>
                    <h1 className='text-6xl font-bold'>
                        Easily split images into rows and columns.
                    </h1>
                    <h2 className='text-3xl'>Perfect for Instagram grids, puzzles, design layouts, or printing.</h2>
                    <button></button>
                </div>
            </section>
            <div className='px-4 sm:px-8 lg:portrait:px-10 lg:px-20 flex flex-col gap-5 py-20'>
                <div className='flex flex-col lg:portrait:flex-col lg:flex-row gap-4'>
                    <div className={`p-5 shadow-[0_0_3px_0_rgba(0,0,0,0.25)] rounded-[36px] flex flex-col gap-2  ${previews.length > 0 ? "lg:portrait:w-full lg:w-1/2 w-full" : "w-full"} transition-all duration-100 ease-in`}>
                        <label
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            htmlFor="upload"
                            className={`flex flex-col items-center justify-center border-2 relative h-full border-gray-400 border-dashed rounded-2xl cursor-pointer 
                            ${isDragging ? "bg-blue-50 border-blue-400" : ""}`}
                        >
                            {originalPreview &&
                                    <button
                                        className='absolute top-0 right-0 text-3xl z-10 text-gray-300'
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setFile(null)
                                            setPreviews([])
                                            setZipUrl(null)
                                            
                                            if (originalPreview) {
                                                URL.revokeObjectURL(originalPreview)
                                            }
                                            
                                            setOriginalPreview(null)

                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = ""
                                            }
                                        }}
                                    >
                                        <IoMdCloseCircle />
                                    </button>
                            }
                            {originalPreview ? (
                                <div className="w-full relative">
                                    <img
                                        src={originalPreview}
                                        className="shadow object-contain max-h-[500px] w-full"
                                        alt='original-preview'
                                    />
                                </div>
                            ) : (

                                <div className='py-12 sm:py-16 lg:py-20 flex flex-col items-center gap-4'>
                                    <RiImageAddLine className='text-7xl text-gray-200' />
                                    <div className='flex flex-col gap-1 items-center'>
                                        <span className='text-base font-light text-gray-400'>Drag & drop or click</span>
                                        <span className='text-xs font-light text-gray-400'>
                                            Supports: JPG, JPEG, PNG, WebP (max size: 30MB )
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        aria-label='choose-image'
                                        onClick={() => document.getElementById("upload")?.click()}
                                        className='px-5 py-2 bg-blue-600 rounded-lg text-white flex gap-2 items-center'
                                    >
                                        <FiUpload /> Choose Image
                                    </button>
                                </div>
                            )
                            }
                            <input
                                ref={fileInputRef}
                                onChange={handleChange}
                                type="file" id="upload"
                                accept='image/*'
                                className='hidden' />
                        </label>
                        <div className={`flex flex-col lg:portrait:flex-col lg:flex-row justify-between gap-2 lg:portrait:gap-4 py-2`}>
                            <div className='flex flex-col lg:portrait:flex-col lg:flex-row w-full lg:w-auto gap-2'>
                                <div className='relative'>
                                    <input
                                        type="number"
                                        value={row}
                                        onChange={handleRowChange}
                                        className='shadow-[0_0_2px_0_rgba(0,0,0,0.25)] w-full p-2 rounded-lg'
                                        placeholder='rows'
                                    />
                                    <span className='absolute h-full top-0 right-0 flex items-center px-3 bg-linear-to-b from-gray-200 to-gray-300 rounded-r-lg text-xs'>
                                        Rows
                                    </span>
                                </div>
                                <div className='relative'>
                                    <input
                                        type="number"
                                        value={col}
                                        onChange={handleColChange}
                                        className='shadow-[0_0_2px_0_rgba(0,0,0,0.25)] p-2 rounded-lg w-full'
                                        placeholder='columns'
                                    />
                                    <span className='absolute h-full top-0 right-0 flex items-center px-3 bg-linear-to-b from-gray-200 to-gray-300 rounded-r-lg text-xs'>
                                        Cols
                                    </span>
                                </div>
                            </div>
                            <button onClick={handleSplit} className='p-2 bg-linear-to-b from-gray-200 to-gray-300 rounded-lg px-10 text-xs flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed!' disabled={!file || !row || !col}><LuSquareSplitHorizontal className='text-lg' />{isLoading ? "Splitting..." : "Split Image"}</button>
                        </div>
                        {previews.length === 0 && row && col && (
                            <div className='flex w-full justify-end'>

                            <p className="text-xs text-gray-400">
                                Click Split Image to generate preview
                            </p>
                            </div>
                        )}
                    </div>
                    
                    {previews.length > 0 &&
                        <div className='flex flex-col gap-1 w-full lg:portrait:w-full lg:w-1/2'>
                            <div className="text-sm text-gray-500 mb-2">
                                {row} × {col} Grid • {previews.length} images
                            </div>
                            <div className=' grid gap-1 w-full' style={{ gridTemplateColumns: `repeat(${col}, 1fr)` }}>
                                {previews.map((item, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={item}
                                            alt={`preview-${index}`}
                                            className="w-full object-cover rounded"
                                        />
                                        <button
                                            onClick={() => {
                                                const link = document.createElement("a")
                                                link.href = item
                                                link.download = `piece-${index + 1}.png`
                                                link.click()
                                            }}
                                            className="absolute bottom-1 right-1 text-xs bg-gray-700 text-gray-200 p-2 rounded opacity-100 portrait:lg:opacity-100 lg:opacity-0 group-hover:opacity-100 transition"
                                        >
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </div>
                {previews.length > 0 && (
                    <button
                        onClick={handleDownload}
                        className='p-3 w-full bg-blue-600 text-white rounded-lg'
                    >
                        Download All (ZIP)
                    </button>
                )}
            </div>
            <Footer />
        </>
    )
}
