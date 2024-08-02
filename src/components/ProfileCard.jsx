import { followersService } from '@/apiServices/followersServices'
import { UserRoundPlus } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function profileCard({ profile, setProfiles }) {
  // console.log(profile)
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const toggleFollow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setProfiles((prev) =>
      prev.map((p) => {
        if (p._id === profile._id) {
          return { ...p, isFollowedByMe: !p.isFollowedByMe };
        }
        return p;
      })
    );
    await followersService.toggleFollowUser({ profileId: profile._id });
  }

  return (
    <div className='flex justify-start flex-nowrap py-2' title={`${profile.followersCount} Followers`}>
      <Link to={`/user/${profile.username}`}>
        <img src={profile.avatar.replace("upload/", "upload/w_70/")} alt='avatar'
          className='rounded-full w-10 sm:w-12' />
      </Link>
      <p className='ml-2'>
        <Link to={`/user/${profile.username}`} className=' text-[12px] sm:text-[16px] leading-3 mt-1 font-semibold block'>
          {profile.fullName}
        </Link>

        <Link to={`/user/${profile.username}`} className=' text-[10px] sm:text-[12px] text-gray-400'>
          @{profile.username}
        </Link>
      </p>
      <button onClick={toggleFollow} disabled={!user || user._id === profile._id}
        className={`flex-center ml-2 sm:ml-3 mt-1 px-[6px] sm:px-3 h-6 sm:h-7 border rounded-full leading-3 ${!profile.isFollowedByMe ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"}`}>
        {
          !profile.isFollowedByMe ? <>
            <UserRoundPlus size={18} /> <span className='pl-1 text-[12px]'>Follow</span>
          </> : <>
            <span className='pl-1 text-[12px]'>Following</span>
          </>
        }
      </button>
    </div>
  )
}
