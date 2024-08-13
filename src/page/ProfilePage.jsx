import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { authService } from '@/apiServices/authServices'
import { postService } from '@/apiServices/postServices'
import { useSelector, useDispatch } from 'react-redux'
import { useToast } from '@/components/ui/use-toast'
import { viewProfile, updateViewedProfiles } from '@/store/postSlice'
import SightNav from '@/components/SightNav'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from "@/components/ui/button"
import CorpEditor from '@/components/CorpEditor'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostCard from '@/components/post/PostCard'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Cake, 
  Eye, 
  GraduationCap, 
  Image, 
  MessageCircleHeart, 
  Smile, 
  Upload, 
  MapPin, 
  UserRoundPlus, 
  Send, 
  Pencil, 
  UserCheck, 
  Video, 
  BookOpen 
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ProfileCard from '@/components/ProfileCard'
import { followersService } from '@/apiServices/followersServices'

// profile Tabs :- Posts, Photos, Videos, blogs, Shared, Private, PDF

export default function ProfilePage() {
  const { username } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const [followers, setFollowers] = useState({ docs: [], page: 1, nextPage: null, loading: true });
  const [following, setFollowing] = useState({ docs: [], page: 1, nextPage: null, loading: true });
  const [profile, setProfile] = useState(null);
  const [postsLoading, setPostsLoading] = useState(true);
  const viewedProfiles = useSelector(state => state.post.viewedProfiles);
  const user = useSelector(state => state.auth.user);
  const currentTab = searchParams.get('tab') || 'posts';
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tabs = {
    posts: 'all',
    photos: 'photo',
    videos: 'video',
    blogs: 'blog',
    shared: 'forked',
    private: 'private',
    pdf: 'pdf',
  }
  const coverCloseRef = useRef(null);
  const coverOpenRef = useRef(null);
  const avatarCloseRef = useRef(null);
  const avatarOpenRef = useRef(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [avatarImage, setAvatarImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);

  // console.log(profile)
  // console.log(viewedProfiles)

  const updatePosts = useCallback((post) => {
    console.log("object")
    const updatedPosts = profile[tabs[currentTab]].docs.map(p => {
      if (p._id === post._id) {
        return post
      }
      return p
    })
    setProfile({
      ...profile,
      [tabs[currentTab]]: {
        ...profile[tabs[currentTab]],
        docs: updatedPosts
      }
    })
    dispatch(updateViewedProfiles({
      ...profile,
      [tabs[currentTab]]: {
        ...profile[tabs[currentTab]],
        docs: updatedPosts
      }
    }))
  }, [profile, currentTab])

  const handleInView = (index) => {
    setCurrentVideoIndex(index);
  };

  const toggleFollow = async () => {
    if (!user || !profile.profile) {
      return navigate('/login');
    }
    const updatedProfile = {
      ...profile,
      profile: {
        ...profile.profile,
        isFollowedByMe: !profile.profile.isFollowedByMe,
        followersCount: profile.profile.isFollowedByMe ? profile.profile.followersCount - 1 : profile.profile.followersCount + 1
      }
    }
    setProfile(updatedProfile);
    dispatch(updateViewedProfiles(updatedProfile));
    await followersService.toggleFollowUser({ profileId: profile.profile._id });
  }

  const updateFollowers = (profiles) => {
    setFollowers({
      ...followers,
      docs: profiles
    })
  }

  const updateFollowings = (profiles) => {
    setFollowing({
      ...following,
      docs: profiles
    })
  }

  const getFollowers = async (page) => {
    const limit = 20;
    const response = await followersService.getAllFollowers({ username: username, page: page, limit: limit });
    // console.log(response)
    if (response.status < 400 && response.data) {
      if (page === 1) {
        setFollowers({ docs: response.data.docs, page: response.data.page, nextPage: response.data.nextPage, loading: false });
      } else {
        setFollowers({ docs: [...followers.docs, ...response.data.docs], page: response.data.page, nextPage: response.data.nextPage, loading: false });
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
    const limit = 20;
    const response = await followersService.getAllFollowings({ username: username, page: page, limit: limit });
    // console.log(response)
    if (response.status < 400 && response.data) {
      if (page === 1) {
        setFollowing({ docs: response.data.docs, page: response.data.page, nextPage: response.data.nextPage, loading: false });
      } else {
        setFollowing({ docs: [...following.docs, ...response.data.docs], page: response.data.page, nextPage: response.data.nextPage, loading: false });
      }
    } else {
      toast({
        title: "Failed to get Followings",
        description: response.message,
        variant: "destructive",
      })
    }
  }

  const updateAvatar = async (image) => {
    if (!image) {
      toast({
        title: "Failed to upload Avatar",
        description: "Please select an image to upload",
        variant: "destructive",
      })
    }
    setAvatarLoading(true);
    const response = await authService.updateAvatar({ avatar: image });
    if (response.status < 400 && response.data) {
      toast({
        title: "Avatar Updated",
        description: response.message,
        className: "bg-green-500",
      })
      const updatedProfile = {
        ...profile,
        profile: {
          ...profile.profile,
          avatar: response.data.avatar
        }
      }
      setProfile(updatedProfile);
      dispatch(updateViewedProfiles(updatedProfile));
      setAvatarLoading(false);
    } else {
      toast({
        title: "Failed to upload Avatar",
        description: response.message,
        variant: "destructive",
      })
      setAvatarLoading(false);
    }
  }

  const updateCover = async (image) => {
    if (!image) {
      toast({
        title: "Failed to upload Cover Photo",
        description: "Please select an image to upload",
        variant: "destructive",
      })
    }
    setCoverLoading(true);
    const response = await authService.updateCoverPhoto({ coverPhoto: image });
    if (response.status < 400 && response.data) {
      toast({
        title: "Cover Photo Updated",
        description: response.message,
        className: "bg-green-500",
      })
      const updatedProfile = {
        ...profile,
        profile: {
          ...profile.profile,
          coverPhoto: response.data.coverPhoto
        }
      }
      setProfile(updatedProfile);
      dispatch(updateViewedProfiles(updatedProfile));
      setCoverLoading(false);
    } else {
      toast({
        title: "Failed to upload Cover Photo",
        description: response.message,
        variant: "destructive",
      })
      setCoverLoading(false);
    }
  }

  const getProfile = async () => {
    if (!username) return navigate('/404');
    const response = await authService.getProfile({ username: username });
    if (response.status < 400 && response.data) {
      const newProfile = {
        username: username,
        profile: response.data,
        "all": {
          docs: [],
          page: 1,
          nextPage: null
        },
        "photo": {
          docs: [],
          page: 1,
          nextPage: null
        },
        "video": {
          docs: [],
          page: 1,
          nextPage: null
        },
        "blog": {
          docs: [],
          page: 1,
          nextPage: null
        },
        "forked": {
          docs: [],
          page: 1,
          nextPage: null
        },
        "private": {
          docs: [],
          page: 1,
          nextPage: null
        },
        "pdf": {
          docs: [],
          page: 1,
          nextPage: null
        }
      }
      setProfile(newProfile);
      dispatch(viewProfile(newProfile));
      return newProfile;
    } else {
      toast({
        title: "Failed to get Profile",
        description: response.message,
        variant: "destructive",
      })
      navigate('/404');
      return null;
    }
  }

  const isProfileViewed = () => {
    const index = viewedProfiles.findIndex(profile => profile.username === username);
    if (index === -1) return null;
    return viewedProfiles[index];
  }

  const getPosts = async (page = 1, type, profile) => {
    if (!username || !type || !profile) return navigate('/404');
    const limit = 20;
    const response = await postService.getProfilePosts({
      username: username,
      page: page,
      limit: limit,
      type: type,
    })
    // console.log(response)
    if (response.status < 400 && response.data) {
      //console.log(profile)
      if (page === 1) {
        const updatedProfile = {
          ...profile,
          [type]: {
            docs: response.data.docs,
            page: response.data.page,
            nextPage: response.data.nextPage
          }
        }
        dispatch(updateViewedProfiles(updatedProfile));
        setProfile(updatedProfile);
        setPostsLoading(false);
      } else {
        const updatedProfile = {
          ...profile,
          [type]: {
            docs: [...profile[type].docs, ...response.data.docs],
            page: response.data.page,
            nextPage: response.data.nextPage
          }
        }
        dispatch(updateViewedProfiles(updatedProfile));
        setProfile(updatedProfile);
      }
    } else {
      toast({
        title: "Failed to get Posts",
        description: response.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    (async () => {
      const profileViewed = isProfileViewed();
      if (!profileViewed) {
        const foundedProfile = await getProfile();
        if (foundedProfile) {
          setPostsLoading(true);
          if (currentTab === 'posts') {
            await getPosts(1, 'all', foundedProfile);
          } else if (currentTab === 'photos') {
            await getPosts(1, 'photo', foundedProfile);
          } else if (currentTab === 'videos') {
            await getPosts(1, 'video', foundedProfile);
          } else if (currentTab === 'blogs') {
            await getPosts(1, 'blog', foundedProfile);
          } else if (currentTab === 'shared') {
            await getPosts(1, 'forked', foundedProfile);
          } else if (currentTab === 'private') {
            if (foundedProfile.username === username) {
              await getPosts(1, 'private', foundedProfile);
            } else {
              navigate(`/user/${username}?tab=posts`);
            }
          } else if (currentTab === 'pdf') {
            await getPosts(1, 'pdf', foundedProfile);
          } else {
            navigate(`/user/${username}?tab=posts`);
          }
        }
      } else if (profileViewed) {
        // setProfile(profileViewed);
        if (profileViewed[tabs[currentTab]].docs.length === 0) {
          setPostsLoading(true);
          await getPosts(1, tabs[currentTab], profileViewed);
        } else {
          setProfile(profileViewed);
        }
      }
    })()

  }, [username, currentTab])

  return (
    <div className='w-screen fixed top-14 left-0 bg-blue-100 dark:bg-gray-950 flex flex-nowrap justify-center'>
      <div className='hidden lg:block lg:w-[250px] border-gray-500 border-r h-[calc(100vh-56px)]'>
        <SightNav />
      </div>
      <div className='w-full lg:w-[calc(100%-250px)]'>
        {
          profile ?
            <div className='w-full h-[calc(100vh-56px)] overflow-y-auto'>
              <div className='w-full relative'>
                {user.username === username ? <Dialog>
                  <DialogTrigger asChild>
                    {!coverLoading ? <button className='block w-full'>
                      <img src={profile.profile.coverPhoto.replace("upload/", "upload/q_60/")}
                        alt="photo"
                        className='w-full aspect-[4/1] md:aspect-[5/1] xl:aspect-[6/1] block' />
                    </button> : 
                      <Skeleton className='w-full aspect-[4/1] md:aspect-[5/1] xl:aspect-[6/1] block' />
                    }
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Your Cover Photo</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Button className='flex flex-nowrap justify-center'
                        onClick={() => {
                          coverInputRef.current?.click();
                          coverCloseRef.current?.click();
                        }}
                      >
                        <Upload size={20} className='mr-2' />
                        <span>
                          upload new Cover Photo
                        </span>
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className='flex flex-nowrap justify-center'>
                            <Eye size={20} className='mr-2' />
                            <span>
                              View Cover Photo
                            </span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[100vw] bg-transparent border-none p-0 sm:p-6">
                          <DialogHeader>
                            <DialogTitle className='hidden'>Cover Photo</DialogTitle>
                          </DialogHeader>
                          <img src={profile.profile.coverPhoto} alt="photo"
                            className='w-full h-auto max-h-[70vh]' />
                        </DialogContent>
                      </Dialog>

                    </div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary"
                          ref={coverCloseRef}>
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog> :
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className='block w-full'>
                        <img src={profile.profile.coverPhoto.replace("upload/", "upload/q_60/")} alt="photo" className='w-full aspect-[4/1] md:aspect-[5/1] xl:aspect-[6/1] block' />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[100vw] bg-transparent border-none p-0 sm:p-6">
                      <DialogHeader>
                        <DialogTitle className='hidden'>Cover Photo</DialogTitle>
                      </DialogHeader>
                      <img src={profile.profile.coverPhoto} alt="photo" className='w-full h-auto max-h-[70vh]' />
                    </DialogContent>
                  </Dialog>
                }

                {user.username === username ? <Dialog>
                  <DialogTrigger asChild>
                    {!avatarLoading ? <button>
                      <img
                        src={profile.profile.avatar.replace("upload/", "upload/q_40/")}
                        alt="photo"
                        className='aspect-[1/1] rounded-full absolute w-[25vw] md:w-[20vw] lg:w-[15vw] lg:top-[7vw] xl:top-[5vw] z-20 top-[10vw] left-4 sm:left-6 lg:left-8 xl:left-10'
                      />
                    </button> : 
                    <Skeleton className='aspect-[1/1] rounded-full absolute w-[25vw] md:w-[20vw] lg:w-[15vw] lg:top-[7vw] xl:top-[5vw] z-20 top-[10vw] left-4 sm:left-6 lg:left-8 xl:left-10' />
                    }
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Your Profile Photo</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Button className='flex flex-nowrap justify-center'
                        onClick={() => {
                          avatarInputRef.current?.click();
                          avatarCloseRef.current?.click();
                        }}
                      >
                        <Upload size={20} className='mr-2' />
                        <span>
                          upload new Profile Photo
                        </span>
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className='flex flex-nowrap justify-center'>
                            <Eye size={20} className='mr-2' />
                            <span>
                              View Profile Photo
                            </span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-transparent border-none p-0 sm:p-6">
                          <DialogHeader>
                            <DialogTitle className='hidden'>Profile Photo</DialogTitle>
                          </DialogHeader>
                          <img src={profile.profile.avatar} alt="photo" className='w-full' />
                        </DialogContent>
                      </Dialog>

                    </div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary"
                          ref={avatarCloseRef}>
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog> :
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <img
                          src={profile.profile.avatar.replace("upload/", "upload/q_40/")}
                          alt="photo"
                          className='aspect-[1/1] rounded-full absolute w-[25vw] md:w-[20vw] lg:w-[15vw] lg:top-[7vw] xl:top-[5vw] z-20 top-[10vw] left-4 sm:left-6 lg:left-8 xl:left-10'
                        />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-transparent border-none p-0 sm:p-6">
                      <DialogHeader>
                        <DialogTitle className='hidden'>Profile Photo</DialogTitle>
                      </DialogHeader>
                      <img src={profile.profile.avatar} alt="photo" className='w-full' />
                    </DialogContent>
                  </Dialog>
                }

                {
                  profile.profile.links?.length > 0 &&
                  <div className='flex flex-nowrap justify-end absolute right-3 top-[18vw] sm:top-[20vw] md:top-[17vw] lg:top-[13vw] xl:top-[11vw]'>
                    {profile.profile.links[0] &&
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a target='_blank' href={profile.profile.links[0]}>
                              <img src="/icons/github-142-svgrepo-com.svg" alt="github" className='bg-white rounded-full w-6 mx-2' />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <a target='_blank' href={profile.profile.links[0]} className='text-blue-600'>{profile.profile.links[0]}</a>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>}

                    {profile.profile.links[1] &&
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a target='_blank' href={profile.profile.links[1]}>
                              <img src="/icons/linkedin-svgrepo-com (1).svg" alt="in" className=' rounded-lg w-6 mx-2' />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <a target='_blank' href={profile.profile.links[1]} className='text-blue-600'>{profile.profile.links[1]}</a>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    }
                    {profile.profile.links[2] &&
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a target='_blank' href={profile.profile.links[2]}>
                              <img src="/icons/portfolio-travel-svgrepo-com.svg" alt="portfolio" className='rounded-lg w-6 mx-2' />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <a target='_blank' href={profile.profile.links[2]} className='text-blue-600'>{profile.profile.links[2]}</a>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    }
                  </div>
                }

                <div className='flex flex-nowrap justify-end float-right'>
                  <span className='proBth'>
                    {profile.profile.postsCount} Posts
                  </span>

                  <Sheet>
                    <SheetTrigger asChild>
                      <button onClick={() => {
                        if (followers.docs.length === 0) {
                          getFollowers(1);
                        }
                      }}
                        className='proBth hover:underline'>
                        {profile.profile.followersCount} Followers
                      </button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Followers</SheetTitle>
                        <SheetDescription className="pb-3">
                          Followers of {profile.profile.fullName}
                        </SheetDescription>
                      </SheetHeader> <hr />
                      {
                        followers.loading ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                          return <div className="flex items-center space-x-4 my-3 sm:pl-8 md:pl-12 overflow-auto" key={i}>
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[150px] sm:w-[200px]" />
                              <Skeleton className="h-4 w-[100px] sm:w-[150px]" />
                            </div>
                          </div>
                        }) : <div className='pt-2'>
                          {
                            followers.docs.length > 0 ? followers.docs.map((profile) => {
                              return <ProfileCard
                                profile={profile}
                                key={profile._id}
                                setProfiles={updateFollowers}
                                profiles={followers.docs} />
                            }) : <p className='text-center py-6'>
                              No followers found
                            </p>
                          }
                          {
                            followers.nextPage &&
                            <Button className="block mx-auto my-4"
                              onClick={() => {
                                getFollowers(followers.page + 1)
                              }} >
                              See more
                            </Button>
                          }
                        </div>
                      }

                      <SheetFooter>

                      </SheetFooter>
                    </SheetContent>
                  </Sheet>


                  <Sheet>
                    <SheetTrigger asChild>
                      <button onClick={() => {
                        if (following.docs.length === 0) {
                          getFollowings(1);
                        }
                      }}
                        className='proBth hover:underline'>
                        {profile.profile.followingsCount} Following
                      </button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Followings</SheetTitle>
                        <SheetDescription className="pb-3">
                          Followings of {profile.profile.fullName}
                        </SheetDescription>
                      </SheetHeader> <hr />
                      {
                        following.loading ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                          return <div className="flex items-center space-x-4 my-3 sm:pl-8 md:pl-12 overflow-auto" key={i}>
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[150px] sm:w-[200px]" />
                              <Skeleton className="h-4 w-[100px] sm:w-[150px]" />
                            </div>
                          </div>
                        }) : <div className='pt-2'>
                          {
                            following.docs.length > 0 ? following.docs.map((profile) => {
                              return <ProfileCard
                                profile={profile}
                                key={profile._id}
                                setProfiles={updateFollowings}
                                profiles={following.docs} />
                            }) : <p className='text-center py-6'>
                              No followers found
                            </p>
                          }
                          {
                            following.nextPage &&
                            <Button className="block mx-auto my-4"
                              onClick={() => {
                                getFollowings(following.page + 1)
                              }} >
                              See more
                            </Button>
                          }
                        </div>
                      }

                      <SheetFooter>

                      </SheetFooter>
                    </SheetContent>
                  </Sheet>

                </div>

                <div className='flex flex-wrap px-6 md:px-10 mt-[8vw] lg:mt-[6vw]'>
                  <div>
                    <p className='text-[18px] sm:text-[22px] md:text-[25px] p-0 m-0'>
                      <span className='font-bold'>{profile.profile.fullName} </span>
                      (<span className='text-gray-500'>
                        @{profile.profile.username}</span>)
                    </p>
                    {profile.profile.about && <span className='text-gray-700 dark:text-gray-400 font-semibold block'>
                      {profile.profile.about}
                    </span>}

                    {profile.profile.dob && <span className='flex flex-nowrap justify-start mt-4 mb-[2px] font-semibold text-[13px]'>
                      <Cake />
                      <span className='ml-2 mt-1'>
                        {new Date(profile.profile.dob).toDateString()}
                      </span>
                    </span>}

                    {profile.profile.gender && <span className='flex flex-nowrap justify-start font-semibold text-[13px] my-[2px]'>
                      <Smile />
                      <span className='ml-2 mt-1'>
                        {profile.profile.gender === "M" ? "Male" : profile.profile.gender === 'F' ? "Female" : "Other"}
                      </span>
                    </span>}

                    {profile.profile.education && <span className='flex flex-nowrap justify-start font-semibold text-[13px] my-[2px]'>
                      <GraduationCap />
                      <span className='ml-2 mt-1'>
                        {profile.profile.education?.replaceAll(',', ' | ')}
                      </span>
                    </span>}

                    {profile.profile.interest && <span className='flex flex-nowrap justify-start font-semibold text-[13px] my-[2px]'>
                      <MessageCircleHeart />
                      <span className='ml-2 mt-1'>
                        {profile.profile.interest?.replaceAll(',', ' | ')}
                      </span>
                    </span>}

                    {profile.profile.address && <span className='flex flex-nowrap justify-start font-semibold text-[13px] my-[2px]'>
                      <MapPin />
                      <span className='ml-2 mt-1'>
                        {profile.profile.address?.replaceAll(',', ' | ')}
                      </span>
                    </span>}

                  </div>

                  <div className='flex flex-none items-center mx-auto mt-5'>
                    {user && user.username !== username && <Button onClick={toggleFollow}
                      className={`flex-center border mx-1 rounded-lg ${!profile.profile.isFollowedByMe ? "bg-green-500 hover:bg-green-600 text-white" : ""}`} >
                      {
                        !profile.profile.isFollowedByMe ? <>
                          <UserRoundPlus size={20} /> <span className='pl-1 text-[14px]'>Follow</span>
                        </> : <>
                          <UserCheck size={18} className='mr-2' />
                          <span className='pl-1 text-[12px]'>Following</span>
                        </>
                      }
                    </Button>}

                    {user && user.username === username &&
                      <Button className='flex-center border mx-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white'
                        onClick={() => navigate('/update-user')} >
                        <Pencil size={18} className='mr-2' />
                        <span>Edit Profile</span>
                      </Button>}

                    {user && user.username !== username && profile.profile.isFollowedByMe &&
                      <Button className='flex-center border mx-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white'
                        onClick={() => navigate('/chat')} >
                        <Send size={18} className='mr-2' />
                        <span>Message</span>
                      </Button>}
                  </div>
                </div>

              </div>

              <div className='w-full mt-5'>
                <div className='w-full flex flex-nowrap justify-center border-t overflow-x-auto'>
                  <Link to={`/user/${username}?tab=posts`} className={`tab ${currentTab === 'posts' ? 'activeTab' : ''}`}>
                    Posts
                  </Link>
                  <Link to={`/user/${username}?tab=photos`} className={`tab ${currentTab === 'photos' ? 'activeTab' : ''}`}>
                    Photos
                  </Link>
                  <Link to={`/user/${username}?tab=videos`} className={`tab ${currentTab === 'videos' ? 'activeTab' : ''}`}>
                    Videos
                  </Link>
                  <Link to={`/user/${username}?tab=blogs`} className={`tab ${currentTab === 'blogs' ? 'activeTab' : ''}`}>
                    Blogs
                  </Link>
                  <Link to={`/user/${username}?tab=shared`} className={`tab ${currentTab === 'shared' ? 'activeTab' : ''}`}>
                    Shared
                  </Link>
                  {user && user.username === username &&
                    <Link to={`/user/${username}?tab=private`} className={`tab ${currentTab === 'private' ? 'activeTab' : ''}`}>
                      Private
                    </Link>}
                  <Link to={`/user/${username}?tab=pdf`} className={`tab hidden min-[450px]:inline ${currentTab === 'pdf' ? 'activeTab' : ''}`}>
                    PDF
                  </Link>
                </div>

                <div className='w-full md:w-[60%] lg:w-[50%] mx-auto'>
                  {!postsLoading ? <InfiniteScroll
                    scrollableTarget='scrollableDiv'
                    dataLength={profile[tabs[currentTab]].docs.length}
                    next={() => getPosts(profile[tabs[currentTab]].page + 1, tabs[currentTab], profile)}
                    height={window.innerHeight - 58}
                    hasMore={profile[tabs[currentTab]].nextPage ? true : false}
                    loader={
                      <>
                        {
                          [1, 2, 3, 4, 5].map((i) => {
                            return <div key={i}><div className="flex items-center space-x-4 pl-4 my-3 overflow-auto" >
                              <Skeleton className="h-12 w-12 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-[150px] sm:w-[200px]" />
                                <Skeleton className="h-4 w-[100px] sm:w-[150px]" />
                              </div>
                            </div>
                              <div>
                                <Skeleton className={'w-full h-96'} />
                              </div>
                              <div className='flex flex-nowrap justify-center mb-3'>
                                <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                                <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                                <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                                <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                              </div>
                            </div>
                          })
                        }
                      </>
                    }
                    endMessage={
                      <>
                      {
                        profile[tabs[currentTab]].docs.length > 0 ? 
                        <p className='w-full text-center text-lg font-semibold my-12'>😒 No More Posts</p> : 
                        <p className='w-full text-center text-lg font-semibold my-12'>
                          😢 {profile.profile.fullName} has not posted anything yet.
                        </p>
                      }
                      </>
                    }
                  >
                    {user && user.username === username && <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg px-2 py-3 sm:px-3 my-2 md:mr-2 lg:mx-2'>
                      <div className='flex flex-nowrap justify-between'>
                        <Link to={`/user/${user.username}`}>
                          <img src={user.avatar.replace("upload/", "upload/w_40/")} alt='avatar'
                            className='rounded-full w-10 h-10' /></Link>
                        <Link to={'/create-blog-post'}
                          className='w-[calc(100%-80px)] sm:w-[calc(100%-40px)] text-start mx-2 sm:mr-0'>
                          <Button
                            className='h-10 px-3 py-1 rounded-full w-full bg-gray-200 hover:bg-gray-200 dark:bg-gray-700 text-start text-gray-500'>
                            Write a blog here...
                          </Button>
                        </Link>
                        <Link to={'/create-photo-post'}
                          className='sm:hidden bg-gray-200 dark:bg-gray-700 p-2 rounded-full'>
                          <Image size={24} />
                        </Link>
                      </div>
                      <div className='hidden sm:block my-4 border-t dark:border-white'>

                      </div>
                      <div className='hidden sm:flex sm:flex-nowrap sm:justify-center'>
                        <Link className='crpnavBtn' to={'/create-photo-post'} >
                          <Image size={24} className='text-green-600 font-bold' /> <span className='pl-2 text-[14px]'>Photo</span>
                        </Link>
                        <Link className='crpnavBtn' to={'/create-video-post'}>
                          <Video size={24} className='text-red-600 font-bold' /> <span className='pl-2 text-[14px]'>Video</span>
                        </Link>
                        <Link className='crpnavBtn' to={'/create-blog-post'}>
                          <BookOpen size={24} className='text-blue-600 font-bold' /> <span className='pl-2 text-[14px]'>Article</span>
                        </Link>
                      </div>
                    </div>}
                    {
                      profile[tabs[currentTab]].docs.map((post, index) => {
                        return <PostCard
                          key={post._id}
                          post={{
                            ...post,
                            author: {
                              fullName: profile.profile.fullName,
                              _id: profile.profile._id,
                              username: profile.profile.username,
                              avatar: profile.profile.avatar,
                              followersCount: profile.profile.followersCount,
                              isFollowedByMe: profile.profile.isFollowedByMe,
                            }
                          }}
                          updatePosts={updatePosts}
                          isInView={currentVideoIndex === index}
                          onInView={() => handleInView(index)} />
                      })
                    }
                  </InfiniteScroll> :
                    <>
                      {
                        [1, 2, 3, 4, 5, 6].map((i) => {
                          return <div key={i}><div className="flex items-center space-x-4 pl-4 my-3 overflow-auto">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[150px] sm:w-[200px]" />
                              <Skeleton className="h-4 w-[100px] sm:w-[150px]" />
                            </div>
                          </div>
                            <div>
                              <Skeleton className={'w-full h-96'} />
                            </div>
                            <div className='flex flex-nowrap justify-center mb-3'>
                              <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                              <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                              <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                              <Skeleton className={'w-20 rounded-full h-8 mx-1 my-2 '} />
                            </div>
                          </div>
                        })
                      }
                    </>
                  }
                </div>

              </div>


              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className='hidden' variant="outline" ref={coverOpenRef}>Show Dialog</Button>
                </AlertDialogTrigger>
                <CorpEditor
                  aspect={6 / 1}
                  imgSrc={coverImage}
                  circularCrop={false}
                  inh={40}
                  inw={240}
                  minHeight={40}
                  action={updateCover}
                  title='Change your Cover Photo'
                  actionTxt='Continue'
                />
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className='hidden' variant="outline" ref={avatarOpenRef}>Show Dialog</Button>
                </AlertDialogTrigger>
                <CorpEditor
                  aspect={1 / 1}
                  imgSrc={avatarImage}
                  circularCrop={true}
                  inh={100}
                  inw={100}
                  minHeight={100}
                  action={updateAvatar}
                  title='Change your profile Photo'
                  actionTxt='Continue'
                />
              </AlertDialog>
              <input type="file" name="avatar" id="avatar" ref={avatarInputRef}
                multiple={false} accept="image/*" className='hidden'
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setAvatarImage(URL.createObjectURL(e.target.files[0]))
                    avatarOpenRef.current?.click();
                  }
                }}
              />
              <input type="file" name="cover" id="cover" ref={coverInputRef}
                multiple={false} accept="image/*" className='hidden'
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setCoverImage(URL.createObjectURL(e.target.files[0]))
                    coverOpenRef.current?.click();
                  }
                }}
              />
            </div> :
            <div className='w-full h-[calc(100vh-56px)] overflow-y-auto'>
              <div className='w-full relative'>
                  <Skeleton className='w-full aspect-[4/1] md:aspect-[5/1] xl:aspect-[6/1] block'/>
                  <Skeleton className='aspect-[1/1] rounded-full absolute w-[25vw] md:w-[20vw] lg:w-[15vw] lg:top-[7vw] xl:top-[5vw] z-20 top-[10vw] left-4 sm:left-6 lg:left-8 xl:left-10'/>
              
                  <div className='flex flex-nowrap justify-end float-right'>
                      <Skeleton className='w-20 h-6 mx-1 my-4 rounded-lg'/>
                      <Skeleton className='w-20 h-6 mx-1 my-4 rounded-lg'/>
                      <Skeleton className='w-20 h-6 mx-1 my-4 rounded-lg'/>
                  </div>
                  <div className='flex flex-col px-6 md:px-10 mt-[12vw] lg:mt-[10vw]'>

                    <Skeleton className='w-1/2 h-6 my-1'/>
                    <Skeleton className='w-1/3 h-4 mt-1 mb-5'/>
                    
                    <Skeleton className='w-1/3 h-4 my-1'/>
                    <Skeleton className='w-1/3 h-4 my-1'/>
                    <Skeleton className='w-1/3 h-4 my-1'/>
                    <Skeleton className='w-1/3 h-4 my-1'/>
                    <Skeleton className='w-1/3 h-4 my-1'/>
                      
                  </div>
              </div>
            </div>
        }
      </div>
    </div>
  )
}

