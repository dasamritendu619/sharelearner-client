import React, { useState, useRef } from 'react'

import ReactCrop from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.

export default function CorpEditor({ 
    aspect = 1, 
    imgSrc, 
    circularCrop = false, 
    keepSelection = true, 
    inw, 
    inh,
    title='',
    action,
    actionTxt,
    ...props }) {
    const imgRef = useRef(null)
    const [crop, setCrop] = useState({
        unit: 'px', // Can be 'px' or '%'
        x: 25,
        y: 25,
        width: inw || 50,
        height: inh || 50,
    })
    const [completedCrop, setCompletedCrop] = useState()

    async function getBolbFileOfCroppedImage(image, crop) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            throw new Error('No 2d context')
        }

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        // devicePixelRatio slightly increases sharpness on retina devices
        // at the expense of slightly slower render times and needing to
        // size the image back down if you want to download/upload and be
        // true to the images natural size.
        const pixelRatio = window.devicePixelRatio
        // const pixelRatio = 1

        canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

        ctx.scale(pixelRatio, pixelRatio)
        ctx.imageSmoothingQuality = 'high'

        const cropX = crop.x * scaleX
        const cropY = crop.y * scaleY

        ctx.drawImage(
            image,
            cropX,
            cropY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY,
        )

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error('Canvas is empty')
                }

                resolve(blob)
            }, 'image/jpeg')
        })
    }


    return (
        <>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {title}
                    </AlertDialogTitle>
                    <div>
                        <div className='w-full'>
                            {imgSrc && (
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspect}
                                    // minHeight={200}
                                    circularCrop={circularCrop}
                                    keepSelection={keepSelection}
                                    {...props}
                                >
                                    <img
                                        ref={imgRef}
                                        alt="Crop me"
                                        src={imgSrc}
                                        className='max-h-[70vh!important] w-full'
                                    />
                                </ReactCrop>
                            )}
                        </div>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={completedCrop ? false : true}
                    onClick={async () => {
                        if (!imgRef.current) {
                            return
                        }
                        if (action) {
                            const croppedBlob = await getBolbFileOfCroppedImage(imgRef.current, completedCrop)
                            await action(croppedBlob)
                        }
                        // todo: upload croppedBlob
                    }}
                    >
                        {actionTxt || "Crop"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </>
    )
}
