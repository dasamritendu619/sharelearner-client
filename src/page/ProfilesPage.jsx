import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { followersService } from '@/apiServices/followersServices'
import { setFollowers, setFollowings, setSuggestedUsers, reValidateByKey } from '@/store/authSlice'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import ProfileCard2 from '@/components/ProfileCard2'
import { Button as Btn } from '@/components/ui/button'


export default function ProfilesPage() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const followers = useSelector((state) => state.auth.followers)
  const followings = useSelector((state) => state.auth.followings)
  const suggestedUsers = useSelector((state) => state.auth.suggestedUsers)
  const [followersLoading, setFollowersLoading] = useState(true)
  const [followingsLoading, setFollowingsLoading] = useState(true)
  const [suggestedUsersLoading, setSuggestedUsersLoading] = useState(true)
  const { toast } = useToast()

  const updateSuggestedUsers = (profiles) => {
    dispatch(setSuggestedUsers({
      ...suggestedUsers,
      docs: profiles,
    }))
  }

  const updateFollowers = (profiles) => {
    dispatch(setFollowers({
      ...followers,
      docs: profiles,
    }))
  }

  const updateFollowings = (profiles) => {
    dispatch(setFollowings({
      ...followings,
      docs: profiles,
    }))
  }

  const getFollowers = async (page) => {
    if (!user) {
      return;
    }
    const limit = 20;
    const response = await followersService.getAllFollowers({
      username: user.username,
      page,
      limit
    })
    // console.log(response)
    if (response.status < 400 && response.data) {
      if (page === 1) {
        dispatch(setFollowers({
          docs: response.data.docs,
          page: response.data.page,
          nextPage: response.data.nextPage,
        }))
        setFollowersLoading(false)
      } else {
        dispatch(setFollowers({
          docs: [...followers.docs, ...response.data.docs],
          page: response.data.page,
          nextPage: response.data.nextPage,
        }))
      }
    } else {
      toast({
        title: "Failed to get Followers",
        description: response.message,
        variant: "destructive",
      })
    }
  }

  const getFollowings = async (page) => {
    if (!user) {
      return;
    }
    const limit = 20;
    const response = await followersService.getAllFollowings({
      username: user.username,
      page,
      limit
    })
    // console.log(response)
    if (response.status < 400 && response.data) {
      if (page === 1) {
        dispatch(setFollowings({
          docs: response.data.docs,
          page: response.data.page,
          nextPage: response.data.nextPage,
        }))
        setFollowingsLoading(false)
      } else {
        dispatch(setFollowings({
          docs: [...followings.docs, ...response.data.docs],
          page: response.data.page,
          nextPage: response.data.nextPage,
        }))
      }
    } else {
      toast({
        title: "Failed to get Followings",
        description: response.message,
        variant: "destructive",
      })
    }
  }

  const getSuggestedUsers = async (page) => {
    if (!user) {
      return;
    }
    const limit = 20;
    const response = await followersService.getSuggestedUsers({
      page,
      limit
    })
    // console.log(response)
    if (response.status < 400 && response.data) {
      if (page === 1) {
        dispatch(setSuggestedUsers({
          docs: response.data.docs,
          page: response.data.page,
          nextPage: response.data.nextPage,
        }))
        setSuggestedUsersLoading(false)
      } else {
        dispatch(setSuggestedUsers({
          docs: [...suggestedUsers.docs, ...response.data.docs],
          page: response.data.page,
          nextPage: response.data.nextPage,
        }))
      }
    } else {
      toast({
        title: "Failed to get Suggested profiles",
        description: response.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    (async () => {
      if (user) {
        if (suggestedUsers.docs.length === 0) {
          await getSuggestedUsers(1)
        } else {
          setSuggestedUsersLoading(false)
        }

        if (followings.docs.length === 0) {
          await getFollowings(1)
        } else {
          setFollowingsLoading(false)
        }

        if (followers.docs.length === 0) {
          await getFollowers(1)
        } else {
          setFollowersLoading(false)
        }

      }
    })()
  }, [user])

  return (
    <div className='fixed top-[94px] overflow-y-auto  h-[calc(100vh-94px)] sm:h-[calc(100vh-58px)] left-0 sm:top-[56px] w-screen'>
      {
        (suggestedUsersLoading || suggestedUsers.docs.length > 0) && <div className='profailsContainer'>
          <h2
            className='text-start ml-5 text-[20px] font-semibold pt-4'
          >
            Suggested Profiles
          </h2>
          <hr />
          {
            suggestedUsersLoading ? <div className='flex flex-wrap justify-center'>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => {
                return <div className="flex flex-col items-center space-x-4 my-4 mx-4" key={i}>
                  <Skeleton className="w-24 md:w-28 h-24 md:h-28 rounded-full" />
                  <div className="space-y-2 mt-3">
                    <Skeleton className="h-4 w-[100px] sm:w-[150px]" />
                    <Skeleton className="h-4 w-[70px] sm:w-[120px]" />
                  </div>
                </div>
              })}</div> : <div className='pt-2 px-4 lg:px-3 xl:px-6 '>
              <div className=' flex flex-wrap justify-center'>
                {
                  suggestedUsers.docs.map((profile) => {
                    return <ProfileCard2
                      profile={profile}
                      key={profile._id}
                      setProfiles={updateSuggestedUsers}
                      profiles={suggestedUsers.docs} />
                  })
                }
              </div>
              {
                suggestedUsers.nextPage &&
                <Btn className="block mx-auto my-4"
                  onClick={() => {
                    getSuggestedUsers(suggestedUsers.page + 1)
                  }} >
                  See more
                </Btn>
              }

            </div>
          }
        </div>
      }

      {
        (followingsLoading || followings.docs.length > 0) && <div className='profailsContainer'>
          <h2
            className='text-start ml-5 text-[20px] font-semibold pt-4'
          >
            Following Profiles
          </h2>
          <hr />
          {
            followingsLoading ? <div className='flex flex-wrap justify-center'>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => {
                return <div className="flex flex-col items-center space-x-4 my-4 mx-4" key={i}>
                  <Skeleton className="w-24 md:w-28 h-24 md:h-28 rounded-full" />
                  <div className="space-y-2 mt-3">
                    <Skeleton className="h-4 w-[100px] sm:w-[150px]" />
                    <Skeleton className="h-4 w-[70px] sm:w-[120px]" />
                  </div>
                </div>
              })}</div> : <div className='pt-2 px-4 lg:px-3 xl:px-6 '>
              <div className=' flex flex-wrap justify-center'>
                {
                  followings.docs.map((profile) => {
                    return <ProfileCard2
                      profile={profile}
                      key={profile._id}
                      setProfiles={updateFollowings}
                      profiles={followings.docs} />
                  })
                }
              </div>
              {
                followings.nextPage &&
                <Btn className="block mx-auto my-4"
                  onClick={() => {
                    getFollowings(followings.page + 1)
                  }} >
                  See more
                </Btn>
              }

            </div>
          }
        </div>
      }

      {
        (followersLoading || followers.docs.length > 0) && <div className='profailsContainer'>
          <h2
            className='text-start ml-5 text-[20px] font-semibold pt-4'
          >
            Followers Profiles
          </h2>
          <hr />
          {
            followersLoading ? <div className='flex flex-wrap justify-center'>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => {
                return <div className="flex flex-col items-center space-x-4 my-4 mx-4" key={i}>
                  <Skeleton className="w-24 md:w-28 h-24 md:h-28 rounded-full" />
                  <div className="space-y-2 mt-3">
                    <Skeleton className="h-4 w-[100px] sm:w-[150px]" />
                    <Skeleton className="h-4 w-[70px] sm:w-[120px]" />
                  </div>
                </div>
              })}</div> : <div className='pt-2 px-4 lg:px-3 xl:px-6 '>
              <div className=' flex flex-wrap justify-center'>
                {
                  followers.docs.map((profile) => {
                    return <ProfileCard2
                      profile={profile}
                      key={profile._id}
                      setProfiles={updateFollowers}
                      profiles={followers.docs} />
                  })
                }
              </div>
              {
                followers.nextPage &&
                <Btn className="block mx-auto my-4"
                  onClick={() => {
                    getFollowers(followers.page + 1)
                  }} >
                  See more
                </Btn>
              }

            </div>
          }
        </div>
      }

    </div>
  )
}
