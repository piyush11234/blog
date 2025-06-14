import React, { useContext } from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import store from '@/redux/store'
import { toast } from 'sonner'
// If using Context:
// import { AuthContext } from '../context/AuthContext'

const BlogCard = ({ blog }) => {
  const navigate = useNavigate()

  // Uncomment this if you're using context instead of passing `user` as prop
  // const { user } = useContext(AuthContext)

  const date = new Date(blog?.createdAt)
  const formattedDate = date.toLocaleDateString("en-GB")
  const {user}=useSelector(store=>store.auth)

  const handleReadMore = () => {
    if (!user) {
        toast.error('Please login first')
      navigate('/login')
    } else {
      navigate(`/blogs/${blog._id}`)
    }
  }

  if (!blog?._id) return null

  return (
    <div className="bg-white dark:bg-gray-800 dark:border-gray-600 p-5 rounded-2xl shadow-lg border hover:scale-105 transition-all">
      <img src={blog.thumbnail} alt={blog.title} className='rounded-lg' />
      <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
        By <i>{blog?.author?.fname || "Unknown"}</i> | {blog.category} | {formattedDate}
      </p>
      <h2 className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{blog.title}</h2>
      <h3 className='text-gray-500 dark:text-gray-400 mt-1'>{blog.subtitle}</h3>

      <Button
        onClick={handleReadMore}
        className="mt-4 px-4 py-2 rounded-lg text-sm cursor-pointer"
      >
        Read More
      </Button>
    </div>
  )
}

export default BlogCard
