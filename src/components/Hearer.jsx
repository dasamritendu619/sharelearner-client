import React from 'react'
import { ModeToggle } from './mode-toggle'
import ProfileBtn from './auth/ProfileBtn'
import { Link, NavLink } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from 'react-router-dom'
import { BookOpen, FileText, House, Image, MessageCircle, Plus, Search, UsersRound, Video } from 'lucide-react'

export default function Hearer() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  return (
    <>
    <header className='flex justify-between sm:border-b bg-gray-50 dark:bg-gray-950'>
      <div className='flex flex-nowrap justify-start w-[50%] sm:w-[30%] md:w-[33%]'>
        <Link className='my-2 block'>
          <img src="/letter-s-modern-colorful-logo-business-s-letter-identity-logo-vector-design_135595-1206-removebg-preview-min.png"
            alt="logo"
            className='w-10 mx-1 md:mx-2' />
        </Link>
        <Button title="Search..." onClick={() => navigate("/search")}
          variant="outline" size="icon" 
          className='my-2 mx-[2px] p-2 rounded-full bg-gray-200 hover:bg-gray-100 dark:bg-gray-700 font-bold hidden sm:block lg:hidden'>
          <Search size={20} />
        </Button>
        <Button title="Search..." onClick={() => navigate("/search")}
          className='my-2 w-40 flex sm:hidden mx-[2px] rounded-full text-black dark:text-white hover:bg-gray-100 bg-gray-200 dark:bg-gray-700 lg:flex flex-nowrap justify-between lg:w-56'>
          <span>Search...</span><Search size={18} />
        </Button>
      </div>

      <div className='hidden sm:flex sm:flex-nowrap sm:justify-between sm:w-[40%] md:w-[33%]'>
        <NavLink to={'/'}
          className={({ isActive, isPending }) =>
            isActive ? "active nav-item" : "nav-item"
          }>
          <House size={25} />
        </NavLink>
        <NavLink to={'/profiles'}
          variant="outline" size="icon"
          className={({ isActive, isPending }) =>
            isActive ? "active nav-item" : "nav-item"
          }>
          <UsersRound size={25} />
        </NavLink>
        <NavLink to={'/chat'}
          variant="outline" size="icon"
          className={({ isActive, isPending }) =>
            isActive ? "active nav-item" : "nav-item"
          }>
          <MessageCircle size={25} />
        </NavLink>
        <NavLink to={'/blogs'}
          variant="outline" size="icon"
          className={({ isActive, isPending }) =>
            isActive ? "active nav-item" : "nav-item"
          }>
          <BookOpen size={25} />
        </NavLink>
        <NavLink to={'/videos'}
          variant="outline" size="icon"
          className={({ isActive, isPending }) =>
            isActive ? "active nav-item" : "nav-item"
          }>
          <Video size={25} />
        </NavLink>
      </div>
      <div className='flex flex-nowrap justify-end  w-[50%] sm:w-[30%] md:w-[33%]'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button title="Create Post"
              variant="outline" size="icon" className='my-2 mx-[2px] rounded-full bg-gray-200 dark:bg-gray-700 font-bold'>
              <Plus size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Create Post</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/create-blog-post")} className=" cursor-pointer">

              <BookOpen className="mr-2 h-4 w-4" />
              <span>Blog</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/create-photo-post")} className=" cursor-pointer">

              <Image className="mr-2 h-4 w-4" />
              <span>Photo</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/create-video-post")} className=" cursor-pointer">

              <Video className="mr-2 h-4 w-4" />
              <span>Video</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/create-pdf-post")} className=" cursor-pointer">

              <FileText className="mr-2 h-4 w-4" />
              <span>PDF</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />
        {user ? <ProfileBtn className='my-2 ml-[4px] mr-1 md:mr-2 rounded-full' /> : 
        <Link to='/login' 
        className='my-2 ml-[4px] mr-1 md:mr-2 rounded-full bg-gray-200 text-blue-600 dark:bg-gray-700 font-bold py-2 px-4'>
          Login
        </Link>
        }
      </div>
    </header>

    <div className='flex flex-nowrap px-3 justify-between sm:hidden border-b bg-gray-50 dark:bg-gray-950 border-t'>
    <NavLink to={'/'}
          className={({ isActive, isPending }) =>
            isActive ? "active nav-item2" : "nav-item2"
          }>
          <House size={25} />
        </NavLink>
        <NavLink to={'/profiles'}
          variant="outline" size="icon"
          className={({ isActive, isPending }) =>
            isActive ? "active nav-item2" : "nav-item2"
          }>
          <UsersRound size={25} />
        </NavLink>
        <NavLink to={'/chat'}
          variant="outline" size="icon"
          className={({ isActive, isPending }) =>
            isActive ? "active nav-item2" : "nav-item2"
          }>
          <MessageCircle size={25} />
        </NavLink>
        <NavLink to={'/blogs'}
          variant="outline" size="icon"
          className={({ isActive, isPending }) =>
            isActive ? "active nav-item2" : "nav-item2"
          }>
          <BookOpen size={25} />
        </NavLink>
        <NavLink to={'/videos'}
          variant="outline" size="icon"
          className={({ isActive, isPending }) =>
            isActive ? "active nav-item2" : "nav-item2"
          }>
          <Video size={25} />
        </NavLink>
    </div>
    </>
  )
}
