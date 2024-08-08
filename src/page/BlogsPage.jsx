import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateBlogPosts } from '@/store/postSlice'
import { postService } from '@/apiServices/postServices'
import { useToast } from '@/components/ui/use-toast'
import PostCard from '@/components/post/PostCard'
import { followersService } from '@/apiServices/followersServices'
import { Skeleton } from '@/components/ui/skeleton'
import ProfileCard from '@/components/ProfileCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Button as Btn } from '@/components/ui/button'
import { BookOpen, Image, Video } from 'lucide-react'
import { setSuggestedUsers, reValidateByKey } from '@/store/authSlice'
import { Button } from '@/components/ui/moving-border'
import SightNav from '@/components/SightNav'


export default function BlogsPage() {
  const user = useSelector(state => state.auth.user)
  const postsData = useSelector(state => state.post.blogPosts)
  const dispatch = useDispatch()
  const { toast } = useToast()
  const ProfilesData = useSelector(state => state.auth.suggestedUsers)
  const [profileLoading, setProfileLoading] = useState(true)
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);

  const handleInView = (index) => {
    setCurrentVideoIndex(index);
  };

  const setProfiles = (profiles) => {
    dispatch(setSuggestedUsers({
      ...ProfilesData,
      docs: profiles,
    }))
  }

  const getSuggestedProfiles = async (page) => {
    if (!user) {
      return;
    }
    const limit = 20;
    const response = await followersService.getSuggestedUsers({
      page,
      limit
    })
    // console.log(response)
    if (response.status < 400 && response.data) {
      if (page === 1) {
        dispatch(setSuggestedUsers({
          docs: response.data.docs,
          page: response.data.page,
          nextPage: response.data.nextPage,
        }))
        setProfileLoading(false)
      } else {
        dispatch(setSuggestedUsers({
          docs: [...ProfilesData.docs, ...response.data.docs],
          page: response.data.page,
          nextPage: response.data.nextPage,
        }))
      }
    } else {
      toast({
        title: "Failed to get Profiles",
        description: response.message,
        variant: "destructive",
      })
    }
  }

  const getPosts = async (page) => {
    const limit = 15;
    const response = await postService.getAllPosts({ page, limit, type: "blog" })
    if (!response.data || response.status >= 400) {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      })
    } else {
      if (page === 1) {
        dispatch(updateBlogPosts({
          posts: response.data.docs,
          page: response.data.page,
          nextPage: response.data.nextPage,
        }))
      } else {
        dispatch(updateBlogPosts({
          posts: [...postsData.posts, ...response.data.docs],
          page: response.data.page,
          nextPage: response.data.nextPage,
        }))
      }
    }
  }

  const updatePosts = useCallback((post) => {
    const updatedPosts = postsData.posts.map(p => {
      if (p._id === post._id) {
        return post
      }
      return p
    })
    dispatch(updateBlogPosts({
      posts: updatedPosts,
      page: postsData.page,
      nextPage: postsData.nextPage,
    }))
  }, [postsData])

  useEffect(() => {
    if (postsData.posts.length === 0) {
      getPosts(1)
    }
  }, [])

  useEffect(() => {
    if (user) {
      if (ProfilesData.docs.length < 1) {
        getSuggestedProfiles(1)
      } else {
        setProfileLoading(false)
      }
    }
  }, [user])


  return (
    <div
      className='w-screen flex flex-nowrap justify-center fixed h-[calc(100vh-94px)] sm:h-[calc(100vh-58px)] top-[94px] left-0 sm:top-[56px] overflow-y-auto'>
      <div className='hidden lg:block lg:w-[30%] xl:w-[25%]'>
        <SightNav />
      </div>

      <div className='w-full md:w-[60%] lg:w-[40%] xl:w-[50%]'>
        {postsData.posts.length > 0 ? <InfiniteScroll
          scrollableTarget='scrollableDiv'
          dataLength={postsData.posts.length}
          next={() => getPosts(postsData.page + 1)}
          height={window.innerWidth >= 640 ? window.innerHeight - 58 : window.innerHeight - 94}
          hasMore={postsData.nextPage ? true : false}
          loader={
            <>
              {
                [1, 2, 3, 4, 5].map((i) => {
                  return <div key={i}><div className="flex items-center space-x-4 pl-4 my-3 overflow-auto" >
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px] sm:w-[200px]" />
                      <Skeleton className="h-4 w-[100px] sm:w-[150px]" />
                    </div>
                  </div>
                    <div>
                      <Skeleton className={'w-full h-96'} />
                    </div>
                    <div className='flex flex-nowrap justify-center mb-3'>
                      <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                      <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                      <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                      <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                    </div>
                  </div>
                })
              }
            </>
          }
          endMessage={
            <p className='w-full text-center font-semibold my-4'>No More Posts</p>
          }
        >
          {user && <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg px-2 py-3 sm:px-3 my-2 md:mr-2 lg:mx-2'>
            <div className='flex flex-nowrap justify-between'>
              <Link to={`/user/${user.username}`}>
                <img src={user.avatar.replace("upload/", "upload/w_40/")} alt='avatar'
                  className='rounded-full w-10 h-10' /></Link>
              <Link to={'/create-blog-post'}
                className='w-[calc(100%-80px)] sm:w-[calc(100%-40px)] text-start mx-2 sm:mr-0'>
                <Btn 
                className='h-10 px-3 py-1 rounded-full w-full bg-gray-200 hover:bg-gray-200 dark:bg-gray-700 text-start text-gray-500'>
                  Write a blog here...
                </Btn>
              </Link>
              <Link to={'/create-photo-post'}
                className='sm:hidden bg-gray-200 dark:bg-gray-700 p-2 rounded-full'>
                <Image size={24} />
              </Link>
            </div>
            <div className='hidden sm:block my-4 border-t dark:border-white'>

            </div>
            <div className='hidden sm:flex sm:flex-nowrap sm:justify-center'>
              <Link className='crpnavBtn' to={'/create-photo-post'} >
                <Image size={24} className='text-green-600 font-bold' /> <span className='pl-2 text-[14px]'>Photo</span>
              </Link>
              <Link className='crpnavBtn' to={'/create-video-post'}>
                <Video size={24} className='text-red-600 font-bold' /> <span className='pl-2 text-[14px]'>Video</span>
              </Link>
              <Link className='crpnavBtn' to={'/create-blog-post'}>
                <BookOpen size={24} className='text-blue-600 font-bold' /> <span className='pl-2 text-[14px]'>Article</span>
              </Link>
            </div>
          </div>}
          {
            postsData.posts.map((post,index) => {
              return <PostCard
                key={post._id}
                post={post}
                updatePosts={updatePosts}
                isInView={currentVideoIndex === index}
                onInView={() => handleInView(index)} />
            })
          }
        </InfiniteScroll> :
          <>
            {
              [1, 2, 3, 4, 5, 6].map((i) => {
                return <div key={i}><div className="flex items-center space-x-4 pl-4 my-3 overflow-auto">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px] sm:w-[200px]" />
                    <Skeleton className="h-4 w-[100px] sm:w-[150px]" />
                  </div>
                </div>
                  <div>
                    <Skeleton className={'w-full h-96'} />
                  </div>
                  <div className='flex flex-nowrap justify-center mb-3'>
                    <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                    <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                    <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                    <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                  </div>
                </div>
              })
            }
          </>
        }

      </div>

      <div className='hidden md:block md:w-[40%] lg:w-[30%] xl:w-[25%]  h-[calc(100vh-58px)]'>
        {user ? <>
          <h2
            className='text-center text-[20px] font-semibold py-4'
          >
            Suggested Profiles
          </h2>
          <hr />
          {
            profileLoading ? skeletons.map((i) => {
              return <div className="flex items-center space-x-4 pl-8 my-3 overflow-auto" key={i}>
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px] sm:w-[200px]" />
                  <Skeleton className="h-4 w-[100px] sm:w-[150px]" />
                </div>
              </div>
            }) : <div className='pt-2 px-4 lg:px-3 xl:px-6 '>
              {
                ProfilesData.docs.map((profile) => {
                  return <ProfileCard
                    profile={profile}
                    key={profile._id}
                    setProfiles={setProfiles}
                    profiles={ProfilesData.docs} />
                })
              }
              {
                ProfilesData.docs.length === 0 && <div className='text-center py-6'>
                  <p className='text-[14px] font-semibold'>No more suggestions</p>
                </div>
              }
              {
                ProfilesData.nextPage &&
                <Btn className="block mx-auto my-4"
                  onClick={() => {
                    getSuggestedProfiles(ProfilesData.page + 1)
                  }} >
                  See more
                </Btn>
              }

            </div>
          }
        </> : <div className='text-center px-4 pt-2 pb-8'>
          <div className='flex-center mt-6 lg:mt-10 mb-2'>
            <Link to={"/signup"}>
              <Button
                borderRadius="1.75rem"
                className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800"
              >
                Join Us Now
              </Button>
            </Link>
          </div>
          Please login to like, comment, share and save posts.
        </div>}
      </div>

    </div>
  )
}

