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

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />} errorElement={<Error />} >
    <Route
    element={<AppWrapper/>}
    >
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


