"use client"
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import QRCodeStyling, { Options, FileExtension } from "qr-code-styling";
import { AiOutlineClose } from "react-icons/ai";
import { BsGearFill } from "react-icons/bs";
import { RxGear } from "react-icons/rx";
import { PiDotsNine } from "react-icons/pi";
import { LiaQrcodeSolid } from "react-icons/lia";
import { HiOutlineQrcode, HiQrcode } from "react-icons/hi";
import { RiShadowFill } from "react-icons/ri";
import { IoGrid, IoGridOutline, IoGridSharp } from "react-icons/io5";
import { GrQr, GrSquare } from "react-icons/gr";
import { LuCircleDot } from "react-icons/lu";
// import styles from "./page.module.css";

type QRCardProps = {
    Link: string;
};

type QRStyleClass = "square" | "dots" | "rounded" | "classy"
type QRStyleObject = { id: number, name: QRStyleClass, icon: React.ReactNode }
type EyeStyleClass = "square" | "rounded" | "dot"
type EyeStyleObject = { id: number, name: EyeStyleClass, icon: React.ReactNode }


export default function QRCard({ Link }: QRCardProps) {

    const qrStyle: QRStyleObject[] = [
        { id: 1, name: "square", icon: <IoGridSharp className="text-[5vw] portrait:lg:text-[4vw] lg:text-[3vw]" /> },
        { id: 2, name: "dots", icon: <PiDotsNine className="text-[5vw] portrait:lg:text-[4vw] lg:text-[3vw]" /> },
        { id: 3, name: "rounded", icon: <IoGrid className="text-[5vw] portrait:lg:text-[4vw] lg:text-[3vw]" /> },
        { id: 4, name: "classy", icon: <RiShadowFill className="text-[5vw] portrait:lg:text-[4vw] lg:text-[3vw]" /> }
    ]
    const styleEye: EyeStyleObject[] = [
        { id: 1, name: "square", icon: <GrQr className="text-[5vw] portrait:lg:text-[4vw] lg:text-[3vw]" /> },
        { id: 2, name: "dot", icon: <LuCircleDot className="text-[5vw] portrait:lg:text-[4vw] lg:text-[3vw]" /> },
        { id: 3, name: "rounded", icon: <GrSquare className="text-[5vw] portrait:lg:text-[4vw] lg:text-[3vw]" /> },
    ]

    const [imageSize, setImageSize] = useState(100)
    const [styleQr, setStyleQr] = useState<QRStyleClass>("square")
    const [eyeStyle, setEyeStyle] = useState<EyeStyleClass>("square")
    const [color, setColor] = useState("#222222")
    const [bgColor, setBgColor] = useState("#ffffff")
    const [logo, setLogo] = useState("")

    const options: Options = {
        width: 1024,
        height: 1024,
        type: 'canvas',
        data: Link || "https://www.frinaze.site",
        image: logo,
        margin: 20,
        qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: logo !== "" ? "H" : "Q",
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.6,
            margin: 100 - imageSize,
            crossOrigin: 'anonymous',
            saveAsBlob: true,
        },
        dotsOptions: {
            color: color,
            type: styleQr,
        },
        cornersDotOptions: {
            type: eyeStyle,
        },
        cornersSquareOptions: {
            type: eyeStyle
        },
        backgroundOptions: {
            color: bgColor,
        },
    }




    // const [fileExt, setFileExt] = useState<FileExtension>("svg");
    const qrCode = useRef<QRCodeStyling | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        qrCode.current = new QRCodeStyling(options)

        if (ref.current) {
            qrCode.current.append(ref.current)
        }
    }, [])



    useEffect(() => {
        const t = setTimeout(() => {
            qrCode.current?.update(options)
        }, 200)
        return () => clearTimeout(t)
    }, [options])

    const onDownloadClick = (fileExt = "") => {
        if (!qrCode) return;
        qrCode.current?.download({
            extension: fileExt as FileExtension
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()

        reader.onload = () => {
            setLogo(reader.result as string)
        }

        reader.readAsDataURL(file)
    }

    

    return (
        <div className="flex flex-col lg:portrait:flex-col lg:flex-row justify-start w-full gap-5">
            <div className="lg:p-[1.15vw] p-[2vw] lg:pb-5 rounded-[2.4vw] flex flex-col items-center gap-5 bg-white shadow-[0_0_3px_0_rgba(0,0,0,0.25)]">
                <div className="lg:p-[.75vw] p-[1.75vw]  w-full pb-5 rounded-[1.25vw] flex flex-col items-center gap-5 bg-linear-to-b h-full from-gray-200 to-gray-300">
                    <div ref={ref} className="w-full h-full lg:w-[400px] lg:h-[400px] rounded-[.5vw] overflow-hidden transition-opacity duration-700" />
                    <div className="grid grid-cols-2 gap-2 mt-auto w-full px-3">
                        <button className="px-2 py-2 bg-linear-to-b from-gray-100 via-60% via-gray-100 to-gray-200 shadow rounded text-[2.5vw] portrait:lg:text-[1.35vw] lg:text-[.85vw]" onClick={() => onDownloadClick("svg")}>Download SVG</button>
                        <button className="px-2 py-2 bg-linear-to-b from-gray-100 via-60% via-gray-100 to-gray-200 shadow rounded text-[2.5vw] portrait:lg:text-[1.35vw]  lg:text-[.85vw]" onClick={() => onDownloadClick("png")}>Download PNG</button>
                        <button className="px-2 py-2 bg-linear-to-b from-gray-100 via-60% via-gray-100 to-gray-200 shadow rounded text-[2.5vw] portrait:lg:text-[1.35vw]  lg:text-[.85vw]" onClick={() => onDownloadClick("jpeg")}>Download JPEG</button>
                        <button className="px-2 py-2 bg-linear-to-b from-gray-100 via-60% via-gray-100 to-gray-200 shadow rounded text-[2.5vw] portrait:lg:text-[1.35vw]  lg:text-[.85vw]" onClick={() => onDownloadClick("webp")}>Download WEBP</button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-white w-full shadow-[0_0_3px_0_rgba(0,0,0,25%)] rounded-[1.5vw] p-5 gap-4">
                <div className="flex gap-2 items-center border-b border-black/20 pb-4">
                    <RxGear className="text-[5vw] portrait:lg:text-[2.5vw] lg:text-[2vw]" />
                    <h1 className="text-[4.75vw] portrait:lg:text-[2.25vw] lg:text-[1.75vw] font-bold ">Customization</h1>
                </div>

                <div className="flex flex-col gap-1 lg:gap-2 bg-white relative shadow-[0_0_3px_0_rgba(0,0,0,.25)] rounded-xl p-2 lg:p-4">
                    <h1 className="font-bold text-[3.5vw] portrait:lg:text-[1.75vw] lg:text-[1.25vw]">Add Logo</h1>
                    <div className="relative">
                        <input onChange={handleImageUpload} accept="image/*" type="file" name="" id="" className="w-full shadow-[0_0_2px_0_rgba(0,0,0,25%)] rounded focus:outline-none file:bg-linear-to-b file:mr-2 file:from-gray-100 file:to-gray-200 file:p-2 text-[2.5vw] portrait:lg:text-[1.5vw] lg:text-[1vw] file:text-[2.5vw] portrait:lg:file:text-[1.5vw] lg:file:text-[1vw] file:px-5 file:cursor-pointer " />
                        {logo !== "" && <button onClick={() => setLogo("")} className="bg-linear-to-b from-gray-100 flex to-gray-200 rounded-r  px-5 py-2 text-center text-[2.5vw] portrait:lg:text-[1.5vw] lg:text-[1vw] absolute top-0 right-0">Clear</button>}
                    </div>
                    {logo !== "" && (
                        <div className="mt-4 flex flex-col gap-2">
                            <h1 className="text-[3.5vw] portrait:lg:text-[1.75vw] lg:text-[1.25vw] font-bold">Logo Size</h1>
                            <div className="flex justify-between text-[2.5vw] portrait:lg:text-[1.5vw] lg:text-[1vw]"><span>0%</span> <span>100%</span></div>
                            <input value={imageSize} onChange={(e) => setImageSize(parseInt(e.target.value))} step={5} min={0} max={100} type="range" name="" className="w-full accent-gray-500 cursor-grab active:cursor-grabbing" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-[3.5vw] portrait:lg:text-[1.75vw] lg:text-[1.25vw] font-bold">QR Style</h1>
                    <div className="grid grid-cols-4 gap-2 lg:gap-4 text-gray-600">
                        {qrStyle.map((item) => (
                            <button onClick={() => setStyleQr(item.name)} key={item.id} className={`bg-white shadow-[0_0_3px_0_rgba(0,0,0,25%)] flex flex-col items-center justify-center gap-2 rounded-xl aspect-square lg:aspect-3/2 ${styleQr === item.name && "bg-linear-to-b from-[#cae0ff38] to-[#a1cdff5e] border border-[#bed6f2]"}`}>
                                {item.icon}
                                <h1 className="text-[3vw] portrait:lg:text-[2vw] lg:text-[1vw]">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h1>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-[3.5vw] portrait:lg:text-[1.75vw] lg:text-[1.25vw] font-bold">Eye Style</h1>
                    <div className="grid grid-cols-4 gap-2 lg:gap-4 text-gray-600">
                        {styleEye.map((item) => (
                            <button onClick={() => setEyeStyle(item.name)} key={item.id} className={`bg-white shadow-[0_0_3px_0_rgba(0,0,0,25%)] flex flex-col items-center justify-center gap-2 rounded-xl aspect-square lg:aspect-3/2 ${eyeStyle === item.name && "bg-linear-to-b from-[#cae0ff38] to-[#a1cdff5e] border border-[#bed6f2]"}`}>
                                {item.icon}
                                <h1 className="text-[3vw] portrait:lg:text-[2vw] lg:text-[1vw]">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h1>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="p-3 flex flex-col gap-1 shadow-[0_0_3px_0_rgba(0,0,0,0.25)] bg-white w-full rounded-xl">
                        <span className="text-[3vw] portrait:lg:text-[1.35vw] lg:text-[.75vw]">
                            Foreground Color
                        </span>
                        <div className="flex shadow-[0_0_2px_0_rgba(0,0,0,25%)] rounded">
                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} title="Chose" name="" id="" className={`h-10 w-12 p-1 px-2 rounded-l bg-linear-to-b from-gray-200 to-gray-300`}
                            // style={{backgroundColor:color}}
                            />
                            <input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className=" px-2 w-full py-1 text-[3.1vw] portrait:lg:text-[1.5vw] lg:text-[.85vw] focus:outline-0"
                            />
                        </div>
                    </div>
                    <div className="p-3 flex flex-col gap-1 shadow-[0_0_3px_0_rgba(0,0,0,0.25)] bg-white w-full rounded-xl">
                        <span className="text-[3vw] portrait:lg:text-[1.35vw] lg:text-[.75vw]">
                            Background Color
                        </span>
                        <div className="flex shadow-[0_0_2px_0_rgba(0,0,0,25%)] rounded">
                            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} title="Chose" name="" id="" className={`h-10 w-12 p-1 px-2 rounded-l bg-linear-to-b from-gray-200 to-gray-300`}
                            // style={{backgroundColor:color}}
                            />
                            <input
                                type="text"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className=" px-2 w-full py-1 text-[3.1vw] portrait:lg:text-[1.5vw] lg:text-[.85vw] focus:outline-0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}