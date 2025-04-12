import { Outlet } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { useState,useEffect } from 'react'
import { authService } from './apiServices/authServices'
import { useDispatch,useSelector } from 'react-redux'
import { login } from './store/authSlice'
import OurLogo from './components/OurLogo'
import "./cssFiles/loader.css";
import Hearer from './components/Hearer'
import conf from './conf/conf';
import { useNavigate } from 'react-router-dom'

import io from 'socket.io-client';
import { setSocketId } from './store/socketSlice';
import { setOnlineUsers } from './store/userSlice';
import { useSocket } from './context/SocketContext.jsx'

function App() {
  const {authUser} = useSelector(store=>store.user);
  const { setSocket } = useSocket();
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    if(!authUser) {
      navigate('/about-us');
    }
  },[authUser])

  useEffect(() => {
    const verifyUser = async () => {
      const response = await authService.getCurrentUser();
      if (!response.data || response.status >= 400) {
        const res = await authService.refreshAccessToken();
        if (!res.data || res.status >= 400) {
          setLoading(false)
        } else {
          dispatch(login(res.data))
          setLoading(false)
        }
      }
      else {
        dispatch(login(response.data))
        setLoading(false)
      }
    }
    verifyUser()
  }, [])

  useEffect(()=>{
    if(authUser){
      const socketio = io(`${conf.backendUrl}`,{
        query:{
          userId:authUser._id
        }
      });
      setSocket(socketio)

      socketio.on("connect", () => {
        console.log("Connected with socket ID:", socketio.id);
        dispatch(setSocketId(socketio.id));
      });

      socketio?.on('getOnlineUsers',(onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers));
      });
      return ()=>socketio.close();
    }else{
        setSocket(null);
        dispatch(setSocketId(null));
    }
  },[authUser])

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    {
      loading ? <OurLogo/> : 
      <div className='m-0 p-0'>
      <Hearer  />
      <Outlet />
      <Toaster />
    </div>
    }
    </ThemeProvider>
  )
}

export default App
