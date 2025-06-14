import Blog from "../models/blog.models.js";
import { cloudinary } from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const createBlog = async (req, res) => {
    try {
        const { title, category } = req.body;
        if (!title || !category) {
            return res.status(400).json({
                message: 'Blog Title and Category is required',
                success: false
            })
        }

        //create
        const blog = await Blog.create({
            title,
            category,
            author: req.id
        })
        // Populate the author field with email, fname, etc.
        await blog.populate({
            path: 'author',
            select: 'fname lname email profilePicture'
        });

        return res.status(201).json({
            message: 'Blog created successfully',
            success: true,
            blog
        })


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Failed to create blog',
            success: false
        })

    }
}

export const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId
        const { title, subtitle, description, category } = req.body;
        const file = req.file;

        let blog = await Blog.findById(blogId)
        if (!blog) {
            return res.status(404).json({
                message: 'Blog not found'
            })
        }
        let thumbnail;
        if (file) {
            const fileUri = getDataUri(file)
            thumbnail = await cloudinary.uploader.upload(fileUri);
        }

        //update
        const updateData = { title, subtitle, description, category, author: req.id, thumbnail: thumbnail?.secure_url }
        blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true })

        await blog.populate({
            path: 'author',
            select: 'fname lname email profilePicture'
        });

        return res.status(200).json({
            message: 'Blog Update Successfully',
            success: true,
            blog
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error! Failed to updating blog",
            success: false
        })


    }
}


// export const getOwnBlog = async (req, res) => {
//     try {
//         const userId = req.id;
//         if (!userId) {
//             return res.status(400).json({
//                 message: 'UserId is required'
//             })
//         }

//         const blogs = await Blog.find({ author: userId }).populate({
//             path: 'author',
//             select: 'fname lname profilePicture'
//         })
//         if (!blogs) {
//             return res.status(404).json({
//                 message: 'No blog found',
//                 blogs: [],
//                 success: false
//             })
//         }
//         return res.status(200).json({
//             blogs,
//             success: true
//         })

//     } catch (err) {
//         return res.status(500).json({
//             message: 'Error Fetching blog',
//             error: err.message,
//             success: false
//         })
//     }
// }

export const getOwnBlog = async (req, res) => {
    try {
        const userId = req.id;
        if (!userId) {
            return res.status(400).json({
                message: 'UserId is required'
            });
        }

        const blogs = await Blog.find({ author: userId }).populate({
            path: 'author',
            select: 'fname lname email profilePicture'
        });

        if (blogs.length === 0) {
            return res.status(404).json({
                message: 'No blog found',
                blogs: [],
                success: false
            });
        }

        return res.status(200).json({
            blogs,
            success: true
        });

    } catch (err) {
        return res.status(500).json({
            message: 'Error Fetching blog',
            error: err.message,
            success: false
        });
    }
};


export const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const authorId = req.id;
        const blog = await Blog.findById(blogId)
        if (!blog) {
            return res.status(404).json({
                message: 'Blog not found',
                success: false
            })
        }
        if (blog.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized to delete this blog',
                success: false
            })
        }

        //delete
        await Blog.findByIdAndDelete(blogId)

        return res.status(200).json({
            message: 'Blog deleted successfully',
            success: true
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Failed to delete blog',
            success: false
        })


    }
}

export const getPublishedBlog = async (_, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'fname lname email profilePicture '
        })
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No published blogs found'
            });
        }
        return res.status(200).json({
            success: true,
            blogs
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'failed to publish blog',
            error: err.message,
        })
    }
}

export const togglePublishBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const authorId = req.id;
        const { publish } = req.query;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        blog.isPublished = !blog.isPublished;
        await blog.save();

        if (blog.author.toString() !== authorId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update publish status'
            });
        }

        return res.status(200).json({
            success: true,
            message: `Blog ${blog.isPublished ? 'published' : 'unpublished'} successfully`,
            blog
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to toggle publish status',
            error: err.message
        });
    }
}


export const likeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.id;

        const blog = await Blog.findById(blogId).populate('likes');

        if (!blog) {
            return res.status(404).json({
                message: 'Blog not found',
                success: false
            });
        }

        // Check if already liked
        const alreadyLiked = blog.likes.some(user => user._id.toString() === userId);

        if (alreadyLiked) {
            return res.status(400).json({
                message: 'You have already liked this blog',
                success: false
            });
        }

        // Add to likes
        await Blog.findByIdAndUpdate(blogId, {
            $addToSet: { likes: userId }
        });

        const updatedBlog = await Blog.findById(blogId).populate('likes');

        return res.status(200).json({
            message: 'Blog liked',
            blog: updatedBlog,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong while liking the blog',
            success: false,
            error: error.message
        });
    }
};



export const dislikeBlog = async (req, res) => {
    try {
        const userId = req.id;
        const blogId = req.params.id;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                message: 'Blog not found',
                success: false
            });
        }

        // Dislike logic - remove userId from likes array
        await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: userId }
        });

        const updatedBlog = await Blog.findById(blogId).populate('likes');

        return res.status(200).json({
            message: 'Blog disliked',
            success: true,
            blog: updatedBlog
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Failed to dislike blog',
            success: false,
            error: error.message
        });
    }
};

export const getMyTotalBlogLikes = async (req, res) => {
    try {
        const userId = req.id; // assuming you use authentication middleware

        // Step 1: Find all blogs authored by the logged-in user
        const myBlogs = await Blog.find({ author: userId }).select("likes");

        // Step 2: Sum up the total likes
        const totalLikes = myBlogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0);

        res.status(200).json({
            success: true,
            totalBlogs: myBlogs.length,
            totalLikes,
        });
    } catch (error) {
        console.error("Error getting total blog likes:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch total blog likes",
        });
    }
};
