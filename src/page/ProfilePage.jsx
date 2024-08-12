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
import CorpEditor from '@/components/CorpEditor'
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
import { Eye, Upload } from 'lucide-react'
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
  const coverOpenRef = useRef(null);
  const avatarCloseRef = useRef(null);
  const avatarOpenRef = useRef(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [avatarImage, setAvatarImage] = useState('');
  const [coverImage, setCoverImage] = useState('');

  // console.log(profile)
  // console.log(viewedProfiles)

  const updateAvatar = async (image) => {
    if (!image ) {
      toast({
        title: "Failed to upload Avatar",
        description: "Please select an image to upload",
        variant: "destructive",
      })
    }
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
    } else {
      toast({
        title: "Failed to upload Avatar",
        description: response.message,
        variant: "destructive",
      })
    }
  }

  const updateCover = async (image) => {
    if (!image ) {
      toast({
        title: "Failed to upload Cover Photo",
        description: "Please select an image to upload",
        variant: "destructive",
      })
    }
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
    } else {
      toast({
        title: "Failed to upload Cover Photo",
        description: response.message,
        variant: "destructive",
      })
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
      <div className='w-full lg:w-[calc(100%-250px)]'>
        {
          profile ?
            <div className='w-full'>
              <div className='w-full relative'>
              {user.username === username ? <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <img src={profile.profile.coverPhoto.replace("upload/", "upload/q_60/")} 
                    alt="photo" 
                    className='w-full aspect-[4/1] md:aspect-[5/1] xl:aspect-[6/1] block' />
                  </button>
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
                    <button>
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
                  <button>
                    <img 
                    src={profile.profile.avatar.replace("upload/", "upload/q_40/")} 
                    alt="photo" 
                    className='aspect-[1/1] rounded-full absolute w-[25vw] md:w-[20vw] lg:w-[15vw] lg:top-[7vw] xl:top-[5vw] z-20 top-[10vw] left-4 sm:left-6 lg:left-8 xl:left-10'
                     />
                  </button>
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
              
              </div>


              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className='hidden' variant="outline" ref={coverOpenRef}>Show Dialog</Button>
                </AlertDialogTrigger>
                  <CorpEditor 
                  aspect={6/1} 
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
                  aspect={1/1} 
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
            <div>

            </div>
        }
      </div>
    </div>
  )
}

