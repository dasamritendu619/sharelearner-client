import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    viewedPosts: [],
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
        }
    },
})

export const { viewPost, updateViewedPost } = postSlice.actions;

export default postSlice.reducer;