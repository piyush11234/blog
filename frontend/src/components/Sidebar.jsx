import React from 'react'
import { NavLink } from 'react-router-dom'
import { SquareUser, ChartColumnBig } from 'lucide-react'
import { FaRegEdit } from 'react-icons/fa'
import { LiaCommentSolid } from 'react-icons/lia'

export default function Sidebar() {
    const linkStyle = ({ isActive }) =>
        `text-2xl flex items-center font-bold cursor-pointer gap-2 w-full rounded-2xl p-3 transition duration-200 ease-in-out
    ${isActive
            ? "bg-gray-800 dark:bg-gray-900 text-gray-200"
            : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
        }`

    return (
        <div className="hidden mt-10 fixed md:block border-r-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 w-[300px] h-screen p-10 space-y-2 z-10">
            <div className="pt-10 space-y-2 px-3 text-center">

                <NavLink to="/dashboard/profile" className={linkStyle}>
                    <SquareUser />
                    <span>Profile</span>
                </NavLink>

                <NavLink to="/dashboard/your-blog" className={linkStyle}>
                    <ChartColumnBig />
                    <span>Your Blogs</span>
                </NavLink>

                <NavLink to="/dashboard/comments" className={linkStyle}>
                    <LiaCommentSolid />
                    <span>Comments</span>
                </NavLink>

                <NavLink to="/dashboard/write-blog" className={linkStyle}>
                    <FaRegEdit />
                    <span>Create Blog</span>
                </NavLink>

            </div>
        </div>
    )
}
