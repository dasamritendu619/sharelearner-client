import React from 'react'
import OtherUser from './OtherUser'
import useGetOtherUsers from '../hooks/useGetOtherUsers'
import { useSelector } from 'react-redux';

export default function OtherUsers() {
    // my custom hook
    useGetOtherUsers();
    const {otherUser} = useSelector(store=>store.user)
    if(!otherUser) return; //early reaturn in react
    
    return (
        <div className='overflow-auto flex-1'>
            {
                otherUser?.map((user)=>{
                    return (
                        <OtherUser key={user._id} user={user}/>
                    )
                })
            }
        </div>
    )
}
