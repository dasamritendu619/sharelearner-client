import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import {isStrongPassword,isValidUsername,validateEmail} from "@/helper/helper"
import { authService } from "@/apiServices/authServices"

export default function Signup() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()
    const [fullNameError, setFullNameError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [username, setUsername] = useState("");

    const onSubmit = async (data) => {  
        if (!data.fullName.trim()) {
            setFullNameError("Full Name is required");
            return;
        }
        if (isValidUsername(username) !== true) {
            setUsernameError(isValidUsername(username));
            return;
        }
        if (validateEmail(data.email.trim()) !== true) {
            setEmailError("Invalid Email");
            return;
        }
        if (isStrongPassword(data.password.trim()) !== true) {
            setPasswordError(isStrongPassword(data.password.trim()));
            return;
        }
        setIsLoading(true)
        const responce = await authService.registerUser({
            username: username.trim(),
            email: data.email.trim(),
            password: data.password.trim(),
            fullName: data.fullName.trim(),
        })

        if (!responce.data || responce.status>=400) {
            console.log(responce)
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: responce.message,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
              })
            setIsLoading(false)
        }
        else {
            toast({
                className: "bg-green-500",
                title: "Account Created Successfully",
                description: "Please verify your email to continue",
              }) 
            setIsLoading(false)
            navigate(`/verify-user?identifier=${username}`)
        }
    }

    const checkUsername = async () => {
        if (username.length < 4) {
            return;
        }
        if (isValidUsername(username) !== true) {
            setUsernameError(isValidUsername(username));
            return;
        }
        if (username.length > 20) {
            setUsernameError("Username must be atmost 20 characters long");
            return;
        }
        setIsSearching(true);
        const responce = await authService.checkUserNameAvailability({username: username})
        if (!responce.data || responce.status>=400) {
            setUsernameError("Username Not Available!");
        }
        else {
            setUsernameError("Username Available!");
        }
        setIsSearching(false);
    }

    useEffect(() => {
        setUsernameError("");
        if (username.length >= 4) {
          const timeOut = setTimeout(() => {
            checkUsername();
          }, 700);
          return () => clearTimeout(timeOut);
        }
      }, [username]);

    return (
        <div className="w-screen fixed top-0 left-0 overflow-y-auto h-auto bg-blue-100 dark:bg-gray-950">
            <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[700px]">
            <div className="hidden bg-muted lg:block">
                <img
                    src="/26217336_dv31_ofwk_220224.svg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-contain dark:brightness-[0.6] dark:grayscale-0"
                />
            </div>
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold mb-4">
                            Welcome To ShareLearner
                        </h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your information to create an account
                        </p>
                    </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                    <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="John Doe"
                                required
                                {...register("fullName", { required: true })}
                            />
                            {
                                fullNameError && <p className="text-red-500 text-sm">{fullNameError}</p>
                            }
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">username</Label>
                            <input
                                id="username"
                                value={username}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                type="text"
                                placeholder="john_doe"
                                required
                                onChange={(e) => setUsername(e.target.value.trim())}
                            />
                            {
                                isSearching && <p className="text-blue-500 text-sm flex flex-nowrap justify-start"><Loader2 /> <span> Checking Username...</span></p>
                            }
                            {
                                usernameError !== "Username Available!"?
                                 <p className="text-red-500 text-sm">{usernameError}</p> : 
                                 <p className="text-green-500 text-sm">{usernameError}</p>
                            }
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                {...register("email", { required: true })}
                            />
                            {
                                emailError && <p className="text-red-500 text-sm">{emailError}</p>
                            }
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                               
                            </div>
                            <Input 
                            id="password" 
                            type="password" 
                            required 
                            {...register("password", { required: true })}
                            />
                            {
                                passwordError && <p className="text-red-500 text-sm">{passwordError}</p>
                            }
                        </div>
                        <Button type="submit" className="w-full"
                          disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Creating Account" : "Create Account" }
                        </Button>
                    </div>
                    </form>
                        <Button
                            onClick={() => {
                                toast({
                                    title: "Sorry, feature Not Available",
                                    className: "bg-red-500",
                                    description: "This Feature is not available yet",
                                })
                            }}
                            variant="outline" className="w-full">
                            Login with Google
                        </Button>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to={"/login"} className="underline">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}
