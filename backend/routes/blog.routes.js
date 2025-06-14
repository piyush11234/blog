const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/isAuth.js');
const { createBlog, updateBlog, getOwnBlog, deleteBlog, likeBlog, dislikeBlog, getMyTotalBlogLikes, getPublishedBlog, togglePublishBlog } = require('../controllers/blog.controller.js');
const { singleUpload } = require('../middleware/multer.js');

router.post('/', isAuth, createBlog);
router.put('/:blogId', isAuth, singleUpload, updateBlog);
router.get('/get-own-blogs', isAuth, getOwnBlog);
router.delete('/delete/:id', isAuth, deleteBlog);
router.get('/my-blog-likes', isAuth, getMyTotalBlogLikes);
router.get('/get-published-blogs', getPublishedBlog);
router.get('/:id/like', isAuth, likeBlog);
router.get('/:id/dislike', isAuth, dislikeBlog);

router.patch('/:blogId',isAuth, togglePublishBlog);

module.exports = router;
