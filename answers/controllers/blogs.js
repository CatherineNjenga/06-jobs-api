'use strict';
const Blog = require('../models/Blog');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');

const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({createdBy: req.user.userId}).sort('createdAt')
  res.status(StatusCodes.OK).json({ blogs, count: blogs.length });
};

const getBlog = async (req, res) => {
  const { 
    user: {userId}, 
    params: {id: blogId} 
  } = req;
  const blog = await Blog.findOne({
    _id: blogId, createdBy: userId
  });
  if (!blog) {
    throw new NotFoundError(`No blog with id ${blogId}`);
  }
  res.status(StatusCodes.OK).json({blog});
  // res.send('get blog');
};

const createBlog = async (req, res) => {
  // res.send('create blog');
  req.body.createdBy = req.user.userId;
  const blog = await Blog.create(req.body);
  res.status(StatusCodes.CREATED).json({ blog });
};

const updateBlog = async (req, res) => {
  const {
    body: { category, title, blogPost }, 
    user: {userId}, 
    params: {id: blogId} 
  } = req;

  if (category === '' || title === '' || blogPost === '') {
    throw new BadRequestError('Category, title or blogpost fields cannot be empty.');
  }

  const blog = await Blog.findOneAndUpdate(
    {_id: blogId, createdBy: userId}, 
    req.body, 
    { new: true, runValidators: true }
  );

  if (!blog) {
    throw new NotFoundError(`No blog with id ${blogId}`);
  }
  res.status(StatusCodes.OK).json({blog});

  // res.send('update blog');
};

const deleteBlog = async (req, res) => {
  const { 
    user: {userId}, 
    params: {id: blogId} 
  } = req;

  const blog = await Blog.findOneAndDelete({
    _id: blogId,
    createdBy: userId,
  });

  if (!blog) {
    throw new NotFoundError(`No blog with id ${blogId}`);
  }
  res.status(StatusCodes.OK).end();

  // res.send('delete blog');
};

module.exports = {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};