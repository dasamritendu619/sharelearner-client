import React ,{useState,useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateHpmePosts } from '@/store/postSlice'
import { postService } from '@/apiServices/postServices'
import { useToast } from '@/components/ui/use-toast'
import PostCard from '@/components/post/PostCard'

export default function Home() {
    const user = useSelector(state => state.auth.user)
    const postsData = useSelector(state => state.post.homePosts)
    const dispatch = useDispatch()
    const {toast} = useToast()

    const getPosts = async (page) => {
      const limit = 20;
      const response = await postService.getAllPosts({page,limit,type:"all"})
      if (!response.data || response.status >=400) {
        toast({
          title: "Error",
          description:response.message,
          variant: "destructive",
        })
      } else{
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
            return <PostCard key={post._id} post={post} />
          })
        }
      </div>

      <div className='hidden md:block md:w-[40%] lg:w-[30%]'>
      gandu
      </div>
    </div>
  )
}
