import React,{useState} from 'react'
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { validateEmail } from "../../helper/helper"
import { useToast } from '../ui/use-toast'
import { authService } from '@/apiServices/authServices'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp'
import { Loader2 } from 'lucide-react'
import { useDispatch,useSelector } from 'react-redux'
import { login } from '@/store/authSlice'

export default function ChengeEmail() {
    const { toast } = useToast()
    const { register, handleSubmit,resetField } = useForm();
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState("");
    const [value, setValue] = React.useState("")
    const [newEmail,setNewEmail] = useState("");
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)

    const onSubmit = async (data) => {
        if (data.n_email === user.email) {
            toast({
                variant: "destructive",
                title: "Old and new email can't be the same",
            })
            return;
        }
        if (!validateEmail(data.n_email.trim())) {
            toast({
                variant: "destructive",
                title: "Invalid email",
                description: "Please enter a valid email address",
            })
            return;
        }
        const responce = await authService.sendEmailForUpdateEmailRequest({
            newEmail: data.n_email.trim()
        })
        if (!responce.data || responce.status >= 400) {
            toast({
                variant: "destructive",
                title: responce.message,
            })
        } else {
            toast({
                variant: "success",
                className: "bg-green-500",
                title: "Email sent successfully",
                description: "Please check your email for the OTP",
            })
            setNewEmail(data.n_email.trim())
        }
    }

    const verifyOTP = async () => {
        if (value.length !== 6) {
            return ;
        }
        setIsLoading(true)
        const responce = await authService.changeEmail({
            otp: value,
            newEmail: newEmail
        })
        if (!responce.data || responce.status>=400) {
            setError(responce.message)
            toast({
                variant: "destructive",
                title: responce.message,
            })
            setIsLoading(false)
        }
        else {
            dispatch(login({...user,email:newEmail}));
            toast({
                variant: "success",
                className: "bg-green-500",
                title: "Success",
                description: "Email changed successfully",
            })
            setError("")
            resetField("n_email");
            setNewEmail("")
            setValue("")
        }
    }

    return (
        <> {!newEmail ?
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
                <CardTitle>Email</CardTitle>
                <CardDescription>
                    Chenge your account email hear. Click save when you're done.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="space-y-1">
                    <Label htmlFor="o_email">Old Email</Label>
                    <Input id="o_email" defaultValue={user.email} readOnly />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="n_email">New Email</Label>
                    <Input {...register("n_email", { required: true })} 
                    placeholder="Type your new email here."
                    required
                    id="n_email" />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full">Save changes</Button>
            </CardFooter>
        </form>
        :
        <div className='p-6'>
                <h2 className="text-center mb-8 text-black dark:text-white text-xl font-bold">
                    Verify Your Email</h2>
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
            </div>}
        </>
    )
}
