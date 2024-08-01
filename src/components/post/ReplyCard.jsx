import React, { useState, memo, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { likesService } from '@/apiServices/likesServices'
import { Link } from 'react-router-dom'
import { replyService } from '@/apiServices/replyServices'
import { EllipsisVertical, Pencil, Star, Trash2 } from 'lucide-react'
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
import { Button } from "@/components/ui/button"
import { useToast } from '../ui/use-toast'

export default memo(function ReplyCard({ reply, setReplies, index, showReplyCreateForm, updateReplyCount }) {
    const user = useSelector((state) => state.auth.user)
    const textAreaRef = useRef(null)
    const [replyInputVal, setReplyInputVal] = useState('')
    const [readOnly, setReadOnly] = useState(true)
    const { toast } = useToast()


    const deleteReply = async () => {
        const response = await replyService.deleteReply({ replyId: reply._id })
        if (response.status < 400 && response.data) {
            setReplies((prev) => prev.filter((r, i) => i !== index))
            updateReplyCount(-1)
            toast({
                title: "Success",
                description: response.message,
                className: "bg-green-500",
            })
        } else {
            toast({
                title: "Error",
                description: response.message,
                variant: "destructive",
            })
        }
    }

    const udateReply = async () => {
        const response = await replyService.updateReply({ replyId: reply._id, newContent: replyInputVal })
        if (response.status < 400 && response.data) {
            response.data.repliedBy = {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar
            }
            response.data.likesCount = 0
            response.data.isLikedByMe = false
            setReplies((prev) => prev.map((r, i) => i === index ? response.data : r))
            toast({
                title: "Success",
                description: response.message,
                className: "bg-green-500",
            })
            setReadOnly(true)
        } else {
            toast({
                title: "Error",
                description: response.message,
                variant: "destructive",
            })
        }
    }

    const toggleLike = async () => {
        const isLiked = reply.isLikedByMe;
        setReplies((prev) => prev.map((r, i) => i === index ? { ...r, isLikedByMe: !isLiked, likesCount: isLiked ? r.likesCount - 1 : r.likesCount + 1 } : r))
        await likesService.toggleLikeReply({ replyId: reply._id })
    }

    const resizeTextAreaForEditComment = () => {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    };

    useEffect(resizeTextAreaForEditComment, [replyInputVal]);


    return (
        <div className='sm:pr-3 my-5'>
            <div className='w-full flex flex-nowrap justify-start'>
                <img src={reply.repliedBy.avatar.replace("upload/", "upload/ar_1.0,g_face,c_fill,w_28/")} alt="avatar" className='w-7 h-7 rounded-full' />
                <div className='flex flex-col w-[90%] ml-2'>
                    {
                        readOnly && <Link to={`/${reply.repliedBy.username}`}
                            className='text-[10px] text-gray-400'>@{reply.repliedBy.username}</Link>
                    }

                    <textarea
                        value={replyInputVal ? replyInputVal : reply.text}
                        readOnly={readOnly}
                        ref={textAreaRef}
                        onChange={(e) => setReplyInputVal(e.target.value)}
                        placeholder='Add a reply...'
                        className={`${readOnly ? "" : "border-b-[1px] border-b-gray-400"} text-[12px] 
                             outline-none bg-transparent mb-1 overflow-y-hidden resize-none`}
                        cols="30" rows="1"
                    ></textarea>

                    {!readOnly &&
                        <div className='flex flex-nowrap justify-end'>
                            <button onClick={() => setReadOnly(true)}
                                className='py-1 px-2 rounded-full text-[12px] text-white border bg-gray-800 mr-1'>
                                Cancel
                            </button>
                            <button disabled={!replyInputVal.trim()} onClick={udateReply}
                                className={`${!replyInputVal.trim() ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-500"} text-white px-2 py-1 rounded-full text-[12px]`}
                            >Save</button>
                        </div>}

                </div>
                {
                    user && user._id === reply.repliedBy._id && readOnly &&
                    <div className='flex flex-col justify-center hoverableEle'>
                        <button><EllipsisVertical size={18} /></button>
                        <div className='showingEle right-4 rounded-md bg-gray-700'>
                            <button onClick={() => setReadOnly(false)}
                                className='flex flix-nowrap justify-center text-[10px] font-semibold py-1 px-3 text-white hover:bg-gray-600 rounded-t-md w-full'>
                                <Pencil size={16} />
                            </button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        className='flex flix-nowrap justify-center text-[10px] font-semibold py-1 px-3 text-white hover:bg-gray-600 rounded-b-md'>
                                        <Trash2 size={16} />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This reply permanently delete from your
                                            account.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={deleteReply}
                                        className="bg-red-500 text-white">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                }
            </div>

            <div className='ml-9'>
                <div className='flex flex-nowrap justify-start'>
                    <button onClick={toggleLike}
                        title={reply.isLikedByMe ? "Unlike" : "Like"}
                        className='mt-[2px] text-gray-400'
                    >
                        {
                            reply.isLikedByMe ?
                                <img alt='like'
                                    className='w-4 m-0 h-4 hover:scale-125 transition-transform
                             duration-300 ease-in-out'
                                    src='/star-svgrepo-com.svg' />
                                : <Star size={16} />
                        }
                    </button>
                    <span className='ml-[1px] block mt-1 text-[12px] text-gray-400'>
                        {reply.likesCount}
                    </span>

                    <button onClick={() => showReplyCreateForm(reply.repliedBy.username)}
                        className='flex bg-gray-800 hover:bg-gray-700 ml-5 flex-nowrap justify-start text-[10px] border rounded-full mt-1 h-5  px-2 text-white'>
                        Reply
                    </button>
                </div>
            </div>
        </div>
    )
})
