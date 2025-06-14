import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import store from '@/redux/store'
import { toast } from 'sonner'

const BlogCardList = ({ blog }) => {
  const navigate = useNavigate()
  const date = new Date(blog?.createdAt)
  const formattedDate = date.toLocaleDateString("en-GB")
  const {user}=useSelector(store=>store.auth);

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
    <div className="bg-white dark:bg-gray-700 dark:border-gray-600 flex flex-col md:flex-row md:gap-10 p-5 rounded-2xl mt-6 shadow-lg border transition-all">
      <div>
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className='rounded-lg md:w-[300px] hover:scale-105 transition-all'
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mt-3 md:mt-1">{blog.title}</h2>
        <h3 className='text-gray-500 mt-1'>{blog.subtitle}</h3>
        <Button
          onClick={handleReadMore}
          className="mt-4 px-4 py-2 rounded-lg text-sm"
        >
          Read More
        </Button>
      </div>
    </div>
  )
}

export default BlogCardList
