import React from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect,useState } from 'react'
import { postService } from '@/apiServices/postServices'
import parse from 'html-react-parser'

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) =>state.auth.user);

  useEffect(() => {
    if(!postId) navigate('/');
    postService.getPost({postId}).then((res) => {
      if (res.data && res.status <400) {
        setPost(res.data);
        console.log(res.data)
      } else {
        navigate('/');
      }
    })
  }, [postId]);

  return (
    <>
        {
          post ? 
          <div className='w-screen h-screen md:flex md:flex-nowrap md:justify-center'>
              <div className='w-full md:w-[65%]'>
                  {post.type === "blog" && <div>
                    {parse(post.content)}
                    </div>}
              </div>
              <div className='w-full md:w-[35%]'>

              </div>
          </div> : 
          <div className='w-screen h-screen grid place-content-center'>
            <div className="loader3"></div>
          </div>
        }
    </>
  )
}
