import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import React from 'react'
import { useSelector } from 'react-redux'
import { Link,useNavigate } from 'react-router-dom'
import { Label } from "../ui/label"
import { useState } from 'react'
import { Input } from "../ui/input"
import { useForm } from "react-hook-form"
import RTE from "./RTE"
import { Button } from "../ui/button"
import { postService } from "@/apiServices/postServices"
import { useToast } from "../ui/use-toast"
import { Progress } from "../ui/progress"

export default function BlogPostForm({data}) {
    const user = useSelector(state => state.auth.user)
    const [value, setValue] = useState('public')
    const { register, handleSubmit, control } = useForm()
    const {toast} = useToast()
    const navigate = useNavigate()
    const [uploadPercentage, setUploadPercentage] = useState(0)

    const onSubmit = async (postData) => {
        if (!value || !postData.title || !postData.content) {
            toast({
                variant: "destructive",
                title: "All fields are required!",
                description: "Please fill all the fields to create a post.",
              })
        }
        setUploadPercentage(55)
        let response;
        if (data) {
          response = await postService.updatePost({
            newTitle: postData.title.trim(),
            newContent: postData.content,
            newVisibility: value,
            postId: data._id,
          })
        } else {
          response = await postService.createPost({
            title: postData.title.trim(),
            content: postData.content,
            type: 'blog',
            visibility: value,
        })
        }
        if (!response.data || response.status >= 400) {
            toast({
                variant: "destructive",
                title: "Error in creating post!",
                description: response.message || "Something went wrong!",
              }) 
        } else {
            toast({
                variant: "success",
                className: "bg-green-500",
                title: "Post created successfully!",
                description: "Your post has been created successfully.",
            })
            setUploadPercentage(100)
            navigate(`/post/${response.data._id}`)
        }
    }

  return (
    <div>
      <h1 className='text-2xl font-semibold md:text-4xl my-5 w-full text-center'>
        {data? "Update your blog":"Create your new blog"}
      </h1>
      <div className='flex flex-wrap md:flex-nowrap'>
        <div className='md:w-[50%] w-full flex justify-center mt-4 flex-nowrap'>
            <Link to={`/user/${user.username}`}>
            <img src={user.avatar.replace("upload/","upload/w_70/")} alt='avatar'
            className='rounded-full w-14 ' />
            </Link>
            <p className='ml-4'>
                <Link to={`/user/${user.username}`} className='text-lg font-semibold block'>
                {user.fullName}
                </Link>
                
                <Link to={`/user/${user.username}`} className='text-sm text-gray-400'>
                {user.username}
                </Link>
            </p>
        </div>
        <div className='md:w-[50%] w-full mt-8'>
            <div className="mx-auto w-[90%] sm:w-[70%] md:[w-60%]">
            <Select value={data? data.visibility : value}
                   required onValueChange={(value) => setValue(value)}
                   id="gender"
                  >
                    <SelectTrigger className="w-full"   >
                      <SelectValue placeholder="Choose who can view your post" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup >
                        <SelectLabel>Visibility</SelectLabel>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="friends">My friends</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
            </div>
        </div>
      </div>
    <form onSubmit={handleSubmit(onSubmit)}  >
      <div className="w-[90%] mx-auto mt-8 md:mt-10 sm:w-[70%]">
        <Label htmlFor="title" className='text-lg my-2 text-center block'>Your Blog Title :</Label>
        <Input type="text" id='title' name='title' required
        defaultValue={data? data.title : ''}
        {...register("title", { required: true })} placeholder='Enter your blog title here.' 
         />
      </div>
      <div className=" w-full mb-6">
        <Label htmlFor="content" className='text-lg mt-8 mb-4 text-center block'>Your Blog Content :</Label>
        <RTE control={control} defaultValue={data? data.content : ''} name="content" />
      </div>
      <Button type="submit" 
      className='w-[90%] block mx-auto mt-8 mb-16 md:mt-10 sm:w-[70%] bg-blue-500 hover:bg-blue-600 text-white font-semibold'>
        {data? "Update Post":"Create Post"}
        </Button>
      </form>

      {uploadPercentage > 0 && 
      <div className='w-screen h-screen bg-opacity-60 dark:bg-opacity-80 bg-black fixed top-0 left-0 grid place-content-center'>
        <div>
          <p className='text-center text-white'>
            {uploadPercentage} %
          </p>
        <Progress value={uploadPercentage} className="w-[90vw] sm:w-72 lg:w-96" />
        <p className='text-center mt-3 text-white'>
          Uploading...
        </p>
        </div>
        </div>}
    </div>
  )
}
