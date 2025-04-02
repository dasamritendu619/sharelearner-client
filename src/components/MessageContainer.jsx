import React, { useEffect } from 'react'
import SendInput from './SendInput'
import Messages from './Messages'
import { useDispatch, useSelector } from 'react-redux'
import {setSelectedUser} from '../store/userSlice'

export default function MessageContainer() {
  const { authUser,selectedUser, onlineUsers } = useSelector(store => store.user);
  const dispatch = useDispatch();

  const isOnline = onlineUsers?.includes(selectedUser?._id);
 
  return (
    <>
      {
        selectedUser !== null ? (
          <div className='md:min-w-[550px] h-[50vh] lg:h-[85vh] flex flex-col'>
            <div className='flex gap-2 items-center bg-zinc-800 text-white px-4 py-2 mb-2'>
              <div className={`avatar ${isOnline ? 'online' : ''}`}>
                <div className='w-12 rounded-full'>
                  <img src={selectedUser?.avatar} alt="user profile" />
                </div>
              </div>
              <div className='flex flex-col flex-1'>
                <div className='flex justify-between gap-2'>
                  <p>{selectedUser?.fullName}</p>
                </div>
              </div>
            </div>
            <Messages />
            <SendInput />
          </div>
        ) : (
          <div className='md:min-w-[550px] flex flex-col justify-center items-center'>
            <h1 className='text-2xl text-stone-700 font-bold'>Hi,{authUser?.fullName}</h1>
            <h1 className='text-2xl text-stone-700'>Let's start conversation</h1>
          </div>
        )
      }

    </>

  )
}
