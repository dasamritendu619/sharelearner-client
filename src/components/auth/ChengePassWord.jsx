import React from 'react'
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import {isStrongPassword} from "../../helper/helper"
import { useToast } from '../ui/use-toast'
import { authService } from '@/apiServices/authServices'


export default function ChengePassWord() {
    const {toast} = useToast()
    const { register, handleSubmit, resetField } = useForm();

    const onSubmit = async (data) => {
        if (data.current === data.new) {
            toast({
                variant: "destructive",
                title: "Old and new password can't be the same",
            })
            return;
        }
        if (isStrongPassword(data.new.trim()) !== true) {
            toast({
                variant: "destructive",
                title: "Password is weak",
                description: isStrongPassword(data.new.trim()),
            })
            return;
        }
        const responce = await authService.changePassword({
            oldPassword:data.current.trim(),
            newPassword:data.new.trim()
        })

        if (!responce.data || responce.status>=400) {
            toast({
                variant: "destructive",
                title: responce.message,
            })
        } else {
            resetField("current");
            resetField("new");
            toast({
                variant: "success",
                className: "bg-green-500",
                title: "Password changed successfully",
                description: "You'll be logged out from all devices",
            })
        }
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input {...register("current", { required: true,minLength:8 })} required
                  id="current" type="password" placeholder="Enter your current password here." />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input {...register("new", { required: true,minLength:8 })} required
                   id="new" type="password" placeholder="Enter your new password here" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Save password</Button>
              </CardFooter>
    </form>
  )
}
