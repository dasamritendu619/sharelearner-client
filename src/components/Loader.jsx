import React from 'react'
import "../cssFiles/loader.css";

export default function Loader({className="h-screen w-screen"}) {
  return (
    <div className={`bg-gray-100 text-black dark:text-white dark:bg-gray-950 grid place-content-center ${className}`}>
        <div className='loader1'>

        </div>
    </div>
  )
}