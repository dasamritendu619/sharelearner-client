import React, { useState } from 'react'
import { IoMdSearch } from "react-icons/io";
import OtherUsers from './OtherUsers';
//import axios from 'axios';
import toast from 'react-hot-toast'
//import {useNavigate} from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux';
import { setAuthUser, setOnlineUsers, setOtherUsers, setSelectedUser } from '../store/userSlice';
//import { setMessages } from '../store/messageSlice';

export default function Sidebar() {
  const [search , setSearch] = useState("")
  const { otherUser} = useSelector(store=> store.user)
  const dispatch = useDispatch();

  // const navigate = useNavigate()
  // const logoutHandler = async ()=>{
  //   try {
  //     const res = await axios.get(`http://localhost:8080/api/v1/user/logout`)
  //     navigate("/login")
  //     toast.success(res.data.data)
  //     dispatch(setAuthUser(null))
  //     dispatch(setMessages(null));
  //     dispatch(setOtherUsers(null));
  //     dispatch(setSelectedUser(null));
  //     dispatch(setOnlineUsers(null));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const searchSubmitHandler = (e)=>{
    e.preventDefault();
    const conversationUser = otherUser?.find((user)=> user.fullName.toLowerCase().includes(search.toLowerCase()))
    console.log(conversationUser);
    if(conversationUser){
      dispatch(setOtherUsers([conversationUser]))
    }else{
      toast.error("User not found!")
    }
  }

  return (
    <div className='border-r border-slate-500 p-4 flex flex-col'>
        <form onSubmit={searchSubmitHandler} action="" className='flex items-center gap-2'>
            <input 
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className='input input-bordered rounded-md bg-red-500 text-white' 
            type="text" 
            placeholder='Search...' 
            />
            <button type='submit' className='btn bg-slate-700 text-white'>
                <IoMdSearch className='w-6 h-6 outline-none'/>
            </button>
        </form>
        <div className='divider px-3'></div>
        <OtherUsers/>
        {/* <div className='mt-2'>
            <button  onClick={logoutHandler} className='btn btn-sm'>Logout</button>
        </div> */}
    </div>
  )
}
