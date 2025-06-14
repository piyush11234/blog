import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogCard from './BlogCard';
import BlogCardList from './BlogCardList';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
import { setBlog } from '@/redux/blogSlice';
import axios from 'axios';

const tags = [
    {
        category: "Blogging"
    },
    {
        category: "Web Development"
    },
    {
        category: "Digital Marketing"
    },
    {
        category: "Cooking"
    },
    {
        category: "Photography"
    },
    {
        category: "Sports"
    },
]



const RecentBlog = () => {
    const { blog } = useSelector(store => store.blog)
    const [category, setCategory] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    console.log(blog);

    useEffect(() => {
        const getAllPublsihedBlogs = async () => {
            try {
                const res = await axios.get(`https://blog-dqxu.onrender.com/blog/get-published-blogs`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setBlog(res.data.blogs))
                }
            } catch (error) {
                console.log(error);

            }
        }
        getAllPublsihedBlogs()
    }, [])

    return (
        <div className='bg-gray-100 dark:bg-gray-800 pb-10'>
            <div className='max-w-6xl mx-auto  flex flex-col space-y-4 items-center'>
                <h1 className='text-4xl font-bold pt-10 '>Recent Blogs</h1>
                <hr className=' w-24 text-center border-2 border-red-500 rounded-full' />
            </div>
            <div className='max-w-7xl mx-auto flex gap-6'>
                <div>
                    <div className='mt-10 px-4 md:px-0'>
                        {
                            blog?.slice(0, 4)?.map((blog, index) => {
                                return <BlogCardList key={index} blog={blog} />
                            })
                        }
                    </div>

                </div>
                <div className='bg-white hidden md:block dark:bg-gray-700 w-[350px] p-5 rounded-md mt-10'>
                    <h1 className='text-2xl font-semibold'>Popular categories</h1>
                    <div className='my-5 flex flex-wrap gap-3'>
                        {
                            tags.map((item, index) => {
                                return <Badge onClick={() => navigate(`/search?q=${item.category}`)} key={index} className="cursor-pointer">{item.category}</Badge>
                            })
                        }
                    </div>
                    <h1 className='text-xl font-semibold '>Subscribe to Newsletter</h1>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Get the latest posts and updates delivered straight to your inbox.</p>
                    <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mt-5">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="flex h-10 w-full rounded-md border bg-gray-200 dark:bg-gray-800 px-3 py-2 text-sm  text-gray-300"
                        />
                        <Button>Subscribe</Button>
                    </div>
                    <div className='mt-7'>
                        <h2 className="text-xl font-semibold mb-3">Suggested Blogs</h2>
                        <ul className="space-y-3">
                            {[
                                '10 Tips to Master React',
                                'Understanding Tailwind CSS',
                                'Improve SEO in 2024',
                            ].map((title, idx) => (
                                <li
                                    key={idx}
                                    className="text-sm dark:text-gray-100  hover:underline cursor-pointer"
                                >
                                    {title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
            </div>
           
        </div>
    )
}

export default RecentBlog