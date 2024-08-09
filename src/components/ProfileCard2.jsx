import { followersService } from '@/apiServices/followersServices'
import { UserRoundPlus } from 'lucide-react'
import React,{memo} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default memo(function profileCard2({ profile, setProfiles, profiles }) {
  // console.log(profile)
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const toggleFollow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (profiles) {
      const newProfiles = profiles.map((p) => {
        if (p._id === profile._id) {
          return { ...p, 
            isFollowedByMe: !p.isFollowedByMe,
            followersCount: p.isFollowedByMe ? p.followersCount - 1 : p.followersCount + 1
          };
        }
        return p;
      });
      setProfiles(newProfiles);
    } else {
      setProfiles((prev) =>
        prev.map((p) => {
          if (p._id === profile._id) {
            return { ...p, 
              isFollowedByMe: !p.isFollowedByMe,
              followersCount: p.isFollowedByMe ? p.followersCount - 1 : p.followersCount + 1
            };
          }
          return p;
        })
      );
    }
    await followersService.toggleFollowUser({ profileId: profile._id });
  }

  return (
    <div className='flex flex-col items-center my-4 mx-4' >
      <Link to={`/user/${profile.username}`} className='flex flex-col items-center'>
        <img src={profile.avatar.replace("upload/", "upload/w_120/")} alt={profile.username} className='w-24 md:w-28 h-24 md:h-28 rounded-full' />
        <div className='flex flex-col mt-2 text-center'>
          <span className='text-[16px] md:text-lg leading-4 font-bold'>{profile.fullName}</span>
          <span className='text-gray-500 text-[12px] mt-1 dark:text-gray-400 leading-5'>
            {profile.followersCount} followers
            </span>
        </div>
      </Link>
      
      <button onClick={toggleFollow} disabled={!user || user._id === profile._id}
        className={`flex-center mt-1 h-8 w-24 md:w-28 border rounded-full leading-3 ${!profile.isFollowedByMe ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"}`}>
        {
          !profile.isFollowedByMe ? <>
            <UserRoundPlus size={18} /> <span className='pl-1 text-[14px] font-semibold'>Follow</span>
          </> : <>
            <span className='pl-1 text-[12px] font-semibold'>Following</span>
          </>
        }
      </button>
    </div>
  )
})

