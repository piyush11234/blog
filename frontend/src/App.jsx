import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import About from './pages/About'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import YourBlog from './pages/YourBlog'
import Comments from './pages/Comments'
import WriteBlog from './pages/WriteBlog'
import UpdateBlog from './pages/UpdateBlog'
import BlogView from './pages/BlogView'
import Footer from './components/Footer'
import SearchList from './pages/SearchList'
import TermsAndConditions from './pages/TermAndCondition'


const router = createBrowserRouter([
  {
    path: '/',
    element: <><Navbar/><Home /><Footer/></>,
  },
  {
    path: '/blogs',
    element: <><Navbar/><Blogs /><Footer/></>,
  },
  {
    path: '/about',
    element: <><Navbar/><About /><Footer/></>,
  },
  {
    path: '/terms-and-conditions',
    element: <><Navbar/><TermsAndConditions /><Footer/></>,
  },
  {
    path: '/search',
    element: <><Navbar/><SearchList /><Footer/></>,
  },
  {
    path: '/signup',
    element: <><Navbar/><Signup /><Footer/></>,
  },
  {
    path: '/login',
    element: <><Navbar/><Login /><Footer/></>,
  },
  {
    path: '/blogs/:blogId',
    element: <><Navbar/><BlogView /><Footer/></>,
  },
  {
    path: '/dashboard',
    element: <><Navbar/><Dashboard/> </>,
    children:[
      {
        path:'profile',
        element:<Profile/>
      },
      {
        path:'your-blog',
        element:<YourBlog/>
      },
      {
        path:'comments',
        element:<Comments/>
      },
      {
        path:'write-blog',
        element:<WriteBlog/>
      },
      {
        path:'write-blog/:blogId',
        element:<UpdateBlog/> 
      }

    ]
  }

])

function App() {
  return (
    <>
      <RouterProvider router={router} />

    </>
  )
}

export default App
