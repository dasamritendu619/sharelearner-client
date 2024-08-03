import React from 'react'

export default function OurLogo() {
    const mode = localStorage.getItem('theme-in-use') || 'dark'
  return (
    <div className=' h-screen w-screen grid place-content-center bg-blue-100 dark:bg-gray-950'>
      <div>
          <img 
          src="letter-s-modern-colorful-logo-business-s-letter-identity-logo-vector-design_135595-1206-removebg-preview-min.png"
           alt="logo"
           className='block mx-auto w-40 h-40'
           />
           <h1 
           className='text-center md:text-3xl font-bold font-sans mt-2 text-gray-700 dark:text-white'
           >
              Share Learner
           </h1>
      </div>
    </div>
  )
}
