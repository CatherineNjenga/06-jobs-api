'use strict';

const mongoose = require('mongoose');
const BlogSchema = mongoose.Schema({
  category: {
    type: String,
    enum: ['career', 'personal', 'book review', 'course review'],
    default: 'career',
  },
  title: {
    type: String,
    required: [true, 'Please provide blog title'],
    maxLength: 200,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  writtenBy: {
    type: String,
    // default the blog owner
    // default: this.createdBy,
    required: [true, 'Please provide blog writer'],
  },
  blogPost: {
    type: String,
    required: [true, 'Please provide blog write up'],
  },
  comments: {
    type: Number,
    default: 'No comments',
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
}, {timestamps: true})

module.exports = mongoose.model('Blog', BlogSchema);