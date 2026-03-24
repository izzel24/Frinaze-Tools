import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

type Props = {
    setPreviewMode: React.Dispatch<React.SetStateAction<"preview" | "crop" | "compare">>
    width: number
    height: number
    image: string
    onCropComplete: (croppedUrl: string) => void
}

export default function CropArea({width, height, image, onCropComplete, setPreviewMode }: Props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

    const onCropCompleteHandler = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const createImage = (url: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.src = url
            img.onload = () => resolve(img)
            img.onerror = reject
        })

    const getCroppedImg = async () => {
        const img = await createImage(image)

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx || !croppedAreaPixels) return

        canvas.width = croppedAreaPixels.width
        canvas.height = croppedAreaPixels.height
        const scaleX = img.naturalWidth / img.width
        const scaleY = img.naturalHeight / img.height

        ctx.drawImage(
            img,
            croppedAreaPixels.x * scaleX,
            croppedAreaPixels.y * scaleY,
            croppedAreaPixels.width * scaleX,
            croppedAreaPixels.height * scaleY,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        )

        return new Promise<string>((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) return
                resolve(URL.createObjectURL(blob))
            }, 'image/png')
        })
    }

    return (
        <div
            onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
            }}
            className="relative w-full min-h-[400px] bg-black overflow-hidden"
        >
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={width / height || 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropCompleteHandler}
            />

            <button
                onClick={async () => {
                    const cropped = await getCroppedImg()
                    if (cropped) {
                        onCropComplete(cropped)
                        setPreviewMode("preview")
                    }
                }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-linear-to-b from-gray-100 to-gray-200 shadow-[0_0_3px_0_rgba(0,0,0,.25)] px-4 py-2 rounded text-xs"
            >
                Crop
            </button>
        </div>
    )
}