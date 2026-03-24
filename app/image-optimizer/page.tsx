"use client"

import { convertImage } from '@/component/convertImage'
import CropArea from '@/component/CropArea'
import Footer from '@/component/Footer'
import Navbar from '@/component/Navbar'
import { showToast } from 'nextjs-toast-notify'
import React, { useCallback, useEffect, useState } from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { BiArrowFromLeft } from 'react-icons/bi'
import { BsBadgeHdFill, BsFillFilePostFill } from 'react-icons/bs'
import { FaImage } from 'react-icons/fa'
import { FaCropSimple } from 'react-icons/fa6'
import { FiUpload } from 'react-icons/fi'
import { IoIosArrowForward, IoMdCloseCircle, IoMdLock, IoMdUnlock } from 'react-icons/io'
import { MdCompare, MdKeyboardArrowDown, MdOutlinePersonalVideo, MdOutlineWebAsset } from 'react-icons/md'
import { PiImageSquare } from 'react-icons/pi'
import { RiImageAddLine } from 'react-icons/ri'
import { RxGear } from 'react-icons/rx'
import { TiSocialInstagram } from 'react-icons/ti'

type formatType = "png" | "webp" | "jpeg" 
type previewModeType = "preview" | "crop" | "compare"

export default function Image_Converter() {

    const presets = [
        { id: 1, label: "Website", width: 1280, height: 720, icon: <MdOutlineWebAsset /> },
        { id: 2, label: "Instagram Post", width: 1080, height: 1080, icon: <BsFillFilePostFill /> },
        { id: 3, label: "Instagram Story", width: 1080, height: 1920, icon: <TiSocialInstagram /> },
        { id: 4, label: "Thumbnail", width: 1280, height: 720, icon: <MdOutlinePersonalVideo /> },
        { id: 5, label: "HD", width: 1920, height: 1080, icon: <BsBadgeHdFill /> },
        { id: 6, label: "Square Small", width: 512, height: 512, icon: <PiImageSquare /> },
    ]

    const [previewMode, setPreviewMode] = useState<previewModeType>("preview")
    const [activeButton, setActiveButton] = useState<number | null>(null)
    const [resizeImage, setResizeImage] = useState<boolean>(false)
    const [isDragging, setIsDragging] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [selectedFormat, setSelectedFormat] = useState<formatType>("jpeg")
    const [quality, setQuality] = useState<number>(0.8)
    const [openPreview, setOpenPreview] = useState<true | false>(true)
    const [lockRatio, setLockRatio] = useState<true | false>(false)
    const [originalUrl, setOriginalUrl] = useState<string | null>(null)
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null)
    const [originalSize, setOriginalSize] = useState(0)
    const [convertedSize, setConvertedSize] = useState(0)
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [isConverting, setIsConverting] = useState(false)
    const [ratio, setRatio] = useState(1)
    const [debouncedWidth, setDebouncedWidth] = useState(width)
    const [debouncedHeight, setDebouncedHeight] = useState(height)
    const [croppedImage, setCroppedImage] = useState<string | null>(null)

    const getSourceFile = useCallback(async (): Promise<File | null> => {
        if (croppedImage) {
            const blob = await fetch(croppedImage).then(r => r.blob())
            return new File([blob], "cropped.png", { type: blob.type })
        }
        return selectedImage
    }, [croppedImage, selectedImage])

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
        if (file.size > 10 * 1024 * 1024) {
            showToast.error("Max file size is 10MB", {
                duration: 2000,
                position: 'top-center',
                transition: 'popUp',
                sound: true,
            })
            return
        }

        const img = new Image()
        const url = croppedImage || URL.createObjectURL(file)

        img.onload = () => {
            setWidth(img.width)
            setHeight(img.height)
            setRatio(img.height / img.width)
        }

        img.src = url


        setSelectedImage(file)
        setOriginalUrl(URL.createObjectURL(file))
        setConvertedUrl(null)
        setOriginalSize(file.size)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 10 * 1024 * 1024) {
            showToast.error("Max file size is 10MB", {
                duration: 2000,
                position: 'top-center',
                transition: 'popUp',
                sound: true,
            })
            return
        }

        const img = new Image()
        const url = croppedImage || URL.createObjectURL(file)

        img.onload = () => {
            setWidth(img.width)
            setHeight(img.height)
            setRatio(img.height / img.width)
        }

        img.src = url

        setSelectedImage(file)
        setOriginalUrl(url)
        setConvertedUrl(null)
        setOriginalSize(file.size)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedWidth(width)
            setDebouncedHeight(height)
        }, 500)

        return () => clearTimeout(timer)
    }, [width, height])

    useEffect(() => {
        let url: string;

        const convert = async () => {
            const sourceFile = await getSourceFile()
            if (!sourceFile) return

            const converted = await convertImage(
                sourceFile,
                selectedFormat,
                quality,
                debouncedWidth,
                debouncedHeight
            )

            url = URL.createObjectURL(converted as Blob)

            setConvertedUrl(url)
            setConvertedSize((converted as Blob).size)

            setIsConverting(false)
        }

        convert()

        return () => {
            if (url) URL.revokeObjectURL(url)
        }
    }, [selectedFormat, quality, debouncedWidth, debouncedHeight, croppedImage])



    return (
        <>
            <Navbar />
            <div className='pt-[130px] min-h-[750px] px-5 portrait:lg:px-10 lg:px-30 flex items-center justify-center flex-col lg:flex-row gap-10 lg:gap-20 bg-linear-to-b from-white to-blue-100 py-20'>
                <div className='flex flex-col gap-5 lg:gap-10 items-start'>
                    <div className='flex flex-col gap-2 lg:gap-4'>
                        <h1 className='text-4xl sm:text-6xl font-bold'>Make Your Photo Lighter & Better</h1>
                        <h2 className='text-base sm:text-2xl font-medium lg:w-[95%]'>Perfect for online stores, Instagram, and marketplaces. Optimize your images without losing quality.</h2>
                    </div>
                    <a href='#optimize' className='px-5 lg:px-10 rounded-lg lg:rounded-2xl py-3 lg:py-4 bg-blue-600 text-white flex gap-5 items-center text-xs lg:text-base'>Optimize Your Photo <IoIosArrowForward /></a>
                </div>
                <div className='relative lg:w-[55%]'>
                    <ReactCompareSlider className='rounded-xl aspect-square' itemOne={<ReactCompareSliderImage src={"/IMG_1198.JPG"} alt='original' />} itemTwo={<ReactCompareSliderImage src={"/converted.webp"} alt='original' />} />
                    <div className='grid grid-cols-2 absolute w-full bottom-2 z-10 items-center justify-items-center'>
                        <div className='bg-gray-200/50 rounded-2xl flex flex-col gap-1 py-1 px-2'>
                            <h3 className='text-center text-gray-800 text-xs'>Original Image</h3>
                            <p className='text-center  text-gray-800 text-xs'>3.8 MB</p>
                        </div>
                        <div className='bg-gray-200/50 rounded-2xl flex flex-col gap-1 py-1 px-2'>
                            <h3 className='text-center text-gray-800 text-xs'>Converted Image</h3>
                            <p className='text-center  text-gray-800 text-xs'>655 KB</p>
                        </div>
                    </div>
                </div>
            </div>
            <section id='optimize' className='min-h-[400px] px-5 portrait:lg:px-10 lg:px-30 py-20'>
                <div className='grid portrait:lg:grid-cols-1 lg:grid-cols-5 gap-4'>
                    <div className='portrait:lg:col-span-1 lg:col-span-3 flex flex-col gap-4 shadow-[0_0_3px_0_rgba(0,0,0,0.25)] p-3 sm:p-5 rounded-[28px] sm:rounded-[36px]'>
                        <div className='flex self-end p-1.5 px-3 gap-2 rounded'>
                            <button
                                onClick={() => setPreviewMode("preview")}
                                aria-label='preview'
                                title='preview'
                                className={`p-2 rounded ${previewMode === "preview" ? "bg-gray-200 text-gray-700" : "text-gray-400"}`}
                            >
                                <FaImage />
                            </button>

                            <button
                                onClick={() => setPreviewMode("crop")}
                                aria-label='crop'
                                title='crop'
                                className={`p-2 rounded ${previewMode === "crop" ? "bg-gray-200 text-gray-700" : "text-gray-400"}`}
                            >
                                <FaCropSimple />
                            </button>

                            <button
                                onClick={() => setPreviewMode("compare")}
                                aria-label='compare'
                                title='compare'
                                className={`p-2 rounded ${previewMode === "compare" ? "bg-gray-200 text-gray-700" : "text-gray-400"}`}
                            >
                                <MdCompare />
                            </button>
                        </div>
                        <label
                            htmlFor='input-file'
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`flex flex-col items-center justify-center border-2 h-full border-gray-400 border-dashed rounded-2xl cursor-pointer 
                                ${isDragging ? "bg-blue-50 border-blue-400" : ""}`}
                        >
                            {!originalUrl ? (
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
                                        onClick={() => document.getElementById("input-file")?.click()}
                                        className='px-5 py-2 bg-blue-600 rounded-lg text-white flex gap-2 items-center'
                                    >
                                        <FiUpload /> Choose Image
                                    </button>
                                </div>
                            ) : (
                                <div className='relative w-full h-full flex items-center justify-center'>
                                        <button className='absolute right-0 top-0 z-20 text-3xl text-gray-400' onClick={(e) => {e.preventDefault(); e.stopPropagation(); setSelectedImage(null); setConvertedUrl(null); setOriginalUrl(null); setCroppedImage(null); setHeight(0); setWidth(0)}}><IoMdCloseCircle /></button>
                                        {previewMode === "preview" && (
                                            <img
                                                src={convertedUrl || croppedImage || originalUrl!}
                                                alt="Preview"
                                                className='object-contain max-h-[500px]'
                                            />
                                        )}

                                        {previewMode === "compare" && convertedUrl && (
                                            <ReactCompareSlider
                                                itemOne={
                                                    <ReactCompareSliderImage
                                                        src={ croppedImage || originalUrl!}
                                                        alt="Original"
                                                    />
                                                }
                                                itemTwo={
                                                    <ReactCompareSliderImage
                                                        src={convertedUrl}
                                                        alt="Converted"
                                                    />
                                                }
                                            />
                                        )}

                                        {previewMode === "crop" && (
                                            <CropArea
                                                width={width}
                                                height={height}
                                                image={originalUrl!}
                                                setPreviewMode={setPreviewMode}
                                                onCropComplete={(croppedUrl) => {
                                                    setCroppedImage(croppedUrl)

                                                    const img = new Image()
                                                    img.onload = () => {
                                                        setWidth(img.width)
                                                        setHeight(img.height)
                                                    }
                                                    img.src = croppedUrl
                                                }}
                                            />
                                        )}
                                </div>
                            )}
                            


                            <input
                                id='input-file'
                                type="file"
                                accept='image/*'
                                className='hidden'
                                onChange={handleChange}
                            />
                        </label>

                    </div>
                    <div className='portrait:lg:col-span-1 lg:col-span-2 shadow-[0_0_3px_0_rgba(0,0,0,0.25)] rounded-[28px] sm:rounded-[36px] p-5 flex flex-col gap-4'>
                        <div className='flex gap-2 items-center border-b pb-3'>
                            <RxGear className='text-3xl' />
                            <span className='font-semibold text-2xl'>Settings</span>
                        </div>

                        <div className='mt-2 shadow-[0_0_3px_0_rgba(0,0,0,0.25)] flex flex-col gap-2 p-3 rounded-lg'>
                            <h1 className='font-medium'>Output Format</h1>
                            <div className='relative'>
                                <select
                                    value={selectedFormat}
                                    onChange={(e) => setSelectedFormat(e.target.value as formatType)}
                                    className='relative z-20 w-full shadow-[0_0_2px_0_rgba(0,0,0,0.25)] rounded-sm py-2 px-3 appearance-none focus:outline-0 cursor-pointer '
                                >
                                    <option value="jpeg">JPEG</option>
                                    <option value="webp">WebP</option>
                                    <option value="png">PNG</option>
                                </select>
                                <div className='absolute right-0 top-1/2 z-10 -translate-y-1/2 px-3 bg-linear-to-b from-gray-200 to-gray-300 h-full flex items-center rounded-r-sm'>
                                    <MdKeyboardArrowDown className='' />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col shadow-[0_0_3px_0_rgba(0,0,0,0.25)] p-3 rounded-lg '>
                            <div className='flex flex-col w-full gap-2'>
                                <div className='flex justify-between items-center'>
                                    <h1 className='font-medium'>Quality</h1>
                                    <p className='italic text-[10px] sm:text-xs text-gray-400'>Quality setting is not available for PNG</p>
                                </div>
                                <input disabled={selectedFormat === "png"} value={quality} onChange={(e) => setQuality(Number(e.target.value))} type="range" className='accent-gray-500' name="" id="" min={0.1} step={0.1} max={1} />
                            </div>
                            <div className="flex justify-between text-xs mt-4">
                                <span>Original: {(originalSize / 1024).toFixed(1)} KB</span>
                                <span>Converted: {(convertedSize / 1024).toFixed(1)} KB</span>
                            </div>
                        </div>
                        <div className='flex flex-col p-3 gap-2 rounded-lg shadow-[0_0_3px_0_rgba(0,0,0,0.25)] transition-all duration-500 '>
                            <div onClick={() => setResizeImage(!resizeImage)} className='flex justify-between items-center'>
                                <h1 className='font-medium'>Resize Image</h1>
                                <button onClick={()=> setResizeImage(!resizeImage)} title={resizeImage ? "Close resize image" : "Open resize image"} className={`font-medium text-xl ${resizeImage ? "rotate-45" : "rotate-0"} transition-transform origin-center `}>+</button>
                            </div>
                            {resizeImage &&
                            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                                {presets.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setWidth(item.width)
                                            setHeight(item.height)
                                            setActiveButton(item.id)
                                        }}
                                        className={`aspect-video shadow-[0_0_2px_0_rgba(0,0,0,0.25)] 
                                                hover:bg-linear-to-b hover:from-white hover:bg-blue-100 hover:border hover:border-blue-200  rounded-lg flex flex-col items-center justify-center p-2 text-center ${width === item.width && height === item.height && activeButton === item.id ? "bg-linear-to-b from-white to-blue-200 border border-blue-200" : ""}
                                                `}
                                    >
                                        <div className='text-2xl text-gray-600'>
                                            {item.icon || <MdOutlineWebAsset />}
                                        </div>
                                        <p className='text-[10px] sm:text-xs'>
                                            {item.label}
                                        </p>
                                        <span className='text-[9px] text-gray-400'>
                                            {item.width}x{item.height}
                                        </span>
                                    </button>
                                ))}
                                <div className='col-span-full flex lg:flex-row flex-col items-center gap-2 px-5 w-full'>
                                    <div className='relative w-full'>
                                            <input className='p-2 focus:outline-0 shadow-[0_0_2px_0_rgba(0,0,0,0.25)] w-full rounded-sm' value={width?.toString()} placeholder="Width" 
                                                onChange={(e) => {
                                                    const newWidth = Number(e.target.value)
                                                    setWidth(newWidth)
                                                    setActiveButton(null)

                                                    if (lockRatio && ratio && newWidth > 0) {
                                                        setHeight(Math.round(ratio * newWidth))
                                                    }
                                                }}/>
                                            <span className='absolute right-0 top-0 h-full flex items-center text-xs text-gray-600 bg-linear-to-b from-gray-200 to-gray-300 px-3 rounded-r-sm'>px</span>
                                    </div>
                                        <button onClick={() => setLockRatio(!lockRatio)} className='text-center text-gray-400 p-3 hover:bg-gray-100 rounded-lg'>
                                            {lockRatio ? <IoMdLock />  : <IoMdUnlock />}
                                        </button>
                                        <div className='relative w-full'>
                                            <input className='p-2 focus:outline-0 shadow-[0_0_2px_0_rgba(0,0,0,0.25)] w-full rounded-sm' value={height?.toString()} placeholder="Height" onChange={(e) => {
                                                const newHeight = Number(e.target.value)
                                                setHeight(newHeight)
                                                setActiveButton(null)
                                            }} />
                                            <span className='absolute right-0 top-0 h-full flex items-center text-xs text-gray-600 bg-linear-to-b from-gray-200 to-gray-300 px-3 rounded-r-sm'>px</span>
                                        </div>
                                    {/* <input className='p-2 focus:outline-0 border' value={height?.toString()} placeholder="Height" onChange={(e) => setHeight(Number(e.target.value))} /> */}
                                </div>
                            </div>
                            }
                        </div>
                    
                        <a
                            href={convertedUrl || ""}
                            download={`converted.${selectedFormat}`}
                            className={`mt-auto text-center px-4 py-2 rounded-lg 
                            ${convertedUrl ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500 pointer-events-none"}
                            `}
                        >
                            Download
                        </a>
                    </div>

                </div>
            </section>
            <Footer />
        </>
    )
}