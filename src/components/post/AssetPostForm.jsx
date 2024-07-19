import React, { useState, useRef } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../ui/use-toast'
import { useSelector } from 'react-redux'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { postService } from '@/apiServices/postServices'
import { Progress } from "@/components/ui/progress"

export default function AssetPostForm({ data, type }) {
  const user = useSelector(state => state.auth.user)
  const [value, setValue] = useState('public')
  const inputRef = useRef(null)
  const { toast } = useToast()
  const navigate = useNavigate()
  const [fileUrl, setFileUrl] = useState(data ? data.assetURL : '');
  const [file, setFile] = useState(null)
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const titleRef = useRef(null)

  const updateProgress = (p) => {
    setUploadPercentage(p)
  }

  const handleSubmit = async () => {
    // console.log(titleRef.current.value)
    // console.log(value)
    console.log(file)
    if(!file){
      return toast({
        variant: "destructive",
        title: "File is required!",
        description: "Please upload a file to create a post.",
      }) 
    }
    setUploadPercentage(1)
    const response = await postService.createPost({
      title: titleRef.current.value,
      visibility: value,
      asset: file,
      type: type,
      updateProgress:updateProgress
    })
    if (!response.data || response.status >= 400) {
      return toast({
        variant: "destructive",
        title: "Failed to create post!",
        description: response.message || "Something went wrong!",
        duration: 5000,
      })
    } else {
      toast({
        variant: "success",
        className:"bg-green-500",
        title: "Post created successfully!",
        description: "Your post has been created successfully.",
      })
      navigate(`/post/${response.data._id}`)
    }

  }


  return (
    <div className='w-screen h-auto bg-blue-100 dark:bg-gray-950 text-black dark:text-white'>
      <h1 className='text-center font-semibold text-xl my-5'>
        Create Your New Post
      </h1>
      <div className='flex flex-wrap md:flex-nowrap'>
        <div className='md:w-[50%] w-full flex justify-center mt-4 flex-nowrap'>
          <Link to={`/user/${user.username}`}>
            <img src={user.avatar.replace("upload/", "upload/w_70/")} alt='avatar'
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
            <Button className="block mx-auto bg-green-500 hover:bg-green-600"
            onClick={handleSubmit}
            >
              {data ? "Update Post" : "Create Post"}
            </Button>
        </div>
      </div>

      <div className="w-[90%] mx-auto mt-8 md:mt-10 sm:w-[70%]">
        <Label htmlFor="visivality" className='font-[15px] my-2 text-center block'>Post Visiblility :</Label>
        <Select value={data ? data.visibility : value}
          required onValueChange={(value) => setValue(value)}
          id="visivality" name="visivality"
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

      <div className="w-[90%] mx-auto mt-8 md:mt-10 sm:w-[70%]">
        <Label htmlFor="title" className='font-[15px] my-2 text-center block'>Your Post Title :</Label>
        <Input type="text" id='title' name='title' required
          defaultValue={data ? data.title : ''}
          placeholder="Enter your post title here."
          className="mb-6"
          ref={titleRef} 
        />
      </div>
      <div>
        {type === "photo" && fileUrl && <img src={fileUrl} alt="file"
          className='h-auto px-4 sm:px-0 sm:h-[55vh] block mx-auto mb-6' />}
        {type === "video" && fileUrl && <video src={fileUrl} controls
          className='h-auto px-4 sm:px-0 sm:h-[55vh] block mx-auto mb-6' />}
        {type === "pdf" && fileUrl &&  <iframe src={fileUrl} title="pdf" 
          className=' h-[500px] w-[96%] md:w-[90%] block mx-auto mb-6' />}
      </div>
      <input type="file" name="file" id="file" accept={
        type === "photo" ? "image/*" :
          type === "video" ? "video/*" :
            type === "pdf" ? "application/pdf" :
              ""}
        ref={inputRef}
        className='hidden'
        onChange={(e) => {
          setFileUrl(URL.createObjectURL(e.target.files[0]))
          setFile(e.target.files[0])
          }} />

      {!data?.assetURL && <Button onClick={() => inputRef.current.click()}
        className=' w-40 block mx-auto mb-10'>
        {fileUrl ? "Change" : "Upload"} {type}
      </Button>}
      {uploadPercentage > 0 && 
      <div className='w-screen h-screen bg-opacity-60 dark:bg-opacity-80 bg-black fixed top-0 left-0 grid place-content-center'>
        <div>
          <p className='text-center text-white'>
            {uploadPercentage !==100 ? uploadPercentage : 98} %
          </p>
        <Progress value={uploadPercentage !==100 ? uploadPercentage : 98} className="w-[90vw] sm:w-72 lg:w-96" />
        <p className='text-center mt-3 text-white'>
          Uploading...
        </p>
        </div>
        </div>}
    </div>
  )
}
