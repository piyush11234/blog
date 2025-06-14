const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/isAuth.js');
const { createComment, deleteComment, editComment, getCommentsOfPost, likeComment, getAllCommentsOnMyBlogs } = require('../controllers/comment.controller.js');

router.post('/:id/create', isAuth, createComment);
router.delete("/:id/delete", isAuth, deleteComment);
router.put("/:id/edit", isAuth, editComment);
router.route("/:id/comment/all").get(getCommentsOfPost);
router.get('/:id/like', isAuth, likeComment);
router.get('/my-blogs/comments', isAuth, getAllCommentsOnMyBlogs)

module.exports=router;
