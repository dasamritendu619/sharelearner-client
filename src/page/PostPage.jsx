import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import { postService } from '@/apiServices/postServices'
import parse from 'html-react-parser'
import { ChevronDown, MessageCircle, MessageSquareMore, Save, Star, UserRoundPlus, House, EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
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
import { commentService } from '@/apiServices/commentServices'
import ProfileCard from '@/components/ProfileCard'
import ProfileBtn from '@/components/auth/ProfileBtn'
import { ModeToggle } from '@/components/mode-toggle'
import { deleteAPost } from '@/store/postSlice'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const viewedPosts = useSelector((state) => state.post.viewedPosts);
  const textAreaRef = useRef(null);
  const [commentInputVal, setCommentInputVal] = useState('');
  const [comments, setComments] = useState([])
  const [commentResData, setCommentResData] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [profileResData, setProfileResData] = useState(null)
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [page, setPage] = useState(1)
  const deleteButtonRef = useRef(null)

  const isPostViewed = () => {
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

  const addComment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!commentInputVal.trim()) return;
    const responce = await commentService.createComment({ postId, content: commentInputVal.trim() })
    if (responce.status < 400 && responce.data) {
      // console.log(responce.data)
      const newComment = {
        ...responce.data,
        commentedBy: {
          _id: user._id,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar
        },
        totalReplies: 0,
        totalLikes: 0,
        isLikedByMe: false
      }
      setComments([newComment, ...comments])
      setPost({ ...post, commentsCount: post.commentsCount + 1 })
      setCommentInputVal('')
    } else {
      toast({
        title: "Failed to add comment",
        description: responce.message,
        variant: "destructive",
      });
    }
  }

  const deletePost = async ()=>{
     const responce = await postService.deletePost({postId})
     if (responce.status < 400 && responce.data) {
      dispatch(deleteAPost(postId))
      navigate('/');
    } else {
      toast({
        title: "Failed to delete post",
        description: responce.message,
        variant: "destructive",
      });
    }
  }

  const updateTotalCommentSCount = (number) => {
    setPost({ ...post, commentsCount: post.commentsCount + number })
    dispatch(updateViewedPost({ ...post, commentsCount: post.commentsCount + number }))
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
          //console.log(res.data)
        } else {
          navigate('/');
        }
      });
    }
  }, [postId]);


  const resizeTextArea = () => {
    if (textAreaRef.current === null) return;
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };

  const getProfilesWhoLikePost = async (page) => {
    const limit = 20;
    const response = await likesService.getProfilesWhoLikePost({ postId, page, limit })
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

  useEffect(resizeTextArea, [commentInputVal]);

  const getComments = async (page) => {
    const limit = 20;
    const response = await commentService.getallComments({ postId, page, limit })
    // console.log(response)
    if (response.status < 400 && response.data) {
      setCommentResData(response.data)
      if (page === 1) {
        setComments(response.data.docs)
      } else {
        setComments([...comments, ...response.data.docs])
      }
      setPage(page)
    } else {
      toast({
        title: "Failed to get comments",
        description: response.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (user) {
      getComments(1)
    }
  }, [postId])

  return (
    <>
      {
        post ?
          <div className='w-screen h-screen bg-blue-100 dark:bg-gray-950 overflow-auto lg:flex lg:flex-nowrap lg:justify-center fixed top-0 left-0'>
            <div className='w-full lg:w-[65%] lg:pr-4'>
              <div>

                <div>
                  <div className='flex justify-start border-gray-600 mt-2 flex-nowrap px-3 pt-2 border border-b-0 mx-4'>
                    <Link to={`/user/${post.author.username}`}>
                      <img src={post.author.avatar.replace("upload/", "upload/w_70/")} alt='avatar'
                        className='rounded-full w-10 lg:w-14' />
                    </Link>
                    <p className='ml-2'>
                      <Link to={`/user/${post.author.username}`} className='text-[16px] leading-3 mt-1 font-semibold block'>
                        {post.author.fullName}
                      </Link>

                      <Link to={`/user/${post.author.username}`} className='text-[12px] text-gray-400'>
                        @{post.author.username}
                      </Link>
                    </p>
                    <button onClick={toggleFollow} disabled={!user || user._id === post.author._id}
                      className={`flex-center ml-3 px-3 h-8 rounded-full leading-3 ${!post.author.isFollowedByMe ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"}`}>
                      {
                        !post.author.isFollowedByMe ? <>
                          <UserRoundPlus size={18} /> <span className='pl-1 text-[12px]'>Follow</span>
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
                    <div className='flex flex-nowrap justify-between'>
                      <span className='font-semibold leading-5 text-[14px] w-[calc(100%-20px)] lg:text-[16px] block'>{post.title}</span>
                      {user && post.author._id === user._id && <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button><EllipsisVertical size={18} /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className=" cursor-pointer" onClick={() => navigate(`/update-post/${post._id}`)} title='Edit Reply'>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Edit Post</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className=" cursor-pointer" onClick={()=>deleteButtonRef.current.click()}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete Post</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>}
                    </div>
                  </div>
                  {
                    (post.type === 'blog' || post.forkedFrom[0]?.type === 'blog') &&
                    <div className='px-2 sm:px-3 lg:px-4 py-2'>
                      {parse(post.type !== "forked" ? post.content : post.forkedFrom[0].content)}
                    </div>
                  }

                  {
                    (post.type === 'photo' || post.forkedFrom[0]?.type === 'photo') &&
                    <div className='px-2 sm:px-3 lg:px-4 py-2'>
                      <img src={post.type !== "forked" ? post.assetURL : post.forkedFrom[0].assetURL} alt="post photo" className='mx-auto viewing-asset' />
                    </div>
                  }

                  {
                    (post.type === 'pdf' || post.forkedFrom[0]?.type === 'pdf') &&
                    <div className='px-2 sm:px-3 lg:px-4 py-2'>
                      <iframe src={post.type !== "forked" ? post.assetURL : post.forkedFrom[0].assetURL} width="100%" height="600px"></iframe>
                    </div>
                  }

                  {
                    (post.type === 'video' || post.forkedFrom[0]?.type === 'video') &&
                    <div className='px-2 sm:px-3 lg:px-4 py-2'>
                      <video src={post.type !== "forked" ? post.assetURL : post.forkedFrom[0].assetURL} controls className='mx-auto viewing-asset' ></video>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className='w-full lg:w-[35%]'>
              <div className='hidden lg:flex lg:flex-nowrap lg:justify-end'>
                <Btn onClick={() => navigate('/login')}
                  variant="outline" size="icon" className='my-2 mx-[3px] rounded-full bg-white dark:bg-gray-700 font-bold'>
                  <House size={20} />
                </Btn>
                <Btn onClick={() => {
                  if (user) {
                    navigate('/chat')
                  } else {
                    navigate('/login')
                  }
                }}
                  variant="outline" size="icon" className='my-2 mx-[3px] rounded-full bg-white dark:bg-gray-700 font-bold'>
                  <MessageCircle size={20} />
                </Btn>
                <ModeToggle />
                {user ? <ProfileBtn /> :
                  <Btn onClick={() => navigate('/login')}
                    variant="outline" size="icon"
                    className='my-2 ml-[3px] mr-2 xl:mr-12 rounded-full w-20 bg-white dark:bg-gray-700 font-bold'>
                    Login
                  </Btn>}
              </div>


              {post.forkedFrom[0] && post.forkedFrom[0].visibility==='public' && <div>
              <div 
                className='flex justify-start border-gray-600 lg:mt-2 flex-nowrap px-3 pt-2 border border-y-0 lg:border-t lg:border-b-0 mx-4'>
                    <Link to={`/user/${post.forkedFrom[0].author.username}`}>
                        <img src={post.forkedFrom[0].author.avatar.replace("upload/", "upload/w_40/")} alt='avatar'
                            className='rounded-full w-10' />
                    </Link>
                    <p className='ml-2'>
                        <Link to={`/user/${post.forkedFrom[0].author.username}`} className='text-[14px] leading-3 mt-1 font-semibold block'>
                            {post.forkedFrom[0].author.fullName}
                        </Link>

                        <Link to={`/user/${post.forkedFrom[0].author.username}`} className='text-[10px] text-gray-400'>
                            @{post.forkedFrom[0].author.username}
                        </Link>
                    </p>
                    
                </div>
                <Link to={`/post/${post.forkedFrom[0]._id}`} 
                className='border border-gray-600 border-t-0 lg:border-y-0 px-4 mx-4 pt-3 pb-1 block'>
                    <p className=' leading-3 text-[11px] text-gray-500'>
                        {new Date(post.forkedFrom[0].createdAt).toDateString()}
                    </p>
                    <p className='font-semibold leading-5 text-[14px] lg:text-[16px]'>
                        {post.forkedFrom[0].title}
                    </p>
                </Link>
              </div>}



              <div className='flex-center mt-4'>
                <div className='flex flex-col mx-[2px] lg:mx-1'>
                  <button className='post-btn' onClick={toggleLike}>
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
                  <button className='post-btn' onClick={() => textAreaRef.current?.focus()}>
                    <MessageSquareMore size={20} /> <span className='pl-1 text-[12px]'>Comment</span>
                  </button>
                  <button disabled className='text-[12px] text-gray-600 mt-1 dark:text-gray-400'>
                    {post.commentsCount} Comments
                  </button>
                </div>

                <SharePost post={post} />

                <div className='flex flex-col mx-[2px] lg:mx-1'>
                  <button className='post-btn' onClick={toggleSave}>
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

              {
                user ?
                  <div className='px-2 xl:px-0 border-t mt-4 pb-8'>
                    <h2 className=' text-[16px] font-semibold flex flex-nowrap my-2 ml-2 sm:ml-8 md:ml-12'>
                      <span>Comments</span> <ChevronDown className='mt-1 ml-1' />
                    </h2>

                    {/* Comment Section */}

                    <div className=' sm:px-8 md:px-12'>
                      <div className='w-full flex flex-nowrap justify-start'>
                        <img src={user.avatar.replace("upload/", "upload/ar_1.0,g_face,c_fill,w_40/")} alt="avatar" className='w-10 h-10 rounded-full' />
                        <div className='flex flex-col w-[90%] ml-2'>

                          <textarea
                            ref={textAreaRef}
                            value={commentInputVal}
                            onChange={(e) => setCommentInputVal(e.target.value)}
                            placeholder='Add a comment...'
                            className='text-[12px] border-b-[1px] border-b-gray-400 outline-none mb-1 overflow-y-hidden resize-none bg-transparent'
                            cols="30" rows="2"></textarea>

                          <div className='flex flex-nowrap justify-end'>
                            <button disabled={!commentInputVal.trim()} onClick={addComment}
                              className={`${!commentInputVal.trim() ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-500"} text-white px-2 py-1 rounded-full text-[11px]`}
                            >Comment</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {
                      !commentResData ? skeletons.map((i) => {
                        return <div className="flex items-center space-x-4 my-3 sm:pl-8 md:pl-12" key={i}>
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px] sm:w-[450px] lg:w-[200px] xl:w-[250px]" />
                            <Skeleton className="h-4 w-[200px] sm:w-[400px] lg:w-[150px] xl:w-[200px]" />
                          </div>
                        </div>
                      }) : <div className=' md:px-6'>
                        {
                          comments.map((comment, index) => {
                            return <CommentCard
                              key={comment._id}
                              comment={comment}
                              postId={postId}
                              setComments={setComments}
                              index={index}
                              updateTotalCommentSCount={updateTotalCommentSCount} />
                          })
                        }

                        {
                          commentResData.page < commentResData.totalPages && <div className='flex-center my-5'>
                            <Btn onClick={() => getComments(page + 1)}>Load more comments</Btn>
                          </div>
                        }

                      </div>
                    }

                  </div> : <div className='text-center px-4 pt-2 pb-8'>
                    <div className='flex-center mt-6 lg:mt-10 mb-2'>
                      <Button>
                        <Link to="/login" className=''>
                          Login now
                        </Link>
                      </Button>
                    </div>
                    Please login to like, comment, share and save posts.
                  </div>
              }
            </div>
          </div> :
          <div className='w-screen h-screen fixed top-0 left-0 bg-blue-100 dark:bg-gray-950 grid place-content-center'>
            <div className="loader3"></div>
          </div>
      }
          <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className='hidden' ref={deleteButtonRef}>Show Dialog</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete post
             and remove your post data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deletePost} className='bg-red-600 hover:bg-red-500 text-white'>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
