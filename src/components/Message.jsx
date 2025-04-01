import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';

export default function Message(props) {
    const messege = props.message;
    const scroll = useRef();
    const { authUser, selectedUser } = useSelector(store => store.user)
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" })
    }, [messege])
    return (
        <div ref={scroll} className={`chat ${authUser?._id === messege?.senderId ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img
                        alt="Tailwind CSS chat bubble component"
                        src={messege.senderId === authUser?._id ? authUser?.avatar : selectedUser?.avatar} />
                </div>
            </div>
            <div className="chat-header">
                <time className="text-xs opacity-50 text-white">12:45</time>
            </div>
            <div className={`chat-bubble ${authUser?._id === messege?.senderId ? 'bg-gray-200 text-slate-700' : ''}`}>{messege?.message}</div>
        </div>
    )
}
