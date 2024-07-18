import React,{useState,useEffect} from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { authService } from "@/apiServices/authServices"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useDispatch } from "react-redux"
import {login} from "@/store/authSlice"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"


export default function InputOTPControlled() {
    const [value, setValue] = React.useState("")
    const [error, setError] = React.useState("")
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { toast } = useToast()
    const searchParams = new URLSearchParams(window.location.search)
    const identifier = searchParams.get("identifier")
    
    const verifyOTP = async () => {
        if (value.length !== 6) {
            return ;
        }
        setIsLoading(true)
        const responce = await authService.verifyUser({identifier:searchParams.get("identifier").trim(),otp:value})
        if (!responce.data || responce.status>=400) {
            setError(responce.message)
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: responce.message,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
            setIsLoading(false)
        }
        else {
            setError("")
            console.log(responce.data)
            dispatch(login(responce.data.updatedUser))
            toast({
                variant: "success",
                className: "bg-green-500",
                title: "Success",
                description: "OTP Verified Successfully!",
            })
            navigate("/")
        }
    }
    
    useEffect(() => {
        if (!identifier) {
            navigate("/not-found")
        }
    }, [identifier])

    return (
        <div className="h-screen w-screen grid place-content-center bg-blue-100 dark:bg-gray-950">
            <div className="bg-gray-100 p-4 md:p-8 rounded-xl">
                <h2 className="text-center mb-8 text-black dark:text-white text-2xl font-bold">
                    Verify Your Identity</h2>
                    <p className={`${error ? "text-red-600":"text-black dark:text-white"} mb-2`}>
                        One-Time Password 
                    </p>
            <InputOTP
                maxLength={6}
                value={value}
                onChange={(value) => setValue(value)}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            <p className="dark:text-gray-400 text-gray-700 text-sm mt-3">
            Please enter the one-time password sent to your Email.
            </p>
            {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
            <Button
            onClick={verifyOTP}
            type="submit" className="w-full mt-6 font-bold" disabled={isLoading || value.length !== 6}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Please Wait..." : "Verify"}
            </Button>
            </div>
        </div>
    )
}
