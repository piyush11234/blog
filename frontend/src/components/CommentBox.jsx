import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Edit, LucideSend, Trash2 } from 'lucide-react';
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { LuSend } from "react-icons/lu";
import { BsThreeDots } from 'react-icons/bs';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setComment } from '@/redux/commentSlice';
import { setBlog } from '@/redux/blogSlice';

export default function CommentBox({ selectedBlog }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { comment } = useSelector(state => state.comment);
  const { blog } = useSelector(state => state.blog);

  const [content, setContent] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  // Organize comments into a tree structure
  const organizeComments = (comments) => {
    const map = new Map();
    const topLevel = [];

    comments.forEach(comment => {
      map.set(comment._id, { ...comment, replies: [] });
    });

    comments.forEach(comment => {
      if (comment.parentId) {
        const parent = map.get(comment.parentId);
        if (parent) parent.replies.push(map.get(comment._id));
      } else {
        topLevel.push(map.get(comment._id));
      }
    });

    return topLevel;
  };

  const handleCommentSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) return toast.error("Please write some text");

    try {
      const res = await axios.post(
        `https://blog-dqxu.onrender.com/comment/${selectedBlog._id}/create`,
        { content: trimmed },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (res.data.success) {
        fetchAllComments();
        setContent('');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment");
    }
  };

  const handleReplySubmit = async (parentId) => {
    const trimmed = replyText.trim();
    if (!trimmed) return toast.error("Please write some text");

    try {
      const res = await axios.post(
        `https://blog-dqxu.onrender.com/comment/${selectedBlog._id}/create`,
        { content: trimmed, parentId },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (res.data.success) {
        fetchAllComments();
        setActiveReplyId(null);
        setReplyText('');
        toast.success("Reply posted");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reply");
    }
  };

  const handleLike = async (commentId) => {
    try {
      const res = await axios.get(
        `https://blog-dqxu.onrender.com/comment/${commentId}/like`,
        { withCredentials: true }
      );

      if (res.data.success) {
        fetchAllComments(); // re-fetch to update likes
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error liking comment", error);
      toast.error("Something went wrong");
    }
  };

  const handleEdit = async (commentId) => {
    const trimmed = editedContent.trim();
    if (!trimmed) return toast.error("Please write some text");

    try {
      const res = await axios.put(
        `https://blog-dqxu.onrender.com/comment/${commentId}/edit`,
        { content: trimmed },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (res.data.success) {
        fetchAllComments();
        setEditingCommentId(null);
        setEditedContent('');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to edit comment");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const res = await axios.delete(`https://blog-dqxu.onrender.com/comment/${commentId}/delete`, {
        withCredentials: true
      });

      if (res.data.success) {
        fetchAllComments();
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment");
    }
  };

  const fetchAllComments = async () => {
    try {
      const res = await axios.get(`https://blog-dqxu.onrender.com/comment/${selectedBlog._id}/comment/all`);
      dispatch(setComment(res.data.comments));
    } catch (error) {
      console.error("Failed to load comments", error);
    }
  };

  useEffect(() => {
    fetchAllComments();
  }, [selectedBlog._id]);

  const getWeekday = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const renderComment = (c, level = 0) => (
    <div key={c._id} className={`ml-${level * 6} mb-4`}>
      <div className='flex items-start justify-between'>
        <div className='flex gap-3'>
          <Avatar>
            <AvatarImage src={c?.userId?.profilePicture || '/default-profile.png'} />
            <AvatarFallback>{c?.userId?.fname?.[0]?.toUpperCase() || "?"}</AvatarFallback>
          </Avatar>
          <div className='space-y-1'>
            <h1 className='font-semibold'>
              {c?.userId?.fname} {c?.userId?.lname}
              <span className='text-sm ml-2 font-light'>{getWeekday(c?.createdAt)}</span>
            </h1>
            {editingCommentId === c._id ? (
              <>
                <Textarea
                  autoFocus
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(c._id)}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                </div>
              </>
            ) : (
              <p>{c?.content}</p>
            )}

            <div className='flex gap-5 items-center text-sm mt-1'>
              <div className='flex items-center gap-1 cursor-pointer' onClick={() => handleLike(c._id)}>
                {c?.likes?.includes(user._id) ? <FaHeart fill='red' /> : <FaRegHeart />}
                <span>{c?.numberOfLikes || 0}</span>
              </div>
              <p className='cursor-pointer' onClick={() => {
                setActiveReplyId(c._id);
                setReplyText('');
              }}>Reply</p>
            </div>
          </div>
        </div>

        {user._id === c?.userId?._id && (
          <DropdownMenu>
            <DropdownMenuTrigger><BsThreeDots /></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {
                setEditingCommentId(c._id);
                setEditedContent(c.content);
              }}>
                <Edit className='mr-2' /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(c._id)}>
                <Trash2 className='mr-2' /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {activeReplyId === c._id && (
        <div className='flex gap-3 mt-2 px-8'>
          <Textarea
            placeholder="Reply here..."
            value={replyText}
            autoFocus
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Button onClick={() => handleReplySubmit(c._id)}><LuSend /></Button>
        </div>
      )}

      {/* Render nested replies */}
      {c.replies && c.replies.map(reply => renderComment(reply, level + 1))}
    </div>
  );

  if (!user?._id) return null;

  return (
    <div>
      <div className='flex gap-4 mb-4 items-center'>
        <Avatar>
          <AvatarImage src={user.profilePicture || '/default-profile.png'} />
          <AvatarFallback>{user.fname?.[0]?.toUpperCase() || "?"}</AvatarFallback>
        </Avatar>
        <h3 className='font-semibold'>{user.fname} {user.lname}</h3>
      </div>

      <div className='flex gap-3'>
        <Textarea
          placeholder="Leave a comment"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
        <Button onClick={handleCommentSubmit}><LucideSend /></Button>
      </div>

      {comment.length > 0 && (
        <div className='mt-7 p-5 rounded-md bg-gray-100 dark:bg-gray-800'>
          {organizeComments(comment).map(c => renderComment(c))}
        </div>
      )}
    </div>
  );
}
