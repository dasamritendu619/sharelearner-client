import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import postSlice from "./postSlice";

export default configureStore({
    reducer:{
        auth:authSlice,
        post:postSlice,
    }
});