import React from 'react'
import { FaUserCircle } from "react-icons/fa";
import { FaChevronRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
// import UserLogo from "../assets/user.jpg"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import store from '@/redux/store';

const ResponsiveMenu = ({ openNav, setOpenNav, logoutHandler }) => {
    const { user } = useSelector(store => store.auth)

    return (
        <div className={`${openNav ? "left-0" : "-left-[100%]"} fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white dark:bg-gray-800 px-8 pb-6 pt-16 text-black dark:text-gray-100 md:hidden rounded-r-xl shadow-md transition-all`}>
            <div>
                <div className='flex items-center justify-start gap-3'>
                    {user ? (
                        <Link to="/dashboard/profile">
                            <Avatar className="w-14 h-14">
                                <AvatarImage src={user.profilePicture} />
                                <AvatarFallback>{user.email?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                            </Avatar>
                        </Link>
                    ) : (
                        <FaUserCircle size={50} />
                    )}



                    <div>
                        <h1 className=''>Hello, {user?.fname || "User"}</h1>
                        <h1 className='text-sm text-slate-500'>Premium User</h1>
                    </div>
                </div>
                <nav className='mt-12'>
                    <ul className='flex flex-col gap-7 text-2xl font-semibold '>
                        <Link to="/" onClick={() => setOpenNav(false)}><li className='cursor-pointer'>Home</li></Link>
                        <Link to="/blogs" onClick={() => setOpenNav(false)}><li className='cursor-pointer'>Blog</li></Link>
                        <Link to="/about" onClick={() => setOpenNav(false)}><li className='cursor-pointer' >About</li></Link>
                        {
                            user ? <Button onClick={() => { logoutHandler(), setOpenNav(false) }}>Logout</Button> : <Link to={'/signup'} onClick={() => setOpenNav(false)}><Button>Signup</Button></Link>
                        }

                    </ul>
                </nav>
            </div>
            <div className='pb-20'>
                <h1>
                    Created by piyush
                </h1>
            </div>
        </div>
    )
}

export default ResponsiveMenu