import { Card } from '@/components/ui/card'
import React, { useEffect } from 'react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setBlog } from '@/redux/blogSlice'
import store from '@/redux/store'
import { BsThreeDotsVertical } from "react-icons/bs";
import { EditIcon, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'


export default function YourBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog } = useSelector(store => store.blog)
  console.log(blog);


  const getOwnBlogs = async () => {
    try {
      const res = await axios.get('https://blog-dqxu.onrender.com/api/blog/get-own-blogs', { withCredentials: true })
      if (res.data.success) {
        dispatch(setBlog(res.data.blogs))

      }

    } catch (err) {
      console.log(err)

    }
  }

  const deleteBlog = async (id) => {
    try {
      const res = await axios.delete(`https://blog-dqxu.onrender.com/api/blog/delete/${id}`, { withCredentials: true })

      const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id);
      dispatch(setBlog(updatedBlogData))
      toast.success(res.data.message);

    } catch (err) {
      console.log(err);
      toast.error("Something  went wrong");

    }
    // console.log(id);

  }


  useEffect(() => {
    getOwnBlogs();
  }, [])

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  return (
    <div className='pb-10 pt-20 md:ml-[320px] min-h-screen'>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className='w-full p-5 space-y-2 dark:bg-gray-800 '>
          {/* <div className="w-full min-w-[600px] "> */}
          <Table className='overflow-x-auto'>
            <TableCaption>A list of your recent blogs.</TableCaption>
            <TableHeader className='overflow-x-auto'>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='overflow-x-auto'>
              {blog.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No blogs found.
                  </TableCell>
                </TableRow>
              ) : (
                blog.map((item) => (
                  <TableRow key={item._id} className='overflow-x-auto'>
                    <TableCell className="flex flex-col md:flex-row gap-4 items-start md:items-center overflow-x-auto">
                      <img src={item.thumbnail} className="w-full max-w-[100px] rounded-md hidden sm:block" alt="Thumbnail" />
                      <h1
                        onClick={() => navigate(`/blogs/${item._id}`)}
                        className="hover:underline cursor-pointer break-words truncate max-w-[70px] sm:max-w-[150px] md:max-w-[300px] lg:max-w-[500px] xl:max-w-full"
                      >
                        {item.title}
                      </h1>

                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer"><BsThreeDotsVertical /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/write-blog/${item._id}`)}>
                            <EditIcon className="mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteBlog(item._id)} className="text-red-600">
                            <Trash2 className="mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* </div> */}
        </Card>
      </div>
    </div>

  )
}
