import {Link, useNavigate} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react";
import { useForm } from "react-hook-form"
import { authService } from "@/apiServices/authServices"

export default function Login() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()

    const onSubmit = async (data) => {
      if (!data.identifier.trim()) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Email or Username is required",
        })
        return ;
      }
      if (!data.password.trim()) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Password is required",
        })
        return ;
      }
      setIsLoading(true)
      const responce = await authService.loginUser({
        identifier: data.identifier.trim(),
        password: data.password.trim(),
      })
      if (!responce.data || responce.status>=400) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: responce.message,
        })
        setIsLoading(false)
      }
      else {
        toast({
          title: "Success",
          description: "Login Successful!",
        })
        navigate(`/verify-user?identifier=${data.identifier.trim()}`)
      }
    }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold mb-4">
                Welcome Back!
            </h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email or Username</Label>
              <Input
                id="email"
                type="text"
                required
                {...register("identifier", { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/sent-forgot-password-email"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input 
              id="password" 
              type="password" 
              required
              {...register("password", { required: true })}
              />
            </div>
            <Button 
            type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Please Wait..." : "Login"}
            </Button>
          </div>
          </form>
            <Button 
                  onClick={() => {
                    toast({
                      description: "This Feature is not available yet",
                    })
                  }}
            variant="outline" className="w-full">
              Login with Google
            </Button>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to={"/signup"} className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/12285990_4898273.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.6] dark:grayscale-0"
        />
      </div>
    </div>
  )
}
