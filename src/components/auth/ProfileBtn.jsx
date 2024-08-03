import React from 'react'
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSelector } from 'react-redux'
import { Blend, Github, Handshake, House, LifeBuoy, LogOut, MessageSquareDiff, Settings, User } from 'lucide-react'
import { authService } from '@/apiServices/authServices'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/authSlice'
import { useToast } from '../ui/use-toast'

export default function ProfileBtn({className='my-2 ml-[3px] mr-1 sm:mr-2 xl:mr-12 rounded-full'}) {
    const user = useSelector(state => state.auth.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { toast } = useToast()

    const handleLogout = async () => {
        const confirm = window.confirm("Are you sure you want to logout?")
        if (!confirm) return;
        const response = await authService.logoutUser();
        if (!response.data || response.status >= 400) {
            toast({
                title: "Error",
                description: response.message,
                variant: "destructive",
            })
        } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            dispatch(logout());
        }
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className={className}>
                    <img src={user.avatar.replace("upload/", "upload/w_40/")} alt="user" className=' rounded-full' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <img src={user.avatar.replace("upload/", "upload/w_40/")} alt="user" className='inline rounded-full mr-2 h-8 w-8' />
                    <span>{user.fullName}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup >
                    <DropdownMenuItem onClick={() => navigate(`/`)}>
                        <House className="mr-2 h-4 w-4" />
                        <span>Home</span>
                        <DropdownMenuShortcut>⇧⌘H</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/user/${user.username}`)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/update-user")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link to="/support">
                    <DropdownMenuItem>
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Support</span>
                    </DropdownMenuItem>
                    </Link>

                    <Link to="/terms">
                    <DropdownMenuItem>
                        <Handshake className="mr-2 h-4 w-4" />
                        <span>Terms and Conditions</span>
                    </DropdownMenuItem>
                    </Link>

                    <Link to="/feedback">
                    <DropdownMenuItem>
                        <MessageSquareDiff className="mr-2 h-4 w-4" />
                        <span>Feedback</span>
                    </DropdownMenuItem>
                    </Link>

                    <Link to="/about-us">
                    <DropdownMenuItem>
                        <Blend className="mr-2 h-4 w-4" />
                        <span>About Us</span>
                    </DropdownMenuItem>
                    </Link>

                    <a href="https://github.com/kuntal-hub" target='_blank'>
                    <DropdownMenuItem>
                        <Github className="mr-2 h-4 w-4" />
                        <span>GitHub</span>
                    </DropdownMenuItem>
                    </a>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
