import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './store/store.js'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import AuthLayout from './components/AuthLayout.jsx'
import {
  Login,
  Signup,
  VeryfyUser,
  SentForgotPasswordEmail,
  ResetPassword,
  ErrorPage,
  UpdateUser,
} from './index.js'

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />} >

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