import React, { useState } from 'react'
import { IoMdSearch } from "react-icons/io";
import OtherUsers from './OtherUsers';
import toast from 'react-hot-toast'
import { useDispatch,useSelector } from 'react-redux';
import { setOtherUsers } from '../store/userSlice';

export default function Sidebar() {
  const [search , setSearch] = useState("")
  const { otherUser} = useSelector(store=> store.user)
  const dispatch = useDispatch();

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
    <div className='border-r h-[35vh] lg:h-[85vh] border-slate-500 p-4 flex flex-col'>
        <form onSubmit={searchSubmitHandler} action="" className='flex items-center gap-2'>
            <input 
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className='input input-bordered rounded-md' 
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
