import React,{memo} from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default memo(function SightNav() {
    const user = useSelector((state) => state.auth.user)
    let activePath = window.location.pathname
    if (activePath.endsWith('/')) {
        activePath = activePath.slice(0, -1)
    }
    

  return (
    <>
    <nav className='block w-full pl-3 pt-3'>
        {user && 
        <Link className='my-2 mb-3 flex flex-nowrap justify-start' to={`/user/${user.username}`}>
            <img src={user.avatar.replace("upload/", "upload/w_40/")} alt='avatar'
                  className='rounded-full w-12 h-12' />
            <span className='mx-2 mt-3 font-bold text-[16px]'>{user.fullName}</span>
        </Link>
        }
        <Link className='my-5 flex flex-nowrap justify-start' to='/'>
            <img src="/icons/icons8-home-48.png" alt="home" className='w-10' /> 
            <span className={`mx-4 mt-3 ${activePath === "" && 'text-blue-600 dark:text-green-600'} font-bold text-[16px] hover:underline`}>Home</span>
        </Link>
        <Link className='my-5 flex flex-nowrap justify-start' to='/blogs'>
            <img src="/icons/icons8-article-48.png" alt="home" className='w-10' /> 
            <span className={`mx-4 mt-3 ${activePath === "/blogs" && 'text-blue-600 dark:text-green-600'} font-bold text-[16px] hover:underline`}>Articles</span>
        </Link>
        <Link className='my-5 flex flex-nowrap justify-start' to='/videos'>
            <img src="/icons/icons8-video-48.png" alt="home" className='w-10' /> 
            <span className={`mx-4 mt-3 ${activePath === "/videos" && 'text-blue-600 dark:text-green-600'} font-bold text-[16px] hover:underline`}>Videos</span>
        </Link>
        {user && <>
        <Link className='my-5 flex flex-nowrap justify-start' to='/profiles'>
            <img src="/icons/icons8-add-user-group-woman-man-48.png" alt="home" className='w-10' /> 
            <span className={`mx-4 mt-3 ${activePath === "/profiles" && 'text-blue-600 dark:text-green-600'} font-bold text-[16px] hover:underline`}>
                Connections 
            </span>
        </Link>
        <Link className='my-5 flex flex-nowrap justify-start' to='/chat'>
            <img src="/icons/icons8-message-48.png" alt="home" className='w-10' /> 
            <span className={`mx-4 mt-3 ${activePath === "/chat" && 'text-blue-600 dark:text-green-600'} font-bold text-[16px] hover:underline`}>
                Messages
            </span>
        </Link>
        <Link className='my-5 flex flex-nowrap justify-start' to='/saved-posts'>
            <img src="/icons/icons8-saved-48.png" alt="home" className='w-10' /> 
            <span className={`mx-4 mt-3 ${activePath === "/saved-posts" && 'text-blue-600 dark:text-green-600'} font-bold text-[16px] hover:underline`}>
                Saved Items
            </span>
        </Link>
        </>}
    </nav>
    </>
  )
})
