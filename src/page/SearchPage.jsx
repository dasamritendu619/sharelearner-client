import React from 'react'
import { Search } from 'lucide-react'
import { SearchItem } from '@/components/post/SearchSuggestions'
import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button';

import { searchServices } from '@/apiServices/searchServices'
import PostCard from '@/components/post/PostCard'
import ProfileCard2 from '@/components/ProfileCard2'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function SearchPage() {
  const { register, handleSubmit, watch, setValue } = useForm();
  const searchParams = new URLSearchParams(window.location.search);
  const [suggestions, setSuggestions] = useState(localStorage.getItem('recentSearches') ? JSON.parse(localStorage.getItem('recentSearches')) : [])
  const navigate = useNavigate()
  const [postData, setPostData] = useState({ docs: [], page: 1, nextPage: null })
  const [ProfilesData, setProfilesData] = useState({ docs: [], page: 1, nextPage: null })
  const { toast } = useToast()
  const search = watch('search', searchParams.get('query') ? searchParams.get('query') : '')
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [profilesLoading, setProfilesLoading] = useState(false)
  const [postsLoading, setPostsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)

  const handleInView = (index) => {
    setCurrentVideoIndex(index);
  };

  const handleOutsideClick = (event) => {
    if (showSuggestions && !event.target.closest('.menu-container')) {
      setShowSuggestions(false);
    }
  };

  const updateProfilesData = (profiles)=> {
    setProfilesData({
      ...ProfilesData,
      docs: profiles
    })
  }

  const onSubmit = (data) => {
    const serachFor = searchParams.get('searchFor')
    setShowSuggestions(false)
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || []
    const filtered = recentSearches.filter(item => item.query !== data.search.trim())
    if (filtered.length >= 10) {
      filtered.pop()
    }
    filtered.unshift({ query: data.search.trim() })
    localStorage.setItem('recentSearches', JSON.stringify(filtered))
    navigate(`/search?query=${data.search.trim().replaceAll(" ", "+")}&searchFor=${serachFor ? serachFor : ''}`);
  }

  const onSuggestionsClick = (suggestion) => {
    const serachFor = searchParams.get('searchFor')
    setValue('search', suggestion)
    setShowSuggestions(false)
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || []
    const filtered = recentSearches.filter(item => item.query !== suggestion)
    if (filtered.length >= 10) {
      filtered.pop()
    }
    filtered.unshift({ query: suggestion })
    localStorage.setItem('recentSearches', JSON.stringify(filtered))
    navigate(`/search?query=${suggestion.trim().replaceAll(" ", "+")}&searchFor=${serachFor ? serachFor : ''}`);
  }


  const getProfiles = async (page) => {
    const limit = 20;
    const response = await searchServices.searchUsers({
      query: search.trim().replaceAll(" ", "+"),
      page: page,
      limit: limit
    })
    // console.log(response)
    if (response.status < 400 && response.data) {
      if (page === 1) {
        setProfilesData({
          docs: response.data.docs,
          page: response.data.page,
          nextPage: response.data.nextPage,
        })
        setProfilesLoading(false)
      } else {
        setProfilesData({
          docs: [...ProfilesData.docs, ...response.data.docs],
          page: response.data.page,
          nextPage: response.data.nextPage,
        })
      }
    } else {
      toast({
        title: "Failed to get Profiles",
        description: response.message,
        variant: "destructive",
      })
    }
  }

  const getPosts = async (page) => {
    const limit = 20;
    const response = await searchServices.searchPosts({
      query: search.trim().replaceAll(" ", "+"),
      page: page,
      limit: limit
    })
    // console.log(response)
    if (response.status < 400 && response.data) {
      if (page === 1) {
        setPostData({
          docs: response.data.docs,
          page: response.data.page,
          nextPage: response.data.nextPage,
        })
        setPostsLoading(false)
      } else {
        setPostData({
          docs: [...postData.docs, ...response.data.docs],
          page: response.data.page,
          nextPage: response.data.nextPage,
        })
      }
    } else {
      toast({
        title: "Failed to get Posts",
        description: response.message,
        variant: "destructive",
      })
    }
  }

  const getSuggestions = async () => {
    const res = await searchServices.getSearchSuggestions({ query: search.trim().replaceAll(" ", "+") })
    if (res.status < 400 && res.data) {
      if (res.data.length > 0) {
        setSuggestions(res.data)
      }
    }
  }

  const updatePosts = useCallback((post) => {
    const updatedPosts = postData.docs.map(p => {
      if (p._id === post._id) {
        return post
      }
      return p
    })
    setPostData({
      docs: updatedPosts,
      page: postData.page,
      nextPage: postData.nextPage,
    })
  }, [postData])

  useEffect(() => {
    if (search.length > 0) {
      if (searchParams.get('searchFor') === 'posts' || !searchParams.get('searchFor')) {
        //console.log("post")
        setPostsLoading(true)
        getPosts(1)
      } else if (searchParams.get('searchFor') === 'profiles') {
        //console.log("profiles")
        setProfilesLoading(true)
        getProfiles(1)
      }
    }
  }, [searchParams.get('searchFor'), searchParams.get('query')])

  useEffect(() => {
    if (search.length > 0) {
      const timeOut = setTimeout(() => {
        getSuggestions()
      }, 300);
      return () => clearTimeout(timeOut);
    }
  }, [search])

  // Adding event listener for clicks outside menu
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showSuggestions]);

  return (
    <div className='w-screen h-screen overflow-y-auto fixed top-0 left-0 bg-blue-100 dark:bg-gray-950'>
      <form onSubmit={handleSubmit(onSubmit)}
        className='flex items-center border mb-1 mt-2 rounded-full px-3 w-[90%] max-w-[500px] mx-auto bg-white dark:bg-gray-800 menu-container'>
        <Search size={18} className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input type="search"
          required
          autoFocus
          onFocus={() => setShowSuggestions(true)}
          defaultValue={search}
          placeholder='Search for anything...'
          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          {...register('search', { required: true })}
        />
      </form>

      {suggestions.length > 0 && showSuggestions && 
        <div className='w-screen fixed top-14 left-0 z-50'>
          <div className='w-[90%] max-w-[500px] mx-auto rounded-lg bg-white dark:bg-gray-900 menu-container'>
            {
              suggestions.map((suggestion, index) => {
                return <SearchItem
                  key={index}
                  itemText={suggestion.query}
                  searchText={search}
                  onClick={() => onSuggestionsClick(suggestion.query)}
                />
              })
            }
          </div>
        </div>}

      <div className=' w-screen fixed top-14 left-0 z-10'>

        {
          searchParams.get('searchFor') === 'posts' || !searchParams.get('searchFor') ?
            <div className='w-full md:w-[60%] lg:w-[50%] mx-auto'>
              {!postsLoading ? <InfiniteScroll
                scrollableTarget='scrollableDiv'
                dataLength={postData.docs.length}
                next={() => getPosts(postData.page + 1)}
                height={window.innerHeight - 58}
                hasMore={postData.nextPage ? true : false}
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
                  
                    postData.docs.length === 0 ? <p className='w-full text-center font-bold my-12 text-lg'>🥺 No Post Found</p> :
                    <p className='w-full text-center font-bold my-12 text-lg'>Yay! You have seen it all</p>
                }
              >
                <div className='w-full flex flex-nowrap justify-center'>
                  <Button className={`h-7 mx-2 ${searchParams.get('searchFor') === 'posts' || !searchParams.get('searchFor') ? 
                  'bg-blue-500 hover:bg-blue-600 text-white' : 
                  'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'}`} 
                  onClick={() => navigate(`/search?query=${search.trim().replaceAll(" ", "+")}&searchFor=posts`)} >
                  
                    Posts
                  </Button>
                  <Button className={`h-7 mx-2 ${searchParams.get('searchFor') === 'profiles' ? 
                  'bg-blue-500 hover:bg-blue-600 text-white' : 
                  'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'}`}
                    onClick={() => navigate(`/search?query=${search.trim().replaceAll(" ", "+")}&searchFor=profiles`)} >
                    Profiles
                  </Button>
                </div>
                {
                  postData.docs.map((post, index) => {
                    return <PostCard
                      key={post._id}
                      post={post}
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

            </div> : <div className='profailsContainer'>
            <div className='w-full flex flex-nowrap justify-center'>
                  <Button className={`h-7 mx-2 ${searchParams.get('searchFor') === 'posts' || !searchParams.get('searchFor') ? 
                  'bg-blue-500 hover:bg-blue-600 text-white' : 
                  'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'}`} 
                  onClick={() => navigate(`/search?query=${search.trim().replaceAll(" ", "+")}&searchFor=posts`)} >
                  
                    Posts
                  </Button>
                  <Button className={`h-7 mx-2 ${searchParams.get('searchFor') === 'profiles' ? 
                  'bg-blue-500 hover:bg-blue-600 text-white' : 
                  'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'}`}
                    onClick={() => navigate(`/search?query=${search.trim().replaceAll(" ", "+")}&searchFor=profiles`)} >
                    Profiles
                  </Button>
                </div>
          {
            profilesLoading ? <div className='flex flex-wrap justify-center'>
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
                  ProfilesData.docs.map((profile) => {
                    return <ProfileCard2
                      profile={profile}
                      key={profile._id}
                      setProfiles={updateProfilesData}
                      profiles={ProfilesData.docs} />
                  })
                }
              </div>
              {
                ProfilesData.nextPage &&
                <Button className="block mx-auto my-4"
                  onClick={() => {
                    getProfiles(ProfilesData.page + 1)
                  }} >
                  See more
                </Button>
              }
              {
                ProfilesData.docs.length === 0 &&
                <div className='w-full text-center font-bold my-12 text-lg'>
                  🥺 No Profiles Found
                </div>
              }

            </div>
          }
        </div>
        }

      </div>

    </div>
  )
}