import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../store/messageSlice';
import { messageService } from '@/apiServices/messageServices';

export default function SendInput() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(store => store.user);
  const { messages } = useSelector(store => store.message)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      console.log("Message cannot be empty");
      return;
    }
    try {
      const res = await messageService.sendMessage({ receiverId: selectedUser?._id, message: message });
      console.log(res.data);
      dispatch(setMessages([...(Array.isArray(messages) ? messages : []), res.data]))
    } catch (error) {
      console.log(error);
    }
    setMessage("");
  }
  return (
    <form onSubmit={onSubmitHandler} className='px-4 my-3' action="">
      <div className='w-full relative'>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder='Send a message...'
          className='border text-sm rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 text-white'
        />
        <button type='submit' className='absolute flex inset-y-0 end-0 items-center pr-4'>
          <IoSend />
        </button>
      </div>
    </form>
  )
}
