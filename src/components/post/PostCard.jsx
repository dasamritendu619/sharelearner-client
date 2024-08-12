import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser'
import { MessageSquareMore, Save, Star, UserRoundPlus } from 'lucide-react'
import { likesService } from '@/apiServices/likesServices'
import { followersService } from '@/apiServices/followersServices'
import { savedService } from '@/apiServices/savedServices'
import { Skeleton } from "@/components/ui/skeleton"
import SharePost from '@/components/post/SharePost'
import { useToast } from '@/components/ui/use-toast'
import { Button as Btn } from '@/components/ui/button'
import { useState, useRef, useEffect } from 'react'
import ProfileCard from '../ProfileCard'
import { useInView } from 'react-intersection-observer';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

export default function PostCard({ post, updatePosts, onInView, isInView }) {
    //console.log(post)
    const user = useSelector(state => state.auth.user)
    const { toast } = useToast()
    const navigate = useNavigate()
    const [profiles, setProfiles] = useState([])
    const [profileResData, setProfileResData] = useState(null)
    const [isTitleExpanded,setIsTitleExpanded] = useState(false)
    const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const title = post.title ? isTitleExpanded ? post.title : post.title.slice(0, 100) : ""
    const videoRef = useRef(null);
    const { ref, inView } = useInView({
      threshold: 0.8, // Adjust this threshold as needed
      triggerOnce: false,
    });

    useEffect(() => {
      if (videoRef.current) {
        if (inView) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    }, [inView]);
  
    useEffect(() => {
      if (inView) {
        onInView();
      }
    }, [inView]);


    const toggleFollow = async () => {
      if(!user) return navigate('/login')
      if (updatePosts) {
        updatePosts({ ...post, 
          author: { ...post.author, 
            isFollowedByMe: !post.author.isFollowedByMe,
            followersCount: post.author.isFollowedByMe ? post.author.followersCount - 1 : post.author.followersCount + 1
           } })
      }
        const response = await followersService.toggleFollowUser({
          profileId: post.author._id,
        })
        if (response.status >= 400 || !response.data) {
          toast({
            title: "Failed to Follow",
            description: response.message,
            variant: "destructive",
          })
        } 
    }

    const toggleLike = async () => {
      if(!user) return navigate('/login')
      if (updatePosts) {
        updatePosts({ ...post, 
          isLikedByMe: !post.isLikedByMe,
          likesCount: post.isLikedByMe ? post.likesCount - 1 : post.likesCount + 1
         })
      }
        const response = await likesService.toggleLikePost({
          postId: post._id,
        })
        if (response.status >= 400 || !response.data) {
          toast({
            title: "Failed to Like",
            description: response.message,
            variant: "destructive",
          })
        }
    }

    const toggleSave = async () => {
      if(!user) return navigate('/login')
      if (updatePosts) {
        updatePosts({ ...post, 
          isSavedByMe: !post.isSavedByMe,
          savedCount: post.isSavedByMe ? post.savedCount - 1 : post.savedCount + 1
         })
      }
        const response = await savedService.toggleSavedPost({
          postId: post._id,
        })
        if (response.status >= 400 || !response.data) {
          toast({
            title: "Failed to Save",
            description: response.message,
            variant: "destructive",
          })
        }
    }
    


    const getProfilesWhoLikePost = async (page) => {
        const limit = 20;
        const response = await likesService.getProfilesWhoLikePost({ postId:post._id, page, limit })
        // console.log(response)
        if (response.status < 400 && response.data) {
          setProfileResData(response.data)
          //console.log(response.data)
          if (page === 1) {
            setProfiles(response.data.docs)
          } else {
            setProfiles([...profiles, ...response.data.docs])
          }
        } else {
          toast({
            title: "Failed to get Profiles",
            description: response.message,
            variant: "destructive",
          })
        }
      }

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg px-2 py-3 sm:px-3 my-2 md:mr-2 lg:mx-2'>
            <div className='flex justify-start flex-nowrap'>
                <Link to={`/user/${post.author.username}`}>
                    <img src={post.author.avatar.replace("upload/", "upload/w_40/")} alt='avatar'
                        className='rounded-full w-10 h-10' />
                </Link>
                <p className='m-0 py-1 ml-2'>
                    <Link to={`/user/${post.author.username}`} className='text-[14px] leading-3 mt-1 font-semibold block'>
                        {post.author.fullName}
                    </Link>

                    <Link to={`/user/${post.author.username}`} className='text-[10px] text-gray-400'>
                        {post.author.followersCount} followers
                    </Link>
                </p>
                <button disabled={!user || user._id === post.author._id} onClick={toggleFollow}
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
            <div className=' ml-2 pt-1 pb-1'>
                <span className=' leading-3 text-[11px] text-gray-500 block'>
                    {new Date(post.createdAt).toDateString()}
                </span>
                <span className='font-semibold block leading-5 text-[14px] lg:text-[16px]'>
                    {title}
                    {
                      post.title && post.title.length > 100 && <span onClick={() => setIsTitleExpanded(!isTitleExpanded)} className='text-[12px] text-blue-600 underline cursor-pointer'>{isTitleExpanded ? '' : " ...Show more"}</span>
                    }
                </span>
            </div>
            <>
                {
                    (post.type === 'blog' || post.forkedFrom?.type === 'blog') &&
                    <Link to={`/post/${post._id}`} className='overflow-hidden pt-2 block'>
                      <div 
                      className='dark:bg-gray-900 bg-gray-100 p-2 rounded-md max-h-[500px] overflow-y-hidden'>
                        {parse(post.type !== "forked" ? post.content : post.forkedFrom.content)}
                      </div>
                    </Link>
                }

                {
                    (post.type === 'photo' || post.forkedFrom?.type === 'photo') &&
                    <Link to={`/post/${post._id}`} className='pt-2 block'>
                        <img src={post.type !== "forked" ? post.assetURL : post.forkedFrom.assetURL} alt="post photo" className='mx-auto' />
                    </Link>
                }

                {
                    (post.type === 'pdf' || post.forkedFrom?.type === 'pdf') &&
                    <Link to={`/post/${post._id}`} className='pt-2 block'>
                        <iframe src={post.type !== "forked" ? post.assetURL : post.forkedFrom.assetURL}
                            width="100%" height="600px" className='h-[500px] lg:h-[600px]'></iframe>
                        {/* <embed src={post.type !== "forked" ? post.assetURL : post.forkedFrom.assetURL} width="100%" height="600px" /> */}
                        {/* <img src={post.type !== "forked" ? post.assetURL : post.forkedFrom.assetURL} width="100%" height="600px"/></img> */}
                    </Link>
                }

                {
                    (post.type === 'video' || post.forkedFrom?.type === 'video') &&
                    <div className='pt-2 block' ref={ref}>
                        <video
                        src={post.type !== "forked" ? post.assetURL : post.forkedFrom.assetURL} 
                        controls 
                        className='mx-auto max-h-[500px] lg:max-h-[550px]'
                        ref={videoRef}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                }
            </>
            {
                post.forkedFrom && post.forkedFrom.visibility === 'public' && <div>
                    <div
                        className='flex justify-start flex-nowrap'>
                        <Link to={`/user/${post.forkedFrom.author.username}`}>
                            <img src={post.forkedFrom.author.avatar.replace("upload/", "upload/w_40/")} alt='avatar'
                                className='rounded-full w-10' />
                        </Link>
                        <p className='ml-2'>
                            <Link to={`/user/${post.forkedFrom.author.username}`} className='text-[14px] leading-3 mt-1 font-semibold block'>
                                {post.forkedFrom.author.fullName}
                            </Link>

                            <Link to={`/post/${post.forkedFrom._id}`} className='text-[10px] text-gray-400'>
                            {new Date(post.forkedFrom.createdAt).toDateString()}
                            </Link>
                        </p>

                    </div>
                    <Link to={`/post/${post.forkedFrom._id}`}
                        className='ml-2 pb-1 block font-semibold text-[14px] lg:text-[16px]'>
                        {post.forkedFrom.title}
                    </Link>
                </div>
            }
            <hr />
            

            <div className='flex-center mt-4'>
                <div className='flex flex-col mx-[2px] lg:mx-1'>
                  <button className='post-btn' onClick={toggleLike} >
                    {
                      !post.isLikedByMe ?
                        <>
                          <Star size={20} /> <span className='pl-1 text-[12px]'>Star</span>
                        </> : <> <img src="/star-svgrepo-com.svg" alt="star" className='w-5' /> <span className='pl-1 text-[12px]'>Star</span> </>
                    }
                  </button>

                  <Sheet>
                    <SheetTrigger asChild>
                      <button onClick={() => {
                        if (!profileResData) {
                          getProfilesWhoLikePost(1)
                        }
                      }}
                        className='text-[12px] text-gray-600 mt-1 dark:text-gray-400'>
                        {post.likesCount} Stars
                      </button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Liked By</SheetTitle>
                        <SheetDescription className="pb-3">
                          All the users who liked this post.
                        </SheetDescription>
                      </SheetHeader> <hr />
                      {
                        !profileResData ? skeletons.map((i) => {
                          return <div className="flex items-center space-x-4 my-3 sm:pl-8 md:pl-12 overflow-auto" key={i}>
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[150px] sm:w-[200px]" />
                              <Skeleton className="h-4 w-[100px] sm:w-[150px]" />
                            </div>
                          </div>
                        }) : <div className='pt-2'>
                          {
                            profiles.length > 0 ? profiles.map((profile) => {
                              return <ProfileCard profile={profile} key={profile._id} setProfiles={setProfiles} />
                            }) : <p className='text-center py-6'>
                              No one like this post!
                            </p>
                          }
                          {
                            profileResData.page < profileResData.totalPages &&
                            <Btn className="block mx-auto my-4"
                              onClick={() => {
                                getProfilesWhoLikePost(profileResData.page + 1)
                              }} >
                              See more
                            </Btn>
                          }
                        </div>
                      }

                      <SheetFooter>

                      </SheetFooter>
                    </SheetContent>
                  </Sheet>

                </div>

                <div className='flex flex-col mx-[2px] lg:mx-1'>
                  <button className='post-btn' onClick={() => navigate(`/post/${post._id}`)}>
                    <MessageSquareMore size={20} /> <span className='pl-1 text-[12px]'>Comment</span>
                  </button>
                  <button disabled className='text-[12px] text-gray-600 mt-1 dark:text-gray-400'>
                    {post.commentsCount} Comments
                  </button>
                </div>

                <SharePost post={post} />

                <div className='flex flex-col mx-[2px] lg:mx-1'>
                  <button className='post-btn' onClick={toggleSave} >
                    {!post.isSavedByMe ? <><Save size={20} /> <span className='pl-1 text-[12px]'>Save</span></> :
                      <>
                        <><Save size={20} color='green' /> <span className='pl-1 text-[12px]'>Saved</span></>
                      </>
                    }
                  </button>
                  <button disabled className='text-[12px] text-gray-600 mt-1 dark:text-gray-400'>
                    {post.savedCount} Saves
                  </button>
                </div>
              </div>


        </div>

    )
}
