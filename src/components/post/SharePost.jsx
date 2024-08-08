import React,{useState,memo} from 'react'
import { Share2, Copy, ChevronDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { useSelector } from 'react-redux'
import { useToast } from '../ui/use-toast'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { postService } from '@/apiServices/postServices'
import { useNavigate } from 'react-router-dom'


export default memo(function SharePost({ post, className = 'mx-[2px] lg:mx-1' }) {
    const user = useSelector(state => state.auth.user)
    const { toast } = useToast()
    const [visibility, setVisibility] = useState("public")
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate();
    const postURL = window.location.protocol + "//" + window.location.host + "/post/" + post._id

    const forkPost = async (data) => {
        const response = await postService.forkPosts({
            postId: post._id,
            visibility: visibility,
            title: data.title.trim()
        })
        if (response.status >= 400 || !response.data) {
            toast({
                title: "Something went wrong!",
                description: response.message,
                className: "bg-red-500",
            });
        } else {
            toast({
                title: "Post Shared Successfully!",
                description: response.message,
                className: "bg-green-500",
            });
            navigate(`/post/${response.data._id}`)
        }
    }

    return (
        <div className={`flex flex-col ${className}`}>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button className='post-btn'>
                        <Share2 size={20} /> <span className='pl-1 text-[12px]'>Share</span>
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="mb-1">Share {post.author.fullName}'s Post</AlertDialogTitle><hr />
                        <AlertDialogDescription>
                            {user && <div>
                                <div className='flex flex-nowrap justify-start'>
                                    <img src={user.avatar.replace("upload/", "upload/w_70/")} alt='avatar'
                                        className='rounded-full w-12 lg:w-14' />
                                    <div className='flex flex-col pl-2'>
                                        <span className='text-[12px] block text-gray-800 dark:text-gray-200 text-start'>{user.fullName}</span>
                                        <div>
                                            <button 
                                            className='text-[12px] text-black dark:text-white font-semibold cursor-not-allowed bg-gray-300 dark:bg-gray-700 px-2 rounded-md' disabled >
                                                feed
                                            </button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button 
                                                    className='text-[12px] text-black dark:text-white font-semibold ml-1 bg-gray-300 dark:bg-gray-700 px-2 rounded-md'>
                                                        <span>{visibility}</span> <ChevronDown size={14} className=' float-right mt-1' />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => setVisibility("public")}>
                                                        Public
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setVisibility("private")}>
                                                        Private
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setVisibility("friends")}>
                                                    Friends
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                                <form className='block w-full' onSubmit={handleSubmit(forkPost)}>
                                <input 
                                {...register('title',{required:true})}
                                type="text" 
                                required
                                className="bg-transparent outline-none border-none text-[16px] text-left items-start w-full my-4 h-8" 
                                placeholder='Write something about this post...' />
                                <div className='w-full flex flex-nowrap justify-between mb-5'>
                                    <span></span>
                                    <Button type='submit' 
                                className=' bg-blue-600 text-white font-semibold hover:bg-blue-500'>Share Now</Button>
                                </div>
                                </form><hr />
                            </div>}

                            <div className='flex flex-nowrap justify-center my-4'>
                                <Input type="text" value={postURL} readOnly className="border-r-0 outline-none" />
                                <button className=" border border-l-0 rounded-md pr-2"
                                    onClick={() => {
                                        navigator.clipboard.writeText(postURL);
                                        toast({
                                            title: "Link Copied to Clipboard!",
                                            className: "bg-green-500",
                                        });
                                    }}
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <button disabled className='text-[12px] text-gray-600 mt-1 dark:text-gray-400'>
                {post.sharesCount} Shares
            </button>
        </div>
    )
})
