import Blog from "../models/blog.models.js";
import Comment from "../models/comment.models.js";


// Create Comment
export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentUserId = req.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: 'Comment content is required',
        success: false
      });
    }

    const blog = await Blog.findById(postId);
    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found',
        success: false
      });
    }

    const comment = await Comment.create({
      content,
      userId: commentUserId,
      postId: postId
    });

    await comment.populate({
      path: 'userId',
      select: 'fname lname profilePicture'
    });

    blog.comments.push(comment._id);
    await blog.save();

    return res.status(201).json({
      message: 'Comment added successfully',
      comment,
      success: true
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creating comment', success: false });
  }
}


export const getCommentsOfPost = async (req, res) => {
  try {
    const blogId = req.params.id;
    const comments = await Comment.find({ postId: blogId }).populate({ path: 'userId', select: 'fname lname profilePicture' }).sort({ createdAt: -1 })

    if (!comments) return res.status(404).json({ message: 'No comments found for this blog', success: false })
    return res.status(200).json({
      success: true, comments
    })
  } catch (error) {
    console.log(error);

  }
}


export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const authorId = req.id
    const comment = await Comment.findById(commentId);
    console.log(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    if (comment.userId.toString() !== authorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment' });
    }

    const blogId = comment.postId;

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    // Remove comment ID from blog's comments array
    await Blog.findByIdAndUpdate(blogId, {
      $pull: { comments: commentId }
    });

    res.status(200).json({ success: true, message: 'Comment deleted Successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting comment", error: error.message });

  }
}


export const editComment = async (req, res) => {
  try {
    const userId = req.id;
    const { content } = req.body;
    const commentId = req.params.id;

    if (!content || content.trim() === "") {
      return res.status(400).json({ success: false, message: 'Comment content cannot be empty' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check if the logged-in user is the owner
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this comment' });
    }

    comment.content = content.trim();
    comment.editedAt = new Date();

    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      comment
    });

  } catch (error) {
    console.error("Edit Comment Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to edit comment",
      error: error.message
    });
  }
};


export const likeComment = async (req, res) => {
  try {
    const userId = req.id;
    const commentId = req.params.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const alreadyLiked = comment.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      // Unlike the comment
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
      comment.numberOfLikes = Math.max(0, comment.numberOfLikes - 1); // Prevent negative count
    } else {
      // Like the comment
      comment.likes.push(userId);
      comment.numberOfLikes += 1;
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Comment unliked" : "Comment liked",
      updatedComment: {
        _id: comment._id,
        content: comment.content,
        likesCount: comment.numberOfLikes,
        likedBy: comment.likes,
      },
    });

  } catch (error) {
    console.error("Error in likeComment:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while liking/unliking the comment",
      error: error.message,
    });
  }
};


export const getAllCommentsOnMyBlogs = async (req, res) => {
  try {
    const userId = req.id; // From auth middleware

    // Step 1: Get IDs of all blogs authored by the user
    const myBlogs = await Blog.find({ author: userId }).select("_id");
    const blogIds = myBlogs.map(blog => blog._id);

    if (blogIds.length === 0) {
      return res.status(200).json({
        success: true,
        totalComments: 0,
        comments: [],
        message: "You haven't posted any blogs yet.",
      });
    }

    // Step 2: Fetch comments on those blogs
    const comments = await Comment.find({ postId: { $in: blogIds } })
      .populate("userId", "fname lname email profilePicture") // fixed field names
      .populate("postId", "title")
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
      success: true,
      totalComments: comments.length,
      comments,
    });

  } catch (error) {
    console.error("Error fetching comments on user's blogs:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving comments.",
      error: error.message,
    });
  }
};
