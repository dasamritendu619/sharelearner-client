import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import parse from 'html-react-parser'
import { ChevronDown, MessageCircle, MessageSquareMore, Save, Star, UserRoundPlus, House } from 'lucide-react'
import { likesService } from '@/apiServices/likesServices'
import { followersService } from '@/apiServices/followersServices'
import { savedService } from '@/apiServices/savedServices'
import { Skeleton } from "@/components/ui/skeleton"
import CommentCard from '@/components/post/CommentCard'
import SharePost from '@/components/post/SharePost'
import { useToast } from '@/components/ui/use-toast'
import { viewPost, updateViewedPost } from '@/store/postSlice'
import { Button } from '@/components/ui/moving-border'
import { Button as Btn } from '@/components/ui/button'

export default function PostCard({ post }) {
    //console.log(post)
    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch()
    const { toast } = useToast()
    const navigate = useNavigate()

    return (
            <div>
                <div className='flex justify-start border-gray-600 mt-2 flex-nowrap px-3 pt-2 border border-b-0 mx-4'>
                    <Link to={`/user/${post.author.username}`}>
                        <img src={post.author.avatar.replace("upload/", "upload/w_40/")} alt='avatar'
                            className='rounded-full w-10' />
                    </Link>
                    <p className='ml-2'>
                        <Link to={`/user/${post.author.username}`} className='text-[14px] leading-3 mt-1 font-semibold block'>
                            {post.author.fullName}
                        </Link>

                        <Link to={`/user/${post.author.username}`} className='text-[10px] text-gray-400'>
                            {post.author.followersCount} followers
                        </Link>
                    </p>
                    <button disabled={!user || user._id === post.author._id}
                        className={`flex-center ml-3 px-3 h-7 rounded-full leading-3 ${!post.author.isFollowedByMe ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"}`}>
                        {
                            !post.author.isFollowedByMe ? <>
                                <UserRoundPlus size={16} /> <span className='pl-1 text-[10px]'>Follow</span>
                            </> : <>
                                <span className='pl-1 text-[12px]'>Following</span>
                            </>
                        }
                    </button>
                </div>
                <div className='border border-gray-600 border-y-0 px-4 mx-4 pt-3 pb-1'>
                    <p className=' leading-3 text-[11px] text-gray-500'>
                        {new Date(post.createdAt).toDateString()}
                    </p>
                    <p className='font-semibold leading-5 text-[14px] lg:text-[16px]'>
                        {post.title}
                    </p>
                </div>
                <>
                {
                    (post.type === 'blog' || post.forkedFrom?.type === 'blog') &&
                    <Link to={`/post/${post._id}`} className='px-2 overflow-hidden py-2 block'>
                        {parse(post.type !== "forked" ? post.content : post.forkedFrom.content)}
                    </Link>
                }

                {
                    (post.type === 'photo' || post.forkedFrom?.type === 'photo') &&
                    <Link to={`/post/${post._id}`} className='px-2 py-2 block'>
                        <img src={post.type !== "forked" ? post.assetURL : post.forkedFrom.assetURL} alt="post photo" className='mx-auto' />
                    </Link>
                }

                {
                    (post.type === 'pdf' || post.forkedFrom?.type === 'pdf') &&
                    <Link to={`/post/${post._id}`} className='px-2 py-2 block'>
                        <iframe src={post.type !== "forked" ? post.assetURL : post.forkedFrom.assetURL}
                        width="100%" height="600px"></iframe>
                        {/* <embed src={post.type !== "forked" ? post.assetURL : post.forkedFrom.assetURL} width="100%" height="600px" /> */}
                        {/* <img src={post.type !== "forked" ? post.assetURL : post.forkedFrom.assetURL} width="100%" height="600px"/></img> */}
                    </Link>
                }

                {
                    (post.type === 'video' || post.forkedFrom?.type === 'video') &&
                    <Link to={`/post/${post._id}`} className='px-2 py-2 block'>
                        <video src={post.type !== "forked" ? post.assetURL : post.forkedFrom.assetURL} controls className='mx-auto' ></video>
                    </Link>
                }
                </>
                {
                    
                }
            </div>

    )
}
