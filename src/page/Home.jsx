import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateHpmePosts } from '@/store/postSlice'
import { postService } from '@/apiServices/postServices'
import { useToast } from '@/components/ui/use-toast'
import PostCard from '@/components/post/PostCard'
import { followersService } from '@/apiServices/followersServices'
import { Skeleton } from '@/components/ui/skeleton'
import ProfileCard from '@/components/ProfileCard'
import { Button } from '@/components/ui/moving-border'


export default function Home() {
  const user = useSelector(state => state.auth.user)
  const postsData = useSelector(state => state.post.homePosts)
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [profiles, setProfiles] = useState([])
  const [profileResData, setProfileResData] = useState(null)
  const skeletons = [1, 2, 3, 4, 5]

  const getMyFollowings = async (page) => {
    if (!user) {
      return;
    }

    const limit = 20;
    const response = await followersService.getAllFollowings({
      username: user.username,
      page,
      limit
    })
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

  const getPosts = async (page) => {
    const limit = 15;
    const response = await postService.getAllPosts({ page, limit, type: "all" })
    if (!response.data || response.status >= 400) {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      })
    } else {
      if (page === 1) {
        dispatch(updateHpmePosts({
          posts: response.data.docs,
          page: response.data.page,
          nextPage: response.data.nextPage,
        }))
      } else {
        dispatch(updateHpmePosts({
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
    dispatch(updateHpmePosts({
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


  return (
    <div
      className='w-screen flex flex-nowrap justify-center fixed h-[calc(100vh-94px)] sm:h-[calc(100vh-58px)] top-[94px] left-0 sm:top-[56px] overflow-y-auto'>
      <div className='hidden lg:block lg:w-[25%]'>
        <nav>
          laura
        </nav>
      </div>

      <div className='w-full md:w-[60%] lg:w-[45%]'>
        {
          postsData.posts.map(post => {
            return <PostCard key={post._id} post={post} updatePosts={updatePosts} />
          })
        }
      </div>

      <div className='hidden md:block md:w-[40%] lg:w-[30%]'>
        {user ? <>
        {
          !profileResData ? skeletons.map((i) => {
            return <div className="flex items-center space-x-4 pl-4 my-3 overflow-auto" key={i}>
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
                  getMyFollowings(profileResData.page + 1)
                }} >
                See more
              </Btn>
            }
            
          </div>
        }
        </> : <div className='text-center py-6'>
              <Button className='block mx-auto'>
                <Link to='/login'>Login</Link>
              </Button>
          </div>}
      </div>
    </div>
  )
}
