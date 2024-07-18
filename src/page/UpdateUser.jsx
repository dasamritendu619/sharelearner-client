import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import ChengePassWord from "@/components/auth/ChengePassWord"
import { useForm } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { format } from "date-fns"
import { Calendar as CalendarIcon,Github,Linkedin,BriefcaseBusiness, CloudCog } from "lucide-react";
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState,useEffect } from "react"
import { useSelector,useDispatch } from "react-redux"
import { login,logout } from "@/store/authSlice"
import ChengeEmail from "@/components/auth/ChengeEmail"
import { authService } from "@/apiServices/authServices"

export default function UpdateUser() {
  const [date, setDate] = useState(null)
  const [gender, setGender] = useState("")
  const {toast} = useToast()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [userDetails, setUserDetails] = useState(null)

  useEffect(() => {
    if (!user) {
      dispatch(logout())
    } else {
      authService.getCurrentUserDetails()
      .then((res) => {
        if (!res.data || res.status>=400) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch user details",
          })
        } else {
          setUserDetails(res.data)
          setDate(res.data.dob ?new Date(res.data.dob): null)
          setGender(res.data.gender || "")
        }
      })
    }
  }, [user])

  const onSubmit = async (data) => {
    
    const dob = userDetails?.dob ? new Date(userDetails.dob).toLocaleString() : null
    if(
      new Date(date).toLocaleString() === dob &&
      data.fullName.trim() === userDetails.fullName &&
      data.about.trim() === userDetails.about &&
      data.address.trim() === userDetails.address &&
      data.education.trim() === userDetails.education &&
      data.interest.trim() === userDetails.interest &&
      data.github.trim() === userDetails.links[0] &&
      data.linkedin.trim() === userDetails.links[1] &&
      data.portfolio.trim() === userDetails.links[2]
    ){
      return toast({
        className: "bg-blue-500",
        title: "No changes made!",
        description: "You haven't made any changes to save.",
      })
    }
    if(!date){
      return toast({
        variant: "destructive",
        title: "Date of Birth is required!",
        description: "Please select a date of birth",
      })
    }
    if(!gender){
      return toast({
        variant: "destructive",
        title:"Gender is required!",
        description: "Please select your gender",
      })
    }
    const response = await authService.updateUserDetails({
      fullName: data.fullName.trim(),
      dob: date,
      gender:gender,
      about: data.about.trim(),
      address: data.address.trim(),
      education: data.education.trim(),
      interest: data.interest.trim(),
      links: [data.github.trim(),data.linkedin.trim(),data.portfolio.trim()]
    })
    if(!response.data || response.status>=400){
      toast({
        variant: "destructive",
        title: "Failed to update user details",
        description: response.message || "Something went wrong",
      })
    } else {
      toast({
        variant: "success",
        className: "bg-green-500",
        title: "User details updated successfully",
        description: "Your user details have been updated successfully",
      })
    
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12 bg-blue-100 dark:bg-gray-950">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>

              {/* Username */}
              <CardHeader>
                <CardTitle>Username</CardTitle>
                <CardDescription>
                  You can't change your username after you've saved it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={user.username} readOnly />
                </div>
              </CardContent>

              <Separator className="my-1" />

              {/* Email */}
                <ChengeEmail />

              <Separator className="my-1" />

              {/* Password */}

              <ChengePassWord />
            </Card>
          </TabsContent>



          {/* Profile */}
          <TabsContent value="profile">
            <Card>

              {/* Fulllname */}
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  You can change your profile if you want.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmit)} >
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={userDetails?.fullName || ""}
                  {...register("fullName", { required: true })}
                  required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Popover >
                    <PopoverTrigger asChild>
                      <Button
                        id="dob"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="gender">Gender</Label>
                  <Select defaultValue={userDetails?.gender || ""}
                   required onValueChange={(value) => setGender(value)}
                   id="gender"
                  >
                    <SelectTrigger className="w-full"  id='gender' >
                      <SelectValue placeholder="Select a gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup >
                        <SelectLabel>Gender</SelectLabel>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                        <SelectItem value="O">Others</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="bio">About You</Label>
                <Textarea placeholder="Type something about yourself." id="bio"
                {...register("about")} defaultValue={userDetails?.about || ""}
                />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="edu">Education</Label>
                <Textarea placeholder="Type your education details here." id="edu"
                {...register("education")} defaultValue={userDetails?.education || ""}
                />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="address">Address</Label>
                <Textarea placeholder="Type your address here." id="address"
                {...register("address")} defaultValue={userDetails?.address || ""}
                />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="l1" className='flex flex-nowrap justify-start'>
                    <Github className=" scale-75" /> <span className="block mt-1">Github Profile Link</span></Label>
                  <Input id="l1" placeholder="github.com/username"
                  {...register("github")} defaultValue={userDetails?.links[0] || ""}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="l2" className='flex flex-nowrap justify-start'>
                  <Linkedin className=" scale-75" /> <span className="block mt-1">Linkedin Profile Link</span></Label>
                  <Input id="l2" placeholder="linkedin.com/username"
                  {...register("linkedin")} defaultValue={userDetails?.links[1] || ""}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="l3" className='flex flex-nowrap justify-start'>
                    <BriefcaseBusiness className=" scale-75" /> <span className="block mt-1">Your Portfolio Link</span></Label>
                  <Input id="l3" placeholder="yourwebsite.com"
                  {...register("portfolio")} defaultValue={userDetails?.links[2] || ""}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="int">Interest</Label>
                <Textarea placeholder="Type interest here." id="int"
                {...register("interest")} defaultValue={userDetails?.interest || ""}
                />
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full" type="submit">Save Changes</Button>
              </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/11668565_20943640.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.6] dark:grayscale-0"
        />
      </div>
    </div>
  )
}
