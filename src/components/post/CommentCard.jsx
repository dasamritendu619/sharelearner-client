import React, { useState, memo, useRef, useEffect, useCallback } from 'react'
import { commentService } from '@/apiServices/commentServices'
import { useSelector } from 'react-redux'
import { replyService } from "@/apiServices/replyServices"
import { likesService } from '@/apiServices/likesServices'
import { Link } from 'react-router-dom'
import ReplyCard from './ReplyCard'
import { Skeleton } from '../ui/skeleton'
import { EllipsisVertical, Pencil, Star, Trash2 } from 'lucide-react'
import { useToast } from '../ui/use-toast'
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default memo(function CommentCard({ comment, setComments, index, updateTotalCommentSCount }) {
    const [commentInputVal, setCommentInputVal] = useState("")
    const [replyInputVal, setReplyInputVal] = useState(`@${comment.commentedBy.username} `)
    const [readOnly, setReadOnly] = useState(true)
    const [showCreateReply, setShowCreateReply] = useState(false)
    const user = useSelector((state) => state.auth.user)
    const [replies, setReplies] = useState([])
    const [resData, setResData] = useState(null)
    const [page, setPage] = useState(1)
    const [showReplies, setShowReplies] = useState(false)
    const textAreaRef = useRef(null);
    const replyTextAreaRef = useRef(null);
    const { toast } = useToast();
    const skeletons = [1, 2, 3, 4, 5];

    const deleteComment = async () => {
        const confirm = window.confirm("Are you sure you want to delete this comment?")
        if (!confirm) return
        const response = await commentService.deleteComment({ commentId: comment._id })
        if (response.status < 400 && response.data) {
            setComments((prev) => prev.filter((c, i) => i !== index))
            updateTotalCommentSCount(-1)
            toast({
                title: "Comment Deleted",
                description: "Comment deleted successfully",
                className: "bg-green-500",
            })
        } else {
            toast({
                title: "Error",
                description: response.message,
                className: "bg-red-500",
            })
        }
    }

    const createReply = async () => {
        if (!replyInputVal.trim()) return
        const response = await replyService.createReply({ commentId: comment._id, content: replyInputVal })
        if (response.status < 400 && response.data) {
            response.data.repliedBy = {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar
            }
            response.data.totalLikes = 0
            response.data.isLikedByMe = false
            setComments((prev) => prev.map((c, i) => i === index ? { ...c, totalReplies: c.totalReplies + 1 } : c))
            setShowCreateReply(false)
            setReplyInputVal(`@${comment.commentedBy.username} `)
            setShowReplies(true);
            toast({
                title: "Reply Created",
                description: "Reply created successfully",
                className: "bg-green-500",
            })
            if (!resData) {
                getReplies(1);
            } else {
                setReplies((prev) => [response.data, ...prev])
            }
        } else {
            toast({
                title: "Error",
                description: response.message,
                variant: "destructive",
            })
        }
    }

    const getReplies = async (page) => {
        const limit = 15;
        setResData(null)
        const response = await replyService.getAllReplies({ commentId: comment._id, page, limit })
        if (response.status < 400 && response.data) {
            setResData(response.data)
            if (page === 1) {
                setReplies(response.data.docs)
            } else {
                setReplies([...replies, ...response.data.docs])
            }
            setPage(page)
        } else {
            toast({
                title: "Error",
                description: response.message,
                variant: "destructive",
            })
        }
    }

    const updateComment = async () => {
        if (!commentInputVal.trim()) return
        if (commentInputVal.trim() === comment.text) {
            setReadOnly(true)
            return
        }
        const response = await commentService.updateComment({ commentId: comment._id, text: commentInputVal })
        if (response.status < 400 && response.data) {
            response.data.commentedBy = {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar
            }
            response.data.totalReplies = comment.totalReplies;
            response.data.totalLikes = comment.totalLikes;
            response.data.isLikedByMe = comment.isLikedByMe;
            setReadOnly(true)
            setComments((prev) => prev.map((c, i) => i === index ? response.data : c))
            toast({
                title: "Comment Updated",
                description: "Comment updated successfully",
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

    const updateReplyCount = (count) => {
        setComments((prev) => prev.map((c, i) => i === index ? { ...c, totalReplies: c.totalReplies + count } : c))
    }

    const toggleLike = async () => {
        const isLiked = comment.isLikedByMe;
        setComments((prev) => prev.map((c, i) => i === index ? { ...c, totalLikes: isLiked ? c.totalLikes - 1 : c.totalLikes + 1, isLikedByMe: !isLiked } : c))
        await likesService.toggleLikeComment({ commentId: comment._id });
    }

    const showReplyCreateForm = useCallback((username) => {
        setShowCreateReply(true)
        if (!readOnly) {
            setReadOnly(true)
        }
        setReplyInputVal(`@${username} `)
    }, [readOnly, showCreateReply])

    const resizeTextAreaForEditComment = () => {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    };

    const resizeTextAreaForReply = () => {
        if (!showCreateReply) return;
        replyTextAreaRef.current.style.height = "auto";
        replyTextAreaRef.current.style.height = replyTextAreaRef.current.scrollHeight + "px";
    }

    useEffect(resizeTextAreaForEditComment, [commentInputVal]);
    useEffect(resizeTextAreaForReply, [replyInputVal]);

    return (
        <div className='my-5 mx-2'>
            <div className='mx-1 sm:mx-5 rounded-md'>
                <div className='w-full flex flex-nowrap justify-start'>
                    <img src={comment.commentedBy.avatar.replace("upload/", "upload/ar_1.0,g_face,c_fill,w_40/")} alt="avatar" className='w-10 h-10 rounded-full' />
                    <div className='flex flex-col w-[90%] ml-2'>
                        {
                            readOnly && <Link to={`/${comment.commentedBy.username}`}
                                className='text-[10px] text-gray-400'>@{comment.commentedBy.username}</Link>
                        }

                        <textarea
                            value={commentInputVal ? commentInputVal : comment.text}
                            readOnly={readOnly}
                            ref={textAreaRef}
                            onChange={(e) => setCommentInputVal(e.target.value)}
                            placeholder='Add a comment...'
                            className={`${readOnly ? "text-[14px]" : "text-[12px] border-b-[1px] border-b-gray-400"} 
                             outline-none bg-transparent mb-1 overflow-y-hidden resize-none `}
                            cols="30" rows="1"
                        ></textarea>

                        {!readOnly &&
                            <div className='flex flex-nowrap justify-end'>
                                <button onClick={() => setReadOnly(true)}
                                    className='py-1 px-2 rounded-full text-[12px] text-white border bg-gray-800 mr-1'>
                                    Cancel
                                </button>
                                <button disabled={!commentInputVal.trim()} onClick={updateComment}
                                    className={`${!commentInputVal.trim() ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-500"} text-white px-2 py-1 rounded-full text-[12px]`}
                                >Save</button>
                            </div>}

                    </div>
                    {
                        user && user._id === comment.commentedBy._id && readOnly &&
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <button><EllipsisVertical /></button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className=" cursor-pointer" onClick={() => setReadOnly(false)} title='Edit Comment'>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        <span>Edit Comment</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className=" cursor-pointer" onClick={deleteComment}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete Comment</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* <div className='flex flex-col justify-center hoverableEle'>
                                <button><EllipsisVertical /></button>
                                <div className='showingEle right-5 rounded-md bg-gray-700'>
                                    <button onClick={() => setReadOnly(false)} title='Edit Comment'
                                        className='flex flix-nowrap justify-center text-[10px] font-semibold py-1 px-3 text-white hover:bg-gray-600 rounded-t-md w-full'>
                                        <Pencil size={20} />

                                    </button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button title='Delete Comment'
                                                className='flex flix-nowrap justify-center text-[10px] font-semibold py-1 px-3 text-white hover:bg-gray-600 rounded-b-md'>
                                                <Trash2 size={20} />

                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This comment will permanently delete from your
                                                    account.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={deleteComment}
                                                    className="bg-red-500 text-white">Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                </div>
                            </div> */}
                        </>
                    }
                </div>

            </div>


            <div className='ml-10 sm:ml-14 rounded-md px-2'>
                <div className='flex flex-nowrap justify-start'>
                    <button onClick={toggleLike}
                        className='mt-1'
                    >
                        {
                            comment.isLikedByMe ?
                                <img alt='like'
                                    className='w-6 m-0 h-6 hover:scale-125 transition-transform
                                     duration-300 ease-in-out'
                                    src='/star-svgrepo-com.svg' />
                                : <Star size={18} />
                        }
                    </button>
                    <span className='ml-1 block mt-[6px] text-sm'>
                        {comment.totalLikes}
                    </span>

                    <button onClick={() => {
                        setShowCreateReply(!showCreateReply)
                        if (!readOnly) {
                            setReadOnly(true)
                        }
                    }}
                        className='flex bg-gray-800 hover:bg-gray-700 ml-5 flex-nowrap justify-start text-[12px] border rounded-full mt-1 h-6 py-[2px] px-2 text-white'>
                        Reply
                    </button>
                </div>


                {
                    showCreateReply && readOnly &&
                    <div className='w-full flex flex-nowrap justify-start mt-3'>
                        <img src={user.avatar.replace("upload/", "upload/ar_1.0,g_face,c_fill,w_28/")} alt="avatar" className='w-7 h-7 rounded-full' />
                        <div className='flex flex-col w-[90%] ml-2'>
                            <textarea
                                value={replyInputVal}
                                ref={replyTextAreaRef}
                                onChange={(e) => setReplyInputVal(e.target.value)}
                                placeholder='Add a Reply...'
                                className={`text-[12px] border-b-[1px] border-b-gray-400 outline-none bg-transparent mb-1 overflow-y-hidden resize-none`}
                                cols="30" rows="1"
                            ></textarea>


                            <div className='flex flex-nowrap justify-end'>
                                <button onClick={() => setShowCreateReply(false)}
                                    className='py-1 px-2 rounded-full text-[12px] text-white border bg-gray-800 mr-1'>
                                    Cancel
                                </button>
                                <button disabled={!replyInputVal.trim()} onClick={createReply}
                                    className={`${!replyInputVal.trim() ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-500"} text-white px-2 py-1 rounded-full text-[12px]`}
                                >
                                    Reply
                                </button>
                            </div>

                        </div>

                    </div>
                }

                <div>
                    <button onClick={() => {
                        setShowReplies(!showReplies);
                        if (!resData) {
                            getReplies(1);
                        }
                    }} disabled={comment.totalReplies === 0}>
                        <span className='text-[12px] text-blue-600 font-semibold hover:underline'>
                            {comment.totalReplies} Replies
                        </span>
                    </button>
                </div>

                {showReplies &&
                    <div className='mt-3'>
                        {resData ? replies.length > 0 ?
                            <div>
                                {
                                    replies.map((reply, index) => {
                                        return (
                                            <ReplyCard
                                                updateReplyCount={updateReplyCount}
                                                key={index}
                                                reply={reply}
                                                setReplies={setReplies}
                                                index={index}
                                                showReplyCreateForm={showReplyCreateForm} />
                                        )
                                    })
                                }
                                {
                                    resData.hasNextPage &&
                                    <button onClick={() => getReplies(page + 1)}
                                        className='text-[12px] text-blue-600 font-semibold hover:underline'>
                                        Load More
                                    </button>
                                }
                            </div> :
                            <h1 className='text-center font-bold text-lg text-white my-2'>0 Replies Found</h1> :
                            skeletons.map((skeleton, index) => {
                                return <div className="flex items-center space-x-4 my-3 sm:pl-8 md:pl-12" key={index}>
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[230px] sm:w-[420px] lg:w-[170px] xl:w-[230px]" />
                                        <Skeleton className="h-4 w-[170px] sm:w-[380px] lg:w-[120px] xl:w-[170px]" />
                                    </div>
                                </div>
                            })
                        }
                    </div>}
            </div>
        </div>
    )
})