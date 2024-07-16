import { Outlet } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { useState,useEffect } from 'react'
import { authService } from './apiServices/authServices'
import { useDispatch } from 'react-redux'
import { login } from './store/authSlice'
import Loader from './components/Loader'

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyUser = async () => {
      const response = await authService.getCurrentUser();
      if (!response.data || response.status >= 400) {
        console.log(response.data)
        setLoading(false)
      }
      else {
        dispatch(login(response.data))
        setLoading(false)
      }
    }
    verifyUser()
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    {
      loading ? <Loader/> : 
        <div>
      <Outlet />
      <Toaster />
    </div>
    }
    </ThemeProvider>
  )
}

export default App
