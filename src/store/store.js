// import { configureStore } from "@reduxjs/toolkit";
// import authSlice from "./authSlice";
// import postSlice from "./postSlice";
// import userSlice  from './userSlice.js';
// import messageSlice from './messageSlice.js';
// import socketSlice from './socketSlice.js'


// export default configureStore({
//     reducer:{
//         auth:authSlice,
//         post:postSlice,
//         user: userSlice,
//         message:messageSlice,
//         socket:socketSlice
//     }
// });

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import postSlice from "./postSlice";
import userSlice  from './userSlice.js';
import messageSlice from './messageSlice.js';
import socketSlice from './socketSlice.js'
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
    auth:authSlice,
    post:postSlice,
    user: userSlice,
    message:messageSlice,
    socket:socketSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
