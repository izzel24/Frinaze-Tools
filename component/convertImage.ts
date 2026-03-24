export const convertImage = (file: File | Blob, format: string, quality: number, width: number, height: number) => {
        return new Promise((resolve) => {
            const img = new Image()
            const reader = new FileReader()

            reader.onload = (e) => {
                img.src = e.target?.result as string
            }

            img.onload = () => {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')

                canvas.width = width || img.width 
                canvas.height = height || img.height

                ctx?.drawImage(img,0,0)

                canvas.toBlob((blob) => {
                    resolve(blob)
                }, `image/${format}`, quality )
            }
            reader.readAsDataURL(file)
        });
    }