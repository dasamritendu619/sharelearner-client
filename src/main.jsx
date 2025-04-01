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
  AboutUs,
  SupportPage,
  TermsPage,
  FeedbackPage,
  ProfilePage,
  Chat,
  SearchPage,
  ProfilesPage,
  BlogsPage,
  VideosPage,
  SavedPosts,
} from './index.js'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist';
import { SocketProvider } from './context/SocketContext.jsx';

let persistor = persistStore(store);

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />} >

      <Route path="" element={<Home />} />

      <Route path="support" element={<SupportPage />} />

      <Route path="terms" element={<TermsPage />} />

      <Route path='about-us' element={<AboutUs />} />

      <Route path="feedback" element={<FeedbackPage />} />

      <Route path="user/:username" element={<ProfilePage />} />

      <Route path="search" element={<SearchPage />} />

      <Route path="blogs" element={<BlogsPage />} />

      <Route path="videos" element={<VideosPage />} />

      <Route path="profiles" element={
        <AuthLayout authentication={true}>
          <ProfilesPage />
        </AuthLayout>
      } />

      <Route path="chat" element={
        <AuthLayout authentication={true}>
          <Chat />
        </AuthLayout>
      } />

      <Route path="saved-posts" element={
        <AuthLayout authentication={true}>
          <SavedPosts />
        </AuthLayout>
      } />

      <Route path="login" element={
        <AuthLayout authentication={false}>
          <Login />
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
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <RouterProvider router={routes} />
        </SocketProvider>
      </PersistGate>
    </Provider>
  </>,
)