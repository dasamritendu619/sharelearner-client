import React from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <div className='w-screen h-screen grid place-content-center'>
        <img src="/20602775_6333062.svg" alt="image"
        className='w-[95vw] sm:w-[70vw] md:w-[40vw] lg:[30vw]' />
        <Button variant="link">
            <Link to="/">
                Go back to home
            </Link>
        </Button>
    </div>
  )
}
