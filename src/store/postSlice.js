import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    viewedPosts: [],
    homePosts: {
        posts:[],
        page: 1,
        nextPage: null,
    },
    videoPosts: {
        posts:[],
        page: 1,
        nextPage: null,
    },
    blogPosts: {
        posts:[],
        page: 1,
        nextPage: null,
    },
    savedPosts: {
        posts:[],
        page: 1,
        nextPage: null,
    },
}

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        viewPost: (state, action) => {
            state.viewedPosts.push(action.payload)
        },
        updateViewedPost: (state, action) => {
            const index = state.viewedPosts.findIndex(post => post._id === action.payload._id)
            state.viewedPosts[index] = action.payload
        },
        updateHpmePosts: (state, action) => {
            state.homePosts = action.payload
        },
        updateVideoPosts: (state, action) => {
            state.videoPosts = action.payload
        },
        updateBlogPosts: (state, action) => {
            state.blogPosts = action.payload
        },
        updateSavedPosts: (state, action) => {
            state.savedPosts = action.payload
        },
        deleteAPost: (state, action) => {
            state.viewedPosts = state.viewedPosts.filter(post => post._id !== action.payload)
        },
        revalidateByKey: (state, action) => {
            const key = action.payload;
            if(key === 'all'){
                state.homePosts = {
                    posts:[],
                    page: 1,
                    nextPage: null,
                }
                state.videoPosts = {
                    posts:[],
                    page: 1,
                    nextPage: null,
                }
                state.blogPosts = {
                    posts:[],
                    page: 1,
                    nextPage: null,
                }
                state.savedPosts = {
                    posts:[],
                    page: 1,
                    nextPage: null,
                }
                state.viewedPosts = []
            } else if(key === 'homePosts'){
                state.homePosts = {
                    posts:[],
                    page: 1,
                    nextPage: null,
                }
            } else if(key === 'videoPosts'){
                state.videoPosts = {
                    posts:[],
                    page: 1,
                    nextPage: null,
                }
            } else if(key === 'blogPosts'){
                state.blogPosts = {
                    posts:[],
                    page: 1,
                    nextPage: null,
                }
            } else if(key === 'savedPosts'){
                state.savedPosts = {
                    posts:[],
                    page: 1,
                    nextPage: null,
                }
            } else if(key === 'viewedPosts'){
                state.viewedPosts = []
            }
        }
    },
})

export const { 
    viewPost, 
    updateViewedPost,
    updateBlogPosts,
    updateVideoPosts,
    updateHpmePosts,
    updateSavedPosts,
    deleteAPost,
    revalidateByKey,
 } = postSlice.actions;

export default postSlice.reducer;