import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../store/userSlice';

export default function OtherUser(props) {
    const user = props.user;
    const dispatch = useDispatch();
    const {selectedUser, onlineUsers} = useSelector(store=> store.user)

    const isOnline = onlineUsers?.includes(user._id);

    const selectedUserHandler = (user)=>{
        dispatch(setSelectedUser(user))
    }
    return (
        <>
            <div onClick={()=>selectedUserHandler(user)} className={`${selectedUser?._id === user._id ? 'bg-zinc-200':''} flex gap-2 items-center hover:bg-zinc-200 rounded p-2 cursor-pointer`}>
                <div className={`avatar ${isOnline ? 'online': ''}`}>
                    <div className='w-12 rounded-full'>
                        <img src={user?.avatar} alt="user profile" />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between gap-2'>
                        <p className='text-stone-800'>{user?.fullName}</p>
                    </div>
                </div>
            </div>
            <div className='divider my-0 py-0 h-1'></div>
        </>
    )
}
