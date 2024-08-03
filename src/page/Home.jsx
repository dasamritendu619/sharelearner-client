import React from 'react'
import { useSelector } from 'react-redux'

export default function Home() {
    const user = useSelector(state => state.auth.user)
  return (
    <div className=''>
      
    </div>
  )
}
