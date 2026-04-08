'use client'

import React, { useState } from 'react'
import { FiUpload } from 'react-icons/fi'
import { RiImageAddLine } from 'react-icons/ri'

export default function ImageSplitter() {

    const [isDragging, setIsDragging] = useState<boolean>(false)

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
            e.preventDefault()
            setIsDragging(true)
        }
    const handleDragLeave = () => setIsDragging(false)




    return (
        <>
            <div className='px-20 pt-[140px]'>
                <label
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    htmlFor="upload"
                    className={`flex flex-col items-center justify-center border-2 h-full border-gray-400 border-dashed rounded-2xl cursor-pointer 
                    ${isDragging ? "bg-blue-50 border-blue-400" : ""}`}
                >
                    <div className='py-20 flex flex-col items-center gap-4'>
                        <RiImageAddLine className='text-7xl text-gray-200' />
                        <div className='flex flex-col gap-1 items-center'>
                            <span className='text-base font-light text-gray-400'>Drag & drop or click</span>
                            <span className='text-xs font-light text-gray-400'>
                                Supports: JPG, JPEG, PNG, WebP (max size: 10MB )
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
                    <input
                        type="file" id="upload" 
                        accept='image/*'
                        className='hidden' />
                </label>
            </div>
        </>
    )
}
