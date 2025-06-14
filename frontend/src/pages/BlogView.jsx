import store from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Bookmark, MessageSquare, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { setBlog } from '@/redux/blogSlice';
import CommentBox from '@/components/CommentBox';


export default function BlogView() {
    const params = useParams();
    const dispatch = useDispatch();
    const blogId = params.blogId;
    const { blog } = useSelector(store => store.blog);
    const { user } = useSelector(store => store.auth)
    const { comment } = useSelector(store => store.comment)
    const selectedBlog = blog.find(blog => blog._id === blogId)
    const [blogLike, setBlogLike] = useState(selectedBlog.likes.length);
    const [liked, setLiked] = useState(selectedBlog.likes.includes(user._id) || false)
    console.log(selectedBlog);

    const changeTimeFormat = (isoDate) => {
        const date = new Date(isoDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        return formattedDate
    }

    const handleShare = (blogId) => {
        const blogUrl = `${window.location.origin}/blogs/${blogId}`;

        if (navigator.share) {
            navigator
                .share({
                    title: 'Check out this blog!',
                    text: 'Read this amazing blog post.',
                    url: blogUrl,
                })
                .then(() => console.log('Shared successfully'))
                .catch((err) => console.error('Error sharing:', err));
        } else {
            // fallback: copy to clipboard
            navigator.clipboard.writeText(blogUrl).then(() => {
                toast.success('Blog link copied to clipboard!');
            });
        }
    };
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // like dislike handler
    const likeOrDislikeHandler = async () => {
        try {
            const actions = liked ? 'dislike' : 'like'
            const res = await axios.get(`https://blog-dqxu.onrender.com/api/blog/${selectedBlog._id}/${actions}`, { withCredentials: true })

            if (res.data.success) {
                const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
                setBlogLike(updatedLikes);
                setLiked(!liked)

                //apne blog ko update krunga
                const updatedBlogData = blog.map(p =>
                    p._id === selectedBlog._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                )
                toast.success(res.data.message);
                dispatch(setBlog(updatedBlogData))
            }

        } catch (err) {
            console.log(err);

            toast.error(err.response.data.message)
        }
    }

    return (
        <div className='pt-14'>
            <div className='max-w-6xl mx-auto p-10'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to={'/'}>Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to={'/blogs'}>Blogs</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {/* blog header  */}
                <div className='my-8'>
                    <h1 className='font-bold text-4xl mb-4 tracking-tight'>{selectedBlog.title}</h1>
                    <div className='flex items-center justify-between gap-4 flex-wrap'>
                        <div className='flex items-center space-x-4'>
            
                            <Avatar>
                                <AvatarImage
                                    src={selectedBlog.author?.profilePicture || '/default-profile.png'}
                                    alt={`${selectedBlog.author?.fname || ''} ${selectedBlog.author?.lname || ''}`}
                                />
                                <AvatarFallback>
                                    {selectedBlog.author?.fname?.charAt(0).toUpperCase() || "?"}
                                </AvatarFallback>
                            </Avatar>



                            <div>
                                <p className='font-medium'>{selectedBlog.author.fname} {selectedBlog.author.lname}</p>
                                <p className='text-sm text-muted-foreground'>{selectedBlog.author.occupation}</p>
                            </div>

                        </div>
                        <div className="text-sm text-muted-foreground">Published on {changeTimeFormat(selectedBlog.createdAt)} • 8 min read</div>
                    </div>
                </div>
                {/* thumbnail image  */}
                <div className='mb-8 rounded-md overflow-hidden '>
                    <img src={selectedBlog.thumbnail} alt="thumbnail" width={1100} height={500} className='w-full object-cover' />
                </div>
                {/* subtitle  */}
                <div className='mt-[-20px]'>
                    <p className='text-md text-muted-foreground italic'>{selectedBlog.subtitle}</p>
                </div>
                {/* descripction  */}
                <div className='mt-5'>
                    <p className='' dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />
                </div>

                <div className='mt-10'>
                    <div className='flex flex-wrap gap-2 mb-8'>
                        <Badge variant="secondary">Next.js</Badge>
                        <Badge variant="secondary">React</Badge>
                        <Badge variant="secondary">Web Development</Badge>
                        <Badge variant="secondary">JavaScript</Badge>
                    </div>
                </div>
                {/* engagement  */}
                <div className="flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8">
                    <div className="flex items-center space-x-4">
                        <Button onClick={likeOrDislikeHandler} variant="ghost" size="sm" className="flex items-center gap-1">
                            {/* <Heart className="h-4 w-4"/> */}
                            {
                                liked ? <FaHeart size={'24'} className='cursor-pointer text-red-600' /> : <FaRegHeart size={'24'} className='cursor-pointer hover:text-gray-600 text-black dark:text-white' />
                            }

                            <span>{blogLike}</span>
                        </Button>
                        <Button variant='ghost'><MessageSquare className='h-4 w-4' /><span>  comments</span></Button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant='ghost'> <Bookmark className='w-4 h-4' /> </Button>
                        <Button variant='ghost' onClick={() => handleShare(selectedBlog._id)} > <Share2 className='w-4 h-4' /> </Button>
                    </div>
                </div>
                <CommentBox selectedBlog={selectedBlog} />
            </div>
        </div>
    )
}
