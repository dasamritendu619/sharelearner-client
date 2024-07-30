import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { postService } from '@/apiServices/postServices'
import parse from 'html-react-parser'

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!postId) navigate('/');
    postService.getPost({ postId }).then((res) => {
      if (res.data && res.status < 400) {
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
                    </div>
                    <div className='border border-gray-600 border-y-0 px-4 mx-4 pt-3 pb-1'>
                    <p className=' leading-3 text-[11px] text-gray-400'>
                      {new Date(post.createdAt).toDateString()}
                    </p>
                    <p className='font-semibold leading-5 text-gray-200 text-[14px] md:text-[16px]'>
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

            </div>
          </div> :
          <div className='w-screen h-screen grid place-content-center'>
            <div className="loader3"></div>
          </div>
      }
    </>
  )
}
