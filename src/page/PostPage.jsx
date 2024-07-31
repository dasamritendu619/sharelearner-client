import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { postService } from '@/apiServices/postServices'
import parse from 'html-react-parser'
import { Copy, MessageSquareMore, Save, Share, Share2, Star, UserRoundPlus, UserRoundX } from 'lucide-react'
import { likesService } from '@/apiServices/likesServices'
import { followersService } from '@/apiServices/followersServices'
import { savedService } from '@/apiServices/savedServices'
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
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { viewPost, updateViewedPost } from '@/store/postSlice'

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const viewedPosts = useSelector((state) => state.post.viewedPosts);

  const isPostViewed = ()=>{
    for (let i = 0; i < viewedPosts.length; i++) {
      if (viewedPosts[i]._id === postId) {
        return viewedPosts[i];
      }
    }
    return false;
  }

  const toggleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(updateViewedPost({ ...post, isLikedByMe: !post.isLikedByMe, likesCount: post.isLikedByMe ? post.likesCount - 1 : post.likesCount + 1 }));
    setPost({ ...post, isLikedByMe: !post.isLikedByMe, likesCount: post.isLikedByMe ? post.likesCount - 1 : post.likesCount + 1 });
    await likesService.toggleLikePost({ postId });
  }

  const toggleFollow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(updateViewedPost({ ...post, author: { ...post.author, isFollowedByMe: !post.author.isFollowedByMe } }));
    setPost({ ...post, author: { ...post.author, isFollowedByMe: !post.author.isFollowedByMe } });
    await followersService.toggleFollowUser({ profileId: post.author._id });
  }

  const toggleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(updateViewedPost({ ...post, isSavedByMe: !post.isSavedByMe, savedCount: post.isSavedByMe ? post.savedCount - 1 : post.savedCount + 1 }));
    setPost({ ...post, isSavedByMe: !post.isSavedByMe, savedCount: post.isSavedByMe ? post.savedCount - 1 : post.savedCount + 1 });
    await savedService.toggleSavedPost({ postId });
  }

  useEffect(() => {
    if (!postId) navigate('/');
    const viewedPost = isPostViewed();
    if (viewedPost) {
      setPost(viewedPost);
    } else {
      postService.getPost({ postId }).then((res) => {
        if (res.data && res.status < 400) {
          setPost(res.data);
          dispatch(viewPost(res.data));
          console.log(res.data)
        } else {
          navigate('/');
        }
      });
    }
  }, [postId]);

  return (
    <>
      {
        post ?
          <div className='w-screen h-screen overflow-auto md:flex md:flex-nowrap md:justify-center fixed top-0 left-0'>
            <div className='w-full md:w-[65%] md:pr-4'>
              <div>

                <div>
                  <div className='flex justify-start border-gray-600 mt-2 flex-nowrap px-3 pt-2 border border-b-0 mx-4'>
                    <Link to={`/user/${post.author.username}`}>
                      <img src={post.author.avatar.replace("upload/", "upload/w_70/")} alt='avatar'
                        className='rounded-full w-10 md:w-14' />
                    </Link>
                    <p className='ml-2'>
                      <Link to={`/user/${post.author.username}`} className='text-[16px] leading-3 mt-1 font-semibold block'>
                        {post.author.fullName}
                      </Link>

                      <Link to={`/user/${post.author.username}`} className='text-[12px] text-gray-400'>
                        @{post.author.username}
                      </Link>
                    </p>
                    <button onClick={toggleFollow}
                      className={`flex-center ml-3 px-3 h-8 rounded-full leading-3 ${!post.author.isFollowedByMe && "bg-green-500"}`}>
                      {
                        !post.author.isFollowedByMe ? <>
                          <UserRoundPlus size={18} /> <span className='pl-1 text-[12px]'>Follow</span>
                        </> : <>
                          <UserRoundX size={18} /> <span className='pl-1 text-[12px]'>Unfollow</span>
                        </>
                      }
                    </button>
                  </div>
                  <div className='border border-gray-600 border-y-0 px-4 mx-4 pt-3 pb-1'>
                    <p className=' leading-3 text-[11px] text-gray-500'>
                      {new Date(post.createdAt).toDateString()}
                    </p>
                    <p className='font-semibold leading-5 text-[14px] md:text-[16px]'>
                      {post.title}
                    </p>
                  </div>
                  {
                    post.type === 'blog' &&
                    <div className='px-2 sm:px-3 md:px-4 py-2'>
                      {parse(post.content)}
                    </div>
                  }

                  {
                    post.type === 'photo' &&
                    <div className='px-2 sm:px-3 md:px-4 py-2'>
                      <img src={post.assetURL} alt="post photo" className='mx-auto' />
                    </div>
                  }

                  {
                    post.type === 'pdf' &&
                    <div className='px-2 sm:px-3 md:px-4 py-2'>
                      <iframe src={post.assetURL} width="100%" height="600px"></iframe>
                    </div>
                  }

                  {
                    post.type === 'video' &&
                    <div className='px-2 sm:px-3 md:px-4 py-2'>
                      <video src={post.assetURL} controls className='mx-auto' ></video>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className='w-full md:w-[35%]'>
              <div className='flex-center mt-4 md:mt-8'>
                <div className='flex flex-col mx-[2px] lg:mx-1'>
                  <button className='post-btn' onClick={toggleLike}>
                    {
                      !post.isLikedByMe ?
                        <>
                          <Star size={20} /> <span className='pl-1 text-[12px]'>Star</span>
                        </> : <> <img src="/star-svgrepo-com.svg" alt="star" className='w-5' /> <span className='pl-1 text-[12px]'>Star</span> </>
                    }
                  </button>
                  <button className='text-[12px] text-gray-600 mt-1 dark:text-gray-400'>
                    {post.likesCount} Stars
                  </button>
                </div>

                <div className='flex flex-col mx-[2px] lg:mx-1'>
                  <button className='post-btn'>
                    <MessageSquareMore size={20} /> <span className='pl-1 text-[12px]'>Comment</span>
                  </button>
                  <button className='text-[12px] text-gray-600 mt-1 dark:text-gray-400'>
                    {post.commentsCount} Comments
                  </button>
                </div>

                <div className='flex flex-col mx-[2px] lg:mx-1'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className='post-btn'>
                        <Share2 size={20} /> <span className='pl-1 text-[12px]'>Share</span>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Share {post.author.fullName}'s Post</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className='flex flex-nowrap justify-center'>
                          <Input type="text" value={window.location.href} readOnly className="border-r-0" />
                          <button className=" border border-l-0 rounded-md pr-2"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast({
                              title: "Link Copied to Clipboard!",
                              className: "bg-green-500",
                            });
                          }}
                          >
                          <Copy size={20} />
                          </button>
                          </div>
                          <Link to={`/fork-post/${post._id}`}
                          className='flex-center my-5 text-[18px] text-blue-500'
                          >
                          <Share size={20} /> <span className='pl-1 text-[12px]'>Share on your feed</span>
                          </Link>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <button className='text-[12px] text-gray-600 mt-1 dark:text-gray-400'>
                    {post.sharesCount} Shares
                  </button>
                </div>

                <div className='flex flex-col mx-[2px] lg:mx-1'>
                  <button className='post-btn' onClick={toggleSave}>
                    {!post.isSavedByMe ? <><Save size={20} /> <span className='pl-1 text-[12px]'>Save</span></> :
                      <>
                        <><Save size={20} color='green' /> <span className='pl-1 text-[12px]'>Saved</span></>
                      </>
                    }
                  </button>
                  <button className='text-[12px] text-gray-600 mt-1 dark:text-gray-400'>
                    {post.savedCount} Saves
                  </button>
                </div>
              </div>
            </div>
          </div> :
          <div className='w-screen h-screen grid place-content-center'>
            <div className="loader3"></div>
          </div>
      }
    </>
  )
}
