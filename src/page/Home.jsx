import React from 'react'
import HomeLogin from '@/components/HomeLogin'
import HomeNotLogin from '@/components/HomeNotLogin'
import { useSelector } from 'react-redux'

export default function Home() {
    const user = useSelector(state => state.auth.user)
  return (
    <div className=''>
      {
        user ? <HomeLogin /> : <HomeNotLogin />
      }
    </div>
  )
}
