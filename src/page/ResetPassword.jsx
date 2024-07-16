import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import {isStrongPassword} from "@/helper/helper"
import { useToast } from "@/components/ui/use-toast"
import { authService } from "@/apiServices/authServices"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export  default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [retypePasswordError, setRetypePasswordError] = useState("")
  const { toast } = useToast();
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const searchParams = new URLSearchParams(window.location.search)
  const email = searchParams.get("email")

  const onSubmit = async (data) => {
    if (isStrongPassword(data.password.trim()) !== true) {
      setPasswordError(isStrongPassword(data.password.trim()));
      return;
    }
    if (data.password !== data.retypePassword) {
      setRetypePasswordError("Passwords do not match");
      return;
    }
    setIsLoading(true)
    const response = await authService.resetPassword({
      otp:otp,
      email:email,
      newPassword:data.password.trim()
    })

    if (!response.data || response.status>=400) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: response.message,
        action: <Button onClick={() => navigate(`/reset-password?email=${email}`)}>Try again</Button>,
      })
      setIsLoading(false)
    } else {
      toast({
        variant: "success",
        className: "bg-green-500",
        title: "Success",
        description: "Password Reset Successfully!",
      })
      navigate("/login")
    }
  }

  useEffect(() => {
    if (!email) {
        navigate("/not-found")
    }
}, [email])

  return (
    <div className="w-screen h-screen grid place-content-center">
      <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Your Password!</CardTitle>
        <CardDescription>
          Enter your Passwords below.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="password">
            One-Time Password (OTP)
          </Label>
          <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
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
            <p className="dark:text-gray-400 text-gray-700 text-sm mt-1 mb-3">
            Please enter the OTP sent to your Email.
            </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">New Password</Label>
          <Input id="password" type="password" required
          {...register("password", { required: true })}
          />
          {
            passwordError && <p className="text-red-500 text-sm">{passwordError}</p>
          }
        </div>
        <div className="grid gap-2">
          <Label htmlFor="retypePassword">Retype Password</Label>
          <Input id="retypePassword" type="password"  required
          {...register("retypePassword", { required: true })}
          />
          {
            retypePasswordError && <p className="text-red-500 text-sm">{retypePasswordError}</p>
          }
        </div>
      </CardContent>
      <CardFooter>
      <Button
            type="submit" className="w-full mt-6 font-bold" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Please Wait..." : "Reset Password"}
            </Button>
      </CardFooter>
      </form>
    </Card>
    </div>
  )
}
