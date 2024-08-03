import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"

import React, { useState } from "react"
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
import { authService } from "@/apiServices/authServices"


export  default function SentForgotPasswordEmail() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    if(!data.email.trim()) {
      toast({
        variant: "destructive",
        title: "Email is required",
      })
      return ;
    }
    setIsLoading(true)
    const response = await authService.sendForgotPasswordEmail({email:data.email.trim()})
    if (!response.data || response.status>=400) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: response.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      setIsLoading(false)
    }
    else {
      toast({
        variant: "success",
        title: "Success",
        className: "bg-green-500",
        description: "Email Sent Successfully!",
      })
      navigate(`/reset-password?email=${data.email.trim()}`)
    }  
  }

  return (
    <div className="w-screen h-screen fixed top-0 left-0 grid place-content-center bg-blue-100 dark:bg-gray-950">
      <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Your Password ?</CardTitle>
        <CardDescription>
          Enter your email below.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            {...register("email",{required:true})}
          />
        </div>
      </CardContent>
      <CardFooter>
      <Button
            type="submit" className="w-full mt-6 font-bold" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Please Wait..." : "Send Email"}
            </Button>
      </CardFooter>
      </form>
    </Card>
    </div>
  )
}
