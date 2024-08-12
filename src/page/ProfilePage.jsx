import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { authService } from '@/apiServices/authServices'
import { postService } from '@/apiServices/postServices'
import { useSelector, useDispatch } from 'react-redux'
import { useToast } from '@/components/ui/use-toast'
import { viewProfile, updateViewedProfiles } from '@/store/postSlice'
import SightNav from '@/components/SightNav'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye } from 'lucide-react'

// profile Tabs :- Posts, Photos, Videos, blogs, Shared, Private, PDF

export default function ProfilePage() {
  const { username } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
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
    Photos: 'photo',
    videos: 'video',
    blogs: 'blog',
    Shared: 'forked',
    Private: 'private',
    PDF: 'pdf',
  }
  const coverCloseRef = useRef(null);
  const avatarCloseRef = useRef(null);

  // console.log(profile)
  // console.log(viewedProfiles)

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
          if (currentTab === 'posts') {
            await getPosts(1, 'all', foundedProfile);
          } else if (currentTab === 'Photos') {
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
        if (profileViewed[tabs[currentTab]].length === 0) {
          await getPosts(1, tabs[currentTab], profileViewed);
        } else {
          setProfile(profileViewed);
        }
      }
    })()

  }, [username, currentTab])

  return (
    <div className='w-screen fixed top-14 left-0 bg-blue-100 dark:bg-gray-950 flex flex-nowrap justify-center'>
      <div className='hidden lg:block lg:w-[250px]'>
        <SightNav />
      </div>
      <div className='w-full lg:w-[calc(100%-250px)] bg-gray-400'>
        {
          profile ?
            <div className='w-full'>
              {user.username === username ? <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <img src={profile.profile.coverPhoto} alt="photo" className='w-full aspect-[4/1] md:aspect-[5/1] xl:aspect-[6/1] block' />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Your Cover Photo</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Button>
                      ff
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
                        <img src={profile.profile.coverPhoto} alt="photo" className='w-full h-auto max-h-[70vh]' />
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
                    <button>
                      <img src={profile.profile.coverPhoto} alt="photo" className='w-full aspect-[4/1] md:aspect-[5/1] xl:aspect-[6/1] block' />
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
            </div> :
            <div>

            </div>
        }
      </div>
    </div>
  )
}

