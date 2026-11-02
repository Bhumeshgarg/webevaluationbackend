import mongoose from 'mongoose';
import Post from '../models/post.model.js';

/**
 * Helper to check valid MongoDB ObjectId
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc    Create a new post (CRUD: CREATE)
 * @route   POST /api/posts
 * @access  Public
 */
export const createPost = async (req, res) => {
  try {
    const { title, content, author, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and content for the post.',
      });
    }

    const newPost = await Post.create({
      title,
      content,
      author: author || 'Anonymous',
      category: category || 'General',
    });

    return res.status(201).json({
      success: true,
      message: 'Post created successfully!',
      post: newPost,
    });
  } catch (error) {
    console.error('Error in createPost:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating post.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all posts (CRUD: READ ALL)
 * @route   GET /api/posts
 * @access  Public
 */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error('Error in getAllPosts:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching posts.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get a single post by ID (CRUD: READ ONE)
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid post ID format: '${id}'`,
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error in getPostById:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching post.',
      error: error.message,
    });
  }
};

/**
 * @desc    Update a post by ID (CRUD: UPDATE)
 * @route   PUT /api/posts/:id
 * @access  Public
 */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author, category } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid post ID format: '${id}'`,
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, author, category },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: `Post with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully!',
      post: updatedPost,
    });
  } catch (error) {
    console.error('Error in updatePost:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating post.',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a post by ID (CRUD: DELETE)
 * @route   DELETE /api/posts/:id
 * @access  Public
 */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid post ID format: '${id}'`,
      });
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: `Post with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Post '${deletedPost.title}' deleted successfully!`,
      deletedPostId: id,
    });
  } catch (error) {
    console.error('Error in deletePost:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting post.',
      error: error.message,
    });
  }
};
