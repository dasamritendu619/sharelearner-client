import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './store/store.js'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import AuthLayout from './components/AuthLayout.jsx'
import {
  Home,
  Login,
  Signup,
  VeryfyUser,
  SentForgotPasswordEmail,
  ResetPassword,
  ErrorPage,
  UpdateUser,
  CreatePost,
  UpdatePost,
  PostPage,
  ForkPost,
} from './index.js'

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />} >

      <Route path="" element={<Home />} />

      <Route path="login" element={
        <AuthLayout authentication={false}>
          <Login />
        </AuthLayout>
      } />

      <Route path='fork-post/:postId' element={
        <AuthLayout authentication={true}>
          <ForkPost />
        </AuthLayout>
      } />

      <Route path="signup" element={
        <AuthLayout authentication={false}>
          <Signup />
        </AuthLayout>
      } />

      <Route path="verify-user" element={
        <AuthLayout authentication={false}>
          <VeryfyUser />
        </AuthLayout>
      } />
      
      <Route path="sent-forgot-password-email" element={
        <AuthLayout authentication={false}>
          <SentForgotPasswordEmail />
        </AuthLayout>
      } />
      

      <Route path="reset-password" element={
        <AuthLayout authentication={false}>
          <ResetPassword />
        </AuthLayout>
      } />

      <Route path="update-user" element={
        <AuthLayout authentication={true}>
          <UpdateUser />
        </AuthLayout>
      } />

      <Route path="create-blog-post" element={
        <AuthLayout authentication={true}>
          <CreatePost type="blog" />
        </AuthLayout>
      } />

      <Route path="create-photo-post" element={
        <AuthLayout authentication={true}>
          <CreatePost type="photo" />
        </AuthLayout>
      } />

      <Route path="create-video-post" element={
        <AuthLayout authentication={true}>
          <CreatePost type="video" />
        </AuthLayout>
      } />

      <Route path="create-pdf-post" element={
        <AuthLayout authentication={true}>
          <CreatePost type="pdf" />
        </AuthLayout>
      } />

      <Route path="fork-post" element={
        <AuthLayout authentication={true}>
          <CreatePost type="forked" />
        </AuthLayout>
      } />

      <Route path="update-post/:postId" element={
        <AuthLayout authentication={true}>
          <UpdatePost />
        </AuthLayout>
      } />

      <Route path="post/:postId" element={<PostPage />} />
      
    </Route>,
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={routes} />
    </Provider>
  </React.StrictMode>,
)