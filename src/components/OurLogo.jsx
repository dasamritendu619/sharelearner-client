import React from 'react'

export default function OurLogo() {
    const mode = localStorage.getItem('vite-ui-theme') || 'dark'
  return (
    <div className={`w-screen h-screen grid place-content-center ${mode === "dark" ? "bg-black" : "bg-white"}`}>
       {mode === "dark" ? 
       <img src="/Logo Dark.png" alt="logo" className='w-[70%] sm:w-[55%] md:w-[40%] items-center block mx-auto' /> :
       <img src="/Logo Light.png" alt="logo" className='w-[70%] sm:w-[55%] md:w-[40%] items-center block mx-auto' />}
    </div>
  )
}
