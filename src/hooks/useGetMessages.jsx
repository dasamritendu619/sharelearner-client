import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../store/messageSlice';
import { messageService } from '@/apiServices/messageServices';

const useGetMessages = () => {
    const { selectedUser } = useSelector(store => store.user)
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchMesseges = async () => {
            try {
                const res = await messageService.getMessage({receiverId: selectedUser._id});
                dispatch(setMessages(res.data))
            } catch (error) {
                console.log(error);
            }
        }
        fetchMesseges();
    }, [selectedUser?._id, setMessages])
}

export default useGetMessages