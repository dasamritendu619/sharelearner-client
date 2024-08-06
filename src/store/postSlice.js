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
    },
})

export const { 
    viewPost, 
    updateViewedPost,
    updateBlogPosts,
    updateVideoPosts,
    updateHpmePosts,
    updateSavedPosts,
 } = postSlice.actions;

export default postSlice.reducer;