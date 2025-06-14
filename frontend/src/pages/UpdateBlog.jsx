import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useRef, useState } from 'react'
import JoditEditor from 'jodit-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store'
import { setLoading } from '@/redux/authSlice'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { setBlog } from '@/redux/blogSlice'

export default function UpdateBlog() {
    const editor = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const id = params.blogId;
    const { blog, loading } = useSelector(store => store.blog);
    const selectBlog = blog.find(blog => blog._id === id) || {};
    const [published, setPublished] = useState(false);


    const [content, seContent] = useState(selectBlog.description || '');
    const [previewThumbnail, setPreviewThumbnail] = useState(selectBlog?.thumbnail || '');

    const [blogData, setBlogData] = useState({
        title: selectBlog?.title || '',
        subtitle: selectBlog?.subtitle || '',
        description: content,
        category: selectBlog?.category || ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    const selectCategory = (value) => {
        setBlogData({ ...blogData, category: value })
    }

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setBlogData({ ...blogData, thumbnail: file })
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result)
            fileReader.readAsDataURL(file);
        }
    }

    const updateBlogHandler = async () => {
        const formData = new FormData();
        formData.append('title', blogData.title);
        formData.append('subtitle', blogData.subtitle);
        formData.append('description', content);
        formData.append('category', blogData.category);
        formData.append('file', blogData.thumbnail);
        try {
            dispatch(setLoading(true));
            const res = await axios.put(`https://blog-dqxu.onrender.com/blog/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })
            if (res.data.success) {
                toast.success(res.data.message);
                console.log(blogData);

            }
        } catch (err) {
            console.log(err);
            toast.error(res.data.message);

        } finally {
            dispatch(setLoading(false));
        }
    }

    const togglePublishUnpublish = async (action) => {
        try {
            const res = await axios.patch(
                `https://blog-dqxu.onrender.com/blog/${id}`,
                { isPublished: action === "true" }, // send correct value
                {
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                setPublished(prev => !prev);
                toast.success(res.data.message);
                navigate(`/dashboard/your-blog`);
            } else {
                toast.error("Failed to update");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error publishing blog");
        }
    };


    const deleteBlog = async (id) => {
        try {
            const res = await axios.delete(`https://blog-dqxu.onrender.com/blog/delete/${id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id);
                dispatch(setBlog(updatedBlogData))
                toast.success(res.data.message)
                navigate('/dashboard/your-blog')
            }

        } catch (err) {
            console.log(err);
            toast.error("Something  went wrong");

        }

    }




    return (
        <div className='pb-10 px-3 pt-20 md:ml-[320px]' >
            <div className='mt-8 max-w-6xl mx-auto'>
                <Card className='w-full bg-white dark:bg-gray-800 p-5 space-y-2'>
                    <h1 className='text-2xl font-bold'>Basic Blog Information</h1>
                    <p className='text-md text-gray-500 mt-[-20px]'>Make changes to your blog here. Click publish when you are done.</p>
                    <div className='space-x-2 mt-[-20px]'>
                        <Button
                            className='cursor-pointer'
                            onClick={() => togglePublishUnpublish(selectBlog.isPublished ? "false" : "true")}
                        >
                            {selectBlog?.isPublished ? "UnPublish" : "Publish"}
                        </Button>

                        <Button className='cursor-pointer' variant="destructive" onClick={() => deleteBlog(selectBlog._id)}
                        >Remove Blog</Button>

                    </div>
                    <div className='mt-[-10px]'>
                        <Label>Title</Label>
                        <Input
                            type='text'
                            name='title'
                            placeholder='Enter Your Blog Title'
                            className='bg-white dark:bg-gray-700 my-4 w-1/2'
                            value={blogData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='mt-[-20px]'>
                        <Label>Sub Title</Label>
                        <Input
                            type='text'
                            name='subtitle'
                            placeholder='Enter Your Blog Sub Title'
                            className='bg-white dark:bg-gray-700 mt-3 w-1/2'
                            value={blogData.subtitle}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <JoditEditor
                            ref={editor}
                            // value={content}
                            // config={config}
                            tabIndex={1} // tabIndex of textarea
                            // onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                            // onChange={newContent => { }}
                            className='jodit_toolbar mt-5 '
                            value={content}
                            onChange={newContent => seContent(newContent)}
                        />
                    </div>

                    <div className='mb-5'>
                        <Label className='mb-3'>Category</Label>
                        <Select value={blogData.category} onValueChange={selectCategory}>
                            <SelectTrigger className="w-[180px] ">
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

                    <div>
                        <Label className='mb-3'>Thumbnail</Label>
                        <Input
                            type='file'
                            id='file'
                            name='file'
                            accept='image/*'
                            className='w-fit dark:border-gray-300'
                            onChange={selectThumbnail}
                        />
                        {
                            previewThumbnail && (
                                <img src={previewThumbnail} className='w-64 my-2' alt="Blog thumbnail" />
                            )
                        }
                    </div>

                    <div className='flex gap-3'>
                        <Button variant='outline' onClick={() => navigate(-1)} className='cursor-pointer'>Back</Button>
                        <Button className='cursor-pointer' onClick={updateBlogHandler}>
                            {
                                loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Please Wait
                                    </>
                                ) : "Save"
                            }
                        </Button>
                    </div>
                </Card>
            </div>


        </div>
    )
}
