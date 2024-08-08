import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  status: false,
  user: null,
  followers:{
    docs:[],
    page:1,
    nextPage:null,
  },
  followings:{
    docs:[],
    page:1,
    nextPage:null,
  },
  suggestedUsers:{
    docs:[],
    page:1,
    nextPage:null,
  },
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      login: (state,action)=>{
        state.status=true;
        state.user=action.payload;
      },
      logout: (state)=>{
        state.status=false;
        state.user=null;
      },
      setFollowers: (state,action)=>{
        state.followers=action.payload;
      },
      setFollowings: (state,action)=>{
        state.followings=action.payload;
      },
      setSuggestedUsers: (state,action)=>{
        state.suggestedUsers=action.payload;
      },
      reValidateByKey: (state,action)=>{
        if (action.payload === 'all') {
          state.followers={docs:[],page:1,nextPage:null};
          state.followings={docs:[],page:1,nextPage:null};
          state.suggestedUsers={docs:[],page:1,nextPage:null};
        } else if(action.payload === 'followers'){
          state.followers={docs:[],page:1,nextPage:null};
        } else if(action.payload === 'followings'){
          state.followings={docs:[],page:1,nextPage:null};
        } else if(action.payload === 'suggestedUsers'){
          state.suggestedUsers={docs:[],page:1,nextPage:null};
        }
      },
    },
  })

  export const { login ,logout, setFollowers, setFollowings, setSuggestedUsers, reValidateByKey } = authSlice.actions;

  export default authSlice.reducer;