'use strict';

const express = require('express'),
  router = express.Router();

const {
  getAllBlogs, 
  getBlog, 
  createBlog, 
  updateBlog, 
  deleteBlog,
} = require('../controllers/blogs');

router.route('/').post(createBlog).get(getAllBlogs);
router.route('/:id').get(getBlog).delete(deleteBlog).patch(updateBlog);

module.exports = router;