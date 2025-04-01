import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setOtherUsers } from '../store/userSlice';
import { authService } from '@/apiServices/authServices';

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const responce = await authService.getOtherUsers();
        // store
        dispatch(setOtherUsers(responce.data))
      } catch (error) {
        console.log(error)
      }
    }
    fetchOtherUsers()
  }, [])
}

export default useGetOtherUsers