import JSZip from 'jszip'

export const splitImage = (file: File, rows: number, cols: number ) => {
    return new Promise((resolve) => {
        const zip = new JSZip()
        const promises: Promise<void>[] = []
        const previews: string[] = []
        const img = new Image()
        const reader = new FileReader()

        reader.onload = (e) => {
            img.src = e.target?.result as string
        }

        img.onload = async() => {
            const pieceW = Math.floor(img.width / cols);
            const pieceH = Math.floor(img.height / rows);



            for(let r = 0; r < rows; r++){
                for(let c = 0; c < cols; c++){
                    const canvas = document.createElement('canvas')
                    canvas.width = pieceW;
                    canvas.height = pieceH;

                    const ctx = canvas.getContext('2d')
                    ctx!.imageSmoothingEnabled = true
                    ctx!.imageSmoothingQuality = "high"

                    ctx?.drawImage(img, c * pieceW, r * pieceH, pieceW, pieceH, 0, 0, pieceW, pieceH)   

                    const previewsURL = canvas.toDataURL("image/png")
                    previews.push(previewsURL)
                    
                    const p = new Promise<void>((res)=> {
                        canvas.toBlob((blob) => {
                            if(blob){
                                zip.file(`image-${r}-${c}.png`, blob)
                            }
                            res()
                        }, "image/png")
                    })
                    promises.push(p)
                }
            }
            await Promise.all(promises)

            const zipBlob = await zip.generateAsync({ type: "blob" })

            resolve({zipBlob, previews})
        }
        reader.readAsDataURL(file)
    })
}