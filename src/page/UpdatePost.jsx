import React,{useEffect, useState} from 'react'
import BlogPostForm from '@/components/post/BlogPostForm'
import AssetPostForm from '@/components/post/AssetPostForm'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { postService } from '@/apiServices/postServices'

export default function UpdatePost() {
    const { postId } = useParams();
    const { toast } = useToast()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)

    useEffect(() => {
        const getPostDetails = async () => {
            const response = await postService.getPostDetailsForUpdate({postId})
            if (!response.data || response.status >= 400) {
                toast({
                    variant: "destructive",
                    title: "Error in fetching post details!",
                    description: response.message || "Something went wrong!",
                  }) 
                navigate(-1)
            } else {
                setPost(response.data)
            }
        }
        getPostDetails()
    }, [])

  return (
    <>
    {
        post ? <div>
            {
                post.type === 'blog' ? <BlogPostForm data={post}/> : <AssetPostForm data={post} type={post.type}/>
            }
        </div> : 
        <div 
        className='w-screen h-screen fixed top-0 left-0 grid place-content-center bg-blue-100 dark:bg-gray-950'>
        <div className="loader2"></div>
        </div>
    }
    </>
  )
}
