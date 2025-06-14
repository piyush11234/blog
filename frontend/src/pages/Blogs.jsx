import BlogCard from '@/components/BlogCard';
import { setBlog } from '@/redux/blogSlice';
import store from '@/redux/store';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function Blogs() {
  const dispatch = useDispatch();
  const { blog } = useSelector(store => store.blog);
  useEffect(() => {
    const getAllPublishedBlog = async () => {
      try {
        const res = await axios.get(`https://blog-dqxu.onrender.com/api/blog/get-published-blogs`, { withCredentials: true })
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs))
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllPublishedBlog();
  }, []);

  return (
    <div className='p-16'>
      <div className='max-w-8xl mx-auto text-center flex flex-col space-y-4 items-center'>
        <h1 className='text-4xl font-bold text-center pt-10 '>Our Blogs</h1>
        <hr className=' w-24 text-center border-2 border-red-500 rounded-full' />
      </div>

      <div className='max-w-6xl mx-auto grid gap-10 grid-cols-1 md:grid-cols-3 py-10  md:px-0'>
        {
          blog?.map((blog, index) => {
            return <BlogCard blog={blog} key={index} />
          })
        }
      </div>
    </div>
  )
}
