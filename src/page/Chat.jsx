import React, { useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import MessageContainer from '../components/MessageContainer'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Chat() {
  // const { authUser } = useSelector(store => store.user);
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (!authUser) {
  //     navigate("/login");
  //   }
  // }, []);
  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <div className='flex lg:flex-row flex-col sm:h-[400px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
        <Sidebar/>
        <MessageContainer/>
      </div>
    </div>
  )
}
