import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

// UI components
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Moon, Sun, Search, User, ChartColumnBig, LogOut } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi"

// Dropdown menu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

// Icons
import { LiaCommentSolid } from "react-icons/lia"
import { FaRegEdit } from "react-icons/fa"

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '@/redux/themeSlice'
import { setUser } from '@/redux/authSlice'

// Axios and toast
import axios from 'axios'
import { toast } from 'sonner'

// Responsive mobile menu
import ResponsiveMenu from './ResponsiveMenu'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(store => store.auth)
  const { theme } = useSelector(store => store.theme)

  const [searchTerm, setSearchTerm] = useState('')
  const [openNav, setOpenNav] = useState(false)

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      setSearchTerm('')
    }
  }

  // Logout function
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/user/logout`)
      if (res.data.success) {
        dispatch(setUser(null))
        navigate("/")
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed.")
    }
  }

  // Toggle responsive navbar on mobile
  const toggleNav = () => {
    setOpenNav(!openNav)
  }

  return (
    <div className='py-2 fixed w-full z-50 border-2 border-b-gray-300 dark:border-b-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'>
      <div className='max-w-7xl mx-auto px-4  md:px-0 lg:px-8 flex justify-between items-center'>

        {/* Logo and search */}
        <div className='flex gap-7 items-center'>
          <Link to='/'>
            <div className='flex gap-2 items-center'>
              <img src={logo} alt="Logo" className='w-7 h-7 md:w-10 md:h-10 dark:invert' />
              <h2 className='font-bold text-xl md:text-3xl'>ThinkStack</h2>
            </div>
          </Link>

          {/* Desktop search bar */}
          <div className='relative hidden md:block'>
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px] pl-10 pr-4 py-2 bg-gray-300 dark:bg-gray-900 dark:text-white text-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleSearch} className="absolute right-0 top-0 cursor-pointer">
              <Search />
            </Button>
          </div>
        </div>

        {/* Main navigation & user actions */}
        <nav className='flex md:gap-7 gap-4 items-center'>
          <ul className='hidden md:flex gap-7 items-center text-xl font-semibold'>
            <Link to='/'><li>Home</li></Link>
            <Link to='/about'><li>About</li></Link>
            <Link to='/blogs'><li>Blogs</li></Link>
          </ul>

          <div className='flex items-center gap-2'>
            {/* Theme toggle */}
            <Button
              onClick={() => dispatch(toggleTheme())}
              className=' w-8 h-8 p-2 rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-800 hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors'
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? <Moon /> : <Sun />}
            </Button>

            {/* If logged in, show user avatar and dropdown */}
            {user ? (
              <div className=' md:flex gap-2 ml-2 items-center'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className='w-8 h-8 md:w-10 md:h-10 '>
                      <AvatarImage src={user?.profilePicture} />
                      <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56  dark:bg-gray-800" >
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuGroup>

                      <DropdownMenuItem onSelect={() => navigate('/dashboard/profile')}>
                        <User />
                        <span>Profile</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem onSelect={() => navigate('/dashboard/your-blog')}>
                        <ChartColumnBig />
                        <span>Your Blogs</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem onSelect={() => navigate('/dashboard/comments')}>
                        <LiaCommentSolid />
                        <span>Comments</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem onSelect={() => navigate('/dashboard/write-blog')}>
                        <FaRegEdit />
                        <span>Write Blogs</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logoutHandler}>
                      <LogOut /> Log out
                      {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button className="hidden md:block" onClick={logoutHandler}>Logout</Button>
              </div>
            ) : (
              <div className='hidden md:flex gap-2 ml-2'>
                <Button><Link to='/signup'>Signup</Link></Button>
                <Button><Link to='/login'>Login</Link></Button>
              </div>
            )}
          </div>

          {/* Mobile menu icon toggle */}
          {openNav ? (
            <HiMenuAlt3 onClick={toggleNav} className=' mr-2 w-7 h-7 md:hidden cursor-pointer' />
          ) : (
            <HiMenuAlt1 onClick={toggleNav} className=' mr-2 w-7 h-7 md:hidden cursor-pointer' />
          )}
        </nav>

        {/* Responsive nav menu (mobile only) */}
        <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} logoutHandler={logoutHandler} />
      </div>
    </div>
  )
}
