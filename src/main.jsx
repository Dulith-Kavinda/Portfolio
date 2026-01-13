import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import React, { Suspense } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

import Loader from './loader.jsx'

import App from './App.jsx'
import Home, { loader as HomeLoader } from './Components/home.jsx'
import Feedback from './Components/feedback.jsx'
import Posts, { loader as PostLoader } from './Components/posts.jsx'
import AppWrapper from './AppWrapper'
import Error from './erorr.jsx'
import NotFound from './notFound.jsx'

// Admin imports
import AdminLayout from './Admin/AdminLayout.jsx'
import AdminLogin from './Admin/AdminLogin.jsx'
import AdminDashboard, { loader as AdminDashboardLoader } from './Admin/AdminDashboard.jsx'
import AdminPosts, { loader as AdminPostsLoader } from './Admin/AdminPosts.jsx'
import AdminHomeData, { loader as AdminHomeDataLoader } from './Admin/AdminHomeData.jsx'
import AdminFeedback, { loader as AdminFeedbackLoader } from './Admin/AdminFeedback.jsx'
import AdminClients, { loader as AdminClientsLoader } from './Admin/AdminClients.jsx'
import AdminAnalytics, { loader as AdminAnalyticsLoader } from './Admin/AdminAnalytics.jsx'

const router = createBrowserRouter(createRoutesFromElements(
  <>
    {/* Public Routes */}
    <Route path='/' element={<App />} errorElement={<Error />} >
      <Route element={<AppWrapper/>} >
        <Route
          index
          element={<Home/>}
          loader={HomeLoader}
          errorElement={<Error />}
        />
        <Route
          path='feedback'
          element={<Feedback/>}
          errorElement={<Error />}
        />
        <Route
          path='posts'
          element={<Posts/>}
          loader={PostLoader}
          errorElement={<Error />}
        />
      </Route>
      <Route
        path='*'
        element={<NotFound/>}
      />
    </Route>

    {/* Admin Routes */}
    <Route path='/admin/login' element={<AdminLogin />} errorElement={<Error />} />
    <Route path='/admin' element={<AdminLayout />} errorElement={<Error />}>
      <Route
        index
        element={<AdminDashboard />}
        loader={AdminDashboardLoader}
        errorElement={<Error />}
      />
      <Route
        path='posts'
        element={<AdminPosts />}
        loader={AdminPostsLoader}
        errorElement={<Error />}
      />
      <Route
        path='home-data'
        element={<AdminHomeData />}
        loader={AdminHomeDataLoader}
        errorElement={<Error />}
      />
      <Route
        path='feedback'
        element={<AdminFeedback />}
        loader={AdminFeedbackLoader}
        errorElement={<Error />}
      />
      <Route
        path='clients'
        element={<AdminClients />}
        loader={AdminClientsLoader}
        errorElement={<Error />}
      />
      <Route
        path='analytics'
        element={<AdminAnalytics />}
        loader={AdminAnalyticsLoader}
        errorElement={<Error />}
      />
    </Route>
  </>
));


function Index() {
  return (
    <RouterProvider router={router} />
  )
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Index />
  </StrictMode>,
)


