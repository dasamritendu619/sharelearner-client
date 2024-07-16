import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import ChengePassWord from "@/components/auth/ChengePassWord"
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
import { Calendar as CalendarIcon,Github,Linkedin,BriefcaseBusiness } from "lucide-react";
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

export default function UpdateUser() {
  const [date, setDate] = useState(null)
  const {toast} = useToast()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
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
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={"Jone Duo"} />
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
                  <Select>
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
                <Textarea placeholder="Type something about yourself." id="bio" />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="edu">Education</Label>
                <Textarea placeholder="Type your education details here." id="edu" />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="address">Address</Label>
                <Textarea placeholder="Type your address here." id="address" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="l1" className='flex flex-nowrap justify-start'>
                    <Github className=" scale-75" /> <span className="block mt-1">Github Profile Link</span></Label>
                  <Input id="l1" placeholder="github.com/username" />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="l2" className='flex flex-nowrap justify-start'>
                  <Linkedin className=" scale-75" /> <span className="block mt-1">Linkedin Profile Link</span></Label>
                  <Input id="l2" placeholder="linkedin.com/username" />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="l3" className='flex flex-nowrap justify-start'>
                    <BriefcaseBusiness className=" scale-75" /> <span className="block mt-1">Your Portfolio Link</span></Label>
                  <Input id="l3" placeholder="yourwebsite.com" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="int">Interest</Label>
                <Textarea placeholder="Type interest here." id="int" />
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full" type="submit">Save Changes</Button>
              </CardFooter>
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
