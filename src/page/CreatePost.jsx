import AssetPostForm from '@/components/post/AssetPostForm'
import BlogPostForm from '@/components/post/BlogPostForm'
import React from 'react'

export default function CreatePost({type}) {
  return (
    <div className='w-screen h-auto bg-blue-100 dark:bg-gray-950'>
      {
        type === 'blog' ? <BlogPostForm /> :
        <AssetPostForm type={type} />
      }
    </div>
  )
}
