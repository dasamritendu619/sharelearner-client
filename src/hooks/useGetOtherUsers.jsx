import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setOtherUsers } from '../store/userSlice';
import { authService } from '@/apiServices/authServices';

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        // axios.defaults.withCredentials = true;
        // const res = await axios.get(`http://localhost:8080/api/v1/user`);
        const responce = await authService.getOtherUsers();
        console.log("Other user");
        console.log(responce);  // user not found
        // // store
        // dispatch(setOtherUsers(responce.data.data))
      } catch (error) {
        console.log(error)
      }
    }
    fetchOtherUsers()
  }, [])
}

export default useGetOtherUsers