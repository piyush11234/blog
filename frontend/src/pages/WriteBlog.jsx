import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setBlog } from '@/redux/blogSlice'
import store from '@/redux/store'
import { toast } from 'sonner'
import { setLoading } from '@/redux/authSlice'

export default function WriteBlog() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog, loading } = useSelector(store => store.blog);

  const getSelectedCategory = (value) => {
    setCategory(value)
  }

  const createBlogHandler = async () => {
    try {
      dispatch(setLoading(true))
      const res = await axios.post('https://blog-dqxu.onrender.com/api/blog/', { title, category }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      if (res.data.success) {
        dispatch(setBlog([...(Array.isArray(blog) ? blog : []), res.data.blog]));
        toast.success(res.data.message)
        navigate(`/dashboard/write-blog/${res.data.blog._id}`)

      } else { 
        toast.error("Something went wrong...");
      }


    } catch (err) {
      console.log(err);
      toast.error("Failed to create blog. Please try again.");

    }
    finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className='p-4 md:pr-20 h-screen md:ml-[320px] pt-20'>
      <Card className='p-4 md:p-10 dark:bg-gray-800'>
        <h1 className='text-2xl font-bold'>Let's create blog</h1>
        <p className="text-md text-gray-500 mt-[-20px]">
          Ready to share your thoughts? Start by entering your blog details below.
        </p>
        <div className='mt-5'>
          <div>
            <Label>Title</Label>
            <Input
              type='text'
              name='title'
              placeholder='Enter Your Blog Title'
              className='bg-white dark:bg-gray-700 my-5 w-full md:w-1/2'
              value={title}
              onChange={(e) => setTitle(e.target.value)}

            />
          </div>
          <div className='mb-5'>
            <Label className='mb-3'>Category</Label>
            <Select value={category} onValueChange={getSelectedCategory}>
              <SelectTrigger className="w-[200px] ">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                <SelectItem value="Blogging">Blogging</SelectItem>
                <SelectItem value="Photography">Photography</SelectItem>
                <SelectItem value="Cooking">Cooking</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex gap-3'>
            <Button disabled={loading} type="button" onClick={createBlogHandler} className='cursor-pointer'>
              {
                loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please Wait
                  </>
                ) : "Create"
              }
            </Button>
          </div>
        </div>

      </Card>
    </div>
  )
}
